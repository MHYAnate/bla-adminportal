// services/categories/index.js
"use client";

import { showErrorAlert } from "@/lib/utils";
import { routes } from "../api-routes";
import { ErrorHandler } from "../errorHandler";
import httpService from "../httpService";
import useFetchItem from "../useFetchItem";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

// Get all categories with pagination and filters
export const useGetAllCategories = () => {
  const {
    isLoading,
    error,
    data,
    refetch,
    setFilter
  } = useFetchItem({
    queryKey: ["fetchAllCategories"],
    queryFn: (queryParams) => {
      return httpService.getData(routes.categories(queryParams));
    },
    retry: 2,
  });

  // Extract data from response structure
  let categories = [];
  let pagination = {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    activeCount: 0,
    inactiveCount: 0,
  };

  try {
    if (data?.data?.success && data?.data?.data) {
      categories = data.data.data.categories || [];
      pagination = { ...pagination, ...data.data.data.pagination };
      
      if (data.data.data.stats) {
        pagination.activeCount = data.data.data.stats.active || 0;
        pagination.inactiveCount = data.data.data.stats.inactive || 0;
      }
    } else if (data?.data?.categories) {
      categories = data.data.categories || [];
      pagination = { ...pagination, ...data.data.pagination };
      
      if (data.data.stats) {
        pagination.activeCount = data.data.stats.active || 0;
        pagination.inactiveCount = data.data.stats.inactive || 0;
      }
    } else if (data?.success && data?.data) {
      categories = data.data.categories || [];
      pagination = { ...pagination, ...data.data.pagination };
      
      if (data.data.stats) {
        pagination.activeCount = data.data.stats.active || 0;
        pagination.inactiveCount = data.data.stats.inactive || 0;
      }
    } else if (data?.categories) {
      categories = data.categories || [];
      pagination = { ...pagination, ...data.pagination };
      
      if (data.stats) {
        pagination.activeCount = data.stats.active || 0;
        pagination.inactiveCount = data.stats.inactive || 0;
      }
    }

    // Fallback calculation if stats not provided by API
    if (!pagination.activeCount && !pagination.inactiveCount && categories.length > 0) {
      pagination.activeCount = categories.filter((cat) => cat.status === 'Active').length;
      pagination.inactiveCount = categories.filter((cat) => cat.status === 'Inactive').length;
    }
  } catch (extractError) {
    console.error("Error extracting categories data:", extractError);
  }

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

// Get category statistics
export const useGetCategoryStats = () => {
  const {
    isLoading,
    error,
    data,
    refetch,
  } = useFetchItem({
    queryKey: ["fetchCategoryStats"],
    queryFn: () => {
      return httpService.getData(routes.categories({ includeStats: true, limit: 1000 }));
    },
    retry: 2,
  });

  // Calculate stats from the response
  let stats = {
    total: 0,
    active: 0,
    inactive: 0
  };

  if (data) {
    let categories = [];
    let pagination = {};

    if (data?.data?.success && data?.data?.data) {
      categories = data.data.data.categories || [];
      pagination = data.data.data.pagination || {};
    } else if (data?.data?.categories) {
      categories = data.data.categories || [];
      pagination = data.data.pagination || {};
    } else if (data?.success && data?.data) {
      categories = data.data.categories || [];
      pagination = data.data.pagination || {};
    } else if (data?.categories) {
      categories = data.categories || [];
      pagination = data.pagination || {};
    }

    if (categories.length > 0) {
      stats.total = categories.length;
      stats.active = categories.filter(cat => cat.status === 'Active').length;
      stats.inactive = categories.filter(cat => cat.status === 'Inactive').length;
    } else if (pagination.total !== undefined) {
      stats.total = pagination.total;
      stats.active = pagination.activeCount || 0;
      stats.inactive = pagination.inactiveCount || 0;
    }
  }

  return {
    getCategoryStatsIsLoading: isLoading,
    getCategoryStatsData: stats,
    getCategoryStatsError: ErrorHandler(error),
    refetchCategoryStats: refetch,
  };
};

export const useGetCategoriesForSelection = () => {
  const {
    isLoading,
    error,
    data,
    refetch,
  } = useFetchItem({
    queryKey: ["fetchCategoriesSelection"],
    queryFn: () => {
      return httpService.getData(routes.categoriesSelection());
    },
    retry: 2,
  });

  // Extract categories data from response
  let categoriesData = [];
  
  try {
    if (data?.data?.data && Array.isArray(data.data.data)) {
      categoriesData = data.data.data;
    } else if (data?.data && Array.isArray(data.data)) {
      categoriesData = data.data;
    } else if (data?.success && Array.isArray(data.data)) {
      categoriesData = data.data;
    } else if (Array.isArray(data)) {
      categoriesData = data;
    }
  } catch (err) {
    console.error("Error processing categories data:", err);
    categoriesData = [];
  }

  return {
    getCategoriesSelectionIsLoading: isLoading,
    getCategoriesSelectionData: categoriesData,
    getCategoriesSelectionError: ErrorHandler(error),
    refetchCategoriesSelection: refetch,
  };
};

// Create category
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: createCategoryMutation,
    isPending: isCreating,
    error,
  } = useMutation({
    mutationFn: async (categoryData) => {
      if (!categoryData?.name) {
        throw new Error("Category name is required");
      }
      
      const response = await httpService.postData(categoryData, routes.createCategory());
      return response;
    },

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["fetchAllCategories"] });
      queryClient.invalidateQueries({ queryKey: ["fetchCategoriesSelection"] });
      
      const message = response?.data?.message || "Category created successfully!";
      toast.success(message);
    },

    onError: (error) => {
      console.error('Category creation failed:', error);
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to create category";
      toast.error(errorMessage);
    },
  });

  const createCategory = async (categoryData) => {
    try {
      const response = await createCategoryMutation(categoryData);
      return response?.data?.data || response?.data || response;
    } catch (error) {
      throw error;
    }
  };

  return {
    createCategory,
    isCreating,
    createCategoryError: ErrorHandler(error),
  };
};

// Update category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: updateCategoryMutation,
    isPending: isUpdating,
    error,
  } = useMutation({
    mutationFn: async (categoryData) => {
      const { id, ...updateData } = categoryData;
      
      const response = await httpService.putData(updateData, routes.updateCategory(id));
      return response;
    },

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["fetchAllCategories"] });
      queryClient.invalidateQueries({ queryKey: ["fetchCategoriesSelection"] });
      
      toast.success(response?.data?.message || "Category updated successfully!");
    },

    onError: (error) => {
      console.error('Category update failed:', error);
      const errorMessage = error?.response?.data?.error || error?.message || "Category update failed.";
      toast.error(errorMessage);
    },
  });

  const updateCategory = async (categoryData) => {
    try {
      const response = await updateCategoryMutation(categoryData);
      return response.data?.data || response.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    updateCategory,
    isUpdating,
    updateCategoryError: ErrorHandler(error),
  };
};

// Delete category
export const useDeleteCategory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const queryClient = useQueryClient();

  const deleteCategory = async (categoryId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await httpService.deleteData(routes.deleteCategory(categoryId));
      
      setData(response.data);
      
      queryClient.invalidateQueries({ queryKey: ["fetchAllCategories"] });
      queryClient.invalidateQueries({ queryKey: ["fetchCategoriesSelection"] });
      
      toast.success(response?.data?.message || "Category deleted successfully!");
      return response.data;
    } catch (error) {
      console.error('Category deletion failed:', error);
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to delete category";
      toast.error(errorMessage);
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteCategory,
    isLoading,
    error,
    data
  };
};