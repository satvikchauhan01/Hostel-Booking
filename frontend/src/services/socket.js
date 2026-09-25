import { io } from 'socket.io-client';
import { SOCKET_URL } from './config';

export const SOCKET_EVENTS = {
  booked: 'room:booked',
  cancelled: 'room:cancelled',
};

export function createSocket() {
  return io(SOCKET_URL, {
    reconnectionDelay: 800,
    reconnectionDelayMax: 5000,
  });
}
