// services/admin/unified-admin-hooks.js
"use client";

import React, { useState, useEffect } from "react";
import { routes } from "../api-routes";
import { ErrorHandler } from "../errorHandler";
import useFetchItem from "../useFetchItem";
import httpService from "../httpService";
import { toast } from "sonner";
import { useMutation, useQueryClient } from '@tanstack/react-query';

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

export const useGetPendingInvitations = ({ enabled = true, filter = {} }) => {
  const { data, isLoading, error, refetch } = useFetchItem({
    queryKey: ["pending-invitations", filter],
    queryFn: (params) => httpService.getData(routes.getPendingInvitations(params)),
    enabled,
    retry: 2,
    initialFilter: filter,
    isPaginated: true,
  });

  return {
    invitationsData: extractResponseData(data) || [],
    totalInvitations: data?.pagination?.total || 0,
    isInvitationsLoading: isLoading,
    invitationsError: ErrorHandler(error),
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

export const useGetAdmins = ({ enabled = true, filter = {} }) => {
  const { 
    isFetched, isLoading, error, data, refetch, isFetching, 
    setFilter, pageNumber, pageSize, setPageNumber, setPageSize
  } = useFetchItem({
    queryKey: ["admins", filter],
    queryFn: (params) => httpService.getData(routes.admins(params)),
    enabled,
    retry: 2,
    initialFilter: filter,
    isPaginated: true,
    initialPage: 1,
    initialPageSize: 10
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
    itemsPerPage: data?.pagination?.itemsPerPage || 10,
    hasNextPage: data?.pagination?.hasNextPage || false,
    hasPreviousPage: data?.pagination?.hasPreviousPage || false,
    adminsError: ErrorHandler(error),
    refetchAdmins: refetch,
    pageNumber, pageSize, setPageNumber, setPageSize, setFilter
  };
};

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
      // ✅ FIXED: Transform the payload to match backend expectations
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

// =================== ROLE MANAGEMENT ===================

export const useGetAdminRoles = ({ enabled = true } = {}) => {
  const { data, isLoading, error, refetch } = useFetchItem({
    queryKey: ["admin-roles"],
    queryFn: () => httpService.getData(routes.adminRoles()),
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

export const useUpdateAdminRoles = (onSuccess) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateRolesPayload = async (adminId, roleNames) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await httpService.putData({ roleNames }, routes.updateAdminRoles(adminId));
      const extractedData = extractResponseData(response);
      const message = extractMessage(response, 'Roles updated successfully');
      
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

// =================== PERMISSION MANAGEMENT ===================

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

export const useUpdateAdminPermissions = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: updatePermissionsMutation,
    isPending: isUpdating,
    error,
  } = useMutation({
    mutationFn: async ({ adminId, payload }) => {
      const response = await httpService.putData(payload, routes.updateAdminPermissions(adminId));
      return response;
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-permissions"] });
      queryClient.invalidateQueries({ queryKey: ["admin-specific-permissions", variables.adminId] });
      queryClient.invalidateQueries({ queryKey: ["admin-info", variables.adminId] });
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      
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
      const response = await updatePermissionsMutation({ adminId, payload });
      return extractResponseData(response);
    } catch (error) {
      throw error;
    }
  };

  return { updatePermissions, isUpdating, updatePermissionsError: ErrorHandler(error) };
};

export const useUpdateAdminRolesPermissions = (onSuccess) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateRolesPermissionsPayload = async (adminId, roleIds) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await httpService.putData({ roleIds }, routes.updateAdminRolesPermissions(adminId));
      const extractedData = extractResponseData(response);
      const message = extractMessage(response, 'Admin roles updated successfully');
      
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