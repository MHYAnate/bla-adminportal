// services/products/index.js
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/services/api/client";
import { routes } from "@/services/api-routes";
import { ErrorHandler } from "@/services/errorHandler";
import useFetchItem from "@/services/useFetchItem";
import httpService from "@/services/httpService";
import { useState } from "react";

// Get all products with pagination and filters
export const useGetProducts = () => {
  const { isLoading, error, data, refetch, setFilter } = useFetchItem({
    queryKey: ["fetchProducts"],
    queryFn: (queryParams) => httpService.getData(routes.products(queryParams)),
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

// Create product following manufacturer pattern
export const useCreateProduct = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: createProductMutation,
    isPending: isCreating,
    error,
  } = useMutation({
    mutationFn: async (payload) => {
      // First upload images for each option
      const processedOptions = await Promise.all(
        payload.options.map(async (option) => {
          let imageUrls = [];
          
          if (option.imageFiles && option.imageFiles.length > 0) {
            const formData = new FormData();
            option.imageFiles.forEach((file) => 
              formData.append("images", file)
            );
            formData.append("folder", "products");

            try {
              const uploadResponse = await apiClient.post("/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
              });
              imageUrls = uploadResponse.data.urls || [];
            } catch (error) {
              console.error("Image upload failed:", error);
              throw new Error("Image upload failed. Please try again.");
            }
          }

          return {
            value: option.value,
            stockPrice: option.stockPrice,
            retailPrice: option.price, // Backend expects retailPrice
            discountType: option.discountType,
            bulkDiscount: option.bulkDiscount,
            minimumBulkQuantity: option.minimumBulkQuantity,
            inventory: option.inventory,
            weight: option.weight,
            unit: option.unit,
            image: imageUrls, // Backend expects image array
          };
        })
      );

      // Prepare final payload
      const productPayload = {
        name: payload.name,
        description: payload.description,
        shortDescription: payload.shortDescription,
        categoryId: parseInt(payload.categoryId),
        manufacturerId: parseInt(payload.manufacturerId),
        type: payload.type || "platform",
        processingTimeDays: payload.processingTimeDays,
        minDeliveryDays: payload.minDeliveryDays,
        maxDeliveryDays: payload.maxDeliveryDays,
        includeSaturdays: payload.includeSaturdays,
        acceptsReturns: payload.acceptsReturns,
        options: processedOptions,
      };

      const response = await apiClient.post(routes.createProduct(), productPayload);
      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["fetchProducts"] });
      queryClient.invalidateQueries({ queryKey: ["fetchManufacturerProducts"] });
      
      toast.success(response?.message || "Product created successfully!");
      
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error) => {
      const errorMessage = ErrorHandler(error) || "Product creation failed.";
      toast.error(errorMessage);
    },
  });

  return {
    createProduct: createProductMutation,
    isCreating,
    createProductError: ErrorHandler(error),
  };
};

// Update product
export const useUpdateProduct = ({ onSuccess }) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: updateProductMutation,
    isPending: isUpdating,
    error,
  } = useMutation({
    mutationFn: async ({ id, payload }) => {
      // Handle image uploads for new images
      const processedOptions = await Promise.all(
        payload.options.map(async (option) => {
          let uploadedImageUrls = [];

          // Upload new images if any
          if (option.newImages && option.newImages.length > 0) {
            const formData = new FormData();
            option.newImages.forEach((file) => 
              formData.append("images", file)
            );
            formData.append("folder", "products");

            try {
              const uploadResponse = await apiClient.post("/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
              });
              uploadedImageUrls = uploadResponse.data.urls || [];
            } catch (error) {
              console.error("Image upload failed:", error);
              throw new Error("Image upload failed. Please try again.");
            }
          }

          // Combine existing images with new uploaded images
          const allImages = [...(option.image || []), ...uploadedImageUrls];

          return {
            value: option.value,
            stockPrice: option.stockPrice,
            retailPrice: option.price,
            discountType: option.discountType,
            bulkDiscount: option.bulkDiscount,
            minimumBulkQuantity: option.minimumBulkQuantity,
            inventory: option.inventory,
            weight: option.weight,
            unit: option.unit,
            image: allImages,
          };
        })
      );

      const updateData = {
        name: payload.name,
        description: payload.description,
        shortDescription: payload.shortDescription,
        type: payload.type,
        isActive: payload.isActive,
        processingTimeDays: payload.processingTimeDays,
        minDeliveryDays: payload.minDeliveryDays,
        maxDeliveryDays: payload.maxDeliveryDays,
        includeSaturdays: payload.includeSaturdays,
        acceptsReturns: payload.acceptsReturns,
        categoryId: parseInt(payload.categoryId),
        manufacturerId: parseInt(payload.manufacturerId),
        options: processedOptions
      };

      const response = await apiClient.patch(`/admin/products/${id}`, updateData);
      return response.data;
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["fetchProducts"] });
      queryClient.invalidateQueries({ queryKey: ["fetchManufacturerProducts"] });
      queryClient.invalidateQueries({ 
        queryKey: ["fetchProductInfo", variables.id] 
      });
      
      toast.success(response?.message || "Product updated successfully!");
      
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      console.error("Update Mutation Error:", error);
      const errorMessage = error.response?.data?.error || 
                          error.message || 
                          "Failed to update product";
      toast.error(errorMessage);
    },
  });

  return {
    updateProduct: updateProductMutation,
    isUpdating,
    updateProductError: ErrorHandler(error),
  };
};

// Delete product
export const useDeleteProduct = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const queryClient = useQueryClient();

  const deleteProduct = async (productId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await httpService.deleteData(`admin/products/${productId}`);
      
      setData(response.data);
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["fetchProducts"] });
      queryClient.invalidateQueries({ queryKey: ["fetchManufacturerProducts"] });
      
      toast.success(response?.data?.message || "Product deleted successfully!");
      
      if (onSuccess) {
        onSuccess();
      }
      
      return response.data;
    } catch (error) {
      console.error('Product deletion failed:', error);
      const errorMessage = error?.response?.data?.error || 
                          error?.message || 
                          "Failed to delete product";
      toast.error(errorMessage);
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

// Get single product details
export const useGetProductInfo = () => {
  const { isLoading, error, data, refetch, setFilter } = useFetchItem({
    queryKey: ["fetchProductInfo"],
    queryFn: (id) => httpService.getData(routes.getProductInfo(id)),
    retry: 2,
  });

  return {
    getProductInfoIsLoading: isLoading,
    getProductInfoData: data?.data?.data || {},
    getProductInfoError: ErrorHandler(error),
    refetchProductInfo: refetch,
    setProductInfoFilter: setFilter,
  };
};

// Get products by manufacturer
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

// Get all categories for selection
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