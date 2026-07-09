import { Input } from '@/shared/components/ui-ux';
import type { UserFilters as UserFilterType } from '../types';

interface UserFiltersProps {
  filters: UserFilterType;
  onChange: (filters: UserFilterType) => void;
  onSearch?: () => void;
}

export function UserFilters({ filters, onChange, onSearch }: UserFiltersProps) {
  return (
    <div className="flex gap-4">
      <Input
        placeholder="Search..."
        value={filters.search || ''}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
      />
      <select
        className="border rounded px-3 py-2"
        value={filters.status || ''}
        onChange={(e) => onChange({ ...filters, status: e.target.value as any })}
      >
        <option value="">All status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="pending">Pending</option>
      </select>
    </div>
  );
}
