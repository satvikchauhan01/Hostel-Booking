import { cx } from '../../utils/cx';

export function Badge({ tone = 'neutral', icon, children, className }) {
  return (
    <span className={cx('badge', `badge--${tone}`, className)}>
      {icon}
      {children}
    </span>
  );
}
