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

export const useGetManufacturers = () => {
  const { isLoading, error, data, refetch, setFilter } = useFetchItem({
    queryKey: ["fetchManufacturers"],
    queryFn: (queryParams) =>
      httpService.getData(routes.manufacturers(queryParams)),
    retry: 2,
  });

  return {
    getManufacturersIsLoading: isLoading,
    getManufacturersData: data?.data || [],
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

  return {
    getManufacturerProductsIsLoading: isLoading,
    getManufacturerProductsData: data?.data || [],
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

// Create manufacturer
export const useCreateManufacturer = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync,
    isPending: createManufacturerIsLoading,
    error,
  } = useMutation({
    mutationFn: (payload) =>
      apiClient.post(routes.createManufacturer(), payload),

    onSuccess: (response) => {
      // Invalidate and refetch the manufacturers list to show the new entry
      queryClient.invalidateQueries({ queryKey: ["fetchManufacturers"] });
      
      toast.success(response?.data?.message || "Manufacturer created successfully!");
      
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error) => {
      // The error message is handled globally by the component's try-catch block
      // but you can still toast a generic error here if you want.
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

// Update manufacturer
export const useUpdateManufacturer = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  const {
      mutateAsync,
      isPending: updateManufacturerIsLoading,
      error,
  } = useMutation({
      mutationFn: async (params) => {
          const { data } = await apiClient.patch(routes.updateManufacturer(params.id), params.payload);
          return data;
      },
      onSuccess: (response, variables) => {
          queryClient.invalidateQueries({ queryKey: ["fetchManufacturers"] });
          queryClient.invalidateQueries({ queryKey: ["fetchManufacturerInfo", variables.id] });
          toast.success(response?.message || "Manufacturer updated successfully!");
          if (onSuccessCallback) onSuccessCallback();
      },
      onError: (error) => {
          console.error("Update Mutation Error:", error);
          const errorMessage = error?.response?.data?.error || error.message || "An unexpected error occurred.";
          toast.error(errorMessage);
      },
  });

  return {
      updateManufacturerPayload: mutateAsync, // This now expects { id, payload }
      updateManufacturerIsLoading,
      updateManufacturerError: ErrorHandler(error),
  };
};