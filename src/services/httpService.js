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

// Function to log and process response data
const logResponse = (response, endpoint) => {
  console.log(`=== RESPONSE DEBUG for ${endpoint} ===`);
  console.log('Response status:', response.status);
  console.log('Response data type:', typeof response.data);
  console.log('Response data:', response.data);
  console.log('Response data keys:', response.data ? Object.keys(response.data) : 'null/undefined');
  console.log('======================================');
  return response.data;
};

// Create axios instance for authenticated requests
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
    console.log('Request interceptor - Token exists:', !!token);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Added Authorization header to request');
    } else {
      console.warn('No token found for authenticated request');
    }
    
    console.log(`${config.method?.toUpperCase()} ${config.baseURL}/${config.url}`);
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
    console.log(`Response received: ${response.status} for ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("API Error Details:", {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data
    });
    
    // Handle 401 unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      console.log("Unauthorized request - clearing tokens and redirecting");
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
    console.log('getData called with endpoint:', endpoint);
    const token = getAuthToken();
    console.log('Token check before GET request:', !!token);
    
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    const response = await axiosInstance.get(cleanEndpoint);
    return logResponse(response, endpoint);
  },

  // POST request with token
  postData: async (data, endpoint) => {
    console.log('postData called with endpoint:', endpoint);
    const token = getAuthToken();
    console.log('Token check before POST request:', !!token);
    
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    const response = await axiosInstance.post(cleanEndpoint, data);
    return logResponse(response, endpoint);
  },

  // PUT request with token
  putData: async (data, endpoint) => {
    console.log('putData called with endpoint:', endpoint);
    const token = getAuthToken();
    console.log('Token check before PUT request:', !!token);
    
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    const response = await axiosInstance.put(cleanEndpoint, data);
    return logResponse(response, endpoint);
  },

  // PATCH request with token
  patchData: async (data, endpoint) => {
    console.log('patchData called with endpoint:', endpoint);
    const token = getAuthToken();
    console.log('Token check before PATCH request:', !!token);
    
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    const response = await axiosInstance.patch(cleanEndpoint, data);
    return logResponse(response, endpoint);
  },

  // DELETE request with token
  deleteData: async (endpoint) => {
    console.log('deleteData called with endpoint:', endpoint);
    const token = getAuthToken();
    console.log('Token check before DELETE request:', !!token);
    
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    const response = await axiosInstance.delete(cleanEndpoint);
    return logResponse(response, endpoint);
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
    return logResponse(response, endpoint);
  },

  // GET request without token
  getDataWithoutToken: async (endpoint) => {
    const finalURL = constructURL(endpoint);
    console.log('GET Endpoint received:', endpoint);
    
    const response = await axios.get(finalURL, {
      timeout: 30000,
    });
    return logResponse(response, endpoint);
  },
};

export default httpService;