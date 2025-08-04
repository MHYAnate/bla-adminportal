// services/api/client.js
import axios from 'axios';
import { Storage } from '@/lib/utils';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
});

// Request interceptor with enhanced debugging
apiClient.interceptors.request.use(
  (config) => {
    const token = Storage.get('token');
    console.log('🔑 API Request Debug:', {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      tokenLength: token?.length,
      headers: config.headers
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token added to request');
    } else {
      console.log('❌ No token found in storage');
      // Debug what's in storage
      const allCookies = document.cookie;
      console.log('🍪 All cookies:', allCookies);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with enhanced error handling
apiClient.interceptors.response.use(
  response => {
    console.log('✅ API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  async error => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    });

    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('🔄 Attempting token refresh...');
      originalRequest._retry = true;
      
      try {
        const response = await axios.post('/api/auth/refresh');
        const newToken = response.data.accessToken;
        
        console.log('✅ Token refreshed successfully');
        Storage.set('token', newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        Storage.remove('token');
        
        // Redirect to login if available
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;