"use client";

import { routes } from "../api-routes";
import { ErrorHandler } from "../errorHandler";
import useFetchItem from "../useFetchItem";
import httpService from "../httpService";

export const useGetDashboardInfo = ({ enabled = true }) => {
  const { isFetched, isLoading, error, data, refetch, isFetching, setFilter } =
    useFetchItem({
      queryKey: ["dashboard"],
      queryFn: () => {
        return httpService.getData(routes.dashboard());
      },
      enabled,
      retry: 2,
    });
  return {
    isFetchingDashboardInfo: isFetching,
    isDashboardInfoLoading: isLoading,
    dashboardData: data?.data || {},
    dashboardError: ErrorHandler(error),
    refetchDashboardData: refetch,
  };
};
