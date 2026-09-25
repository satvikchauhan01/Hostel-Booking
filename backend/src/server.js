import dotenv from 'dotenv';
dotenv.config({path: './.env'});
import {app} from './app.js';
import pool from './config/db.js';
import redisClient from './config/redis.js';
import http from 'http';
import {initSocket} from './config/socket.js';
import {registerEvents} from './sockets/socketServer.js';
import {logger} from './utils/logger.js';

const server = http.createServer(app);

// everything is configured first, then we start accepting traffic with server.listen(PORT)
const startServer = async () => {
  try {
    logger.info('Starting server...');
    await pool.query('SELECT NOW()'); // Testing database connection that Can my application successfully communicate with PostgreSQL?
    // if above fails then it goes to catch block
    logger.info('Database connection successful!');
    logger.info('Connecting to Redis...');
    await redisClient.connect();

    const io = await initSocket(server);
    registerEvents(io);

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error({ err: error }, 'Error starting server');
    process.exit(1); // don't leave a half started process (e.g. open pools) hanging around
  }
};

startServer();
