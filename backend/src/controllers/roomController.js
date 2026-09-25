import * as roomService from '../services/roomService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// flat list ordered by floor_number, room_number - group by floor_number on the client
export const getAllRooms = asyncHandler(async (req, res) => {
    const rooms = await roomService.getAllRooms();

    return res.status(200).json(
        new ApiResponse(
            200,
            rooms,
            rooms.length ? "Rooms fetched successfully" : "No rooms found"
        )
    );
});
