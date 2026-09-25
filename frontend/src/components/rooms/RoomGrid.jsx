import { useId } from 'react';
import { computeStats, getViewState, splitWings } from '../../utils/rooms';
import { RoomTile } from './RoomTile';

function FloorPlan({ group, floorTotal, floorAvailable, myBooking, pendingRoomId, blocked, selectedRoomId, filtering, onSelect }) {
  const headingId = useId();
  const renderTile = (room) => (
    <RoomTile
      key={room.id}
      room={room}
      state={getViewState(room, myBooking, pendingRoomId)}
      blocked={blocked}
      selected={selectedRoomId === room.id}
      onSelect={onSelect}
    />
  );
  const [wingA, wingB] = splitWings(group.rooms);
  return (
    <section className="plan" aria-labelledby={headingId}>
      <header className="plan__header">
        <h3 id={headingId} className="plan__title">
          Floor <span className="num">{group.floor}</span>
        </h3>
        <p className="plan__counts">
          <span className="num">{floorAvailable}</span> free · <span className="num">{floorTotal - floorAvailable}</span> taken
          {filtering && (
            <>
              {' '}
              · <span className="num">{group.rooms.length}</span> shown
            </>
          )}
        </p>
      </header>

      {filtering ? (
        <div className="wing wing--flat">{group.rooms.map(renderTile)}</div>
      ) : (
        <div className="plan__layout">
          <div className="wing">{wingA.map(renderTile)}</div>
          <div className="corridor" aria-hidden="true">
            <span>Corridor</span>
          </div>
          <div className="wing">{wingB.map(renderTile)}</div>
        </div>
      )}
    </section>
  );
}

export function RoomGrid({ groups, fullGroups, ...rest }) {
  return (
    <div className="plans">
      {groups.map((group) => {
        const full = fullGroups.find((g) => g.floor === group.floor);
        const stats = computeStats(full?.rooms ?? group.rooms);
        return <FloorPlan key={group.floor} group={group} floorTotal={stats.total} floorAvailable={stats.available} {...rest} />;
      })}
    </div>
  );
}
