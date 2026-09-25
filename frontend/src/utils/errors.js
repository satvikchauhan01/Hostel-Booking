import { ApiRequestError } from '../services/http';

/**
 * Maps what the backend actually returns to product copy.
 *  401 -> session expired (or wrong credentials on login)
 *  429 -> rate limited, with Retry-After
 *  409 -> room lock contention while booking
 *  400 "Room is already booked" -> someone else got there first
 *  400 "You already have an active booking..." -> user already holds a room
 */
export function describeError(err, context = 'load') {
  if (!(err instanceof ApiRequestError)) {
    return { kind: 'unknown', message: 'Something went wrong. Please try again.' };
  }
  if (err.kind === 'network') {
    return { kind: 'network', message: "Can't reach the server. Check your connection." };
  }
  const status = err.status;
  if (status === 429) {
    const retryAfter = err.retryAfter ?? 30;
    return { kind: 'rate-limit', status, retryAfter, message: `Too many requests. Try again in ${retryAfter}s.` };
  }
  if (status === 401) {
    if (context === 'login') return { kind: 'validation', status, message: err.message || 'Invalid email or password' };
    return { kind: 'session', status, message: 'Session expired. Please log in again.' };
  }
  if (status >= 500) {
    return { kind: 'server', status, message: 'Something went wrong on our side. Please retry.' };
  }
  if (context === 'booking') {
    if (status === 409) {
      return { kind: 'room-busy', status, message: 'Someone else is booking this room right now. Try again in a moment.' };
    }
    if (status === 404) {
      return { kind: 'validation', status, message: "That room doesn't exist any more. Refreshing the map." };
    }
    if (status === 400 && /already booked/i.test(err.message)) {
      return { kind: 'room-taken', status, message: 'This room has just been booked by someone else.' };
    }
    if (status === 400 && /already have an active booking/i.test(err.message)) {
      return { kind: 'already-booked', status, message: 'You already have a room. Cancel it before booking another.' };
    }
  }
  if (context === 'cancel') {
    if (status === 404) return { kind: 'no-booking', status, message: 'You have no active booking to cancel.' };
    if (status === 409) return { kind: 'room-busy', status, message: 'Your room is busy right now. Try again in a moment.' };
  }
  return { kind: 'validation', status, message: err.message || 'Something went wrong. Please try again.' };
}
