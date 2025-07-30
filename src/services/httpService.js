// services/httpService.js
import axios from "axios";
import { getAuthToken, clearAuthTokens } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

console.log('HTTP Service initialized with base URL:', API_BASE_URL);

// Function to properly construct URL
const constructURL = (endpoint) => {
  // Remove trailing slash from base URL
  const cleanBaseURL = API_BASE_URL.replace(/\/+$/, '');
  // Remove leading slash from endpoint
  const cleanEndpoint = endpoint.replace(/^\/+/, '');
  
  const finalURL = `${cleanBaseURL}/${cleanEndpoint}`;
  console.log('Constructed URL:', finalURL);
  return finalURL;
};

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL.replace(/\/+$/, ''), // Remove trailing slashes
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
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    const response = await axiosInstance.get(cleanEndpoint);
    return response.data;
  },

  // POST request with token
  postData: async (data, endpoint) => {
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    const response = await axiosInstance.post(cleanEndpoint, data);
    return response.data;
  },

  // PUT request with token
  putData: async (data, endpoint) => {
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    const response = await axiosInstance.put(cleanEndpoint, data);
    return response.data;
  },

  // PATCH request with token
  patchData: async (data, endpoint) => {
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    const response = await axiosInstance.patch(cleanEndpoint, data);
    return response.data;
  },

  // DELETE request with token
  deleteData: async (endpoint) => {
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    const response = await axiosInstance.delete(cleanEndpoint);
    return response.data;
  },

  // POST request without token (for login, register, etc.)
  postDataWithoutToken: async (data, endpoint) => {
    const finalURL = constructURL(endpoint);
    console.log('POST Data:', data);
    console.log('Endpoint received:', endpoint);
    
    const response = await axios.post(finalURL, data, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });
    return response.data;
  },

  // GET request without token
  getDataWithoutToken: async (endpoint) => {
    const finalURL = constructURL(endpoint);
    console.log('GET Endpoint received:', endpoint);
    
    const response = await axios.get(finalURL, {
      timeout: 30000,
    });
    return response.data;
  },
};

export default httpService;