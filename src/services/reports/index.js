"use client"
import { routes } from "../api-routes";
import { ErrorHandler } from "../errorHandler";
import useFetchItem from "../useFetchItem";
import httpService from "../httpService";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";


export const useGetDashboardReports = ({
  enabled = true,
  filter = {},
}) => {
  const {
    isFetched,
    isLoading,
    error,
    data,
    refetch,
    isFetching,
    setFilter,
  } = useFetchItem({
    queryKey: ["dashboardReports", filter],
    queryFn: (params) => httpService.getData(routes.dashboardReports(), { params }),
    enabled,
    retry: 2,
    initialFilter: filter,
    refetchInterval: 300000, // Auto-refresh every 5 minutes
  });

  console.log('🔍 useGetDashboardReports - Raw data:', data);

  // Process metrics data with multiple fallbacks
  let metrics = {
    revenue: { value: 0, dailyChange: 0, trend: 'neutral' },
    sales: { value: 0, dailyChange: 0, trend: 'neutral' },
    profit: { value: 0, dailyChange: 0, trend: 'neutral' }
  };

  let charts = {
    revenueTrend: [],
    orderTrend: []
  };

  if (data) {
    // Try different data structures
    if (data.data?.metrics) {
      metrics = { ...metrics, ...data.data.metrics };
    } else if (data.metrics) {
      metrics = { ...metrics, ...data.metrics };
    }

    if (data.data?.charts) {
      charts = { ...charts, ...data.data.charts };
    } else if (data.charts) {
      charts = { ...charts, ...data.charts };
    }
  }

  console.log('🔍 useGetDashboardReports - Processed metrics:', metrics);
  console.log('🔍 useGetDashboardReports - Processed charts:', charts);

  return {
    // Loading states
    isFetchingDashboard: isFetching,
    isLoading,
    
    // Core data
    dashboardData: {
      metrics,
      charts,
      lastUpdated: data?.data?.lastUpdated || data?.lastUpdated || null
    },
    
    // Raw response
    rawResponse: data,
    
    // Error handling
    error: ErrorHandler(error),
    
    // Refresh controls
    refetch,
    refreshDashboard: refetch,
    
    // Filter controls
    currentFilters: filter,
    setFilters: setFilter,
    
    // Status flags
    hasData: Boolean(data?.data || data),
    isStale: data?.isStale
  };
};