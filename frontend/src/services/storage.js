import { STORAGE_KEYS } from './config';

// storage can throw (private mode, blocked cookies) - the app must keep working without it
function read(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key, value) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

export const storage = {
  getToken: () => read(STORAGE_KEYS.token),
  setToken: (token) => write(STORAGE_KEYS.token, token),
  getUser() {
    const raw = read(STORAGE_KEYS.user);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  setUser: (user) => write(STORAGE_KEYS.user, user ? JSON.stringify(user) : null),
  getTheme: () => read(STORAGE_KEYS.theme),
  setTheme: (theme) => write(STORAGE_KEYS.theme, theme),
  getFloor: () => read(STORAGE_KEYS.floor),
  setFloor: (floor) => write(STORAGE_KEYS.floor, floor),
};
