// services/customers/index.js
"use client";

import { routes } from "../api-routes";
import { ErrorHandler } from "../errorHandler";
import httpService from "../httpService";
import useFetchItem from "../useFetchItem";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// =================== GET CUSTOMERS ===================
export const useGetCustomers = () => {
  const { isLoading, error, data, refetch, setFilter } = useFetchItem({
    queryKey: ["fetchCustomers"],
    queryFn: (queryParams) => {
      console.log('🚀 Customers API Call with params:', queryParams);
      
      // Backend handles admin exclusion automatically
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
      data: processedData, // Backend now excludes admins automatically
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

// =================== GET CUSTOMER INFO ===================
export const useGetCustomerInfo = () => {
  // ✅ Declare useFetchItem with a simple enabled condition
  const { isLoading, error, data, refetch, setFilter, filter } = useFetchItem({
    queryKey: ["fetchCustomerInfo"],
    queryFn: (id) => {
      console.log("🚀 API Call - Customer ID:", id);
      console.log("🚀 API Route:", routes.getCustomerById(id));
      return httpService.getData(routes.getCustomerById(id));
    },
    retry: 2,
    enabled: true, // ✅ Just enable it - the filter check happens in queryFn
  });

  // ✅ Now safe to use all variables
  console.log("🔍 useGetCustomerInfo Debug:", {
    isLoading,
    error,
    rawData: data,
    filter,
    hasData: !!data,
    dataStructure: data ? Object.keys(data) : 'no data'
  });

  // ... rest of your processing logic stays the same

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
      if (customerId && (typeof customerId === 'string' || typeof customerId === 'number')) {
        setFilter(customerId.toString());
      } else {
        console.error("❌ Invalid customerId passed to setCustomerInfoFilter:", customerId);
      }
    },
  };
};

// =================== GET CUSTOMER ORDER HISTORY ===================
export const useGetCustomerOrderHistory = () => {
  // ✅ Declare FIRST
  const { isLoading, error, data, refetch, setFilter, filter } = useFetchItem({
    queryKey: ["fetchCustomerOrderHistory"],
    queryFn: (id) => {
      console.log("🛒 API Call - Order History for Customer ID:", id);
      console.log("🛒 API Route:", routes.getCustomerOrderHistory(id));
      return httpService.getData(routes.getCustomerOrderHistory(id));
    },
    retry: 2,
    enabled: true,
  });

  // ✅ Use AFTER declaration
  console.log("🔍 useGetCustomerOrderHistory Debug:", {
    isLoading,
    error,
    rawData: data,
    filter,
    hasData: !!data,
    processedData: data?.data
  });

  let processedData = null;
  if (data) {
    if (data.data) {
      processedData = data.data;
      console.log("✅ Found order history in data.data");
    } else if (data.success && data.data) {
      processedData = data.data;
      console.log("✅ Found order history in success response");
    }
  }

  return {
    getCustomerOrderHistoryIsLoading: isLoading,
    getCustomerOrderHistoryData: processedData,
    getCustomerOrderHistoryError: ErrorHandler(error),
    refetchCustomerOrderHistoryInfo: refetch,
    setCustomerOrderHistoryFilter: (customerId) => {
      console.log("🛒 Setting order history filter with customerId:", customerId);
      if (customerId && (typeof customerId === 'string' || typeof customerId === 'number')) {
        setFilter(customerId.toString());
      } else {
        console.error("❌ Invalid customerId passed to setCustomerOrderHistoryFilter:", customerId);
      }
    },
  };
};

// =================== UPDATE CUSTOMER STATUS ===================
export const useUpdateCustomerStatus = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: updateStatusMutation,
    isPending: isUpdating,
    error,
  } = useMutation({
    mutationFn: async ({ customerId, status, reason, severity = 'MEDIUM' }) => {
      console.log('🚀 Updating customer status:', { customerId, status, reason });
      
      const response = await httpService.patchData(
        { status, reason, severity },
        routes.updateCustomerStatus(customerId)
      );
      
      return response;
    },
    onSuccess: (response, variables) => {
      console.log('✅ Customer status updated successfully:', response);
      
      // Invalidate related queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["fetchCustomers"] });
      queryClient.invalidateQueries({ queryKey: ["fetchCustomerInfo", variables.customerId] });
      
      // Show success message
      const message = response?.message || `Customer status updated to ${variables.status.toLowerCase().replace('_', ' ')}`;
      toast.success(message);
    },
    onError: (error, variables) => {
      console.error('❌ Error updating customer status:', error);
      
      const errorMessage = error?.response?.data?.error || 
                          error?.response?.data?.message ||
                          error?.message || 
                          'Failed to update customer status';
      toast.error(errorMessage);
    }
  });

  const updateCustomerStatus = async (customerId, status, reason, severity = 'MEDIUM') => {
    try {
      const response = await updateStatusMutation({ customerId, status, reason, severity });
      return response?.data || response;
    } catch (error) {
      throw error;
    }
  };

  return {
    updateCustomerStatus,
    isUpdating,
    updateCustomerStatusError: ErrorHandler(error),
  };
};


// =================== BULK UPDATE CUSTOMER STATUS ===================
export const useBulkUpdateCustomerStatus = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: bulkUpdateMutation,
    isPending: isUpdating,
    error,
  } = useMutation({
    mutationFn: async ({ customerIds, status, reason, severity = 'MEDIUM' }) => {
      console.log('🚀 Bulk updating customer status:', { customerIds, status, reason });
      
      const response = await httpService.patchData(
        { customerIds, status, reason, severity },
        routes.bulkUpdateCustomerStatus()
      );
      
      return response;
    },
    onSuccess: (response, variables) => {
      console.log('✅ Bulk customer status update successful:', response);
      
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["fetchCustomers"] });
      
      // Show success message
      const message = response?.message || `Updated ${variables.customerIds.length} customer(s) to ${variables.status.toLowerCase().replace('_', ' ')}`;
      toast.success(message);
    },
    onError: (error, variables) => {
      console.error('❌ Error bulk updating customer status:', error);
      
      const errorMessage = error?.response?.data?.error || 
                          error?.response?.data?.message ||
                          error?.message || 
                          'Failed to bulk update customer status';
      toast.error(errorMessage);
    }
  });

  const bulkUpdateCustomerStatus = async (customerIds, status, reason, severity = 'MEDIUM') => {
    try {
      const response = await bulkUpdateMutation({ customerIds, status, reason, severity });
      return response?.data || response;
    } catch (error) {
      throw error;
    }
  };

  return {
    bulkUpdateCustomerStatus,
    isUpdating,
    bulkUpdateCustomerStatusError: ErrorHandler(error),
  };
};

// =================== GET CUSTOMER STATUS HISTORY ===================
export const useGetCustomerStatusHistory = (customerId) => {
  const { data, isLoading, error, refetch } = useFetchItem({
    queryKey: ["customerStatusHistory", customerId],
    queryFn: () => httpService.getData(routes.getCustomerStatusHistory(customerId)),
    enabled: !!customerId,
    retry: 2
  });

  return {
    customerStatusHistory: data?.data || [],
    isCustomerStatusHistoryLoading: isLoading,
    customerStatusHistoryError: ErrorHandler(error),
    refetchCustomerStatusHistory: refetch
  };
};

// =================== COMPLIANCE NOTES ===================

// Add Compliance Note
export const useAddComplianceNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ customerId, note, severity, category, isInternal = false }) => {
      return httpService.postData({
        note,
        severity,
        category,
        isInternal
      }, routes.addComplianceNote(customerId));
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["fetchCustomerInfo"] });
      queryClient.invalidateQueries({ queryKey: ["complianceNotes", variables.customerId] });
      
      toast.success(response?.message || 'Compliance note added successfully');
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to add compliance note';
      toast.error(errorMessage);
    }
  });
};

// Resolve Compliance Note
export const useResolveComplianceNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ noteId, resolution, resolvedBy }) => {
      return httpService.patchData({
        resolution,
        resolvedBy
      }, routes.resolveComplianceNote(noteId));
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["fetchCustomerInfo"] });
      queryClient.invalidateQueries({ queryKey: ["complianceNotes"] });
      
      toast.success(response?.message || 'Compliance note resolved successfully');
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to resolve compliance note';
      toast.error(errorMessage);
    }
  });
};

// =================== CUSTOMER ANALYTICS ===================

// Get Customer Analytics
export const useGetCustomerAnalytics = (filters = {}) => {
  const { timeframe = '30d', enabled = true } = filters;
  
  const { data, isLoading, error, refetch } = useFetchItem({
    queryKey: ['customerAnalytics', { timeframe }],
    queryFn: () => httpService.getData(routes.getCustomerAnalytics({ timeframe })),
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: 2
  });

  return {
    customerAnalytics: data?.data || {},
    isCustomerAnalyticsLoading: isLoading,
    customerAnalyticsError: ErrorHandler(error),
    refetchCustomerAnalytics: refetch
  };
};

// =================== CUSTOMER EXPORT ===================

// Export Customers
export const useExportCustomers = () => {
  return useMutation({
    mutationFn: async (filters = {}) => {
      const response = await httpService.getData(routes.customers({
        ...filters,
        export: true,
        limit: 10000 // Large limit for export
      }));
      
      return response;
    },
    onSuccess: (response) => {
      // Handle CSV download
      const csvData = response?.csvData || response?.data;
      if (csvData) {
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `customers-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        toast.success('Customers exported successfully');
      }
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to export customers';
      toast.error(errorMessage);
    }
  });
};

// =================== CUSTOMER SEARCH ===================

// Search Customers
export const useSearchCustomers = () => {
  const { data, isLoading, error, refetch, setFilter } = useFetchItem({
    queryKey: ["searchCustomers"],
    queryFn: (searchParams) => {
      return httpService.getData(routes.customers({
        ...searchParams,
        search: searchParams.query
      }));
    },
    enabled: false, // Only search when explicitly triggered
    retry: 2
  });

  const searchCustomers = (query) => {
    setFilter({ query });
  };

  return {
    searchResults: data?.data || [],
    isSearching: isLoading,
    searchError: ErrorHandler(error),
    searchCustomers,
    refetchSearch: refetch
  };
};