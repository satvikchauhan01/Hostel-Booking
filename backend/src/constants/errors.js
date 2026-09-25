export const ERRORS = Object.freeze({

    USER_ID_REQUIRED: "User ID is required",

    ROOM_ID_REQUIRED: "Room ID is required",

    INVALID_ROOM_ID: "Room ID must be a positive integer",

    USER_AND_ROOM_REQUIRED: "User ID and Room ID are required",

    ROOM_NOT_FOUND: "Room not found",

    ROOM_ALREADY_BOOKED: "Room is already booked",

    ROOM_STATUS_UPDATE_FAILED: "Failed to update room status",

    ALLOCATION_CREATION_FAILED: "Failed to create allocation",

    INTERNAL_SERVER_ERROR: "Internal server error",
    
    USER_ALREADY_EXISTS: "User already exists",

    INVALID_CREDENTIALS: "Invalid email or password",

    USER_CREATION_FAILED: "Failed to create user",

    USER_AND_PASSWORD_REQUIRED: "Email and password are required",

    NAME_EMAIL_PASSWORD_REQUIRED: "Name, email and password are required",

    INVALID_EMAIL: "Please provide a valid email address",

    INVALID_NAME: "Name must be between 1 and 100 characters",

    INVALID_PASSWORD: "Password must be between 8 and 72 characters long",

    USER_ALREADY_HAS_BOOKING: "You already have an active booking. Cancel it before booking another room.",

    ALLOCATION_NOT_FOUND: "No active booking found",

    TOO_MANY_ATTEMPTS: "Too many attempts. Please try again later.",

});