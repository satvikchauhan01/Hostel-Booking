import { Link } from 'react-router-dom';
import { cx } from '../../utils/cx';

/** Four rooms, one occupied - the same mark as the favicon. */
export function LogoMark({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round">
        <rect x="3" y="3" width="7.5" height="7.5" rx="1.6" />
        <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6" fill="currentColor" />
        <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6" />
        <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6" />
      </g>
    </svg>
  );
}

export function Logo({ to = '/', size = 'md', showTagline = false, className }) {
  const content = (
    <>
      <span className="logo__mark">
        <LogoMark size={size === 'lg' ? 26 : 22} />
      </span>
      <span className="logo__text">
        <span className="logo__name">Quarters</span>
        {showTagline && <span className="logo__tagline">Hostel room booking</span>}
      </span>
    </>
  );
  return (
    <Link to={to} className={cx('logo', `logo--${size}`, className)} aria-label="Quarters home">
      {content}
    </Link>
  );
}
