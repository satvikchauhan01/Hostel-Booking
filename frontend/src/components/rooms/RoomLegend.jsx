import { DoorOpen, KeyRound, Lock } from 'lucide-react';
import { Spinner } from '../ui/Spinner';

/** Each state differs by colour AND icon AND surface treatment, so colour is never the only cue. */
export function RoomLegend() {
  return (
    <ul className="legend" aria-label="Room status legend">
      <li>
        <span className="legend__swatch legend__swatch--available">
          <DoorOpen size={13} />
        </span>
        Available
      </li>
      <li>
        <span className="legend__swatch legend__swatch--booked">
          <Lock size={13} />
        </span>
        Booked
      </li>
      <li>
        <span className="legend__swatch legend__swatch--mine">
          <KeyRound size={13} />
        </span>
        Yours
      </li>
      <li>
        <span className="legend__swatch legend__swatch--pending">
          <Spinner size={13} />
        </span>
        Pending
      </li>
    </ul>
  );
}
