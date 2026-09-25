import {GET_USER_BY_EMAIL,
    GET_USER_BY_ID,
    CREATE_USER} 
from '../queries/authQueries.js';
import pool from '../config/db.js';

export async function createUser(email,password , name) {
    const {rows} = await pool.query(CREATE_USER,[email,password,name]);
    return rows[0];
}

export async function findUserByEmail(email) {
    const {rows} = await pool.query(GET_USER_BY_EMAIL,[email]);
    return rows[0];
}

export async function findUserById(id) {
    const {rows} = await pool.query(GET_USER_BY_ID,[id]);
    return rows[0];
}