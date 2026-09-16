import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach auth token if available
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

// Response interceptor: normalize friendly error message
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let friendlyMessage = 'Something went wrong. Please try again.';

    if (error.response?.data?.message) {
      friendlyMessage = error.response.data.message;
    } else if (error.code === 'ERR_NETWORK') {
      friendlyMessage = 'Unable to connect to the server. Please check your connection.';
    }

    const enhancedError = new Error(friendlyMessage);
    enhancedError.originalError = error;
    enhancedError.status = error.response?.status;
    enhancedError.data = error.response?.data;

    return Promise.reject(enhancedError);
  }
);

export default api;
