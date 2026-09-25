import redisClient from '../config/redis.js';
import crypto from 'crypto';
const LOCK_TTL = 5000; 
// here one thing can be noted is that , lock_ttl time is less,the DB transaction will take time and it will be expired before only . so maybe increase the ttl or lock extension mech for longer transactions 

const release_lock_script = `
    if redis.call("GET",KEYS[1]) == ARGV[1] then 
        return redis.call("DEL",KEYS[1])
    else return 0
    end
    `;
export async function acquireLock(roomId){

    const LockKey= `lock:room:${roomId}`;
    const token = crypto.randomUUID();

    const res = await redisClient.set(
        LockKey,
        token,
        {
            NX: true, // Set the key only if it does not already exist
            PX: LOCK_TTL  // Set the key to expire after 5 seconds
        }
    );

    if(res=== 'OK') return token; // returns the token if lock acquired, null otherwise
    else return null;
}

export async function releaseLock(roomId, token){
    if(!roomId || !token) return; // if token never acquired 
    const LockKey = `lock:room:${roomId}`;

    const res= await redisClient.eval(
        release_lock_script,
        {
            keys: [LockKey],
            arguments: [token]
        }
    );
    return res===1; // returns true if lock released, false otherwise
}