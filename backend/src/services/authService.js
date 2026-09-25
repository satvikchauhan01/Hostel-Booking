import { createUser, findUserByEmail } from '../repositories/authRepositories.js';
import {hashPassword, comparePassword} from '../utils/password.js';
import {generateToken } from '../utils/jwt.js';
import {ERRORS } from '../constants/errors.js';
import { ApiError } from "../utils/ApiError.js";
import { validateRegisterInput, validateLoginInput } from '../validators/authValidator.js';

const PG_UNIQUE_VIOLATION = '23505';

export async function registerUser(email,password,name) {
    const input = validateRegisterInput({ email, password, name });

    const existingUser = await findUserByEmail(input.email);
    if(existingUser){
        throw new ApiError(
            400,
            ERRORS.USER_ALREADY_EXISTS
        );
    }

    const hashed = await hashPassword(input.password);

    let newUser;
    try{
        newUser = await createUser(input.email, hashed, input.name);
    }catch(err){
        // two simultaneous registrations with the same email both pass the check above, the unique constraint catches the loser
        if(err.code === PG_UNIQUE_VIOLATION){
            throw new ApiError(
                400,
                ERRORS.USER_ALREADY_EXISTS
            );
        }
        throw err;
    }

    if(!newUser){
        throw new ApiError(
            500,
            ERRORS.USER_CREATION_FAILED
        );
    }

    delete newUser.password;

    return newUser;
}

export async function loginUser(email,password) {
    const input = validateLoginInput({ email, password });

    const user = await findUserByEmail(input.email);
    if(!user){
        throw new ApiError(
            401,
            ERRORS.INVALID_CREDENTIALS
        );
    }

    const isPasswordValid = await comparePassword(input.password,user.password);
    if(!isPasswordValid){
        throw new ApiError(
            401,
            ERRORS.INVALID_CREDENTIALS
        );
    }

    const token = generateToken({
        id: user.id,
        email: user.email
    })

    return {
        user:{
            id: user.id,
            name: user.name,
            email: user.email
        },
        token
    };
}
