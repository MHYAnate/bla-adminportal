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

  console.log('🔍 useGetDashboardInfo - Raw data:', data);

  // Process dashboard data with multiple fallbacks
  let processedData = {};
  
  if (data) {
    if (data.data) {
      processedData = data.data;
    } else if (data.result) {
      processedData = data.result;
    } else {
      processedData = data;
    }
  }

  console.log('🔍 useGetDashboardInfo - Processed data:', processedData);

  return {
    isFetchingDashboardInfo: isFetching,
    isDashboardInfoLoading: isLoading,
    dashboardData: processedData,
    dashboardError: ErrorHandler(error),
    refetchDashboardData: refetch,
  };
};