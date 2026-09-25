# Hostel Booking System

A backend-focused hostel room booking system built with Node.js, Express, PostgreSQL, Redis, and Socket.IO. The project supports user authentication, room listing, transactional booking and cancellation, realtime updates, and concurrency-safe reservation handling.

## Features

- JWT-based user registration, login, and protected profile lookup.
- Room listing grouped by floor and ordered by floor number and room number.
- Booking and cancellation flows backed by PostgreSQL transactions.
- Redis-based distributed locking to reduce double-booking under concurrent requests.
- Idempotent cancellation requests using Redis-backed request keys.
- Rate limiting for booking endpoints.
- Socket.IO events for realtime booking and cancellation updates.
- Database migrations, seeding, concurrency tests, socket tests, and load testing scripts.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Redis
- Socket.IO
- JWT
- bcrypt
- node-pg-migrate
- k6

## Project Structure

```text
backend/
	src/
		app.js
		server.js
		config/
		constants/
		controllers/
		db/
		middleware/
		queries/
		repositories/
		routes/
		services/
		sockets/
		tests/
		utils/
		validators/
	migrations/
frontend/
	src/
		components/   (ui, layout, auth, rooms, booking, feedback)
		pages/
		contexts/
		hooks/
		services/     (API client, adapters, socket)
		utils/
		styles/       (design tokens + component styles)
docker-compose.yml
```

## Frontend

React + Vite (plain JavaScript) with a hand-built neumorphic design system (CSS tokens, light and dark themes, no UI framework).

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

- The backend URL comes from `VITE_API_URL` (default `http://localhost:5000`, see `frontend/.env.example`).
- Add the frontend's origin to `CORS_ORIGIN` in `backend/.env`.
- Pages: Login, Register, Rooms (live floor map), My Booking, Profile, and a 404.
- All backend shapes are mapped in `src/services/adapters.ts`, so components never touch raw API fields.

## API Overview

All JSON responses use one shape: `{ statusCode, data, message, success }` on success and `{ success: false, message, errors, data: null }` on failure.
Protected routes need `Authorization: Bearer <token>`; an invalid or expired token always returns `401`.

### Authentication

- `POST /register` - body `{ name, email, password }` (password 8-72 chars, email is lower-cased); rate limited to 10/hour per IP
- `POST /login` - body `{ email, password }`, returns `{ user: { id, name, email }, token }`; rate limited to 5 per 5 minutes per IP
- `GET /me` - get the current authenticated user (`id`, `name`, `email`, `created_at`)

### Rooms

- `GET /rooms` - flat list of all rooms (`id`, `room_number`, `status`, `floor_number`) ordered by floor and room number; group by `floor_number` on the client

### Bookings

- `GET /bookings/me` - the user's active booking (`room_id`, `room_number`, `floor_number`, `allocated_at`), or `data: null` if none
- `POST /bookings` - body `{ roomId }`; a user can hold only one active booking at a time; 10 requests/minute per user
- `PATCH /bookings/cancel` - cancel the active booking; requires an `Idempotency-Key` header (use a fresh key per user action)

### Realtime (Socket.IO)

- `room:booked` - `{ roomId, userId, timestamp }`
- `room:cancelled` - `{ roomId, timestamp }`

## Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Start Postgres and Redis (optional, local development)

```bash
docker compose up -d
```

If port 5432 or 6379 is already taken, set `POSTGRES_PORT` / `REDIS_PORT` before running it and use the same ports in `.env`.

### 3. Configure environment variables

Copy `backend/.env.example` to `backend/.env` and adjust it:

```env
DATABASE_URL=your_postgres_connection_string
DB_SSL=false            # SSL is on by default (cloud DBs such as Neon); set false for local Postgres
REDIS_URL=your_redis_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=1d
PORT=5000
CORS_ORIGIN=http://localhost:5173   # comma separated frontend origins; empty allows any origin
NODE_ENV=development                # "production" hides stack traces in error responses
```

### 4. Run database migrations

```bash
npm run migrate:up
```

### 5. Seed sample data (safe to re-run)

```bash
npm run seed
```

### 6. Start the server

```bash
npm run dev
```

## Available Scripts

From the `backend/` folder:

- `npm run dev` - start the server with nodemon
- `npm run start` - start the server in production mode
- `npm run migrate:create` - create a new migration
- `npm run migrate:up` - apply migrations
- `npm run migrate:down` - rollback the latest migration
- `npm run seed` - seed floors and rooms
- `npm run test:concurrency` - run the concurrency test script
- `npm run test:socket` - run the socket event test script
- `npm run test:load` - run the booking load test with k6 (`k6 run -e TOKEN=<jwt> src/tests/load/booking-load.js`)

`src/tests/load/01-concurrency-test.js` reads a local, git-ignored `tokens.json` (array of `"Bearer <jwt>"` strings, one per virtual user).

## Database Design

The backend uses four main tables:

- `floors` - stores hostel floor numbers
- `users` - stores user profile and password data
- `rooms` - stores room numbers, floor mapping, and room status
- `allocations` - stores room allocations and booking status

Important constraints include:

- unique room numbers per floor
- a partial unique index to ensure only one active allocation per room
- a partial unique index to ensure only one active allocation per user
- `CHECK` constraints on room and allocation status; timestamps are `timestamptz`

## Realtime and Concurrency Behavior

- Booking requests acquire a Redis lock for the target room before starting the transaction.
- Booking state changes are committed in PostgreSQL and then broadcast over Socket.IO.
- Cancellation requests use an idempotency key so repeated retries do not create duplicate side effects.
- A Redis-backed rate limiter helps protect the booking endpoint from request bursts.

## Testing

The project includes:

- a concurrency test for simultaneous booking attempts
- a socket client test for `room:booked` and `room:cancelled` events
- a k6 load test for booking throughput and contention behavior

## Notes

- The backend is the primary completed part of the project.
- The root `Readme.md` is intended as the main project README.
