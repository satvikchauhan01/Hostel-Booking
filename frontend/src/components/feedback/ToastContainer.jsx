import { useEffect, useRef, useState } from 'react';
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { cx } from '../../utils/cx';

const ICONS = {
  success: CircleCheck,
  error: CircleAlert,
  warning: TriangleAlert,
  info: Info,
};

const LEAVE_MS = 180;
function Toast({ toast, onDismiss }) {
  const [leaving, setLeaving] = useState(false);
  const [paused, setPaused] = useState(false);
  const Icon = ICONS[toast.kind];
  const timer = useRef(undefined);
  const close = () => {
    setLeaving(true);
    window.setTimeout(() => onDismiss(toast.id), LEAVE_MS);
  };
  const closeRef = useRef(close);
  closeRef.current = close;
  // auto-dismiss, paused while the pointer or keyboard focus is on the toast
  useEffect(() => {
    if (paused || leaving) return;
    timer.current = window.setTimeout(() => closeRef.current(), toast.duration);
    return () => window.clearTimeout(timer.current);
  }, [paused, leaving, toast.duration]);
  return (
    <div
      className={cx('toast', `toast--${toast.kind}`, leaving && 'is-leaving')}
      role={toast.kind === 'error' || toast.kind === 'warning' ? 'alert' : 'status'}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <span className="toast__icon">
        <Icon size={18} aria-hidden="true" />
      </span>
      <p className="toast__message">{toast.message}</p>
      <button type="button" className="toast__close" onClick={close} aria-label="Dismiss notification">
        <X size={15} />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, dismiss } = useToast();
  return (
    <div className="toast-region" role="region" aria-label="Notifications">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={dismiss} />
      ))}
    </div>
  );
}
