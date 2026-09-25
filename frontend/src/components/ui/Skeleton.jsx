import { cx } from '../../utils/cx';

/** Shimmering placeholder that matches the inset surfaces of the real UI. */
export function Skeleton({ width, height = 16, radius, className }) {
  const style = { width, height, borderRadius: radius };
  return <span className={cx('skeleton', className)} style={style} aria-hidden="true" />;
}
