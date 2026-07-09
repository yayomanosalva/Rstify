import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <>
      <Helmet>
        <title>User Detail</title>
      </Helmet>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">User Detail</h1>
        <p className="text-muted-foreground">User ID: {id}</p>
      </div>
    </>
  );
}
