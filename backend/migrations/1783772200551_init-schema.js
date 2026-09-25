export const up = (pgm) => {
  // Floors
  pgm.createTable("floors", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    floor_number: {
      type: "integer",
      notNull: true,
      unique: true,
    },
  });

  // Users
  pgm.createTable("users", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    name: {
      type: "varchar(100)",
      notNull: true,
    },
    email: {
      type: "varchar(255)",
      notNull: true,
      unique: true,
    },
    created_at: {
      type: "timestamp",
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  // Rooms
  pgm.createTable("rooms", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    room_number: {
      type: "varchar(10)",
      notNull: true,
    },
    floor_id: {
      type: "integer",
      notNull: true,
      references: "floors(id)",
      onDelete: "CASCADE",
    },
    status: {
      type: "varchar(20)",
      notNull: true,
      default: "AVAILABLE",
    },
    created_at: {
      type: "timestamp",
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  pgm.addConstraint(
    "rooms",
    "unique_room_per_floor",
    "UNIQUE(room_number, floor_id)"
  );

  // Allocations
  pgm.createTable("allocations", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    user_id: {
      type: "integer",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE",
    },
    room_id: {
      type: "integer",
      notNull: true,
      references: "rooms(id)",
      onDelete: "CASCADE",
    },
    status: {
      type: "varchar(20)",
      notNull: true,
      default: "ACTIVE",
    },
    allocated_at: {
      type: "timestamp",
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable("allocations");
  pgm.dropTable("rooms");
  pgm.dropTable("users");
  pgm.dropTable("floors");
};