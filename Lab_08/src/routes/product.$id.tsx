import { createRoute, redirect } from '@tanstack/react-router';
import { rootRoute } from './__root';
import ProductDetailsPage from '../pages/ProductDetailsPage';
import { isUserAuthenticated } from '../utils/auth';

function ProductRoutePage() {
  const { id } = productRoute.useParams();
  return <ProductDetailsPage productId={Number(id)} />;
}

export const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/product/$id',
  beforeLoad: () => {
    if (!isUserAuthenticated()) {
      throw redirect({ to: '/login' });
    }
  },
  component: ProductRoutePage,
});
