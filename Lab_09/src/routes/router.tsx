import { createRouter } from '@tanstack/react-router';
import { rootRoute } from './__root';
import { indexRoute } from './index';
import { loginRoute } from './login';
import { catalogRoute } from './catalog';
import { productRoute } from './product.$id';
import { cartRoute } from './cart';

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  catalogRoute,
  productRoute,
  cartRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
