export const GET_ALL_ROOMS = `
    SELECT r.id , r.room_number, r.status, f.floor_number
    FROM rooms r
    JOIN floors f 
    ON r.floor_id=f.id
    ORDER BY f.floor_number ASC, r.room_number ASC`;