import { routes } from "../api-routes"; // Import your existing routes
import { ErrorHandler } from "../errorHandler";
import httpService from "../httpService";
import useFetchItem from "../useFetchItem";
import { useMemo, useEffect, useQueryClient } from "react";

export const useGetOrders = ({
  enabled = true,
  filter = {},
  page = 1,
  pageSize = 10,
} = {}) => {
  const {
    isFetched,
    isLoading,
    error,
    data,
    refetch,
    isFetching,
    setFilter,
    pageNumber,
    setPageNumber,
    setPageSize: setPageSizeHook,
  } = useFetchItem({
    queryKey: ['orders'],
    queryFn: (params) => {
      // Use your existing routes.orders function which handles query parameters properly
      return httpService.getData(routes.orders(params));
    },
    enabled,
    retry: 2,
    initialFilter: filter,
    isPaginated: true,
    initialPage: page,
    initialPageSize: pageSize,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  return {
    getOrdersData: data,
    getOrdersError: ErrorHandler(error),
    getOrdersIsLoading: isLoading,
    isFetchingOrders: isFetching,
    refetchOrders: refetch,
    setOrdersFilter: setFilter,
    // Pagination
    currentPage: pageNumber,
    setCurrentPage: setPageNumber,
    pageSize: pageSize,
    setPageSize: setPageSizeHook,
    // Additional utilities
    totalPages: data?.pagination?.totalPages || 0,
    totalItems: data?.pagination?.totalItems || 0,
    hasNextPage: data?.pagination?.hasNext || false,
    hasPrevPage: data?.pagination?.hasPrev || false,
  };
};

export const useGetOrderInfo = ({
  enabled = true,
  orderId,
} = {}) => {
  console.log('useGetOrderInfo called with:', { enabled, orderId });

  // Validate orderId before making any requests
  const isValidOrderId = Boolean(orderId && String(orderId).trim());
  
  const {
    isLoading,
    error,
    data,
    refetch,
    isFetching,
    setFilter,
  } = useFetchItem({
    queryKey: ["orderInfo", orderId],
    queryFn: async () => {
      console.log('useGetOrderInfo queryFn called with ID:', orderId);
      
      if (!orderId) {
        const error = new Error("Order ID is required");
        console.error('useGetOrderInfo error:', error.message);
        throw error;
      }
      
      // Clean the orderId before making the API call
      const cleanOrderId = String(orderId).replace('#', '').trim();
      
      try {
        console.log('Fetching order details for clean ID:', cleanOrderId);
        
        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
        
        const response = await httpService.getData(
          routes.getOrderInfo(cleanOrderId),
          { signal: controller.signal }
        );
        
        clearTimeout(timeoutId);
        
        console.log('Raw API response for order details:', response);
        
        // Handle the response structure from your controller
        if (response?.success && response?.data) {
          console.log('✅ Extracted order data from success wrapper');
          return response.data;
        }
        
        if (response?.id || response?.orderId) {
          console.log('✅ Using direct response data');
          return response;
        }
        
        // Handle empty or null responses
        if (!response || (typeof response === 'object' && Object.keys(response).length === 0)) {
          throw new Error(`Order ${cleanOrderId} not found`);
        }
        
        console.error('❌ Unexpected API response structure:', response);
        throw new Error('Invalid order data received from server');
        
      } catch (error) {
        console.error('❌ API call failed:', error);
        
        // Handle specific error types
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. Please try again.');
        }
        
        if (error.response?.status === 404) {
          throw new Error(`Order ${cleanOrderId} not found`);
        }
        
        if (error.response?.status === 403) {
          throw new Error('You do not have permission to view this order');
        }
        
        if (error.response?.status >= 500) {
          throw new Error('Server error. Please try again later.');
        }
        
        throw error;
      }
    },
    enabled: enabled && isValidOrderId,
    retry: (failureCount, error) => {
      // Don't retry on 404, 403, or timeout errors
      if (error?.response?.status === 404 || 
          error?.response?.status === 403 || 
          error?.message?.includes('timeout')) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    initialFilter: { orderId },
    staleTime: 30 * 1000,
  });

  // Memoize the processed data to prevent unnecessary re-renders
  const processedData = useMemo(() => {
    if (!data) {
      console.log('No order data to process');
      return null;
    }
    
    console.log('Processing order data:', data);
    
    // Process the data according to your controller's response structure
    const processed = {
      ...data,
      // Ensure arrays are properly initialized (from your controller structure)
      items: Array.isArray(data.items) ? data.items : [],
      timeline: Array.isArray(data.timeline) ? data.timeline : [],
      transactions: Array.isArray(data.transactions) ? data.transactions : [],
      adminAlerts: Array.isArray(data.adminAlerts) ? data.adminAlerts : [],
      notes: Array.isArray(data.notes) ? data.notes : [],
      
      // Ensure nested objects exist
      user: data.user || {},
      breakdown: data.breakdown || {},
      shipping: data.shipping || null,
      summary: data.summary || {},
      
      // Ensure we have the basic order info with proper fallbacks
      id: data.id || orderId,
      orderId: data.orderId || `#${String(data.id || orderId).padStart(6, '0')}`,
      status: data.status || 'PENDING',
      totalPrice: Number(data.totalPrice) || 0,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || data.createdAt || new Date().toISOString(),
      paymentStatus: data.paymentStatus || 'PENDING',
      orderType: data.orderType || 'IMMEDIATE',
      
      // Payment fields (handle both direct properties and nested in breakdown)
      amountPaid: data.amountPaid || data.breakdown?.amountPaid || 0,
      amountDue: data.amountDue || data.breakdown?.amountDue || 0,
    };
    
    console.log('✅ Processed order data:', processed);
    return processed;
  }, [data, orderId]);

  // Debug state changes
  useEffect(() => {
    console.log('useGetOrderInfo state changed:', {
      orderId,
      isValidOrderId,
      loading: isLoading,
      hasData: !!processedData,
      error: error?.message || error,
      dataKeys: processedData ? Object.keys(processedData) : []
    });
  }, [orderId, isValidOrderId, isLoading, processedData, error]);

  return {
    getOrderInfoData: processedData,
    getOrderInfoIsLoading: isLoading,
    getOrderInfoError: ErrorHandler(error),
    refetchOrderInfo: refetch,
    setOrderInfoFilter: setFilter,
    isFetchingOrderInfo: isFetching,
    // Additional debugging info
    rawData: data,
    hasOrderId: isValidOrderId,
    isValidRequest: enabled && isValidOrderId,
  };
};

export const useGetOrdersSummary = ({
  enabled = true,
  filter = {},
} = {}) => {
  const {
    isFetched,
    isLoading,
    error,
    data,
    refetch,
    isFetching,
    setFilter,
  } = useFetchItem({
    queryKey: ["ordersSummary"],
    queryFn: (params) => httpService.getData(routes.ordersSummary(), { params }),
    enabled,
    retry: 2,
    initialFilter: filter,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Memoize the processed data
  const processedData = useMemo(() => {
    if (!data) return null;
    
    return {
      ...data,
      data: data.data || {},
    };
  }, [data]);

  return {
    getOrdersSummaryData: processedData,
    getOrdersSummaryIsLoading: isLoading,
    getOrdersSummaryError: ErrorHandler(error),
    refetchOrdersSummary: refetch,
    setOrdersSummaryFilter: setFilter,
    isFetchingOrdersSummary: isFetching,
  };
};

export const useGetOrderSummaryChart = ({
  enabled = true,
  timeframe = '5m',
  filter = {},
} = {}) => {
  const {
    isLoading,
    error,
    data,
    refetch,
    isFetching,
    setFilter,
  } = useFetchItem({
    queryKey: ["orderSummaryChart", timeframe],
    queryFn: (params) => {
      const tf = params?.timeframe || timeframe;
      return httpService.getData(routes.orderSummaryChart(tf));
    },
    enabled,
    retry: 2,
    initialFilter: { timeframe, ...filter },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Memoize the processed data to ensure consistent structure
  const processedData = useMemo(() => {
    if (!data) return null;
    
    return {
      data: Array.isArray(data.data) ? data.data : [],
      summary: data.summary || {},
      debug: data.debug || {}
    };
  }, [data]);

  return {
    orderSummary: processedData,
    orderSummarySummary: processedData?.summary,
    isOrderSummaryLoading: isLoading,
    orderSummaryError: ErrorHandler(error),
    refetchOrderSummary: refetch,
    setOrderSummaryFilter: setFilter,
    isFetchingOrderSummary: isFetching,
    currentTimeframe: timeframe,
  };
};

export const useGetOrdersAnalytics = ({
  enabled = true,
  filter = {},
} = {}) => {
  const {
    isLoading,
    error,
    data,
    refetch,
    isFetching,
    setFilter,
  } = useFetchItem({
    queryKey: ["ordersAnalytics"],
    queryFn: (params) => httpService.getData(routes.ordersAnalytics(params)),
    enabled,
    retry: 2,
    initialFilter: filter,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Memoize the processed data
  const processedData = useMemo(() => {
    if (!data) return null;
    
    return {
      ...data,
      data: Array.isArray(data.data) ? data.data : [],
    };
  }, [data]);

  return {
    getOrdersAnalyticsData: processedData,
    getOrdersAnalyticsIsLoading: isLoading,
    getOrdersAnalyticsError: ErrorHandler(error),
    refetchOrdersAnalytics: refetch,
    setOrdersAnalyticsFilter: setFilter,
    isFetchingOrdersAnalytics: isFetching,
  };
};

export const useGetSalesData = ({
  enabled = true,
  year,
  initialFilter = {},
} = {}) => {
  const {
    isFetched,
    isLoading,
    error,
    data,
    refetch,
    isFetching,
    setFilter,
    pageNumber,
    setPageNumber,
    setPageSize,
  } = useFetchItem({
    queryKey: ['salesData'],
    queryFn: (params) => {
      const routeWithParams = routes.salesData(params?.year || year);
      return httpService.getData(routeWithParams);
    },
    enabled,
    retry: 2,
    initialFilter: { year: year || new Date().getFullYear(), ...initialFilter },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Memoize the processed data
  const processedData = useMemo(() => {
    if (!data) return null;
    
    return {
      ...data,
      data: Array.isArray(data.data) ? data.data : [],
    };
  }, [data]);

  return {
    isSalesLoading: isLoading,
    isFetchingSales: isFetching,
    salesData: processedData,
    salesYear: (params) => {
      if (setFilter) {
        setFilter({ ...initialFilter, ...params });
      }
    },
    salesError: ErrorHandler(error),
    refetchSales: refetch,
    setSalesFilter: setFilter,
    // Additional utilities
    currentFilters: initialFilter,
    hasData: Boolean(processedData?.data?.length),
  };
};

// Placeholder mutation hooks (implement these after getting basic functionality working)
export const useUpdateOrderStatus = () => {
  return {
    mutateAsync: async ({ orderId, status, notes }) => {
      console.log('Update order status:', { orderId, status, notes });
      // For now, just show a toast message
      throw new Error('Order status update not yet implemented');
    },
    isLoading: false,
    error: null,
  };
};

export const useProcessRefund = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ orderId, amount, reason, refundType }) => {
      console.log('Processing refund:', { orderId, amount, reason, refundType });
      
      const response = await httpService.postData(
        routes.processRefund(orderId),
        {
          amount,
          reason,
          refundType
        }
      );
      
      console.log('Refund response:', response);
      return response;
    },
    onSuccess: (data, variables) => {
      console.log('✅ Refund processed successfully:', data);
      
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ 
        queryKey: ['orderInfo', variables.orderId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['orders'] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['ordersSummary'] 
      });
    },
    onError: (error, variables) => {
      console.error('❌ Refund failed:', error);
      console.error('Variables:', variables);
    }
  });
};