import axios from 'axios';

const API_URL = 'http://localhost:5000/api/shows';
const SHOW_ID = 'REPLACE_WITH_SHOW_ID';
const SEAT_ID = 'REPLACE_WITH_SEAT_ID';

async function fireConcurrentRequests(attempts = 10) {
  console.log(`Firing ${attempts} simultaneous hold requests for Seat ${SEAT_ID}...`);
  
  const requests = Array.from({ length: attempts }).map((_, index) => {
    return axios.post(`${API_URL}/${SHOW_ID}/hold`, {
      seatIds: [SEAT_ID],
      customerId: `test_user_${index}` // simulated user
    }).catch(err => err.response);
  });

  const responses = await Promise.all(requests);
  
  let successCount = 0;
  let failCount = 0;

  responses.forEach((res, i) => {
    if (res.status === 200 || res.status === 201) {
      console.log(`[Request ${i + 1}] SUCCESS: Seat successfully held.`);
      successCount++;
    } else {
      console.log(`[Request ${i + 1}] FAILED: Seat unavailable (${res.status}).`);
      failCount++;
    }
  });

  console.log('\n--- Concurrency Test Results ---');
  console.log(`Total Attempts: ${attempts}`);
  console.log(`Successful Holds: ${successCount} (Expected: 1)`);
  console.log(`Rejected Holds: ${failCount} (Expected: ${attempts - 1})`);
  
  if (successCount === 1) {
    console.log('✅ Concurrency test PASSED. CAS atomic update successfully prevented double-booking.');
  } else {
    console.log('❌ Concurrency test FAILED.');
  }
}

// To run: node concurrency-test.js
// fireConcurrentRequests(10);
