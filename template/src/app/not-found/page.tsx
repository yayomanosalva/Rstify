import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>404 - Not Found</title>
      </Helmet>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-6">Page not found</p>
          <Link to="/" className="text-primary hover:underline">
            Go home
          </Link>
        </div>
      </div>
    </>
  );
}
