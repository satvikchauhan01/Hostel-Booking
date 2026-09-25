import { Outlet } from 'react-router-dom';
import { ArchBackground } from './ArchBackground';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { SocketProvider } from '../../contexts/SocketContext';
import { RoomsProvider } from '../../contexts/RoomsContext';

/** Shell for every signed-in page. The socket and room data live here so they survive page changes. */
export function AppLayout() {
  return (
    <SocketProvider>
      <RoomsProvider>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <ArchBackground />
        <div className="shell">
          <Navbar />
          <main id="main" className="shell__main">
            <Outlet />
          </main>
          <Footer />
        </div>
      </RoomsProvider>
    </SocketProvider>
  );
}
