import { useAnimatedNumber } from '../../hooks/useAnimatedNumber';

function Figure({ value }) {
  const shown = useAnimatedNumber(value);
  return <span className="num stat__value">{shown}</span>;
}

export function RoomStatsBar({ scope, scopeLabel, overall, showOverall }) {
  const occupancy = scope.total ? Math.round((scope.booked / scope.total) * 100) : 0;
  // never claim "0% occupied" while something is booked
  const occupancyLabel = scope.booked > 0 && occupancy === 0 ? '<1%' : `${occupancy}%`;
  return (
    <section className="stats" aria-label={`Availability for ${scopeLabel}`}>
      <div className="stat stat--hero">
        <span className="stat__eyebrow">
          <span className="stat__live" aria-hidden="true" />
          Available
        </span>
        <Figure value={scope.available} />
        <span className="stat__sub">{scopeLabel}</span>
      </div>

      <div className="stat">
        <span className="stat__eyebrow">Booked</span>
        <Figure value={scope.booked} />
        <span className="stat__sub">{occupancyLabel} occupied</span>
      </div>

      <div className="stat">
        <span className="stat__eyebrow">Total</span>
        <Figure value={scope.total} />
        <span className="stat__meter" aria-hidden="true">
          <span style={{ width: `${occupancy}%` }} />
        </span>
      </div>

      {showOverall && (
        <p className="stats__overall">
          Whole residence: <strong className="num">{overall.available}</strong> available of{' '}
          <strong className="num">{overall.total}</strong> rooms
        </p>
      )}
    </section>
  );
}
