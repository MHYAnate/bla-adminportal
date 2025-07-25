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
import CategoryFilters, { CategoryFilterValues } from "./components/categoryFilters";
import { toast } from "sonner";
import Header from "../../components/header";

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
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState("10");
    const [searchTerm, setSearchTerm] = useState("");
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
    const [showFilters, setShowFilters] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState<CategoryFilterValues>({});
    const filterButtonRef = useRef<HTMLButtonElement>(null);

    const {
        getAllCategoriesData,
        getAllCategoriesIsLoading,
        refetchAllCategories,
        setAllCategoriesFilter
    } = useGetAllCategories();

    const { deleteCategory } = useDeleteCategory();

    const {
        getCategoryStatsData,
        getCategoryStatsIsLoading,
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
        } catch (error: any) {
            console.error('Delete failed:', error);
            toast.error('Failed to delete category. Please try again.');
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);

        setAllCategoriesFilter({
            page: 1,
            limit: parseInt(pageSize),
            search: e.target.value || undefined,
            includeBulkPricingStats: true
        });
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);

        setAllCategoriesFilter({
            page,
            limit: parseInt(pageSize),
            search: searchTerm || undefined,
            includeBulkPricingStats: true
        });
    };

    const handleFormClose = () => {
        setShowCategoryForm(false);
        setSelectedCategory(null);
        refetchAllCategories();
        refetchCategoryStats();
    };

    const handleShowFilters = () => {
        setShowFilters(true);
    };

    const handleApplyFilters = (filterValues: CategoryFilterValues) => {
        setAppliedFilters(filterValues);
        setCurrentPage(1);

        const apiParams: any = {
            page: 1,
            limit: parseInt(pageSize),
            search: filterValues.search || searchTerm || undefined,
            includeBulkPricingStats: true
        };

        if (filterValues.status && filterValues.status.length > 0) {
            if (filterValues.status.includes('active') && !filterValues.status.includes('inactive')) {
                apiParams.status = 'active';
            } else if (filterValues.status.includes('inactive') && !filterValues.status.includes('active')) {
                apiParams.status = 'inactive';
            }
        }

        setAllCategoriesFilter(apiParams);
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
                                value={searchTerm}
                                onChange={handleSearch}
                                className="w-full h-10"
                            />
                        </div>
                        <div className="flex items-center gap-3 relative">
                            {/* Filter Button */}
                            <Button
                                ref={filterButtonRef}
                                variant="outline"
                                onClick={handleShowFilters}
                                className="h-10 px-4 border-gray-200 text-gray-600 hover:bg-gray-50"
                            >
                                <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
                                    />
                                </svg>
                                Filter
                            </Button>

                            {/* Filter Dropdown */}
                            <CategoryFilters
                                isOpen={showFilters}
                                onClose={() => setShowFilters(false)}
                                onApplyFilters={handleApplyFilters}
                                currentFilters={appliedFilters}
                                triggerRef={filterButtonRef}
                            />

                            {/* Export Button */}
                            <Button
                                variant="outline"
                                className="h-10 px-4 border-gray-200 text-gray-600 hover:bg-gray-50"
                            >
                                Export
                            </Button>

                            {/* Page Size Selector */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Show:</span>
                                <select
                                    value={pageSize}
                                    onChange={(e) => {
                                        setPageSize(e.target.value);
                                        setCurrentPage(1);
                                        setAllCategoriesFilter({
                                            page: 1,
                                            limit: parseInt(e.target.value),
                                            search: searchTerm || undefined,
                                            includeBulkPricingStats: true
                                        });
                                    }}
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
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                        totalPages={pagination?.totalPages || 1}
                        pageSize={parseInt(pageSize)}
                        loading={isLoading}
                        handleEdit={handleEditCategory}
                        handleView={handleViewCategory}
                        handleDelete={handleDeleteCategory}
                        setPageSize={setPageSize}
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
                onSuccess={(data) => {
                    refetchAllCategories();
                }}
            />
        </div>
    );
};

export default CategoryManagementPage;