// services/support.js - Final version using your existing API route structure
import httpService from "../httpService";
import { routes } from "../api-routes";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// =================== SUPPORT REQUEST ENDPOINTS ===================

/**
 * Get all support requests with filtering and pagination
 * Uses your existing route pattern
 */
export const getAllSupportRequests = async (params = {}) => {
  const endpoint = routes.getAllSupportRequests(params);
  return await httpService.getData(endpoint);
};

/**
 * Get detailed support request information by ID
 */
export const getSupportRequestDetails = async (supportId) => {
  const endpoint = routes.getSupportRequestDetails(supportId);
  return await httpService.getData(endpoint);
};

/**
 * Update support request status
 */
export const updateSupportStatus = async (supportId, data) => {
  const endpoint = routes.updateSupportStatus(supportId);
  return await httpService.putData(data, endpoint);
};

/**
 * Update support tracking information
 */
export const updateSupportTracking = async (supportId, data) => {
  const endpoint = routes.updateSupportTracking(supportId);
  return await httpService.putData(data, endpoint);
};

/**
 * Get support requests by user
 */
export const getSupportRequestsByUser = async (userId, params = {}) => {
  const endpoint = routes.getSupportRequestsByUser(userId, params);
  return await httpService.getData(endpoint);
};

/**
 * Get support analytics
 */
export const getSupportAnalytics = async (params = {}) => {
  const endpoint = routes.getSupportAnalytics(params);
  return await httpService.getData(endpoint);
};

// =================== REACT QUERY HOOKS ===================

/**
 * Hook to fetch all support requests with caching and filtering
 */
export const useSupportRequests = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['supportRequests', params],
    queryFn: () => getAllSupportRequests(params),
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
 * Hook to fetch support request details
 */
export const useSupportRequestDetails = (supportId, options = {}) => {
  return useQuery({
    queryKey: ['supportRequest', supportId],
    queryFn: () => getSupportRequestDetails(supportId),
    enabled: !!supportId,
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
 * Hook to fetch support requests by user
 */
export const useSupportRequestsByUser = (userId, params = {}, options = {}) => {
  return useQuery({
    queryKey: ['supportRequests', 'user', userId, params],
    queryFn: () => getSupportRequestsByUser(userId, params),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options
  });
};

/**
 * Hook to fetch support analytics
 */
export const useSupportAnalytics = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ['supportAnalytics', params],
    queryFn: () => getSupportAnalytics(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options
  });
};

/**
 * Hook to update support request status
 */
export const useUpdateSupportStatus = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ supportId, data }) => updateSupportStatus(supportId, data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch support requests
      queryClient.invalidateQueries({ queryKey: ['supportRequests'] });
      queryClient.invalidateQueries({ queryKey: ['supportRequest', variables.supportId] });
      queryClient.invalidateQueries({ queryKey: ['supportAnalytics'] });
      
      toast.success('Support request status updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update support status:', error);
      const errorMessage = error?.response?.data?.message || 
                         error?.response?.data?.error || 
                         'Failed to update support status';
      toast.error(errorMessage);
    },
    ...options
  });
};

/**
 * Hook to update support tracking information
 */
export const useUpdateSupportTracking = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ supportId, data }) => updateSupportTracking(supportId, data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch support requests
      queryClient.invalidateQueries({ queryKey: ['supportRequests'] });
      queryClient.invalidateQueries({ queryKey: ['supportRequest', variables.supportId] });
      
      toast.success('Support tracking information updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update support tracking:', error);
      const errorMessage = error?.response?.data?.message || 
                         error?.response?.data?.error || 
                         'Failed to update support tracking information';
      toast.error(errorMessage);
    },
    ...options
  });
};

// =================== UTILITY FUNCTIONS ===================

/**
 * Get status badge color for UI components
 */
export const getStatusBadgeColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'NEW':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'IN_PROGRESS':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'RESOLVED':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

/**
 * Get priority badge color
 */
export const getPriorityBadgeColor = (priority) => {
  switch (priority?.toUpperCase()) {
    case 'LOW':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'MEDIUM':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'HIGH':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'URGENT':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

/**
 * Get category display name
 */
export const getCategoryDisplayName = (category) => {
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
 * Format support request for table display
 * Handles different possible data structures from your API
 */
export const formatSupportRequestForTable = (supportRequest) => {
  const user = supportRequest.user || supportRequest.customer;
  const assignedAdmin = supportRequest.assignedAdmin || supportRequest.admin;
  
  return {
    id: supportRequest.id,
    supportId: supportRequest.supportId || supportRequest.ticketId || `SUP-${supportRequest.id}`,
    customer: user?.profile?.fullName || user?.name || user?.email || 'Unknown Customer',
    customerEmail: user?.email,
    customerType: user?.type || 'individual',
    category: getCategoryDisplayName(supportRequest.category),
    subject: supportRequest.subject || supportRequest.title,
    messageSnippet: supportRequest.message?.substring(0, 100) + (supportRequest.message?.length > 100 ? '...' : ''),
    message: supportRequest.message,
    status: supportRequest.status,
    priority: supportRequest.priority,
    assignedAdmin: assignedAdmin?.adminProfile?.fullName || assignedAdmin?.name || 'Unassigned',
    assignedAdminId: supportRequest.assignedAdminId,
    resolutionChannel: supportRequest.resolutionChannel,
    internalNotes: supportRequest.internalNotes,
    dateSubmitted: supportRequest.dateSubmitted,
    updatedAt: supportRequest.updatedAt,
    resolvedAt: supportRequest.resolvedAt,
    formattedDate: new Date(supportRequest.dateSubmitted).toLocaleDateString(),
    formattedTime: new Date(supportRequest.createdAt).toLocaleTimeString(),
  };
};

/**
 * Calculate support summary statistics
 */
export const calculateSupportSummary = (supportList) => {
  if (!Array.isArray(supportList) || supportList.length === 0) {
    return {
      total: 0,
      byStatus: {},
      byPriority: {},
      byCategory: {},
      responseTimeAvg: 0,
    };
  }

  const summary = {
    total: supportList.length,
    byStatus: {},
    byPriority: {},
    byCategory: {},
    responseTimeAvg: 0,
  };

  supportList.forEach(request => {
    // Count by status
    const status = request.status || 'UNKNOWN';
    summary.byStatus[status] = (summary.byStatus[status] || 0) + 1;

    // Count by priority
    const priority = request.priority || 'UNKNOWN';
    summary.byPriority[priority] = (summary.byPriority[priority] || 0) + 1;

    // Count by category
    const category = request.category || 'UNKNOWN';
    summary.byCategory[category] = (summary.byCategory[category] || 0) + 1;
  });

  return summary;
};

/**
 * Get support status workflow
 */
export const getSupportStatusWorkflow = () => {
  return [
    { value: 'NEW', label: 'New', description: 'Newly submitted request awaiting review' },
    { value: 'IN_PROGRESS', label: 'In Progress', description: 'Request is being actively worked on' },
    { value: 'RESOLVED', label: 'Resolved', description: 'Request has been resolved and closed' }
  ];
};

/**
 * Validate status transition
 */
export const isValidStatusTransition = (currentStatus, newStatus) => {
  const transitions = {
    'NEW': ['IN_PROGRESS', 'RESOLVED'],
    'IN_PROGRESS': ['RESOLVED', 'NEW'],
    'RESOLVED': ['IN_PROGRESS'] // Can reopen if needed
  };
  
  return transitions[currentStatus]?.includes(newStatus) || false;
};