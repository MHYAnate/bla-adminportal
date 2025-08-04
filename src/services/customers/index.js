import { routes } from "../api-routes";
import { ErrorHandler } from "../errorHandler";
import httpService from "../httpService";
import useFetchItem from "../useFetchItem";
import useMutateItem from "../useMutateItem";

export const useGetCustomers = () => {
  const { isLoading, error, data, refetch, setFilter, filter } = useFetchItem({
    queryKey: ["fetchCustomers"],
    queryFn: (queryParams) => {
      console.log('🚀 Customers API Call with params:', queryParams);
      
      // Ensure pageSize is sent as number in API call
       const processedParams = {
        ...queryParams,
        pageSize: queryParams?.pageSize ? Number(queryParams.pageSize) : 10,
        page: queryParams?.page ? Number(queryParams.page) : 1,
        // Force filter to only business and individual customers at API level
        customerTypes: 'business,individual' // Add this filter
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
      data: processedData,
      pagination: paginationData
    },
    getCustomersError: ErrorHandler(error),
    refetchCustomers: refetch,
    setCustomersFilter: setFilter,
  };
};

// In your customers service file
export const useGetCustomerInfo = () => {
  const { isLoading, error, data, refetch, setFilter, filter } = useFetchItem({
    queryKey: ["fetchCustomerInfo"],
    queryFn: (id) => {
      console.log("Fetching customer info for ID:", id);
      return httpService.getData(routes.getCustomerInfo(id));
    },
    retry: 2,
    enabled: false, // Don't auto-fetch until we have an ID
  });

  console.log("useGetCustomerInfo - Raw response:", data);

  // Process the response data with multiple fallbacks
  let processedData = null;
  if (data) {
    if (data.data) {
      processedData = data.data;
    } else if (data.customer) {
      processedData = data.customer;
    } else if (data.result) {
      processedData = data.result;
    } else if (typeof data === 'object' && data.id) {
      processedData = data;
    }
  }

  console.log("useGetCustomerInfo - Processed data:", processedData);

  return {
    getCustomerInfoIsLoading: isLoading,
    getCustomerInfoData: processedData,
    getCustomerInfoError: ErrorHandler(error),
    refetchCustomerInfo: refetch,
    setCustomerInfoFilter: (customerId) => {
      console.log("Setting filter with customerId:", customerId);
      setFilter(customerId);
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

