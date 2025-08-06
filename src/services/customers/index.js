// 1. Update services/customers/index.js - Remove redundant filtering
"use client";

import { routes } from "../api-routes";
import { ErrorHandler } from "../errorHandler";
import httpService from "../httpService";
import useFetchItem from "../useFetchItem";

export const useGetCustomers = () => {
  const { isLoading, error, data, refetch, setFilter } = useFetchItem({
    queryKey: ["fetchCustomers"],
    queryFn: (queryParams) => {
      console.log('🚀 Customers API Call with params:', queryParams);
      
      // ✅ SIMPLIFIED: Let backend handle admin exclusion
      const processedParams = {
        ...queryParams,
        pageSize: queryParams?.pageSize ? Number(queryParams.pageSize) : 10,
        page: queryParams?.page ? Number(queryParams.page) : 1,
      };
      
      console.log('🚀 Processed params for API:', processedParams);
      return httpService.getData(routes.customers(processedParams));
    },
    retry: 2,
  });

  console.log('🔍 useGetCustomers - Raw data:', data);

  // Process data with multiple fallbacks
  let processedData = [];
  let paginationData = null;

  if (data) {
    if (Array.isArray(data)) {
      processedData = data;
    } else if (data.data && Array.isArray(data.data)) {
      processedData = data.data;
      paginationData = data.pagination || data.meta;
    } else if (data.result && Array.isArray(data.result)) {
      processedData = data.result;
      paginationData = data.pagination || data.meta;
    } else if (data.customers && Array.isArray(data.customers)) {
      processedData = data.customers;
      paginationData = data.pagination || data.meta;
    } else if (data.items && Array.isArray(data.items)) {
      processedData = data.items;
      paginationData = data.pagination || data.meta;
    }
  }

  console.log('🔍 useGetCustomers - Processed data:', processedData);
  console.log('🔍 useGetCustomers - Pagination data:', paginationData);

  return {
    getCustomersIsLoading: isLoading,
    getCustomersData: {
      data: processedData, // ✅ Backend now excludes admins automatically
      pagination: paginationData,
      // Include other response data for stats/analytics
      currentPageStats: data?.currentPageStats,
      overallStats: data?.overallStats,
      appliedFilters: data?.appliedFilters
    },
    getCustomersError: ErrorHandler(error),
    refetchCustomers: refetch,
    setCustomersFilter: setFilter,
  };
};

// Keep other functions unchanged...
export const useGetCustomerInfo = () => {
  const { isLoading, error, data, refetch, setFilter, filter } = useFetchItem({
    queryKey: ["fetchCustomerInfo"],
    queryFn: (id) => {
      console.log("🚀 API Call - Customer ID:", id);
      console.log("🚀 API Route:", routes.getCustomerInfo(id));
      return httpService.getData(routes.getCustomerInfo(id));
    },
    retry: 2,
    enabled: false,
  });

  console.log("🔍 useGetCustomerInfo Debug:", {
    isLoading,
    error,
    rawData: data,
    filter,
    hasData: !!data,
    dataStructure: data ? Object.keys(data) : 'no data'
  });

  let processedData = null;
  if (data) {
    console.log("📊 Raw API Response:", data);
    
    if (data.data?.data) {
      processedData = data.data.data;
      console.log("✅ Found customer in data.data.data");
    } else if (data.data) {
      processedData = data.data;
      console.log("✅ Found customer in data.data");
    } else if (data.customer) {
      processedData = data.customer;
      console.log("✅ Found customer in data.customer");
    } else if (data.result) {
      processedData = data.result;
      console.log("✅ Found customer in data.result");
    } else if (typeof data === 'object' && data.id) {
      processedData = data;
      console.log("✅ Data is the customer object");
    }
  }

  console.log("🎯 Final processed customer data:", processedData);

  return {
    getCustomerInfoIsLoading: isLoading,
    getCustomerInfoData: processedData,
    getCustomerInfoError: ErrorHandler(error),
    refetchCustomerInfo: refetch,
    setCustomerInfoFilter: (customerId) => {
      console.log("🔧 Setting filter with customerId:", customerId);
      if (customerId) {
        setFilter(customerId);
      }
    },
  };
};

export const useGetCustomerOrderHistory = () => {
  const { isLoading, error, data, refetch, setFilter, filter } = useFetchItem({
    queryKey: ["fetchCustomerOrderHistory"],
    queryFn: (id) => httpService.getData(routes.getCustomerOrderHistory(id)),
    retry: 2,
  });

  return {
    getCustomerOrderHistoryIsLoading: isLoading,
    getCustomerOrderHistoryData: data?.data?.data || {},
    getCustomerOrderHistoryError: ErrorHandler(error),
    refetchCustomerOrderHistoryInfo: refetch,
    setCustomerOrderHistoryFilter: setFilter,
  };
};