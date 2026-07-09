import { Helmet } from 'react-helmet-async';

export default function ErrorPage() {
  return (
    <>
      <Helmet>
        <title>Error</title>
      </Helmet>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Error</h1>
          <p className="text-muted-foreground">An unexpected error occurred.</p>
        </div>
      </div>
    </>
  );
}
