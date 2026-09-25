import { GET_ROOM_BY_ID } from "../queries/bookingQueries.js";
import { UPDATE_ROOM_STATUS } from "../queries/bookingQueries.js";
import { INSERT_ALLOCATION } from "../queries/bookingQueries.js";
import {
    CANCEL_ALLOCATION ,
    MAKE_ROOM_AVAILABLE ,
    GET_ALLOCATED_ROOM_BY_USER_ID,
    GET_BOOKING_DETAILS_BY_USER_ID
} from "../queries/bookingQueries.js";

export async function findRoomById(client,roomId) {
    const {rows } = await client.query(GET_ROOM_BY_ID, [roomId]);
    return rows[0];
}

export async function insertAllocation(client, userId, roomId) {
    const { rows } = await client.query(INSERT_ALLOCATION, [userId, roomId]);
    return rows[0];
}

export async function updateRoomStatus(client,roomId) {
    const {rows } = await client.query(UPDATE_ROOM_STATUS, [roomId]);
    return rows[0];
}

// export async function findActiveAllocation(client,userId,roomId){
//     const {rows} = await client.query(GET_ACTIVE_ALLOCATION,[userId,roomId]);
//     return rows[0];
// }

export async function findAllocatedRoomByUserId(client,userId){
    const {rows} = await client.query(GET_ALLOCATED_ROOM_BY_USER_ID,[userId]);
    return rows[0];
}

export async function cancelAllocation(client,allocationId){
    const {rows} = await client.query(CANCEL_ALLOCATION,[allocationId]);
    return rows[0];
}

export async function makeRoomAvailable(client,roomId){
    const {rows} = await client.query(MAKE_ROOM_AVAILABLE,[roomId]);
    return rows[0];
}


// passing a single clinet so that transactions can be atomic and rollback in case of failure. This is important to maintain data integrity.
export async function findBookingDetailsByUserId(client,userId){
    const {rows} = await client.query(GET_BOOKING_DETAILS_BY_USER_ID,[userId]);
    return rows[0];
}
