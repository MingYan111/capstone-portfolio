import axios from 'axios';

// Base URL: use VITE_API_URL when provided (production build), otherwise the
// Vite dev-server proxy handles /api -> http://localhost:5000.
// Note: all API calls in the app use paths WITHOUT the /api prefix, so the
// prefix must be appended here (dev: '/api', prod: '<host>/api').
const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api';

const api = axios.create({ baseURL });

// Attach the JWT token to every request if it exists.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global error helper: extract a readable message from an API error.
export const getErrorMessage = (error, fallback = 'Something went wrong') => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
};

export default api;
