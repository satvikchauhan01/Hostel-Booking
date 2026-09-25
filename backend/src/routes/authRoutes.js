import { verifyJWT } from "../middleware/authMiddleware.js";
import { createRateLimiter, ipKeyFn } from "../middleware/RateLimiter.js";
import { RATE_LIMIT } from "../constants/rateLimit.js";
import { ERRORS } from "../constants/errors.js";
import express from "express";
import * as authController from "../controllers/authController.js";

const router = express.Router();

const loginRateLimiter = createRateLimiter(
    "login",
    RATE_LIMIT.LOGIN.LIMIT,
    RATE_LIMIT.LOGIN.WINDOW,
    ipKeyFn,
    ERRORS.TOO_MANY_ATTEMPTS
);

const registerRateLimiter = createRateLimiter(
    "register",
    RATE_LIMIT.REGISTER.LIMIT,
    RATE_LIMIT.REGISTER.WINDOW,
    ipKeyFn,
    ERRORS.TOO_MANY_ATTEMPTS
);

router.post("/register", registerRateLimiter, authController.registerUser);
router.post("/login", loginRateLimiter, authController.loginUser);
router.get("/me", verifyJWT, authController.getCurrentUser);

export default router;
