import { LogoMark } from './Logo';
import { Spinner } from '../ui/Spinner';

/** Shown while a stored session is being verified, so the app never flashes the wrong screen. */
export function FullScreenLoader({ label = 'Checking your session…' }) {
  return (
    <div className="splash" role="status" aria-live="polite">
      <div className="splash__mark">
        <LogoMark size={30} />
      </div>
      <p className="splash__label">
        <Spinner size={16} /> {label}
      </p>
    </div>
  );
}
