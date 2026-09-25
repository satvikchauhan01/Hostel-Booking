import { passwordStrength } from '../../utils/validation';

/** Guidance only: the backend enforces length, nothing else. */
export function PasswordStrength({ value }) {
  const { score, label } = passwordStrength(value);
  if (!value) return null;
  return (
    <div className={`strength strength--${score}`} aria-live="polite">
      <div className="strength__bars" aria-hidden="true">
        {[1, 2, 3, 4].map((n) => (
          <span key={n} className={n <= score ? 'is-on' : ''} />
        ))}
      </div>
      <span className="strength__label">
        <span className="sr-only">Password strength: </span>
        {label}
      </span>
    </div>
  );
}
