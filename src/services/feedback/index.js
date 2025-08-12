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
    dateSubmitted: feedback.createdAt,
    createdAt: feedback.createdAt,
    updatedAt: feedback.updatedAt,
    formattedDate: new Date(feedback.createdAt).toLocaleDateString(),
    formattedTime: new Date(feedback.createdAt).toLocaleTimeString(),
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
    formattedDate: new Date(feedback.createdAt).toLocaleDateString(),
    formattedTime: new Date(feedback.createdAt).toLocaleTimeString(),
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