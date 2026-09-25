import http from "k6/http";
import { check } from "k6";
import { SharedArray } from "k6/data";

// Load the 10 distinct tokens
const tokens = new SharedArray("user tokens", function () {
    return JSON.parse(open("./tokens.json"));
});

export const options = {
    vus: 10,        // 10 distinct users
    iterations: 10, // Fire exactly 1 request per user at the exact same millisecond
};

const BASE_URL = "http://localhost:5000";

export default function () {
    // Pick the token matching the current Virtual User (VU 1 gets Token 0, VU 2 gets Token 1, etc.)
    const userToken = tokens[__VU - 1];

    const payload = JSON.stringify({
        roomId: 23 // All 10 distinct users fight for Room 10 simultaneously
    });

    const params = {
        headers: {
            Authorization: userToken,
            "Content-Type": "application/json",
            "Idempotency-Key": `concurrency-vu${__VU}-${Date.now()}`
        }
    };

    const res = http.post(`${BASE_URL}/bookings`, payload, params);

    console.log(`VU ${__VU} Status: ${res.status} - Body: ${res.body}`);

    check(res, {
        "Is 200/201 (Booked)" : (r) => r.status === 200 || r.status === 201,
        "Is 409 (Conflict/Room Taken)": (r) => r.status === 409,
    });
}