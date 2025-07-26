"use client";

import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { DeleteIcon, EditIcon, ViewIcon } from "../../../../../../../public/icons";
import { ProductTableComponent } from "@/components/custom-table/productIndex";

interface ManufacturerProductTableProps {
    handleEdit: (product: any) => void;
    handleView: (product: any) => void;
    handleDelete: (product: any) => void;
    setPageSize: React.Dispatch<React.SetStateAction<string>>;
    data?: any[];
    currentPage: number;
    onPageChange: (page: number) => void;
    pageSize: number;
    totalPages: number;
    loading: boolean;
}

const ManufacturerProductTable: React.FC<ManufacturerProductTableProps> = ({
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
    const cellRenderers = {
        name: (item: any) => (
            <div className="font-medium flex items-center gap-3">
                <Image
                    src={item.options[0]?.image[0] || "/images/bladmin-login.jpg"}
                    width={36}
                    height={36}
                    alt="Product image"
                    className="w-8 h-8 rounded-md object-cover"
                />
                <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">
                        {item.shortDescription || "No description"}
                    </p>
                </div>
            </div>
        ),
        category: (item: any) => (
            <div className="font-medium text-sm">
                {item.category?.name || 'Uncategorized'}
            </div>
        ),
        productid: (item: any) => (
            <div className="font-medium text-sm text-gray-700">#{item.id}</div>
        ),
        stockPrice: (item: any) => (
            <div className="font-medium text-sm">
                ₦{item.options[0]?.stockPrice?.toLocaleString() || '0'}
            </div>
        ),
        retailPrice: (item: any) => (
            <div className="font-medium text-sm">
                ₦{item.options[0]?.price?.toLocaleString() || '0'}
            </div>
        ),
        status: (item: any) => {
            const inventory = item.options[0]?.inventory || 0;
            const lowStockThreshold = item.options[0]?.lowStockThreshold || 5;

            let status = "In Stock";
            let colorClass = "bg-green-100 text-green-800 border-green-200";

            if (inventory === 0) {
                status = "Out of Stock";
                colorClass = "bg-red-100 text-red-800 border-red-200";
            } else if (inventory <= lowStockThreshold) {
                status = "Low Stock";
                colorClass = "bg-yellow-100 text-yellow-800 border-yellow-200";
            }

            return (
                <Badge
                    variant="outline"
                    className={`px-3 py-1 text-xs font-medium rounded-full ${colorClass}`}
                >
                    {status}
                </Badge>
            );
        },
        action: (item: any) => (
            <div className="flex gap-2">
                <button
                    onClick={() => handleView(item)}
                    className="bg-green-600 p-2 rounded-lg hover:bg-green-700 transition-colors"
                    title="View Product"
                >
                    <ViewIcon />
                </button>
                <button
                    onClick={() => handleEdit(item)}
                    className="bg-blue-600 p-2 rounded-lg hover:bg-blue-700 transition-colors"
                    title="Edit Product"
                >
                    <EditIcon />
                </button>
                <button
                    onClick={() => handleDelete(item)}
                    className="bg-red-600 p-2 rounded-lg hover:bg-red-700 transition-colors"
                    title="Delete Product"
                >
                    <DeleteIcon />
                </button>
            </div>
        ),
    };

    const columnOrder = [
        "name",
        "category",
        "productid",
        "stockPrice",
        "retailPrice",
        "status",
        "action",
    ];

    const columnLabels = {
        name: "Name",
        category: "Category",
        productid: "ID",
        stockPrice: "Stock Price",
        retailPrice: "Retail Price",
        status: "Status",
        action: "Action",
    };

    return (
        <ProductTableComponent
            tableData={data}
            currentPage={currentPage}
            onPageChange={onPageChange}
            totalPages={totalPages}
            cellRenderers={cellRenderers}
            columnOrder={columnOrder}
            columnLabels={columnLabels}
            setFilter={setPageSize}
            isLoading={loading}
        />
    );
};

export default ManufacturerProductTable;