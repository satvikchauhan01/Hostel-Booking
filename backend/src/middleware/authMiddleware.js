import {asyncHandler} from '../utils/asyncHandler.js';
import { ApiError } from "../utils/ApiError.js";
import {verifyToken} from '../utils/jwt.js';
import {findUserById} from '../repositories/authRepositories.js';

export const verifyJWT = asyncHandler(async (req,res,next) => {

    const header = req.header('Authorization');

    if(!header || !header.startsWith('Bearer ')){
        throw new ApiError(
            401,
            "Authorization header missing or malformed"
        );
    }

    const token = header.split(' ')[1];

    let decodedToken;
    try{
        decodedToken = verifyToken(token);
    }catch(error){
        // jsonwebtoken throws its own error types; the client should always see a 401 so it can send the user back to login
        const message = error.name === 'TokenExpiredError'
            ? "Token expired. Please log in again."
            : "Invalid token";
        throw new ApiError(401, message);
    }

    const user = await findUserById(decodedToken.id);

    if(!user){
        throw new ApiError(
            401,
            "User not found"
        );
    }

    delete user.password;

    req.user = user;
    next();
})
