import { useMemo } from 'react';
import { useRooms } from '../../hooks/useRooms';
import { groupByFloor, splitWings } from '../../utils/rooms';

/** Mini floor plan showing where the booked room sits. Built from the real room list, so it never invents a layout. */
export function RoomLocator({ booking }) {
  const { rooms } = useRooms();
  const floorRooms = useMemo(() => groupByFloor(rooms).find((g) => g.floor === booking.floor)?.rooms ?? [], [rooms, booking.floor]);
  if (floorRooms.length === 0) return null;
  const [wingA, wingB] = splitWings(floorRooms);
  const wingOf = wingA.some((r) => r.id === booking.roomId) ? 'first' : 'second';
  const position = (wingOf === 'first' ? wingA : wingB).findIndex((r) => r.id === booking.roomId) + 1;
  const renderWing = (wing) => (
    <div className="locator__wing">
      {wing.map((room) => (
        <span key={room.id} className={`locator__cell ${room.id === booking.roomId ? 'is-mine' : ''}`} />
      ))}
    </div>
  );
  return (
    <figure className="locator">
      <figcaption className="locator__caption">
        <strong>Where it is</strong>
        <span>
          Floor {booking.floor}, {wingOf} wing, room {position} of {(wingOf === 'first' ? wingA : wingB).length}
        </span>
      </figcaption>
      <div className="locator__plan" role="img" aria-label={`Room ${booking.roomNumber} on floor ${booking.floor}, ${wingOf} wing`}>
        {renderWing(wingA)}
        <div className="locator__corridor">
          <span>Corridor</span>
        </div>
        {renderWing(wingB)}
      </div>
    </figure>
  );
}
