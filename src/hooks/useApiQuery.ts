"use client";

import { useQuery } from '@tanstack/react-query';
import httpService from '@/services/httpService';
import { processApiResponse, processPaginatedResponse } from '@/utils/api-response-processor';
import { useEffect } from 'react';

interface UseApiQueryOptions {
  queryKey: (string | number | object)[];
  endpoint: string;
  enabled?: boolean;
  isPaginated?: boolean;
  dataKey?: string;
  staleTime?: number;
  gcTime?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export const useApiQuery = ({
  queryKey,
  endpoint,
  enabled = true,
  isPaginated = false,
  dataKey,
  staleTime = 5 * 60 * 1000, // 5 minutes
  gcTime = 10 * 60 * 1000, // 10 minutes
  onSuccess,
  onError
}: UseApiQueryOptions) => {
  
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      console.log(`[useApiQuery] Fetching data from: ${endpoint}`);
      
      try {
        const rawResponse = await httpService.getData(endpoint);
        console.log(`[useApiQuery] Raw response for ${endpoint}:`, rawResponse);
        
        let processedData;
        if (isPaginated) {
          processedData = processPaginatedResponse(rawResponse, dataKey);
        } else {
          processedData = processApiResponse(rawResponse, dataKey);
        }
        
        console.log(`[useApiQuery] Processed data for ${endpoint}:`, processedData);
        
        return processedData;
      } catch (error) {
        console.error(`[useApiQuery] Error fetching ${endpoint}:`, error);
        throw error;
      }
    },
    enabled,
    staleTime,
    gcTime,
    retry: (failureCount, error: any) => {
      // Don't retry on auth errors
      if (error?.response?.status === 401) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
  });

  // Handle success/error callbacks using useEffect
  useEffect(() => {
    if (query.isSuccess && query.data && onSuccess) {
      onSuccess(query.data);
    }
  }, [query.isSuccess, query.data, onSuccess]);

  useEffect(() => {
    if (query.isError && query.error && onError) {
      onError(query.error);
    }
  }, [query.isError, query.error, onError]);

  return query;
};

// Specific hooks for common endpoints
export const useManufacturersQuery = (params: any = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const endpoint = queryParams ? `admin/manufacturers?${queryParams}` : 'admin/manufacturers';
  
  return useApiQuery({
    queryKey: ['manufacturers', params],
    endpoint,
    isPaginated: true,
    onSuccess: (data) => {
      console.log('Manufacturers data loaded:', data);
    },
    onError: (error) => {
      console.error('Failed to load manufacturers:', error);
    }
  });
};

export const useDashboardQuery = () => {
  return useApiQuery({
    queryKey: ['dashboard'],
    endpoint: 'admin/dashboard',
    onSuccess: (data) => {
      console.log('Dashboard data loaded:', data);
    },
    onError: (error) => {
      console.error('Failed to load dashboard:', error);
    }
  });
};

export const useAdminsQuery = (params: any = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const endpoint = queryParams ? `admin/manage?${queryParams}` : 'admin/manage';
  
  return useApiQuery({
    queryKey: ['admins', params],
    endpoint,
    isPaginated: true,
    onSuccess: (data) => {
      console.log('Admins data loaded:', data);
    },
    onError: (error) => {
      console.error('Failed to load admins:', error);
    }
  });
};

export const useCustomersQuery = (params: any = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  const endpoint = queryParams ? `admin/customers?${queryParams}` : 'admin/customers';
  
  return useApiQuery({
    queryKey: ['customers', params],
    endpoint,
    isPaginated: true,
    onSuccess: (data) => {
      console.log('Customers data loaded:', data);
    },
    onError: (error) => {
      console.error('Failed to load customers:', error);
    }
  });
};

export default useApiQuery;