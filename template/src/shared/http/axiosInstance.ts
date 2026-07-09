import { apiUrl } from '@/config';
import axios from 'axios';
import { logger } from '../utils/logger';

const API_URL = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    logger.info('Request:', config);
    return config;
  },
  (error) => {
    logger.error('Request error:', error);
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    logger.info('Response:', response);
    return response;
  },
  (error) => {
    logger.error('Response error:', error);
    return Promise.reject(error);
  },
);

export default axiosInstance;
