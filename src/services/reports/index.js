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
    queryKey: ["financialReports", filter],
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
    pagination: data?.meta?.pagination || {},
    error: ErrorHandler(error),
    refetch,
    pageNumber,
    setPageNumber,
    setPageSize,
    setFilter,
  };
};

export const useDeleteFinancialData = (onSuccess) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteFinancialData = async (customerId) => {
    setIsLoading(true);
    try {
      const response = await httpService.deleteData(
        routes.deleteFinancialData(customerId)
      );
      onSuccess?.(response);
      return response;
    } catch (err) {
      setError(ErrorHandler(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteFinancialData, isLoading, error };
};


// export const useDashboardReports = () => {
//   const { data, error, isLoading, isError } = useQuery({
//     queryKey: ["dashboardReports"],
//     queryFn: () => httpService.getData(routes.dashboardReports()),
//     staleTime: 1000 * 60 * 5, // 5 minutes cache
//   });

//   return {
//     metrics: data?.metrics || {},
//     charts: data?.charts || {},
//     lastUpdated: data?.lastUpdated,
//     isLoading,
//     data:data,
//     error: isError ? ErrorHandler(error) : null,
//   };
// };

export const useDashboardReports = () => {
  // Define default metrics structure
  const defaultMetrics = {
    revenue: { value: 0, dailyChange: 0, trend: 'up'  },
    sales: { value: 0, dailyChange: 0, trend: 'up'  },
    profit: { value: 0, dailyChange: 0, trend: 'up'  }
  };

  // Define default charts structure
  const defaultCharts = {
    revenueTrend: [],
    orderTrend: []
  };

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["dashboardReports"],
    queryFn: () => httpService.getData(routes.dashboardReports()),
    staleTime: 1000 * 60 * 5,
  });

  return {
    metrics: data?.data?.metrics || {},
    charts: data?.data?.charts || {},
    lastUpdated: data?.data?.lastUpdated || null,
    isLoading,
    data: data || { metrics: {}, charts: {} },
    error: isError ? ErrorHandler(error) : null,
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