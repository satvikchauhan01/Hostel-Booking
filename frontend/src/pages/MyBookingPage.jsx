import { useRef, useState } from 'react';
import { DoorClosed, Info } from 'lucide-react';
import { EmptyBookingState } from '../components/booking/EmptyBookingState';
import { ConfirmCancelModal } from '../components/booking/ConfirmCancelModal';
import { MyBookingCard } from '../components/booking/MyBookingCard';
import { RoomLocator } from '../components/booking/RoomLocator';
import { ErrorState } from '../components/ui/ErrorState';
import { RateLimitNotice } from '../components/ui/RateLimitNotice';
import { Skeleton } from '../components/ui/Skeleton';
import { ConnectionIndicator } from '../components/rooms/ConnectionIndicator';
import { useActionCooldown, useMyBooking } from '../hooks/useRooms';
import { newIdempotencyKey } from '../utils/id';

export function MyBookingPage() {
  const { myBooking, status, error, reload, cancelBooking } = useMyBooking();
  const cooldown = useActionCooldown();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  // one key per cancel attempt: if the request is retried the server recognises it instead of cancelling twice
  const keyRef = useRef('');
  const openConfirm = () => {
    keyRef.current = newIdempotencyKey();
    setConfirming(true);
  };
  const confirmCancel = async () => {
    setBusy(true);
    const result = await cancelBooking(keyRef.current);
    setBusy(false);
    // stay open on a rate limit so the countdown is visible, otherwise the toast has said everything
    if (result.ok || result.error.kind !== 'rate-limit') setConfirming(false);
  };
  return (
    <div className="container page page-body">
      <header className="page-head">
        <div>
          <p className="eyebrow">Your reservation</p>
          <h1 className="page-head__title">My booking</h1>
          <p className="page-head__sub">Everything about the room you are holding, and the way to let it go.</p>
        </div>
        <ConnectionIndicator />
      </header>

      {status === 'loading' && (
        <div className="unit-grid" aria-busy="true">
          <span className="sr-only">Loading your booking…</span>
          <Skeleton height={420} radius="var(--radius-xl)" />
          <Skeleton height={300} radius="var(--radius-xl)" />
        </div>
      )}

      {status === 'error' && <ErrorState title="Couldn't load your booking." error={error} onRetry={() => void reload()} />}

      {status === 'ready' && !myBooking && <EmptyBookingState />}

      {status === 'ready' && myBooking && (
        <>
          <RateLimitNotice seconds={cooldown} compact />
          <div className="unit-grid">
            <MyBookingCard booking={myBooking} onCancel={openConfirm} cancelDisabled={cooldown > 0} />

            <div className="unit-side">
              <RoomLocator booking={myBooking} />
              <aside className="notes">
                <p>
                  <Info size={16} aria-hidden="true" />
                  <span>You can hold one room at a time.</span>
                </p>
                <p>
                  <DoorClosed size={16} aria-hidden="true" />
                  <span>Cancelling releases the room immediately, and it shows as free to everyone on the map.</span>
                </p>
              </aside>
            </div>
          </div>
        </>
      )}

      <ConfirmCancelModal
        booking={confirming ? myBooking : null}
        busy={busy}
        cooldown={cooldown}
        onConfirm={() => void confirmCancel()}
        onClose={() => setConfirming(false)}
      />
    </div>
  );
}
