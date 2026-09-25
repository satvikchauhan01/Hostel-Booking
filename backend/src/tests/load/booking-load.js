import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
    vus: 50,
    duration: "30s",
};

const BASE_URL = "http://localhost:5000";

// pass a valid JWT: k6 run -e TOKEN=<jwt> src/tests/load/booking-load.js
const TOKEN = __ENV.TOKEN;

export default function () {

    const payload = JSON.stringify({
        roomId: 10
    });

    const params = {
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
            "Idempotency-Key": `${__VU}-${__ITER}-${Date.now()}`
        }
    };

    const res = http.post(
        `${BASE_URL}/bookings`,
        payload,
        params
    );
    
    if (res.status !== 200 && res.status !== 409) {
        console.log(`Request failed with status: ${res.status}, body: ${res.body}`);
    }

    check(res, {
        "status is expected (200,409,429)":
        (r) =>
            r.status === 200 ||
            r.status === 409 ||
            r.status === 429
    });

    sleep(1);

}