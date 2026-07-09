import { Helmet } from 'react-helmet-async';

export default function DashboardPage() {
  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the dashboard.</p>
      </div>
    </>
  );
}
