/**
 * API Client with Authentication
 * Centralized HTTP client with automatic token management
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { authStorage } from './authStorage';
import { toast } from 'react-toastify';

export class ApiClient {
  private static instance: ApiClient;
  private axiosInstance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
  }> = [];

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      timeout: 30000,
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private setupInterceptors(): void {
    // Request interceptor - add auth headers
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = authStorage.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Ensure content type is set
        if (!config.headers['Content-Type']) {
          config.headers['Content-Type'] = 'application/json';
        }

        console.log('🔄 API Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          hasAuth: !!token,
        });

        return config;
      },
      (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle auth errors and token refresh
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log('✅ API Response:', {
          status: response.status,
          url: response.config.url,
        });
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        console.error('❌ API Error:', {
          status: error.response?.status,
          url: error.config?.url,
          message: error.response?.data?.message || error.message,
        });

        // Handle 401 Unauthorized errors
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If already refreshing, queue the request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(() => {
              return this.axiosInstance(originalRequest);
            }).catch((err) => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshed = await authStorage.refreshAuthToken();
            
            if (refreshed) {
              // Process failed queue
              this.processQueue(null);
              
              // Retry original request with new token
              const newToken = authStorage.getToken();
              if (newToken) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return this.axiosInstance(originalRequest);
              }
            }
            
            throw new Error('Token refresh failed');
          } catch (refreshError) {
            // Refresh failed, clear auth and redirect to login
            this.processQueue(refreshError);
            authStorage.clearAuthData();
            
            toast.error('Session expired. Please log in again.');
            
            // Redirect to login if not already there
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
            
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        // Handle other errors
        if (error.response?.status === 403) {
          toast.error('Access denied. You don\'t have permission to perform this action.');
        } else if (error.response?.status >= 500) {
          toast.error('Server error. Please try again later.');
        } else if (error.code === 'NETWORK_ERROR' || !error.response) {
          toast.error('Network error. Please check your connection.');
        }

        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: any): void {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
    
    this.failedQueue = [];
  }

  // HTTP Methods
  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config);
  }

  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, config);
  }

  public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, data, config);
  }

  public async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.patch<T>(url, data, config);
  }

  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, config);
  }

  // Authentication specific methods
  public async login(credentials: { email: string; password: string; remember?: boolean }) {
    const response = await this.post('/login', credentials);
    return response.data;
  }

  public async register(userData: { 
    name: string; 
    email: string; 
    password: string; 
    password_confirmation: string; 
  }) {
    const response = await this.post('/register', userData);
    return response.data;
  }

  public async logout() {
    const response = await this.post('/logout');
    return response.data;
  }

  public async refreshToken() {
    const refreshToken = authStorage.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.post('/refresh', { refresh_token: refreshToken });
    return response.data;
  }

  public async forgotPassword(email: string) {
    const response = await this.post('/forgot-password', { email });
    return response.data;
  }

  public async resetPassword(data: { token: string; email: string; password: string; password_confirmation: string }) {
    const response = await this.post('/reset-password', data);
    return response.data;
  }

  // User profile methods
  public async getProfile() {
    const response = await this.get('/user/profile');
    return response.data;
  }

  public async updateProfile(profileData: any) {
    const response = await this.put('/user/profile', profileData);
    return response.data;
  }

  public async changePassword(data: { current_password: string; new_password: string; new_password_confirmation: string }) {
    const response = await this.put('/user/password', data);
    return response.data;
  }

  // Get the axios instance for custom requests
  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

// Export singleton instance
export const apiClient = ApiClient.getInstance();