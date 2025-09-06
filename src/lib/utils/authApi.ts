// Auth API utilities for making authenticated requests
import axiosInstance from './axios';

export const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
  // This function is deprecated - use axiosInstance directly instead
  console.warn('makeAuthenticatedRequest is deprecated, use axiosInstance directly');
  
  const method = options.method || 'GET';
  const data = options.body ? JSON.parse(options.body as string) : undefined;
  
  switch (method.toUpperCase()) {
    case 'GET':
      return axiosInstance.get(url);
    case 'POST':
      return axiosInstance.post(url, data);
    case 'PUT':
      return axiosInstance.put(url, data);
    case 'DELETE':
      return axiosInstance.delete(url);
    default:
      throw new Error(`Unsupported method: ${method}`);
  }
};

export const makeAuthenticatedApiCall = async (endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', data?: unknown) => {
  try {
    let response;
    
    switch (method) {
      case 'GET':
        response = await axiosInstance.get(endpoint);
        break;
      case 'POST':
        response = await axiosInstance.post(endpoint, data);
        break;
      case 'PUT':
        response = await axiosInstance.put(endpoint, data);
        break;
      case 'DELETE':
        response = await axiosInstance.delete(endpoint);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
    
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || `API call failed`);
  }
};
