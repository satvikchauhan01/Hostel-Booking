import { useEffect, useState } from 'react';

/** Whole seconds remaining until `until` (epoch ms). Ticks only while there is time left. */
export function useCountdown(until) {
  const compute = () => (until ? Math.max(0, Math.ceil((until - Date.now()) / 1000)) : 0);
  const [remaining, setRemaining] = useState(compute);
  useEffect(() => {
    setRemaining(compute());
    if (!until || until <= Date.now()) return;
    const id = window.setInterval(() => {
      const next = Math.max(0, Math.ceil((until - Date.now()) / 1000));
      setRemaining(next);
      if (next === 0) window.clearInterval(id);
    }, 250);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [until]);
  return remaining;
}
