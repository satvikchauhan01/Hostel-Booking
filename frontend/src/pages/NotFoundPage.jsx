import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ArchBackground } from '../components/layout/ArchBackground';
import { Logo } from '../components/layout/Logo';

export function NotFoundPage() {
  return (
    <div className="notfound page">
      <ArchBackground />
      <div className="container">
        <Logo />
      </div>

      <main className="notfound__main">
        <div className="door-plate" aria-hidden="true">
          <span className="door-plate__label">Room</span>
          <span className="door-plate__number num">404</span>
          <span className="door-plate__note">Not on any floor</span>
        </div>

        <h1 className="notfound__title">This room doesn't exist.</h1>
        <p className="notfound__text">Let's get you back to the residence.</p>

        <Link to="/" className="btn btn--primary btn--lg">
          <span className="btn__content">
            <span className="btn__label">Back to rooms</span>
            <ArrowRight size={18} aria-hidden="true" />
          </span>
        </Link>
      </main>
    </div>
  );
}
