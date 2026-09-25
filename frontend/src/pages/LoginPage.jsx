import { Link } from 'react-router-dom';
import { AuthShell } from '../components/auth/AuthShell';
import { AuthCard } from '../components/auth/AuthCard';
import { LoginForm } from '../components/auth/LoginForm';

export function LoginPage() {
  return (
    <AuthShell
      eyebrow="Residence booking"
      heading="Your room, on a live map."
      lead="Browse every floor, watch availability change in real time, and reserve your space in a couple of clicks."
    >
      <AuthCard
        title="Welcome back"
        subtitle="Log in to see which rooms are free right now."
        footer={
          <>
            New to Quarters? <Link to="/register">Create an account</Link>
          </>
        }
      >
        <LoginForm />
      </AuthCard>
    </AuthShell>
  );
}
