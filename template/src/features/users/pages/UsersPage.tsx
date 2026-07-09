import { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import type { UserFilters } from '../types';

export function UsersPage() {
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    limit: 10,
    search: '',
    status: 'active',
    role: '',
  });

  const { data, isLoading, error } = useUsers(filters);

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">User Management</h1>

      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="border rounded px-3 py-2"
          value={filters.search || ''}
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
        />
        <select
          className="border rounded px-3 py-2"
          value={filters.status || ''}
          onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value as any }))}
        >
          <option value="">All status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}

      {data && (
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
              {data.users.map((user) => (
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
      )}
    </div>
  );
}
