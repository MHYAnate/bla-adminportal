// services/products/index.js
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient } from "@/services/api/client";
import { routes } from "@/services/api-routes";
import { ErrorHandler } from "@/services/errorHandler";
import useFetchItem from "@/services/useFetchItem";
import httpService from "@/services/httpService";
import { useState, useMemo } from "react";

// ✅ Get all products (unchanged)
export const useGetProducts = () => {
  const { isLoading, error, data, refetch, setFilter } = useFetchItem({
    queryKey: ["fetchProducts"],
    queryFn: (queryParams) => {
      console.log('🚀 Products API Call with params:', queryParams);
      return httpService.getData(routes.products(queryParams));
    },
    retry: 2,
  });

  const extractedData = useMemo(() => {
    if (!data) {
      console.log('❌ No products data received');
      return [];
    }
    
    if (Array.isArray(data)) {
      console.log('✅ Products data is direct array:', data.length, 'items');
      return data;
    }
    
    if (data.data && Array.isArray(data.data)) {
      console.log('✅ Found products array:', data.data.length, 'products');
      return data.data;
    }
    
    if (data.data?.data && Array.isArray(data.data.data)) {
      console.log('✅ Found nested products array:', data.data.data.length, 'products');
      return data.data.data;
    }

    if (data.result && Array.isArray(data.result)) {
      console.log('✅ Found products in result:', data.result.length, 'products');
      return data.result;
    }

    if (data.products && Array.isArray(data.products)) {
      console.log('✅ Found products array:', data.products.length, 'products');
      return data.products;
    }

    if (data.items && Array.isArray(data.items)) {
      console.log('✅ Found products in items:', data.items.length, 'products');
      return data.items;
    }
    
    console.warn('⚠️ Unexpected products data structure:', typeof data, data);
    return [];
  }, [data]);

  const extractedPagination = useMemo(() => {
    if (!data) return {};
    return data?.pagination || data?.data?.pagination || data?.meta || {};
  }, [data]);

  return {
    getPRoductsIsLoading: isLoading,
    getProductsData: {
      data: extractedData,
      pagination: extractedPagination
    },
    getProductsError: ErrorHandler(error),
    refetchProducts: refetch,
    setProductsFilter: setFilter,
  };
};

export const useCreateProduct = ({ onSuccess }) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: createProductMutation,
    isPending: isCreating,
    error,
  } = useMutation({
    mutationFn: async (payload) => {
      console.log('🚀 Creating product with httpService:', payload);
      
      const processedOptions = await Promise.all(
        payload.options.map(async (option) => {
          let uploadedImageUrls = [];

          // Handle new images (for create, they might be in imageFiles)
          const imagesToUpload = option.imageFiles || [];
          
          if (imagesToUpload && imagesToUpload.length > 0) {
            const formData = new FormData();
            imagesToUpload.forEach((file) => 
              formData.append("images", file)
            );
            formData.append("folder", "products");

            try {
              // Keep using apiClient for file uploads (this works)
              const uploadResponse = await apiClient.post(routes.upload(), formData, {
                headers: { "Content-Type": "multipart/form-data" },
              });
              uploadedImageUrls = uploadResponse.data.urls || [];
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
            image: uploadedImageUrls,
          };
        })
      );

      const productPayload = {
        name: payload.name,
        description: payload.description,
        shortDescription: payload.shortDescription,
        type: "platform",
        processingTimeDays: payload.processingTimeDays,
        minDeliveryDays: payload.minDeliveryDays,
        maxDeliveryDays: payload.maxDeliveryDays,
        includeSaturdays: payload.includeSaturdays,
        acceptsReturns: payload.acceptsReturns,
        categoryId: parseInt(payload.categoryId),
        manufacturerId: parseInt(payload.manufacturerId),
        options: processedOptions
      };

      // ✅ FIXED: Use httpService instead of direct apiClient
      const response = await httpService.postData(productPayload, routes.createProduct());
      return response.data;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["fetchProducts"] });
      queryClient.invalidateQueries({ queryKey: ["fetchManufacturerProducts"] });
      
      toast.success(response?.message || "Product created successfully!");
      
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      console.error("Create Product Error:", error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message ||
                          error.message || 
                          "Failed to create product";
      toast.error(errorMessage);
    },
  });

  return {
    createProduct: createProductMutation,
    isCreating,
    createProductError: ErrorHandler(error),
  };
};

// ✅ FIXED: Update Product - Now uses httpService and expects { id, payload }
export const useUpdateProduct = ({ onSuccess }) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: updateProductMutation,
    isPending: isUpdating,
    error,
  } = useMutation({
    mutationFn: async ({ id, payload }) => {
      console.log('🚀 Updating product with httpService:', { id, payload });
      
      const processedOptions = await Promise.all(
        payload.options.map(async (option) => {
          let uploadedImageUrls = [];

          if (option.newImages && option.newImages.length > 0) {
            const formData = new FormData();
            option.newImages.forEach((file) => 
              formData.append("images", file)
            );
            formData.append("folder", "products");

            try {
              const uploadResponse = await apiClient.post(routes.upload(), formData, {
                headers: { "Content-Type": "multipart/form-data" },
              });
              uploadedImageUrls = uploadResponse.data.urls || [];
            } catch (error) {
              console.error("Image upload failed:", error);
              throw new Error("Image upload failed. Please try again.");
            }
          }

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

      // ✅ FIXED: Use httpService instead of direct apiClient
      const response = await httpService.updateData(updateData, routes.updateProduct(id));
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
      console.error("Update Product Error:", error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message ||
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

// Rest of your existing hooks (deleteProduct, getProductInfo, etc.) remain the same...
export const useDeleteProduct = (onSuccess) => {
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