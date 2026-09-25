import { API_URL, FALLBACK_RETRY_SECONDS, IDEMPOTENCY_HEADER } from './config';

export class ApiRequestError extends Error {
  constructor(init) {
    super(init.message);
    this.name = 'ApiRequestError';
    this.status = init.status;
    this.kind = init.kind ?? 'http';
    this.retryAfter = init.retryAfter;
    this.errors = init.errors ?? [];
  }
}

let config = { getToken: () => null, onUnauthorized: () => {} };
export function configureHttp(next) {
  config = next;
}

// the backend sends the wait time both as a header and inside the message: "(12 seconds remaining)"
function readRetryAfter(res, message) {
  const header = Number(res.headers.get('Retry-After'));
  if (Number.isFinite(header) && header > 0) return Math.ceil(header);
  const match = /(\d+)\s*seconds?/i.exec(message);
  if (match) return Number(match[1]);
  return FALLBACK_RETRY_SECONDS;
}

export async function request(path, options = {}) {
  const { method = 'GET', body, auth = true, handleUnauthorized = true, idempotencyKey, signal } = options;
  const token = auth ? config.getToken() : null;
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  if (idempotencyKey) headers[IDEMPOTENCY_HEADER] = idempotencyKey;
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new ApiRequestError({ status: 0, kind: 'network', message: "Can't reach the server." });
  }
  let payload = null;
  try {
    payload = await res.json();
  } catch {
    payload = null;
  }
  if (!res.ok) {
    const message = payload?.message ?? res.statusText ?? 'Request failed';
    if (res.status === 401 && token && handleUnauthorized) config.onUnauthorized();
    throw new ApiRequestError({
      status: res.status,
      message,
      errors: payload?.errors,
      retryAfter: res.status === 429 ? readRetryAfter(res, message) : undefined,
    });
  }
  return { data: payload?.data, message: payload?.message ?? '' };
}
