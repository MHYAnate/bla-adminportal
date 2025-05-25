"use client"
import { routes } from "../api-routes";
import { ErrorHandler } from "../errorHandler";
import useFetchItem from "../useFetchItem";
import httpService from "../httpService";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";


// export const useGetFinancialReports = ({
//   enabled = true,
//   filter = {},
//   page = 1,
//   pageSize = 10,
// }) => {
//   const {
//     isFetched,
//     isLoading,
//     error,
//     data,
//     refetch,
//     isFetching,
//     setFilter,
//     pageNumber,
//     setPageNumber,
//     setPageSize,
//   } = useFetchItem({
//     queryKey: ["financialReports", filter],
//     queryFn: (params) => httpService.getData(routes.financialReports(params)),
//     enabled,
//     retry: 2,
//     initialFilter: filter,
//     isPaginated: true,
//     initialPage: page,
//     initialPageSize: pageSize,
//   });

//   return {
//     isFetchingReports: isFetching,
//     isLoading,
//     reportsData: data?.data || [],
//     totalSales: data?.meta?.totalSales || 0,
//     averageAOV: data?.meta?.averageAOV || 0,
//     averageAOV: data?.meta?.pagination || {},
//     error: ErrorHandler(error),
//     refetch,
//     pageNumber,
//     setPageNumber,
//     setPageSize,
//     setFilter,
//   };
// };

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
// financialReports.ts


// export const useGetFinancialReportss = (params, enabled = true) => {
//   const { 
//     isFetched, 
//     isLoading, 
//     error, 
//     data, 
//     refetch, 
//     isFetching, 
//     setFilter,
//     pageNumber,
//     pageSize,
//     setPageNumber,
//     setPageSize
//   } = useFetchItem({
//     queryKey: ["financialReports"],
//     queryFn: (filterParams) => {
//       const combinedParams = {
//         ...params,
//         ...filterParams,
//         page: filterParams.pageNumber || params.page,
//         pageSize: filterParams.pageSize || params.pageSize
//       };
      
//       return httpService.getData(routes.financialReports(combinedParams));
//     },
//     enabled,
//     retry: 2,
//     initialPage: params.page || 1,
//     initialPageSize: params.pageSize || 10,
//     isPaginated: true,
//     initialFilter: params
//   });

//   return {
//     isFetchingReports: isFetching,
//     isLoadingReports: isLoading,
//     reportsData: data?.data || [] ,
//     meta: data?.meta || {} ,
//     reportsError: ErrorHandler(error),
//     refetchReports: refetch,
//     setReportsFilter: setFilter,
//     currentPage: pageNumber,
//     pageSize,
//     setPageNumber,
//     setPageSize
//   };
// };
// hooks/useFinancialReports.ts




// export const useGetFinancialReportss = (params, enabled = true) => {
//   const { 
//     isFetched, 
//     isLoading, 
//     error, 
//     data, 
//     refetch, 
//     isFetching, 
//     setFilter,
//     pageNumber,
//     pageSize,
//     setPageNumber,
//     setPageSize
//   } = useFetchItem({
//     queryKey: ["financialReports"],
//     queryFn: (filterParams) => {
//       const combinedParams = {
//         ...params,
//         ...filterParams,
//         page: pageNumber,
//         pageSize: pageSize,
//         sortBy: params.sortBy || "totalSales",
//         sortOrder: params.sortOrder || "desc"
//       };
      
//       return httpService.getData(routes.financialReports(combinedParams));
//     },
//     enabled,
//     retry: 2,
//     initialPage: params?.page || 1,
//     initialPageSize: params?.pageSize || 10,
//     isPaginated: true,
//     initialFilter: params
//   });

//   return {
//     isFetchingReports: isFetching,
//     isLoadingReports: isLoading,
//     reports: data?.data || [] ,
//     meta: data?.meta || {} ,
//     reportsError: ErrorHandler(error),
//     refetchReports: refetch,
//     setReportsFilter: setFilter,
//     currentPage: pageNumber,
//     pageSize,
//     setPageNumber,
//     setPageSize
//   };
// };

// export const useGetFinancialReportss = (filters = {}, options = {}) => {
//   const {
//     isFetched,
//     isLoading,
//     error,
//     data,
//     refetch,
//     isFetching,
//   } = useFetchItem({
//     queryKey: ["financial-reports", filters],
//     queryFn: ({ queryKey }) => {
//       const [, params] = queryKey;
//       return httpService.getData(routes.financialReports(), {
//         params: {
//           ...params,
//           page: params.page || 1,
//           pageSize: params.pageSize || 10
//         }
//       });
//     },
//     enabled: options.enabled !== false,
//     retry: 2,
//     ...options
//   });

//   return {
//     isFetchingFinancialReports: isFetching,
//     isFinancialReportsLoading: isLoading,
//     financialReportsData: data?.data || {},
//     financialReportsError: ErrorHandler(error),
//     refetchFinancialReports: refetch,
//   };
// };

// export const useGetFinancialReportss = (filters = {}, options = {}) => {
//   const {
//     isFetched,
//     isLoading,
//     error,
//     data,
//     refetch,
//     isFetching,
//   } = useFetchItem({
//     queryKey: ["financialReports", filters],
//     queryFn: ({ queryKey }) => {
//       const [, params] = queryKey;
//       return httpService.getData(routes.financialReports(), {
//         params: {
//           ...params,
//           page: params.page || 1,
//           pageSize: params.pageSize || 10
//         }
//       });
//     },
//     enabled: options.enabled !== false,
//     retry: 2,
//     ...options
//   });

//   return {
//     isFetchingFinancialReports: isFetching,
//     isFinancialReportsLoading: isLoading,
//     financialReportsData: data?.data || {},
//     financialReportsError: ErrorHandler(error),
//     refetchFinancialReports: refetch,
//   };
// };
// export const useDeleteFinancialData = (onSuccess) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const deleteFinancialData = async (customerId) => {
//     setIsLoading(true);
//     try {
//       const response = await httpService.deleteData(
//         routes.deleteFinancialData(customerId)
//       );
//       onSuccess?.(response);
//       return response;
//     } catch (err) {
//       setError(ErrorHandler(err));
//       throw err;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return { deleteFinancialData, isLoading, error };
// };


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

// export const useDashboardReports = () => {
//   // Define default metrics structure
//   const defaultMetrics = {
//     revenue: { value: 0, dailyChange: 0, trend: 'up'  },
//     sales: { value: 0, dailyChange: 0, trend: 'up'  },
//     profit: { value: 0, dailyChange: 0, trend: 'up'  }
//   };

//   // Define default charts structure
//   const defaultCharts = {
//     revenueTrend: [],
//     orderTrend: []
//   };

//   const { data, error, isLoading, isError } = useQuery({
//     queryKey: ["dashboardReports"],
//     queryFn: () => httpService.getData(routes.dashboardReports()),
//     staleTime: 1000 * 60 * 5,
//   });

//   return {
//     metrics: data?.data?.metrics || {},
//     charts: data?.data?.charts || {},
//     lastUpdated: data?.data?.lastUpdated || null,
//     isLoading,
//     data: data || { metrics: {}, charts: {} },
//     error: isError ? ErrorHandler(error) : null,
//   };
// };

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

  // Process metrics data
  const metrics = data?.data?.metrics || {
    revenue: { value: 0, dailyChange: 0, trend: 'neutral' },
    sales: { value: 0, dailyChange: 0, trend: 'neutral' },
    profit: { value: 0, dailyChange: 0, trend: 'neutral' }
  };

  // Process chart data
  const charts = data?.data?.charts || {
    revenueTrend: [],
    orderTrend: []
  };

  return {
    // Loading states
    isFetchingDashboard: isFetching,
    isLoading,
    
    // Core data
    dashboardData: {
      metrics,
      charts,
      lastUpdated: data?.data?.lastUpdated || null
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
    hasData: Boolean(data?.data),
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