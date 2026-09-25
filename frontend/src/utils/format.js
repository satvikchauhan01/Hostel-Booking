const dateTime = new Intl.DateTimeFormat(undefined, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});
const dateOnly = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
function parse(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDateTime(iso) {
  const d = parse(iso);
  return d ? dateTime.format(d) : '—';
}

export function formatDate(iso) {
  const d = parse(iso);
  return d ? dateOnly.format(d) : '—';
}

/** "3 hours ago" style text for a booking timestamp */
export function formatRelative(iso) {
  const d = parse(iso);
  if (!d) return '';
  const seconds = Math.round((Date.now() - d.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
  const steps = [
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];
  for (const [unit, size] of steps) {
    if (Math.abs(seconds) >= size) return rtf.format(-Math.round(seconds / size), unit);
  }
  return 'just now';
}

export function greeting(date = new Date()) {
  const h = date.getHours();
  if (h < 5) return 'Good evening';
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export function firstName(name, fallback = 'there') {
  const trimmed = name?.trim();
  return trimmed ? trimmed.split(/\s+/)[0] : fallback;
}

export function initials(name, email) {
  const source = name?.trim() || email?.trim() || '?';
  const parts = source.split(/[\s@.]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? '?') + (parts.length > 1 ? parts[1][0] : '')).toUpperCase();
}
