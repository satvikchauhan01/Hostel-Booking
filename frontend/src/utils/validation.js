import { NAME_MAX_LENGTH, PASSWORD_RULES } from '../services/config';

// deliberately the same rules the backend enforces; the server remains the source of truth
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function validateEmail(value) {
  const v = value.trim();
  if (!v) return 'Enter your email address.';
  if (!EMAIL_REGEX.test(v)) return 'Enter a valid email address.';
  return undefined;
}

export function validateLoginPassword(value) {
  return value ? undefined : 'Enter your password.';
}

export function validateNewPassword(value) {
  if (!value) return 'Choose a password.';
  if (value.length < PASSWORD_RULES.min) return `Use at least ${PASSWORD_RULES.min} characters.`;
  if (new TextEncoder().encode(value).length > PASSWORD_RULES.max) return `Use at most ${PASSWORD_RULES.max} characters.`;
  return undefined;
}

export function validateName(value) {
  const v = value.trim();
  if (!v) return 'Enter your name.';
  if (v.length > NAME_MAX_LENGTH) return `Keep your name under ${NAME_MAX_LENGTH} characters.`;
  return undefined;
}

export function validateConfirm(password, confirm) {
  if (!confirm) return 'Re-enter your password.';
  if (confirm !== password) return "Passwords don't match.";
  return undefined;
}

/** Guidance only - the backend only enforces length. */
export function passwordStrength(value) {
  if (!value) return { score: 0, label: '' };
  let score = 0;
  if (value.length >= PASSWORD_RULES.min) score += 1;
  if (value.length >= 12) score += 1;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
  if (/\d/.test(value) && /[^A-Za-z0-9]/.test(value)) score += 1;
  if (value.length < PASSWORD_RULES.min) score = Math.min(score, 1);
  const labels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];
  return { score, label: labels[score] };
}
