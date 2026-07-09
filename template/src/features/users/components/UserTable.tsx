import type { User } from '../types';

interface UserTableProps {
  users: User[];
  loading?: boolean;
}

export function UserTable({ users, loading }: UserTableProps) {
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Email</th>
            <th className="text-left p-2">Role</th>
            <th className="text-left p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b hover:bg-accent">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.role}</td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded text-xs ${
                  user.status === 'active' ? 'bg-green-100 text-green-800' :
                  user.status === 'inactive' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
