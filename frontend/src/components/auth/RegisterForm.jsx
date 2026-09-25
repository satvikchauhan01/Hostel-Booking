import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircleAlert, Mail, UserRound, UserPlus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { PasswordInput } from '../ui/PasswordInput';
import { RateLimitNotice } from '../ui/RateLimitNotice';
import { PasswordStrength } from './PasswordStrength';
import { useAuth } from '../../hooks/useAuth';
import { useCountdown } from '../../hooks/useCountdown';
import { useToast } from '../../hooks/useToast';
import { describeError } from '../../utils/errors';
import { firstName } from '../../utils/format';
import { PASSWORD_RULES } from '../../services/config';
import { validateConfirm, validateEmail, validateName, validateNewPassword } from '../../utils/validation';

export function RegisterForm() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: '', email: '', password: '', confirm: '' });
  const [touched, setTouched] = useState({ name: false, email: false, password: false, confirm: false });
  const [serverErrors, setServerErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [cooldown, setCooldown] = useState(null);
  const refs = {
    name: useRef(null),
    email: useRef(null),
    password: useRef(null),
    confirm: useRef(null),
  };
  const wait = useCountdown(cooldown?.until ?? null);
  const errors = {
    name: validateName(values.name),
    email: validateEmail(values.email),
    password: validateNewPassword(values.password),
    confirm: validateConfirm(values.password, values.confirm),
  };
  const set = (field) => (event) => {
    setValues((v) => ({ ...v, [field]: event.target.value }));
    setServerErrors((s) => ({ ...s, [field]: undefined }));
  };
  const blur = (field) => () => setTouched((t) => ({ ...t, [field]: true }));
  const shown = (field) => (touched[field] ? (errors[field] ?? serverErrors[field]) : serverErrors[field]);
  const onSubmit = async (event) => {
    event.preventDefault();
    setTouched({ name: true, email: true, password: true, confirm: true });
    setFormError(null);
    const firstInvalid = ['name', 'email', 'password', 'confirm'].find((f) => errors[f]);
    if (firstInvalid) return refs[firstInvalid].current?.focus();
    setSubmitting(true);
    try {
      const outcome = await register(values.name.trim(), values.email.trim(), values.password);
      if (outcome === 'account-created') {
        toast.success('Account created. Please log in.');
        navigate('/login', { replace: true });
      } else {
        toast.success(`Welcome to Quarters, ${firstName(values.name)}.`);
        // PublicOnlyRoute redirects into the app now that the session exists
      }
    } catch (err) {
      const ui = describeError(err, 'register');
      if (ui.kind === 'rate-limit') {
        const seconds = ui.retryAfter ?? 30;
        setCooldown({ until: Date.now() + seconds * 1000, total: seconds });
      } else if (/already exists/i.test(ui.message)) {
        setServerErrors({ email: 'An account with this email already exists.' });
        refs.email.current?.focus();
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
        ref={refs.name}
        label="Full name"
        name="name"
        autoComplete="name"
        placeholder="Ada Lovelace"
        value={values.name}
        onChange={set('name')}
        onBlur={blur('name')}
        error={shown('name')}
        leading={<UserRound size={17} />}
        autoFocus
      />

      <Input
        ref={refs.email}
        label="Email"
        type="email"
        name="email"
        autoComplete="email"
        inputMode="email"
        placeholder="you@university.edu"
        value={values.email}
        onChange={set('email')}
        onBlur={blur('email')}
        error={shown('email')}
        leading={<Mail size={17} />}
      />

      <div className="form__group">
        <PasswordInput
          ref={refs.password}
          label="Password"
          name="password"
          autoComplete="new-password"
          placeholder={`At least ${PASSWORD_RULES.min} characters`}
          value={values.password}
          onChange={set('password')}
          onBlur={blur('password')}
          error={shown('password')}
        />
        <PasswordStrength value={values.password} />
      </div>

      <PasswordInput
        ref={refs.confirm}
        label="Confirm password"
        name="confirm"
        autoComplete="new-password"
        placeholder="Repeat your password"
        value={values.confirm}
        onChange={set('confirm')}
        onBlur={blur('confirm')}
        error={shown('confirm')}
      />

      {formError && (
        <div className="form-alert" role="alert">
          <CircleAlert size={17} aria-hidden="true" />
          <span>{formError}</span>
        </div>
      )}

      <RateLimitNotice seconds={wait} total={cooldown?.total} />

      <Button type="submit" variant="primary" size="lg" block loading={submitting} disabled={wait > 0} icon={<UserPlus size={18} />}>
        Create account
      </Button>
    </form>
  );
}
