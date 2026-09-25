import redisClient from '../config/redis.js';
import { IDEMPOTENCY } from "../constants/idempotency.js";

export function buildIdempotencyKey(userId,key){
    return `${IDEMPOTENCY.REDIS_PREFIX}:${userId}:${key}`;
}

export async function getCachedResponse(redisKey){
    const cachedResponse = await redisClient.get(redisKey);
    if(!cachedResponse){
        return null;
    }

    return JSON.parse(cachedResponse);
}

export async function saveResponse(redisKey,response){
    await redisClient.setEx(
        redisKey,
        IDEMPOTENCY.TTL,
        JSON.stringify(response),
    );
}

export async function acquireIdempotencyKey(redisKey){
    const result = await redisClient.set(
        redisKey,
        JSON.stringify({
            status: "PROCESSING"
        }),
        {
            NX: true, // Set the key only if it does not already exist
            EX: IDEMPOTENCY.TTL   // Set the key to expire after TTL seconds
        }
    );

    return result === 'OK'; // returns true if key acquired, false otherwise
} 

export async function deleteIdempotencyKey(redisKey) {
    await redisClient.del(redisKey);
}