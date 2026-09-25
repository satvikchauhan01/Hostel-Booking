/**
 * The only place that knows the backend's field names. Components work with the shapes on the right.
 *
 * Room       API { id, room_number, status: 'AVAILABLE' | 'BOOKED', floor_number }
 *            app { id, number, floor, status }
 * User       API { id, name?, email, created_at? }
 *            app { id, name, email, createdAt }
 * MyBooking  API { id, room_id, status, allocated_at, room_number, floor_number }   (GET /bookings/me, null when none)
 *            app { id, roomId, roomNumber, floor, status, allocatedAt }
 *
 * Socket events:
 *   room:booked    { roomId, userId, timestamp }
 *   room:cancelled { roomId, timestamp }
 */

export const toRoom = (r) => ({
  id: r.id,
  number: r.room_number,
  floor: r.floor_number,
  status: r.status === 'BOOKED' ? 'BOOKED' : 'AVAILABLE',
});

export const toUser = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  createdAt: u.created_at,
});

export const toMyBooking = (b) => ({
  id: b.id,
  roomId: b.room_id,
  roomNumber: b.room_number,
  floor: b.floor_number,
  status: b.status,
  allocatedAt: b.allocated_at,
});
