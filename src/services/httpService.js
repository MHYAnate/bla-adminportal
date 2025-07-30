import axios from "axios";
import { Storage } from "@/lib/utils";
import dotenv from 'dotenv';
dotenv.config();

class HttpService {
  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    
    // Create axios instance with interceptors
    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Add request interceptor to inject token
    this.api.interceptors.request.use((config) => {
      const token = Storage.get("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    }, (error) => {
      return Promise.reject(error);
    });

    // Add response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access
          Storage.remove("token");
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // httpService.js
getServiceUrl(url) {
  // Ensure baseUrl doesn't end with a slash
  const cleanBaseUrl = this.baseUrl.endsWith('/') 
    ? this.baseUrl.slice(0, -1) 
    : this.baseUrl;
  
  // Ensure url doesn't start with a slash
  const cleanUrl = url.startsWith('/') 
    ? url.slice(1) 
    : url;
  
  return `${cleanBaseUrl}/${cleanUrl}`;
}

  async postData(payload, url) {
    return this.api.post(this.getServiceUrl(url), payload);
  }

  async postDataWithoutToken(payload, url) {
    return axios.post(this.getServiceUrl(url), payload);
  }

  async getData(url) {
    return this.api.get(this.getServiceUrl(url));
  }

  async getDataWithoutToken(url) {
    return axios.get(this.getServiceUrl(url));
  }

  async putData(payload, url) {
    return this.api.put(this.getServiceUrl(url), payload);
  }

  async putDataWithoutToken(payload, url) {
    return axios.put(this.getServiceUrl(url), payload);
  }

  async patchData(payload, url) {
    return this.api.patch(this.getServiceUrl(url), payload);
  }

  async patchDataWithoutToken(payload, url) {
    return axios.patch(this.getServiceUrl(url), payload);
  }

  async deleteData(url) {
    return this.api.delete(this.getServiceUrl(url));
  }

  async deleteDataWithoutToken(url) {
    return axios.delete(this.getServiceUrl(url));
  }
}

export default new HttpService();