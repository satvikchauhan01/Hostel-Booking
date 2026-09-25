import {getSocket} from "../config/socket.js";

export function emitBookedRoomEvent(roomId, userId){
    const io = getSocket();

    io.emit("room:booked",{
        roomId: roomId,
        userId: userId,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
    });
}

export function emitCancelledRoomEvent(roomId){
    const io = getSocket();

    io.emit("room:cancelled",{
        roomId: roomId,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
    });
}