import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../../utils/cx';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
/** Accessible dialog: portal, focus trap, Escape to close, focus restored to the trigger. */
export function Modal({ open, onClose, title, description, icon, tone = 'primary', busy = false, children, actions }) {
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const busyRef = useRef(busy);
  busyRef.current = busy;
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement;
    const panel = panelRef.current;
    // land on the safest action first (the first button), which is the "keep / cancel" one
    const firstFocusable = panel?.querySelector(FOCUSABLE);
    (firstFocusable ?? panel)?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !busyRef.current) {
        event.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab' || !panel) return;
      const items = [...panel.querySelectorAll(FOCUSABLE)];
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open]);
  if (!open) return null;
  return createPortal(
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose();
      }}
    >
      <div
        ref={panelRef}
        className={cx('modal', `modal--${tone}`)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
      >
        {icon && <div className="modal__icon">{icon}</div>}
        <h2 id={titleId} className="modal__title">
          {title}
        </h2>
        {description && (
          <div id={descId} className="modal__description">
            {description}
          </div>
        )}
        {children && <div className="modal__body">{children}</div>}
        <div className="modal__actions">{actions}</div>
      </div>
    </div>,
    document.body,
  );
}
