// services/manufacturers/index.js
"use client";

import { showErrorAlert } from "@/lib/utils";
import { routes } from "../api-routes";
import { ErrorHandler } from "../errorHandler";
import httpService from "../httpService";
import useFetchItem from "../useFetchItem";
import useMutateItem from "../useMutateItem";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// =================== GET MANUFACTURERS ===================
export const useGetManufacturers = () => {
  const { isLoading, error, data, refetch, setFilter } = useFetchItem({
    queryKey: ["fetchManufacturers"],
    queryFn: (queryParams) =>
      httpService.getData(routes.manufacturers(queryParams)),
    retry: 2,
  });

  console.log('🔍 useGetManufacturers - Raw data:', data);

  // Process data with multiple fallbacks
  let processedData = [];
  let paginationData = null;

  if (data) {
    if (Array.isArray(data)) {
      processedData = data;
    } else if (data.data && Array.isArray(data.data)) {
      processedData = data.data;
      paginationData = data.pagination || data.meta;
    } else if (data.result && Array.isArray(data.result)) {
      processedData = data.result;
      paginationData = data.pagination || data.meta;
    } else if (data.manufacturers && Array.isArray(data.manufacturers)) {
      processedData = data.manufacturers;
      paginationData = data.pagination || data.meta;
    } else if (data.items && Array.isArray(data.items)) {
      processedData = data.items;
      paginationData = data.pagination || data.meta;
    } else if (data.data) {
      processedData = Array.isArray(data.data) ? data.data : [];
      paginationData = data.pagination || data.meta;
    } else {
      console.warn('🚨 Unknown data structure for manufacturers:', data);
      processedData = [];
    }
  }

  console.log('🔍 useGetManufacturers - Processed data:', processedData);
  console.log('🔍 useGetManufacturers - Pagination data:', paginationData);

  return {
    getManufacturersIsLoading: isLoading,
    getManufacturersData: {
      data: processedData,
      pagination: paginationData
    },
    getManufacturersError: ErrorHandler(error),
    refetchManufacturers: refetch,
    setManufacturersFilter: setFilter,
  };
};

// =================== GET MANUFACTURER INFO ===================
export const useGetManufacturerInfo = () => {
  const { isLoading, error, data, refetch, setFilter } = useFetchItem({
    queryKey: ["fetchManufacturerInfo"],
    queryFn: (id) => httpService.getData(routes.getSingleManufacturer(id)),
    retry: 2,
  });

  return {
    getManufacturerInfoIsLoading: isLoading,
    getManufacturerInfoData: data?.data || {},
    getManufacturerInfoError: ErrorHandler(error),
    refetchManufacturerInfo: refetch,
    setManufacturerInfoFilter: setFilter,
  };
};

// =================== GET MANUFACTURER PRODUCTS - FIXED ===================
export const useGetManufacturerProducts = () => {
  const { isLoading, error, data, refetch, setFilter } = useFetchItem({
    queryKey: ["fetchManufacturerProducts"],
    queryFn: ({ manufacturerId, data: queryParams }) => {
      console.log('🚀 useGetManufacturerProducts API call:', {
        manufacturerId,
        queryParams,
        hasRouteFunction: typeof routes.getProductsByManufacturer === 'function'
      });
      
      if (typeof routes.getProductsByManufacturer !== 'function') {
        console.error('❌ routes.getProductsByManufacturer is not a function');
        throw new Error('Route function not found');
      }
      
      const endpoint = routes.getProductsByManufacturer(manufacturerId, queryParams || {});
      console.log('📡 Calling endpoint:', endpoint);
      
      return httpService.getData(endpoint);
    },
    retry: 2,
  });

  console.log('🔍 useGetManufacturerProducts - Raw data:', data);

  // Process the data
  let processedData = [];
  let paginationData = null;

  if (data) {
    if (Array.isArray(data)) {
      processedData = data;
    } else if (data.data && Array.isArray(data.data)) {
      processedData = data.data;
      paginationData = data.pagination || data.meta;
    } else if (data.products && Array.isArray(data.products)) {
      processedData = data.products;
      paginationData = data.pagination || data.meta;
    } else {
      console.warn('🚨 Unexpected data structure:', data);
      processedData = [];
    }
  }

  console.log('🔍 useGetManufacturerProducts - Processed data:', processedData.length, 'items');

  return {
    getManufacturerProductsIsLoading: isLoading,
    getManufacturerProductsData: {
      data: processedData,
      pagination: paginationData
    },
    getManufacturerProductsError: ErrorHandler(error),
    refetchManufacturerProducts: refetch,
    setManufacturerProductsFilter: setFilter,
  };
};

// =================== DELETE MANUFACTURER PRODUCT ===================
export const useDeleteManufacturerProduct = (handleSuccess) => {
  const queryClient = useQueryClient();
  
  const { data, error, isPending, mutateAsync } = useMutateItem({
    mutationFn: (productId) =>
      httpService.deleteData(routes.deleteProduct(productId)),
    onSuccess: (requestParams) => {
      const resData = requestParams?.data || {};
      console.log(requestParams);
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["fetchManufacturerProducts"] });
      queryClient.invalidateQueries({ queryKey: ["fetchProducts"] });
      
      toast.success(resData?.message || "Product deleted successfully!");
      handleSuccess(resData);
    },
    onError: (error) => {
      const errorMessage = ErrorHandler(error);
      toast.error(errorMessage);
      showErrorAlert(errorMessage);
    },
  });

  return {
    deleteProductData: data,
    deleteProductDataError: ErrorHandler(error),
    deleteProductIsLoading: isPending,
    deleteProductPayload: (requestPayload) => mutateAsync(requestPayload),
  };
};

// =================== UPDATE MANUFACTURER STATUS ===================
export const useUpdateManufacturerStatus = (handleSuccess) => {
  const queryClient = useQueryClient();
  
  const { data, error, isPending, mutateAsync } = useMutateItem({
    mutationFn: ({ payload, id }) =>
      httpService.patchData(payload, routes.updateManufacturerStatus(id)),
    onSuccess: (requestParams, variables) => {
      const resData = requestParams?.data || {};
      const manufacturerId = variables?.id; // ✅ Get the id from the mutation variables
      
      console.log('✅ Status update successful:', { requestParams, variables, manufacturerId });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["fetchManufacturers"] });
      
      // ✅ FIXED: Use manufacturerId from variables instead of undefined 'id'
      if (manufacturerId) {
        queryClient.invalidateQueries({ queryKey: ["fetchManufacturerInfo", manufacturerId] });
      }
      
      toast.success(resData?.message || "Manufacturer status updated successfully!");
      
      // Call the provided success handler
      if (handleSuccess) {
        handleSuccess(resData);
      }
    },
    onError: (error) => {
      const errorMessage = ErrorHandler(error);
      console.error('❌ Status update failed:', error);
      toast.error(errorMessage);
    },
  });

  return {
    updateManufacturerStatusData: data,
    updateManufacturerStatusError: ErrorHandler(error),
    updateManufacturerStatusIsLoading: isPending,
    updateManufacturerStatusPayload: (requestPayload) => mutateAsync(requestPayload),
  };
};

// =================== DELETE MANUFACTURER ===================
export const useDeleteManufacturer = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const queryClient = useQueryClient();

  const deleteManufacturer = async (manufacturerId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await httpService.deleteData(routes.deleteManufacturer(manufacturerId));
      
      setData(response);
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["fetchManufacturers"] });
      
      toast.success(response?.message || "Manufacturer deleted successfully!");
      
      if (onSuccess) {
        onSuccess();
      }
      
      return response;
    } catch (error) {
      let errorMessage = 'Failed to delete manufacturer';
      
      if (error.response?.status === 400) {
        errorMessage = error.response.data.error || errorMessage;
        if (error.response.data.receivedValue) {
          errorMessage += ` (Received: ${error.response.data.receivedValue})`;
        }
      }
      
      toast.error(errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteManufacturer, isLoading, error };
};

// =================== UPDATE MANUFACTURER ===================
export const useUpdateManufacturer = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync,
    isPending: updateManufacturerIsLoading,
    error,
  } = useMutation({
    mutationFn: async (params) => {
      console.log('🚀 Updating manufacturer:', params);
      
      let logoUrl = params.payload.logo;

      // ✅ FIXED: Handle new file upload using httpService
      if (params.payload.logo instanceof File) {
        console.log('📤 Uploading new logo file...');
        
        try {
          const formData = new FormData();
          formData.append("images", params.payload.logo);
          formData.append("folder", "manufacturers");

          // ✅ Use httpService for file upload instead of fetch
          const uploadResponse = await httpService.postData(formData, routes.upload());
          logoUrl = uploadResponse.urls?.[0] || uploadResponse.url;
          
          if (!logoUrl) {
            throw new Error("No URL returned from upload service");
          }
          
          console.log('✅ Logo uploaded to:', logoUrl);
        } catch (uploadError) {
          console.error("Logo upload failed:", uploadError);
          throw new Error("Logo upload failed. Please try again.");
        }
      }

      // ✅ Update manufacturer with logo URL
      const updatePayload = {
        name: params.payload.name,
        contactPerson: params.payload.contactPerson,
        email: params.payload.email,
        phone: params.payload.phone || undefined,
        country: params.payload.country,
        logo: logoUrl,
      };

      console.log('📤 Updating manufacturer with payload:', updatePayload);
      const response = await httpService.updateData(updatePayload, routes.updateManufacturer(params.id));
      return response;
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["fetchManufacturers"] });
      queryClient.invalidateQueries({ queryKey: ["fetchManufacturerInfo", variables.id] });
      
      toast.success(response?.message || "Manufacturer updated successfully!");
      
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error) => {
      console.error("Update Manufacturer Error:", error);
      const errorMessage = error?.response?.data?.error || error.message || "An unexpected error occurred.";
      toast.error(errorMessage);
    },
  });

  return {
    updateManufacturerPayload: mutateAsync,
    updateManufacturerIsLoading,
    updateManufacturerError: ErrorHandler(error),
  };
};

// =================== CREATE MANUFACTURER ===================
export const useCreateManufacturer = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync,
    isPending: createManufacturerIsLoading,
    error,
  } = useMutation({
    mutationFn: async (payload) => {
      console.log('🚀 Creating manufacturer:', payload);
      
      let manufacturerPayload;
      
      if (payload.logo instanceof File) {
        console.log('📤 Uploading logo file:', {
          name: payload.logo.name,
          size: payload.logo.size,
          type: payload.logo.type
        });
        
        try {
          const formData = new FormData();
          formData.append("images", payload.logo); // Backend expects 'images' field
          formData.append("folder", "manufacturers");

          console.log('📤 FormData created with:');
          for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value instanceof File ? 
              { name: value.name, size: value.size, type: value.type } : value
            );
          }

          console.log('📡 Calling upload endpoint:', routes.upload());
          
          // ✅ FIXED: Use the exact same pattern as products
          const uploadResponse = await httpService.postData(formData, routes.upload());
          console.log('📥 Upload response received:', uploadResponse);
          
          // ✅ FIXED: Handle response format exactly like products do
          let logoUrl;
          if (uploadResponse.urls && Array.isArray(uploadResponse.urls) && uploadResponse.urls.length > 0) {
            logoUrl = uploadResponse.urls[0]; // First URL from array
          } else if (uploadResponse.url) {
            logoUrl = uploadResponse.url; // Single URL
          } else {
            console.error('❌ Unexpected upload response format:', uploadResponse);
            // Log the exact structure to help debug
            console.error('Response keys:', Object.keys(uploadResponse));
            console.error('Response type:', typeof uploadResponse);
            throw new Error(`No URL found in upload response. Got: ${JSON.stringify(uploadResponse)}`);
          }
          
          if (!logoUrl || typeof logoUrl !== 'string') {
            throw new Error(`Invalid URL received: ${logoUrl}`);
          }
          
          console.log('✅ Logo uploaded successfully to:', logoUrl);
          
          manufacturerPayload = {
            name: payload.name,
            contactPerson: payload.contactPerson,
            email: payload.email,
            country: payload.country,
            logo: logoUrl,
            phone: payload.phone || undefined,
          };
          
        } catch (uploadError) {
          console.error("📤 Logo upload failed:", {
            error: uploadError,
            message: uploadError.message,
            status: uploadError.response?.status,
            statusText: uploadError.response?.statusText,
            responseData: uploadError.response?.data
          });
          
          // ✅ FIXED: Better error handling
          if (uploadError.response?.status === 400) {
            const errorData = uploadError.response.data;
            throw new Error(errorData?.message || errorData?.error || "Invalid file upload request");
          } else if (uploadError.response?.status === 413) {
            throw new Error("File is too large. Please choose a smaller image.");
          } else if (uploadError.response?.status === 415) {
            throw new Error("Unsupported file type. Please use JPG, PNG, or WebP.");
          } else if (uploadError.response?.status === 401) {
            throw new Error("Authentication failed. Please log in again.");
          } else {
            throw new Error(uploadError.message || "Logo upload failed. Please try again.");
          }
        }
      } else {
        // No file to upload
        manufacturerPayload = {
          name: payload.name,
          contactPerson: payload.contactPerson,
          email: payload.email,
          country: payload.country,
          logo: payload.logo || "https://via.placeholder.com/200x120?text=Logo",
          phone: payload.phone || undefined,
        };
      }

      console.log('📤 Creating manufacturer with final payload:', manufacturerPayload);
      
      const response = await httpService.postData(manufacturerPayload, routes.createManufacturer());
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["fetchManufacturers"] });
      toast.success(response?.message || "Manufacturer created successfully!");
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error) => {
      console.error("Create manufacturer error:", error);
      const errorMessage = error.message || ErrorHandler(error) || "Creation failed. Please try again.";
      toast.error(errorMessage);
    },
  });

  return {
    createManufacturerPayload: mutateAsync,
    createManufacturerIsLoading,
    createManufacturerError: ErrorHandler(error),
  };
};

// =================== GET MANUFACTURER ANALYTICS ===================
export const useGetManufacturerAnalytics = (filters = {}) => {
  const { timeframe = '30d', enabled = true } = filters;
  
  const { data, isLoading, error, refetch } = useFetchItem({
    queryKey: ['manufacturerAnalytics', { timeframe }],
    queryFn: () => httpService.getData(routes.getManufacturerReports({ timeframe })),
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: 2
  });

  return {
    manufacturerAnalytics: data?.data || {},
    isManufacturerAnalyticsLoading: isLoading,
    manufacturerAnalyticsError: ErrorHandler(error),
    refetchManufacturerAnalytics: refetch
  };
};

// =================== EXPORT MANUFACTURER REPORT ===================
export const useExportManufacturerReport = () => {
  return useMutation({
    mutationFn: async ({ manufacturerId, filters = {} }) => {
      const response = await httpService.getData(routes.exportManufacturerReport(manufacturerId, {
        ...filters,
        export: true
      }));
      
      return response;
    },
    onSuccess: (response, variables) => {
      // Handle CSV/Excel download
      const exportData = response?.csvData || response?.data;
      if (exportData) {
        const blob = new Blob([exportData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `manufacturer-${variables.manufacturerId}-report-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        toast.success('Manufacturer report exported successfully');
      }
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to export manufacturer report';
      toast.error(errorMessage);
    }
  });
};

// =================== BULK ASSIGN MANUFACTURER ===================
export const useBulkAssignManufacturer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productIds, manufacturerId }) => {
      return httpService.postData({
        productIds,
        manufacturerId
      }, routes.bulkAssignManufacturer());
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["fetchProducts"] });
      queryClient.invalidateQueries({ queryKey: ["fetchManufacturers"] });
      queryClient.invalidateQueries({ queryKey: ["fetchManufacturerProducts"] });
      
      toast.success(response?.message || 'Products assigned to manufacturer successfully');
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to assign products to manufacturer';
      toast.error(errorMessage);
    }
  });
};

// =================== MANUFACTURER SEARCH ===================
export const useSearchManufacturers = () => {
  const { data, isLoading, error, refetch, setFilter } = useFetchItem({
    queryKey: ["searchManufacturers"],
    queryFn: (searchParams) => {
      return httpService.getData(routes.manufacturers({
        ...searchParams,
        search: searchParams.query
      }));
    },
    enabled: false, // Only search when explicitly triggered
    retry: 2
  });

  const searchManufacturers = (query) => {
    setFilter({ query });
  };

  return {
    searchResults: data?.data || [],
    isSearching: isLoading,
    searchError: ErrorHandler(error),
    searchManufacturers,
    refetchSearch: refetch
  };
};

// =================== TOGGLE MANUFACTURER STATUS ===================
export const useToggleManufacturerStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ manufacturerId, isActive }) => {
      return httpService.patchData({
        isActive
      }, routes.updateManufacturerStatus(manufacturerId));
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["fetchManufacturers"] });
      queryClient.invalidateQueries({ queryKey: ["fetchManufacturerInfo", variables.manufacturerId] });
      
      const status = variables.isActive ? 'activated' : 'deactivated';
      toast.success(response?.message || `Manufacturer ${status} successfully`);
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to update manufacturer status';
      toast.error(errorMessage);
    }
  });
};