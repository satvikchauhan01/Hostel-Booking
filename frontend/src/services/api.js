import { request } from './http';
import { toMyBooking, toRoom, toUser } from './adapters';

export const authApi = {
  async login(email, password) {
    const { data } = await request('/login', {
      method: 'POST',
      body: { email, password },
      auth: false,
      handleUnauthorized: false,
    });
    return { user: toUser(data.user), token: data.token };
  },
  async register(name, email, password) {
    const { data } = await request('/register', {
      method: 'POST',
      body: { name, email, password },
      auth: false,
    });
    return toUser(data);
  },
  async me() {
    const { data } = await request('/me');
    return toUser(data);
  },
};

export const roomsApi = {
  async list(signal) {
    const { data } = await request('/rooms', { auth: false, signal });
    return (data ?? []).map(toRoom);
  },
};

export const bookingsApi = {
  /** the user's active booking, or null when they have none */
  async mine(signal) {
    const { data } = await request('/bookings/me', { signal });
    return data ? toMyBooking(data) : null;
  },
  async book(roomId) {
    await request('/bookings', { method: 'POST', body: { roomId } });
  },
  async cancel(idempotencyKey) {
    await request('/bookings/cancel', { method: 'PATCH', idempotencyKey });
  },
};
