import { ArchBackground } from '../layout/ArchBackground';
import { FloorPlanArt } from '../layout/FloorPlanArt';
import { Logo } from '../layout/Logo';

const NOTES = [
  ['Live map', 'Rooms flip from free to taken the moment someone books.'],
  ['One room each', 'Confirm before you book. Cancel any time from My Booking.'],
  ['Every floor, one view', 'Six floors, forty rooms each, searchable by number.'],
];
/** Split composition shared by login and register: brand + floor plan on the left, form on the right. */
export function AuthShell({ eyebrow, heading, lead, children }) {
  return (
    <main className="auth page">
      <ArchBackground plan={false} />

      <section className="auth__showcase" aria-label="About Quarters">
        <Logo size="lg" showTagline />

        <div className="auth__copy">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="auth__heading">{heading}</h1>
          <p className="auth__lead">{lead}</p>
        </div>

        <div className="auth__art">
          <FloorPlanArt className="plan-art--strong" filled={[1, 3, 4, 8, 11, 13, 14, 18]} mine={6} />
        </div>

        <ul className="auth__notes">
          {NOTES.map(([title, text]) => (
            <li key={title}>
              <strong>{title}</strong>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="auth__panel">{children}</section>
    </main>
  );
}
