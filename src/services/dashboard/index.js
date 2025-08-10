// Enhanced version of your useGetDashboardInfo hook
// Replace your existing hook with this enhanced version

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

  console.log('🔍 useGetDashboardInfo - Raw API response:', data);

  // Enhanced data processing with comprehensive fallbacks
  let processedData = null;
  
  if (data) {
    // Handle multiple possible response structures from your API
    if (data?.success && data?.data) {
      // Structure: { success: true, data: { metrics: {...}, charts: {...} } }
      processedData = data.data;
      console.log('✅ Using data.data structure');
    } else if (data?.data && typeof data.data === 'object') {
      // Structure: { data: { metrics: {...}, charts: {...} } }
      processedData = data.data;
      console.log('✅ Using data.data structure (no success wrapper)');
    } else if (data?.metrics || data?.charts || data?.topPerformers) {
      // Structure: direct object { metrics: {...}, charts: {...} }
      processedData = data;
      console.log('✅ Using direct data structure');
    } else {
      // Fallback: try to use the raw data
      processedData = data;
      console.log('⚠️ Using fallback data structure');
    }
  }

  console.log('🔍 useGetDashboardInfo - Processed data:', processedData);
  console.log('🔍 useGetDashboardInfo - Data validation:', {
    hasProcessedData: !!processedData,
    hasMetrics: !!processedData?.metrics,
    hasCharts: !!processedData?.charts,
    hasTopPerformers: !!processedData?.topPerformers,
    hasRecentActivity: !!processedData?.recentActivity,
  });

  return {
    isFetchingDashboardInfo: isFetching,
    isDashboardInfoLoading: isLoading,
    dashboardData: processedData,
    dashboardError: ErrorHandler(error),
    refetchDashboardData: refetch,
    // Add debug info
    rawData: data,
    hasData: !!processedData,
  };
};