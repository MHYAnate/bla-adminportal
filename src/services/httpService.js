// FIXED httpService.js - Remove default Content-Type to allow FormData to work
import axios from "axios";
import { getAuthToken, clearAuthTokens, setAuthToken, isTokenValid } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

console.log('HTTP Service initialized with base URL:', API_BASE_URL);

// Function to log and process response data
const logResponse = (response, endpoint) => {
  if (typeof window !== 'undefined') {
    console.log(`=== RESPONSE DEBUG for ${endpoint} ===`);
    console.log('Response status:', response.status);
    console.log('Response data type:', typeof response.data);
    console.log('Response data:', response.data);
    console.log('======================================');
  }
  return response.data;
};

// ✅ FIXED: Create axios instance WITHOUT default Content-Type header
const axiosInstance = axios.create({
  baseURL: API_BASE_URL.replace(/\/+$/, ''),
  timeout: 30000,
  // ✅ REMOVED: Don't set default Content-Type header
  // This allows FormData to set the proper multipart/form-data boundary
});

// FIXED: Better request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      // Skip auth for admin registration endpoint
      if (config.url?.includes('admin/manage/register')) {
        console.log('🔐 Admin registration endpoint - skipping auth token');
        return config;
      }
      
      const token = getAuthToken();
      console.log('Request interceptor - Token exists:', !!token);
      
      if (token && isTokenValid(token)) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('✅ Added valid Authorization header to request');
      } else if (token) {
        console.warn('⚠️ Token exists but is invalid, clearing tokens');
        clearAuthTokens();
      } else {
        console.warn('⚠️ No token found for authenticated request');
      }
    }
    
    console.log(`${config.method?.toUpperCase()} ${config.baseURL}/${config.url}`);
    console.log('Request headers:', config.headers);
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor (unchanged)
axiosInstance.interceptors.response.use(
  (response) => {
    if (typeof window !== 'undefined') {
      console.log(`✅ Response received: ${response.status} for ${response.config.url}`);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (typeof window !== 'undefined') {
      console.error("API Error Details:", {
        status: error.response?.status,
        url: error.config?.url,
        method: error.config?.method,
        data: error.response?.data
      });
      
      // Skip auth handling for admin registration
      if (originalRequest.url?.includes('admin/manage/register')) {
        console.log('🔐 Admin registration error - not handling auth');
        return Promise.reject(error);
      }
      
      // Handle 401 unauthorized with token refresh attempt
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        console.log('🔄 401 error detected, attempting token refresh...');
        
        try {
          const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
            withCredentials: true,
            headers: {
              'Authorization': `Bearer ${getAuthToken()}`
            }
          });
          
          const newToken = refreshResponse.data.accessToken || refreshResponse.data.token;
          
          if (newToken && isTokenValid(newToken)) {
            console.log('✅ Token refreshed successfully');
            setAuthToken(newToken, true);
            
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          console.error('❌ Token refresh failed:', refreshError);
          clearAuthTokens();
          
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
      } else if (error.response?.status === 401) {
        console.log("❌ Unauthorized request - clearing tokens and redirecting");
        clearAuthTokens();
        
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

const httpService = {
  // GET request with token
  getData: async (endpoint) => {
    if (typeof window !== 'undefined') {
      console.log('📡 getData called with endpoint:', endpoint);
      const token = getAuthToken();
      console.log('Token check before GET request:', !!token && isTokenValid(token));
    }
    
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    
    // ✅ FIXED: Set Content-Type for JSON requests explicitly
    const response = await axiosInstance.get(cleanEndpoint, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return logResponse(response, endpoint);
  },

  // ✅ FIXED: POST request with proper FormData handling
  postData: async (data, endpoint, config = {}) => {
    if (typeof window !== 'undefined') {
      console.log('🚀 postData called with endpoint:', endpoint);
      console.log('🚀 Data type:', typeof data);
      console.log('🚀 Is FormData:', data instanceof FormData);
      
      if (!endpoint.includes('admin/manage/register')) {
        const token = getAuthToken();
        console.log('🚀 Token exists and valid:', !!token && isTokenValid(token));
      } else {
        console.log('🔐 Admin registration endpoint - no token required');
      }
    }

    // Handle admin registration endpoint
    if (endpoint.includes('admin/manage/register')) {
      console.log('🔐 Processing admin registration request');
      
      const cleanEndpoint = endpoint.replace(/^\/+/, '');
      
      try {
        const response = await axiosInstance.post(cleanEndpoint, data, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log('✅ Admin registration successful:', response.status);
        return logResponse(response, endpoint);
      } catch (error) {
        console.error('❌ Admin registration failed:', {
          endpoint: cleanEndpoint,
          status: error.response?.status,
          errorData: error.response?.data,
          message: error.message
        });
        throw error;
      }
    }
    
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    
    // ✅ FIXED: Proper headers based on data type
    let requestConfig = { ...config };
    
    if (data instanceof FormData) {
      console.log('🔄 Processing FormData - letting browser set Content-Type with boundary');
      // ✅ CRITICAL: Don't set ANY Content-Type header for FormData
      // Let the browser set multipart/form-data with the boundary automatically
      requestConfig = {
        ...config,
        headers: {
          ...config.headers
          // ✅ Don't set Content-Type at all for FormData
        }
      };
      
      // ✅ Make sure Content-Type is not set
      if (requestConfig.headers['Content-Type']) {
        delete requestConfig.headers['Content-Type'];
      }
      if (requestConfig.headers['content-type']) {
        delete requestConfig.headers['content-type'];
      }
    } else {
      // ✅ For JSON data, explicitly set Content-Type
      requestConfig = {
        ...config,
        headers: {
          'Content-Type': 'application/json',
          ...config.headers
        }
      };
    }
    
    try {
      console.log('🚀 Making POST request to:', cleanEndpoint);
      console.log('🚀 Request config headers:', requestConfig.headers);
      
      const response = await axiosInstance.post(cleanEndpoint, data, requestConfig);
      console.log('✅ POST successful:', response.status);
      return logResponse(response, endpoint);
    } catch (error) {
      console.error('❌ POST request failed:', {
        endpoint: cleanEndpoint,
        status: error.response?.status,
        errorData: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  // PUT request with token
  putData: async (data, endpoint) => {
    if (typeof window !== 'undefined') {
      console.log('🔄 putData called with endpoint:', endpoint);
      const token = getAuthToken();
      console.log('Token check before PUT request:', !!token && isTokenValid(token));
    }
    
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    const response = await axiosInstance.put(cleanEndpoint, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return logResponse(response, endpoint);
  },

  // PATCH request with token  
  patchData: async (data, endpoint) => {
    if (typeof window !== 'undefined') {
      console.log('🔄 patchData called with endpoint:', endpoint);
      const token = getAuthToken();
      console.log('Token check before PATCH request:', !!token && isTokenValid(token));
    }
    
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    const response = await axiosInstance.patch(cleanEndpoint, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return logResponse(response, endpoint);
  },

  // Update data (alias for PATCH)
  updateData: async (data, endpoint) => {
    return httpService.patchData(data, endpoint);
  },

  // DELETE request with token
  deleteData: async (endpoint) => {
    if (typeof window !== 'undefined') {
      console.log('🗑️ deleteData called with endpoint:', endpoint);
      const token = getAuthToken();
      console.log('Token check before DELETE request:', !!token && isTokenValid(token));
    }
    
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    const response = await axiosInstance.delete(cleanEndpoint, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return logResponse(response, endpoint);
  },

  // POST request without token (for login, register, etc.)
  postDataWithoutToken: async (data, endpoint) => {
    const finalURL = `${API_BASE_URL}/${endpoint.replace(/^\/+/, '')}`;
    console.log('🔓 POST Data (no token):', data);
    console.log('🔓 Endpoint received:', endpoint);
    
    const response = await axios.post(finalURL, data, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });
    return logResponse(response, endpoint);
  },

  // GET request without token
  getDataWithoutToken: async (endpoint) => {
    const finalURL = `${API_BASE_URL}/${endpoint.replace(/^\/+/, '')}`;
    console.log('🔓 GET Endpoint received (no token):', endpoint);
    
    const response = await axios.get(finalURL, {
      timeout: 30000,
    });
    return logResponse(response, endpoint);
  },
};

export default httpService;