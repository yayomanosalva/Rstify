import { Outlet } from 'react-router-dom';

interface MainLayoutProps {
  children?: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto p-4">
          <h1 className="text-lg font-bold">App</h1>
        </div>
      </header>
      <main>{children || <Outlet />}</main>
    </div>
  );
}
