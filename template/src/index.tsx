import '@/shared/styles/globals.css';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './config/appRoutes';
import Root from './root';

const router = createBrowserRouter(routes);
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Root>
      <AuthProvider>
        <RouterProvider router={router} />
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </AuthProvider>
    </Root>
  </QueryClientProvider>
);

const container = document.getElementById('root');
if (!container) throw new Error('Root container not found');

const root = createRoot(container);
root.render(<App />);
