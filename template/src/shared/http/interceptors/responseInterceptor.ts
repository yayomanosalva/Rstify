import type { AxiosResponse, AxiosError } from 'axios';

export function responseInterceptor(response: AxiosResponse) {
  return response;
}

export function responseErrorInterceptor(error: AxiosError) {
  if (error.response?.status === 401) {
    const requestUrl = error.config?.url || '';
    if (!requestUrl.includes('/login') && !requestUrl.includes('/register')) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
  }
  return Promise.reject(error);
}
