// src/services/dashboard/index.js - Enhanced Dashboard Service with Financial Calculations

import { useQuery } from "@tanstack/react-query";
import httpService from "@/services/httpService";
import { routes } from "@/services/api-routes";
import useFetchItem from "../useFetchItem";
import { ErrorHandler } from "../errorHandler";

// Transform function to ensure data consistency
const transformDashboardData = (rawData) => {
  return {
    metrics: {
      totalUsers: rawData?.metrics?.totalUsers || 0,
      totalSales: rawData?.metrics?.totalSales || rawData?.metrics?.totalRevenue || 0,
      totalRevenue: rawData?.metrics?.totalRevenue || rawData?.metrics?.totalSales || 0,
      totalProfit: rawData?.metrics?.totalProfit || 0,
      totalOrders: rawData?.metrics?.totalOrders || 0,
      totalDelivered: rawData?.metrics?.totalDelivered || 0,
      totalPending: rawData?.metrics?.totalPending || 0,
      totalProcessing: rawData?.metrics?.totalProcessing || 0,
      profitMargin: rawData?.metrics?.profitMargin || 0,
      refundRate: rawData?.metrics?.refundRate || 0,
      averageOrderValue: rawData?.metrics?.averageOrderValue || 0,
    },
    changes: {
      sales: {
        amount: rawData?.changes?.sales?.amount || 0,
        percentage: rawData?.changes?.sales?.percentage || 0,
        trend: rawData?.changes?.sales?.trend || "up",
      },
      profit: {
        amount: rawData?.changes?.profit?.amount || 0,
        percentage: rawData?.changes?.profit?.percentage || 0,
        trend: rawData?.changes?.profit?.trend || "up",
      },
      orders: {
        amount: rawData?.changes?.orders?.amount || 0,
        percentage: rawData?.changes?.orders?.percentage || 0,
        trend: rawData?.changes?.orders?.trend || "up",
      },
    },
    charts: {
      orderSummary: rawData?.charts?.orderSummary || [],
      salesPerformance: rawData?.charts?.salesPerformance || [],
      revenueTrend: rawData?.charts?.revenueTrend || [],
      orderTrend: rawData?.charts?.orderTrend || [],
    },
    topCustomers: (rawData?.topCustomers || []).map((customer) => ({
      customerId: customer?.customerId || customer?.userId || 0,
      name: customer?.name || "Unknown",
      email: customer?.email || "",
      sales: customer?.sales || customer?.totalSpent || 0,
      orders: customer?.orders || customer?.orderCount || 0,
    })),
    statusBreakdown: rawData?.statusBreakdown || {},
    financialBreakdown: {
      grossRevenue: rawData?.financialBreakdown?.grossRevenue || 0,
      totalRefunds: rawData?.financialBreakdown?.totalRefunds || 0,
      netRevenue: rawData?.financialBreakdown?.netRevenue || 0,
      totalCosts: rawData?.financialBreakdown?.totalCosts || 0,
      grossProfit: rawData?.financialBreakdown?.grossProfit || 0,
      netProfit: rawData?.financialBreakdown?.netProfit || 0,
      costBreakdown: {
        productCosts: rawData?.financialBreakdown?.costBreakdown?.productCosts || 0,
        shippingCosts: rawData?.financialBreakdown?.costBreakdown?.shippingCosts || 0,
        processingFees: rawData?.financialBreakdown?.costBreakdown?.processingFees || 0,
        refundFees: rawData?.financialBreakdown?.costBreakdown?.refundFees || 0,
      },
    },
    generatedAt: rawData?.generatedAt || new Date().toISOString(),
    calculationMethod: rawData?.calculationMethod || "enhanced_financial_calculations",
  };
};

// Enhanced Dashboard Info Hook
export const useGetDashboardInfo = ({ enabled = true }) => {
  const { isFetched, isLoading, error, data, refetch, isFetching, setFilter } =
    useFetchItem({
      queryKey: ["dashboard"],
      queryFn: () => {
        // 🔧 FIXED: Use the correct dashboard route (old admin dashboard, not reports)
        return httpService.getData(routes.dashboard());
      },
      enabled,
      retry: 2,
    });

  console.log('🔍 useGetDashboardInfo - Raw data:', data);

  // 🔧 FIXED: Process dashboard data based on actual backend response
  let processedData = {};
  
  if (data) {
    // Check for the actual structure from your working backend
    if (data.success && data.data) {
      processedData = data.data;
    } else if (data.data) {
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
    // 🔧 NEW: Additional helpful flags
    hasData: Boolean(data?.success || data?.data),
    isSuccessful: Boolean(data?.success)
  };
};

// 🔧 NEW: Enhanced Dashboard Hook - Uses the reports endpoint for financial data
export const useGetEnhancedDashboard = ({ enabled = true, includeFinancials = true } = {}) => {
  // Get admin dashboard data (users, orders, basic metrics)
  const adminDashboard = useGetDashboardInfo({ enabled });
  
  // Get financial dashboard data (detailed financial metrics)
  const financialDashboard = useFetchItem({
    queryKey: ["enhanced-dashboard"],
    queryFn: () => {
      return httpService.getData(routes.getCompleteDashboardMetrics());
    },
    enabled: enabled && includeFinancials,
    retry: 2,
  });

  console.log('🔍 Enhanced Dashboard - Admin data:', adminDashboard.dashboardData);
  console.log('🔍 Enhanced Dashboard - Financial data:', financialDashboard.data);

  // Combine both data sources
  const combinedData = {
    // From admin dashboard
    customers: adminDashboard.dashboardData?.metrics?.customers || {},
    topPerformers: adminDashboard.dashboardData?.topPerformers || {},
    recentActivity: adminDashboard.dashboardData?.recentActivity || {},
    
    // From financial dashboard  
    metrics: financialDashboard.data?.data?.metrics || {},
    charts: financialDashboard.data?.data?.charts || {},
    financialBreakdown: financialDashboard.data?.data?.financialBreakdown || {},
    refundDetails: financialDashboard.data?.data?.refundDetails || {},
    
    // Metadata
    lastUpdated: financialDashboard.data?.data?.generatedAt || adminDashboard.dashboardData?.lastUpdated,
    calculationMethod: financialDashboard.data?.data?.calculationMethod
  };

  return {
    // Loading states
    isDashboardInfoLoading: adminDashboard.isDashboardInfoLoading || financialDashboard.isLoading,
    isFetchingDashboardInfo: adminDashboard.isFetchingDashboardInfo || financialDashboard.isFetching,
    
    // Combined data
    dashboardData: combinedData,
    
    // Individual data sources
    adminData: adminDashboard.dashboardData,
    financialData: financialDashboard.data?.data,
    
    // Error handling
    dashboardError: adminDashboard.dashboardError || ErrorHandler(financialDashboard.error),
    adminError: adminDashboard.dashboardError,
    financialError: ErrorHandler(financialDashboard.error),
    
    // Refresh functions
    refetchDashboardData: () => {
      adminDashboard.refetchDashboardData();
      financialDashboard.refetch();
    },
    
    // Status flags
    hasData: adminDashboard.hasData || Boolean(financialDashboard.data?.success),
    hasAdminData: adminDashboard.hasData,
    hasFinancialData: Boolean(financialDashboard.data?.success),
    isSuccessful: adminDashboard.isSuccessful && Boolean(financialDashboard.data?.success)
  };
};

// 🔧 Helper function to validate dashboard data structure
export const validateDashboardData = (data) => {
  const required = [
    'metrics',
    'charts'
  ];
  
  const validation = {
    isValid: true,
    missing: [],
    hasMetrics: Boolean(data?.metrics),
    hasCharts: Boolean(data?.charts),
    hasFinancialBreakdown: Boolean(data?.financialBreakdown),
    hasRefundDetails: Boolean(data?.refundDetails)
  };
  
  required.forEach(field => {
    if (!data || typeof data[field] === 'undefined') {
      validation.isValid = false;
      validation.missing.push(field);
    }
  });
  
  return validation;
};

// 🔧 Helper function to format dashboard metrics for display
export const formatDashboardMetrics = (metrics) => {
  if (!metrics) return {};
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${(value || 0).toFixed(1)}%`;
  };

  const formatNumber = (number) => {
    return (number || 0).toLocaleString('en-NG');
  };

  return {
    revenue: {
      formatted: formatCurrency(metrics.revenue?.value || metrics.revenue?.currentMonth || 0),
      change: formatPercentage(metrics.revenue?.dailyChange || metrics.revenue?.changePercentage || 0),
      trend: metrics.revenue?.trend || 'neutral',
      raw: metrics.revenue?.value || metrics.revenue?.currentMonth || 0
    },
    orders: {
      formatted: formatNumber(metrics.orders?.value || metrics.orders?.currentMonth || 0),
      change: formatPercentage(metrics.orders?.dailyChange || metrics.orders?.changePercentage || 0),
      trend: metrics.orders?.trend || 'neutral',
      raw: metrics.orders?.value || metrics.orders?.currentMonth || 0
    },
    profits: {
      formatted: formatCurrency(metrics.profits?.value || metrics.profits?.currentMonth || 0),
      change: formatPercentage(metrics.profits?.dailyChange || metrics.profits?.changePercentage || 0),
      trend: metrics.profits?.trend || 'neutral',
      raw: metrics.profits?.value || metrics.profits?.currentMonth || 0
    },
    customers: {
      formatted: formatNumber(metrics.customers?.total || metrics.customers?.value || 0),
      active: formatNumber(metrics.customers?.active || 0),
      raw: metrics.customers?.total || metrics.customers?.value || 0
    }
  };
};

// 🔧 Debug function to check route availability
export const debugDashboardRoutes = () => {
  const routesToCheck = [
    'dashboard',
    'getCompleteDashboardMetrics',
    'getFinancialReports',
    'getFinancialSummary'
  ];
  
  const routeStatus = {};
  
  routesToCheck.forEach(routeName => {
    if (routes[routeName]) {
      try {
        const url = routes[routeName]();
        routeStatus[routeName] = {
          exists: true,
          url: url,
          type: typeof routes[routeName]
        };
      } catch (error) {
        routeStatus[routeName] = {
          exists: true,
          url: 'Error generating URL',
          error: error.message,
          type: typeof routes[routeName]
        };
      }
    } else {
      routeStatus[routeName] = {
        exists: false,
        url: null,
        type: 'undefined'
      };
    }
  });
  
  console.log('🔍 Dashboard Routes Debug:', routeStatus);
  return routeStatus;
};

// Financial Summary Hook (for quick metrics)
export const useGetFinancialSummary = (
  period = "current_month",
  options = {}
) => {
  return useQuery({
    queryKey: ["financial-summary", period],
    queryFn: async () => {
      const response = await httpService.getData(
        routes.getFinancialSummary(), 
        { params: { period } }
      );
      
      if (!response.data?.success) {
        throw new Error("Failed to fetch financial summary");
      }
      
      return response.data.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    cacheTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// Period Comparison Hook
export const useGetPeriodComparison = (
  currentPeriod,
  previousPeriod,
  options = {}
) => {
  return useQuery({
    queryKey: ["period-comparison", currentPeriod, previousPeriod],
    queryFn: async () => {
      const response = await httpService.postData(routes.getPeriodComparison(), {
        currentPeriod,
        previousPeriod,
      });
      
      if (!response.data?.success) {
        throw new Error("Failed to fetch period comparison");
      }
      
      return response.data.data;
    },
    enabled: !!(currentPeriod && previousPeriod),
    staleTime: 2 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    ...options,
  });
};

// Real-time Financial Metrics Hook
export const useRealTimeFinancials = (
  interval = 30000, // 30 seconds
  enabled = true
) => {
  return useQuery({
    queryKey: ["real-time-financials"],
    queryFn: async () => {
      const response = await httpService.getData(routes.getRealTimeMetrics());
      
      if (!response.data?.success) {
        throw new Error("Failed to fetch real-time metrics");
      }
      
      return response.data.data.metrics;
    },
    enabled,
    refetchInterval: interval,
    refetchIntervalInBackground: true,
    staleTime: 15000, // 15 seconds
    cacheTime: 60000, // 1 minute
  });
};

// Dashboard Data Validation
// export const validateDashboardData = (data) => {
//   const required = [
//     'metrics',
//     'changes', 
//     'charts',
//     'financialBreakdown'
//   ];
  
//   return required.every(field => data && typeof data[field] !== 'undefined');
// };

// Format financial data for display
export const formatFinancialData = (data) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return {
    formattedMetrics: {
      totalRevenue: formatCurrency(data.metrics.totalRevenue),
      totalProfit: formatCurrency(data.metrics.totalProfit),
      totalOrders: data.metrics.totalOrders.toLocaleString(),
      profitMargin: `${data.metrics.profitMargin.toFixed(1)}%`,
      refundRate: `${data.metrics.refundRate.toFixed(1)}%`,
      averageOrderValue: formatCurrency(data.metrics.averageOrderValue),
    },
    formattedChanges: {
      sales: formatPercentage(data.changes.sales.percentage),
      profit: formatPercentage(data.changes.profit.percentage),
      orders: formatPercentage(data.changes.orders.percentage),
    },
    calculationDetails: {
      method: data.calculationMethod,
      lastUpdated: new Date(data.generatedAt).toLocaleString(),
      revenueFormula: "Gross Revenue - Refunds",
      profitFormula: "Net Revenue - (Product Costs + Shipping + Processing Fees)",
    },
  };
};

// Enhanced Financial Reports Hook
export const useGetFinancialReports = (options = {}) => {
  const {
    enabled = true,
    filters = {},
    ...queryOptions
  } = options;

  return useQuery({
    queryKey: ["financial-reports", filters],
    queryFn: async () => {
      const queryString = Object.entries(filters)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');

      const url = queryString 
        ? `${routes.getFinancialReports()}?${queryString}`
        : routes.getFinancialReports();

      const response = await httpService.getData(url);
      
      if (!response.data?.success) {
        throw new Error("Failed to fetch financial reports");
      }
      
      return response.data.data;
    },
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    ...queryOptions,
  });
};

// Transaction Summary Hook
export const useGetTransactionSummary = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ["transaction-summary", filters],
    queryFn: async () => {
      const queryString = Object.entries(filters)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');

      const url = queryString 
        ? `${routes.getTransactionSummary()}?${queryString}`
        : routes.getTransactionSummary();

      const response = await httpService.getData(url);
      
      if (!response.data?.success) {
        throw new Error("Failed to fetch transaction summary");
      }
      
      return response.data.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    cacheTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

// Payout Report Hook
export const useGetPayoutReport = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ["payout-report", filters],
    queryFn: async () => {
      const queryString = Object.entries(filters)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');

      const url = queryString 
        ? `${routes.getPayoutReport()}?${queryString}`
        : routes.getPayoutReport();

      const response = await httpService.getData(url);
      
      if (!response.data?.success) {
        throw new Error("Failed to fetch payout report");
      }
      
      return response.data.data;
    },
    staleTime: 2 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    ...options,
  });
};

// Financial validation hook
export const useValidateFinancialIntegrity = (options = {}) => {
  return useQuery({
    queryKey: ["validate-financial-integrity"],
    queryFn: async () => {
      const response = await httpService.getData(routes.validateFinancialIntegrity());
      
      if (!response.data?.success) {
        throw new Error("Failed to validate financial integrity");
      }
      
      return response.data.data;
    },
    enabled: false, // Manual trigger only
    staleTime: 0, // Always fresh
    cacheTime: 1 * 60 * 1000, // 1 minute
    ...options,
  });
};

// Utility functions for financial calculations
export const calculateProfitMargin = (netProfit, netRevenue) => {
  if (!netRevenue || netRevenue === 0) return 0;
  return (netProfit / netRevenue) * 100;
};

export const calculateRefundRate = (totalRefunds, grossRevenue) => {
  if (!grossRevenue || grossRevenue === 0) return 0;
  return (totalRefunds / grossRevenue) * 100;
};

export const calculateGrowthRate = (current, previous) => {
  if (!previous || previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

// Legacy compatibility (for existing code)
export const useGetDashboardData = useGetDashboardInfo;