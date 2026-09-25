// Fires simultaneous booking requests from N different users at ONE room; exactly one must succeed.
// Note: each user makes a single request, so the per-user booking rate limit (10/min) is not hit.
// Usage (from backend/, server running, .env present):  node src/tests/concurrency.test.js [roomId] [totalUsers]
import axios from "axios";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import { generateToken } from "../utils/jwt.js";
import pool from "../config/db.js";

const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

const ROOM_ID = Number(process.argv[2] || 16);
const TOTAL_REQUESTS = Number(process.argv[3] || 20);

// inserts fresh users straight into the DB and signs their tokens directly (avoids the register/login rate limiters)
async function createUsers(count) {
    const runId = Date.now();
    const users = [];

    for (let i = 1; i <= count; i++) {
        const email = `concurrency_${runId}_${i}@test.com`;
        const { rows } = await pool.query(
            "INSERT INTO users(name, email, password) VALUES ($1, $2, $3) RETURNING id",
            [`Concurrency User ${i}`, email, "not-a-real-hash"]
        );

        users.push({
            userId: rows[0].id,
            token: generateToken({ id: rows[0].id, email }),
        });
    }

    return users;
}

async function runTest() {
    const users = await createUsers(TOTAL_REQUESTS);

    const results = await Promise.all(
        users.map(({ userId, token }) =>
            axios
                .post(
                    `${BASE_URL}/bookings`,
                    { roomId: ROOM_ID },
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then(() => ({ userId, success: true, message: "Room booked successfully" }))
                .catch((err) => ({
                    userId,
                    success: false,
                    message: err.response?.data?.message ?? err.message,
                }))
        )
    );

    console.table(results);

    const success = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    console.log("\nSuccessful Bookings :", success.length);
    console.log("Failed Bookings :", failed.length);
    console.log(success.length === 1 ? "PASS: exactly one booking succeeded" : "FAIL: expected exactly one successful booking");
    process.exitCode = success.length === 1 ? 0 : 1;
}

runTest()
    .catch((err) => {
        console.error("Test setup failed:", err.response?.data ?? err.message);
        process.exitCode = 1;
    })
    .finally(() => pool.end());
