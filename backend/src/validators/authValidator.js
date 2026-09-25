import { ApiError } from "../utils/ApiError.js";
import { ERRORS } from "../constants/errors.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 72; // bcrypt ignores everything past 72 bytes

const normalizeEmail = (email) => String(email).trim().toLowerCase();

export function validateRegisterInput({ email, password, name }) {
    if (!email || !password || !name) {
        throw new ApiError(400, ERRORS.NAME_EMAIL_PASSWORD_REQUIRED);
    }

    const cleanEmail = normalizeEmail(email);
    const cleanName = String(name).trim();

    if (!EMAIL_REGEX.test(cleanEmail) || cleanEmail.length > 255) {
        throw new ApiError(400, ERRORS.INVALID_EMAIL);
    }
    if (cleanName.length === 0 || cleanName.length > 100) {
        throw new ApiError(400, ERRORS.INVALID_NAME);
    }
    if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH || Buffer.byteLength(password) > MAX_PASSWORD_LENGTH) {
        throw new ApiError(400, ERRORS.INVALID_PASSWORD);
    }

    return { email: cleanEmail, password, name: cleanName };
}

export function validateLoginInput({ email, password }) {
    if (!email || !password || typeof password !== "string") {
        throw new ApiError(400, ERRORS.USER_AND_PASSWORD_REQUIRED);
    }

    return { email: normalizeEmail(email), password };
}
