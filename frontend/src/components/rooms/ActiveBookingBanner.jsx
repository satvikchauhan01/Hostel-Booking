import { Link } from 'react-router-dom';
import { ArrowRight, KeyRound } from 'lucide-react';
import { formatRelative } from '../../utils/format';

export function ActiveBookingBanner({ booking }) {
  const when = formatRelative(booking.allocatedAt);
  return (
    <section className="booking-banner" aria-label="Your current booking">
      <div className="booking-banner__plate" aria-hidden="true">
        <KeyRound size={20} />
      </div>
      <div className="booking-banner__text">
        <p className="booking-banner__title">
          You have room <strong className="num">{booking.roomNumber}</strong> reserved.
        </p>
        <p className="booking-banner__sub">
          Floor {booking.floor}
          {when && <> · booked {when}</>}. Other rooms are locked while you hold one.
        </p>
      </div>
      <Link to="/my-booking" className="booking-banner__link">
        View or manage
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </section>
  );
}
