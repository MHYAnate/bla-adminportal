"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetAllCategories,
  useDeleteCategory,
  useGetCategoryStats
} from "@/services/categories";
import CategoryDataTable from "./components/categoryDataTable";
import CategoryForm from "./components/categoryForm";
import { toast } from "sonner";
import Header from "../../components/header";
import * as XLSX from "xlsx";

interface Category {
  id: number;
  name: string;
  description?: string;
  productCount: number;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

const CategoryManagementPage = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    status: "",
    includeBulkPricingStats: 'true'
  });
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  const {
    getAllCategoriesData,
    getAllCategoriesIsLoading,
    refetchAllCategories,
  } = useGetAllCategories(filters);

  const { deleteCategory } = useDeleteCategory();

  const {
    getCategoryStatsData,
    refetchCategoryStats
  } = useGetCategoryStats();

  const categories = getAllCategoriesData?.categories || [];
  const pagination = getAllCategoriesData?.pagination;
  const isLoading = getAllCategoriesIsLoading;

  const handleCreateCategory = () => {
    setSelectedCategory(null);
    setFormMode('create');
    setShowCategoryForm(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setFormMode('edit');
    setShowCategoryForm(true);
  };

  const handleViewCategory = (category: Category) => {
    toast.info(`Viewing category: ${category.name}`);
  };

  const handleDeleteCategory = (category: Category) => {
    if (category.productCount > 0) {
      toast.error(`Cannot delete category "${category.name}" because it has ${category.productCount} products.`);
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete the category "${category.name}"? This action cannot be undone.`
    );

    if (confirmed) {
      confirmDelete(category);
    }
  };

  const confirmDelete = async (category: Category) => {
    try {
      await deleteCategory(category.id);
      toast.success(`Category "${category.name}" deleted successfully!`);
      refetchAllCategories();
      refetchCategoryStats();
    } catch (error: any) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete category. Please try again.');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters(prev => ({
      ...prev,
      search: value,
      page: 1 // Reset to first page when searching
    }));
  };

  const handleStatusFilter = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: status,
      page: 1 // Reset to first page when filtering
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
      page
    }));
  };

  const handlePageSizeChange = (limit: number) => {
    setFilters(prev => ({
      ...prev,
      limit,
      page: 1 // Reset to first page when changing page size
    }));
  };

  const handleFormClose = () => {
    setShowCategoryForm(false);
    setSelectedCategory(null);
    refetchAllCategories();
    refetchCategoryStats();
  };

//   const formatDataForExcel = (categories: any) => {
//         if (!Array.isArray(categories)) {
//           console.warn("Expected an array but got:", categories);
//           return [];
//         }
    
//         return categories?.map((categories: any) => ({
          
//             Category: categories.data.,
//             Description: categories.name,
//             No_Of_Products: categories.email,
//             Date_created: categories.categoriesType,
//             Status: categories.role,
//         }));
//       };

const formatDataForExcel = (categories: Category[]) => {
    if (!Array.isArray(categories)) {
      console.warn("Expected an array but got:", categories);
      return [];
    }
  
    return categories.map((category) => ({
      Category: category.name,
      Description: category.description || "N/A",
      "No. Of Products": category.productCount,
      "Date Created": new Date(category.createdAt).toLocaleDateString(),
      Status: category.status,
    }));
  };

//       Category
// Description
// No. Of Products
// Date created
// Status
    
    //   const downloadExcel = () => {
    //     const formattedData = formatDataForExcel(data?.data);
    //     const worksheet = XLSX.utils.json_to_sheet(formattedData);
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
    
    //     XLSX.writeFile(workbook, "customers.xlsx");
    //   };
    //   console.log(data, "downP");

    const downloadExcel = () => {
        const formattedData = formatDataForExcel(categories); // categories from getAllCategoriesData
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Categories");
      
        XLSX.writeFile(workbook, "categories.xlsx");
      };

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <Header title="Product Category" subtext="Manage your product category here." />
        <Button
          onClick={handleCreateCategory}
          className="bg-[#F7931E] hover:bg-[#e8851a] text-white font-bold text-base px-6 py-4 rounded-lg"
          size="lg"
        >
          Create Category
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getCategoryStatsData?.total || pagination?.total || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {getCategoryStatsData?.active || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Inactive Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-500">
              {getCategoryStatsData?.inactive || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Category Table</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1 max-w-sm">
              <Input
                placeholder="Search categories..."
                value={filters.search}
                onChange={handleSearch}
                className="w-full h-10"
              />
            </div>
            <div className="flex items-center gap-3">
              {/* Status Filter Dropdown */}
              <select
                value={filters.status}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="border border-gray-200 rounded px-2 py-1 text-sm h-10"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              {/* Export Button */}
              <Button
                variant="outline"
                className="h-10 px-4 border-gray-200 text-gray-600 hover:bg-gray-50"
                onClick={downloadExcel}
              >
                Export
              </Button>

              

              {/* Page Size Selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Show:</span>
                <select
                  value={filters.limit}
                  onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                  className="border border-gray-200 rounded px-2 py-1 text-sm h-10"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>
          </div>

          {/* Categories Table */}
          <CategoryDataTable
            data={categories}
            currentPage={filters.page}
            onPageChange={handlePageChange}
            totalPages={pagination?.totalPages || 1}
            pageSize={filters.limit}
            totalItems={pagination?.total || 0}
            loading={isLoading}
            handleEdit={handleEditCategory}
            handleView={handleViewCategory}
            handleDelete={handleDeleteCategory}
          />
        </CardContent>
      </Card>

      {/* Category Form Modal */}
      <CategoryForm
        isOpen={showCategoryForm}
        onClose={handleFormClose}
        category={selectedCategory ? {
          id: selectedCategory.id.toString(),
          name: selectedCategory.name,
          description: selectedCategory.description
        } : undefined}
        mode={formMode}
        onSuccess={() => {
          refetchAllCategories();
          refetchCategoryStats();
        }}
      />
    </div>
  );
};

export default CategoryManagementPage;