import {
    findRoomById,
    updateRoomStatus,
    insertAllocation,
    findAllocatedRoomByUserId,
    findBookingDetailsByUserId,
    cancelAllocation,
    makeRoomAvailable
} from "../repositories/bookingRepositories.js";
import {ERRORS } from '../constants/errors.js';
import {ROOM_STATUS} from '../constants/RoomStatus.js';
import { ApiError } from "../utils/ApiError.js";
import pool from "../config/db.js";
import { acquireLock, releaseLock } from "./redisLock.js";
import { emitBookedRoomEvent, emitCancelledRoomEvent } from "./socketService.js";
import { validateRoomId } from "../validators/bookingValidator.js";
import { logger } from "../utils/logger.js";

const PG_UNIQUE_VIOLATION = '23505';

// the partial unique indexes are the last line of defence against double booking, translate them into proper API errors
function translateDbError(error){
    if(error?.code === PG_UNIQUE_VIOLATION){
        if(error.constraint === 'unique_active_user_allocation'){
            return new ApiError(400, ERRORS.USER_ALREADY_HAS_BOOKING);
        }
        if(error.constraint === 'unique_active_room'){
            return new ApiError(400, ERRORS.ROOM_ALREADY_BOOKED);
        }
    }
    return error;
}

// a socket failure must never turn an already committed booking into an error response
function safeEmit(emitFn, ...args){
    try{
        emitFn(...args);
    }catch(error){
        logger.error({ err: error }, "Failed to emit socket event");
    }
}

export async function bookRoom(userId,roomId){

    if(userId === null || userId === undefined){
        throw new ApiError(400, ERRORS.USER_ID_REQUIRED);
    }
    roomId = validateRoomId(roomId);

    const lockToken = await acquireLock(roomId);

    if(!lockToken){
        throw new ApiError(
            409,
            "Room is currently being booked by another user. Please try again later."
        );
    }

    let client;
    let transactionStarted = false;

    try{
        client = await pool.connect();
        await client.query('BEGIN');
        transactionStarted = true;

        const existingAllocation = await findAllocatedRoomByUserId(client, userId);
        if(existingAllocation){
            throw new ApiError(
                400,
                ERRORS.USER_ALREADY_HAS_BOOKING
            );
        }

        const room = await findRoomById(client, roomId);
        if(!room){
            throw new ApiError(
                404,
                ERRORS.ROOM_NOT_FOUND
            );
        }
        if(room.status === ROOM_STATUS.BOOKED){
            throw new ApiError(
                400,
                ERRORS.ROOM_ALREADY_BOOKED
            );
        }

        const updatedRoom = await updateRoomStatus(
            client,
            roomId
        );  // updating the room so that if fails then no allocation

        if(!updatedRoom){
            throw new ApiError(
                400,
                ERRORS.ROOM_ALREADY_BOOKED
            );
        }

        const allocation = await insertAllocation(
            client,
            userId,
            roomId
        );

        await client.query('COMMIT');
        transactionStarted = false;

        logger.info(
            {
                userId: userId,
                roomId: roomId,
                allocationId: allocation.id,
            },
            "Room booked successfully"
        );
        safeEmit(emitBookedRoomEvent, roomId, userId);

        return {
            allocation,
            updatedRoom
        }
    }catch(error){
        if(transactionStarted) await client.query('ROLLBACK');
        throw translateDbError(error);
    }finally{
        if(client) client.release();
        await releaseLock(roomId , lockToken);
    }
}

export async function cancelBooking(userId){

    const client = await pool.connect();
    let allocated;
    let lockToken;
    let transactionStarted = false;

    try{

        allocated = await findAllocatedRoomByUserId(client, userId);
        if(!allocated){
            throw new ApiError(
                404,
                ERRORS.ALLOCATION_NOT_FOUND
            )
        }

        lockToken = await acquireLock(allocated.room_id);

        if(!lockToken){
            throw new ApiError(
                409,
                "Room is currently being booked by another user."
            );
        }

        await client.query('BEGIN');
        transactionStarted = true;

        // re-read inside the transaction now that we hold the lock
        allocated = await findAllocatedRoomByUserId(client, userId);

        if(!allocated){
            throw new ApiError(
                404,
                ERRORS.ALLOCATION_NOT_FOUND
            )
        }

        await cancelAllocation(
            client,
            allocated.id
        );

        await makeRoomAvailable(
            client,
            allocated.room_id
        );

        await client.query('COMMIT');
        transactionStarted = false;

        safeEmit(emitCancelledRoomEvent, allocated.room_id);
        return;
    }catch(error){
        if(transactionStarted) await client.query('ROLLBACK');
        throw error;
    }finally{
        client.release();
        if(lockToken) await releaseLock(allocated.room_id , lockToken);
    }

}

export async function getMyBooking(userId){
    const booking = await findBookingDetailsByUserId(pool, userId);
    return booking ?? null;
}
