import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === "false" ? false : {
    rejectUnauthorized: false,
  },
});



async function seed() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Floors
    for (let floor = 1; floor <= 6; floor++) {
      await client.query(
        "INSERT INTO floors(floor_number) VALUES($1) ON CONFLICT (floor_number) DO NOTHING",
        [floor]
      );
    }

    const { rows: floors } = await client.query(
      "SELECT id, floor_number FROM floors ORDER BY floor_number"
    );

    for (const floor of floors) {
      for (let room = 1; room <= 40; room++) {
        const roomNumber = `${floor.floor_number}${room
          .toString()
          .padStart(2, "0")}`;

        await client.query(
          `
          INSERT INTO rooms
          (room_number, floor_id)
          VALUES ($1, $2)
          ON CONFLICT (room_number, floor_id) DO NOTHING
          `,
          [
            roomNumber,
            floor.id,
          ]
        );
      }
    }

    await client.query("COMMIT");

    console.log("✅ Database seeded successfully.");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
  } finally {
    client.release();
    pool.end();
  }
}

seed();