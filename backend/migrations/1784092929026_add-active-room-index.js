export const up = (pgm) => {

    pgm.sql(`
        CREATE UNIQUE INDEX unique_active_room
        ON allocations(room_id)
        WHERE status = 'ACTIVE';
    `);

};

export const down = (pgm) => {

    pgm.sql(`
        DROP INDEX IF EXISTS unique_active_room;
    `);

};