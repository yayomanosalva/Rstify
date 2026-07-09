import { AuthProvider } from '@/features/auth/context/AuthContext';
import type { ReactNode } from 'react';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
