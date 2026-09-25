import {ApiError} from '../utils/ApiError.js';
import {IDEMPOTENCY} from "../constants/idempotency.js";
import {getCachedResponse,
    buildIdempotencyKey,
    acquireIdempotencyKey,
} from "../services/idempotencyServices.js";


export async function idempotencyMiddleware(req,res,next){
    try{
        const idempotencyKey = req.header(IDEMPOTENCY.HEADER_NAME);
        if(!idempotencyKey){
            throw new ApiError(400,"Idempotency key is required");
        }

        const userId = req.user.id;
        const redisKey = buildIdempotencyKey(
            userId,
            idempotencyKey
        );

        const acquired = await acquireIdempotencyKey(redisKey);

        if(!acquired){

            const cachedResponse = await getCachedResponse(redisKey);

            // a finished request is cached as an ApiResponse (has statusCode), an in-flight one is only the PROCESSING placeholder
            if(cachedResponse && cachedResponse.statusCode){
                return res.status(cachedResponse.statusCode)
                .json(cachedResponse);
            }

            throw new ApiError(409,"Request is already being processed");

        }


        req.idempotencyRedisKey = redisKey;
        next();
    }catch(error){
        next(error);
    }
}
