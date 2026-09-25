import { useId } from 'react';
import { cx } from '../../utils/cx';

/** Inset neumorphic text field with label, hint and inline error wired up for screen readers. */
export function Input({ label, error, hint, leading, trailing, className, id, ref, ...rest }) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const messageId = `${inputId}-msg`;
  const message = error ?? hint;
  return (
    <div className={cx('field', error && 'field--error', rest.disabled && 'field--disabled', className)}>
      <label className="field__label" htmlFor={inputId}>
        {label}
      </label>
      <div className="field__control">
        {leading && <span className="field__icon">{leading}</span>}
        <input
          ref={ref}
          id={inputId}
          className="field__input"
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          {...rest}
        />
        {trailing && <span className="field__trailing">{trailing}</span>}
      </div>
      {message && (
        <p id={messageId} className={cx('field__message', error && 'field__message--error')} role={error ? 'alert' : undefined}>
          {message}
        </p>
      )}
    </div>
  );
}
