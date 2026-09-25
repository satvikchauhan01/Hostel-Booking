import { Skeleton } from '../ui/Skeleton';

/** Loading placeholder with the same silhouette as the real page: stats, floor keys, one plan. */
export function RoomsSkeleton() {
  return (
    <div className="rooms-skeleton" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading rooms…</span>

      <div className="stats">
        <Skeleton height={124} radius="var(--radius-lg)" />
        <Skeleton height={124} radius="var(--radius-lg)" />
        <Skeleton height={124} radius="var(--radius-lg)" />
      </div>

      <div className="floors floors--skeleton">
        {Array.from({ length: 7 }, (_, i) => (
          <Skeleton key={i} height={58} radius="var(--radius-md)" />
        ))}
      </div>

      <div className="plan">
        <Skeleton width={160} height={22} />
        <div className="wing wing--skeleton">
          {Array.from({ length: 20 }, (_, i) => (
            <Skeleton key={i} height="100%" radius="var(--radius-sm)" className="room-skeleton" />
          ))}
        </div>
      </div>
    </div>
  );
}
