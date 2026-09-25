import { useState } from 'react';
import { Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { Input } from './Input';

export function PasswordInput(props) {
  const [visible, setVisible] = useState(false);
  return (
    <Input
      {...props}
      type={visible ? 'text' : 'password'}
      leading={<LockKeyhole size={17} />}
      trailing={
        <button
          type="button"
          className={`eye-toggle ${visible ? 'is-visible' : ''}`}
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
        >
          <Eye size={18} className="eye-toggle__open" />
          <EyeOff size={18} className="eye-toggle__closed" />
        </button>
      }
    />
  );
}
