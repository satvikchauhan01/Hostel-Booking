import {Server} from "socket.io";
import {createClient} from "redis";
import {createAdapter} from "@socket.io/redis-adapter";
import {logger} from "../utils/logger.js";

let io = null;

export async function initSocket(server){
    io = new Server(server,{
        cors:{
            origin: process.env.CORS_ORIGIN
                ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
                : "*",
            methods:["GET","POST","PATCH"]
        }
    })

    const pubClient = createClient({
        url: process.env.REDIS_URL
    });

    const subClient = pubClient.duplicate();

    pubClient.on('error', (err) => logger.error({ err }, 'Redis Pub Client Error'));
    subClient.on('error', (err) => logger.error({ err }, 'Redis Sub Client Error'));

    await Promise.all([pubClient.connect(), subClient.connect()])

    io.adapter(createAdapter(pubClient, subClient));

    logger.info("Socket.io initialized with Redis adapter");

    return io;
}

export function getSocket(){
    if(!io){
        throw new Error("Socket.io not initialized");
    }
    return io;
}
