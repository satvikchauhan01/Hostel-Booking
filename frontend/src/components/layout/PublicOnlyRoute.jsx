import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FullScreenLoader } from './FullScreenLoader';

/** Login / register: signed-in users are sent on to where they were headed (or the room map). */
export function PublicOnlyRoute() {
  const { status } = useAuth();
  const location = useLocation();
  if (status === 'checking') return <FullScreenLoader />;
  if (status === 'authenticated') {
    const from = location.state?.from?.pathname;
    return <Navigate to={from && from !== '/login' && from !== '/register' ? from : '/'} replace />;
  }
  return <Outlet />;
}
