"use client"
import { showErrorAlert } from "@/lib/utils";
import { routes } from "../api-routes";
import { ErrorHandler } from "../errorHandler";
import httpService from "../httpService";
import useFetchItem from "../useFetchItem";
import useMutateItem from "../useMutateItem";
import { useState } from "react";
import apiClient from "./apiclient";

export const useGetManufacturers = () => {
  const { isLoading, error, data, refetch, setFilter } = useFetchItem({
    queryKey: ["fetchManufacturers"],
    queryFn: (queryParams) =>
      httpService.getData(routes.manufacturers(queryParams)),
    // enabled,
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
    queryKey: ["fetchProducts"],
    queryFn: ({ manufacturerId, data }) =>
      httpService.getData(
        routes.manufacturerProducts({ manufacturerId, data })
      ),
    // enabled,
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
        showSuccessAlert(resData);
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
      //   showSuccessAlert(resData);
    },
    onError: (error) => {
      showErrorAlert("An error occured");
    },
  });

;

  return {
    updateManufacturerStatusData: data,
    updateManufacturerStatusError: ErrorHandler(error),
    updateManufacturerStatusIsLoading: isPending,
    updateManufacturerStatusPayload: ({ payload, id }) =>
      mutateAsync({ payload, id }),
  };
};
import { useMutation } from "@tanstack/react-query";


import { toast } from "sonner";

export const useDeleteManufacturer = (onSuccess) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const deleteManufacturer = async (manufacturerId) => {
    // Ensure ID is stringified if it's a number
    const idToSend = typeof manufacturerId === 'number' 
      ? manufacturerId.toString()
      : manufacturerId;

    try {
      const response = await httpService.deleteData(
        `admin/manufacturers/${manufacturerId}`
      );
      // ... rest of success handling
      console.log(manufacturerId, "manufacId")
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

// "use client";

import { useQueryClient } from "@tanstack/react-query";
// import { toast } from "sonner";
// import apiClient from "./apiclient"; // Your configured Axios instance
// import { routes } from "../api-routes";
// import { ErrorHandler } from "../errorHandler"; // Your custom error handler

// Define the shape of the data your API expects

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

// export const useCreateManufacturer = (handleSuccess) => {
//   const { mutateAsync, isPending, error, data } = useMutation({
//     /**
//      * The mutation function now uses the apiClient.
//      * The interceptor will automatically add the Authorization header.
//      * The browser will correctly set the 'Content-Type' for FormData.
//      */
//     mutationFn: (payload) =>
//       apiClient.post(routes.createManufacturer(), payload),

//     onSuccess: (response) => {
//       const resData = response?.data || {};
//       if (handleSuccess) {
//         handleSuccess(resData);
//       }
//     },
//     onError: (error) => {
//       const errorMessage =
//         error?.response?.data?.error ||
//         "An error occurred while creating the manufacturer.";
//       toast.error(errorMessage);
//     },
//   });

//   return {
//     createManufacturerPayload: (requestPayload) => mutateAsync(requestPayload),
//     createManufacturerIsLoading: isPending,
//     createManufacturerError: error, // Consider using an ErrorHandler here
//     createManufacturerData: data,
//   };
// };

export const useCreateManufacturer1 = (handleSuccess) => {
  const { data, error, isPending, mutateAsync } = useMutateItem({
    /**
     * The mutation function posts FormData.
     * CRITICAL: Ensure your httpService.postData does NOT set a 'Content-Type' header
     * when the payload is FormData. The browser MUST set this header automatically
     * to include the multipart boundary. If you manually set 'Content-Type': 'application/json',
     * the file upload will fail and the backend will not see req.file.
     */
    mutationFn: (payload) =>
      httpService.postData(payload, routes.createManufacturer()),
    onSuccess: (response) => {
      const resData = response?.data || {};
      if (handleSuccess) {
        handleSuccess(resData);
      }
    },
    onError: (error) => {
      // Use a more specific error message from the backend if available
      const errorMessage = error?.response?.data?.error || "An error occurred while creating the manufacturer.";
      showErrorAlert(errorMessage);
    },
  });

  return {
    createManufacturerData: data,
    createManufacturerError: ErrorHandler(error),
    createManufacturerIsLoading: isPending,
    // This function will be called with the FormData object from the form.
    createManufacturerPayload: (requestPayload) => mutateAsync(requestPayload),
  };
};

// export const useUpdateManufacturer = (onSuccessCallback) => {
//   const queryClient = useQueryClient();

//   const {
//       mutateAsync,
//       isPending: updateManufacturerIsLoading,
//       error,
//   } = useMutation({
//       /**
//        * @param {object} params - The parameters for updating.
//        * @param {string | number} params.id - The ID of the manufacturer to update.
//        * @param {object} params.payload - The data to update.
//        */
//       mutationFn: async ({ id, payload }) => {
//           const { data } = await apiClient.patch(routes.deleteManufacturer(id), payload);
//           return data;
//       },
//       onSuccess: (response) => {
//           queryClient.invalidateQueries({ queryKey: ["fetchManufacturers"] });
//           queryClient.invalidateQueries({ queryKey: ["fetchManufacturerInfo", response?.data?.id] });
//           toast.success(response?.message || "Manufacturer updated successfully!");
//           if (onSuccessCallback) onSuccessCallback();
//       },
//       onError: (error) => {
//           console.error("Update Mutation Error:", error);
//       },
//   });

//   return {
//       updateManufacturerPayload: mutateAsync,
//       updateManufacturerIsLoading,
//       updateManufacturerError: ErrorHandler(error),
//   };
// };

// Updated useUpdateManufacturer hook
// export const useUpdateManufacturer = ({
//   onSuccessCallback,
//   queryClient
// }) => {
//   const {
//     mutateAsync,
//     isPending: updateManufacturerIsLoading,
//     error,
//   } = useMutation({
//     mutationFn: async ({ id, payload }) => {
//       // Use correct update route
//       const response = await apiClient.patch(
//         routes.updateManufacturer(id), 
//         payload
//       );
//       return response.data;
//     },
//     onSuccess: (data, variables) => {
//       queryClient.invalidateQueries({ queryKey: ["fetchManufacturers"] });
//       queryClient.invalidateQueries({ 
//         queryKey: ["fetchManufacturerInfo", variables.id] 
//       });
      
//       toast.success(data?.message || "Manufacturer updated successfully!");
      
//       if (onSuccessCallback) {
//         onSuccessCallback();
//       }
//     },
//     onError: (error) => {
//       console.error("Update Mutation Error:", error);
//       const errorMessage = error.response?.data?.error || 
//                           error.message || 
//                           "Failed to update manufacturer";
//       toast.error(errorMessage);
//     },
//   });

//   return {
//     updateManufacturerPayload: mutateAsync,
//     updateManufacturerIsLoading,
//     updateManufacturerError: error,
//   };
// };

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