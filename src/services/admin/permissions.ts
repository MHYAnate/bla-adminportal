// services/admin/permissions.ts
"use client";

import { toast } from 'sonner';
import { routes } from '../api-routes';
import httpService from '../httpService';
import useFetchItem from '../useFetchItem';
import { ErrorHandler } from '../errorHandler';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

// =================== TYPES ===================
interface ApiResponse<T = any> {
  data?: T;
  success?: boolean;
  message?: string;
  error?: string;
}

interface NestedApiResponse<T = any> {
  data?: {
    data?: T;
    success?: boolean;
    message?: string;
    error?: string;
  };
  success?: boolean;
  message?: string;
  error?: string;
}

// =================== GET SPECIFIC ADMIN PERMISSIONS ===================
export const useGetSpecificAdminPermissions = (adminId: string | number, enabled: boolean = true) => {
  const { 
    isLoading, 
    error, 
    data, 
    refetch, 
    isFetching 
  } = useFetchItem({
    queryKey: ["admin-specific-permissions", adminId],
    queryFn: () => httpService.getData(routes.getSpecificAdminPermissions(adminId)),
    enabled: enabled && !!adminId,
    retry: 2,
    initialPage: 1,
    initialPageSize: 10,
    initialFilter: {},
    isPaginated: false,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  // Extract permissions data with fallbacks like categories pattern
  let specificPermissionsData: any = null;
  
  try {
    if (data) {
      const typedData = data as NestedApiResponse;
      if (typedData?.data?.success && typedData?.data?.data) {
        specificPermissionsData = typedData.data.data;
      } else if (typedData?.data) {
        specificPermissionsData = typedData.data;
      } else if (typedData?.success && (typedData as any)?.data) {
        specificPermissionsData = (typedData as any).data;
      } else {
        specificPermissionsData = data;
      }
    }
  } catch (extractError) {
    console.error("Error extracting specific permissions data:", extractError);
    specificPermissionsData = null;
  }

  console.log('🔍 useGetSpecificAdminPermissions - Raw data:', data);
  console.log('🔍 useGetSpecificAdminPermissions - Processed data:', specificPermissionsData);

  return {
    isFetchingSpecificPermissions: isFetching,
    isSpecificPermissionsLoading: isLoading,
    specificPermissionsData,
    specificPermissionsError: ErrorHandler(error),
    refetchSpecificPermissions: refetch
  };
};

// =================== UPDATE ADMIN PERMISSIONS ===================
export const useUpdateAdminPermissions = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: updatePermissionsMutation,
    isPending: isUpdating,
    error,
  } = useMutation({
    mutationFn: async ({ adminId, payload }: { adminId: string | number; payload: any }) => {
      console.log('Updating admin permissions:', { adminId, payload });
      
      const response = await httpService.putData(
        payload,
        routes.updateAdminPermissions(adminId)
      );
      return response;
    },

    onSuccess: (response: ApiResponse, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["admin-permissions"] });
      queryClient.invalidateQueries({ queryKey: ["admin-specific-permissions", variables.adminId] });
      queryClient.invalidateQueries({ queryKey: ["admin-info", variables.adminId] });
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      
      // Extract message with fallbacks
      let message = "Permissions updated successfully";
      const typedResponse = response as NestedApiResponse;
      if (typedResponse?.data?.success && typedResponse?.data?.message) {
        message = typedResponse.data.message;
      } else if (typedResponse?.data && 'message' in typedResponse.data && typedResponse.data.message) {
        message = typedResponse.data.message as string;
      } else if (response?.message) {
        message = response.message;
      }
      
      toast.success(message);
    },

    onError: (error: any) => {
      console.error('Permissions update failed:', error);
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to update permissions";
      toast.error(errorMessage);
    },
  });

  const updatePermissions = async (adminId: string | number, payload: any) => {
    try {
      const response = await updatePermissionsMutation({ adminId, payload });
      const typedResponse = response as NestedApiResponse;
      return typedResponse?.data?.data || typedResponse?.data || response;
    } catch (error) {
      throw error;
    }
  };

  return {
    updatePermissions,
    isUpdating,
    updatePermissionsError: ErrorHandler(error),
  };
};

// =================== UPDATE ADMIN ROLES FOR PERMISSIONS ===================
export const useUpdateAdminRolesPermissions = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: updateRolesPermissionsMutation,
    isPending: isUpdating,
    error,
  } = useMutation({
    mutationFn: async ({ adminId, roleIds }: { adminId: string | number; roleIds: number[] }) => {
      console.log('Updating admin roles for permissions:', { adminId, roleIds });
      
      const response = await httpService.putData(
        { roleIds },
        routes.updateAdminRolesPermissions(adminId)
      );
      return response;
    },

    onSuccess: (response: ApiResponse, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["admin-permissions"] });
      queryClient.invalidateQueries({ queryKey: ["admin-specific-permissions", variables.adminId] });
      queryClient.invalidateQueries({ queryKey: ["admin-info", variables.adminId] });
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      
      // Extract message with fallbacks
      let message = "Roles updated successfully";
      const typedResponse = response as NestedApiResponse;
      if (typedResponse?.data?.success && typedResponse?.data?.message) {
        message = typedResponse.data.message;
      } else if (typedResponse?.data && 'message' in typedResponse.data && typedResponse.data.message) {
        message = typedResponse.data.message as string;
      } else if (response?.message) {
        message = response.message;
      }
      
      toast.success(message);
    },

    onError: (error: any) => {
      console.error('Roles permissions update failed:', error);
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to update roles";
      toast.error(errorMessage);
    },
  });

  const updateRolesPermissions = async (adminId: string | number, roleIds: number[]) => {
    try {
      const response = await updateRolesPermissionsMutation({ adminId, roleIds });
      const typedResponse = response as NestedApiResponse;
      return typedResponse?.data?.data || typedResponse?.data || response;
    } catch (error) {
      throw error;
    }
  };

  return {
    updateRolesPermissions,
    isUpdating,
    updateRolesPermissionsError: ErrorHandler(error),
  };
};

// =================== TOGGLE ADMIN PERMISSION ===================
export const useToggleAdminPermission = (adminId: string | number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (permissionId: number) => {
      try {
        console.log('Toggling admin permission:', { adminId, permissionId });
        
        // Use the correct route for admin permissions, not role permissions
        const response = await httpService.putData(
          { permissionId },
          routes.updateAdminPermissions(adminId)
        );
        
        // Extract data with fallbacks
        const typedResponse = response as NestedApiResponse;
        let extractedData = typedResponse?.data?.data || typedResponse?.data || response;
        return extractedData;
      } catch (error) {
        console.error('Toggle permission error:', error);
        throw error;
      }
    },
    
    onSuccess: (data: any) => {
      // Extract message with fallbacks
      let message = "Permission updated successfully";
      if (data?.success && data?.message) {
        message = data.message;
      } else if (data?.message) {
        message = data.message;
      }
      
      toast.success(message);
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['admin-permissions'] });
      queryClient.invalidateQueries({ queryKey: ['admin-specific-permissions', adminId] });
      queryClient.invalidateQueries({ queryKey: ['admin-info', adminId] });
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
    
    onError: (error: any) => {
      console.error('Toggle permission failed:', error);
      const errorMessage = error?.response?.data?.error || error?.response?.data?.message || error?.message || 'Failed to update permission';
      toast.error(errorMessage);
    }
  });
};

// =================== CREATE ROLE ===================
export const useCreateRole = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: createRoleMutation,
    isPending: isCreating,
    error,
  } = useMutation({
    mutationFn: async (roleData: any) => {
      console.log('Creating new role:', roleData);
      
      const response = await httpService.postData(
        roleData,
        routes.createRole()
      );
      return response;
    },

    onSuccess: (response: ApiResponse) => {
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-permissions"] });
      
      // Extract message with fallbacks
      let message = "Role created successfully";
      const typedResponse = response as NestedApiResponse;
      if (typedResponse?.data?.success && typedResponse?.data?.message) {
        message = typedResponse.data.message;
      } else if (typedResponse?.data && 'message' in typedResponse.data && typedResponse.data.message) {
        message = typedResponse.data.message as string;
      } else if (response?.message) {
        message = response.message;
      }
      
      toast.success(message);
    },

    onError: (error: any) => {
      console.error('Role creation failed:', error);
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to create role";
      toast.error(errorMessage);
    },
  });

  const createRole = async (roleData: any) => {
    try {
      const response = await createRoleMutation(roleData);
      const typedResponse = response as NestedApiResponse;
      return typedResponse?.data?.data || typedResponse?.data || response;
    } catch (error) {
      throw error;
    }
  };

  return {
    createRole,
    isCreating,
    createRoleError: ErrorHandler(error),
  };
};

// =================== TOGGLE ROLE PERMISSION ===================
export const useToggleRolePermission = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: toggleRolePermissionMutation,
    isPending: isToggling,
    error,
  } = useMutation({
    mutationFn: async ({ roleId, permissionId }: { roleId: string | number; permissionId: number }) => {
      console.log('Toggling role permission:', { roleId, permissionId });
      
      const response = await httpService.putData(
        {},
        routes.toggleRolePermission(roleId, permissionId)
      );
      return response;
    },

    onSuccess: (response: ApiResponse) => {
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-permissions"] });
      
      // Extract message with fallbacks
      let message = "Role permission updated successfully";
      const typedResponse = response as NestedApiResponse;
      if (typedResponse?.data?.success && typedResponse?.data?.message) {
        message = typedResponse.data.message;
      } else if (typedResponse?.data && 'message' in typedResponse.data && typedResponse.data.message) {
        message = typedResponse.data.message as string;
      } else if (response?.message) {
        message = response.message;
      }
      
      toast.success(message);
    },

    onError: (error: any) => {
      console.error('Toggle role permission failed:', error);
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to toggle role permission";
      toast.error(errorMessage);
    },
  });

  const toggleRolePermission = async (roleId: string | number, permissionId: number) => {
    try {
      const response = await toggleRolePermissionMutation({ roleId, permissionId });
      const typedResponse = response as NestedApiResponse;
      return typedResponse?.data?.data || typedResponse?.data || response;
    } catch (error) {
      throw error;
    }
  };

  return {
    toggleRolePermission,
    isToggling,
    toggleRolePermissionError: ErrorHandler(error),
  };
};

// =================== LEGACY HOOKS (kept for backward compatibility) ===================
export const useUpdateAdminPermissionsLegacy = (onSuccess?: (data: any) => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null);

  const updatePermissionsPayload = async (adminId: string | number, payload: any) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Updating admin permissions (legacy):', { adminId, payload });
      
      const response = await httpService.putData(
        payload,
        routes.updateAdminPermissions(adminId)
      );
      
      // Extract data with fallbacks
      let extractedData = response?.data?.data || response?.data || response;
      setData(extractedData);
      
      if (onSuccess) {
        onSuccess(extractedData);
      }
      return extractedData;
    } catch (err: any) {
      const handledError = ErrorHandler(err);
      setError(handledError);
      console.error('Error updating admin permissions:', handledError);
      return Promise.reject(handledError);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updatePermissionsIsLoading: isLoading,
    updatePermissionsError: error,
    updatePermissionsData: data,
    updatePermissionsPayload,
  };
};

export const useToggleRolePermissionLegacy = (onSuccess?: (data: any) => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null);

  const togglePermissionPayload = async (roleId: string | number, permissionId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Toggling role permission (legacy):', { roleId, permissionId });
      
      const response = await httpService.putData(
        {},
        routes.toggleRolePermission(roleId, permissionId)
      );
      
      // Extract data with fallbacks
      let extractedData = response?.data?.data || response?.data || response;
      setData(extractedData);
      
      if (onSuccess) {
        onSuccess(extractedData);
      }
      return extractedData;
    } catch (err: any) {
      const handledError = ErrorHandler(err);
      setError(handledError);
      console.error('Error toggling role permission:', handledError);
      return Promise.reject(handledError);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    togglePermissionIsLoading: isLoading,
    togglePermissionError: error,
    togglePermissionData: data,
    togglePermissionPayload,
  };
};