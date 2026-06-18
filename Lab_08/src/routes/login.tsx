import { createRoute, redirect } from '@tanstack/react-router';
import { rootRoute } from './__root';
import RegistrationForm from '../components/RegistrationForm';
import { isUserAuthenticated } from '../utils/auth';

function LoginPage() {
  return <RegistrationForm />;
}

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  beforeLoad: () => {
    if (isUserAuthenticated()) {
      throw redirect({ to: '/catalog' });
    }
  },
  component: LoginPage,
});
