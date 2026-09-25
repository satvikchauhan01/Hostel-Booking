import { useContext, useMemo } from 'react';
import { RoomsContext } from '../contexts/RoomsContext';
import { useCountdown } from './useCountdown';

function useRoomsContext() {
  const ctx = useContext(RoomsContext);
  if (!ctx) throw new Error('useRooms/useMyBooking must be used inside <RoomsProvider>');
  return ctx;
}

/** the room map: list, load state, live status and the booking action */
export function useRooms() {
  const ctx = useRoomsContext();
  return useMemo(
    () => ({
      rooms: ctx.rooms,
      status: ctx.status,
      error: ctx.error,
      pendingRoomId: ctx.pendingRoomId,
      reload: ctx.reload,
      bookRoom: ctx.bookRoom,
      setViewFloor: ctx.setViewFloor,
    }),
    [ctx.rooms, ctx.status, ctx.error, ctx.pendingRoomId, ctx.reload, ctx.bookRoom, ctx.setViewFloor],
  );
}

/** the signed-in user's booking and the cancel action */
export function useMyBooking() {
  const ctx = useRoomsContext();
  return useMemo(
    () => ({
      myBooking: ctx.myBooking,
      status: ctx.status,
      error: ctx.error,
      reload: ctx.reload,
      cancelBooking: ctx.cancelBooking,
    }),
    [ctx.myBooking, ctx.status, ctx.error, ctx.reload, ctx.cancelBooking],
  );
}

/** seconds left on a 429 from booking/cancelling (0 = free to act) */
export function useActionCooldown() {
  const ctx = useRoomsContext();
  return useCountdown(ctx.cooldownUntil);
}
