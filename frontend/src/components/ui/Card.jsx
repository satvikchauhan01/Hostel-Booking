import { cx } from '../../utils/cx';

export function Card({ variant = 'raised', padding = 'md', interactive = false, className, ...rest }) {
  return (
    <div className={cx('card', `card--${variant}`, `card--pad-${padding}`, interactive && 'card--interactive', className)} {...rest} />
  );
}
