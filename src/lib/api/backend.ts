// Backend API configuration for MongoDB backend
const BASE_URL = 'http://localhost:3000/api';

// Base API class with common functionality
class BackendAPI {
  private baseURL: string;

  constructor(baseURL: string = BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    const token = localStorage.getItem('auth_token') || 
                  localStorage.getItem('token') || 
                  localStorage.getItem('authToken') || 
                  localStorage.getItem('userToken');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
        
        // Don't log auth errors as harshly since we have fallback
        if (response.status === 401) {
          console.warn(`Auth issue for ${endpoint}: ${errorMessage}`);
        } else {
          console.error(`API request failed: ${endpoint}`, errorMessage);
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data.data || data; // Backend returns { success, data, message }
    } catch (error) {
      // Only log network errors, not auth fallbacks
      if (error instanceof Error && !error.message.includes('User not found')) {
        console.error(`API request failed: ${endpoint}`, error);
      }
      throw error;
    }
  }

  protected get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', ...options });
  }

  protected post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  protected put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  protected patch<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  protected delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', ...options });
  }
}

export default BackendAPI;
