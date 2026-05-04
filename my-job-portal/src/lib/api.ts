// API Configuration and utilities for NextJob
import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/proxy';
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000', 10);

// Create axios instance with default config
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for general error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(error)
);

// API endpoints configuration
export const API_ENDPOINTS = {
  JOBS: {
    LIST: '/jobs/jobs',
    GET: '/jobs/jobs/:id',
    SEARCH: '/jobs/search',
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE: '/users/profile',
  },
};

export default apiClient;
