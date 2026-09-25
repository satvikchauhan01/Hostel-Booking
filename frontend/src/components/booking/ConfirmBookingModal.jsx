import { DoorOpen } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { RateLimitNotice } from '../ui/RateLimitNotice';

export function ConfirmBookingModal({ room, busy, cooldown, onConfirm, onClose }) {
  return (
    <Modal
      open={room !== null}
      onClose={onClose}
      busy={busy}
      icon={<DoorOpen size={26} />}
      title={room ? `Book room ${room.number}, floor ${room.floor}?` : 'Book this room?'}
      description="You can hold one room at a time. You can cancel it later from My Booking."
      actions={
        <>
          <Button onClick={onClose} disabled={busy}>
            Not now
          </Button>
          <Button variant="primary" onClick={onConfirm} loading={busy} disabled={cooldown > 0}>
            Confirm booking
          </Button>
        </>
      }
    >
      {room && (
        <div className="unit-chip" aria-hidden="true">
          <span className="unit-chip__label">Room</span>
          <span className="unit-chip__number num">{room.number}</span>
          <span className="unit-chip__floor">Floor {room.floor}</span>
        </div>
      )}
      <RateLimitNotice seconds={cooldown} compact className="modal__notice" />
    </Modal>
  );
}
