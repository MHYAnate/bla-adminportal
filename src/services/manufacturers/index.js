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
import { apiClient } from "@/services/api/client";
import { getAuthToken } from "@/lib/auth";

export const useGetManufacturers = () => {
  const { isLoading, error, data, refetch, setFilter } = useFetchItem({
    queryKey: ["fetchManufacturers"],
    queryFn: (queryParams) =>
      httpService.getData(routes.manufacturers(queryParams)),
    retry: 2,
  });

  // Debug logging to see what data structure we're getting
  console.log('🔍 useGetManufacturers - Raw data:', data);
  console.log('🔍 useGetManufacturers - data.data:', data?.data);
  console.log('🔍 useGetManufacturers - data type:', typeof data);
  console.log('🔍 useGetManufacturers - is data array:', Array.isArray(data));

  // Try different possible data structures
  let processedData = [];
  let paginationData = null;

  if (data) {
    // Check if data is directly an array
    if (Array.isArray(data)) {
      processedData = data;
    }
    // Check if data has a 'data' property that's an array
    else if (data.data && Array.isArray(data.data)) {
      processedData = data.data;
      paginationData = data.pagination || data.meta;
    }
    // Check if data has other common property names
    else if (data.result && Array.isArray(data.result)) {
      processedData = data.result;
      paginationData = data.pagination || data.meta;
    }
    else if (data.manufacturers && Array.isArray(data.manufacturers)) {
      processedData = data.manufacturers;
      paginationData = data.pagination || data.meta;
    }
    else if (data.items && Array.isArray(data.items)) {
      processedData = data.items;
      paginationData = data.pagination || data.meta;
    }
    // If data is an object with pagination and data properties
    else if (data.data) {
      processedData = Array.isArray(data.data) ? data.data : [];
      paginationData = data.pagination || data.meta;
    }
    else {
      console.warn('🚨 Unknown data structure for manufacturers:', data);
      processedData = [];
    }
  }

  console.log('🔍 useGetManufacturers - Processed data:', processedData);
  console.log('🔍 useGetManufacturers - Processed data length:', processedData.length);
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

export const useGetManufacturerInfo = () => {
  const { isLoading, error, data, refetch, setFilter, filter } = useFetchItem({
    queryKey: ["fetchManufacturerInfo"],
    queryFn: (id) => httpService.getData(routes.getManufacturerInfo(id)),
    retry: 2,
  });

  return {
    getManufacturerInfoIsLoading: isLoading,
    getManufacturerInfoData: data?.data?.data || {},
    getManufacturerInfoError: ErrorHandler(error),
    refetchManufacturerInfo: refetch,
    setManufacturerInfoFilter: setFilter,
  };
};

export const useGetManufacturerProducts = () => {
  const { isLoading, error, data, refetch, setFilter } = useFetchItem({
    queryKey: ["fetchManufacturerProducts"],
    queryFn: ({ manufacturerId, data }) =>
      httpService.getData(
        routes.manufacturerProducts({ manufacturerId, data })
      ),
    retry: 2,
  });

  // Debug logging to see what data structure we're getting
  console.log('🔍 useGetManufacturerProducts - Raw data:', data);
  console.log('🔍 useGetManufacturerProducts - data.data:', data?.data);
  console.log('🔍 useGetManufacturerProducts - data type:', typeof data);
  console.log('🔍 useGetManufacturerProducts - is data array:', Array.isArray(data));

  // Process data using the same logic as useGetManufacturers
  let processedData = [];
  let paginationData = null;

  if (data) {
    // Check if data is directly an array
    if (Array.isArray(data)) {
      processedData = data;
    }
    // Check if data has a 'data' property that's an array
    else if (data.data && Array.isArray(data.data)) {
      processedData = data.data;
      paginationData = data.pagination || data.meta;
    }
    // Check if data has other common property names
    else if (data.result && Array.isArray(data.result)) {
      processedData = data.result;
      paginationData = data.pagination || data.meta;
    }
    else if (data.products && Array.isArray(data.products)) {
      processedData = data.products;
      paginationData = data.pagination || data.meta;
    }
    else if (data.items && Array.isArray(data.items)) {
      processedData = data.items;
      paginationData = data.pagination || data.meta;
    }
    // If data is an object with pagination and data properties
    else if (data.data) {
      processedData = Array.isArray(data.data) ? data.data : [];
      paginationData = data.pagination || data.meta;
    }
    else {
      console.warn('🚨 Unknown data structure for manufacturer products:', data);
      processedData = [];
    }
  }

  console.log('🔍 useGetManufacturerProducts - Processed data:', processedData);
  console.log('🔍 useGetManufacturerProducts - Processed data length:', processedData.length);
  console.log('🔍 useGetManufacturerProducts - Pagination data:', paginationData);

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

export const useDeleteManufacturerProduct = (handleSuccess) => {
  const { data, error, isPending, mutateAsync } = useMutateItem({
    mutationFn: (id) =>
      httpService.deleteData(routes.deleteManufacturerProduct(id)),
    onSuccess: (requestParams) => {
      const resData = requestParams?.data?.result || {};
      console.log(requestParams);
      handleSuccess(resData);
    },
    onError: (error) => {
      showErrorAlert("An error occured");
    },
  });

  return {
    deleteProductData: data,
    deleteProductDataError: ErrorHandler(error),
    deleteProductIsLoading: isPending,
    deleteProductPayload: (requestPayload) => mutateAsync(requestPayload),
  };
};

export const useUpdateManufacturerStatus = (handleSuccess) => {
  const { data, error, isPending, mutateAsync } = useMutateItem({
    mutationFn: ({ payload, id }) =>
      httpService.patchData(payload, routes.updateManufacturerStatus(id)),
    onSuccess: (requestParams) => {
      const resData = requestParams?.data?.result || {};
      console.log(requestParams);
      handleSuccess(resData);
    },
    onError: (error) => {
      showErrorAlert("An error occured");
    },
  });

  return {
    updateManufacturerStatusData: data,
    updateManufacturerStatusError: ErrorHandler(error),
    updateManufacturerStatusIsLoading: isPending,
    updateManufacturerStatusPayload: ({ payload, id }) =>
      mutateAsync({ payload, id }),
  };
};

export const useDeleteManufacturer = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const deleteManufacturer = async (manufacturerId) => {
    // Ensure ID is stringified if it's a number
    const idToSend = typeof manufacturerId === 'number' 
      ? manufacturerId.toString()
      : manufacturerId;

    setIsLoading(true);
    setError(null);

    try {
      const response = await httpService.deleteData(
        `admin/manufacturers/${manufacturerId}`
      );
      
      setData(response.data);
      
      if (onSuccess) {
        onSuccess();
      }
      
      return response.data;
    } catch (error) {
      // Enhanced error parsing
      let errorMessage = 'Failed to delete manufacturer';
      toast.error(errorMessage);
      
      if (error.response?.status === 400) {
        errorMessage = error.response.data.error || errorMessage;
        if (error.response.data.receivedValue) {
          errorMessage += ` (Received: ${error.response.data.receivedValue})`;
        }
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteManufacturer, isLoading, error };
};

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

      // ✅ Handle new file upload (if logo is a File)
      if (params.payload.logo instanceof File) {
        console.log('📤 Uploading new logo file...');
        
        try {
          const formData = new FormData();
          formData.append("images", params.payload.logo);
          formData.append("folder", "manufacturers");

          // Use fetch to bypass apiClient auth issues
          const uploadResponse = await fetch('https://buylocalapi-staging.up.railway.app/api/upload', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${getAuthToken()}`
            },
            body: formData
          });

          if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json();
            logoUrl = uploadData.urls?.[0] || uploadData.url;
            
            if (!logoUrl) {
              throw new Error("No URL returned from upload service");
            }
            
            console.log('✅ Logo uploaded to:', logoUrl);
          } else {
            const errorData = await uploadResponse.json();
            console.error('Upload failed:', errorData);
            throw new Error("Logo upload failed. Please try again.");
          }
        } catch (uploadError) {
          console.error("Logo upload failed:", uploadError);
          throw new Error("Logo upload failed. Please try again.");
        }
      }
      // If logo is already a string URL, use it as-is

      // ✅ Update manufacturer with logo URL
      const updatePayload = {
        name: params.payload.name,
        contactPerson: params.payload.contactPerson,
        email: params.payload.email,
        phone: params.payload.phone || undefined,
        country: params.payload.country,
        logo: logoUrl, // Use uploaded URL or existing URL
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

export const useCreateManufacturer = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync,
    isPending: createManufacturerIsLoading,
    error,
  } = useMutation({
    mutationFn: async (payload) => {
      console.log('🚀 Creating manufacturer:', payload);
      
      // ✅ Skip file upload entirely - create manufacturer first
      let manufacturerPayload;
      
      if (payload.logo instanceof File) {
        // Create manufacturer with placeholder logo first
        manufacturerPayload = {
          name: payload.name,
          contactPerson: payload.contactPerson,
          email: payload.email,
          country: payload.country,
          logo: "https://via.placeholder.com/200x120?text=Logo", // Placeholder
          phone: payload.phone || undefined,
        };
      } else {
        // Logo is already a URL string
        manufacturerPayload = {
          name: payload.name,
          contactPerson: payload.contactPerson,
          email: payload.email,
          country: payload.country,
          logo: payload.logo,
          phone: payload.phone || undefined,
        };
      }

      console.log('📤 Creating manufacturer with payload:', manufacturerPayload);
      
      // Create the manufacturer first
      const response = await httpService.postData(manufacturerPayload, routes.createManufacturer());
      
      // ✅ If we have a file, upload it and update the manufacturer
      if (payload.logo instanceof File && response?.data?.id) {
        console.log('📤 Now uploading logo and updating manufacturer...');
        
        try {
          const formData = new FormData();
          formData.append("images", payload.logo);
          formData.append("folder", "manufacturers");

          // Try upload with fetch (bypassing apiClient auth issues)
          const uploadResponse = await fetch('https://buylocalapi-staging.up.railway.app/api/upload', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${getAuthToken()}` // Make sure this import exists
            },
            body: formData
          });

          if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json();
            const logoUrl = uploadData.urls?.[0] || uploadData.url;
            
            if (logoUrl) {
              // Update manufacturer with actual logo
              await httpService.updateData(
                { logo: logoUrl }, 
                routes.updateManufacturer(response.data.id)
              );
              console.log('✅ Logo uploaded and manufacturer updated');
            }
          } else {
            console.warn('⚠️ Logo upload failed, but manufacturer created successfully');
          }
        } catch (uploadError) {
          console.warn('⚠️ Logo upload failed, but manufacturer created:', uploadError);
          // Don't throw error - manufacturer was created successfully
        }
      }

      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["fetchManufacturers"] });
      toast.success(response?.message || "Manufacturer created successfully!");
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error) => {
      console.error("Create manufacturer error:", error);
      const errorMessage = ErrorHandler(error) || "Creation failed. Please try again.";
      toast.error(errorMessage);
    },
  });

  return {
    createManufacturerPayload: mutateAsync,
    createManufacturerIsLoading,
    createManufacturerError: ErrorHandler(error),
  };
};