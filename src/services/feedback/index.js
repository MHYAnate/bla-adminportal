// services/feedback.js - Final version using your existing API route structure
import httpService from "../httpService";
import { routes } from "../api-routes";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// =================== FEEDBACK ENDPOINTS ===================

/**
 * Get all feedback with filtering and pagination
 * Uses your existing route pattern
 */
export const getAllFeedback = async (params = {}) => {
  const endpoint = routes.getAllFeedback(params);
  return await httpService.getData(endpoint);
};

/**
 * Get detailed feedback information by ID
 */
export const getFeedbackDetails = async (feedbackId) => {
  const endpoint = routes.getFeedbackDetails(feedbackId);
  return await httpService.getData(endpoint);
};

/**
 * Update feedback status
 */
export const updateFeedbackStatus = async (feedbackId, data) => {
  const endpoint = routes.updateFeedbackStatus(feedbackId);
  return await httpService.putData(data, endpoint);
};

/**
 * Get all feedback from a specific user
 */
export const getFeedbackByUser = async (userId, params = {}) => {
  const endpoint = routes.getFeedbackByUser(userId, params);
  return await httpService.getData(endpoint);
};

/**
 * Get feedback analytics
 */
export const getFeedbackAnalytics = async (params = {}) => {
  const endpoint = routes.getFeedbackAnalytics(params);
  return await httpService.getData(endpoint);
};

// =================== REACT QUERY HOOKS ===================

/**
 * Hook to fetch all feedback with caching and filtering
 */
export const useFeedback = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['feedback', params],
    queryFn: () => getAllFeedback(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 2;
    },
    select: (data) => {
      // Handle different possible response structures
      if (data?.success && data?.data) {
        return {
          data: data.data,
          pagination: data.pagination,
          totalCount: data.totalCount || data.pagination?.totalCount,
          summary: data.summary
        };
      }
      return data;
    },
    ...options
  });
};

/**
 * Hook to fetch feedback details
 */
export const useFeedbackDetails = (feedbackId, options = {}) => {
  return useQuery({
    queryKey: ['feedback', feedbackId],
    queryFn: () => getFeedbackDetails(feedbackId),
    enabled: !!feedbackId,
    staleTime: 1 * 60 * 1000, // 1 minute
    select: (data) => {
      // Handle different possible response structures
      if (data?.success && data?.data) {
        return data.data;
      }
      return data;
    },
    ...options
  });
};

/**
 * Hook to fetch feedback by user
 */
export const useFeedbackByUser = (userId, params = {}, options = {}) => {
  return useQuery({
    queryKey: ['feedback', 'user', userId, params],
    queryFn: () => getFeedbackByUser(userId, params),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options
  });
};

/**
 * Hook to fetch feedback analytics
 */
export const useFeedbackAnalytics = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['feedbackAnalytics', params],
    queryFn: () => getFeedbackAnalytics(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options
  });
};

/**
 * Hook to update feedback status
 */
export const useUpdateFeedbackStatus = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => {
      // Extract the parameters correctly
      const { feedbackId, data } = variables;
      return await updateFeedbackStatus(feedbackId, data);
    },
    onSuccess: (responseData, variables) => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
      queryClient.invalidateQueries({ queryKey: ['feedback', variables.feedbackId] });
      
      if (options.onSuccess) {
        options.onSuccess(responseData, variables);
      } else {
        toast.success('Feedback status updated successfully');
      }
    },
    onError: (error, variables) => {
      console.error('Failed to update feedback status:', error);
      const errorMessage = error?.response?.data?.message || 
                         error?.response?.data?.error || 
                         'Failed to update feedback status';
      
      if (options.onError) {
        options.onError(error, variables);
      } else {
        toast.error(errorMessage);
      }
    },
    ...options
  });
};
// =================== UTILITY FUNCTIONS ===================

/**
 * Get feedback type display name
 */
export const getFeedbackTypeDisplayName = (type) => {
  switch (type?.toUpperCase()) {
    case 'RATINGS':
      return 'Ratings';
    case 'COMMENTS':
      return 'Comments';
    case 'SUGGESTIONS':
      return 'Suggestions';
    case 'COMPLAINTS':
      return 'Complaints';
    default:
      return type || 'Unknown';
  }
};

/**
 * Get feedback type badge color
 */
export const getFeedbackTypeBadgeColor = (type) => {
  switch (type?.toUpperCase()) {
    case 'RATINGS':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'COMMENTS':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'SUGGESTIONS':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'COMPLAINTS':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

/**
 * Get feedback status badge color
 */
export const getFeedbackStatusBadgeColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'NEW':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'REVIEWED':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'IN_PROGRESS':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'RESOLVED':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'CLOSED':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

/**
 * Get customer type display name
 */
export const getCustomerTypeDisplayName = (customerType) => {
  switch (customerType?.toLowerCase()) {
    case 'individual':
      return 'Individual';
    case 'business':
      return 'Business Owner';
    default:
      return customerType || 'Unknown';
  }
};

/**
 * Format rating stars
 */
export const formatRatingStars = (rating) => {
  if (!rating || rating < 1 || rating > 5) return '☆☆☆☆☆';
  
  const filled = '★'.repeat(Math.floor(rating));
  const empty = '☆'.repeat(5 - Math.floor(rating));
  return filled + empty;
};

/**
 * Format feedback for card display (dashboard view)
 * Handles different possible data structures from your API
 */
export const formatFeedbackForCard = (feedback) => {
  const user = feedback.user || feedback.customer;
  
  return {
    id: feedback.id,
    feedbackId: feedback.feedbackId || `FB-${feedback.id}`,
    type: getFeedbackTypeDisplayName(feedback.type),
    customer: user?.profile?.fullName || user?.name || user?.email || 'Anonymous',
    customerType: getCustomerTypeDisplayName(user?.type),
    customerEmail: user?.email,
    messageSnippet: feedback.message?.substring(0, 150) + (feedback.message?.length > 150 ? '...' : ''),
    message: feedback.message,
    rating: feedback.rating,
    ratingStars: formatRatingStars(feedback.rating),
    status: feedback.status,
    product: feedback.product?.name || 'N/A',
    order: feedback.order?.orderNumber || 'N/A',
    title: feedback.title || feedback.subject,
    adminNotes: feedback.adminNotes,
    dateSubmitted: feedback. dateSubmitted,
    createdAt: feedback.dateSubmitted,
    updatedAt: feedback.updatedAt,
    formattedDate: new Date(feedback.dateSubmitted).toLocaleDateString(),
    formattedTime: new Date(feedback.dateSubmitted).toLocaleTimeString()
  };
};

/**
 * Format feedback for table display
 */
export const formatFeedbackForTable = (feedback) => {
  const user = feedback.user || feedback.customer;
  
  return {
    id: feedback.id,
    feedbackId: feedback.feedbackId || `FB-${feedback.id}`,
    customer: user?.profile?.fullName || user?.name || user?.email || 'Anonymous',
    customerEmail: user?.email,
    customerType: getCustomerTypeDisplayName(user?.type),
    type: getFeedbackTypeDisplayName(feedback.type),
    subject: feedback.title || feedback.subject || 'No Subject',
    messageSnippet: feedback.message?.substring(0, 100) + (feedback.message?.length > 100 ? '...' : ''),
    message: feedback.message,
    rating: feedback.rating,
    ratingStars: formatRatingStars(feedback.rating),
    status: feedback.status,
    product: feedback.product?.name || 'N/A',
    order: feedback.order?.orderNumber || 'N/A',
    adminNotes: feedback.adminNotes,
    createdAt: feedback.createdAt,
    updatedAt: feedback.updatedAt,
    formattedDate: new Date(feedback.dateSubmitted).toLocaleDateString(),
    formattedTime: new Date(feedback.dateSubmitted).toLocaleTimeString()
  };
};

/**
 * Calculate feedback summary statistics
 */
export const calculateFeedbackSummary = (feedbackList) => {
  if (!Array.isArray(feedbackList) || feedbackList.length === 0) {
    return {
      total: 0,
      byType: {},
      byStatus: {},
      averageRating: 0,
      ratingDistribution: {},
    };
  }

  const summary = {
    total: feedbackList.length,
    byType: {},
    byStatus: {},
    averageRating: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  };

  let totalRating = 0;
  let ratingCount = 0;

  feedbackList.forEach(feedback => {
    // Count by type
    const type = feedback.type || 'UNKNOWN';
    summary.byType[type] = (summary.byType[type] || 0) + 1;

    // Count by status
    const status = feedback.status || 'UNKNOWN';
    summary.byStatus[status] = (summary.byStatus[status] || 0) + 1;

    // Calculate rating statistics
    if (feedback.rating && feedback.rating >= 1 && feedback.rating <= 5) {
      totalRating += feedback.rating;
      ratingCount++;
      summary.ratingDistribution[feedback.rating]++;
    }
  });

  // Calculate average rating
  summary.averageRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : 0;

  return summary;
};

/**
 * Get feedback status workflow
 */
export const getFeedbackStatusWorkflow = () => {
  return [
    { value: 'NEW', label: 'New', description: 'Newly submitted feedback awaiting review' },
    { value: 'REVIEWED', label: 'Reviewed', description: 'Feedback has been reviewed by an admin' },
    { value: 'IN_PROGRESS', label: 'In Progress', description: 'Feedback is being actively addressed' },
    { value: 'RESOLVED', label: 'Resolved', description: 'Issues mentioned in feedback have been resolved' },
    { value: 'CLOSED', label: 'Closed', description: 'Feedback has been fully processed and closed' }
  ];
};

/**
 * Validate status transition
 */
export const isValidStatusTransition = (currentStatus, newStatus) => {
  const transitions = {
    'NEW': ['REVIEWED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
    'REVIEWED': ['IN_PROGRESS', 'RESOLVED', 'CLOSED'],
    'IN_PROGRESS': ['RESOLVED', 'CLOSED', 'REVIEWED'],
    'RESOLVED': ['CLOSED', 'IN_PROGRESS'], // Can reopen if needed
    'CLOSED': ['IN_PROGRESS'] // Can reopen only to in progress
  };
  
  return transitions[currentStatus]?.includes(newStatus) || false;
};

/**
 * Get sentiment from rating
 */
export const getSentimentFromRating = (rating) => {
  if (!rating) return 'neutral';
  if (rating >= 4) return 'positive';
  if (rating >= 3) return 'neutral';
  return 'negative';
};

/**
 * Get sentiment color
 */
export const getSentimentColor = (sentiment) => {
  switch (sentiment) {
    case 'positive':
      return 'text-green-600';
    case 'negative':
      return 'text-red-600';
    default:
      return 'text-yellow-600';
  }
};

// ADD THESE FUNCTIONS TO YOUR services/feedback.js FILE

/**
 * Validate status transition for feedback
 */
export const isValidFeedbackTransition = (currentStatus, newStatus) => {
  const transitions = {
    'NEW': ['REVIEWED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
    'REVIEWED': ['IN_PROGRESS', 'RESOLVED', 'CLOSED'],
    'IN_PROGRESS': ['RESOLVED', 'CLOSED', 'REVIEWED'],
    'RESOLVED': ['CLOSED', 'IN_PROGRESS'], // Can reopen if needed
    'CLOSED': ['IN_PROGRESS'] // Can reopen only to in progress
  };
  
  return transitions[currentStatus]?.includes(newStatus) || false;
};


// =================== SUPPORT ENDPOINTS ===================

/**
 * Get support summary statistics
 */
export const getSupportAnalytics = async (params = {}) => {
  const endpoint = routes.getSupportAnalytics(params);
  return await httpService.getData(endpoint);
};

// =================== REACT QUERY HOOKS ===================

/**
 * Hook to fetch support analytics
 */
export const useSupportAnalytics = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['supportAnalytics', params],
    queryFn: () => getSupportAnalytics(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data) => {
      // Handle response structure
      if (data?.success && data?.data) {
        return data.data;
      }
      return data || {
        total: 0,
        byCategory: {},
        byStatus: {},
        byPriority: {}
      };
    },
    ...options
  });
};

// =================== UTILITY FUNCTIONS ===================

/**
 * Get support category display name
 */
export const getSupportCategoryDisplayName = (category) => {
  switch (category?.toUpperCase()) {
    case 'PRODUCT':
      return 'Product';
    case 'ORDER':
      return 'Order';
    case 'DELIVERY':
      return 'Delivery';
    case 'GENERAL':
      return 'General';
    case 'OTHER':
      return 'Other';
    default:
      return category || 'Unknown';
  }
};

/**
 * Get support status display name
 */
export const getSupportStatusDisplayName = (status) => {
  switch (status?.toUpperCase()) {
    case 'NEW':
      return 'New';
    case 'IN_PROGRESS':
      return 'In Progress';
    case 'RESOLVED':
      return 'Resolved';
    case 'CLOSED':
      return 'Closed';
    default:
      return status || 'Unknown';
  }
};

/**
 * Get support priority display name
 */
export const getSupportPriorityDisplayName = (priority) => {
  switch (priority?.toUpperCase()) {
    case 'LOW':
      return 'Low';
    case 'MEDIUM':
      return 'Medium';
    case 'HIGH':
      return 'High';
    case 'URGENT':
      return 'Urgent';
    default:
      return priority || 'Unknown';
  }
};

/**
 * Format support summary for display
 */
export const formatSupportSummary = (analytics) => {
  return {
    total: analytics?.total || 0,
    byCategory: Object.entries(analytics?.byCategory || {}).map(([category, count]) => ({
      name: getSupportCategoryDisplayName(category),
      value: count,
      id: category
    })),
    byStatus: Object.entries(analytics?.byStatus || {}).map(([status, count]) => ({
      name: getSupportStatusDisplayName(status),
      value: count,
      id: status
    })),
    byPriority: Object.entries(analytics?.byPriority || {}).map(([priority, count]) => ({
      name: getSupportPriorityDisplayName(priority),
      value: count,
      id: priority
    }))
  };
};

/**
 * Get support status badge color
 */
export const getSupportStatusBadgeColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'NEW':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'IN_PROGRESS':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'RESOLVED':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'CLOSED':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

/**
 * Get support priority badge color
 */
export const getSupportPriorityBadgeColor = (priority) => {
  switch (priority?.toUpperCase()) {
    case 'LOW':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'HIGH':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'URGENT':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

/**
 * Get support status workflow
 */
export const getSupportStatusWorkflow = () => {
  return [
    { value: 'NEW', label: 'New', description: 'New support request' },
    { value: 'IN_PROGRESS', label: 'In Progress', description: 'Request being handled' },
    { value: 'RESOLVED', label: 'Resolved', description: 'Issue resolved' },
    { value: 'CLOSED', label: 'Closed', description: 'Request closed' }
  ];
};

/**
 * Validate support status transition
 */
export const isValidSupportStatusTransition = (currentStatus, newStatus) => {
  const transitions = {
    'NEW': ['IN_PROGRESS', 'RESOLVED', 'CLOSED'],
    'IN_PROGRESS': ['RESOLVED', 'CLOSED', 'NEW'],
    'RESOLVED': ['CLOSED', 'IN_PROGRESS'],
    'CLOSED': ['IN_PROGRESS'] // Reopen closed tickets
  };
  
  return transitions[currentStatus]?.includes(newStatus) || false;
};

// export const useGetSupportWorkloadStats = () => {
//   return useQuery({
//     queryKey: ['supportWorkloadStats'],
//     queryFn: async () => {
//       console.log('🔍 Fetching support workload statistics...');
//       const response = await httpService.getData('/admin/support/workload-stats');
//       console.log('📊 Workload stats response:', response);
//       return response;
//     },
//     staleTime: 5 * 60 * 1000, // 5 minutes
//     select: (data) => {
//       // Handle different response structures
//       if (data?.data?.data) return data.data.data;
//       if (data?.data) return data.data;
//       return data;
//     },
//     retry: (failureCount, error) => {
//       if (error?.response?.status === 401) return false;
//       return failureCount < 3;
//     },
//   });
// };



// export const useGetSupportWorkloadStats = () => {
//   return useQuery({
//     queryKey: ['supportWorkloadStats'],
//     queryFn: async () => {
//       console.log('🔍 Fetching support workload statistics...');
//       const response = await httpService.getData('/admin/support/workload-stats');
//       console.log('📊 Workload stats response:', response);

//       // Ensure the return matches: { resolvedWithin24Hours: { count, percentage }, ... }
//       const stats = response?.data?.data;

//       return {
//         resolvedWithin24Hours: stats?.resolvedWithin24Hours || { count: 0, percentage: 0 },
//         resolvedWithin2to3Days: stats?.resolvedWithin2to3Days || { count: 0, percentage: 0 },
//         resolvedWithinWeek: stats?.resolvedWithinWeek || { count: 0, percentage: 0 },
//         unresolved: stats?.unresolved || { count: 0, percentage: 0 },
//         totalRequests: stats?.totalRequests ?? 0,
//         summary: stats?.summary || { resolvedCount: 0, unresolvedCount: 0, resolutionRate: 0 },
//         averageResolutionTime: stats?.averageResolutionTime || { hours: 0, days: 0 },
//         priorityBreakdown: stats?.priorityBreakdown || {},
//         generatedAt: stats?.generatedAt || null
//       };
//     },
//     staleTime: 5 * 60 * 1000,
//     retry: (failureCount, error) => {
//       if (error?.response?.status === 401) return false;
//       return failureCount < 3;
//     }
//   });
// };

const defaultWorkloadStats = {
  resolvedWithin24Hours: { count: 0, percentage: 0 },
  resolvedWithin2to3Days: { count: 0, percentage: 0 },
  resolvedWithinWeek: { count: 0, percentage: 0 },
  unresolved: { count: 0, percentage: 0 },
  totalRequests: 0,
  summary: { resolvedCount: 0, unresolvedCount: 0, resolutionRate: 0 },
  averageResolutionTime: { hours: 0, days: 0 },
  priorityBreakdown: {},
  generatedAt: null,
};

// export const useGetSupportWorkloadStats = () => {
//   return useQuery({
//     queryKey: ['supportWorkloadStats'],
//     // ✅ 1. queryFn should just fetch and return the raw API response.
//     queryFn: async () => {
//       console.log('🔍 Fetching support workload statistics...');
//       const response = await httpService.getData('/admin/support/workload-stats');
//       console.log('📊 Raw workload stats response:', response);
//       return response;
//     },
//     staleTime: 5 * 60 * 1000, // 5 minutes

//     // ✅ 2. Use the `select` option to transform the data.
//     select: (response) => {
//       // The actual data is at `response.data`, not `response.data.data`.
//       const stats = response?.data.data;
      
//       // If stats exist, return them. Otherwise, return a safe default structure.
//       return stats || defaultWorkloadStats;
//     },
    
//     retry: (failureCount, error) => {
//       if ((error )?.response?.status === 401) return false;
//       return failureCount < 3;
//     },
//   });
// };



export const useGetSupportWorkloadStats = () => {
  return useQuery({
    queryKey: ['supportWorkloadStats'],
    queryFn: async () => {
      console.log('🔍 Fetching support workload statistics...');
      const response = await httpService.getData('/admin/support/workload-stats');
      console.log('📊 Raw workload stats response:', response);
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes

    // ✅ FIX: The data is in `response.data`, not `response.data.data`
    select: (response) => {
      const stats = response?.data;
      
      // If stats exist, return them. Otherwise, return the safe default structure.
      return stats || defaultWorkloadStats;
    },
    
    retry: (failureCount, error) => {
      // Added type assertion for safety with TypeScript
      if ((error )?.response?.status === 401) return false;
      return failureCount < 3;
    },
  });
};