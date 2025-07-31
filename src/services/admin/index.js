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

  // Extract roles data with fallbacks
  let rolesData = [];
  
  try {
    if (data) {
      if (data?.success && Array.isArray(data?.data)) {
        rolesData = data.data || [];
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
      if (data?.success && Array.isArray(data?.data)) {
        permissionsData = data.data || [];
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

  // Extract admins data with comprehensive fallbacks
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
      if (data?.success && Array.isArray(data?.data)) {
        adminsData = data.data || [];
        pagination = { ...pagination, ...data.pagination };
      } else if (Array.isArray(data)) {
        adminsData = data;
      }
    }
  } catch (extractError) {
    console.error("Error extracting admins data:", extractError);
    adminsData = [];
  }

  console.log('🔍 useGetAdmins - Processed admins:', adminsData);

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
      
      if (!response) {
        throw new Error("No admin data received from server");
      }
      
      // Extract admin data with fallbacks
      let adminData = null;
      
      if (response?.success && response?.data) {
        adminData = response.data;
      } else if (response?.data) {
        adminData = response.data;
      } else {
        adminData = response;
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
        roleCount: adminData.roles?.length
      });
      
      setCurrentAdmin(adminData);
      return adminData;
    } catch (error) {
      console.error("❌ Error fetching current admin:", error);
      const errorMessage = ErrorHandler(error);
      setError(errorMessage);
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

// =================== SECURE INVITE ADMIN ===================
export const useInviteAdmin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const inviteAdmin = async (payload) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('🔐 Sending secure admin invitation:', { ...payload, email: payload.email });
      
      const response = await httpService.postData(payload, routes.inviteAdmin());
      
      console.log('📡 Secure invitation response:', response);
      
      // Extract data with fallbacks
      let extractedData;
      if (response?.success && response?.data) {
        extractedData = response.data;
      } else if (response?.data) {
        extractedData = response.data;
      } else {
        extractedData = response;
      }
      
      setData(extractedData);
      
      // Validate secure URL generation
      if (extractedData?.inviteUrl) {
        try {
          const url = new URL(extractedData.inviteUrl);
          const params = Object.fromEntries(url.searchParams);
          
          // Check for required security parameters
          const requiredParams = ['email', 'userId', 'token', 'signature', 'timestamp'];
          const missing = requiredParams.filter(param => !params[param]);
          
          if (missing.length > 0) {
            console.warn('⚠️ Generated invitation URL missing security parameters:', missing);
            toast.warning('Invitation sent but some security parameters are missing');
          } else {
            console.log('✅ Secure invitation URL generated with all required parameters');
            toast.success('Secure admin invitation sent successfully');
          }
        } catch (urlError) {
          console.error('❌ Invalid invitation URL:', urlError);
          toast.error('Generated invitation URL is invalid');
          throw new Error('Invalid invitation URL generated');
        }
      } else {
        console.warn('⚠️ No invitation URL in response');
        toast.warning('Invitation processed but no URL generated');
      }
      
      return extractedData;
    } catch (error) {
      console.error('❌ Secure admin invitation failed:', error);
      
      let errorMessage = "Failed to send admin invitation";
      
      if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      // Handle specific secure invitation errors
      if (errorMessage.includes('configuration')) {
        toast.error("Server security configuration error. Please contact administrator.");
      } else if (errorMessage.includes('INVITE_SECRET')) {
        toast.error("Invitation signing not configured. Please contact administrator.");
      } else if (errorMessage.includes('already exists')) {
        toast.error("An admin with this email already exists");
      } else {
        toast.error(errorMessage);
      }
      
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

// =================== SECURE ADMIN REGISTRATION ===================
export const useAdminRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const registerAdmin = async (payload) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔐 Starting secure admin registration');
      
      // The registration endpoint will verify the URL parameters automatically
      const response = await httpService.postData(payload, routes.registerInvitedAdmin());
      
      console.log('📡 Secure registration response:', response);
      
      // Extract data with fallbacks
      let extractedData;
      if (response?.success && response?.data) {
        extractedData = response.data;
      } else if (response?.data) {
        extractedData = response.data;
      } else {
        extractedData = response;
      }
      
      setData(extractedData);
      
      console.log('✅ Secure admin registration successful');
      toast.success('Admin account created successfully!');
      
      return extractedData;
    } catch (error) {
      console.error('❌ Secure admin registration failed:', error);
      
      let errorMessage = "Registration failed";
      
      if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      // Don't show toast here - let the component handle it for better UX
      setError(error);
      throw new Error(errorMessage);
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

// =================== CREATE ADMIN ROLE ===================
export const useCreateAdminRole = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: createRoleMutation,
    isPending: isCreating,
    error,
  } = useMutation({
    mutationFn: async (payload) => {
      const response = await httpService.postData(payload, routes.createRole());
      return response;
    },

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
      
      let message = "Role created successfully";
      if (response?.success && response?.message) {
        message = response.message;
      } else if (response?.message) {
        message = response.message;
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
      return response?.data || response;
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
      
      setData(response);
      
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      
      let message = "Admin deleted successfully";
      if (response?.success && response?.message) {
        message = response.message;
      } else if (response?.message) {
        message = response.message;
      }
      
      toast.success(message);
      return response;
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateRoles = async (adminId, roleNames) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await httpService.putData(
        { roleNames },
        routes.updateAdminRoles(adminId)
      );
      
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      queryClient.invalidateQueries({ queryKey: ["admin-info"] });
      
      toast.success("Admin roles updated successfully");
      return response?.data || response;
    } catch (error) {
      console.error('Roles update failed:', error);
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to update roles";
      toast.error(errorMessage);
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateRoles,
    isLoading,
    error: ErrorHandler(error),
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
      
      let extractedData = null;
      if (response?.success && response?.data) {
        extractedData = response.data;
      } else if (response?.data) {
        extractedData = response.data;
      } else {
        extractedData = response;
      }
      
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

  return {
    adminData,
    isLoading,
    error: ErrorHandler(error),
    refetchAdminInfo: fetchAdminInfo
  };
};

// =================== ENHANCED ADMIN INVITE PARAMS ===================
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

      console.log('🔐 Parsing secure invite params:', { 
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
      
      // ✅ Check all required security parameters
      if (!email || !userId || !signature || !token || !timestamp) {
        const missing = [];
        if (!email) missing.push('email');
        if (!userId) missing.push('userId');
        if (!signature) missing.push('signature');
        if (!token) missing.push('token');
        if (!timestamp) missing.push('timestamp');
        
        error = `Invalid invitation link. Missing required security parameters: ${missing.join(', ')}.`;
      } else {
        // ✅ Validate timestamp
        const timestampInt = parseInt(timestamp);
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
        
        if (isNaN(timestampInt)) {
          error = 'Invalid invitation link. Invalid timestamp format.';
        } else if (Date.now() - timestampInt > maxAge) {
          error = 'This invitation link is too old (expired after 7 days). Please request a new one.';
        } else if (!noExpiry && expires) {
          const expiryTime = parseInt(expires);
          if (isNaN(expiryTime)) {
            error = 'Invalid invitation link. Invalid expiry format.';
          } else if (Date.now() > expiryTime) {
            const expiredDate = new Date(expiryTime).toLocaleString();
            error = `This invitation link expired on ${expiredDate}. Please request a new one.`;
          } else {
            isValid = true;
          }
        } else {
          isValid = true;
        }
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
      console.error('Error parsing secure invite params:', err);
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