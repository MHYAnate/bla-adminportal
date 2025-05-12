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
    // return `${this.baseUrl}${url}`;
    return `${this.baseUrl.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
  }

  // async postData(payload, url) {
  //   return this.request.post(this.getServiceUrl(url), payload);
  // }

  // async postDataWithoutToken(payload, url) {
  //   return axios.post(this.getServiceUrl(url), payload);
  // }

  // async getData(url) {
  //   return this.request.get(this.getServiceUrl(url));
  // }

  // async getDataWithoutToken(url) {
  //   return axios.get(this.getServiceUrl(service, url));
  // }


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
    return axios.get(this.getServiceUrl(url));  // Fixed parameter usage
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
