// services/admin/unified-admin-hooks.js
"use client";

import React, { useState, useEffect } from "react";
import { routes } from "../api-routes";
import { ErrorHandler } from "../errorHandler";
import useFetchItem from "../useFetchItem";
import httpService from "../httpService";
import { toast } from "sonner";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { emitRoleChangeEvent } from '@/context/auth'; // ✅ Enhanced: Import role change event
import { useQuery } from "@tanstack/react-query";

// =================== UTILITY FUNCTIONS ===================

const extractResponseData = (response) => {
  try {
    if (response?.data?.success && response?.data?.data) {
      return response.data.data;
    }
    if (response?.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
      if (response.data.success !== undefined) {
        return response.data.data || response.data;
      }
      return response.data;
    }
    if (response?.success !== undefined) {
      return response.data || response;
    }
    return response;
  } catch (error) {
    console.error('Error extracting response data:', error);
    return response;
  }
};

const extractMessage = (response, defaultMessage = '') => {
  if (response?.data?.message) return response.data.message;
  if (response?.message) return response.message;
  return defaultMessage;
};

// =================== ADMIN INVITATION SYSTEM ===================

export const useGetInvitableRoles = ({ enabled = true } = {}) => {
  const { data, isLoading, error, refetch } = useFetchItem({
    queryKey: ["invitable-roles"],
    queryFn: () => httpService.getData(routes.getInvitableRoles()),
    enabled,
    retry: 2
  });

  return {
    rolesData: extractResponseData(data) || [],
    isRolesLoading: isLoading,
    rolesError: ErrorHandler(error),
    refetchRoles: refetch
  };
};

export const useInviteAdmin = (onSuccess) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const inviteAdminPayload = async (payload) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!payload.email || !payload.roleId) {
        throw new Error("Email and role ID are required");
      }

      if (typeof payload.roleId !== 'number' || payload.roleId <= 0) {
        throw new Error("Invalid role ID provided");
      }

      const response = await httpService.postData(payload, routes.inviteAdmin());
      const extractedData = extractResponseData(response);
      const message = extractMessage(response, 'Admin invitation sent successfully');
      
      setData(extractedData);
      toast.success(message);
      if (onSuccess) onSuccess(extractedData);
      return extractedData;
      
    } catch (error) {
      const errorMessage = ErrorHandler(error);
      setError(errorMessage);
      toast.error(errorMessage);
      throw errorMessage;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    inviteAdminIsLoading: isLoading,
    inviteAdminError: error,
    inviteAdminData: data,
    inviteAdminPayload
  };
};

// export const useGetPendingInvitations = ({ enabled = true, filter = {} }) => {
//   const { data, isLoading, error, refetch } = useFetchItem({
//     queryKey: ["pending-invitations", filter],
//     queryFn: (params) => httpService.getData(routes.getPendingInvitations(params)),
//     enabled,
//     retry: 2,
//     initialFilter: filter,
//     isPaginated: true,
//   });

//   return {
//     invitationsData: extractResponseData(data) || [],
//     totalInvitations: data?.pagination?.total || 0,
//     isInvitationsLoading: isLoading,
//     invitationsError: ErrorHandler(error),
//     refetchInvitations: refetch
//   };
// };

export const useGetPendingInvitations = ({ enabled = true, filter = {} }) => {
  // Extract page and limit from filter
  const { page = 1, limit = 10 } = filter;
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["pending-invitations", page, limit],
    queryFn: () => httpService.getData(routes.getPendingInvitations({ page, limit })),
    enabled,
    retry: 2,
  });

  return {
    invitationsData: data?.data || [],
    totalInvitations: data?.pagination?.total || 0,
    isInvitationsLoading: isLoading,
    invitationsError: error,
    refetchInvitations: refetch
  };
};
export const useResendAdminInvite = (onSuccess) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const resendInvitePayload = async (invitationId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await httpService.postData({}, routes.resendAdminInvite(invitationId));
      const extractedData = extractResponseData(response);
      const message = extractMessage(response, 'Invitation resent successfully');
      
      toast.success(message);
      if (onSuccess) onSuccess(extractedData);
      return extractedData;
    } catch (error) {
      const errorMessage = ErrorHandler(error);
      setError(errorMessage);
      toast.error(errorMessage);
      throw errorMessage;
    } finally {
      setIsLoading(false);
    }
  };

  return { resendInviteIsLoading: isLoading, resendInviteError: error, resendInvitePayload };
};

export const useCancelInvitation = (onSuccess) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const cancelInvitationPayload = async (invitationId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await httpService.deleteData(routes.cancelInvitation(invitationId));
      const extractedData = extractResponseData(response);
      const message = extractMessage(response, 'Invitation cancelled successfully');
      
      toast.success(message);
      if (onSuccess) onSuccess(extractedData);
      return extractedData;
    } catch (error) {
      const errorMessage = ErrorHandler(error);
      setError(errorMessage);
      toast.error(errorMessage);
      throw errorMessage;
    } finally {
      setIsLoading(false);
    }
  };

  return { cancelInvitationIsLoading: isLoading, cancelInvitationError: error, cancelInvitationPayload };
};

// =================== ADMIN MANAGEMENT ===================

export const useGetCurrentAdmin = () => {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCurrentAdmin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await httpService.getData(routes.getCurrentAdmin());
      const adminData = extractResponseData(response);
      
      if (!adminData) {
        throw new Error("No admin data received from server");
      }
      
      const enhancedAdminData = {
        ...adminData,
        roles: adminData.roles || [],
        isSuperAdmin: adminData.roles?.some(
          role => role.role?.name === 'SUPER_ADMIN' || role.name === 'SUPER_ADMIN'
        ) || false,
        canInviteAdmins: adminData.roles?.some(
          role => role.role?.name === 'SUPER_ADMIN' || 
                  role.name === 'SUPER_ADMIN' ||
                  role.role?.permissions?.some(p => p.name === 'admin_management')
        ) || false,
      };
      
      setCurrentAdmin(enhancedAdminData);
      return enhancedAdminData;
    } catch (error) {
      const errorMessage = ErrorHandler(error);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCurrentAdmin();
  }, []);

  return { currentAdmin, isLoading, error, getCurrentAdmin, refetch: getCurrentAdmin };
};

// export const useGetAdmins = ({ enabled = true, filter = {} }) => {
//   const { 
//     isFetched, isLoading, error, data, refetch, isFetching, 
//     setFilter, pageNumber, pageSize, setPageNumber, setPageSize
//   } = useFetchItem({
//     queryKey: ["admins", filter],
//     queryFn: (params) => httpService.getData(routes.admins(params)),
//     enabled,
//     retry: 2,
//     initialFilter: filter,
//     isPaginated: true,
//     initialPage: 1,
//     initialPageSize: 10
//   });

//   const transformedAdmins = React.useMemo(() => {
//     const extractedData = extractResponseData(data);
//     if (!extractedData || !Array.isArray(extractedData)) return [];
    
//     return extractedData.map((admin) => ({
//       ...admin,
//       roleNames: admin.roles?.map(ur => ur.role?.name || ur.name).filter(Boolean) || [],
//       totalPermissions: admin.permissionCount || 0,
//       isRoleBased: true,
//     }));
//   }, [data]);

//   return {
//     isFetchingAdmins: isFetching,
//     isAdminsLoading: isLoading,
//     adminsData: transformedAdmins,
//     totalAdmins: data?.pagination?.total || 0,
//     totalPages: data?.pagination?.totalPages || 0,
//     currentPage: data?.pagination?.currentPage || 1,
//     itemsPerPage: data?.pagination?.itemsPerPage || 10,
//     hasNextPage: data?.pagination?.hasNextPage || false,
//     hasPreviousPage: data?.pagination?.hasPreviousPage || false,
//     adminsError: ErrorHandler(error),
//     refetchAdmins: refetch,
//     pageNumber, pageSize, setPageNumber, setPageSize, setFilter
//   };
// };

// export const useGetAdmins = ({ enabled = true, filter = {} }) => {
//   const { 
//     data, 
//     isLoading, 
//     error, 
//     refetch, 
//     isFetching 
//   } = useQuery({
//     queryKey: ["admins", filter],
//     queryFn: () => httpService.getData(routes.admins(filter)),
//     enabled,
//     retry: 2,
//   });

//   const extractedData = extractResponseData(data);
//   const safeAdminsData = Array.isArray(extractedData) ? extractedData : [];

//   const transformedAdmins = safeAdminsData.map((admin) => ({
//     ...admin,
//     roleNames: admin.roles?.map(ur => ur.role?.name || ur.name).filter(Boolean) || [],
//     totalPermissions: admin.permissionCount || 0,
//     isRoleBased: true,
//   }));

//   return {
//     isFetchingAdmins: isFetching,
//     isAdminsLoading: isLoading,
//     adminsData: transformedAdmins,
//     totalAdmins: data?.pagination?.total || 0,
//     totalPages: data?.pagination?.totalPages || 0,
//     currentPage: data?.pagination?.currentPage || 1,
//     itemsPerPage: data?.pagination?.itemsPerPage || 10,
//     hasNextPage: data?.pagination?.hasNextPage || false,
//     hasPreviousPage: data?.pagination?.hasPreviousPage || false,
//     adminsError: ErrorHandler(error),
//     refetchAdmins: refetch,
//   };
// };

// export const useGetAdmins = ({ enabled = true, filter = {} }) => {
//   const [page, setPage] = useState(filter.page || 1);
//   const [limit, setLimit] = useState(filter.limit || 10);
//   const [filters, setFilters] = useState(filter);
  
//   const { 
//     data, 
//     isLoading, 
//     error, 
//     refetch, 
//     isFetching 
//   } = useQuery({
//     queryKey: ["admins", page, limit, filters],
//     queryFn: async () => {
//       try {
//         const params = new URLSearchParams();
//         params.append('page', page.toString());
//         params.append('limit', limit.toString());
        
//         // Add filters to params
//         Object.entries(filters).forEach(([key, value]) => {
//           if (value && key !== 'page' && key !== 'limit') {
//             params.append(key, value.toString());
//           }
//         });
        
//         const response = await httpService.getData(`${routes.admins}?${params.toString()}`);
        
//         // Handle different response structures
//         if (response && response.success !== undefined) {
//           return {
//             data: response.data || [],
//             pagination: response.pagination || {
//               totalItems: 0,
//               totalPages: 0,
//               currentPage: page,
//               itemsPerPage: limit,
//               hasNextPage: false,
//               hasPreviousPage: false
//             }
//           };
//         } else if (Array.isArray(response)) {
//           // If response is directly an array (backward compatibility)
//           return {
//             data: response,
//             pagination: {
//               totalItems: response.length,
//               totalPages: Math.ceil(response.length / limit),
//               currentPage: page,
//               itemsPerPage: limit,
//               hasNextPage: false,
//               hasPreviousPage: false
//             }
//           };
//         } else {
//           // Default empty response
//           return {
//             data: [],
//             pagination: {
//               totalItems: 0,
//               totalPages: 0,
//               currentPage: page,
//               itemsPerPage: limit,
//               hasNextPage: false,
//               hasPreviousPage: false
//             }
//           };
//         }
//       } catch (err) {
//         console.error("Error fetching admins:", err);
//         throw err;
//       }
//     },
//     enabled,
//     retry: 2,
//   });

//   // Extract data and pagination from response
//   const adminsData = data?.data || [];
//   const pagination = data?.pagination || {
//     totalItems: 0,
//     totalPages: 0,
//     currentPage: page,
//     itemsPerPage: limit,
//     hasNextPage: false,
//     hasPreviousPage: false
//   };

//   // Transform admin data
//   const transformedAdmins = adminsData.map((admin) => ({
//     ...admin,
//     roleNames: admin.roles?.map(ur => ur.role?.name || ur.name).filter(Boolean) || [],
//     totalPermissions: admin.permissionCount || 0,
//     isRoleBased: true,
//   }));

//   return {
//     isFetchingAdmins: isFetching,
//     isAdminsLoading: isLoading,
//     adminsData: transformedAdmins,
//     totalAdmins: pagination.totalItems,
//     totalPages: pagination.totalPages,
//     currentPage: pagination.currentPage,
//     itemsPerPage: pagination.itemsPerPage,
//     hasNextPage: pagination.hasNextPage,
//     hasPreviousPage: pagination.hasPreviousPage,
//     adminsError: ErrorHandler(error),
//     refetchAdmins: refetch,
//     setPage,
//     setLimit,
//     setFilters
//   };
// };

// export const useGetAdmins = ({ enabled = true, filter = {} }) => {
//   const { 
//     data, 
//     isLoading, 
//     error, 
//     refetch, 
//     isFetching 
//   } = useQuery({
//     queryKey: ["admins", filter],
//     queryFn: async () => {
//       try {
//         const response = await httpService.getData(routes.admins(filter));
        
//         // Handle response structure
//         if (response && typeof response === 'object') {
//           if (response.success !== undefined && Array.isArray(response.data)) {
//             return {
//               data: response.data,
//               pagination: response.pagination || {
//                 totalItems: response.data.length,
//                 totalPages: 1,
//                 currentPage: 1,
//                 itemsPerPage: response.data.length,
//                 hasNextPage: false,
//                 hasPreviousPage: false
//               }
//             };
//           } else if (Array.isArray(response)) {
//             // Backward compatibility for array responses
//             return {
//               data: response,
//               pagination: {
//                 totalItems: response.length,
//                 totalPages: 1,
//                 currentPage: 1,
//                 itemsPerPage: response.length,
//                 hasNextPage: false,
//                 hasPreviousPage: false
//               }
//             };
//           }
//         }
        
//         // Default empty response
//         return {
//           data: [],
//           pagination: {
//             totalItems: 0,
//             totalPages: 0,
//             currentPage: 1,
//             itemsPerPage: 10,
//             hasNextPage: false,
//             hasPreviousPage: false
//           }
//         };
//       } catch (err) {
//         console.error("Error fetching admins:", err);
//         throw err;
//       }
//     },
//     enabled,
//     retry: 2,
//   });

//   // Extract data and pagination from response
//   const adminsData = data?.data || [];
//   const pagination = data?.pagination || {
//     totalItems: 0,
//     totalPages: 0,
//     currentPage: 1,
//     itemsPerPage: 10,
//     hasNextPage: false,
//     hasPreviousPage: false
//   };

//   // Transform admin data
//   const transformedAdmins = adminsData.map((admin) => ({
//     ...admin,
//     roleNames: admin.roles?.map(ur => ur.role?.name || ur.name).filter(Boolean) || [],
//     totalPermissions: admin.permissionCount || 0,
//     isRoleBased: true,
//   }));

//   return {
//     isFetchingAdmins: isFetching,
//     isAdminsLoading: isLoading,
//     adminsData: transformedAdmins,
//     totalAdmins: pagination.totalItems,
//     totalPages: pagination.totalPages,
//     currentPage: pagination.currentPage,
//     itemsPerPage: pagination.itemsPerPage,
//     hasNextPage: pagination.hasNextPage,
//     hasPreviousPage: pagination.hasPreviousPage,
//     adminsError: ErrorHandler(error),
//     refetchAdmins: refetch,
//   };
// };


export const useDeleteAdmin = (onSuccess) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const deleteAdminPayload = async (adminId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await httpService.deleteData(routes.deleteAdmin(adminId));
      const extractedData = extractResponseData(response);
      const message = extractMessage(response, 'Admin deleted successfully');
      
      setData(extractedData);
      toast.success(message);
      if (onSuccess) onSuccess(extractedData);
      return extractedData;
    } catch (error) {
      const errorMessage = ErrorHandler(error);
      setError(errorMessage);
      toast.error(errorMessage);
      throw errorMessage;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteAdminIsLoading: isLoading, deleteAdminError: error, deleteAdminData: data, deleteAdminPayload };
};

export const useAdminRegistration = (onSuccess) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const registerAdmin = async (payload) => {
    console.log('🔐 Admin registration hook called with:', {
      ...payload,
      password: '[HIDDEN]',
      token: '[HIDDEN]',
      signature: '[HIDDEN]'
    });

    setIsLoading(true);
    setError(null);

    try {
      // ✅ Transform the payload to match backend expectations
      const backendPayload = {
        // Required fields that backend expects
        email: payload.email,
        userId: payload.userId,
        token: payload.token,
        signature: payload.signature,
        password: payload.password,
        name: payload.fullName, // ✅ Backend expects 'name', not 'fullName'
        
        // Additional fields for URL verification
        timestamp: payload.timestamp,
        ...(payload.expires && { expires: payload.expires }),
        ...(payload.noExpiry !== undefined && { noExpiry: payload.noExpiry }),
        ...(payload.roleId && { roleId: payload.roleId }),
        ...(payload.invitationId && { invitationId: payload.invitationId })
      };

      console.log('🔐 Sending to backend:', {
        ...backendPayload,
        password: '[HIDDEN]',
        token: '[HIDDEN]',
        signature: '[HIDDEN]'
      });

      const response = await httpService.postData(backendPayload, routes.registerInvitedAdmin());
      const extractedData = extractResponseData(response);
      const message = extractMessage(response, 'Admin registration completed successfully');
      
      setData(extractedData);
      toast.success(message);
      if (onSuccess) onSuccess(extractedData);
      return extractedData;
    } catch (error) {
      console.error('❌ Admin registration hook error:', error);
      const errorMsg = ErrorHandler(error);
      setError(errorMsg);
      toast.error(errorMsg);
      throw errorMsg;
    } finally {
      setIsLoading(false);
    }
  };

  return { registerAdmin, isLoading, error, data };
};

// =================== ENHANCED ROLE MANAGEMENT WITH EVENT EMISSION ===================

// export const useGetAdminRoles = ({ enabled = true } = {}) => {
//   const { data, isLoading, error, refetch } = useFetchItem({
//     queryKey: ["admin-roles"],
//     queryFn: () => httpService.getData(routes.adminRoles()),
//     enabled,
//     retry: 2
//   });

//   return {
//     rolesData: extractResponseData(data) || [],
//     isRolesLoading: isLoading,
//     rolesError: ErrorHandler(error),
//     refetchRoles: refetch
//   };
// };

// export const useGetAdminRoles = ({ enabled = true, page = 1, limit = 10 } = {}) => {
//   const { data, isLoading, error, refetch } = useFetchItem({
//     // Include page and limit in the query key for caching and refetching
//     queryKey: ["admin-roles", page, limit],

//     // Send page and limit as query parameters to the API
//     queryFn: () => {
//       const url = new URL(routes.adminRoles());
//       url.searchParams.append('page', String(page));
//       url.searchParams.append('limit', String(limit));

//       return httpService.getData(url.toString());
//     },
//     enabled,
//     retry: 2
//   });

//   return {
//     rolesData: extractResponseData(data),
//     isRolesLoading: isLoading,
//     rolesError: ErrorHandler(error),
//     refetchRoles: refetch
//   };
// };

export const useGetAdminRoles = ({ enabled = true, page = 1, limit = 10 } = {}) => {
  const { data, isLoading, error, refetch } = useFetchItem({
    // 1. DYNAMIC QUERY KEY:
    // This is crucial. It tells React Query that this query is unique
    // based on the page and limit. When `page` or `limit` changes,
    // React Query will automatically trigger a refetch and cache the new page's data separately.
    queryKey: ["admin-roles", page, limit],

    // 2. DYNAMIC QUERY FUNCTION:
    // This function constructs the API request URL, appending the current
    // `page` and `limit` as search parameters. This ensures the backend
    // receives the pagination info and returns the correct slice of data.
    queryFn: () => {
      // Create a URL object to safely append search parameters
      // routes.adminRoles() should return the base URL, e.g., "/api/v1/admin/roles"
      const url = new URL(routes.adminRoles(), window.location.origin);
      url.searchParams.append('page', String(page));
      url.searchParams.append('limit', String(limit));
      
      // Use the full URL path with query parameters for the GET request
      return httpService.getData(url.pathname + url.search);
    },

    // 3. QUERY OPTIONS:
    // Standard React Query options passed through to the underlying fetch hook.
    enabled,
    retry: 2, // Attempt to refetch a failed request 2 times
  });

  // 4. RETURNED STATE:
  // The hook returns the full API response (which includes both `data` and `pagination` objects),
  // the loading state, any errors, and the `refetch` function.
  return {
    rolesData: extractResponseData(data), // This should extract the entire { data: [], pagination: {} } object
    isRolesLoading: isLoading,
    rolesError: ErrorHandler(error),
    refetchRoles: refetch
  };
};

// ✅ ENHANCED: Role update with comprehensive event emission
export const useUpdateAdminRoles = (onSuccess) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateRolesPayload = async (adminId, rolesData) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log(`🔄 Hook: Updating roles for admin ${adminId}:`, rolesData);
      
      // Handle both roleIds (numbers) and roleNames (strings)
      let payload;
      if (Array.isArray(rolesData)) {
        if (rolesData.length > 0 && typeof rolesData[0] === 'string') {
          // roleNames format
          payload = { roleNames: rolesData };
        } else if (rolesData.length > 0 && typeof rolesData[0] === 'number') {
          // roleIds format  
          payload = { roleIds: rolesData };
        } else {
          // Empty array
          payload = { roleIds: [] };
        }
      } else {
        payload = { roleIds: rolesData || [] };
      }
      
      console.log('🔄 Hook: Sending payload to backend:', payload);
      
      const response = await httpService.putData(payload, routes.updateAdminRoles(adminId));
      const extractedData = extractResponseData(response);
      const message = extractMessage(response, 'Roles updated successfully');
      
      // ✅ ENHANCED: Emit role change event with comprehensive data
      const responseData = extractedData || response.data || response;
      const newRoles = responseData?.roles || responseData?.data?.roles || [];
      
      console.log(`🔄 Hook: Emitting role change event for admin ${adminId}:`, {
        adminId,
        newRoles,
        rolesCount: Array.isArray(newRoles) ? newRoles.length : 0
      });
      
      // Emit with slight delay to ensure API response is fully processed
      setTimeout(() => {
        emitRoleChangeEvent(adminId, newRoles);
      }, 100);
      
      toast.success(message);
      if (onSuccess) onSuccess(extractedData);
      return extractedData;
    } catch (err) {
      const errorMsg = ErrorHandler(err);
      setError(errorMsg);
      toast.error(errorMsg);
      throw errorMsg;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateRolesIsLoading: isLoading, updateRolesError: error, updateRolesPayload };
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: createRoleMutation,
    isPending: isCreating,
    error,
  } = useMutation({
    mutationFn: async (roleData) => {
      const response = await httpService.postData(roleData, routes.createRole());
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-permissions"] });
      
      const message = extractMessage(response, "Role created successfully");
      toast.success(message);
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to create role";
      toast.error(errorMessage);
    },
  });

  const createRole = async (roleData) => {
    try {
      const response = await createRoleMutation(roleData);
      return extractResponseData(response);
    } catch (error) {
      throw error;
    }
  };

  return { createRole, isCreating, createRoleError: ErrorHandler(error) };
};

export const useUpdateRole = (onSuccess) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateRolePayload = async (roleId, payload) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await httpService.putData(payload, routes.updateRole(roleId));
      const extractedData = extractResponseData(response);
      const message = extractMessage(response, 'Role updated successfully');
      
      toast.success(message);
      if (onSuccess) onSuccess(extractedData);
      return extractedData;
    } catch (error) {
      const errorMessage = ErrorHandler(error);
      setError(errorMessage);
      toast.error(errorMessage);
      throw errorMessage;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateRoleIsLoading: isLoading, updateRoleError: error, updateRolePayload };
};

export const useDeleteRole = (onSuccess) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteRolePayload = async (roleId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await httpService.deleteData(routes.deleteRole(roleId));
      const extractedData = extractResponseData(response);
      const message = extractMessage(response, 'Role deleted successfully');
      
      toast.success(message);
      if (onSuccess) onSuccess(extractedData);
      return extractedData;
    } catch (error) {
      const errorMessage = ErrorHandler(error);
      setError(errorMessage);
      toast.error(errorMessage);
      throw errorMessage;
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteRoleIsLoading: isLoading, deleteRoleError: error, deleteRolePayload };
};

export const useGetRolePermissions = (roleId, { enabled = true } = {}) => {
  const { data, isLoading, error, refetch } = useFetchItem({
    queryKey: ["role-permissions", roleId],
    queryFn: () => httpService.getData(routes.getRolePermissions(roleId)),
    enabled: enabled && !!roleId,
    retry: 2
  });

  return {
    rolePermissionsData: extractResponseData(data) || [],
    isRolePermissionsLoading: isLoading,
    rolePermissionsError: ErrorHandler(error),
    refetchRolePermissions: refetch
  };
};

export const useToggleRolePermission = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: toggleRolePermissionMutation,
    isPending: isToggling,
    error,
  } = useMutation({
    mutationFn: async ({ roleId, permissionId }) => {
      const response = await httpService.putData({}, routes.toggleRolePermission(roleId, permissionId));
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-permissions"] });
      
      const message = extractMessage(response, "Role permission updated successfully");
      toast.success(message);
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to toggle role permission";
      toast.error(errorMessage);
    },
  });

  const toggleRolePermission = async (roleId, permissionId) => {
    try {
      const response = await toggleRolePermissionMutation({ roleId, permissionId });
      return extractResponseData(response);
    } catch (error) {
      throw error;
    }
  };

  return { toggleRolePermission, isToggling, toggleRolePermissionError: ErrorHandler(error) };
};

// =================== ENHANCED PERMISSION MANAGEMENT WITH EVENT EMISSION ===================

export const useGetAdminPermissions = ({ enabled = true } = {}) => {
  const { data, isLoading, error, refetch } = useFetchItem({
    queryKey: ["admin-permissions"],
    queryFn: () => httpService.getData(routes.adminPermissions()),
    enabled,
    retry: 2
  });

  return {
    permissionsData: extractResponseData(data) || [],
    isPermissionsLoading: isLoading,
    permissionsError: ErrorHandler(error),
    refetchPermissions: refetch
  };
};

export const useGetSpecificAdminPermissions = (adminId, { enabled = true } = {}) => {
  const { data, isLoading, error, refetch, isFetching } = useFetchItem({
    queryKey: ["admin-specific-permissions", adminId],
    queryFn: () => httpService.getData(routes.getSpecificAdminPermissions(adminId)),
    enabled: enabled && !!adminId,
    retry: 2,
    staleTime: 5 * 60 * 1000
  });

  const specificPermissionsData = React.useMemo(() => {
    return extractResponseData(data);
  }, [data]);

  return {
    isFetchingSpecificPermissions: isFetching,
    isSpecificPermissionsLoading: isLoading,
    specificPermissionsData: specificPermissionsData || {},
    specificPermissionsError: ErrorHandler(error),
    refetchSpecificPermissions: refetch
  };
};

// ✅ ENHANCED: Permission update with automatic event emission
export const useUpdateAdminPermissions = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: updatePermissionsMutation,
    isPending: isUpdating,
    error,
  } = useMutation({
    mutationFn: async ({ adminId, payload }) => {
      console.log(`🔄 Hook: Updating permissions for admin ${adminId}:`, payload);
      const response = await httpService.putData(payload, routes.updateAdminPermissions(adminId));
      return { response, adminId };
    },
    onSuccess: (data, variables) => {
      const { response, adminId } = data;
      
      queryClient.invalidateQueries({ queryKey: ["admin-permissions"] });
      queryClient.invalidateQueries({ queryKey: ["admin-specific-permissions", adminId] });
      queryClient.invalidateQueries({ queryKey: ["admin-info", adminId] });
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      
      // ✅ ENHANCED: Emit role change event for permission updates
      console.log(`🔄 Hook: Emitting role change event for permission update - admin ${adminId}`);
      setTimeout(() => {
        emitRoleChangeEvent(adminId, []);
      }, 100);
      
      const message = extractMessage(response, "Permissions updated successfully");
      toast.success(message);
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to update permissions";
      toast.error(errorMessage);
    },
  });

  const updatePermissions = async (adminId, payload) => {
    try {
      const data = await updatePermissionsMutation({ adminId, payload });
      return extractResponseData(data.response);
    } catch (error) {
      throw error;
    }
  };

  return { updatePermissions, isUpdating, updatePermissionsError: ErrorHandler(error) };
};

// ✅ ENHANCED: Role permissions update with automatic event emission
export const useUpdateAdminRolesPermissions = (onSuccess) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateRolesPermissionsPayload = async (adminId, roleIds) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log(`🔄 Hook: Updating role permissions for admin ${adminId}:`, roleIds);
      
      const response = await httpService.putData({ roleIds }, routes.updateAdminRolesPermissions(adminId));
      const extractedData = extractResponseData(response);
      const message = extractMessage(response, 'Admin roles updated successfully');
      
      // ✅ ENHANCED: Emit role change event
      const responseData = extractedData || response.data || response;
      const newRoles = responseData?.roles || responseData?.data?.roles || [];
      
      console.log(`🔄 Hook: Emitting role change event for role permissions update - admin ${adminId}:`, newRoles);
      setTimeout(() => {
        emitRoleChangeEvent(adminId, newRoles);
      }, 100);
      
      toast.success(message);
      if (onSuccess) onSuccess(extractedData);
      return extractedData;
    } catch (err) {
      const errorMessage = ErrorHandler(err);
      setError(errorMessage);
      toast.error(errorMessage);
      throw errorMessage;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateRolesPermissionsIsLoading: isLoading, updateRolesPermissionsError: error, updateRolesPermissionsPayload };
}; 

export const useToggleAdminPermission = (adminId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (permissionId) => {
      const response = await httpService.putData({ permissionId }, routes.updateAdminPermissions(adminId));
      return extractResponseData(response);
    },
    onSuccess: (data) => {
      const message = extractMessage(data, "Permission updated successfully");
      toast.success(message);
      
      // ✅ ENHANCED: Emit role change event for permission toggle
      console.log(`🔄 Hook: Emitting role change event for permission toggle - admin ${adminId}`);
      setTimeout(() => {
        emitRoleChangeEvent(adminId, []);
      }, 100);
      
      queryClient.invalidateQueries({ queryKey: ['admin-permissions'] });
      queryClient.invalidateQueries({ queryKey: ['admin-specific-permissions', adminId] });
      queryClient.invalidateQueries({ queryKey: ['admin-info', adminId] });
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || 'Failed to update permission';
      toast.error(errorMessage);
    }
  });
};

export const useCreatePermission = (onSuccess) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPermissionPayload = async (payload) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await httpService.postData(payload, routes.createPermission());
      const extractedData = extractResponseData(response);
      const message = extractMessage(response, 'Permission created successfully');
      
      toast.success(message);
      if (onSuccess) onSuccess(extractedData);
      return extractedData;
    } catch (error) {
      const errorMessage = ErrorHandler(error);
      setError(errorMessage);
      toast.error(errorMessage);
      throw errorMessage;
    } finally {
      setIsLoading(false);
    }
  };

  return { createPermissionIsLoading: isLoading, createPermissionError: error, createPermissionPayload };
};

export const useUpdatePermission = (onSuccess) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updatePermissionPayload = async (permissionId, payload) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await httpService.putData(payload, routes.updatePermission(permissionId));
      const extractedData = extractResponseData(response);
      const message = extractMessage(response, 'Permission updated successfully');
      
      toast.success(message);
      if (onSuccess) onSuccess(extractedData);
      return extractedData;
    } catch (error) {
      const errorMessage = ErrorHandler(error);
      setError(errorMessage);
      toast.error(errorMessage);
      throw errorMessage;
    } finally {
      setIsLoading(false);
    }
  };

  return { updatePermissionIsLoading: isLoading, updatePermissionError: error, updatePermissionPayload };
};

export const useDeletePermission = (onSuccess) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const deletePermissionPayload = async (permissionId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await httpService.deleteData(routes.deletePermission(permissionId));
      const extractedData = extractResponseData(response);
      const message = extractMessage(response, 'Permission deleted successfully');
      
      toast.success(message);
      if (onSuccess) onSuccess(extractedData);
      return extractedData;
    } catch (error) {
      const errorMessage = ErrorHandler(error);
      setError(errorMessage);
      toast.error(errorMessage);
      throw errorMessage;
    } finally {
      setIsLoading(false);
    }
  };

  return { deletePermissionIsLoading: isLoading, deletePermissionError: error, deletePermissionPayload };
};

// =================== ACCESS VALIDATION ===================

export const useCanManageRoles = () => {
  const [canManage, setCanManage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { currentAdmin, isLoading: isCurrentAdminLoading } = useGetCurrentAdmin();

  useEffect(() => {
    if (!isCurrentAdminLoading && currentAdmin) {
      const isSuperAdmin = currentAdmin.roles?.some(
        role => role.role?.name === 'SUPER_ADMIN' || role.name === 'SUPER_ADMIN'
      );
      
      const hasRoleManagementPermission = currentAdmin.roles?.some(
        role => role.role?.permissions?.some(
          perm => perm.name === 'role_management' || perm.name === 'admin_management'
        )
      );
      
      setCanManage(isSuperAdmin || hasRoleManagementPermission);
    }
    
    setIsLoading(isCurrentAdminLoading);
  }, [currentAdmin, isCurrentAdminLoading]);

  return { canManage, isLoading };
};

// =================== ENHANCED UTILITY FUNCTIONS FOR ROLE CHANGES ===================

// ✅ ENHANCED: Manual role change trigger for testing with better logging
export const triggerRoleChangeEvent = (adminId, newRoles = []) => {
  console.log(`🧪 Manually triggering role change for admin ${adminId}:`, {
    adminId,
    rolesCount: Array.isArray(newRoles) ? newRoles.length : 0,
    source: 'manual_trigger'
  });
  emitRoleChangeEvent(adminId, newRoles);
};

// ✅ ENHANCED: Bulk role update with comprehensive event emission
export const useBulkUpdateAdminRoles = (onSuccess) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const bulkUpdateRoles = async (updates) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`🔄 Bulk updating roles for ${updates.length} admins:`, updates);
      
      const promises = updates.map(({ adminId, roleIds }) => 
        httpService.putData({ roleIds }, routes.updateAdminRoles(adminId))
      );
      
      const responses = await Promise.all(promises);
      
      // ✅ ENHANCED: Emit events for all updated admins with delay
      updates.forEach(({ adminId }, index) => {
        const response = responses[index];
        const extractedData = extractResponseData(response);
        const newRoles = extractedData?.roles || extractedData?.data?.roles || [];
        
        console.log(`🔄 Bulk update: Emitting role change event for admin ${adminId}:`, newRoles);
        
        // Stagger events to prevent overwhelming the event system
        setTimeout(() => {
          emitRoleChangeEvent(adminId, newRoles);
        }, index * 50);
      });
      
      toast.success('Bulk role update completed successfully');
      if (onSuccess) onSuccess(responses);
      return responses;
    } catch (err) {
      const errorMessage = ErrorHandler(err);
      setError(errorMessage);
      toast.error(errorMessage);
      throw errorMessage;
    } finally {
      setIsLoading(false);
    }
  };

  return { bulkUpdateRoles, isLoading, error };
};

// =================== ENHANCED DEVELOPMENT UTILITIES ===================

// ✅ ENHANCED: Make testing utilities available in development with better debugging
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Enhanced testing utilities
  window.adminHooksUtils = {
    triggerRoleChangeEvent,
    emitRoleChangeEvent,
    testRoleUpdate: async (adminId, newRoles) => {
      console.group('🧪 Testing Role Update Flow');
      try {
        console.log('1. Current admin state:', window.auth?.userData);
        console.log('2. Triggering role change for admin:', adminId, 'with roles:', newRoles);
        
        // Trigger the event
        triggerRoleChangeEvent(adminId, newRoles);
        
        console.log('3. Event triggered, waiting for effects...');
        
        // Wait and check if auth context responds
        setTimeout(() => {
          console.log('4. Auth context after event:', window.auth?.userData);
          console.log('5. Permission checker after event:', window.permissionChecker?.userData);
        }, 1000);
        
      } catch (error) {
        console.error('❌ Test failed:', error);
      } finally {
        console.groupEnd();
      }
    },
    forceRefreshAllData: async () => {
      console.log('🔄 Force refreshing all admin-related data...');
      
      if (window.auth?.forceRefreshUserData) {
        await window.auth.forceRefreshUserData();
      }
      
      if (window.permissionChecker?.forceRefresh) {
        await window.permissionChecker.forceRefresh();
      }
      
      console.log('✅ All data refresh completed');
    }
  };
  
  console.log('🧪 Enhanced Admin Hooks Utils available:');
  console.log('- window.adminHooksUtils.triggerRoleChangeEvent(adminId, roles)');
  console.log('- window.adminHooksUtils.testRoleUpdate(adminId, roles)');
  console.log('- window.adminHooksUtils.forceRefreshAllData()');
}

// export const useGetAdmins = ({ enabled = true, filter = {}, pageSize = 1000 }) => {
//   const { 
//     isFetched, isLoading, error, data, refetch, isFetching, 
//     setFilter, pageNumber, pageSize: currentPageSize, setPageNumber, setPageSize
//   } = useFetchItem({
//     queryKey: ["admins", filter],
//     queryFn: (params) => httpService.getData(routes.admins(params)),
//     enabled,
//     retry: 2,
//     initialFilter: filter,
//     isPaginated: true,
//     initialPage: 1,
//     initialPageSize: pageSize  // Use the pageSize from hook parameters
//   });

//   const transformedAdmins = React.useMemo(() => {
//     const extractedData = extractResponseData(data);
//     if (!extractedData || !Array.isArray(extractedData)) return [];
    
//     return extractedData.map((admin) => ({
//       ...admin,
//       roleNames: admin.roles?.map(ur => ur.role?.name || ur.name).filter(Boolean) || [],
//       totalPermissions: admin.permissionCount || 0,
//       isRoleBased: true,
//     }));
//   }, [data]);

//   return {
//     isFetchingAdmins: isFetching,
//     isAdminsLoading: isLoading,
//     adminsData: transformedAdmins,
//     totalAdmins: data?.pagination?.total || 0,
//     totalPages: data?.pagination?.totalPages || 0,
//     currentPage: data?.pagination?.currentPage || 1,
//     itemsPerPage: data?.pagination?.itemsPerPage || pageSize,
//     hasNextPage: data?.pagination?.hasNextPage || false,
//     hasPreviousPage: data?.pagination?.hasPreviousPage || false,
//     adminsError: ErrorHandler(error),
//     refetchAdmins: refetch,
//     pageNumber, 
//     pageSize: currentPageSize, 
//     setPageNumber, 
//     setPageSize, 
//     setFilter
//   };
// };

// export const useGetAdmins = ({ enabled = true, filter = {}, pageSize = 1000 }) => {
//   const { 
//     isFetched, isLoading, error, data, refetch, isFetching, 
//     setFilter, pageNumber, pageSize: currentPageSize, setPageNumber, setPageSize
//   } = useFetchItem({
//     queryKey: ["admins", filter],
//     queryFn: (params) => httpService.getData(routes.admins(params)),
//     enabled,
//     retry: 2,
//     initialFilter: filter,
//     isPaginated: true,
//     initialPage: 1,
//     initialPageSize: pageSize  // Use the pageSize parameter as initial page size
//   });

//   const transformedAdmins = React.useMemo(() => {
//     const extractedData = extractResponseData(data);
//     if (!extractedData || !Array.isArray(extractedData)) return [];
    
//     return extractedData.map((admin) => ({
//       ...admin,
//       roleNames: admin.roles?.map(ur => ur.role?.name || ur.name).filter(Boolean) || [],
//       totalPermissions: admin.permissionCount || 0,
//       isRoleBased: true,
//     }));
//   }, [data]);

//   return {
//     isFetchingAdmins: isFetching,
//     isAdminsLoading: isLoading,
//     adminsData: transformedAdmins,
//     totalAdmins: data?.pagination?.total || 0,
//     totalPages: data?.pagination?.totalPages || 0,
//     currentPage: data?.pagination?.currentPage || 1,
//     itemsPerPage: currentPageSize,  // Use the current page size from state
//     hasNextPage: data?.pagination?.hasNextPage || false,
//     hasPreviousPage: data?.pagination?.hasPreviousPage || false,
//     adminsError: ErrorHandler(error),
//     refetchAdmins: refetch,
//     pageNumber, 
//     pageSize: currentPageSize, 
//     setPageNumber, 
//     setPageSize, 
//     setFilter
//   };
// };

export const useGetAdmins = ({ enabled = true, filter = {} }) => {
  // Add pageSize parameter to force 1000 items per page
  const modifiedFilter = {
    ...filter,
    limit: 1000 // This will be sent as a query parameter to the backend
  };

  const { 
    isFetched, isLoading, error, data, refetch, isFetching, 
    setFilter, pageNumber, pageSize, setPageNumber, setPageSize
  } = useFetchItem({
    queryKey: ["admins", modifiedFilter], // Use modified filter
    queryFn: (params) => httpService.getData(routes.admins({
      ...params,
      limit: 1000 // Ensure limit is always 1000
    })),
    enabled,
    retry: 2,
    initialFilter: modifiedFilter, // Use the modified filter
    isPaginated: true,
    initialPage: 1,
    initialPageSize: 1000  // Set initial page size to 1000
  });

  const transformedAdmins = React.useMemo(() => {
    const extractedData = extractResponseData(data);
    if (!extractedData || !Array.isArray(extractedData)) return [];
    
    return extractedData.map((admin) => ({
      ...admin,
      roleNames: admin.roles?.map(ur => ur.role?.name || ur.name).filter(Boolean) || [],
      totalPermissions: admin.permissionCount || 0,
      isRoleBased: true,
    }));
  }, [data]);

  return {
    isFetchingAdmins: isFetching,
    isAdminsLoading: isLoading,
    adminsData: transformedAdmins,
    totalAdmins: data?.pagination?.total || 0,
    totalPages: data?.pagination?.totalPages || 0,
    currentPage: data?.pagination?.currentPage || 1,
    itemsPerPage: data?.pagination?.itemsPerPage || 1000,  // Default to 1000 if not in response
    hasNextPage: data?.pagination?.hasNextPage || false,
    hasPreviousPage: data?.pagination?.hasPreviousPage || false,
    adminsError: ErrorHandler(error),
    refetchAdmins: refetch,
    pageNumber, pageSize, setPageNumber, setPageSize, setFilter
  };
};