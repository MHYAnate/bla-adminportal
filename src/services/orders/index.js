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
