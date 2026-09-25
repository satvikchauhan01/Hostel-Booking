import { DoorClosed } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { RateLimitNotice } from '../ui/RateLimitNotice';

export function ConfirmCancelModal({ booking, busy, cooldown, onConfirm, onClose }) {
  return (
    <Modal
      open={booking !== null}
      onClose={onClose}
      busy={busy}
      tone="danger"
      icon={<DoorClosed size={26} />}
      title="Cancel your booking?"
      description={
        booking ? (
          <>
            Room <strong className="num">{booking.roomNumber}</strong> will be released straight away and anyone can book it.
          </>
        ) : undefined
      }
      actions={
        <>
          <Button variant="primary" onClick={onClose} disabled={busy}>
            Keep booking
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={busy} disabled={cooldown > 0}>
            Cancel booking
          </Button>
        </>
      }
    >
      <RateLimitNotice seconds={cooldown} compact />
    </Modal>
  );
}
