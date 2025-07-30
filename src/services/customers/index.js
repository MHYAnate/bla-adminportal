import { routes } from "../api-routes";
import { ErrorHandler } from "../errorHandler";
import httpService from "../httpService";
import useFetchItem from "../useFetchItem";
import useMutateItem from "../useMutateItem";

export const useGetCustomers = () => {
  const { isLoading, error, data, refetch, setFilter, filter } = useFetchItem({
    queryKey: ["fetchCustomers"],
    queryFn: (queryParams) =>
      httpService.getData(routes.customers(queryParams)),
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

  return {
    getCustomersIsLoading: isLoading,
    getCustomersData: {
      data: processedData,
      pagination: paginationData
    },
    getCustomersError: ErrorHandler(error),
    refetchCustomers: refetch,
    setCustomersFilter: setFilter,
  };
};

export const useGetCustomerInfo = () => {
  const { isLoading, error, data, refetch, setFilter, filter } = useFetchItem({
    queryKey: ["fetchCustomerInfo"],
    queryFn: (id) => httpService.getData(routes.getCustomerInfo(id)),
    retry: 2,
  });

  return {
    getCustomerInfoIsLoading: isLoading,
    getCustomerInfoData: data?.data?.data || {},
    getCustomerInfoError: ErrorHandler(error),
    refetchCustomerInfo: refetch,
    setCustomerInfoFilter: setFilter,
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

