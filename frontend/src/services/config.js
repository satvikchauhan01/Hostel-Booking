/**
 * Everything that depends on the backend contract lives in services/ so components never touch raw API shapes.
 * The only things to change when the backend moves are the values in this file and the adapters.
 */
export const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:5000').replace(/\/$/, '');
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? API_URL;
export const STORAGE_KEYS = {
  token: 'quarters.token',
  user: 'quarters.user',
  theme: 'quarters.theme',
  floor: 'quarters.floor',
};

export const IDEMPOTENCY_HEADER = 'Idempotency-Key';
/** Used when a 429 arrives without a readable Retry-After. */
export const FALLBACK_RETRY_SECONDS = 30;
/** Mirrors the backend validators; the server stays the source of truth. */
export const PASSWORD_RULES = { min: 8, max: 72 };
export const NAME_MAX_LENGTH = 100;
