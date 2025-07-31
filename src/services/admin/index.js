// services/admin/index.js
"use client";

import { routes } from "../api-routes";
import { ErrorHandler } from "../errorHandler";
import useFetchItem from "../useFetchItem";
import httpService from "../httpService";
import useMutateItem from "../useMutateItem";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// =================== GET ADMIN ROLES ===================
export const useGetAdminRoles = ({ enabled = true } = {}) => {
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useFetchItem({
    queryKey: ["admin-roles"],
    queryFn: () => httpService.getData(routes.adminRoles()),
    enabled,
    retry: 2,
    initialPage: 1,
    initialPageSize: 10,
    initialFilter: {},
    isPaginated: false,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  // Extract roles data with fallbacks like categories
  let rolesData = [];
  
  try {
    if (data) {
      if (data?.data?.success && data?.data?.data) {
        rolesData = data.data.data || [];
      } else if (data?.data && Array.isArray(data.data)) {
        rolesData = data.data;
      } else if (data?.success && Array.isArray(data.data)) {
        rolesData = data.data;
      } else if (Array.isArray(data)) {
        rolesData = data;
      }
    }
  } catch (extractError) {
    console.error("Error extracting roles data:", extractError);
    rolesData = [];
  }

  console.log('🔍 useGetAdminRoles - Processed roles:', rolesData);

  return {
    rolesData,
    isRolesLoading: isLoading,
    rolesError: ErrorHandler(error),
    refetchRoles: refetch
  };
};

// =================== GET ADMIN PERMISSIONS ===================
export const useGetAdminPermissions = ({ enabled = true }) => {
  const { 
    isLoading, 
    error, 
    data, 
    refetch, 
    isFetching 
  } = useFetchItem({
    queryKey: ["admin-permissions"],
    queryFn: () => httpService.getData(routes.adminPermissions()),
    enabled,
    retry: 2,
    initialPage: 1,
    initialPageSize: 10,
    initialFilter: {},
    isPaginated: false,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  // Extract permissions data with fallbacks
  let permissionsData = [];
  
  try {
    if (data) {
      if (data?.data?.success && data?.data?.data) {
        permissionsData = data.data.data || [];
      } else if (data?.data && Array.isArray(data.data)) {
        permissionsData = data.data;
      } else if (data?.success && Array.isArray(data.data)) {
        permissionsData = data.data;
      } else if (Array.isArray(data)) {
        permissionsData = data;
      }
    }
  } catch (extractError) {
    console.error("Error extracting permissions data:", extractError);
    permissionsData = [];
  }

  console.log('🔍 useGetAdminPermissions - Processed permissions:', permissionsData);

  return {
    isFetchingPermissions: isFetching,
    isPermissionsLoading: isLoading,
    permissionsData,
    permissionsError: ErrorHandler(error),
    refetchPermissions: refetch
  };
};

// =================== GET ALL ADMINS ===================
export const useGetAdmins = ({ enabled = true, filter = {} }) => {
  const { 
    isFetched, 
    isLoading, 
    error, 
    data, 
    refetch, 
    isFetching, 
    setFilter,
    pageNumber,
    pageSize,
    setPageNumber,
    setPageSize
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

  // Extract admins data with comprehensive fallbacks like categories
  let adminsData = [];
  let pagination = {
    total: 0,
    currentPage: 1,
    totalPages: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  try {
    if (data) {
      // Check multiple possible response structures
      if (data?.data?.success && data?.data?.data) {
        adminsData = data.data.data.admins || data.data.data || [];
        pagination = { ...pagination, ...data.data.data.pagination };
      } else if (data?.data?.admins) {
        adminsData = data.data.admins || [];
        pagination = { ...pagination, ...data.data.pagination };
      } else if (data?.success && data?.data) {
        adminsData = data.data.admins || data.data || [];
        pagination = { ...pagination, ...data.pagination };
      } else if (data?.admins) {
        adminsData = data.admins || [];
        pagination = { ...pagination, ...data.pagination };
      } else if (data?.data && Array.isArray(data.data)) {
        adminsData = data.data;
        pagination = { ...pagination, ...data.pagination };
      } else if (Array.isArray(data)) {
        adminsData = data;
      }
    }
  } catch (extractError) {
    console.error("Error extracting admins data:", extractError);
    adminsData = [];
  }

  console.log('🔍 useGetAdmins - Raw data:', data);
  console.log('🔍 useGetAdmins - Processed admins:', adminsData);
  console.log('🔍 useGetAdmins - Pagination:', pagination);

  return {
    isFetchingAdmins: isFetching,
    isAdminsLoading: isLoading,
    adminsData,
    totalAdmins: pagination.total || adminsData.length,
    totalPages: pagination.totalPages || 0,
    currentPage: pagination.currentPage || 1,
    itemsPerPage: pagination.itemsPerPage || 10,
    hasNextPage: pagination.hasNextPage || false,
    hasPreviousPage: pagination.hasPreviousPage || false,
    adminsError: ErrorHandler(error),
    refetchAdmins: refetch,
    pageNumber,
    pageSize,
    setPageNumber,
    setPageSize,
    setFilter
  };
};

// =================== GET SPECIFIC ADMIN INFO ===================
export const useGetAdminInfo = (adminId) => {
  const [adminData, setAdminData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdminInfo = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await httpService.getData(routes.getAdminInfo(adminId));
      
      // Extract admin data with fallbacks
      let extractedData = null;
      
      if (response?.data?.success && response?.data?.data) {
        extractedData = response.data.data;
      } else if (response?.data) {
        extractedData = response.data;
      } else if (response?.success && response?.data) {
        extractedData = response.data;
      }
      
      console.log('🔍 useGetAdminInfo - Raw response:', response);
      console.log('🔍 useGetAdminInfo - Extracted data:', extractedData);
      
      setAdminData(extractedData);
      return extractedData;
    } catch (err) {
      setError(err);
      console.error("Error fetching admin info:", ErrorHandler(err));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (adminId) {
      fetchAdminInfo();
    }
  }, [adminId]);

  const refetchAdminInfo = () => {
    return fetchAdminInfo();
  };

  return {
    adminData,
    isLoading,
    error: ErrorHandler(error),
    refetchAdminInfo
  };
};

// =================== GET CURRENT ADMIN ===================
export const useGetCurrentAdmin = () => {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCurrentAdmin = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("🔍 Fetching current admin from:", routes.getCurrentAdmin());
      const response = await httpService.getData(routes.getCurrentAdmin());
      
      console.log("📡 Raw API Response:", response);
      
      if (!response || !response.data) {
        throw new Error("No admin data received from server");
      }
      
      // Extract admin data with fallbacks
      let adminData = null;
      
      if (response?.data?.success && response?.data?.data) {
        adminData = response.data.data;
      } else if (response?.data) {
        adminData = response.data;
      }
      
      // Ensure roles exists even if empty
      adminData = {
        ...adminData,
        roles: adminData?.roles || []
      };
      
      console.log("✅ Current admin fetched successfully:", {
        id: adminData.id,
        email: adminData.email,
        roles: adminData.roles,
        roleCount: adminData.roles?.length,
        fullData: adminData
      });
      
      setCurrentAdmin(adminData);
      return adminData;
    } catch (error) {
      console.error("❌ Error fetching current admin:", error);
      const errorMessage = ErrorHandler(error);
      setError(errorMessage);
      
      // Log specific error types
      if (error.response?.status === 401) {
        console.log("🚫 Unauthorized - user not logged in");
      } else if (error.response?.status === 403) {
        console.log("🚫 Forbidden - user not an admin");
      } else if (error.response?.status === 404) {
        console.log("🚫 Not Found - endpoint doesn't exist");
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch on mount
  useEffect(() => {
    getCurrentAdmin();
  }, []);

  return {
    currentAdmin,
    isLoading,
    error,
    getCurrentAdmin,
    refetch: getCurrentAdmin,
  };
};

// =================== CREATE ADMIN ROLE ===================
export const useCreateAdminRole = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: createRoleMutation,
    isPending: isCreating,
    error,
  } = useMutation({
    mutationFn: async (payload) => {
      const response = await httpService.postData(payload, routes.createAdminRole());
      return response;
    },

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
      
      // Extract message with fallbacks
      let message = "Role created successfully";
      if (response?.data?.success && response?.data?.message) {
        message = response.data.message;
      } else if (response?.data?.message) {
        message = response.data.message;
      }
      
      toast.success(message);
    },

    onError: (error) => {
      console.error('Role creation failed:', error);
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to create role";
      toast.error(errorMessage);
    },
  });

  const createRole = async (payload) => {
    try {
      const response = await createRoleMutation(payload);
      return response?.data?.data || response?.data || response;
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

// =================== CREATE ADMIN ===================
export const useCreateAdmin = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: createAdminMutation,
    isPending: isCreating,
    error,
  } = useMutation({
    mutationFn: async (payload) => {
      const response = await httpService.postData(payload, routes.createAdmin());
      return response;
    },

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      
      // Extract message with fallbacks
      let message = "Admin created successfully";
      if (response?.data?.success && response?.data?.message) {
        message = response.data.message;
      } else if (response?.data?.message) {
        message = response.data.message;
      }
      
      toast.success(message);
    },

    onError: (error) => {
      console.error('Admin creation failed:', error);
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to create admin";
      toast.error(errorMessage);
    },
  });

  const createAdmin = async (payload) => {
    try {
      const response = await createAdminMutation(payload);
      return response?.data?.data || response?.data || response;
    } catch (error) {
      throw error;
    }
  };

  return {
    createAdmin,
    isCreating,
    createAdminError: ErrorHandler(error),
  };
};

// =================== DELETE ADMIN ===================
export const useDeleteAdmin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const queryClient = useQueryClient();

  const deleteAdmin = async (adminId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await httpService.deleteData(routes.deleteAdmin(adminId));
      
      setData(response.data);
      
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      
      // Extract message with fallbacks
      let message = "Admin deleted successfully";
      if (response?.data?.success && response?.data?.message) {
        message = response.data.message;
      } else if (response?.data?.message) {
        message = response.data.message;
      }
      
      toast.success(message);
      return response.data;
    } catch (error) {
      console.error('Admin deletion failed:', error);
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to delete admin";
      toast.error(errorMessage);
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteAdmin,
    isLoading,
    error,
    data
  };
};

// =================== UPDATE ADMIN ROLES ===================
export const useUpdateAdminRoles = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: updateRolesMutation,
    isPending: isUpdating,
    error,
  } = useMutation({
    mutationFn: async ({ adminId, roleNames }) => {
      const response = await httpService.putData(
        { roleNames },
        routes.updateAdminRoles(adminId)
      );
      return response;
    },

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      queryClient.invalidateQueries({ queryKey: ["admin-info"] });
      
      toast.success("Roles updated successfully");
    },

    onError: (error) => {
      console.error('Roles update failed:', error);
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to update roles";
      toast.error(errorMessage);
    },
  });

  const updateRoles = async (adminId, roleNames) => {
    try {
      const response = await updateRolesMutation({ adminId, roleNames });
      return response?.data?.data || response?.data || response;
    } catch (error) {
      throw error;
    }
  };

  return {
    updateRoles,
    isUpdating,
    updateRolesError: ErrorHandler(error),
  };
};

// =================== INVITE ADMIN ===================
export const useInviteAdmin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const inviteAdmin = async (payload) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await httpService.postData(payload, routes.inviteAdmin());
      
      // Extract data with fallbacks
      let extractedData = response?.data?.data || response?.data || response;
      setData(extractedData);
      
      // Extract message with fallbacks
      let message = "Admin invited successfully";
      if (response?.data?.success && response?.data?.message) {
        message = response.data.message;
      } else if (response?.data?.message) {
        message = response.data.message;
      }
      
      toast.success(message);
      return extractedData;
    } catch (error) {
      console.error('Admin invitation failed:', error);
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to send invitation";
      toast.error(errorMessage);
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    inviteAdmin,
    isLoading,
    error: ErrorHandler(error),
    data
  };
};

// =================== ADMIN REGISTRATION ===================
export const useAdminRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const registerAdmin = async (payload) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await httpService.postData(payload, routes.registerInvitedAdmin());
      
      // Extract data with fallbacks
      let extractedData = response?.data?.data || response?.data || response;
      setData(extractedData);
      
      return extractedData;
    } catch (error) {
      setError(error);
      throw ErrorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    registerAdmin,
    isLoading,
    error: ErrorHandler(error),
    data
  };
};

// =================== HELPER FUNCTIONS ===================
export const useAdminInviteParams = () => {
  const [params, setParams] = useState({
    email: null,
    userId: null,
    expires: null,
    signature: null,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const email = searchParams.get('email');
    const userId = searchParams.get('userId');
    const expires = searchParams.get('expires');
    const signature = searchParams.get('signature');

    let error = null;
    
    if (!email || !userId || !expires || !signature) {
      error = 'Invalid invitation link. Missing required parameters.';
    } else {
      const expiryTime = parseInt(expires);
      if (isNaN(expiryTime) || Date.now() > expiryTime) {
        error = 'This invitation link has expired. Please request a new one.';
      }
    }

    setParams({
      email,
      userId,
      expires,
      signature,
      isLoading: false,
      error
    });
  }, []);

  return params;
};

export const useEnhancedAdminInviteParams = () => {
  const [params, setParams] = useState({
    email: null,
    userId: null,
    expires: null,
    signature: null,
    token: null,
    timestamp: null,
    noExpiry: false,
    isLoading: true,
    error: null,
    isValid: false
  });

  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const email = searchParams.get('email');
      const userId = searchParams.get('userId');
      const expires = searchParams.get('expires');
      const signature = searchParams.get('signature');
      const token = searchParams.get('token');
      const timestamp = searchParams.get('timestamp');
      const noExpiry = searchParams.get('noExpiry') === 'true';

      console.log('Parsing invite params:', { 
        email, 
        userId, 
        expires, 
        signature, 
        token: token ? '[PRESENT]' : '[MISSING]', 
        timestamp,
        noExpiry 
      });

      let error = null;
      let isValid = false;
      
      if (!email || !userId || !signature || !token || !timestamp) {
        const missing = [];
        if (!email) missing.push('email');
        if (!userId) missing.push('userId');
        if (!signature) missing.push('signature');
        if (!token) missing.push('token');
        if (!timestamp) missing.push('timestamp');
        
        error = `Invalid invitation link. Missing required parameters: ${missing.join(', ')}.`;
      } else if (!noExpiry) {
        if (!expires) {
          error = 'Invalid invitation link. Missing expiry information.';
        } else {
          const expiryTime = parseInt(expires);
          if (isNaN(expiryTime)) {
            error = 'Invalid invitation link. Invalid expiry format.';
          } else if (Date.now() > expiryTime) {
            error = 'This invitation link has expired. Please request a new one.';
          } else {
            isValid = true;
          }
        }
      } else {
        isValid = true;
      }

      setParams({
        email,
        userId: userId ? parseInt(userId) : null,
        expires: expires ? parseInt(expires) : null,
        signature,
        token,
        timestamp: timestamp ? parseInt(timestamp) : null,
        noExpiry,
        isLoading: false,
        error,
        isValid
      });
    } catch (err) {
      console.error('Error parsing invite params:', err);
      setParams(prev => ({
        ...prev,
        isLoading: false,
        error: 'Invalid invitation link format.',
        isValid: false
      }));
    }
  }, []);

  return params;
};

// =================== AUTH HELPERS ===================
export const setTestToken = (token) => {
  localStorage.setItem('token', token);
  console.log('🧪 Token set for testing:', !!token);
};

export const checkAuthState = () => {
  const authData = {
    localStorage: {
      token: localStorage.getItem('token'),
      authToken: localStorage.getItem('authToken'), 
      userEmail: localStorage.getItem('userEmail'),
      userId: localStorage.getItem('userId')
    },
    sessionStorage: {
      token: sessionStorage.getItem('token'),
      authToken: sessionStorage.getItem('authToken'),
      userEmail: sessionStorage.getItem('userEmail'),
      userId: sessionStorage.getItem('userId')
    }
  };
  
  console.log('🔍 Current auth state:', authData);
  return authData;
};