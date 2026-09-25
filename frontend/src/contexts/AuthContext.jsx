import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { authApi } from '../services/api';
import { ApiRequestError, configureHttp } from '../services/http';
import { storage } from '../services/storage';
import { useToast } from '../hooks/useToast';

export const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const toast = useToast();
  const [token, setToken] = useState(() => storage.getToken());
  const [user, setUser] = useState(() => storage.getUser());
  const [status, setStatus] = useState(() => (storage.getToken() ? 'checking' : 'anonymous'));
  const tokenRef = useRef(token);
  tokenRef.current = token;
  const statusRef = useRef(status);
  statusRef.current = status;
  const clearSession = useCallback(() => {
    storage.setToken(null);
    storage.setUser(null);
    tokenRef.current = null;
    setToken(null);
    setUser(null);
    setStatus('anonymous');
  }, []);
  const expireSession = useCallback(() => {
    // a 401 can arrive from several parallel requests - only announce it once
    if (tokenRef.current === null) return;
    clearSession();
    toast.warning('Session expired. Please log in again.');
  }, [clearSession, toast]);
  // configured during the first render so it is ready before any child effect fires a request
  const expireRef = useRef(expireSession);
  expireRef.current = expireSession;
  useState(() => {
    configureHttp({ getToken: () => tokenRef.current, onUnauthorized: () => expireRef.current() });
    return null;
  });
  // validate a stored token on startup
  useEffect(() => {
    if (statusRef.current !== 'checking') return;
    let cancelled = false;
    authApi
      .me()
      .then((fresh) => {
        if (cancelled) return;
        storage.setUser(fresh);
        setUser(fresh);
        setStatus('authenticated');
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiRequestError && err.kind === 'network' && storage.getUser()) {
          // can't reach the server: trust the cached session, the first real request will settle it
          setStatus('authenticated');
        } else if (tokenRef.current !== null) {
          clearSession();
        }
      });
    return () => {
      cancelled = true;
    };
  }, [clearSession]);
  const login = useCallback(async (email, password) => {
    const result = await authApi.login(email, password);
    storage.setToken(result.token);
    storage.setUser(result.user);
    tokenRef.current = result.token;
    setToken(result.token);
    setUser(result.user);
    setStatus('authenticated');
  }, []);
  const register = useCallback(
    async (name, email, password) => {
      await authApi.register(name, email, password);
      try {
        await login(email, password);
        return 'logged-in';
      } catch {
        return 'account-created';
      }
    },
    [login],
  );
  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);
  const value = useMemo(() => ({ user, token, status, login, register, logout }), [user, token, status, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
