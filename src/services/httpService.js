// services/httpService.js
import axios from "axios";
import { getAuthToken, clearAuthTokens } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.status, error.config?.url);
    
    // Handle 401 unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      console.log("Unauthorized request - clearing tokens");
      clearAuthTokens();
      
      // Only redirect if we're in the browser and not already on login page
      if (typeof window !== "undefined" && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

const httpService = {
  // GET request with token
  getData: async (endpoint) => {
    const response = await axiosInstance.get(endpoint);
    return response.data;
  },

  // POST request with token
  postData: async (data, endpoint) => {
    const response = await axiosInstance.post(endpoint, data);
    return response.data;
  },

  // PUT request with token
  putData: async (data, endpoint) => {
    const response = await axiosInstance.put(endpoint, data);
    return response.data;
  },

  // PATCH request with token
  patchData: async (data, endpoint) => {
    const response = await axiosInstance.patch(endpoint, data);
    return response.data;
  },

  // DELETE request with token
  deleteData: async (endpoint) => {
    const response = await axiosInstance.delete(endpoint);
    return response.data;
  },

  // POST request without token (for login, register, etc.)
  postDataWithoutToken: async (data, endpoint) => {
    // Remove leading slash from endpoint to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const url = `${API_BASE_URL}/${cleanEndpoint}`;
    console.log('POST without token URL:', url);
    
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });
    return response.data;
  },

  // GET request without token
  getDataWithoutToken: async (endpoint) => {
    // Remove leading slash from endpoint to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const url = `${API_BASE_URL}/${cleanEndpoint}`;
    console.log('GET without token URL:', url);
    
    const response = await axios.get(url, {
      timeout: 30000,
    });
    return response.data;
  },
};

export default httpService;