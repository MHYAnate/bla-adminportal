"use client"
import { routes } from "../api-routes";
import { ErrorHandler } from "../errorHandler";
import useFetchItem from "../useFetchItem";
import httpService from "../httpService";
import { useState } from "react";


export const useGetAdminInfo = (adminId) => {
  const [adminData, setAdminData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

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

export const useUpdateAdminRoles = (onSuccess) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const updateRolesPayload = async (adminId, roles) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await httpService.putData(
        { roleNames: roles }, 
        routes.updateAdminRoles(adminId)
      );
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
    updateRolesIsLoading: isLoading,
    updateRolesError: ErrorHandler(error),
    updateRolesData: data,
    updateRolesPayload
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
    deleteAdminPayload
  };
};
