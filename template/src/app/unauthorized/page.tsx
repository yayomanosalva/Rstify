import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function UnauthorizedPage() {
  return (
    <>
      <Helmet>
        <title>Access Denied</title>
      </Helmet>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You do not have permission to access this page.
          </p>
          <Link to="/" className="text-primary hover:underline">
            Go home
          </Link>
        </div>
      </div>
    </>
  );
}
