import { createContext, useEffect, useMemo, useState } from 'react';
import { createSocket } from '../services/socket';

export const SocketContext = createContext(null);
/** Mounted only inside the authenticated part of the app, so the connection lives exactly as long as the session. */
export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [status, setStatus] = useState('connecting');
  useEffect(() => {
    const s = createSocket();
    setSocket(s);
    const onConnect = () => setStatus('connected');
    const onDown = () => setStatus('reconnecting');
    const onDisconnect = (reason) => {
      // "io client disconnect" is us closing the socket on purpose
      if (reason !== 'io client disconnect') setStatus('reconnecting');
    };
    s.on('connect', onConnect);
    s.on('disconnect', onDisconnect);
    s.on('connect_error', onDown);
    s.io.on('reconnect_attempt', onDown);
    return () => {
      s.off('connect', onConnect);
      s.off('disconnect', onDisconnect);
      s.off('connect_error', onDown);
      s.io.off('reconnect_attempt', onDown);
      s.disconnect();
      setSocket(null);
    };
  }, []);
  const value = useMemo(() => ({ socket, status }), [socket, status]);
  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}
