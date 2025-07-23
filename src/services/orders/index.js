import { routes } from "../api-routes";
import { ErrorHandler } from "../errorHandler";
import httpService from "../httpService";
import useFetchItem from "../useFetchItem";
import useMutateItem from "../useMutateItem";

export const useGetOrders = () => {
  const { isLoading, error, data, refetch, setFilter } = useFetchItem({
    queryKey: ["fetchOrders"],
    queryFn: (queryParams) => httpService.getData(routes.orders(queryParams)),
    // enabled,
    retry: 2,
  });

  return {
    getOrdersIsLoading: isLoading,
    getOrdersData: data?.data || [],
    getOrdersError: ErrorHandler(error),
    refetchOrders: refetch,
    setOrdersFilter: setFilter,
  };
};

export const useGetOrderInfo = () => {
  const { isLoading, error, data, refetch, setFilter, filter } = useFetchItem({
    queryKey: ["fetchOrderInfo"],
    queryFn: (id) => httpService.getData(routes.getOrderInfo(id)),
    retry: 2,
  });

  return {
    getOrderInfoIsLoading: isLoading,
    getOrderInfoData: data?.data?.data || {},
    getOrderInfoError: ErrorHandler(error),
    refetchOrderInfo: refetch,
    setOrderInfoFilter: setFilter,
  };
};

export const useGetOrdersSummary = () => {
  const { isLoading, error, data, refetch, setFilter } = useFetchItem({
    queryKey: ["fetchOrdersSummary"],
    queryFn: () => httpService.getData(routes.orderSummaryChart()),
    // enabled,
    retry: 2,
  });

  return {
    getOrdersSummaryIsLoading: isLoading,
    getOrdersSummaryData: data?.data || [],
    getOrdersSummaryError: ErrorHandler(error),
    refetchOrdersSummary: refetch,
    setOrdersSummaryFilter: setFilter,
  };
};

export const useGetOrdersAnalytics = () => {
  const { isLoading, error, data, refetch, setFilter } = useFetchItem({
    queryKey: ["fetchOrdersAnalytics"],
    queryFn: (queryParams) =>
      httpService.getData(routes.ordersAnalytics(queryParams)),
    // enabled,
    retry: 2,
  });

  return {
    getOrdersAnalyticsIsLoading: isLoading,
    getOrdersAnalyticsData: data?.data || [],
    getOrdersAnalyticsError: ErrorHandler(error),
    refetchOrdersAnalytics: refetch,
    setOrdersAnalyticsFilter: setFilter,
  };
};

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

  return {
    isSalesLoading: isLoading,
    isFetchingSales: isFetching,
    salesData: data?.data || [],
    salesYear: data?.year,
    salesError: ErrorHandler(error),
    refetchSales: refetch,
  };
};

export const useGetOrderSummaryChart = ({ timeframe = '5m', enabled = true } = {}) => {
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch
  } = useFetchItem({
    queryKey: ['order-summary-chart', timeframe],
    queryFn: () => httpService.getData(routes.orderSummaryChart(timeframe)),
    enabled,
    retry: 2,
  });

  return {
    isOrderSummaryLoading: isLoading,
    isFetchingOrderSummary: isFetching,
    orderSummary: data?.data || [],
    orderSummarySummary: data?.summary || {},
    orderSummaryError: ErrorHandler(error),
    refetchOrderSummary: refetch,
  };
};