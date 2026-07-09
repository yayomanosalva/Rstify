import { Helmet } from 'react-helmet-async';

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Welcome</h1>
      </div>
    </>
  );
}
