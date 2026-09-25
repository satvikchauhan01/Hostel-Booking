import { memo, useEffect, useRef, useState } from 'react';
import { DoorClosed, DoorOpen, KeyRound, Lock } from 'lucide-react';
import { Spinner } from '../ui/Spinner';
import { cx } from '../../utils/cx';

const LABEL = {
  available: 'Free',
  booked: 'Taken',
  mine: 'Yours',
  pending: 'Booking',
};

const SPOKEN = {
  available: 'available',
  booked: 'booked',
  mine: 'your room',
  pending: 'booking in progress',
};

function RoomTileBase({ room, state, blocked, selected, onSelect }) {
  // animate live transitions (someone else booked it / it was cancelled) without animating first paint
  const [flash, setFlash] = useState(null);
  const previous = useRef(state);
  useEffect(() => {
    const before = previous.current;
    previous.current = state;
    if (before === state) return;
    let kind = null;
    if (state === 'booked') kind = 'booked';
    else if (state === 'available' && (before === 'booked' || before === 'mine')) kind = 'freed';
    else if (state === 'mine') kind = 'mine';
    if (!kind) return;
    setFlash(kind);
    const timer = window.setTimeout(() => setFlash(null), 900);
    return () => window.clearTimeout(timer);
  }, [state]);
  const lockedFree = state === 'available' && blocked;
  const disabled = state === 'booked' || state === 'pending';
  let icon = <DoorOpen size={15} />;
  if (state === 'booked') icon = <Lock size={14} />;
  else if (state === 'mine') icon = <KeyRound size={15} />;
  else if (state === 'pending') icon = <Spinner size={15} />;
  else if (lockedFree) icon = <DoorClosed size={15} />;
  return (
    <button
      type="button"
      className={cx('room', `room--${state}`, lockedFree && 'is-blocked', selected && 'is-selected', flash && `is-flash-${flash}`)}
      disabled={disabled}
      aria-disabled={lockedFree || undefined}
      aria-label={`Room ${room.number}, floor ${room.floor}, ${SPOKEN[state]}`}
      onClick={() => onSelect(room, state)}
    >
      <span className="room__top">
        <span className="room__floor">F{room.floor}</span>
        <span className="room__icon">{icon}</span>
      </span>
      <span className="room__number num">{room.number}</span>
      <span className="room__state">{LABEL[state]}</span>
    </button>
  );
}

// a live update touches one room; memo keeps the other 239 tiles from re-rendering
export const RoomTile = memo(RoomTileBase);
