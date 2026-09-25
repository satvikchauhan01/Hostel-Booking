import { cx } from '../../utils/cx';
import { Spinner } from './Spinner';

export function Button({
  variant = 'secondary',
  size = 'md',
  loading = false,
  block = false,
  icon,
  trailingIcon,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}) {
  return (
    <button
      type={type}
      className={cx('btn', `btn--${variant}`, `btn--${size}`, block && 'btn--block', loading && 'is-loading', className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      <span className="btn__content">
        {icon}
        {children !== undefined && children !== null && <span className="btn__label">{children}</span>}
        {trailingIcon}
      </span>
      {loading && <Spinner className="btn__spinner" size={size === 'sm' ? 16 : 20} />}
    </button>
  );
}
