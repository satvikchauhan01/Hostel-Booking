export const GET_ROOM_BY_ID=`
SELECT status FROM rooms WHERE id=$1`;

export const INSERT_ALLOCATION=`
INSERT INTO allocations(user_id,room_id)
VALUES($1,$2) RETURNING *`;

export const UPDATE_ROOM_STATUS=`
UPDATE rooms 
SET status='BOOKED'
WHERE id=$1 AND status='AVAILABLE'
RETURNING *`;  // returns only the uodated room //status = 'AVAILABLE' is safeguard agianst the race conditon

// export const GET_ACTIVE_ALLOCATION=`
// SELECT * FROM 
// allocations WHERE 
// user_id=$1 AND 
// room_id=$2 AND
// status='ACTIVE'`;

export const GET_ALLOCATED_ROOM_BY_USER_ID=`
SELECT id,room_id,status FROM allocations WHERE user_id=$1 AND status='ACTIVE'`;

export const CANCEL_ALLOCATION=`
UPDATE allocations 
SET status='CANCELLED'
WHERE id=$1
RETURNING *`;

export const MAKE_ROOM_AVAILABLE=`
UPDATE rooms 
SET status='AVAILABLE'
WHERE id=$1
RETURNING *`;

export const GET_BOOKING_DETAILS_BY_USER_ID=`
SELECT a.id, a.room_id, a.status, a.allocated_at, r.room_number, f.floor_number
FROM allocations a
JOIN rooms r ON r.id = a.room_id
JOIN floors f ON f.id = r.floor_id
WHERE a.user_id=$1 AND a.status='ACTIVE'`;
