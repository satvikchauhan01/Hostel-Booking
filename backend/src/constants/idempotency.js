export const IDEMPOTENCY = Object.freeze({
    HEADER_NAME : "Idempotency-Key",
    REDIS_PREFIX : "idempotency",
    TTL: 60 * 10 
})