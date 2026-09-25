import { LogoMark } from '../layout/Logo';

export function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="auth-card">
      <div className="auth-card__brand" aria-hidden="true">
        <LogoMark size={24} />
      </div>
      <header className="auth-card__header">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </header>
      {children}
      <footer className="auth-card__footer">{footer}</footer>
    </div>
  );
}
