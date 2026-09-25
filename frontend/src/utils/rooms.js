/** rooms come back ordered from the API, but sorting here keeps the UI correct if that ever changes */
export function groupByFloor(rooms) {
  const map = new Map();
  for (const room of rooms) {
    const list = map.get(room.floor);
    if (list) list.push(room);
    else map.set(room.floor, [room]);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a - b)
    .map(([floor, list]) => ({
      floor,
      rooms: [...list].sort((a, b) => a.number.localeCompare(b.number, undefined, { numeric: true })),
    }));
}

export function getViewState(room, myBooking, pendingRoomId) {
  if (myBooking && myBooking.roomId === room.id) return 'mine';
  if (pendingRoomId === room.id) return 'pending';
  return room.status === 'BOOKED' ? 'booked' : 'available';
}

export function computeStats(rooms) {
  let booked = 0;
  for (const room of rooms) if (room.status === 'BOOKED') booked += 1;
  return { available: rooms.length - booked, booked, total: rooms.length };
}

export function filterRooms(rooms, query, status) {
  const q = query.trim().toLowerCase();
  if (!q && status === 'all') return rooms;
  return rooms.filter((room) => {
    if (q && !room.number.toLowerCase().includes(q)) return false;
    if (status === 'available') return room.status === 'AVAILABLE';
    if (status === 'booked') return room.status === 'BOOKED';
    return true;
  });
}

export function filterByFloor(groups, floor) {
  return floor === 'all' ? groups : groups.filter((g) => g.floor === floor);
}

/** A floor is drawn as two wings facing a corridor. */
export function splitWings(items) {
  const half = Math.ceil(items.length / 2);
  return [items.slice(0, half), items.slice(half)];
}

export function ordinalFloor(floor) {
  return `Floor ${floor}`;
}
