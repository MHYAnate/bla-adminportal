"use client"
import { routes } from "../api-routes";
import { ErrorHandler } from "../errorHandler";
import useFetchItem from "../useFetchItem";
import httpService from "../httpService";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";


export const useGetFinancialReports = ({
  enabled = true,
  filter = {},
  page = 1,
  pageSize = 10,
}) => {
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
    queryKey: ['financialReports', filter],
    queryFn: (params) => httpService.getData(routes.financialReports(params)),
    enabled,
    retry: 2,
    initialFilter: filter,
    isPaginated: true,
    initialPage: page,
    initialPageSize: pageSize,
  });

  return {
    isFetchingReports: isFetching,
    isLoading,
    reportsData: data?.data || [],
    totalSales: data?.meta?.totalSales || 0,
    averageAOV: data?.meta?.averageAOV || 0,
    paginationMeta: data?.meta?.pagination || {},
    error: ErrorHandler(error),
    refetch,
    pageNumber,
    setPageNumber,
    setPageSize,
    setFilter,
  };
};


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

export const useFinancialReport = (customerId) => {
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["financialReport", customerId],
    queryFn: () => httpService.getData(routes.financialReport(customerId)),
    enabled: !!customerId,
  });

  return {
    report: data || {},
    isLoading,
    error: isError ? ErrorHandler(error) : null,
  };
};

export const useDelete = (onSuccess) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const deleteAdminPayload = async (adminId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await httpService.deleteData(routes.delete(adminId));
      setData(response.data);
      if (onSuccess) onSuccess(response.data);
      return response.data;
    } catch (error) {
      setError(error);
      throw ErrorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteAdminIsLoading: isLoading,
    deleteAdminError: ErrorHandler(error),
    deleteAdminData: data,
    deleteAdminPayload,
  };
};