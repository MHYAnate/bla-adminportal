// services/orders/index.js
"use client";

import { routes } from "../api-routes";
import { ErrorHandler } from "../errorHandler";
import httpService from "../httpService";
import useFetchItem from "../useFetchItem";
import { useMemo } from "react";
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from "sonner";

// =================== GET ORDERS ===================
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

// =================== GET ORDER INFO ===================
export const useGetOrderInfo = ({
  enabled = true,
  orderId,
} = {}) => {
  console.log('useGetOrderInfo called with:', { enabled, orderId });

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
      
      const cleanOrderId = String(orderId).replace('#', '').trim();
      
      try {
        console.log('Fetching order details for clean ID:', cleanOrderId);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        
        const response = await httpService.getData(routes.getOrderDetails(cleanOrderId));
        
        clearTimeout(timeoutId);
        
        console.log('Raw API response for order details:', response);
        
        if (response?.success && response?.data) {
          console.log('✅ Extracted order data from success wrapper');
          return response.data;
        }
        
        if (response?.id || response?.orderId) {
          console.log('✅ Using direct response data');
          return response;
        }
        
        if (!response || (typeof response === 'object' && Object.keys(response).length === 0)) {
          throw new Error(`Order ${cleanOrderId} not found`);
        }
        
        console.error('❌ Unexpected API response structure:', response);
        throw new Error('Invalid order data received from server');
        
      } catch (error) {
        console.error('❌ API call failed:', error);
        
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

  const processedData = useMemo(() => {
    if (!data) {
      console.log('No order data to process');
      return null;
    }
    
    console.log('Processing order data:', data);
    
    const processed = {
      ...data,
      items: Array.isArray(data.items) ? data.items : [],
      timeline: Array.isArray(data.timeline) ? data.timeline : [],
      transactions: Array.isArray(data.transactions) ? data.transactions : [],
      adminAlerts: Array.isArray(data.adminAlerts) ? data.adminAlerts : [],
      notes: Array.isArray(data.notes) ? data.notes : [],
      
      user: data.user || {},
      breakdown: data.breakdown || {},
      shipping: data.shipping || null,
      summary: data.summary || {},
      
      id: data.id || orderId,
      orderId: data.orderId || `#${String(data.id || orderId).padStart(6, '0')}`,
      status: data.status || 'PENDING',
      totalPrice: Number(data.totalPrice) || 0,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || data.createdAt || new Date().toISOString(),
      paymentStatus: data.paymentStatus || 'PENDING',
      orderType: data.orderType || 'IMMEDIATE',
      
      amountPaid: data.amountPaid || data.breakdown?.amountPaid || 0,
      amountDue: data.amountDue || data.breakdown?.amountDue || 0,
    };
    
    console.log('✅ Processed order data:', processed);
    return processed;
  }, [data, orderId]);

  return {
    getOrderInfoData: processedData,
    getOrderInfoIsLoading: isLoading,
    getOrderInfoError: ErrorHandler(error),
    refetchOrderInfo: refetch,
    setOrderInfoFilter: setFilter,
    isFetchingOrderInfo: isFetching,
    rawData: data,
    hasOrderId: isValidOrderId,
    isValidRequest: enabled && isValidOrderId,
  };
};

// =================== GET ORDERS SUMMARY ===================
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
    queryFn: (params) => httpService.getData(routes.getOrderSummary(), { params }),
    enabled,
    retry: 2,
    initialFilter: filter,
    staleTime: 2 * 60 * 1000,
  });

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

// =================== GET ORDER SUMMARY CHART ===================
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
      return httpService.getData(routes.getOrderSummaryChart(tf));
    },
    enabled,
    retry: 2,
    initialFilter: { timeframe, ...filter },
    staleTime: 5 * 60 * 1000,
  });

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

// =================== GET ORDERS ANALYTICS ===================
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
    queryFn: (params) => httpService.getData(routes.getOrderAnalytics(params)),
    enabled,
    retry: 2,
    initialFilter: filter,
    staleTime: 5 * 60 * 1000,
  });

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

// =================== GET SALES DATA ===================
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
      const routeWithParams = routes.getSalesData(params?.year || year);
      return httpService.getData(routeWithParams);
    },
    enabled,
    retry: 2,
    initialFilter: { year: year || new Date().getFullYear(), ...initialFilter },
    staleTime: 5 * 60 * 1000,
  });

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
    currentFilters: initialFilter,
    hasData: Boolean(processedData?.data?.length),
  };
};

// =================== ORDER MUTATIONS ===================

// Update Order Status
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ orderId, status, notes, trackingNumber, carrier }) => {
      return httpService.patchData({
        status,
        notes,
        trackingNumber,
        carrier
      }, routes.updateOrderStatus(orderId));
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orderInfo', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['ordersSummary'] });
      
      toast.success(response?.message || 'Order status updated successfully');
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to update order status';
      toast.error(errorMessage);
    }
  });
};

// Bulk Update Order Status
export const useBulkUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ orderIds, status, notes }) => {
      return httpService.patchData({
        orderIds,
        status,
        notes
      }, routes.bulkUpdateOrderStatus());
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['ordersSummary'] });
      
      toast.success(response?.message || 'Orders updated successfully');
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to update orders';
      toast.error(errorMessage);
    }
  });
};

// Cancel Order
export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ orderId, reason }) => {
      return httpService.postData({ reason }, routes.cancelOrder(orderId));
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orderInfo', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['ordersSummary'] });
      
      toast.success(response?.message || 'Order cancelled successfully');
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to cancel order';
      toast.error(errorMessage);
    }
  });
};

// Ship Order
export const useShipOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ orderId, trackingNumber, carrier }) => {
      return httpService.postData({
        trackingNumber,
        carrier
      }, routes.shipOrder(orderId));
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orderInfo', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['ordersSummary'] });
      
      toast.success(response?.message || 'Order shipped successfully');
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to ship order';
      toast.error(errorMessage);
    }
  });
};

// Process Refund
export const useProcessRefund = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ orderId, amount, reason }) => {
      return httpService.postData({
        amount,
        reason
      }, routes.processRefund(orderId));
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orderInfo', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['ordersSummary'] });
      
      toast.success(response?.message || 'Refund processed successfully');
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to process refund';
      toast.error(errorMessage);
    }
  });
};

// =================== ORDER NOTES ===================

// Get Order Notes
export const useGetOrderNotes = (orderId, options = {}) => {
  const { includeInternal = false, enabled = true } = options;
  
  const { data, isLoading, error, refetch } = useFetchItem({
    queryKey: ['orderNotes', orderId, { includeInternal }],
    queryFn: () => httpService.getData(routes.getOrderNotes(orderId), {
      params: { includeInternal }
    }),
    enabled: enabled && !!orderId,
    retry: 2
  });

  return {
    orderNotes: data?.data || [],
    isOrderNotesLoading: isLoading,
    orderNotesError: ErrorHandler(error),
    refetchOrderNotes: refetch
  };
};

// Add Order Note
export const useAddOrderNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ orderId, content, type = 'GENERAL', isInternal = false }) => {
      return httpService.postData({
        content,
        type,
        isInternal
      }, routes.addOrderNote(orderId));
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['orderNotes', variables.orderId] 
      });
      
      toast.success(response?.message || 'Note added successfully');
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to add note';
      toast.error(errorMessage);
    }
  });
};

// =================== ORDER ANALYTICS ===================

// Get Order Status Analytics
export const useGetOrderStatusAnalytics = (filters = {}) => {
  const { timeframe = '30d', enabled = true } = filters;
  
  const { data, isLoading, error, refetch } = useFetchItem({
    queryKey: ['orderStatusAnalytics', { timeframe }],
    queryFn: () => httpService.getData(routes.getOrderStatusAnalytics({ timeframe })),
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: 2
  });

  return {
    orderStatusAnalytics: data?.data || {},
    isOrderStatusAnalyticsLoading: isLoading,
    orderStatusAnalyticsError: ErrorHandler(error),
    refetchOrderStatusAnalytics: refetch
  };
};

// Get Fulfillment Metrics
export const useGetFulfillmentMetrics = (filters = {}) => {
  const { timeframe = '30d', enabled = true } = filters;
  
  const { data, isLoading, error, refetch } = useFetchItem({
    queryKey: ['fulfillmentMetrics', { timeframe }],
    queryFn: () => httpService.getData(routes.getFulfillmentMetrics({ timeframe })),
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: 2
  });

  return {
    fulfillmentMetrics: data?.data || {},
    isFulfillmentMetricsLoading: isLoading,
    fulfillmentMetricsError: ErrorHandler(error),
    refetchFulfillmentMetrics: refetch
  };
};

// Get Order Progress
export const useGetOrderProgress = (orderId) => {
  const { data, isLoading, error, refetch } = useFetchItem({
    queryKey: ['orderProgress', orderId],
    queryFn: () => httpService.getData(routes.getOrderProgress(orderId)),
    enabled: !!orderId,
    retry: 2
  });

  return {
    orderProgress: data?.data || {},
    isOrderProgressLoading: isLoading,
    orderProgressError: ErrorHandler(error),
    refetchOrderProgress: refetch
  };
};

// =================== ORDER ARCHIVE ===================

// Get Archived Orders
export const useGetArchivedOrders = (filters = {}) => {
  const { page = 1, limit = 10, enabled = true } = filters;
  
  const { data, isLoading, error, refetch } = useFetchItem({
    queryKey: ['archivedOrders', { page, limit }],
    queryFn: () => httpService.getData(routes.getArchivedOrders({ page, limit })),
    enabled,
    retry: 2
  });

  return {
    archivedOrders: data?.data || [],
    archivedOrdersPagination: data?.pagination || {},
    isArchivedOrdersLoading: isLoading,
    archivedOrdersError: ErrorHandler(error),
    refetchArchivedOrders: refetch
  };
};

// Archive Order
export const useArchiveOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ orderId, reason }) => {
      return httpService.postData({ reason }, routes.archiveOrder(orderId));
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['archivedOrders'] });
      
      toast.success(response?.message || 'Order archived successfully');
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to archive order';
      toast.error(errorMessage);
    }
  });
};

// Unarchive Order
export const useUnarchiveOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ orderId, reason }) => {
      return httpService.postData({ reason }, routes.unarchiveOrder(orderId));
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['archivedOrders'] });
      
      toast.success(response?.message || 'Order unarchived successfully');
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to unarchive order';
      toast.error(errorMessage);
    }
  });
};

// Bulk Archive Orders
export const useBulkArchiveOrders = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ olderThanDays = 30, reason }) => {
      return httpService.postData({
        olderThanDays,
        reason
      }, routes.bulkArchiveCompletedOrders());
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['archivedOrders'] });
      queryClient.invalidateQueries({ queryKey: ['fulfillmentMetrics'] });
      
      toast.success(response?.message || 'Orders archived successfully');
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to archive orders';
      toast.error(errorMessage);
    }
  });
};