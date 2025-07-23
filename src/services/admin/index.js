

// "use client"
// import { routes } from "../api-routes";
// import { ErrorHandler } from "../errorHandler";
// import useFetchItem from "../useFetchItem";
// import httpService from "../httpService";
// import { useState, useEffect } from "react";


// export const useGetAdminInfo = (adminId) => {
//   const [adminData, setAdminData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

  

//   const fetchAdminInfo = async () => {
//     setIsLoading(true);
//     try {
//       const response = await httpService.getData(routes.getAdminInfo(adminId));
//       setAdminData(response.data);
//       return response.data;
//     } catch (err) {
//       setError(err);
//       console.error("Error fetching admin info:", ErrorHandler(err));
//       return null;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (adminId) {
//       fetchAdminInfo();
//     }
//   }, [adminId]);

//   const refetchAdminInfo = () => {
//     return fetchAdminInfo();
//   };

//   return {
//     adminData,
//     isLoading,
//     error: ErrorHandler(error),
//     refetchAdminInfo
//   };
// };

// export const useGetAdminRoles = ({ enabled = true }) => {
//   const { 
//     isLoading, 
//     error, 
//     data, 
//     refetch, 
//     isFetching 
//   } = useFetchItem({
//     queryKey: ["admin-roles"],
//     queryFn: () => {
//       return httpService.getData(routes.adminRoles());
//     },
//     enabled,
//     retry: 2
//   });

//   return {
//     isFetchingRoles: isFetching,
//     isRolesLoading: isLoading,
//     rolesData: data?.data || [],
//     rolesError: ErrorHandler(error),
//     refetchRoles: refetch
//   };
// };



// export const useGetAdminPermissions = ({ enabled = true }) => {
//   const { 
//     isLoading, 
//     error, 
//     data, 
//     refetch, 
//     isFetching 
//   } = useFetchItem({
//     queryKey: ["admin-permissions"],
//     queryFn: () => {
//       return httpService.getData(routes.adminPermissions());
//     },
//     enabled,
//     retry: 2
//   });

//   return {
//     isFetchingPermissions: isFetching,
//     isPermissionsLoading: isLoading,
//     permissionsData: data?.data || [],
//     permissionsError: ErrorHandler(error),
//     refetchPermissions: refetch
//   };
// };

// export function useAdminInviteParams() {
//   const [params, setParams] = useState({
//     email: null,
//     userId: null,
//     expires: null,
//     signature: null,
//     isLoading: true,
//     error: null
//   });

//   useEffect(() => {
//     // Simulate next.js useSearchParams
//     const searchParams = new URLSearchParams(window.location.search);
//     const email = searchParams.get('email');
//     const userId = searchParams.get('userId');
//     const expires = searchParams.get('expires');
//     const signature = searchParams.get('signature');

//     // Validate the invite parameters
//     let error = null;
    
//     if (!email || !userId || !expires || !signature) {
//       error = 'Invalid invitation link. Missing required parameters.';
//     } else {
//       const expiryTime = parseInt(expires);
//       if (isNaN(expiryTime) || Date.now() > expiryTime) {
//         error = 'This invitation link has expired. Please request a new one.';
//       }
//     }

//     setParams({
//       email,
//       userId,
//       expires,
//       signature,
//       isLoading: false,
//       error
//     });
//   }, []);

//   return params;
// }

// export function useRegistrationForm(props) {
//   const { email, userId, expires, signature } = props;
  
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     username: email ? email.split('@')[0] : '',
//     phone: '',
//     password: '',
//     confirmPassword: '',
//     gender: '',
//     role: 'admin'
//   });
  
//   const [formErrors, setFormErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitError, setSubmitError] = useState(null);
//   const [isSuccess, setIsSuccess] = useState(false);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
    
//     // Clear errors when field is edited
//     if (formErrors[name]) {
//       setFormErrors(prev => ({ ...prev, [name]: undefined }));
//     }
//   };

//   const validateForm = () => {
//     const errors = {};
    
//     if (!formData.firstName) errors.firstName = 'First name is required';
//     if (!formData.lastName) errors.lastName = 'Last name is required';
//     if (!formData.phone) errors.phone = 'Phone number is required';
//     if (!formData.username) errors.username = 'Username is required';
    
//     if (!formData.password) {
//       errors.password = 'Password is required';
//     } else if (formData.password.length < 8) {
//       errors.password = 'Password must be at least 8 characters';
//     }
    
//     if (!formData.confirmPassword) {
//       errors.confirmPassword = 'Please confirm your password';
//     } else if (formData.password !== formData.confirmPassword) {
//       errors.confirmPassword = 'Passwords do not match';
//     }
    
//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitError(null);
    
//     if (!validateForm() || !email || !userId || !expires || !signature) {
//       return;
//     }
    
//     setIsSubmitting(true);
    
//     try {
//       const registrationData = {
//         password: formData.password,
//         fullName: `${formData.firstName} ${formData.lastName}`,
//         username: formData.username,
//         gender: formData.gender || undefined,
//         phone: formData.phone,
//         role: formData.role,
//         email: email,
//         userId: userId,
//         expires: expires,
//         signature: signature
//       };

//       await registerAdmin(registrationData);
//       setIsSuccess(true);
//     } catch (error) {
//       setSubmitError(error.message || 'Failed to complete registration. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return {
//     formData,
//     formErrors,
//     handleInputChange,
//     handleSubmit,
//     isSubmitting,
//     submitError,
//     isSuccess
//   };
// }

// export const useInviteAdmin = (onSuccess) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [data, setData] = useState(null);

//   const inviteAdminPayload = async (payload) => {
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const response = await httpService.postData(payload, routes.inviteAdmin());
//       setData(response.data);
//       if (onSuccess) onSuccess(response.data);
//       return response.data;
//     } catch (error) {
//       setError(error);
//       return error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return {
//     inviteAdminIsLoading: isLoading,
//     inviteAdminError: ErrorHandler(error),
//     inviteAdminData: data,
//     inviteAdminPayload
//   };
// };


// // working without profile

// export function useRegisterAdmin({ onSuccess } = {}) {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [data, setData] = useState(null);

//   /**
//    * Sends registration payload to backend
//    * @param {Object} payload - form + invitation params
//    * @returns {Promise<Object>} - server response data
//    */
//   const registerAdminPayload = async (payload) => {
//     const {
//       email,
//       userId,
//       expires,
//       signature,
//       firstName,
//       lastName,
//       username,
//       phone,
//       gender,
//       role,
//       password,
//     } = payload;

//     // Client-side validation
//     if (
//       !email || !userId || !expires || !signature ||
//       !firstName || !lastName || !username || !phone ||
//       !gender || !role || !password
//     ) {
//       setError('All fields and invitation parameters are required.');
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     // Build signed-url query string
//     const query = new URLSearchParams({ email, userId, expires, signature }).toString();
//     // HttpService expects a URL path without base
//     const endpoint = `admin/manage/register?${query}`;

//     try {
//       const response = await httpService.postData({
//         fullName: `${firstName} ${lastName}`,
//         username,
//         phone,
//         gender,
//         role,
//         password,
//       }, endpoint);

//       // Assuming response shape: { success: boolean, message: string, data: {...} }
//       if (!response.success) {
//         throw new Error(response.error || 'Registration failed');
//       }

//       setData(response.data);
//       if (onSuccess) onSuccess(response.data);
//       return response.data;
//     } catch (err) {
//       setError(err.message || 'An unexpected error occurred');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { registerAdminPayload, loading, error, data };
// }


// export const useAdminRegistration = (onSuccess) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [data, setData] = useState(null);

//   const registerAdmin = async (payload) => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await httpService.postData(payload, routes.registerAdmin());
//       setData(response.data);
//       if (onSuccess) onSuccess(response.data);
//       return response.data;
//     } catch (error) {
//       setError(error);
//       throw ErrorHandler(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return {
//     registerAdmin,
//     isLoading,
//     error: ErrorHandler(error),
//     data
//   };
// };

// export const useCreateAdmin = (onSuccess = () => {}) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [data, setData] = useState(null);

//   const createAdmin = async (payload) => {
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const response = await httpService.postData(payload, routes.createAdmin());
//       setData(response.data);
//       onSuccess(response);
//       return response;
//     } catch (error) {
//       setError(error);
//       throw ErrorHandler(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return {
//     createAdmin,
//     isLoading,
//     error: ErrorHandler(error),
//     data
//   };
// };



// export const useGetAdmins = ({ enabled = true, filter = {} }) => {
//   const { 
//     isFetched, 
//     isLoading, 
//     error, 
//     data, 
//     refetch, 
//     isFetching, 
//     setFilter,
//     pageNumber,
//     pageSize,
//     setPageNumber,
//     setPageSize
//   } = useFetchItem({
//     queryKey: ["admins", filter],
//     queryFn: (params) => {
//       return httpService.getData(routes.admins(params));
//     },
//     enabled,
//     retry: 2,
//     initialFilter: filter,
//     isPaginated: true,
//     initialPage: 1,
//     initialPageSize: 10
//   });

//   return {
//     isFetchingAdmins: isFetching,
//     isAdminsLoading: isLoading,
//     adminsData: data?.data?.data || [],
//     totalAdmins: data?.data?.pagination?.total || 0,
//     totalPages: data?.data?.pagination?.totalPages || 0,
//     currentPage: data?.data?.pagination?.currentPage || 1,
//     itemsPerPage: data?.data?.pagination?.itemsPerPage || 10,
//     hasNextPage: data?.data?.pagination?.hasNextPage || false,
//     hasPreviousPage: data?.data?.pagination?.hasPreviousPage || false,
//     adminsError: ErrorHandler(error),
//     refetchAdmins: refetch,
//     pageNumber,
//     pageSize,
//     setPageNumber,
//     setPageSize,
//     setFilter
//   };
// };

// export const useDeleteAdmin = (onSuccess) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [data, setData] = useState(null);

//   const deleteAdminPayload = async (adminId) => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await httpService.deleteData(routes.deleteAdmin(adminId));
//       setData(response.data);
//       if (onSuccess) onSuccess(response.data);
//       return response.data;
//     } catch (error) {
//       setError(error);
//       throw ErrorHandler(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return {
//     deleteAdminIsLoading: isLoading,
//     deleteAdminError: ErrorHandler(error),
//     deleteAdminData: data,
//     deleteAdminPayload,
//   };
// };


// export const useUpdateAdminRoles = (onSuccess) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [data, setData] = useState(null);

//   const updateRolesPayload = async (adminId, roleNames) => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await httpService.putData(
//         { roleNames },
//         routes.updateAdminRoles(adminId)
//       );
//       setData(response.data);
//       if (onSuccess) {
//         onSuccess(response.data);
//       }
//       return response.data;
//     } catch (err) {
//       const handledError = ErrorHandler(err);
//       setError(handledError);
//       return Promise.reject(handledError);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return {
//     updateRolesIsLoading: isLoading,
//     updateRolesError: error,
//     updateRolesData: data,
//     updateRolesPayload,
//   };
// };

"use client"
import { routes } from "../api-routes";
import { ErrorHandler } from "../errorHandler";
import useFetchItem from "../useFetchItem";
import httpService from "../httpService";
import useMutateItem from "../useMutateItem";
import { useState, useEffect } from "react";



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

export const useGetAdminRoles = ({ enabled = true }) => {
  const { 
    isLoading, 
    error, 
    data, 
    refetch, 
    isFetching 
  } = useFetchItem({
    queryKey: ["admin-roles"],
    queryFn: () => {
      return httpService.getData(routes.adminRoles());
    },
    enabled,
    retry: 2
  });

  return {
    isFetchingRoles: isFetching,
    isRolesLoading: isLoading,
    rolesData: data?.data || [],
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
    permissionsData: data?.data || [],
    permissionsError: ErrorHandler(error),
    refetchPermissions: refetch
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

// export const useInviteAdmin = (onSuccess) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [data, setData] = useState(null);

//   const inviteAdminPayload = async (payload) => {
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const response = await httpService.postData(payload, routes.inviteAdmin());
//       setData(response.data);
//       if (onSuccess) onSuccess(response.data);
//       return response.data;
//     } catch (error) {
//       setError(error);
//       return error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return {
//     inviteAdminIsLoading: isLoading,
//     inviteAdminError: ErrorHandler(error),
//     inviteAdminData: data,
//     inviteAdminPayload
//   };
// };

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


// working without profile

export function useRegisterAdmin({ onSuccess } = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  /**
   * Sends registration payload to backend
   * @param {Object} payload - form + invitation params
   * @returns {Promise<Object>} - server response data
   */
  const registerAdminPayload = async (payload) => {
    const {
      email,
      userId,
      expires,
      signature,
      firstName,
      lastName,
      username,
      phone,
      gender,
      role,
      password,
    } = payload;

    // Client-side validation
    if (
      !email || !userId || !expires || !signature ||
      !firstName || !lastName || !username || !phone ||
      !gender || !role || !password
    ) {
      setError('All fields and invitation parameters are required.');
      return;
    }

    setLoading(true);
    setError(null);

    // Build signed-url query string
    const query = new URLSearchParams({ email, userId, expires, signature }).toString();
    // HttpService expects a URL path without base
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

      // Assuming response shape: { success: boolean, message: string, data: {...} }
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
      const response = await httpService.postData(payload, routes.registerAdmin());
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
    registerAdmin,
    isLoading,
    error: ErrorHandler(error),
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
    adminsData: data?.data?.data || [],
    totalAdmins: data?.data?.pagination?.total || 0,
    totalPages: data?.data?.pagination?.totalPages || 0,
    currentPage: data?.data?.pagination?.currentPage || 1,
    itemsPerPage: data?.data?.pagination?.itemsPerPage || 10,
    hasNextPage: data?.data?.pagination?.hasNextPage || false,
    hasPreviousPage: data?.data?.pagination?.hasPreviousPage || false,
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


export const useUpdateAdminRoles = (onSuccess) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const updateRolesPayload = async (adminId, roleNames) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await httpService.putData(
        { roleNames },
        routes.updateAdminRoles(adminId)
      );
      setData(response.data);
      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (err) {
      const handledError = ErrorHandler(err);
      setError(handledError);
      return Promise.reject(handledError);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateRolesIsLoading: isLoading,
    updateRolesError: error,
    updateRolesData: data,
    updateRolesPayload,
  };
};

// export const useCreateAdminRole = (onSuccess) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [data, setData] = useState(null);

//   /**
//    * @param {object} roleData - The data for the new role.
//    * @param {string} roleData.name - The name of the role.
//    * @param {string} roleData.description - The description of the role.
//    * @param {number[]} roleData.permissionIds - An array of permission IDs to assign.
//    */
//   const createRolePayload = async (roleData) => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await httpService.postData(
//         roleData,
//         routes.createAdminRole()
//       );
      
//       setData(response.data);
//       if (onSuccess) {
//         onSuccess(response.data);
//       }
//       return response.data;
//     } catch (err) {
//       const handledError = ErrorHandler(err);
//       setError(handledError);
//       // It's often better to let the calling component handle the error toast
//       return Promise.reject(handledError);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return {
//     createRoleIsLoading: isLoading,
//     createRoleError: error,
//     createRoleData: data,
//     createRolePayload,
//   };
// };

export const useCreateAdminRole = (handleSuccess) => {
  const { data, error, isPending, mutateAsync } = useMutateItem({
    mutationFn: (payload) =>
      httpService.postData(payload, routes.createAdminRole()),

    queryKeys: ["create-admin-role"],

    onSuccess: (response) => {
      const resData = response?.data || {};
      if (handleSuccess) handleSuccess(resData);
      showSuccessAlert(resData?.message || "Role created successfully");
    },

    onError: (err) => {
      const errorMessage = err?.response?.data?.error || "Failed to create role";
      showErrorAlert(errorMessage);
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
