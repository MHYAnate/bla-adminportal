// Fixed src/services/reports/index.js - Matching your working backend

"use client"
import { routes } from "../api-routes";
import { ErrorHandler } from "../errorHandler";
import useFetchItem from "../useFetchItem";
import httpService from "../httpService";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

// 🔧 FIXED: Financial Reports Hook - matches your working backend response
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
    // 🔧 FIXED: Use the correct route function
    queryFn: (params) => httpService.getData(routes.getFinancialReports(params)),
    enabled,
    retry: 2,
    initialFilter: filter,
    isPaginated: true,
    initialPage: page,
    initialPageSize: pageSize,
  });

  // 🔧 FIXED: Process the actual backend response structure
  console.log('🔍 useGetFinancialReports - Raw data:', data);
  
  // Extract data from the actual backend response format
  const responseData = data?.data || data || {};
  const financial = responseData.financial || {};
  const topCustomers = responseData.topCustomers || [];
  const breakdown = responseData.breakdown || [];
  const comparison = responseData.comparison || {};

  return {
    isFetchingReports: isFetching,
    isLoading,
    // 🔧 FIXED: Map to the correct response structure
    reportsData: breakdown, // Category/manufacturer breakdown
    financialData: financial, // Core financial metrics
    topCustomers: topCustomers, // Customer data
    comparison: comparison, // Period comparison
    totalSales: financial.revenue?.netRevenue || 0,
    averageAOV: financial.breakdown?.averageOrderValue || 0,
    totalOrders: financial.breakdown?.totalOrders || 0,
    totalProfit: financial.profit?.netProfit || 0,
    totalRefunds: financial.revenue?.totalRefunds || 0,
    refundRate: financial.revenue?.refundRate || 0,
    paginationMeta: data?.meta?.pagination || {},
    error: ErrorHandler(error),
    refetch,
    pageNumber,
    setPageNumber,
    setPageSize,
    setFilter,
    // 🔧 NEW: Additional useful data
    rawResponse: data,
    hasData: Boolean(responseData.financial),
    calculationMethod: responseData.calculationDetails?.method || 'unknown'
  };
};

// 🔧 FIXED: Dashboard Reports Hook - matches your working backend
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
    // 🔧 FIXED: Use the correct route function  
    queryFn: (params) => httpService.getData(routes.getCompleteDashboardMetrics(params)),
    enabled,
    retry: 2,
    initialFilter: filter,
    refetchInterval: 300000, // Auto-refresh every 5 minutes
  });

  console.log('🔍 useGetDashboardReports - Raw data:', data);

  // 🔧 FIXED: Process the actual backend response structure from your test
  let metrics = {
    revenue: { value: 0, dailyChange: 0, trend: 'neutral' },
    sales: { value: 0, dailyChange: 0, trend: 'neutral' },
    profit: { value: 0, dailyChange: 0, trend: 'neutral' }
  };

  let charts = {
    revenueTrend: [],
    orderTrend: [],
    salesPerformance: [],
    orderSummary: [],
    weeklyOrders: []
  };

  let financialBreakdown = {};
  let refundDetails = {};

  if (data?.success && data?.data) {
    const apiData = data.data;
    
    // Process metrics using the actual structure from your test
    if (apiData.metrics) {
      metrics = {
        revenue: {
          value: apiData.metrics.revenue?.currentMonth || apiData.metrics.revenue?.total || 0,
          dailyChange: apiData.metrics.revenue?.changePercentage || 0,
          trend: apiData.metrics.revenue?.trend || 'neutral',
          previousMonth: apiData.metrics.revenue?.previousMonth || 0
        },
        sales: {
          value: apiData.metrics.orders?.currentMonth || apiData.metrics.orders?.total || 0,
          dailyChange: apiData.metrics.orders?.changePercentage || 0,
          trend: apiData.metrics.orders?.trend || 'neutral',
          previousMonth: apiData.metrics.orders?.previousMonth || 0
        },
        profit: {
          value: apiData.metrics.profits?.currentMonth || apiData.metrics.profits?.total || 0,
          dailyChange: apiData.metrics.profits?.changePercentage || 0,
          trend: apiData.metrics.profits?.trend || 'neutral',
          previousMonth: apiData.metrics.profits?.previousMonth || 0
        },
        customers: {
          value: apiData.metrics.customers?.total || 0,
          active: apiData.metrics.customers?.active || 0
        }
      };
    }

    // Process charts using the actual structure
    if (apiData.charts) {
      charts = {
        revenueTrend: apiData.charts.salesPerformance || [],
        orderTrend: apiData.charts.orderSummary || [],
        salesPerformance: apiData.charts.salesPerformance || [],
        orderSummary: apiData.charts.orderSummary || [],
        weeklyOrders: apiData.charts.weeklyOrders || []
      };
    }

    // Process financial breakdown
    if (apiData.financialBreakdown) {
      financialBreakdown = apiData.financialBreakdown;
    }

    // Process refund details
    if (apiData.refundDetails) {
      refundDetails = apiData.refundDetails;
    }
  }

  console.log('🔍 useGetDashboardReports - Processed metrics:', metrics);
  console.log('🔍 useGetDashboardReports - Processed charts:', charts);

  return {
    // Loading states
    isFetchingDashboard: isFetching,
    isLoading,
    
    // 🔧 FIXED: Core data matching your backend response
    dashboardData: {
      metrics,
      charts,
      financialBreakdown,
      refundDetails,
      lastUpdated: data?.data?.generatedAt || data?.data?.lastUpdated || null,
      calculationMethod: data?.data?.calculationMethod || 'unknown'
    },
    
    // Raw response for debugging
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
    hasData: Boolean(data?.success && data?.data),
    isStale: data?.isStale,
    
    // 🔧 NEW: Additional useful flags
    hasMetrics: Boolean(data?.data?.metrics),
    hasCharts: Boolean(data?.data?.charts),
    hasFinancialBreakdown: Boolean(data?.data?.financialBreakdown),
    hasRefundDetails: Boolean(data?.data?.refundDetails)
  };
};

// 🔧 FIXED: Financial Summary Hook with correct route
export const useGetFinancialSummary = ({
  enabled = true,
  period = "current_month",
  ...options
}) => {
  return useQuery({
    queryKey: ["financial-summary", period],
    queryFn: async () => {
      try {
        console.log('🔍 Financial Summary - Fetching with period:', period);
        
        const response = await httpService.getData(routes.getFinancialSummary({ period }));
        
        console.log('🔍 Financial Summary Full Response:', response);
        
        // 🔧 FIX: Handle different response structures
        if (response?.data?.success) {
          console.log('✅ Financial Summary - Success response detected');
          return response.data.data;
        } else if (response?.success) {
          console.log('✅ Financial Summary - Direct success response');
          return response.data;
        } else if (response?.data) {
          console.log('⚠️ Financial Summary - Data without success flag');
          return response.data;
        } else {
          console.log('⚠️ Financial Summary - Using raw response');
          return response;
        }
      } catch (error) {
        console.error('❌ Financial summary fetch error:', error);
        console.error('❌ Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        
        // Return meaningful fallback structure
        return {
          summary: {
            revenue: { current: 0, previous: 0, changePercentage: 0 },
            orders: { current: 0, previous: 0, changePercentage: 0 },
            profits: { current: 0, previous: 0, changePercentage: 0 }
          },
          correlationCheck: {
            shouldMatchDashboard: {
              revenue: 0,
              totalOrders: 0,
              profit: 0
            }
          },
          error: true,
          errorMessage: error.message
        };
      }
    },
    enabled,
    staleTime: 1 * 60 * 1000, // 1 minute
    cacheTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Reduce retries for faster debugging
    ...options
  });
};

// 🔧 NEW: Debug hook to test the financial summary endpoint directly
export const useDebugFinancialSummary = () => {
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const testEndpoint = async () => {
    setIsLoading(true);
    try {
      console.log('🧪 Testing Financial Summary endpoint...');
      
      // Test the endpoint directly
      const response = await httpService.getData(routes.getFinancialSummary());
      
      console.log('🧪 Direct endpoint test result:', response);
      
      setTestResult({
        success: true,
        data: response,
        structure: {
          hasData: Boolean(response?.data),
          hasSuccess: Boolean(response?.success || response?.data?.success),
          dataStructure: Object.keys(response?.data || {}),
          summaryExists: Boolean(response?.data?.summary || response?.summary),
          revenueData: response?.data?.summary?.revenue || response?.summary?.revenue || null
        }
      });
    } catch (error) {
      console.error('🧪 Direct endpoint test failed:', error);
      setTestResult({
        success: false,
        error: error.message,
        response: error.response?.data
      });
    }
    setIsLoading(false);
  };

  return {
    testResult,
    isLoading,
    testEndpoint
  };
};

// 🔧 FIXED: Individual Financial Report Hook
export const useFinancialReport = (customerId) => {
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["financialReport", customerId],
    // 🔧 FIXED: Use the correct route function
    queryFn: () => httpService.getData(routes.getFinancialReport(customerId)),
    enabled: !!customerId,
  });

  return {
    report: data?.data || data || {},
    isLoading,
    error: isError ? ErrorHandler(error) : null,
    hasData: Boolean(data?.success || data?.data)
  };
};

// 🔧 Helper function to check if routes exist
export const checkRouteAvailability = () => {
  const requiredRoutes = [
    'getCompleteDashboardMetrics',
    'getFinancialReports', 
    'getFinancialSummary',
    'getFinancialReport'
  ];
  
  const availableRoutes = {};
  requiredRoutes.forEach(route => {
    availableRoutes[route] = typeof routes[route] === 'function';
  });
  
  console.log('🔍 Route availability check:', availableRoutes);
  return availableRoutes;
};

// 🔧 Delete hook (fixed route)
export const useDelete = (onSuccess) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const deleteAdminPayload = async (adminId) => {
    setIsLoading(true);
    setError(null);

    try {
      // 🔧 FIXED: Use correct delete route
      const response = await httpService.deleteData(routes.deleteAdmin ? routes.deleteAdmin(adminId) : `admin/manage/${adminId}`);
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

// 🔧 NEW: Unified hook that combines all financial data
export const useFinancialDashboard = ({ enabled = true, period = "current_month" } = {}) => {
  const dashboardReports = useGetDashboardReports({ enabled });
  const financialReports = useGetFinancialReports({ enabled });
  const financialSummary = useGetFinancialSummary({ enabled, period });

  // 🔧 FIX: Better data detection
  const hasData = Boolean(
    dashboardReports.hasData || 
    financialReports.hasData || 
    financialSummary.data ||
    dashboardReports.dashboardData?.metrics ||
    financialReports.financialData ||
    financialReports.rawResponse?.data
  );

  const allSuccessful = Boolean(
    dashboardReports.hasData && 
    financialReports.hasData && 
    financialSummary.data
  );

  return {
    // Loading states
    isLoading: dashboardReports.isLoading || financialReports.isLoading || financialSummary.isLoading,
    isFetching: dashboardReports.isFetchingDashboard || financialReports.isFetchingReports || financialSummary.isFetching,
    
    // Data
    dashboard: dashboardReports.dashboardData,
    financialReports: financialReports,
    summary: financialSummary.data,
    
    // Errors
    errors: {
      dashboard: dashboardReports.error,
      reports: financialReports.error,
      summary: financialSummary.error
    },
    
    // Refresh functions
    refreshAll: () => {
      dashboardReports.refreshDashboard();
      financialReports.refetch();
      financialSummary.refetch();
    },
    
    // 🔧 FIXED: Status flags
    hasData: hasData,
    hasAnyData: hasData, // Alias
    allSuccessful: allSuccessful,
    
    // 🔧 NEW: Individual status
    status: {
      dashboard: dashboardReports.hasData,
      financial: financialReports.hasData,
      summary: Boolean(financialSummary.data)
    },
    
    // 🔧 NEW: Debug info
    debug: {
      dashboardHasData: dashboardReports.hasData,
      financialHasData: financialReports.hasData,
      summaryHasData: Boolean(financialSummary.data),
      dashboardMetrics: Boolean(dashboardReports.dashboardData?.metrics),
      financialData: Boolean(financialReports.financialData),
      rawResponse: Boolean(financialReports.rawResponse?.data)
    }
  };
};