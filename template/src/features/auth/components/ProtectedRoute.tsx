import { LoadingSpinner } from '@/shared/components/ui-ux';
import type React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  redirectPath?: string;
  roles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectPath = '/login',
  roles,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`${redirectPath}?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  if (user?.status && user.status !== 'active') {
    return <Navigate to="/unauthorized" replace />;
  }

  if (
    roles?.length &&
    (!user?.roles || !roles.some((role) => user.roles.includes(role)))
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
