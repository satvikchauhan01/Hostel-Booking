import dotenv from 'dotenv';
dotenv.config({path: './.env'});
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js';
import roomRoutes from './routes/roomRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

// CORS_ORIGIN can be a comma separated list (e.g. http://localhost:5173,https://app.example.com); defaults to any origin
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
    : '*';

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key'],
}));
app.use(express.json());

app.use('/', authRoutes);
app.use('/rooms',roomRoutes);
app.use('/bookings',bookingRoutes);


app.use(errorHandler);

export {app};
