import { Link } from 'react-router-dom';
import { AuthShell } from '../components/auth/AuthShell';
import { AuthCard } from '../components/auth/AuthCard';
import { RegisterForm } from '../components/auth/RegisterForm';

export function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Create your account"
      heading="Move in on your terms."
      lead="A resident account takes a minute. Then pick a floor, choose a free room and confirm - it is yours."
    >
      <AuthCard
        title="Create your account"
        subtitle="You'll be signed in straight away."
        footer={
          <>
            Already registered? <Link to="/login">Log in</Link>
          </>
        }
      >
        <RegisterForm />
      </AuthCard>
    </AuthShell>
  );
}
