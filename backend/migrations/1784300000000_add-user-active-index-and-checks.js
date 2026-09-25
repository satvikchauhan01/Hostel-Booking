export const up = (pgm) => {

    // a user can hold at most one ACTIVE allocation at a time
    // (fails if existing data already has a user with two ACTIVE allocations - cancel the extras first)
    pgm.sql(`
        CREATE UNIQUE INDEX unique_active_user_allocation
        ON allocations(user_id)
        WHERE status = 'ACTIVE';
    `);

    pgm.addConstraint("rooms", "rooms_status_check", "CHECK (status IN ('AVAILABLE', 'BOOKED'))");
    pgm.addConstraint("allocations", "allocations_status_check", "CHECK (status IN ('ACTIVE', 'CANCELLED'))");

    // timestamps were stored without a time zone
    pgm.alterColumn("users", "created_at", { type: "timestamptz" });
    pgm.alterColumn("rooms", "created_at", { type: "timestamptz" });
    pgm.alterColumn("allocations", "allocated_at", { type: "timestamptz" });

};

export const down = (pgm) => {

    pgm.alterColumn("allocations", "allocated_at", { type: "timestamp" });
    pgm.alterColumn("rooms", "created_at", { type: "timestamp" });
    pgm.alterColumn("users", "created_at", { type: "timestamp" });

    pgm.dropConstraint("allocations", "allocations_status_check");
    pgm.dropConstraint("rooms", "rooms_status_check");

    pgm.sql(`
        DROP INDEX IF EXISTS unique_active_user_allocation;
    `);

};
