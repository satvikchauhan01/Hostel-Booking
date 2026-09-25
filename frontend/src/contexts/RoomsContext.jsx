import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { bookingsApi, roomsApi } from '../services/api';
import { SOCKET_EVENTS } from '../services/socket';
import { describeError } from '../utils/errors';
import { useAuth } from '../hooks/useAuth';
import { useSocket } from '../hooks/useSocket';
import { useToast } from '../hooks/useToast';

export const RoomsContext = createContext(null);
const setRoomStatus = (rooms, roomId, status) => rooms.map((r) => (r.id === roomId && r.status !== status ? { ...r, status } : r));
export function RoomsProvider({ children }) {
  const { user } = useAuth();
  const { socket, status: socketStatus } = useSocket();
  const toast = useToast();
  const [rooms, setRooms] = useState([]);
  const [myBooking, setMyBooking] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [pendingRoomId, setPendingRoomId] = useState(null);
  const [cooldownUntil, setCooldownUntil] = useState(null);
  // the socket handlers outlive renders, so they read the latest values through refs
  const roomsRef = useRef(rooms);
  roomsRef.current = rooms;
  const myBookingRef = useRef(myBooking);
  myBookingRef.current = myBooking;
  const userIdRef = useRef(user?.id);
  userIdRef.current = user?.id;
  const pendingRef = useRef(null);
  const cancellingRef = useRef(false);
  const viewFloorRef = useRef('all');
  const toastRef = useRef(toast);
  toastRef.current = toast;
  const load = useCallback(async (silent) => {
    if (!silent) {
      setStatus('loading');
      setError(null);
    }
    try {
      const [nextRooms, mine] = await Promise.all([roomsApi.list(), bookingsApi.mine()]);
      setRooms(nextRooms);
      setMyBooking(mine);
      setStatus('ready');
      setError(null);
    } catch (err) {
      // a failed background refresh should not replace a map the user can still use
      if (!silent) {
        setError(describeError(err, 'load'));
        setStatus('error');
      }
    }
  }, []);
  const reload = useCallback(() => load(false), [load]);
  useEffect(() => {
    void load(false);
  }, [load]);
  // ----- live updates -----------------------------------------------------------------------------------------
  useEffect(() => {
    if (!socket) return;
    const inView = (room) => !!room && (viewFloorRef.current === 'all' || viewFloorRef.current === room.floor);
    const onBooked = (event) => {
      const room = roomsRef.current.find((r) => r.id === event.roomId);
      setRooms((prev) => setRoomStatus(prev, event.roomId, 'BOOKED'));
      const isMine = event.userId === userIdRef.current;
      if (isMine) {
        // booked from another tab/device; our own request in this tab already handles itself
        if (pendingRef.current !== event.roomId && myBookingRef.current?.roomId !== event.roomId) {
          bookingsApi
            .mine()
            .then(setMyBooking)
            .catch(() => {});
        }
        return;
      }
      if (room && inView(room) && pendingRef.current !== event.roomId) {
        toastRef.current.info(`Room ${room.number} was just booked by someone else.`);
      }
    };
    const onCancelled = (event) => {
      setRooms((prev) => setRoomStatus(prev, event.roomId, 'AVAILABLE'));
      if (myBookingRef.current?.roomId === event.roomId) {
        setMyBooking(null);
        if (!cancellingRef.current) toastRef.current.info('Your booking was cancelled.');
      }
    };
    socket.on(SOCKET_EVENTS.booked, onBooked);
    socket.on(SOCKET_EVENTS.cancelled, onCancelled);
    return () => {
      socket.off(SOCKET_EVENTS.booked, onBooked);
      socket.off(SOCKET_EVENTS.cancelled, onCancelled);
    };
  }, [socket]);
  // events missed while offline mean the map may be stale: refetch once the connection is back
  const hadConnectionRef = useRef(false);
  const wasDownRef = useRef(false);
  useEffect(() => {
    if (socketStatus === 'connected') {
      if (wasDownRef.current) {
        wasDownRef.current = false;
        void load(true);
        toastRef.current.success('Connection restored.');
      }
      hadConnectionRef.current = true;
    } else if (socketStatus === 'reconnecting' && hadConnectionRef.current) {
      wasDownRef.current = true;
    }
  }, [socketStatus, load]);
  // ----- actions ----------------------------------------------------------------------------------------------
  const startCooldown = useCallback((seconds) => {
    setCooldownUntil(Date.now() + seconds * 1000);
  }, []);
  const bookRoom = useCallback(
    async (roomId) => {
      const room = roomsRef.current.find((r) => r.id === roomId);
      const label = room ? `Room ${room.number}` : 'This room';
      pendingRef.current = roomId;
      setPendingRoomId(roomId);
      try {
        await bookingsApi.book(roomId);
        setRooms((prev) => setRoomStatus(prev, roomId, 'BOOKED'));
        // ask the server for the authoritative booking, fall back to what we know if that call fails
        const mine = await bookingsApi.mine().catch(() => null);
        setMyBooking(
          mine ??
            (room
              ? {
                  id: 0,
                  roomId,
                  roomNumber: room.number,
                  floor: room.floor,
                  status: 'ACTIVE',
                  allocatedAt: new Date().toISOString(),
                }
              : null),
        );
        toastRef.current.success(`${label} booked successfully.`);
        return { ok: true };
      } catch (err) {
        const ui = describeError(err, 'booking');
        switch (ui.kind) {
          case 'rate-limit':
            startCooldown(ui.retryAfter ?? 30);
            toastRef.current.warning(ui.message);
            break;
          case 'room-taken':
            // the backend is the source of truth: it says this room is gone, so make the map say so too
            setRooms((prev) => setRoomStatus(prev, roomId, 'BOOKED'));
            toastRef.current.error(`${label} was just booked by someone else.`);
            break;
          case 'already-booked':
            bookingsApi
              .mine()
              .then(setMyBooking)
              .catch(() => {});
            toastRef.current.warning(ui.message);
            break;
          case 'session':
            break; // the http layer already announced the expired session
          case 'room-busy':
            toastRef.current.warning(ui.message);
            break;
          default:
            toastRef.current.error(ui.message);
        }
        // whatever went wrong, our picture of the map may be out of date
        if (ui.kind !== 'rate-limit' && ui.kind !== 'network' && ui.kind !== 'session') void load(true);
        return { ok: false, error: ui };
      } finally {
        pendingRef.current = null;
        setPendingRoomId(null);
      }
    },
    [load, startCooldown],
  );
  const cancelBooking = useCallback(
    async (idempotencyKey) => {
      cancellingRef.current = true;
      try {
        await bookingsApi.cancel(idempotencyKey);
        const freed = myBookingRef.current;
        if (freed) setRooms((prev) => setRoomStatus(prev, freed.roomId, 'AVAILABLE'));
        setMyBooking(null);
        toastRef.current.success('Booking cancelled.');
        return { ok: true };
      } catch (err) {
        const ui = describeError(err, 'cancel');
        if (ui.kind === 'rate-limit') {
          startCooldown(ui.retryAfter ?? 30);
          toastRef.current.warning(ui.message);
        } else if (ui.kind === 'no-booking') {
          setMyBooking(null);
          toastRef.current.info(ui.message);
        } else if (ui.kind !== 'session') {
          toastRef.current.error(ui.message);
        }
        return { ok: false, error: ui };
      } finally {
        cancellingRef.current = false;
      }
    },
    [startCooldown],
  );
  const setViewFloor = useCallback((floor) => {
    viewFloorRef.current = floor;
  }, []);
  const value = useMemo(
    () => ({
      rooms,
      myBooking,
      status,
      error,
      pendingRoomId,
      cooldownUntil,
      setViewFloor,
      reload,
      bookRoom,
      cancelBooking,
    }),
    [rooms, myBooking, status, error, pendingRoomId, cooldownUntil, setViewFloor, reload, bookRoom, cancelBooking],
  );
  return <RoomsContext.Provider value={value}>{children}</RoomsContext.Provider>;
}
