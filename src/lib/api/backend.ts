import { AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosInstance from '../utils/axios'; 

class BackendAPI {
  private async request<T>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    endpoint: string,
    data?: any,
    options?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axiosInstance.request({
        url: endpoint,
        method,
        data,
        ...options,
      });

      return (response.data as any).data || response.data;
    } catch (error: any) {
      const status = error.response?.status;
      const message =
        error.response?.data?.message ||
        `HTTP error! status: ${status || 'unknown'}`;

      if (status === 401) {
        console.warn(`Auth issue for ${endpoint}: ${message}`);
      } else {
        console.error(`API request failed: ${endpoint}`, message);
      }

      throw new Error(message);
    }
  }

  protected get<T>(endpoint: string, options?: AxiosRequestConfig): Promise<T> {
    return this.request<T>('get', endpoint, undefined, options);
  }

  protected post<T>(endpoint: string, data?: any, options?: AxiosRequestConfig): Promise<T> {
    return this.request<T>('post', endpoint, data, options);
  }

  protected put<T>(endpoint: string, data?: any, options?: AxiosRequestConfig): Promise<T> {
    return this.request<T>('put', endpoint, data, options);
  }

  protected patch<T>(endpoint: string, data?: any, options?: AxiosRequestConfig): Promise<T> {
    return this.request<T>('patch', endpoint, data, options);
  }

  protected delete<T>(endpoint: string, options?: AxiosRequestConfig): Promise<T> {
    return this.request<T>('delete', endpoint, undefined, options);
  }
}

export default BackendAPI;
