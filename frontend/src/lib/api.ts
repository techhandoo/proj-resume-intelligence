import axios from 'axios';

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL || '') + '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  // AI inference + cold starts on free-tier hosts can exceed 30s; give the backend room to respond.
  timeout: 120000,
});

// Request interceptor — attach auth token when available + correlation ID so
// frontend requests can be traced through the backend logs (MDC 'requestId').
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['X-Request-Id'] =
      (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  },
);

export default api;
