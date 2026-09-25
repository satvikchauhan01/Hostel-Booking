import * as authService from '../services/authService.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const registerUser = asyncHandler(async (req, res) => {
    const { email, password , name  } = req.body;
    const newUser = await authService.registerUser(email, password , name ); 
    res.status(201).json(new ApiResponse(201, newUser, "User registered successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await authService.loginUser(email, password);
    res.status(200).json(new ApiResponse(200, user, "User logged in successfully"));
});

export const getCurrentUser = asyncHandler(async (req,res)=>{
    return res.status(200).json(
        new ApiResponse(
            200,
            req.user,
            "Current user fetched successfully"
        )
    )
})