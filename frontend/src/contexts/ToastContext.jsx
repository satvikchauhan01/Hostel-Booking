import { createContext, useCallback, useMemo, useRef, useState } from 'react';

export const ToastContext = createContext(null);
const MAX_VISIBLE = 4;
const DEFAULT_DURATION = { success: 4200, info: 4200, warning: 5500, error: 6500 };
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(1);
  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);
  const push = useCallback((kind, message, options) => {
    const id = nextId.current++;
    const duration = options?.duration ?? DEFAULT_DURATION[kind];
    setToasts((list) => {
      // an identical message that is still on screen would just be noise
      const withoutDuplicate = list.filter((t) => !(t.kind === kind && t.message === message));
      return [...withoutDuplicate, { id, kind, message, duration }].slice(-MAX_VISIBLE);
    });
    return id;
  }, []);
  const value = useMemo(
    () => ({
      toasts,
      push,
      dismiss,
      success: (m) => push('success', m),
      error: (m) => push('error', m),
      warning: (m) => push('warning', m),
      info: (m) => push('info', m),
    }),
    [toasts, push, dismiss],
  );
  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}
