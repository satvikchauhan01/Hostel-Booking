import { Link } from 'react-router-dom';
import { CalendarClock, Layers, Map } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { formatDateTime, formatRelative } from '../../utils/format';

/** The room number is the anchor: it is drawn as a door plate, everything else supports it. */
export function MyBookingCard({ booking, onCancel, cancelDisabled }) {
  const isActive = booking.status.toUpperCase() === 'ACTIVE';
  return (
    <article className="unit" aria-label={`Your booking: room ${booking.roomNumber}`}>
      <header className="unit__head">
        <span className="eyebrow">Your room</span>
        <Badge tone={isActive ? 'success' : 'neutral'} icon={<span className="unit__dot" aria-hidden="true" />}>
          {isActive ? 'Active' : booking.status}
        </Badge>
      </header>

      <div className="unit__plate">
        <span className="unit__plate-label">Room</span>
        <span className="unit__number num">{booking.roomNumber}</span>
        <span className="unit__plate-floor">Floor {booking.floor}</span>
      </div>

      <dl className="unit__facts">
        <div>
          <dt>
            <Layers size={15} aria-hidden="true" /> Floor
          </dt>
          <dd className="num">{booking.floor}</dd>
        </div>
        <div>
          <dt>
            <CalendarClock size={15} aria-hidden="true" /> Booked
          </dt>
          <dd>
            {formatDateTime(booking.allocatedAt)}
            <span className="unit__ago">{formatRelative(booking.allocatedAt)}</span>
          </dd>
        </div>
      </dl>

      <div className="unit__actions">
        <Link to="/" className="btn btn--secondary btn--md">
          <span className="btn__content">
            <Map size={16} aria-hidden="true" />
            <span className="btn__label">View on map</span>
          </span>
        </Link>
        <Button variant="danger" onClick={onCancel} disabled={cancelDisabled}>
          Cancel booking
        </Button>
      </div>
    </article>
  );
}
