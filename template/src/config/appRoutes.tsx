import ErrorBoundary from '@/app/ErrorBoundary';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { LoadingSpinner } from '@/shared/components/ui-ux';
import { Suspense, lazy } from 'react';
import { type RouteObject, useRoutes } from 'react-router-dom';

import NotFoundPage from '@/app/not-found/page';

const MainLayout = lazy(() =>
  import('@/app/(main)/layout').then((mod) => ({ default: mod.default })),
);

const HomePage = lazy(() =>
  import('@/app/page').then((mod) => ({ default: mod.default })),
);

const UnauthorizedPage = lazy(() =>
  import('@/app/unauthorized/page').then((mod) => ({ default: mod.default })),
);

const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
    handle: { breadcrumb: 'Home' },
  },

  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
    handle: { breadcrumb: 'Access Denied' },
  },

  {
    path: '*',
    element: <NotFoundPage />,
    handle: { breadcrumb: 'Not Found' },
  },
];

const AppRoutes = () => {
  const element = useRoutes(routes);

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner fullScreen />}>{element}</Suspense>
    </ErrorBoundary>
  );
};

export { routes };
export default AppRoutes;
