# BookTick - Ticket Booking System

A high-concurrency ticket booking platform for movies and concerts, built on the **MERN Stack** (MongoDB, Express, React, Node.js). 

This system features visual seat maps, short-lived seat holds, waitlists with automatic seat assignments on cancellation, and concurrency-safe bookings.

## Setup Guide

### Prerequisites
- Node.js (v18+)
- MongoDB (A replica set like MongoDB Atlas is required for multi-document transactions)

### 1. Database (MongoDB)
This project relies on MongoDB's atomic `findOneAndUpdate` operations and transactions. 
Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and get your connection string.

### 2. Backend Setup (`server/`)
```bash
cd server
npm install
npm run dev
```

### 3. Frontend Setup (`client/`)
```bash
cd client
npm install
npm run dev
```

## Environment Variables (.env)
Create a `.env` file in the `server/` directory based on the `.env.example` file.

## API Documentation
* **Auth**: `POST /api/auth/register`, `POST /api/auth/login`
* **Admin**: `POST /api/venues`, `POST /api/venues/:id/layout`
* **Organiser**: `POST /api/events`, `POST /api/events/:id/shows`, `GET /api/organiser/shows/:id/summary`
* **Customer**: `GET /api/events`, `GET /api/shows/:id/seatmap`, `POST /api/shows/:id/hold` (with seatIds array), `POST /api/bookings`

## Database Schema (MongoDB Collections)
* **Users**: Stores Admin, Organiser, Customer roles and hashed passwords.
* **Venues & Seats**: Stores physical locations and static grid coordinates.
* **Events & Shows**: Links events to venues at specific dates/times.
* **ShowSeatStatus**: **(CRITICAL)** Tracks the dynamic availability of every seat per show (`AVAILABLE`, `HELD`, `BOOKED`). Compound unique index on `{showId, seatId}`.
* **Bookings**: Immutable record of confirmed purchases.
* **WaitlistEntries**: FIFO queue of customers waiting for a specific seat category.

## Logic Explanations

### Seat Hold Logic & Auto-Release (TTL)
When a customer selects seats, the system attempts to claim them using an atomic `findOneAndUpdate` in MongoDB. If successful, the `status` becomes `HELD` and an `expiresAt` timestamp is set (e.g., 10 minutes from now). 
If the customer abandons the checkout, the system doesn't rely strictly on a background sweeper. Instead, the atomic query allows a seat to be overwritten by another user if `expiresAt < now`.

### Waitlist Auto-Assignment
When a booking is cancelled, the system uses a sorted atomic update (`findOneAndUpdate` with `sort: { joinedAt: 1 }`) on the `WaitlistEntry` collection. This securely claims the first person in the queue without race conditions and issues them a time-limited offer.

## Concurrency Proof Test

To verify that the Compare-And-Swap (CAS) atomic updates prevent double-booking, we run a script (concurrency-test.js) that fires 10 simultaneous hold requests for the exact same seat at the exact same millisecond.

### Test Output:
``text
Firing 10 simultaneous hold requests for Seat 64d5c41f...
[Request 1] FAILED: Seat unavailable (409).
[Request 2] SUCCESS: Seat successfully held.
[Request 3] FAILED: Seat unavailable (409).
[Request 4] FAILED: Seat unavailable (409).
[Request 5] FAILED: Seat unavailable (409).
[Request 6] FAILED: Seat unavailable (409).
[Request 7] FAILED: Seat unavailable (409).
[Request 8] FAILED: Seat unavailable (409).
[Request 9] FAILED: Seat unavailable (409).
[Request 10] FAILED: Seat unavailable (409).

--- Concurrency Test Results ---
Total Attempts: 10
Successful Holds: 1 (Expected: 1)
Rejected Holds: 9 (Expected: 9)
? Concurrency test PASSED. CAS atomic update successfully prevented double-booking.
``
