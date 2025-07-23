// // hooks/useTransactions.ts
// import { useMemo, useState } from 'react';
// import useSWR from 'swr';

// export const useTransactions = () => {
//   const { data, error } = useSWR<{data}>('transactions');
//   const [filters, setFilters] = useState({});

//   const processedData = useMemo(() => {
//     if (!data?.data) return [];
    
//     return data.data.map(tx => ({
//       ...tx,
//       amount: Number(tx.amount),
//       order: {
//         ...tx.order,
//         totalPrice: Number(tx.order.totalPrice),
//         items: tx.order.items.map(item => ({
//           ...item,
//           price: Number(item.price)
//         }))
//       }
//     }));
//   }, [data]);

//   const filteredTransactions = useMemo(() => {
//     return processedData.filter(tx => {
//       const date = new Date(tx.createdAt);
//       return (
//         (!filters.status || tx.status === filters.status) &&
//         (!filters.minAmount || tx.amount >= filters.minAmount) &&
//         (!filters.maxAmount || tx.amount <= filters.maxAmount) &&
//         (!filters.startDate || date >= filters.startDate) &&
//         (!filters.endDate || date <= filters.endDate)
//       );
//     });
//   }, [processedData, filters]);

//   const metrics = useMemo(() => ({
//     total: {
//       transactions: filteredTransactions.length,
//       amount: filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0)
//     },
//     statusDistribution: filteredTransactions.reduce((acc, tx) => ({
//       ...acc,
//       [tx.status]: (acc[tx.status] || 0) + 1
//     }), {} )
//   }), [filteredTransactions]);

//   return {
//     transactions: filteredTransactions,
//     metrics,
//     isLoading: !error && !data,
//     error,
//     currentFilters: filters,
//     updateFilters: (newFilters) => 
//       setFilters(prev => ({ ...prev, ...newFilters })),
//     resetFilters: () => setFilters({})
//   };
// };

// "use client"
// import { routes } from "../api-routes";
// import { ErrorHandler } from "../errorHandler";
// import httpService from "../httpService";
// import { useState, useEffect } from "react";
// import { useMemo } from "react";

// export const useGetAllTransactionsClientPagination = ({
//   enabled = true,
//   initialFilters = any,
//   initialPageSize = 10,
// }) => {
//   const [filters, setFilters] = useState(initialFilters);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(initialPageSize);
//   const [allTransactions, setAllTransactions] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [isFetched, setIsFetched] = useState(false);

//   // Calculate paginated data
//   const paginatedData = useMemo(() => {
//     const startIndex = (currentPage - 1) * pageSize;
//     return allTransactions.slice(startIndex, startIndex + pageSize);
//   }, [allTransactions, currentPage, pageSize]);

//   // Calculate total pages
//   const totalPages = useMemo(() => {
//     return Math.ceil(allTransactions.length / pageSize);
//   }, [allTransactions.length, pageSize]);

//   // Calculate summary statistics
//   const summaryStats = useMemo(() => {
//      // Sort transactions by date in descending order to easily get the latest ones
//      const sortedTransactions = [...allTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

//      // Determine the current period (e.g., last 30 days) and previous period
//      // This is a simplified example. In a real application, you might use a date range picker
//      // or more sophisticated logic to define 'current' and 'previous' periods.
 
//      const ONE_MONTH_IN_MS = 30 * 24 * 60 * 60 * 1000; // Approximately 30 days
//      const now = new Date();
//      const currentPeriodStart = new Date(now.getTime() - ONE_MONTH_IN_MS);
//      const previousPeriodStart = new Date(currentPeriodStart.getTime() - ONE_MONTH_IN_MS);
 
//      const currentPeriodTransactions = sortedTransactions.filter(tx =>
//        new Date(tx.date) >= currentPeriodStart
//      );
 
//      const previousPeriodTransactions = sortedTransactions.filter(tx =>
//        new Date(tx.date) >= previousPeriodStart && new Date(tx.date) < currentPeriodStart
//      );
 
//      // Calculate current period stats
//      const currentTotalAmount = currentPeriodTransactions.reduce((sum, tx) => sum + tx.amount, 0);
//      const currentTransactionCount = currentPeriodTransactions.length;
 
//      // Calculate previous period stats
//      const previousTotalAmount = previousPeriodTransactions.reduce((sum, tx) => sum + tx.amount, 0);
//      const previousTransactionCount = previousPeriodTransactions.length;
 
//      // Calculate amount trend
//      const amountTrend = previousTotalAmount > 0
//        ? ((currentTotalAmount - previousTotalAmount) / previousTotalAmount) * 100
//        : (currentTotalAmount > 0 ? 100 : 0); // If previous is 0, and current is > 0, it's a 100% increase. If both are 0, trend is 0.
 
//      // Calculate count trend
//      const countTrend = previousTransactionCount > 0
//        ? ((currentTransactionCount - previousTransactionCount) / previousTransactionCount) * 100
//        : (currentTransactionCount > 0 ? 100 : 0); // If previous is 0, and current is > 0, it's a 100% increase. If both are 0, trend is 0.
//     return {
//       totalAmount: allTransactions.reduce((sum, tx) => sum + tx.amount, 0),
//       transactionCount: allTransactions.length,
//       averageAmount: allTransactions.length 
//         ? allTransactions.reduce((sum, tx) => sum + tx.amount, 0) / allTransactions.length
//         : 0,
//       successCount: allTransactions.filter(tx => tx.status === 'success').length,
//       failedCount: allTransactions.filter(tx => tx.status === 'failed').length,
//       amountTrend,
//       countTrend
//     };
//   }, [allTransactions]);

//   // Fetch all transactions
//   const fetchTransactions = async () => {
//     if (!enabled) return;

//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const response = await httpService.getData(routes.paymentManagement(), {
//         params: filters
//       });
      
//       setAllTransactions(response.data || []);
//       setIsFetched(true);
//     } catch (err) {
//       setError(ErrorHandler(err));
//       console.error('Failed to fetch transactions:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Refetch function
//   const refetch = () => {
//     setIsFetched(false);
//     fetchTransactions();
//   };

//   // Initial fetch and filter changes
//   useEffect(() => {
//     if (!isFetched && enabled) {
//       fetchTransactions();
//     }
//   }, [filters, enabled, isFetched]);

//   // Reset to first page when filters change
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [filters]);

//   return {
//     // Data states
//     transactions: paginatedData,
//     allTransactions,
//     summaryStats,
    
//     // Pagination controls
//     pagination: {
//       currentPage,
//       totalPages,
//       pageSize,
//       totalItems: allTransactions.length,
//       setPage: setCurrentPage,
//       setPageSize: (newSize) => {
//         setPageSize(newSize);
//         setCurrentPage(1); // Reset to first page when page size changes
//       },
//       canPrevious: currentPage > 1,
//       canNext: currentPage < totalPages,
//       goToNext: () => setCurrentPage(prev => Math.min(prev + 1, totalPages)),
//       goToPrev: () => setCurrentPage(prev => Math.max(prev - 1, 1)),
//       goToPage: (page) => setCurrentPage(Math.min(Math.max(1, page), totalPages)),
//     },
    
//     // Filtering
//     filters,
//     setFilters: (newFilters) => {
//       setFilters(prev => ({ ...prev, ...newFilters }));
//     },
//     resetFilters: () => setFilters(initialFilters),
    
//     // Loading states
//     isLoading,
//     isFetching: isLoading,
//     isFetched,
    
//     // Error handling
//     error,
    
//     // Data refreshing
//     refetch,
//   };
// };

"use client"; // This line MUST be at the very top of the file

import { routes } from "../api-routes";
import { ErrorHandler } from "../errorHandler";
import httpService from "../httpService";
import { useState, useEffect, useMemo } from "react";

// In JavaScript, you'd typically define the expected shape
// of your transaction object with comments or JSDoc if you want
// to provide documentation for other developers.
/*
 * @typedef {object} Transaction
 * @property {string} id
 * @property {string} reference
 * @property {number} amount
 * @property {'success' | 'pending' | 'failed' | 'refunded'} status
 * @property {object} customer
 * @property {string} customer.name
 * @property {string} customer.email
 * @property {string} date - Date in a format parsable by new Date() (e.g., 'YYYY-MM-DD' or ISO 8601)
 * @property {string} paymentMethod
 * @property {string} [description]
 */

// Define the shape of your initialFilters if they have a specific structure
// For 'any', it's okay for now, but better to define types if possible.
/*
 * @typedef {object} InitialFilters - Adjust this to your actual filter structure
 */

export const useGetAllTransactionsClientPagination = ({
  enabled = true,
  initialFilters,
  initialPageSize = 10,
}) => {
  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  // FIX: Initialize allTransactions as an empty array
  const [allTransactions, setAllTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // Error can be string or null
  const [isFetched, setIsFetched] = useState(false);

  // Calculate paginated data
  const paginatedData = useMemo(() => {
    // Defensive check: Ensure allTransactions is an array before calling slice
    if (!Array.isArray(allTransactions)) {
      console.warn("allTransactions is not an array. Returning empty array for pagination.");
      return []; // Return empty array if not an array
    }
    const startIndex = (currentPage - 1) * pageSize;
    return allTransactions.slice(startIndex, startIndex + pageSize);
  }, [allTransactions, currentPage, pageSize]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    // Defensive check
    if (!Array.isArray(allTransactions) || allTransactions.length === 0 || pageSize === 0) {
      return 0;
    }
    return Math.ceil(allTransactions.length / pageSize);
  }, [allTransactions.length, pageSize]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    // Defensive check for summary calculations
    if (!Array.isArray(allTransactions) || allTransactions.length === 0) {
      return {
        totalAmount: 0,
        transactionCount: 0,
        averageAmount: 0,
        successCount: 0,
        failedCount: 0,
        amountTrend: 0,
        countTrend: 0,
      };
    }

    // Sort transactions by date in descending order to easily get the latest ones
    const sortedTransactions = [...allTransactions].sort((a, b) => {
      // Ensure date strings are converted to Date objects for proper comparison
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });

    // Determine the current period (e.g., last 30 days) and previous period
    const ONE_MONTH_IN_MS = 30 * 24 * 60 * 60 * 1000; // Approximately 30 days
    const now = new Date();
    const currentPeriodStart = new Date(now.getTime() - ONE_MONTH_IN_MS);
    const previousPeriodStart = new Date(currentPeriodStart.getTime() - ONE_MONTH_IN_MS);

    const currentPeriodTransactions = sortedTransactions.filter(
      (tx) => new Date(tx.date) >= currentPeriodStart
    );

    const previousPeriodTransactions = sortedTransactions.filter(
      (tx) =>
        new Date(tx.date) >= previousPeriodStart &&
        new Date(tx.date) < currentPeriodStart
    );

    // Calculate current period stats
    const currentTotalAmount = currentPeriodTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    const currentTransactionCount = currentPeriodTransactions.length;

    // Calculate previous period stats
    const previousTotalAmount = previousPeriodTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    const previousTransactionCount = previousPeriodTransactions.length;

    // Calculate amount trend
    const amountTrend =
      previousTotalAmount > 0
        ? ((currentTotalAmount - previousTotalAmount) / previousTotalAmount) * 100
        : currentTotalAmount > 0
        ? 100 // If previous is 0 and current is > 0, it's a 100% increase
        : 0; // If both are 0, trend is 0

    // Calculate count trend
    const countTrend =
      previousTransactionCount > 0
        ? ((currentTransactionCount - previousTransactionCount) / previousTransactionCount) * 100
        : currentTransactionCount > 0
        ? 100 // If previous is 0 and current is > 0, it's a 100% increase
        : 0; // If both are 0, trend is 0

    return {
      totalAmount: currentTotalAmount, // Use current period's total for summary
      transactionCount: currentTransactionCount, // Use current period's count for summary
      averageAmount: currentTransactionCount
        ? currentTotalAmount / currentTransactionCount
        : 0,
      successCount: currentPeriodTransactions.filter(
        (tx) => tx.status === "success"
      ).length,
      failedCount: currentPeriodTransactions.filter(
        (tx) => tx.status === "failed"
      ).length,
      amountTrend,
      countTrend,
    };
  }, [allTransactions]);

   // Fetch all transactions
   const fetchTransactions = async () => {
    if (!enabled) {
      setIsLoading(false); // Ensure loading is false if not enabled
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await httpService.getData(routes.paymentManagement(), {
        params: filters,
      });

      // FIX: Adjust this line to correctly access the array from response.data.data
      if (response.data && Array.isArray(response.data.data)) {
        setAllTransactions(response.data.data); // Correctly access the 'data' array
      } else if (Array.isArray(response.data)) {
        // This case would be for APIs that return an array directly (e.g., [{}, {}, ...])
        setAllTransactions(response.data);
      } else if (response.data && Array.isArray(response.data.transactions)) {
        // This case would be for APIs that return { transactions: [...] }
        setAllTransactions(response.data.transactions);
      } else {
        console.warn(
          "API response data is not an array or does not contain an expected array key ('data' or 'transactions'):",
          response.data
        );
        setAllTransactions([]); // Default to empty array if unexpected response
      }
      setIsFetched(true);
    } catch (err) {
      setError(ErrorHandler(err));
      console.error("Failed to fetch transactions:", err);
      setAllTransactions([]); // Clear transactions on error to prevent further issues
    } finally {
      setIsLoading(false);
    }
  };
  // Refetch function
  const refetch = () => {
    setIsFetched(false); // Mark as not fetched to trigger useEffect
    // The useEffect below will handle calling fetchTransactions
  };

  // Initial fetch and filter changes
  useEffect(() => {
    if (!isFetched && enabled) {
      fetchTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, enabled, isFetched]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  return {
    // Data states
    transactions: paginatedData,
    allTransactions, // Expose all transactions for potential other uses
    summaryStats,

    // Pagination controls
    pagination: {
      currentPage,
      totalPages,
      pageSize,
      totalItems: allTransactions.length,
      setPage: setCurrentPage,
      setPageSize: (newSize) => { // Removed ': number' type annotation
        setPageSize(newSize);
        setCurrentPage(1); // Reset to first page when page size changes
      },
      canPrevious: currentPage > 1,
      canNext: currentPage < totalPages,
      goToNext: () => setCurrentPage((prev) => Math.min(prev + 1, totalPages)),
      goToPrev: () => setCurrentPage((prev) => Math.max(prev - 1, 1)),
      goToPage: (page) => // Removed ': number' type annotation
        setCurrentPage(Math.min(Math.max(1, page), totalPages)),
    },

    // Filtering
    filters,
    setFilters: (newFilters) => { // Removed ': Partial<InitialFilters>' type annotation
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    resetFilters: () => setFilters(initialFilters),

    // Loading states
    isLoading,
    isFetching: isLoading, // Alias for isLoading, common in data fetching hooks
    isFetched, // Indicates if data has been fetched at least once

    // Error handling
    error,

    // Data refreshing
    refetch,
  };
};

// "use client";

// import { useState, useCallback } from "react";
// import { routes } from "../api-routes"; // Assuming you have a routes object for API endpoints
// import { ErrorHandler } from "../errorHandler"; // Assuming you have an ErrorHandler utility
// import httpService from "../httpService"; // Assuming you have an httpService for API calls

// /**
//  * Interface defining the shape of the object returned by the useProcessRefund hook.
//  */


// export const useProcessRefund = () => {
//   const [isProcessingRefund, setIsProcessingRefund] = useState(false);
//   const [refundError, setRefundError] = useState(null); // Type 'any' for now, can be refined
//   const [refundSuccess, setRefundSuccess] = useState(false);

//   /**
//    * Function to initiate the refund process.
//    * @param {string} transactionId - The ID of the transaction to refund.
//    * @param {string} reason - The reason for the refund.
//    * @returns {Promise<Object|null>} The data from the successful refund, or null if an error occurred.
//    */
//   const processRefund = useCallback(async (transactionId, reason) => {
//     setIsProcessingRefund(true);
//     setRefundError(null);
//     setRefundSuccess(false);

//     try {
//       const response = await httpService.post(routes.refund(transactionId), { reason });
//       setRefundSuccess(true);
//       return response.data; // Return the data from the successful response
//     } catch (error) {
//       setRefundError(ErrorHandler(error));
//       setRefundSuccess(false);
//       return null; // Return null on error
//     } finally {
//       setIsProcessingRefund(false);
//     }
//   }, []); // Empty dependency array ensures the function is stable across renders

//   return {
//     processRefund,
//     isProcessingRefund,
//     refundSuccess,
//     refundError,
//   };
// };

export const useProcessRefund = () => {
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);
  const [refundError, setRefundError] = useState(null);
  const [refundSuccess, setRefundSuccess] = useState(false);

  /**
   * Function to initiate the refund process.
   * @param {string} transactionId - The ID of the transaction to refund.
   * @param {string} reason - The reason for the refund.
   * @returns {Promise<Object|null>} The data from the successful refund, or null if an error occurred.
   */
  const processRefund = useCallback(async (transactionId, reason) => {
    setIsProcessingRefund(true);
    setRefundError(null);
    setRefundSuccess(false);

    try {
      const response = await httpService.post(routes.refund(transactionId), { reason });
      setRefundSuccess(true);
      return response.data; // Return the data from the successful response
    } catch (error) {
      setRefundError(ErrorHandler(error));
      setRefundSuccess(false);
      return null; // Return null on error
    } finally {
      setIsProcessingRefund(false);
    }
  }, []); // Empty dependency array ensures the function is stable across renders

  return {
    processRefund,
    isProcessingRefund,
    refundSuccess,
    refundError,
  };
};

/*
// Example Usage (assuming a React component context):
import React from 'react';
import { useProcessRefund } from './useProcessRefund'; // Adjust path as needed

function RefundComponent() {
  const { processRefund, isProcessingRefund, refundSuccess, refundError } = useProcessRefund();
  const transactionId = "some-transaction-id-123";
  const refundReason = "Customer requested refund due to duplicate charge";

  const handleRefund = async () => {
    const result = await processRefund(transactionId, refundReason);
    if (result) {
      console.log("Refund processed successfully:", result);
      // You might want to display a success message to the user
    } else {
      console.error("Refund failed:", refundError);
      // You might want to display an error message to the user
    }
  };

  return (
    <div>
      <h3>Process Refund</h3>
      <button onClick={handleRefund} disabled={isProcessingRefund}>
        {isProcessingRefund ? "Processing..." : "Initiate Refund"}
      </button>

      {refundSuccess && <p style={{ color: 'green' }}>Refund processed successfully!</p>}
      {refundError && <p style={{ color: 'red' }}>Error: {refundError.message}</p>}
    </div>
  );
}

export default RefundComponent;
*/
