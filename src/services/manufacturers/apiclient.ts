import axios from 'axios';
import { Storage } from '@/lib/utils'; // Make sure the path to your Storage utility is correct

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api', // Your API's base URL
});

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get the token from storage
    const token = Storage.get('token');

    // If the token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default apiClient;

// import axios from "axios";
// import { Storage } from "@/lib/utils";

// export const apiClient = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
// });

// apiClient.interceptors.request.use(
//   async (config) => {
//     // Skip token for refresh endpoint to avoid infinite loops
//     if (config.url === "/auth/refresh") {
//       return config;
//     }

//     // Attempt to get token from storage
//     let token = Storage.get("token");
    
//     // If token is missing, try to refresh
//     if (!token) {
//       try {
//         const response = await axios.post("/api/auth/refresh");
//         if (response.data.accessToken) {
//           token = response.data.accessToken;
//           Storage.set("token", token as any);
//         }
//       } catch (refreshError) {
//         console.error("Token refresh failed:", refreshError);
//         throw new Error("Access denied. Failed to refresh token");
//       }
//     }
    
//     // Add token to request if available
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
    
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// apiClient.interceptors.response.use(
//   response => response,
//   async (error) => {
//     const originalRequest = error.config;
    
//     // Handle 401 errors with token refresh
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
      
//       try {
//         const response = await axios.post("/api/auth/refresh");
//         const newToken = response.data.accessToken;
        
//         if (newToken) {
//           Storage.set("token", newToken);
//           originalRequest.headers.Authorization = `Bearer ${newToken}`;
//           return apiClient(originalRequest);
//         }
//       } catch (refreshError) {
//         console.error("Unable to refresh token:", refreshError);
//         Storage.remove("token");
//         // Redirect to login or handle token expiration
//       }
//     }
    
//     return Promise.reject(error);
//   }
// );

// import axios from 'axios';
// import { Storage } from '@/lib/utils'; // Make sure the path to your Storage utility is correct

// const apiClient = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || '/api', // Your API's base URL
// });

// // Add a request interceptor
// apiClient.interceptors.request.use(
//   (config) => {
//     // Get the token from storage
//     const token = Storage.get('token');

//     // If the token exists, add it to the Authorization header
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => {
//     // Do something with request error
//     return Promise.reject(error);
//   }
// );

// export default apiClient;