import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from Zustand persist storage (auth-storage)
    const authData = localStorage.getItem('auth-storage');
    if (authData) {
      try {
        const { state } = JSON.parse(authData);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (error) {
        console.error('Error parsing auth data:', error);
      }
    }

    // Get guest session token if available
    const guestToken = localStorage.getItem('guest-token');
    if (guestToken && !config.headers.Authorization) {
      config.headers['x-guest-token'] = guestToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle errors
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;

      if (status === 401) {
        // Check if this is a login/register request - don't redirect
        const isAuthRequest = error.config.url?.includes('/auth/login') ||
                              error.config.url?.includes('/auth/register');

        if (!isAuthRequest) {
          // Unauthorized - clear all auth data and redirect
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('auth-storage'); // Zustand persist key
          localStorage.removeItem('guest-token');

          // Redirect based on current path
          const currentPath = window.location.pathname;
          if (currentPath.startsWith('/admin')) {
            window.location.href = '/admin/login';
          } else if (currentPath.startsWith('/operator')) {
            window.location.href = '/operator/login';
          } else if (currentPath.startsWith('/trip-manager')) {
            window.location.href = '/trip-manager/login';
          } else {
            window.location.href = '/login';
          }
        }
      }

      // Return error message from server
      return Promise.reject(data.message || 'Đã có lỗi xảy ra');
    } else if (error.request) {
      // Request made but no response
      return Promise.reject('Không thể kết nối đến server');
    } else {
      // Something else happened
      return Promise.reject(error.message);
    }
  }
);

export default api;

// Export common API methods
export const apiMethods = {
  get: (url, config) => api.get(url, config),
  post: (url, data, config) => api.post(url, data, config),
  put: (url, data, config) => api.put(url, data, config),
  patch: (url, data, config) => api.patch(url, data, config),
  delete: (url, config) => api.delete(url, config),
};
