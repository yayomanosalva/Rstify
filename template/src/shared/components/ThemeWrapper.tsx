import type { ReactNode } from 'react';

interface ThemeWrapperProps {
  children: ReactNode;
}

export default function ThemeWrapper({ children }: ThemeWrapperProps) {
  return <>{children}</>;
}
