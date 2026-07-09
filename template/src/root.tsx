import ThemeWrapper from '@/shared/components/ThemeWrapper';
import { LoadingSpinner } from '@/shared/components/ui-ux';
import { Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';

interface RootProps {
  children: React.ReactNode;
}

export default function Root({ children }: RootProps) {
  return (
    <HelmetProvider>
      <ThemeWrapper>
        <Suspense fallback={<LoadingSpinner fullScreen />}>{children}</Suspense>
      </ThemeWrapper>
    </HelmetProvider>
  );
}
