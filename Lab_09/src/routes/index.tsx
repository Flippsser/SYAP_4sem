import { createRoute, redirect } from '@tanstack/react-router';
import { rootRoute } from './__root';
import { isUserAuthenticated } from '../utils/auth';

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    if (isUserAuthenticated()) {
      throw redirect({ to: '/catalog' });
    }
    throw redirect({ to: '/login' });
  },
});
