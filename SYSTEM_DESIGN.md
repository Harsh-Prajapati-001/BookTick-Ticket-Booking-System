# System Design: High-Concurrency Ticket Booking System

## 1. Concurrency Prevention & Atomic Seat Holds

In high-demand ticketing systems, the most critical failure mode is the "double-booking" anomaly—two users attempting to purchase the same seat simultaneously. 

To solve this, our system treats each seat within a show as an independent, single-owner resource (a mutex). We utilize MongoDB's single-document atomicity to perform a **Compare-And-Swap (CAS)** operation. 

Instead of reading a seat's status, checking if it's available in application code, and then writing a new status (which creates a race condition), we use a single `findOneAndUpdate` command. The query filter mandates that the document must currently be `AVAILABLE` (or have an expired hold). If two concurrent requests target the same seat, MongoDB guarantees that exactly one operation will match and update the document, while the second will return `null`, safely rejecting the attempt without data corruption.

### Deadlock Avoidance
When a user selects multiple seats (e.g., 4 tickets), all 4 CAS updates must succeed together. We wrap these operations in a MongoDB multi-document transaction (requiring a replica set). To prevent circular-wait deadlocks—where Transaction A locks Seat 1 and waits for Seat 2, while Transaction B locks Seat 2 and waits for Seat 1—we enforce **Canonical Resource Ordering**. Before executing the database updates, the `seatIds` array is sorted alphanumerically. This guarantees that all concurrent transactions acquire document locks in the exact same order, mathematically eliminating the possibility of deadlocks.

## 2. Seat Hold TTL and Auto-Release Mechanism

When seats are placed into a shopping cart, they are marked as `HELD` and assigned an `expiresAt` timestamp (default: 10 minutes). 

Traditionally, systems rely on a background sweeper (cron job) to routinely flip expired holds back to `AVAILABLE`. However, relying solely on a sweeper introduces a "sweep-race" condition: if a sweeper is delayed, a legitimately expired seat remains unbookable to new customers.

To resolve this, our system **folds the expiry check into the CAS acquiring statement**. 
The update filter looks like this:
```javascript
{
  showId, seatId,
  $or: [
    { status: 'AVAILABLE' },
    { status: 'HELD', expiresAt: { $lt: new Date() } }
  ]
}
```
This "lazy reclaim" ensures that a fresh request can atomically steal an expired seat at the exact moment of acquisition. The background sweeper still runs purely for frontend housekeeping—broadcasting WebSocket events so that idle, expired seats visually turn green on the seat map without requiring a purchase attempt to trigger the release.

## 3. Waitlist Auto-Assignment & Time-Limited Offers

When an event category sells out, users can join a waitlist. The waitlist is modeled as a FIFO (First-In, First-Out) queue in a `WaitlistEntries` collection.

When a booked seat is cancelled, the system must dispatch it to the next eligible waitlisted customer. If multiple cancellations happen simultaneously, naive read-then-write dispatchers might accidentally assign the same waitlisted customer multiple times. 

We solve this using a **Non-blocking Queue Claim Pattern**. We execute an atomic `findOneAndUpdate` with `sort: { joinedAt: 1 }` and a filter for `status: 'WAITING'`. This single operation selects the oldest waiting entry and instantly transitions its status to `OFFERED`, attaching the freed `seatId` and a new `offerExpiresAt` timestamp (e.g., 15 minutes). Because it is a single atomic claim, concurrent dispatchers will naturally grab the 1st, 2nd, and 3rd waiting customers respectively, completely avoiding read-modify-write conflicts.

Once the status is updated to `OFFERED`, the system generates a secure, time-limited JWT claim token and sends an email via Nodemailer containing the checkout link. 

## 4. Time-Limited Offer Handling
If the waitlisted customer completes checkout using their claim token before `offerExpiresAt`, the seat transitions to `BOOKED` and the waitlist entry becomes `CLAIMED`. 

If the customer ignores the email and the offer expires, the seat is not immediately dumped back into the general pool. Instead, a cascading check triggers: the system runs the waitlist dispatch logic again, offering the seat to the next person in line. Only when the waitlist for that specific category is entirely empty does the seat revert to `AVAILABLE` for the general public.

## 5. Seat Map Data Model & Real-Time Updates
The venue seat layout (Rows and Columns) is stored statically once per venue. However, when a `Show` is instantiated, the system generates individual `ShowSeatStatus` documents for every seat. 
This denormalized structure prevents massive SQL-style joins and allows our MongoDB queries to pull the exact live grid in O(1) per seat. 

Real-time synchronization is handled via **Socket.IO**. Whenever a CAS operation (Hold, Book, Release) successfully mutates a `ShowSeatStatus` document, the backend emits a `seat_status_changed` event to the specific `showId` Socket room. Connected React clients receive this targeted payload and patch their local React state, updating the visual seat grid seamlessly within milliseconds without requiring expensive full-page polling.
