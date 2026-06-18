import { createRoute, redirect } from '@tanstack/react-router';
import { rootRoute } from './__root';
import CartPage from '../pages/CartPage';
import { isUserAuthenticated } from '../utils/auth';

export const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  beforeLoad: () => {
    if (!isUserAuthenticated()) {
      throw redirect({ to: '/login' });
    }
  },
  component: CartPage,
});
