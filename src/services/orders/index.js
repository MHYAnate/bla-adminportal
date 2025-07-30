import { routes } from "../api-routes";
import { ErrorHandler } from "../errorHandler";
import httpService from "../httpService";
import useFetchItem from "../useFetchItem";
import useMutateItem from "../useMutateItem";



export const useGetOrders = () => {
  const { isLoading, error, data, refetch, setFilter } = useFetchItem({
    queryKey: ["fetchOrders"],
    queryFn: (queryParams) => httpService.getData(routes.orders(queryParams)),
    retry: 2,
  });

  console.log('🔍 useGetOrders - Raw data:', data);

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
    } else if (data.orders && Array.isArray(data.orders)) {
      processedData = data.orders;
      paginationData = data.pagination || data.meta;
    } else if (data.items && Array.isArray(data.items)) {
      processedData = data.items;
      paginationData = data.pagination || data.meta;
    }
  }

  console.log('🔍 useGetOrders - Processed data:', processedData);

  return {
    getOrdersIsLoading: isLoading,
    getOrdersData: {
      data: processedData,
      pagination: paginationData
    },
    getOrdersError: ErrorHandler(error),
    refetchOrders: refetch,
    setOrdersFilter: setFilter,
  };
};

// Fixed Orders Analytics Hook
export const useGetOrdersAnalytics = () => {
  const { isLoading, error, data, refetch, setFilter } = useFetchItem({
    queryKey: ["fetchOrdersAnalytics"],
    queryFn: (queryParams) =>
      httpService.getData(routes.ordersAnalytics(queryParams)),
    retry: 2,
  });

  console.log('🔍 useGetOrdersAnalytics - Raw data:', data);

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
    } else if (data.analytics && Array.isArray(data.analytics)) {
      processedData = data.analytics;
      paginationData = data.pagination || data.meta;
    } else if (data.items && Array.isArray(data.items)) {
      processedData = data.items;
      paginationData = data.pagination || data.meta;
    } else {
      // If it's an object with analytics data, keep as is
      processedData = data;
    }
  }

  console.log('🔍 useGetOrdersAnalytics - Processed data:', processedData);

  return {
    getOrdersAnalyticsIsLoading: isLoading,
    getOrdersAnalyticsData: {
      data: processedData,
      pagination: paginationData
    },
    getOrdersAnalyticsError: ErrorHandler(error),
    refetchOrdersAnalytics: refetch,
    setOrdersAnalyticsFilter: setFilter,
  };
};

// Fixed Orders Summary Hook
export const useGetOrdersSummary = () => {
  const { isLoading, error, data, refetch, setFilter } = useFetchItem({
    queryKey: ["fetchOrdersSummary"],
    queryFn: () => httpService.getData(routes.orderSummaryChart()),
    retry: 2,
  });

  console.log('🔍 useGetOrdersSummary - Raw data:', data);

  // Process data with multiple fallbacks
  let processedData = [];
  
  if (data) {
    if (Array.isArray(data)) {
      processedData = data;
    } else if (data.data && Array.isArray(data.data)) {
      processedData = data.data;
    } else if (data.result && Array.isArray(data.result)) {
      processedData = data.result;
    } else if (data.summary && Array.isArray(data.summary)) {
      processedData = data.summary;
    } else if (data.items && Array.isArray(data.items)) {
      processedData = data.items;
    } else {
      // If it's summary data object, keep as is
      processedData = data;
    }
  }

  console.log('🔍 useGetOrdersSummary - Processed data:', processedData);

  return {
    getOrdersSummaryIsLoading: isLoading,
    getOrdersSummaryData: processedData,
    getOrdersSummaryError: ErrorHandler(error),
    refetchOrdersSummary: refetch,
    setOrdersSummaryFilter: setFilter,
  };
};

// Fixed Sales Data Hook
export const useGetSalesData = ({ year, enabled = true } = {}) => {
  const {
    isLoading,
    isFetching,
    data,
    error,
    refetch,
  } = useFetchItem({
    queryKey: ["sales-data", year],
    queryFn: () => httpService.getData(routes.salesData(year)),
    enabled,
    retry: 2,
  });

  console.log('🔍 useGetSalesData - Raw data:', data);

  // Process data with multiple fallbacks
  let processedData = [];
  let salesYear = year;
  
  if (data) {
    if (Array.isArray(data)) {
      processedData = data;
    } else if (data.data && Array.isArray(data.data)) {
      processedData = data.data;
      salesYear = data.year || year;
    } else if (data.result && Array.isArray(data.result)) {
      processedData = data.result;
      salesYear = data.year || year;
    } else if (data.sales && Array.isArray(data.sales)) {
      processedData = data.sales;
      salesYear = data.year || year;
    } else {
      // If it's sales data object, extract appropriately
      processedData = data.salesData || data.data || [];
      salesYear = data.year || year;
    }
  }

  console.log('🔍 useGetSalesData - Processed data:', processedData);

  return {
    isSalesLoading: isLoading,
    isFetchingSales: isFetching,
    salesData: processedData,
    salesYear: salesYear,
    salesError: ErrorHandler(error),
    refetchSales: refetch,
  };
};
