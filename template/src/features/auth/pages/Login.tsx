import { LoginForm } from '../components/LoginForm';
import { Helmet } from 'react-helmet-async';

export function LoginPage() {
  return (
    <>
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <LoginForm />
    </>
  );
}
