import axiosInstance from '@/shared/http/axiosInstance';
import type { CreateUserDto, UpdateUserDto, User, UserFilters } from '../types';

export const usersApi = {
  getAll: async (params?: UserFilters) => {
    const response = await axiosInstance.get<{ data: User[]; total: number }>('/users', {
      params: { ...params, page: params?.page || 1, limit: params?.limit || 10 },
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axiosInstance.get<User>(`/users/${id}`);
    return response.data;
  },

  create: async (userData: CreateUserDto) => {
    const response = await axiosInstance.post<User>('/users', userData);
    return response.data;
  },

  update: async (id: string, userData: UpdateUserDto) => {
    const response = await axiosInstance.patch<User>(`/users/${id}`, userData);
    return response.data;
  },

  delete: async (id: string) => {
    await axiosInstance.delete(`/users/${id}`);
  },
};
