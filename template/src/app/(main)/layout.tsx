import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-background">
        <div className="p-4">
          <h2 className="font-bold">App</h2>
        </div>
        <nav className="px-2 space-y-1">
          <a href="/dashboard" className="block px-3 py-2 rounded hover:bg-accent">
            Dashboard
          </a>
          <a href="/users" className="block px-3 py-2 rounded hover:bg-accent">
            Users
          </a>
        </nav>
      </aside>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
