// services/transactions/index.js
"use client";

import { useState, useEffect, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { routes } from "../api-routes";
import { ErrorHandler } from "../errorHandler";
import httpService from "../httpService";
import useFetchItem from "../useFetchItem";
import { toast } from "sonner";

// =================== GET ALL TRANSACTIONS WITH CLIENT PAGINATION ===================
export const useGetAllTransactionsClientPagination = ({
  enabled = true,
  initialFilters = {},
  initialPageSize = 10,
}) => {
  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [allTransactions, setAllTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFetched, setIsFetched] = useState(false);

  // Calculate paginated data
  const paginatedData = useMemo(() => {
    if (!Array.isArray(allTransactions)) {
      console.warn("allTransactions is not an array. Returning empty array for pagination.");
      return [];
    }
    const startIndex = (currentPage - 1) * pageSize;
    return allTransactions.slice(startIndex, startIndex + pageSize);
  }, [allTransactions, currentPage, pageSize]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    if (!Array.isArray(allTransactions) || allTransactions.length === 0 || pageSize === 0) {
      return 0;
    }
    return Math.ceil(allTransactions.length / pageSize);
  }, [allTransactions.length, pageSize]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (!Array.isArray(allTransactions) || allTransactions.length === 0) {
      return {
        totalAmount: 0,
        transactionCount: 0,
        averageAmount: 0,
        successCount: 0,
        failedCount: 0,
        pendingCount: 0,
        refundedCount: 0,
        amountTrend: 0,
        countTrend: 0,
      };
    }

    // Sort transactions by date in descending order
    const sortedTransactions = [...allTransactions].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date);
      const dateB = new Date(b.createdAt || b.date);
      return dateB.getTime() - dateA.getTime();
    });

    // Calculate period comparisons (last 30 days vs previous 30 days)
    const ONE_MONTH_IN_MS = 30 * 24 * 60 * 60 * 1000;
    const now = new Date();
    const currentPeriodStart = new Date(now.getTime() - ONE_MONTH_IN_MS);
    const previousPeriodStart = new Date(currentPeriodStart.getTime() - ONE_MONTH_IN_MS);

    const currentPeriodTransactions = sortedTransactions.filter(
      (tx) => new Date(tx.createdAt || tx.date) >= currentPeriodStart
    );

    const previousPeriodTransactions = sortedTransactions.filter(
      (tx) =>
        new Date(tx.createdAt || tx.date) >= previousPeriodStart &&
        new Date(tx.createdAt || tx.date) < currentPeriodStart
    );

    // Calculate current period stats
    const currentTotalAmount = currentPeriodTransactions.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
    const currentTransactionCount = currentPeriodTransactions.length;

    // Calculate previous period stats
    const previousTotalAmount = previousPeriodTransactions.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
    const previousTransactionCount = previousPeriodTransactions.length;

    // Calculate trends
    const amountTrend =
      previousTotalAmount > 0
        ? ((currentTotalAmount - previousTotalAmount) / previousTotalAmount) * 100
        : currentTotalAmount > 0
        ? 100
        : 0;

    const countTrend =
      previousTransactionCount > 0
        ? ((currentTransactionCount - previousTransactionCount) / previousTransactionCount) * 100
        : currentTransactionCount > 0
        ? 100
        : 0;

    return {
      totalAmount: currentTotalAmount,
      transactionCount: currentTransactionCount,
      averageAmount: currentTransactionCount
        ? currentTotalAmount / currentTransactionCount
        : 0,
      successCount: currentPeriodTransactions.filter(
        (tx) => tx.status === "success" || tx.status === "completed"
      ).length,
      failedCount: currentPeriodTransactions.filter(
        (tx) => tx.status === "failed" || tx.status === "error"
      ).length,
      pendingCount: currentPeriodTransactions.filter(
        (tx) => tx.status === "pending"
      ).length,
      refundedCount: currentPeriodTransactions.filter(
        (tx) => tx.status === "refunded"
      ).length,
      amountTrend,
      countTrend,
    };
  }, [allTransactions]);

  // Fetch all transactions
  const fetchTransactions = async () => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await httpService.getData(routes.getAllTransactions(filters));

      // Handle different response structures
      if (response && Array.isArray(response.data)) {
        setAllTransactions(response.data);
      } else if (Array.isArray(response)) {
        setAllTransactions(response);
      } else if (response && Array.isArray(response.transactions)) {
        setAllTransactions(response.transactions);
      } else {
        console.warn(
          "API response data is not an array or does not contain an expected array key:",
          response
        );
        setAllTransactions([]);
      }
      setIsFetched(true);
    } catch (err) {
      setError(ErrorHandler(err));
      console.error("Failed to fetch transactions:", err);
      setAllTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Refetch function
  const refetch = () => {
    setIsFetched(false);
  };

  // Initial fetch and filter changes
  useEffect(() => {
    if (!isFetched && enabled) {
      fetchTransactions();
    }
  }, [filters, enabled, isFetched]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  return {
    // Data states
    transactions: paginatedData,
    allTransactions,
    summaryStats,

    // Pagination controls
    pagination: {
      currentPage,
      totalPages,
      pageSize,
      totalItems: allTransactions.length,
      setPage: setCurrentPage,
      setPageSize: (newSize) => {
        setPageSize(newSize);
        setCurrentPage(1);
      },
      canPrevious: currentPage > 1,
      canNext: currentPage < totalPages,
      goToNext: () => setCurrentPage((prev) => Math.min(prev + 1, totalPages)),
      goToPrev: () => setCurrentPage((prev) => Math.max(prev - 1, 1)),
      goToPage: (page) =>
        setCurrentPage(Math.min(Math.max(1, page), totalPages)),
    },

    // Filtering
    filters,
    setFilters: (newFilters) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    resetFilters: () => setFilters(initialFilters),

    // Loading states
    isLoading,
    isFetching: isLoading,
    isFetched,

    // Error handling
    error,

    // Data refreshing
    refetch,
  };
};

// =================== GET TRANSACTIONS (SERVER PAGINATION) ===================
export const useGetTransactions = ({
  enabled = true,
  filter = {},
  page = 1,
  pageSize = 10,
} = {}) => {
  const {
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
    queryKey: ['transactions'],
    queryFn: (params) => {
      return httpService.getData(routes.getAllTransactions(params));
    },
    enabled,
    retry: 2,
    initialFilter: filter,
    isPaginated: true,
    initialPage: page,
    initialPageSize: pageSize,
    staleTime: 2 * 60 * 1000,
  });

  return {
    getTransactionsData: data,
    getTransactionsError: ErrorHandler(error),
    getTransactionsIsLoading: isLoading,
    isFetchingTransactions: isFetching,
    refetchTransactions: refetch,
    setTransactionsFilter: setFilter,
    
    // Pagination
    currentPage: pageNumber,
    setCurrentPage: setPageNumber,
    pageSize: pageSize,
    setPageSize: setPageSize,
    
    // Additional utilities
    totalPages: data?.pagination?.totalPages || 0,
    totalItems: data?.pagination?.totalItems || 0,
    hasNextPage: data?.pagination?.hasNext || false,
    hasPrevPage: data?.pagination?.hasPrev || false,
  };
};

// =================== PROCESS REFUND ===================
export const useProcessRefund = () => {
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);
  const [refundError, setRefundError] = useState(null);
  const [refundSuccess, setRefundSuccess] = useState(false);
  const queryClient = useQueryClient();

  const processRefund = async (transactionId, reason, amount = null) => {
    setIsProcessingRefund(true);
    setRefundError(null);
    setRefundSuccess(false);

    try {
      const payload = { reason };
      if (amount !== null) {
        payload.amount = amount;
      }

      const response = await httpService.postData(payload, routes.processRefund(transactionId));
      
      setRefundSuccess(true);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      toast.success(response?.message || 'Refund processed successfully');
      
      return response;
    } catch (error) {
      const errorMessage = ErrorHandler(error);
      setRefundError(errorMessage);
      setRefundSuccess(false);
      
      toast.error(errorMessage);
      return null;
    } finally {
      setIsProcessingRefund(false);
    }
  };

  return {
    processRefund,
    isProcessingRefund,
    refundSuccess,
    refundError,
  };
};

// =================== RETRY TRANSACTION ===================
export const useRetryTransaction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ transactionId, adminNotes }) => {
      return httpService.postData({
        adminNotes
      }, routes.retryTransaction(transactionId));
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      toast.success(response?.message || 'Transaction retry initiated successfully');
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to retry transaction';
      toast.error(errorMessage);
    }
  });
};

// =================== UPDATE TRANSACTION STATUS ===================
export const useUpdateTransactionStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ transactionId, status, adminNotes }) => {
      return httpService.patchData({
        status,
        adminNotes
      }, routes.updateTransactionStatus(transactionId));
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      toast.success(response?.message || 'Transaction status updated successfully');
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to update transaction status';
      toast.error(errorMessage);
    }
  });
};

// =================== GET TRANSACTION DETAILS ===================
export const useGetTransactionDetails = (transactionId, { enabled = true } = {}) => {
  const { data, isLoading, error, refetch } = useFetchItem({
    queryKey: ["transactionDetails", transactionId],
    queryFn: () => httpService.getData(routes.getTransactionDetails(transactionId)),
    enabled: enabled && !!transactionId,
    retry: 2,
    staleTime: 30 * 1000,
  });

  return {
    transactionDetails: data?.data || null,
    isTransactionDetailsLoading: isLoading,
    transactionDetailsError: ErrorHandler(error),
    refetchTransactionDetails: refetch,
  };
};

// =================== BULK TRANSACTION OPERATIONS ===================
export const useBulkUpdateTransactions = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ transactionIds, action, data = {} }) => {
      return httpService.patchData({
        transactionIds,
        action,
        ...data
      }, routes.bulkUpdateTransactions());
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      
      toast.success(response?.message || 'Transactions updated successfully');
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to update transactions';
      toast.error(errorMessage);
    }
  });
};

// =================== EXPORT TRANSACTIONS ===================
export const useExportTransactions = () => {
  return useMutation({
    mutationFn: async (filters = {}) => {
      const response = await httpService.getData(routes.getAllTransactions({
        ...filters,
        export: true,
        limit: 50000 // Large limit for export
      }));
      
      return response;
    },
    onSuccess: (response) => {
      // Handle CSV download
      const csvData = response?.csvData || response?.data;
      if (csvData) {
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        toast.success('Transactions exported successfully');
      }
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to export transactions';
      toast.error(errorMessage);
    }
  });
};

// =================== TRANSACTION ANALYTICS ===================
export const useGetTransactionAnalytics = (filters = {}) => {
  const { timeframe = '30d', enabled = true } = filters;
  
  const { data, isLoading, error, refetch } = useFetchItem({
    queryKey: ['transactionAnalytics', { timeframe }],
    queryFn: () => httpService.getData(routes.getTransactionAnalytics({ timeframe })),
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: 2
  });

  return {
    transactionAnalytics: data?.data || {},
    isTransactionAnalyticsLoading: isLoading,
    transactionAnalyticsError: ErrorHandler(error),
    refetchTransactionAnalytics: refetch
  };
};

// =================== TRANSACTION SEARCH ===================
export const useSearchTransactions = () => {
  const { data, isLoading, error, refetch, setFilter } = useFetchItem({
    queryKey: ["searchTransactions"],
    queryFn: (searchParams) => {
      return httpService.getData(routes.getAllTransactions({
        ...searchParams,
        search: searchParams.query
      }));
    },
    enabled: false, // Only search when explicitly triggered
    retry: 2
  });

  const searchTransactions = (query) => {
    setFilter({ query });
  };

  return {
    searchResults: data?.data || [],
    isSearching: isLoading,
    searchError: ErrorHandler(error),
    searchTransactions,
    refetchSearch: refetch
  };
};