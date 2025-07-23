// // import apiClient from "@/services/manufacturers/apiclient";

// // const uploadImageToBackend = async (file: File): Promise<string> => {
// //   const formData = new FormData();
// //   formData.append("images", file); // Field name must match "images"
// //   formData.append("folder", "manufacturers"); // Optional folder parameter

// //   const response = await apiClient.post("/api/upload", formData, {
// //     headers: {
// //       "Content-Type": "multipart/form-data",
// //     },
// //   });

// //   return response.data.urls[0];
// // };

// // export { apiClient };
// import axios from "axios";
// import { Storage } from "@/lib/utils";
// export const apiClient = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
// });

// apiClient.interceptors.request.use(
//   (config) => {
//     const token = Storage.get("token");
//     if (!token) throw new Error("Access denied. No token provided.");
//     config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// apiClient.interceptors.response.use(
//   response => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const res = await axios.post("/api/auth/refresh");
//         Storage.set("token", res.data.accessToken);
//         originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
//         return apiClient(originalRequest);
//       } catch (refreshError) {
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default apiClient;

import apiClient from "@/services/manufacturers/apiclient";

const uploadImageToBackend = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("images", file); // Field name must match "images"
  formData.append("folder", "manufacturers"); // Optional folder parameter

  const response = await apiClient.post("/api/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.urls[0];
};

export { apiClient };
