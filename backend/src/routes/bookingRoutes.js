import express from "express";
import * as bookingController from "../controllers/bookingController.js";
import { verifyJWT } from "../middleware/authMiddleware.js";
import { createRateLimiter } from "../middleware/RateLimiter.js";
import { RATE_LIMIT } from "../constants/rateLimit.js";
import { idempotencyMiddleware } from "../middleware/idempotencyMiddleware.js";

const router = express.Router();

const bookingRateLimiter = createRateLimiter(
    "booking",
    RATE_LIMIT.BOOKING.LIMIT,
    RATE_LIMIT.BOOKING.WINDOW
); // 10 requests per minute

router.get("/me", verifyJWT, bookingController.getMyBooking);
router.post("/",verifyJWT, bookingRateLimiter, bookingController.bookRoom);
router.patch("/cancel",verifyJWT, bookingRateLimiter ,idempotencyMiddleware, bookingController.cancelBooking);

export default router;

// idempotencyMiddleware is not used on the bookRoom route because booking is already protected by the redis room lock,
// the DB unique indexes and the "already booked" checks. It matters more for cancellation, which can be retried by the client.
// bookRoom in the controller still honours req.idempotencyRedisKey if the middleware is ever added.
