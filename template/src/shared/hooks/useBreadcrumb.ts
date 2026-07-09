import { useLocation } from 'react-router-dom';

export function useBreadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);

  return {
    pathnames,
    currentPath: location.pathname,
  };
}
