import { useSocket } from '../../hooks/useSocket';

const COPY = {
  connected: { label: 'Live', hint: 'Room updates arrive in real time' },
  connecting: { label: 'Connecting…', hint: 'Connecting to live updates' },
  reconnecting: { label: 'Reconnecting…', hint: 'Live updates paused, trying to reconnect' },
};

/** Small, quiet socket status. Announces changes politely to screen readers. */
export function ConnectionIndicator() {
  const { status } = useSocket();
  const { label, hint } = COPY[status];
  return (
    <div className={`conn conn--${status}`} role="status" aria-live="polite" title={hint}>
      <span className="conn__dot" aria-hidden="true" />
      <span className="conn__label">{label}</span>
      <span className="sr-only">. {hint}</span>
    </div>
  );
}
