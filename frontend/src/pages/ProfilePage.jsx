import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { useAuth } from '../hooks/useAuth';
import { useMyBooking } from '../hooks/useRooms';
import { useToast } from '../hooks/useToast';
import { authApi } from '../services/api';
import { formatDate, initials } from '../utils/format';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const { myBooking } = useMyBooking();
  const toast = useToast();
  // /login does not return the join date, so ask /me once
  const [profile, setProfile] = useState(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let cancelled = false;
    authApi
      .me()
      .then((fresh) => !cancelled && setProfile(fresh))
      .catch(() => {})
      .finally(() => !cancelled && setLoaded(true));
    return () => {
      cancelled = true;
    };
  }, []);
  const current = profile ?? user;
  return (
    <div className="container page page-body">
      <header className="page-head">
        <div>
          <p className="eyebrow">Account</p>
          <h1 className="page-head__title">Profile</h1>
        </div>
      </header>

      <section className="profile" aria-label="Your details">
        <span className="profile__avatar" aria-hidden="true">
          {initials(current?.name, current?.email)}
        </span>
        <dl className="profile__list">
          <div>
            <dt>Name</dt>
            <dd>{current?.name || '—'}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{current?.email}</dd>
          </div>
          <div>
            <dt>Member since</dt>
            <dd>{current?.createdAt ? formatDate(current.createdAt) : loaded ? '—' : <Skeleton width={140} height={18} />}</dd>
          </div>
          <div>
            <dt>Current room</dt>
            <dd>
              {myBooking ? (
                <Link to="/my-booking">
                  Room <span className="num">{myBooking.roomNumber}</span>, floor {myBooking.floor}
                </Link>
              ) : (
                'None'
              )}
            </dd>
          </div>
        </dl>
        <Button
          variant="danger"
          icon={<LogOut size={16} />}
          onClick={() => {
            logout();
            toast.info('You have been signed out.');
          }}
        >
          Log out
        </Button>
      </section>
    </div>
  );
}
