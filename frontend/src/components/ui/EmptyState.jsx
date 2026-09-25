import { cx } from '../../utils/cx';

export function EmptyState({ icon, title, message, action, tone = 'neutral', className }) {
  return (
    <div className={cx('empty', `empty--${tone}`, className)}>
      <div className="empty__icon">{icon}</div>
      <h2 className="empty__title">{title}</h2>
      {message && <p className="empty__message">{message}</p>}
      {action && <div className="empty__action">{action}</div>}
    </div>
  );
}
