import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage - check the key used in DigitalProducts
    const token = localStorage.getItem('auth_token') || 
                  localStorage.getItem('token') || 
                  localStorage.getItem('authToken') || 
                  localStorage.getItem('userToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear tokens on 401 - use the same keys as in DigitalProducts
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userToken');
      localStorage.removeItem('userId');
      
      // Redirect to login if needed
      if (window.location.pathname !== '/auth/login') {
        console.log('Authentication failed, redirecting to login');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
