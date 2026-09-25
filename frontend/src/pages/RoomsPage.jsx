import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, SearchX } from 'lucide-react';
import { ActiveBookingBanner } from '../components/rooms/ActiveBookingBanner';
import { ConnectionIndicator } from '../components/rooms/ConnectionIndicator';
import { FloorSelector } from '../components/rooms/FloorSelector';
import { RoomFilter } from '../components/rooms/RoomFilter';
import { RoomGrid } from '../components/rooms/RoomGrid';
import { RoomLegend } from '../components/rooms/RoomLegend';
import { RoomsSkeleton } from '../components/rooms/RoomsSkeleton';
import { RoomStatsBar } from '../components/rooms/RoomStatsBar';
import { ConfirmBookingModal } from '../components/booking/ConfirmBookingModal';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { RateLimitNotice } from '../components/ui/RateLimitNotice';
import { useAuth } from '../hooks/useAuth';
import { useActionCooldown, useMyBooking, useRooms } from '../hooks/useRooms';
import { useToast } from '../hooks/useToast';
import { storage } from '../services/storage';
import { firstName, greeting } from '../utils/format';
import { computeStats, filterByFloor, filterRooms, groupByFloor } from '../utils/rooms';

const NO_ROOMS = { available: 0, booked: 0, total: 0 };
function readSavedFloor() {
  const saved = storage.getFloor();
  if (!saved || saved === 'all') return 'all';
  const n = Number(saved);
  return Number.isInteger(n) ? n : 'all';
}

export function RoomsPage() {
  const { user } = useAuth();
  const { rooms, status, error, pendingRoomId, reload, bookRoom, setViewFloor } = useRooms();
  const { myBooking } = useMyBooking();
  const cooldown = useActionCooldown();
  const toast = useToast();
  const navigate = useNavigate();
  const [floor, setFloor] = useState(readSavedFloor);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);
  const groups = useMemo(() => groupByFloor(rooms), [rooms]);
  const floors = useMemo(() => groups.map((g) => g.floor), [groups]);
  // a remembered floor might not exist (yet) - fall back to "All" instead of showing nothing
  const activeFloor = floor === 'all' || floors.includes(floor) || floors.length === 0 ? floor : 'all';
  useEffect(() => {
    setViewFloor(activeFloor);
    storage.setFloor(String(activeFloor));
  }, [activeFloor, setViewFloor]);
  const statsByFloor = useMemo(() => Object.fromEntries(groups.map((g) => [g.floor, computeStats(g.rooms)])), [groups]);
  const overall = useMemo(() => computeStats(rooms), [rooms]);
  const scope = activeFloor === 'all' ? overall : (statsByFloor[activeFloor] ?? NO_ROOMS);
  const filtering = query.trim() !== '' || statusFilter !== 'all';
  const visibleGroups = useMemo(
    () =>
      filterByFloor(groups, activeFloor)
        .map((g) => ({ floor: g.floor, rooms: filterRooms(g.rooms, query, statusFilter) }))
        .filter((g) => g.rooms.length > 0),
    [groups, activeFloor, query, statusFilter],
  );
  const fullGroups = useMemo(() => filterByFloor(groups, activeFloor), [groups, activeFloor]);
  const blocked = myBooking !== null || cooldown > 0;
  // the tile callback must stay referentially stable so memoised tiles do not re-render every second of a countdown
  const latest = useRef({ myBooking, cooldown });
  latest.current = { myBooking, cooldown };
  const handleSelect = useCallback(
    (room, state) => {
      if (state === 'mine') return navigate('/my-booking');
      if (state !== 'available') return;
      const { myBooking: held, cooldown: wait } = latest.current;
      if (held) return void toast.info(`You already hold room ${held.roomNumber}. Cancel it to book another.`);
      if (wait > 0) return void toast.warning(`Too many requests. Try again in ${wait}s.`);
      setSelectedId(room.id);
    },
    [navigate, toast],
  );
  const selectedRoom = useMemo(() => rooms.find((r) => r.id === selectedId) ?? null, [rooms, selectedId]);
  // the room got taken (live update) while the dialog was open: close it, the toast already explains why
  useEffect(() => {
    if (selectedRoom && selectedRoom.status === 'BOOKED' && pendingRoomId !== selectedRoom.id && myBooking?.roomId !== selectedRoom.id) {
      setSelectedId(null);
    }
  }, [selectedRoom, pendingRoomId, myBooking]);
  const confirmBooking = async () => {
    if (!selectedRoom) return;
    await bookRoom(selectedRoom.id);
    setSelectedId(null);
  };
  const clearFilters = () => {
    setQuery('');
    setStatusFilter('all');
  };
  const scopeLabel = activeFloor === 'all' ? 'across all floors' : `on floor ${activeFloor}`;
  return (
    <div className="container page page-body">
      <header className="page-head">
        <div>
          <p className="eyebrow">Residence · Room map</p>
          <h1 className="page-head__title">
            {greeting()}, {firstName(user?.name, 'resident')}
          </h1>
          <p className="page-head__sub">
            Pick a floor, choose a free room and confirm. Availability updates the moment anyone books or cancels.
          </p>
        </div>
        <ConnectionIndicator />
      </header>

      {myBooking && <ActiveBookingBanner booking={myBooking} />}

      {status === 'loading' && <RoomsSkeleton />}

      {status === 'error' && <ErrorState error={error} onRetry={() => void reload()} />}

      {status === 'ready' && rooms.length === 0 && (
        <EmptyState
          icon={<Building2 size={28} />}
          title="No rooms yet."
          message="The residence has no rooms listed at the moment. Check back soon."
        />
      )}

      {status === 'ready' && rooms.length > 0 && (
        <>
          <RoomStatsBar scope={scope} scopeLabel={scopeLabel} overall={overall} showOverall={activeFloor !== 'all'} />

          <FloorSelector floors={floors} value={activeFloor} onChange={setFloor} statsByFloor={statsByFloor} overall={overall} />

          <div className="controls">
            <RoomFilter query={query} onQueryChange={setQuery} status={statusFilter} onStatusChange={setStatusFilter} />
            <RoomLegend />
          </div>

          <RateLimitNotice seconds={cooldown} compact />

          {visibleGroups.length > 0 ? (
            <RoomGrid
              groups={visibleGroups}
              fullGroups={fullGroups}
              myBooking={myBooking}
              pendingRoomId={pendingRoomId}
              blocked={blocked}
              selectedRoomId={selectedId}
              filtering={filtering}
              onSelect={handleSelect}
            />
          ) : (
            <EmptyState
              icon={<SearchX size={28} />}
              title="No rooms match."
              message={
                query.trim()
                  ? `No room number on ${activeFloor === 'all' ? 'any floor' : `floor ${activeFloor}`} contains "${query.trim()}"${statusFilter === 'all' ? '' : ` among ${statusFilter} rooms`}.`
                  : `No ${statusFilter} rooms on ${activeFloor === 'all' ? 'any floor' : `floor ${activeFloor}`}.`
              }
              action={<Button onClick={clearFilters}>Clear filters</Button>}
            />
          )}
        </>
      )}

      <ConfirmBookingModal
        room={selectedRoom}
        busy={selectedRoom !== null && pendingRoomId === selectedRoom.id}
        cooldown={cooldown}
        onConfirm={() => void confirmBooking()}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}
