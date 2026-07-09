import { apiUrl } from '@/config';
import axios from 'axios';

const baseURL = `${apiUrl}/auth`;

export const authClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

authClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

authClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      const requestUrl = error.config?.url || '';
      if (requestUrl.includes('/login') || requestUrl.includes('/register')) {
        return Promise.reject(error);
      }
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export const authApi = {
  login: async (data: { email: string; password: string; rememberMe?: boolean }) => {
    const response = await authClient.post('/login', data);
    return response;
  },

  register: async (data: { email: string; password: string; username: string }) => {
    const response = await authClient.post('/register', data);
    return response;
  },

  logout: async () => {
    const response = await authClient.post('/logout');
    return response;
  },

  getMe: async () => {
    const response = await authClient.get('/me');
    return response;
  },
};
