import { showErrorAlert } from "@/lib/utils";
import { routes } from "../api-routes";
import { ErrorHandler } from "../errorHandler";
import httpService from "../httpService";
import useFetchItem from "../useFetchItem";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/app/(admin)/admin/manufacturers/apiClient";


export const useGetProducts = () => {
  const { isLoading, error, data, refetch, setFilter } = useFetchItem({
    queryKey: ["fetchProducts"],
    queryFn: (queryParams) => httpService.getData(routes.products(queryParams)),
    // enabled,
    retry: 2,
  });

  return {
    getPRoductsIsLoading: isLoading,
    getProductsData: data?.data || [],
    getProductsError: ErrorHandler(error),
    refetchProducts: refetch,
    setProductsFilter: setFilter,
  };
};

// export const useDeleteProduct = (handleSuccess) => {
//   const { data, error, isPending, mutateAsync } = useMutateItem({
//     mutationFn: (id) => httpService.deleteData(routes.deleteProducts(id)),
//     onSuccess: (requestParams) => {
//       const resData = requestParams?.data?.result || {};
//       console.log(requestParams);
//       handleSuccess(resData);
//       //   showSuccessAlert(resData);
//     },
//     onError: (error) => {
//       showErrorAlert("An error occured");
//     },
//   });

//   return {
//     deleteProductData: data,
//     deleteProductDataError: ErrorHandler(error),
//     deleteProductIsLoading: isPending,
//     deleteProductPayload: (requestPayload) => mutateAsync(requestPayload),
//   };
// };

// import { useMutation } from "@tanstack/react-query";

// export const useDeleteProduct = (onSuccessCallback) => {
//   const deleteProductMutation = useMutation({
//     mutationFn: async (id) => {
//       try {
//         const response = await httpService.deleteData(
//           routes.deleteProducts(id)
//         );
//         return response.data;
//       } catch (error) {
//         throw ErrorHandler(error);
//       }
//     },
//     onSuccess: () => {
//       showSuccessAlert("Product deleted successfully");
//       if (onSuccessCallback) onSuccessCallback();
//     },
//     onError: (error) => {
//       showErrorAlert(error.message || "Failed to delete product");
//     }
//   });

//   return {
//     deleteProduct: deleteProductMutation.mutate,
//     deleteProductIsLoading: deleteProductMutation.isPending,
//     deleteProductError: deleteProductMutation.error,
//     deleteProductData: deleteProductMutation.data,
//   };
// };
import { useState } from "react";

export const useDeleteProduct = (onSuccess) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const deleteProduct = async (productId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await httpService.deleteData(
        `admin/products/${productId}`
      );
      setData(response.data);
      if (onSuccess){ toast.error(response.message)}
      return response.data;
    } catch (error) {
      toast.error(error.message);
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteProduct,
    isLoading,
    error,
    data
  };
};

export const useCreateProduct = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: createProduct,
    isPending: isCreating,
    error,
  } = useMutation({
    mutationFn: (payload) =>
      apiClient.post(routes.createProduct(), payload),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["fetchProducts"] });
      toast.success(response?.data?.message || "Product created successfully!");
      if (onSuccessCallback) onSuccessCallback();
    },

    onError: (error) => {
      const errorMessage = ErrorHandler(error) || "Product creation failed.";
      toast.error(errorMessage);
    },
  });

  return {
    createProduct,
    isCreating,
    createProductError: ErrorHandler(error),
  };
};



// export const useGetAllCategories = () => {
//   const {
//     isLoading,
//     error,
//     data,
//     refetch,
//     setFilter
//   } = useFetchItem({
//     queryKey: ["fetchAllCategories"],
//     queryFn: (queryParams) => httpService.getData(routes.categories(queryParams)),
//     retry: 2,
//   });

//   return {
//     getAllCategoriesIsLoading: isLoading,
//     getAllCategoriesData: {
//       categories: data?.data?.categories || [],
//       pagination: data?.data?.pagination || {
//         total: 0,
//         page: 1,
//         limit: 10,
//         totalPages: 0
//       }
//     },
//     getAllCategoriesError: ErrorHandler(error),
//     refetchAllCategories: refetch,
//     setAllCategoriesFilter: setFilter,
//   };
// };

export const useGetAllCategories = () => {
  const {
    isLoading,
    error,
    data,
    refetch,
    setFilter
  } = useFetchItem({
    queryKey: ["fetchAllCategories"],
    queryFn: (queryParams) => httpService.getData(routes.categories(queryParams)),
    retry: 2,
  });

  const categories = data?.data?.categories ?? [];
  const pagination = data?.data?.pagination ?? {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  };

  return {
    getAllCategoriesIsLoading: isLoading,
    getAllCategoriesData: {
      categories,
      pagination,
    },
    getAllCategoriesError: ErrorHandler(error),
    refetchAllCategories: refetch,
    setAllCategoriesFilter: setFilter,
  };
};
