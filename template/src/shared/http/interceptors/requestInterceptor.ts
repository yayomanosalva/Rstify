import type { InternalAxiosRequestConfig } from 'axios';

export function requestInterceptor(config: InternalAxiosRequestConfig) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}
