"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteIcon, EditIcon, ViewIcon } from "../../../../../../public/icons";

interface Category {
    id: number;
    name: string;
    description?: string;
    productCount: number;
    status: 'Active' | 'Inactive';
    createdAt: string;
    updatedAt: string;
}

interface CategoryDataTableProps {
    handleEdit: (category: Category) => void;
    handleView: (category: Category) => void;
    handleDelete: (category: Category) => void;
    setPageSize: React.Dispatch<React.SetStateAction<string>>;
    data?: Category[];
    currentPage: number;
    onPageChange: (page: number) => void;
    pageSize: number;
    totalPages: number;
    loading: boolean;
}

const CategoryDataTable: React.FC<CategoryDataTableProps> = ({
    handleEdit,
    handleView,
    handleDelete,
    setPageSize,
    data = [],
    currentPage,
    onPageChange,
    pageSize,
    totalPages,
    loading,
}) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* Table Header */}
                <div className="bg-gray-50 border-b border-gray-200">
                    <div className="grid grid-cols-12 gap-4 px-6 py-4">
                        <div className="col-span-3 text-sm font-medium text-gray-700">Category</div>
                        <div className="col-span-2 text-sm font-medium text-gray-700">Description</div>
                        <div className="col-span-2 text-sm font-medium text-gray-700">No. Of Products</div>
                        <div className="col-span-2 text-sm font-medium text-gray-700">Date created</div>
                        <div className="col-span-2 text-sm font-medium text-gray-700">Status</div>
                        <div className="col-span-1 text-sm font-medium text-gray-700">Actions</div>
                    </div>
                </div>

                {/* Loading Skeleton */}
                <div className="divide-y divide-gray-200">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="grid grid-cols-12 gap-4 px-6 py-4 animate-pulse">
                            <div className="col-span-3">
                                <div className="h-4 bg-gray-200 rounded w-32"></div>
                            </div>
                            <div className="col-span-2">
                                <div className="h-4 bg-gray-200 rounded w-24"></div>
                            </div>
                            <div className="col-span-2">
                                <div className="h-6 w-8 bg-gray-200 rounded-full"></div>
                            </div>
                            <div className="col-span-2">
                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                            </div>
                            <div className="col-span-2">
                                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                            </div>
                            <div className="col-span-1">
                                <div className="flex gap-2">
                                    <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                                    <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* Table Header */}
                <div className="bg-gray-50 border-b border-gray-200">
                    <div className="grid grid-cols-12 gap-4 px-6 py-4">
                        <div className="col-span-3 text-sm font-medium text-gray-700">Category</div>
                        <div className="col-span-2 text-sm font-medium text-gray-700">Description</div>
                        <div className="col-span-2 text-sm font-medium text-gray-700">No. Of Products</div>
                        <div className="col-span-2 text-sm font-medium text-gray-700">Date created</div>
                        <div className="col-span-2 text-sm font-medium text-gray-700">Status</div>
                        <div className="col-span-1 text-sm font-medium text-gray-700">Actions</div>
                    </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-200">
                    {data.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
                                <p className="text-gray-500">Get started by creating your first category.</p>
                            </div>
                        </div>
                    ) : (
                        data.map((category) => (
                            <div key={category.id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                                {/* Category Name */}
                                <div className="col-span-3">
                                    <div className="font-medium text-sm text-gray-900">
                                        {category.name}
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="col-span-2">
                                    <div className="text-sm text-gray-600 truncate max-w-32" title={category.description}>
                                        {category.description || "No description"}
                                    </div>
                                </div>

                                {/* Product Count */}
                                <div className="col-span-2">
                                    <div className="inline-flex items-center justify-center w-8 h-8 text-sm font-medium">
                                        {category.productCount}
                                    </div>
                                </div>

                                {/* Date Created */}
                                <div className="col-span-2">
                                    <div className="text-sm font-medium text-gray-900">
                                        {formatDate(category.createdAt)}
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="col-span-2">
                                    <Badge
                                        variant="outline"
                                        className={`inline-flex items-center justify-center whitespace-nowrap text-xs px-3 py-1 font-medium rounded-full ${category.status === 'Active'
                                            ? "bg-green-100 text-green-800 border-green-200"
                                            : "bg-gray-100 text-gray-600 border-gray-200"
                                            }`}
                                    >
                                        {category.status}
                                    </Badge>
                                </div>

                                {/* Actions */}
                                <div className="col-span-1">
                                    <div className="flex gap-2.5">
                                        <div
                                            className="bg-[#2F78EE] p-2 rounded-lg cursor-pointer"
                                            onClick={() => handleEdit(category)}
                                        >
                                            <EditIcon />
                                        </div>
                                        <div
                                            className={`p-2 rounded-lg transition-colors ${category.status === 'Active'
                                                ? "bg-gray-300 cursor-not-allowed"
                                                : "bg-[#E03137] hover:bg-[#dc2626] cursor-pointer"
                                                }`}
                                            onClick={() => category.status === 'Inactive' && handleDelete(category)}
                                            title={category.status === 'Active' ? "Cannot delete active category" : "Delete Category"}
                                        >
                                            <DeleteIcon />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
                        <div className="text-sm text-gray-700">
                            Page {currentPage} of {totalPages}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(currentPage - 1)}
                                disabled={currentPage <= 1}
                                className="h-8 px-3 text-sm border-gray-300"
                            >
                                Previous
                            </Button>

                            {/* Page Numbers */}
                            <div className="flex space-x-1">
                                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                    const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                                    if (pageNumber > totalPages) return null;

                                    return (
                                        <Button
                                            key={pageNumber}
                                            variant={currentPage === pageNumber ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => onPageChange(pageNumber)}
                                            className={`h-8 w-8 p-0 text-sm border-gray-300 ${currentPage === pageNumber
                                                ? "bg-[#F7931E] hover:bg-[#e8851a] text-white border-[#F7931E]"
                                                : "hover:bg-gray-50"
                                                }`}
                                        >
                                            {pageNumber}
                                        </Button>
                                    );
                                })}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages}
                                className="h-8 px-3 text-sm border-gray-300"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryDataTable;