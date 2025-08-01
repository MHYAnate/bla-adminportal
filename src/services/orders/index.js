import { routes } from "../api-routes"; // Import your existing routes
import { ErrorHandler } from "../errorHandler";
import httpService from "../httpService";
import useFetchItem from "../useFetchItem";
import { useMemo } from "react";

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
  const {
    isLoading,
    error,
    data,
    refetch,
    isFetching,
    setFilter,
  } = useFetchItem({
    queryKey: ["orderInfo", orderId],
    queryFn: (params) => {
      const id = params?.orderId || orderId;
      if (!id) return Promise.reject(new Error("Order ID is required"));
      return httpService.getData(routes.getOrderInfo(id));
    },
    enabled: enabled && !!orderId,
    retry: 2,
    initialFilter: { orderId },
    staleTime: 30 * 1000, // 30 seconds for individual order
  });

  // Memoize the processed data to prevent unnecessary re-renders
  const processedData = useMemo(() => {
    if (!data) return null;
    
    return {
      ...data,
      // Ensure arrays are properly initialized
      items: Array.isArray(data.items) ? data.items : [],
      // Ensure nested objects exist
      user: data.user || {},
      breakdown: data.breakdown || {},
    };
  }, [data]);

  return {
    getOrderInfoData: processedData,
    getOrderInfoIsLoading: isLoading,
    getOrderInfoError: ErrorHandler(error),
    refetchOrderInfo: refetch,
    setOrderInfoFilter: setFilter,
    isFetchingOrderInfo: isFetching,
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