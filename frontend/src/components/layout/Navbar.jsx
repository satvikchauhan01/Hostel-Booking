import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Building2, KeyRound, LogOut, Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useAuth } from '../../hooks/useAuth';
import { useMyBooking } from '../../hooks/useRooms';
import { useToast } from '../../hooks/useToast';
import { cx } from '../../utils/cx';
import { initials } from '../../utils/format';

export function Navbar() {
  const { user, logout } = useAuth();
  const { myBooking } = useMyBooking();
  const toast = useToast();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  // close the mobile sheet on navigation and on Escape
  useEffect(() => setMenuOpen(false), [location.pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);
  const handleLogout = () => {
    logout();
    toast.info('You have been signed out.');
  };
  const displayName = user?.name?.trim() || user?.email || 'Resident';
  const links = (
    <>
      <NavLink to="/" end className={({ isActive }) => cx('nav__link', isActive && 'is-active')}>
        <Building2 size={17} aria-hidden="true" />
        Rooms
      </NavLink>
      <NavLink to="/my-booking" className={({ isActive }) => cx('nav__link', isActive && 'is-active')}>
        <KeyRound size={17} aria-hidden="true" />
        My Booking
        {myBooking && (
          <span className="nav__pill num" title={`Room ${myBooking.roomNumber}`}>
            {myBooking.roomNumber}
          </span>
        )}
      </NavLink>
    </>
  );
  return (
    <header className="nav-wrap">
      <div className="container">
        <nav className="nav" aria-label="Main">
          <Logo showTagline />

          <div className="nav__links">{links}</div>

          <div className="nav__right">
            <ThemeToggle />
            <NavLink to="/profile" className="user-chip" aria-label="Your profile">
              <span className="user-chip__avatar">{initials(user?.name, user?.email)}</span>
              <span className="user-chip__name">{displayName}</span>
            </NavLink>
            <button type="button" className="nav__logout" onClick={handleLogout}>
              <LogOut size={16} aria-hidden="true" />
              Log out
            </button>
          </div>

          <button
            type="button"
            className="icon-btn nav__menu"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </nav>

        {menuOpen && (
          <div id="mobile-menu" className="nav__sheet">
            <div className="nav__sheet-user">
              <span className="user-chip__avatar">{initials(user?.name, user?.email)}</span>
              <div>
                <strong>{displayName}</strong>
                {user?.name && <span>{user.email}</span>}
              </div>
            </div>
            <div className="nav__sheet-links">
              {links}
              <NavLink to="/profile" className={({ isActive }) => cx('nav__link', isActive && 'is-active')}>
                Profile
              </NavLink>
            </div>
            <div className="nav__sheet-foot">
              <ThemeToggle />
              <button type="button" className="nav__logout" onClick={handleLogout}>
                <LogOut size={16} aria-hidden="true" />
                Log out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
