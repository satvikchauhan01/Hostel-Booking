import { useRef, useState } from 'react';
import { CircleAlert, Mail, LogIn } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { PasswordInput } from '../ui/PasswordInput';
import { RateLimitNotice } from '../ui/RateLimitNotice';
import { useAuth } from '../../hooks/useAuth';
import { useCountdown } from '../../hooks/useCountdown';
import { useToast } from '../../hooks/useToast';
import { describeError } from '../../utils/errors';
import { validateEmail, validateLoginPassword } from '../../utils/validation';

export function LoginForm() {
  const { login } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [cooldown, setCooldown] = useState(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const wait = useCountdown(cooldown?.until ?? null);
  const errors = { email: validateEmail(email), password: validateLoginPassword(password) };
  const onSubmit = async (event) => {
    event.preventDefault();
    setTouched({ email: true, password: true });
    setFormError(null);
    if (errors.email) return emailRef.current?.focus();
    if (errors.password) return passwordRef.current?.focus();
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      // PublicOnlyRoute takes over and redirects once the session is set
    } catch (err) {
      const ui = describeError(err, 'login');
      if (ui.kind === 'rate-limit') {
        const seconds = ui.retryAfter ?? 30;
        setCooldown({ until: Date.now() + seconds * 1000, total: seconds });
      } else {
        setFormError(ui.message);
        if (ui.kind === 'network' || ui.kind === 'server' || ui.kind === 'unknown') toast.error(ui.message);
      }
      setSubmitting(false);
    }
  };
  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <Input
        ref={emailRef}
        label="Email"
        type="email"
        name="email"
        autoComplete="email"
        inputMode="email"
        placeholder="you@university.edu"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => setTouched((t) => ({ ...t, email: true }))}
        error={touched.email ? errors.email : undefined}
        leading={<Mail size={17} />}
        autoFocus
      />

      <PasswordInput
        ref={passwordRef}
        label="Password"
        name="password"
        autoComplete="current-password"
        placeholder="Your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onBlur={() => setTouched((t) => ({ ...t, password: true }))}
        error={touched.password ? errors.password : undefined}
      />

      {formError && (
        <div className="form-alert" role="alert">
          <CircleAlert size={17} aria-hidden="true" />
          <span>{formError}</span>
        </div>
      )}

      <RateLimitNotice seconds={wait} total={cooldown?.total} />

      <Button type="submit" variant="primary" size="lg" block loading={submitting} disabled={wait > 0} icon={<LogIn size={18} />}>
        Log in
      </Button>
    </form>
  );
}
