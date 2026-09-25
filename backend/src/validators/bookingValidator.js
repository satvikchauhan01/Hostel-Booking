import { ApiError } from "../utils/ApiError.js";
import { ERRORS } from "../constants/errors.js";

export function validateRoomId(roomId) {
    if (roomId === undefined || roomId === null || roomId === "") {
        throw new ApiError(400, ERRORS.ROOM_ID_REQUIRED);
    }

    const id = Number(roomId);
    if (!Number.isInteger(id) || id <= 0) {
        throw new ApiError(400, ERRORS.INVALID_ROOM_ID);
    }
    return id;
}
