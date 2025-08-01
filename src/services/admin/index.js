"use client"

import { routes } from "../api-routes";
import { ErrorHandler } from "../errorHandler";
import useFetchItem from "../useFetchItem";
import httpService from "../httpService";
import useMutateItem from "../useMutateItem";
import { useState, useEffect } from "react";
import { toast } from "sonner"; // ✅ Import toast

// useGetAdminInfo.js
export const useGetAdminInfo = (adminId) => {
  const [adminData, setAdminData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdminInfo = async () => {
    setIsLoading(true);
    try {
      const response = await httpService.getData(routes.getAdminInfo(adminId));
      setAdminData(response.data);
      return response.data;
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



// useGetAdminRoles.js
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
    retry: 2
  });

  return {
    rolesData: data?.data || [],
    isRolesLoading: isLoading,
    rolesError: ErrorHandler(error),
    refetchRoles: refetch
  };
};


export const useGetAdminPermissions = ({ enabled = true }) => {
  const { 
    isLoading, 
    error, 
    data, 
    refetch, 
    isFetching 
  } = useFetchItem({
    queryKey: ["admin-permissions"],
    queryFn: () => {
      return httpService.getData(routes.adminPermissions());
    },
    enabled,
    retry: 2
  });

  return {
    isFetchingPermissions: isFetching,
    isPermissionsLoading: isLoading,
    permissionsData: data?.data?.data || data?.data || [], // Handle nested data structure
    permissionsError: ErrorHandler(error),
    refetchPermissions: refetch
  };
};

// ✅ FIXED: Single, clean useCreateAdminRole function
export const useCreateAdminRole = (handleSuccess) => {
  const { data, error, isPending, mutateAsync } = useMutateItem({
    mutationFn: (payload) =>
      httpService.postData(payload, routes.createAdminRole()),
    queryKeys: ["create-admin-role"],
    onSuccess: (response) => {
      const resData = response?.data || {};
      if (handleSuccess) handleSuccess(resData);
      toast.success(resData?.message || "Role created successfully");
    },
    onError: (err) => {
      const errorMessage = err?.response?.data?.error || "Failed to create role";
      toast.error(errorMessage);
    },
  });

  return {
    createRoleData: data,
    createRoleError: ErrorHandler(error) || "An error occurred",
    createRoleIsLoading: isPending,
    createRolePayload: async (payload) => {
      await mutateAsync(payload);
    },
  };
};

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
      
      // Ensure roles exists even if empty
      const adminData = {
        ...response.data,
        roles: response.data.roles || []
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
      
      // If it's a 401/403, the user might not be logged in or not an admin
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

export function useAdminInviteParams() {
  const [params, setParams] = useState({
    email: null,
    userId: null,
    expires: null,
    signature: null,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    // Simulate next.js useSearchParams
    const searchParams = new URLSearchParams(window.location.search);
    const email = searchParams.get('email');
    const userId = searchParams.get('userId');
    const expires = searchParams.get('expires');
    const signature = searchParams.get('signature');

    // Validate the invite parameters
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
}

export function useRegistrationForm(props) {
  const { email, userId, expires, signature } = props;
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: email ? email.split('@')[0] : '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: '',
    role: 'admin'
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName) errors.firstName = 'First name is required';
    if (!formData.lastName) errors.lastName = 'Last name is required';
    if (!formData.phone) errors.phone = 'Phone number is required';
    if (!formData.username) errors.username = 'Username is required';
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    
    if (!validateForm() || !email || !userId || !expires || !signature) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const registrationData = {
        password: formData.password,
        fullName: `${formData.firstName} ${formData.lastName}`,
        username: formData.username,
        gender: formData.gender || undefined,
        phone: formData.phone,
        role: formData.role,
        email: email,
        userId: userId,
        expires: expires,
        signature: signature
      };

      await registerAdmin(registrationData);
      setIsSuccess(true);
    } catch (error) {
      setSubmitError(error.message || 'Failed to complete registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    formErrors,
    handleInputChange,
    handleSubmit,
    isSubmitting,
    submitError,
    isSuccess
  };
}

export const useInviteAdmin = (onSuccess) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const inviteAdminPayload = async (payload) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await httpService.postData(payload, routes.inviteAdmin());
      setData(response.data);
      if (onSuccess) onSuccess(response.data);
      return response.data;
    } catch (error) {
      setError(error);
      return error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    inviteAdminIsLoading: isLoading,
    inviteAdminError: ErrorHandler(error),
    inviteAdminData: data,
    inviteAdminPayload
  };
};

export function useRegisterAdmin({ onSuccess } = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const registerAdminPayload = async (payload) => {
    const {
      email,
      userId,
      expires,
      signature,
      token,
      timestamp,
      noExpiry,
      firstName,
      lastName,
      username,
      phone,
      gender,
      role,
      password,
    } = payload;

    console.log('Registration payload received:', {
      ...payload,
      password: '[REDACTED]',
      token: token ? '[PRESENT]' : '[MISSING]'
    });

    // Client-side validation
    if (
      !email || !userId || !expires || !signature ||
      !firstName || !lastName || !username || !phone ||
      !gender || !role || !password
    ) {
      const missingFields = [];
      if (!email) missingFields.push('email');
      if (!userId) missingFields.push('userId');
      if (!signature) missingFields.push('signature');
      if (!token) missingFields.push('token');
      if (!timestamp) missingFields.push('timestamp');
      if (!firstName) missingFields.push('firstName');
      if (!lastName) missingFields.push('lastName');
      if (!username) missingFields.push('username');
      if (!phone) missingFields.push('phone');
      if (!gender) missingFields.push('gender');
      if (!role) missingFields.push('role');
      if (!password) missingFields.push('password');
      
      const errorMsg = `Missing required fields: ${missingFields.join(', ')}`;
      setError(errorMsg);
      return Promise.reject(new Error(errorMsg));
    }

    // Check expiry if not noExpiry
    if (!noExpiry && expires) {
      const expiryTime = parseInt(expires);
      if (isNaN(expiryTime) || Date.now() > expiryTime) {
        const errorMsg = 'Invitation has expired';
        setError(errorMsg);
        return Promise.reject(new Error(errorMsg));
      }
    }

    setLoading(true);
    setError(null);

    // Build signed-url query string
    const query = new URLSearchParams({ 
      email, userId, expires, signature, token, timestamp, noExpiry
    }).toString();
    const endpoint = `admin/manage/register?${query}`;

    try {
      const response = await httpService.postData({
        fullName: `${firstName} ${lastName}`,
        username,
        phone,
        gender,
        role,
        password,
      }, endpoint);

      if (!response.success) {
        throw new Error(response.error || 'Registration failed');
      }

      setData(response.data);
      if (onSuccess) onSuccess(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { registerAdminPayload, loading, error, data };
}

export const useAdminRegistration = (onSuccess) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const registerAdmin = async (payload) => {
    setIsLoading(true);
    setError(null);

    try {
      // The httpService will now properly handle the invitation params
      const response = await httpService.postData(
        payload, 
        'admin/manage/register'
      );
      
      setData(response);
      if (onSuccess) onSuccess(response);
      return response;
    } catch (error) {
      const errorMsg = error?.response?.data?.error || 
                      error?.message || 
                      "Registration failed";
      setError(errorMsg);
      throw errorMsg;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    registerAdmin,
    isLoading,
    error,
    data
  };
};

export const useCreateAdmin = (onSuccess = () => {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const createAdmin = async (payload) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await httpService.postData(payload, routes.createAdmin());
      setData(response.data);
      onSuccess(response);
      return response;
    } catch (error) {
      setError(error);
      throw ErrorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createAdmin,
    isLoading,
    error: ErrorHandler(error),
    data
  };
};

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
    queryFn: (params) => {
      return httpService.getData(routes.admins(params));
    },
    enabled,
    retry: 2,
    initialFilter: filter,
    isPaginated: true,
    initialPage: 1,
    initialPageSize: 10
  });

  return {
    isFetchingAdmins: isFetching,
    isAdminsLoading: isLoading,
    adminsData: data?.data || [], // ✅ Fixed: removed extra .data
    totalAdmins: data?.pagination?.total || 0, // ✅ Fixed: direct access to pagination
    totalPages: data?.pagination?.totalPages || 0,
    currentPage: data?.pagination?.currentPage || 1,
    itemsPerPage: data?.pagination?.itemsPerPage || 10,
    hasNextPage: data?.pagination?.hasNextPage || false,
    hasPreviousPage: data?.pagination?.hasPreviousPage || false,
    adminsError: ErrorHandler(error),
    refetchAdmins: refetch,
    pageNumber,
    pageSize,
    setPageNumber,
    setPageSize,
    setFilter
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
      setData(response.data);
      if (onSuccess) onSuccess(response.data);
      return response.data;
    } catch (error) {
      setError(error);
      throw ErrorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteAdminIsLoading: isLoading,
    deleteAdminError: ErrorHandler(error),
    deleteAdminData: data,
    deleteAdminPayload,
  };
};

// In your services/admin/index.js - Fix this hook
export const useUpdateAdminRoles = (onSuccess) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateRolesPayload = async (adminId, roleNames) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await httpService.putData(
        { roleNames },
        routes.updateAdminRoles(adminId)
      );
      
      toast.success("Roles updated successfully");
      if (onSuccess) onSuccess(response.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to update roles";
      setError(errorMsg);
      toast.error(errorMsg);
      throw errorMsg;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateRolesIsLoading: isLoading,
    updateRolesError: error,
    updateRolesPayload,
  };
};

export const useUpdateAdminPermissions = (onSuccess) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const updatePermissionsPayload = async (adminId, payload) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Updating admin permissions:', { adminId, payload });
      
      const response = await httpService.putData(
        payload,
        routes.updateAdminPermissions(adminId)
      );
      
      setData(response.data);
      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (err) {
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

export const useUpdateAdminRolesPermissions = (onSuccess) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const updateRolesPermissionsPayload = async (adminId, roleIds) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Updating admin roles for permissions:', { adminId, roleIds });
      
      const response = await httpService.putData(
        { roleIds },
        routes.updateAdminRolesPermissions(adminId)
      );
      
      setData(response.data);
      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (err) {
      const handledError = ErrorHandler(err);
      setError(handledError);
      console.error('Error updating admin roles/permissions:', handledError);
      return Promise.reject(handledError);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateRolesPermissionsIsLoading: isLoading,
    updateRolesPermissionsError: error,
    updateRolesPermissionsData: data,
    updateRolesPermissionsPayload,
  };
};



// ✅ ADD: Helper function to manually set token for testing
export const setTestToken = (token) => {
  localStorage.setItem('token', token);
  console.log('🧪 Token set for testing:', !!token);
};

// ✅ ADD: Helper function to check current auth state
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

export const useCreateRole = (onSuccess) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const createRolePayload = async (roleData) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Creating new role:', roleData);
      
      const response = await httpService.postData(
        roleData,
        routes.createRole()
      );
      
      setData(response.data);
      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (err) {
      const handledError = ErrorHandler(err);
      setError(handledError);
      console.error('Error creating role:', handledError);
      return Promise.reject(handledError);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createRoleIsLoading: isLoading,
    createRoleError: error,
    createRoleData: data,
    createRolePayload,
  };
};

export const useGetSpecificAdminPermissions = (adminId, enabled = true) => {
  const { 
    isLoading, 
    error, 
    data, 
    refetch, 
    isFetching 
  } = useFetchItem({
    queryKey: ["admin-specific-permissions", adminId],
    queryFn: () => {
      return httpService.getData(routes.getSpecificAdminPermissions(adminId));
    },
    enabled: enabled && !!adminId,
    retry: 2
  });

  return {
    isFetchingSpecificPermissions: isFetching,
    isSpecificPermissionsLoading: isLoading,
    specificPermissionsData: data?.data || null,
    specificPermissionsError: ErrorHandler(error),
    refetchSpecificPermissions: refetch
  };
};

export const useToggleRolePermission = (onSuccess) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const togglePermissionPayload = async (roleId, permissionId) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Toggling role permission:', { roleId, permissionId });
      
      const response = await httpService.putData(
        {},
        routes.toggleRolePermission(roleId, permissionId)
      );
      
      setData(response.data);
      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (err) {
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

// export const useGetAdminInfo = (adminId) => {
//   const [adminData, setAdminData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const { adminsData, isAdminsLoading, refetchAdmins } = useGetAdmins({ enabled: true });

//   useEffect(() => {
//     if (!isAdminsLoading && adminsData) {
//       const admin = adminsData.find((admin) => admin.id.toString() === adminId.toString());
//       setAdminData(admin || null);
//       setIsLoading(false);
//       if (!admin) {
//         setError(new Error("Admin not found"));
//       }
//     }
//   }, [adminId, adminsData, isAdminsLoading]);

//   const refetchAdminInfo = () => {
//     return refetchAdmins();
//   };

//   return {
//     adminData,
//     isLoading: isAdminsLoading || isLoading,
//     error,
//     refetchAdminInfo
//   };
// };

export function useEnhancedAdminInviteParams() {
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
}


