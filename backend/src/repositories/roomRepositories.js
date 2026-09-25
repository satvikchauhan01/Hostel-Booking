import pool from '../config/db.js';
import {GET_ALL_ROOMS} from '../queries/roomQueries.js';

export async function getAllRooms(){

    const {rows}= await pool.query(GET_ALL_ROOMS);
    return rows;
}