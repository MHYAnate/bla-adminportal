// services/products/index.js
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { routes } from "@/services/api-routes";
import { ErrorHandler } from "@/services/errorHandler";
import useFetchItem from "@/services/useFetchItem";
import httpService from "@/services/httpService";
import { useState, useMemo } from "react";

// =================== GET PRODUCTS ===================
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
    getProductsIsLoading: isLoading,
    getProductsData: {
      data: extractedData,
      pagination: extractedPagination
    },
    getProductsError: ErrorHandler(error),
    refetchProducts: refetch,
    setProductsFilter: setFilter,
  };
};

// =================== CREATE PRODUCT ===================
// export const useCreateProduct = ({ onSuccess }) => {
//   const queryClient = useQueryClient();

//   const {
//     mutateAsync: createProductMutation,
//     isPending: isCreating,
//     error,
//   } = useMutation({
//     mutationFn: async (payload) => {
//       console.log('🚀 Creating product with httpService:', payload);
      
//       const processedOptions = await Promise.all(
//         payload.options.map(async (option) => {
//           let uploadedImageUrls = [];

//           // Handle new images (for create, they might be in imageFiles)
//           const imagesToUpload = option.imageFiles || [];
          
//           if (imagesToUpload && imagesToUpload.length > 0) {
//             const formData = new FormData();
//             imagesToUpload.forEach((file) => 
//               formData.append("images", file)
//             );
//             formData.append("folder", "products");

//             try {
//               // ✅ FIXED: Use httpService for uploads
//               const uploadResponse = await httpService.postData(formData, routes.upload());
//               uploadedImageUrls = uploadResponse.urls || [];
//             } catch (error) {
//               console.error("Image upload failed:", error);
//               throw new Error("Image upload failed. Please try again.");
//             }
//           }

//           return {
//             value: option.value,
//             stockPrice: option.stockPrice,
//             retailPrice: option.price, // Backend expects retailPrice
//             discountType: option.discountType,
//             bulkDiscount: option.bulkDiscount,
//             minimumBulkQuantity: option.minimumBulkQuantity,
//             inventory: option.inventory,
//             weight: option.weight,
//             unit: option.unit,
//             image: uploadedImageUrls,
//           };
//         })
//       );

//       const productPayload = {
//         name: payload.name,
//         description: payload.description,
//         shortDescription: payload.shortDescription,
//         type: "platform",
//         processingTimeDays: payload.processingTimeDays,
//         minDeliveryDays: payload.minDeliveryDays,
//         maxDeliveryDays: payload.maxDeliveryDays,
//         includeSaturdays: payload.includeSaturdays,
//         acceptsReturns: payload.acceptsReturns,
//         categoryId: parseInt(payload.categoryId),
//         manufacturerId: parseInt(payload.manufacturerId),
//         options: processedOptions
//       };

//       const response = await httpService.postData(productPayload, routes.createProduct());
//       return response;
//     },
//     onSuccess: (response) => {
//       queryClient.invalidateQueries({ queryKey: ["fetchProducts"] });
//       queryClient.invalidateQueries({ queryKey: ["fetchManufacturerProducts"] });
      
//       toast.success(response?.message || "Product created successfully!");
      
//       if (onSuccess) {
//         onSuccess();
//       }
//     },
//     onError: (error) => {
//       console.error("Create Product Error:", error);
//       const errorMessage = error.response?.data?.error || 
//                           error.response?.data?.message ||
//                           error.message || 
//                           "Failed to create product";
//       toast.error(errorMessage);
//     },
//   });

//   return {
//     createProduct: createProductMutation,
//     isCreating,
//     createProductError: ErrorHandler(error),
//   };
// };

export const useCreateProduct = ({ onSuccess }) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: createProductMutation,
    isPending: isCreating,
    error,
  } = useMutation({
    mutationFn: async (payload) => {
      console.log('🚀 Creating product with dual profit support:', payload);
      
      const processedOptions = await Promise.all(
        payload.options.map(async (option) => {
          let uploadedImageUrls = [];

          // Handle image uploads
          if (option.imageFiles && option.imageFiles.length > 0) {
            const formData = new FormData();
            option.imageFiles.forEach((file) => 
              formData.append("images", file)
            );
            formData.append("folder", "products");

            try {
              const uploadResponse = await httpService.postData(formData, routes.upload());
              uploadedImageUrls = uploadResponse.urls || [];
            } catch (error) {
              console.error("Image upload failed:", error);
              throw new Error("Image upload failed. Please try again.");
            }
          }

          // Structure option data based on profit type
          const baseOption = {
            value: option.value,
            inventory: option.inventory,
            weight: option.weight,
            unit: option.unit,
            image: uploadedImageUrls,
            profitType: option.profitType,
          };

          if (option.profitType === 'COMMISSION') {
            return {
              ...baseOption,
              supplierPrice: (option ).supplierPrice,
              commissionRate: (option ).commissionRate,
            };
          } else {
            return {
              ...baseOption,
              stockPrice: (option ).stockPrice,
              retailPrice: (option ).retailPrice,
              discountType: (option ).discountType || 'NONE',
              bulkDiscount: (option ).bulkDiscount || 0,
              minimumBulkQuantity: (option ).minimumBulkQuantity || 1,
            };
          }
        })
      );

      const productPayload = {
        name: payload.name,
        description: payload.description,
        shortDescription: payload.shortDescription,
        type: payload.type || "platform",
        processingTimeDays: payload.processingTimeDays,
        minDeliveryDays: payload.minDeliveryDays,
        maxDeliveryDays: payload.maxDeliveryDays,
        includeSaturdays: payload.includeSaturdays,
        acceptsReturns: payload.acceptsReturns,
        categoryId: parseInt(payload.categoryId),
        manufacturerId: parseInt(payload.manufacturerId),
        options: processedOptions
      };

      const response = await httpService.postData(productPayload, routes.createProduct());
      return response;
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
    createProductError: error,
  };
};

export const useCreateProductWithProfit = ({ onSuccess }) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: createProductMutation,
    isPending: isCreating,
    error,
  } = useMutation({
    mutationFn: async (payload) => {
      console.log("🚀 Creating product (dual profit):", payload);

      const processedOptions = await Promise.all(
        payload.options.map(async (option) => {
          let uploadedImageUrls = [];

          const imagesToUpload = option.imageFiles || [];
          if (imagesToUpload.length > 0) {
            const formData = new FormData();
            imagesToUpload.forEach((file) => formData.append("images", file));
            formData.append("folder", "products");

            const uploadResponse = await httpService.postData(formData, routes.upload());
            uploadedImageUrls = uploadResponse.urls || [];
          }

          // Normalize options based on profitType
          if (option.profitType === "COMMISSION") {
            return {
              value: option.value,
              profitType: "COMMISSION",
              supplierPrice: option.supplierPrice,
              commissionRate: option.commissionRate,
              inventory: option.inventory,
              unit: option.unit,
              image: uploadedImageUrls,
            };
          } else {
            return {
              value: option.value,
              profitType: "MARKUP",
              stockPrice: option.stockPrice,
              retailPrice: option.retailPrice,
              discountType: option.discountType,
              bulkDiscount: option.bulkDiscount,
              minimumBulkQuantity: option.minimumBulkQuantity,
              inventory: option.inventory,
              unit: option.unit,
              image: uploadedImageUrls,
            };
          }
        })
      );

      const productPayload = {
        name: payload.name,
        description: payload.description,
        shortDescription: payload.shortDescription,
        processingTimeDays: payload.processingTimeDays,
        minDeliveryDays: payload.minDeliveryDays,
        maxDeliveryDays: payload.maxDeliveryDays,
        includeSaturdays: payload.includeSaturdays,
        acceptsReturns: payload.acceptsReturns,
        type: "platform",
        categoryId: parseInt(payload.categoryId),
        manufacturerId: parseInt(payload.manufacturerId),
        options: processedOptions,
      };

      return httpService.postData(productPayload, routes.createProductWithProfit());
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["fetchProducts"] });
      toast.success(res?.message || "Product created successfully with dual profit support!");
      if (onSuccess) onSuccess();
    },
    onError: (err) => {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to create product";
      toast.error(message);
    },
  });

  return {
    createProduct: createProductMutation,
    isCreating,
    createProductError: ErrorHandler(error),
  };
};

// =================== UPDATE PRODUCT ===================
// export const useUpdateProduct = ({ onSuccess }) => {
//   const queryClient = useQueryClient();

//   const {
//     mutateAsync: updateProductMutation,
//     isPending: isUpdating,
//     error,
//   } = useMutation({
//     mutationFn: async ({ id, payload }) => {
//       console.log('🚀 Updating product with httpService:', { id, payload });
      
//       const processedOptions = await Promise.all(
//         payload.options.map(async (option) => {
//           let uploadedImageUrls = [];

//           if (option.newImages && option.newImages.length > 0) {
//             const formData = new FormData();
//             option.newImages.forEach((file) => 
//               formData.append("images", file)
//             );
//             formData.append("folder", "products");

//             try {
//               // ✅ FIXED: Use httpService for uploads
//               const uploadResponse = await httpService.postData(formData, routes.upload());
//               uploadedImageUrls = uploadResponse.urls || [];
//             } catch (error) {
//               console.error("Image upload failed:", error);
//               throw new Error("Image upload failed. Please try again.");
//             }
//           }

//           const allImages = [...(option.image || []), ...uploadedImageUrls];

//           return {
//             value: option.value,
//             stockPrice: option.stockPrice,
//             retailPrice: option.price,
//             discountType: option.discountType,
//             bulkDiscount: option.bulkDiscount,
//             minimumBulkQuantity: option.minimumBulkQuantity,
//             inventory: option.inventory,
//             weight: option.weight,
//             unit: option.unit,
//             image: allImages,
//           };
//         })
//       );

//       const updateData = {
//         name: payload.name,
//         description: payload.description,
//         shortDescription: payload.shortDescription,
//         type: payload.type,
//         isActive: payload.isActive,
//         processingTimeDays: payload.processingTimeDays,
//         minDeliveryDays: payload.minDeliveryDays,
//         maxDeliveryDays: payload.maxDeliveryDays,
//         includeSaturdays: payload.includeSaturdays,
//         acceptsReturns: payload.acceptsReturns,
//         categoryId: parseInt(payload.categoryId),
//         manufacturerId: parseInt(payload.manufacturerId),
//         options: processedOptions
//       };

//       const response = await httpService.updateData(updateData, routes.updateProduct(id));
//       return response;
//     },
//     onSuccess: (response, variables) => {
//       queryClient.invalidateQueries({ queryKey: ["fetchProducts"] });
//       queryClient.invalidateQueries({ queryKey: ["fetchManufacturerProducts"] });
//       queryClient.invalidateQueries({ 
//         queryKey: ["fetchProductInfo", variables.id] 
//       });
      
//       toast.success(response?.message || "Product updated successfully!");
      
//       if (onSuccess) {
//         onSuccess();
//       }
//     },
//     onError: (error) => {
//       console.error("Update Product Error:", error);
//       const errorMessage = error.response?.data?.error || 
//                           error.response?.data?.message ||
//                           error.message || 
//                           "Failed to update product";
//       toast.error(errorMessage);
//     },
//   });

//   return {
//     updateProduct: updateProductMutation,
//     isUpdating,
//     updateProductError: ErrorHandler(error),
//   };
// };

// src/services/products.ts (update the useUpdateProduct hook)
// export const useUpdateProduct = ({ onSuccess }) => {
//   const queryClient = useQueryClient();

//   const {
//     mutateAsync: updateProductMutation,
//     isPending: isUpdating,
//     error,
//   } = useMutation({
//     mutationFn: async ({ id, payload }) => {
//       console.log('🚀 Updating product with dual profit support:', { id, payload });
      
//       // Process options with image uploads
//       const processedOptions = await Promise.all(
//         payload.options.map(async (option) => {
//           let uploadedImageUrls = [];

//           // Handle new image uploads
//           if (option.imageFiles && option.imageFiles.length > 0) {
//             const formData = new FormData();
//             option.imageFiles.forEach((file) => 
//               formData.append("images", file)
//             );
//             formData.append("folder", "products");

//             try {
//               const uploadResponse = await httpService.postData(formData, routes.upload());
//               uploadedImageUrls = uploadResponse.urls || [];
//             } catch (error) {
//               console.error("Image upload failed:", error);
//               throw new Error("Image upload failed. Please try again.");
//             }
//           }

//           // Combine existing images with new uploaded images
//           const allImages = [...(option.images || []), ...uploadedImageUrls];

//           // Prepare option data based on profit type
//           let optionData = {
//             value: option.value,
//             inventory: option.inventory,
//             weight: option.weight,
//             unit: option.unit,
//             image: allImages,
//             profitType: option.profitType,
//           };

//           // Add fields based on profit type
//           if (option.profitType === "MARKUP") {
//             optionData = {
//               ...optionData,
//               stockPrice: option.stockPrice,
//               retailPrice: option.retailPrice,
//               discountType: option.discountType,
//               bulkDiscount: option.bulkDiscount,
//               minimumBulkQuantity: option.minimumBulkQuantity,
//             };
//           } else if (option.profitType === "COMMISSION") {
//             optionData = {
//               ...optionData,
//               supplierPrice: option.supplierPrice,
//               commissionRate: option.commissionRate,
//               // Ensure bulk pricing fields are not included for commission products
//               discountType: "NONE",
//               bulkDiscount: 0,
//               minimumBulkQuantity: 1,
//             };
//           }

//           return optionData;
//         })
//       );

//       // Prepare the update payload
//       const updateData = {
//         name: payload.name,
//         description: payload.description,
//         shortDescription: payload.shortDescription,
//         type: payload.type,
//         isActive: payload.isActive,
//         processingTimeDays: payload.processingTimeDays,
//         minDeliveryDays: payload.minDeliveryDays,
//         maxDeliveryDays: payload.maxDeliveryDays,
//         includeSaturdays: payload.includeSaturdays,
//         acceptsReturns: payload.acceptsReturns,
//         categoryId: parseInt(payload.categoryId),
//         manufacturerId: parseInt(payload.manufacturerId),
//         options: processedOptions
//       };

//       console.log('Sending update data:', updateData);
//       const response = await httpService.updateData(updateData, routes.updateProduct(id));
//       return response;
//     },
//     onSuccess: (response, variables) => {
//       queryClient.invalidateQueries({ queryKey: ["fetchProducts"] });
//       queryClient.invalidateQueries({ queryKey: ["fetchManufacturerProducts"] });
//       queryClient.invalidateQueries({ 
//         queryKey: ["fetchProductInfo", variables.id] 
//       });
      
//       toast.success(response?.message || "Product updated successfully!");
      
//       if (onSuccess) {
//         onSuccess();
//       }
//     },
//     onError: (error) => {
//       console.error("Update Product Error:", error);
//       const errorMessage = error.response?.data?.error || 
//                           error.response?.data?.message ||
//                           error.message || 
//                           "Failed to update product";
//       toast.error(errorMessage);
//     },
//   });

//   return {
//     updateProduct: updateProductMutation,
//     isUpdating,
//     updateProductError: ErrorHandler(error),
//   };
// };

const routes1 = {
  updateProduct: (id) => `/api/admin/products/${id}`,
  upload: () => '/api/upload',
};

export const useUpdateProduct = ({ onSuccess }) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: updateProductMutation,
    isPending: isUpdating,
    error,
  } = useMutation({
    mutationFn: async ({ id, payload }) => {
      console.log('🚀 Updating product with dual profit support:', { id, payload });
      
      // Process options with image uploads
      const processedOptions = await Promise.all(
        payload.options.map(async (option) => {
          let uploadedImageUrls = [];

          // Handle new image uploads
          if (option.newImages && option.newImages.length > 0) {
            const formData = new FormData();
            option.newImages.forEach((file) => 
              formData.append("images", file)
            );
            formData.append("folder", "products");

            try {
              const uploadResponse = await httpService.postData(formData, routes.upload());
              uploadedImageUrls = uploadResponse.urls || [];
            } catch (error) {
              console.error("Image upload failed:", error);
              throw new Error("Image upload failed. Please try again.");
            }
          }

          // Combine existing images with new uploaded images
          const allImages = [...(option.image || []), ...uploadedImageUrls];

          // Prepare option data based on profit type
          const baseOption = {
            ...(option.id && { id: option.id }),
            value: option.value,
            inventory: option.inventory,
            weight: option.weight,
            unit: option.unit,
            image: allImages,
            profitType: option.profitType || 'MARKUP',
          };

          // Add fields based on profit type
          if (option.profitType === "COMMISSION") {
            return {
              ...baseOption,
              supplierPrice: option.supplierPrice,
              commissionRate: option.commissionRate,
            };
          } else {
            return {
              ...baseOption,
              stockPrice: option.stockPrice,
              retailPrice: option.price, // Backend expects retailPrice
              discountType: option.discountType || 'NONE',
              bulkDiscount: option.bulkDiscount || 0,
              minimumBulkQuantity: option.minimumBulkQuantity || 1,
            };
          }
        })
      );

      // Prepare the update payload
      const updateData = {
        name: payload.name,
        description: payload.description,
        shortDescription: payload.shortDescription,
        type: payload.type || 'platform',
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

      console.log('Sending update data:', updateData);
      const response = await httpService.updateData(updateData, routes.updateProduct(id));
      return response;
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
    updateProductError: error,
  };
};
// =================== DELETE PRODUCT ===================
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
      
      setData(response);
      
      queryClient.invalidateQueries({ queryKey: ["fetchProducts"] });
      queryClient.invalidateQueries({ queryKey: ["fetchManufacturerProducts"] });
      
      toast.success(response?.message || "Product deleted successfully!");
      
      if (onSuccess) {
        onSuccess();
      }
      
      return response;
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

// =================== GET PRODUCT INFO ===================
export const useGetProductInfo = () => {
  const { isLoading, error, data, refetch, setFilter } = useFetchItem({
    queryKey: ["fetchProductInfo"],
    queryFn: (id) => httpService.getData(routes.getProductDetails(id)),
    retry: 2,
  });

  return {
    getProductInfoIsLoading: isLoading,
    getProductInfoData: data?.data || {},
    getProductInfoError: ErrorHandler(error),
    refetchProductInfo: refetch,
    setProductInfoFilter: setFilter,
  };
};

// =================== GET MANUFACTURER PRODUCTS ===================
export const useGetManufacturerProducts = () => {
  const { isLoading, error, data, refetch, setFilter } = useFetchItem({
    queryKey: ["fetchManufacturerProducts"],
    queryFn: ({ manufacturerId, data }) =>
      httpService.getData(
        routes.getProductsByManufacturer(manufacturerId)
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