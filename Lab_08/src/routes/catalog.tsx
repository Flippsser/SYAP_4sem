import { createRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import { rootRoute } from './__root';
import CatalogPage from '../pages/CatalogPage';
import { isUserAuthenticated } from '../utils/auth';

const catalogSearchSchema = z.object({
  category: z.string().optional().catch(undefined),
});

function CatalogRoutePage() {
  const search = catalogRoute.useSearch();
  return <CatalogPage category={search.category} />;
}

export const catalogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/catalog',
  validateSearch: (search) => catalogSearchSchema.parse(search),
  beforeLoad: () => {
    if (!isUserAuthenticated()) {
      throw redirect({ to: '/login' });
    }
  },
  component: CatalogRoutePage,
});
