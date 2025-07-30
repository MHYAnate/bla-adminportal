// hooks/useDataFetching.ts
"use client";

import { useQuery } from '@tanstack/react-query';
import httpService from '@/services/httpService';
import { routes } from '@/services/api-routes';

// Dashboard data hook
export const useDashboardData = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      console.log('Fetching dashboard data...');
      const response = await httpService.getData(routes.dashboard());
      console.log('Dashboard API response:', response);
      
      // Common issue: API might return data wrapped in different structures
      // Check if response has a 'data' property or is the data itself
      const data = response?.data || response;
      console.log('Processed dashboard data:', data);
      
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 3;
    },
  });
};

// Admin/Users data hook
export const useAdminData = (params = { pageNumber: 1, pageSize: 10 }) => {
  return useQuery({
    queryKey: ['admins', params],
    queryFn: async () => {
      console.log('Fetching admin data with params:', params);
      const response = await httpService.getData(routes.admins(params));
      console.log('Admin API response:', response);
      
      // Process the response - check different possible structures
      let data;
      if (response?.data) {
        data = response.data;
      } else if (response?.result) {
        data = response.result;
      } else if (response?.users) {
        data = response.users;
      } else if (response?.admins) {
        data = response.admins;
      } else if (Array.isArray(response)) {
        data = response;
      } else {
        data = response;
      }
      
      console.log('Processed admin data:', data);
      
      // Ensure we return an array for list data
      if (!Array.isArray(data) && data?.items) {
        return {
          items: data.items,
          totalCount: data.totalCount || data.total || 0,
          currentPage: data.currentPage || data.page || 1,
          totalPages: data.totalPages || Math.ceil((data.totalCount || data.total || 0) / params.pageSize)
        };
      }
      
      return Array.isArray(data) ? data : [];
    },
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 3;
    },
  });
};

// Customers data hook
export const useCustomersData = (params = { pageNumber: 1, pageSize: 10 }) => {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: async () => {
      console.log('Fetching customers data with params:', params);
      const response = await httpService.getData(routes.customers(params));
      console.log('Customers API response:', response);
      
      // Process the response similar to admin data
      let data;
      if (response?.data) {
        data = response.data;
      } else if (response?.result) {
        data = response.result;
      } else if (response?.customers) {
        data = response.customers;
      } else if (Array.isArray(response)) {
        data = response;
      } else {
        data = response;
      }
      
      console.log('Processed customers data:', data);
      
      if (!Array.isArray(data) && data?.items) {
        return {
          items: data.items,
          totalCount: data.totalCount || data.total || 0,
          currentPage: data.currentPage || data.page || 1,
          totalPages: data.totalPages || Math.ceil((data.totalCount || data.total || 0) / params.pageSize)
        };
      }
      
      return Array.isArray(data) ? data : [];
    },
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 3;
    },
  });
};

// Generic data fetching hook
export const useApiData = (queryKey: string[], endpoint: string, options = {}) => {
  return useQuery({
    queryKey,
    queryFn: async () => {
      console.log(`Fetching data from ${endpoint}...`);
      const response = await httpService.getData(endpoint);
      console.log(`API response for ${endpoint}:`, response);
      
      // Return the response as-is and let the component handle it
      return response;
    },
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 3;
    },
    ...options,
  });
};