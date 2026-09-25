import redisClient from "../config/redis.js";
import { ApiError } from "../utils/ApiError.js";

const defaultKeyFn = (req) => req.user.id;
export const ipKeyFn = (req) => req.ip;

// keyFn decides who is being limited: the logged in user by default, pass ipKeyFn for public endpoints (login/register)
export function createRateLimiter(prefix, limit, window, keyFn = defaultKeyFn, message) {
    return async (req, res, next) => {
        try{
            const key = `rate_limit:${prefix}:${keyFn(req)}`;
            // incrementing req limit
            const currentCount = await redisClient.incr(key);

            if(currentCount === 1){
                await redisClient.expire(key, window);
            }else{
                // fail safe against orphan keys(keys without expiration) in redis
                const ttl = await redisClient.ttl(key);
                if(ttl === -1){
                    await redisClient.expire(key, window);
                }
            }

            const ttl = await redisClient.ttl(key); // after this second redisClinet will delte these key

            // headers so the frontend can show a countdown
            res.set({
                "X-RateLimit-Limit": String(limit),
                "X-RateLimit-Remaining": String(Math.max(limit - currentCount, 0)),
                "Retry-After": String(Math.max(ttl, 0)),
            });

            if(currentCount > limit){
                throw new ApiError(
                    429,
                    message ?? `Too many ${prefix} requests. Please try again later. (${ttl} seconds remaining)`
                );
            }

            next();
        }catch(error){
            next(error);
        }
    };
}
