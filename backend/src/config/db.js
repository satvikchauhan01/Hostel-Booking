import dotenv from 'dotenv';
dotenv.config({path: './.env'});
import pg from 'pg';
import { logger } from '../utils/logger.js';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // SSL is on by default (needed for cloud databases like Neon); set DB_SSL=false for a local/docker postgres
  ssl: process.env.DB_SSL === 'false' ? false : {
    rejectUnauthorized: false
  },
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

  
  pool.on('connect',()=>{
    logger.info('Connected to the database successfully!!!!');
  })
  pool.on('error', (err) => {
    logger.error({ err }, 'Error on connecting to database');
  })

  export const query = (text, params) => pool.query(text, params);
  export const getClient = () => pool.connect();
  export default pool;
