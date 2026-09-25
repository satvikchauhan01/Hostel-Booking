import * as bookingService from "../services/bookingService.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
    saveResponse ,
    deleteIdempotencyKey
} from "../services/idempotencyServices.js";

export const bookRoom = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { roomId } = req.body;
        const result = await bookingService.bookRoom(
            userId,
            roomId
        );
        const response = new ApiResponse(
            200,
            result,
            "Room booked successfully"
        );
        if (req.idempotencyRedisKey) {
            await saveResponse(
                req.idempotencyRedisKey,
                response
            );
        }
        return res.status(200).json(response);
    } catch (error) {
        if (req.idempotencyRedisKey) {
            await deleteIdempotencyKey(
                req.idempotencyRedisKey
            ).catch(() => {});
        }
        next(error);
    }
};

export const cancelBooking = async (req, res, next) => {
    try {
        const userId = req.user.id;

        await bookingService.cancelBooking(userId);

        const response = new ApiResponse(
            200,
            null,
            "Booking cancelled successfully"
        );

        if (req.idempotencyRedisKey) {
            await saveResponse(
                req.idempotencyRedisKey,
                response
            );
        }
        return res.status(200).json(response);
    } catch (error) {
        // a failed attempt must not leave the key stuck in PROCESSING, otherwise a retry with the same key is rejected
        if (req.idempotencyRedisKey) {
            await deleteIdempotencyKey(
                req.idempotencyRedisKey
            ).catch(() => {});
        }
        next(error);
    }
};

export const getMyBooking = asyncHandler(async (req, res) => {
    const booking = await bookingService.getMyBooking(req.user.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            booking,
            booking ? "Active booking fetched successfully" : "No active booking"
        )
    );
});
