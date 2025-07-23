import axios from "axios";
import { useRequest } from "@/hooks/use-request";
import dotenv from 'dotenv';
dotenv.config();

class HttpService {
  constructor() {
    this.request = useRequest();
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL;
  }

  getServiceUrl(url) {
    return `${this.baseUrl}${url}`;
  }

  async postData(payload, url) {
    return this.request.post(this.getServiceUrl(url), payload);
  }

  async postDataWithoutToken(payload, url) {
    return axios.post(this.getServiceUrl(url), payload);
  }

  async getData(url) {
    return this.request.get(this.getServiceUrl(url));
  }

  async getDataWithoutToken(url) {
    return axios.get(this.getServiceUrl(service, url));
  }

  async putData(payload, url) {
    return this.request.put(this.getServiceUrl(url), payload);
  }

  async putDataWithoutToken(payload, url) {
    return axios.put(this.getServiceUrl(url), payload);
  }

  async patchData(payload, url) {
    return this.request.patch(this.getServiceUrl(url), payload);
  }

  async patchDataWithoutToken(payload, url) {
    return axios.patch(this.getServiceUrl(url), payload);
  }

  async deleteData(url) {
    return this.request.delete(this.getServiceUrl(url));
  }
}

export default new HttpService();
// import axios from "axios";
// import { useRequest } from "@/hooks/use-request";
// import dotenv from 'dotenv';
// dotenv.config();

// class HttpService {
//   constructor() {
//     this.request = useRequest();
//     this.baseUrl = process.env.NEXT_PUBLIC_API_URL;
//   }

//   getServiceUrl(url) {
//     return `${this.baseUrl}${url}`;
//   }

//   async postData(payload, url) {
//     return this.request.post(this.getServiceUrl(url), payload);
//   }

//   async postDataWithoutToken(payload, url) {
//     return axios.post(this.getServiceUrl(url), payload);
//   }

//   async getData(url) {
//     return this.request.get(this.getServiceUrl(url));
//   }

//   async getDataWithoutToken(url) {
//     return axios.get(this.getServiceUrl(url));
//   }

//   async putData(payload, url) {
//     return this.request.put(this.getServiceUrl(url), payload);
//   }

//   async putDataWithoutToken(payload, url) {
//     return axios.put(this.getServiceUrl(url), payload);
//   }

//   async patchData(payload, url) {
//     return this.request.patch(this.getServiceUrl(url), payload);
//   }

//   async patchDataWithoutToken(payload, url) {
//     return axios.patch(this.getServiceUrl(url), payload);
//   }

//   async deleteData(url) {
//     return this.request.delete(this.getServiceUrl(url));
//   }
// }

// export default new HttpService();


// import axios from "axios";
// import { Storage } from "@/lib/utils"; // Add Storage utility import
// import dotenv from 'dotenv';
// dotenv.config();

// class HttpService {
//   constructor() {
//     this.baseUrl = process.env.NEXT_PUBLIC_API_URL;
    
//     // Create axios instance with interceptors
//     this.api = axios.create({
//       baseURL: this.baseUrl,
//     });
    
//     // Add request interceptor to inject token
//     this.api.interceptors.request.use(config => {
//       const token = Storage.get("token");
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     });
//   }

//   getServiceUrl(url) {
//     return url;
//   }

//   async postData(payload, url) {
//     return this.api.post(url, payload);
//   }

//   async postDataWithoutToken(payload, url) {
//     return axios.post(this.getServiceUrl(url), payload);
//   }

//   async getData(url) {
//     return this.api.get(url);
//   }

//   async getDataWithoutToken(url) {
//     return axios.get(this.getServiceUrl(url));
//   }

//   async putData(payload, url) {
//     return this.api.put(url, payload);
//   }

//   async putDataWithoutToken(payload, url) {
//     return axios.put(this.getServiceUrl(url), payload);
//   }

//   async patchData(payload, url) {
//     return this.api.patch(url, payload);
//   }

//   async patchDataWithoutToken(payload, url) {
//     return axios.patch(this.getServiceUrl(url), payload);
//   }

//   async deleteData(url) {
//     return this.api.delete(url);
//   }
// }

// export default new HttpService();

// import { Storage } from './storage';
// import dotenv from 'dotenv';
// dotenv.config();

// class HttpService {
//   constructor() {
//     this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
//   }

//   getAuthHeaders() {
//     const token = Storage.get('token');
//     const headers = {
//       'Content-Type': 'application/json',
//     };

//     if (token) {
//       headers['Authorization'] = `Bearer ${token}`;
//     }

//     return headers;
//   }

//   getServiceUrl(url) {
//     return `${this.baseUrl}${url}`;
//   }

//   async makeRequest(method, url, payload) {
//     const headers = this.getAuthHeaders();
//     const fullUrl = this.getServiceUrl(url);

//     console.log(`🔍 ${method} Request:`, {
//       url: fullUrl,
//       headers,
//       payload
//     });

//     try {
//       const options = {
//         method,
//         headers,
//         ...(payload && { body: JSON.stringify(payload) })
//       };

//       const response = await fetch(fullUrl, options);

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.error || `HTTP ${response.status}`);
//       }

//       const data = await response.json();
//       console.log(`✅ ${method} Response:`, data);

//       return { data, status: response.status };
//     } catch (error) {
//       console.error(`❌ ${method} Request failed:`, error);
//       throw error;
//     }
//   }

//   async postData(payload, url) {
//     return this.makeRequest('POST', url, payload);
//   }

//   async getData(url) {
//     return this.makeRequest('GET', url);
//   }

//   async putData(payload, url) {
//     return this.makeRequest('PUT', url, payload);
//   }

//   async patchData(payload, url) {
//     return this.makeRequest('PATCH', url, payload);
//   }

//   async deleteData(url) {
//     return this.makeRequest('DELETE', url);
//   }

//   // Specific methods for admin endpoints
//   async createAdminRole(roleData) {
//     return this.postData(roleData, '/admin/roles');
//   }

//   async updateAdminRoles(adminId, roleNames) {
//     return this.putData({ roleNames }, `/admin/${adminId}/roles`);
//   }

//   async deleteAdmin(adminId) {
//     return this.deleteData(`/admin/${adminId}`);
//   }
// }

// export default new HttpService();
