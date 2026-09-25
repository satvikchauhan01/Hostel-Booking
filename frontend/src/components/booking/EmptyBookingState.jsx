import { Link } from 'react-router-dom';
import { ArrowRight, DoorOpen } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';

export function EmptyBookingState() {
  return (
    <EmptyState
      icon={<DoorOpen size={30} />}
      title="No room booked yet."
      message="Explore available rooms and reserve your space."
      action={
        <Link to="/" className="btn btn--primary btn--lg">
          <span className="btn__content">
            <span className="btn__label">Browse rooms</span>
            <ArrowRight size={18} aria-hidden="true" />
          </span>
        </Link>
      }
    />
  );
}
