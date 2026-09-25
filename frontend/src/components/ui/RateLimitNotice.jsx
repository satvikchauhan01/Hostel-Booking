import { Clock } from 'lucide-react';
import { cx } from '../../utils/cx';

/** Visible countdown for a 429. Only the action it belongs to is disabled by the caller. */
export function RateLimitNotice({ seconds, total, compact = false, className }) {
  if (seconds <= 0) return null;
  const span = Math.max(total ?? seconds, seconds);
  const progress = Math.min(100, Math.max(0, (seconds / span) * 100));
  return (
    <div className={cx('ratelimit', compact && 'ratelimit--compact', className)} role="status" aria-live="polite">
      <Clock size={compact ? 15 : 18} className="ratelimit__icon" aria-hidden="true" />
      <div className="ratelimit__text">
        <strong>Too many requests.</strong>
        <span>
          Try again in <span className="num ratelimit__seconds">{seconds}s</span>.
        </span>
      </div>
      <span className="ratelimit__bar" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </span>
    </div>
  );
}
