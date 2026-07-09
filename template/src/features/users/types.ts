export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt?: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: string;
  status?: 'active' | 'inactive' | 'pending';
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  role?: string;
  status?: 'active' | 'inactive' | 'pending';
  password?: string;
}

export interface UserFilters {
  search?: string;
  status?: 'active' | 'inactive' | 'pending';
  role?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'email' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}
