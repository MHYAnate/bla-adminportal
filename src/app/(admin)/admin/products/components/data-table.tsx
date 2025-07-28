"use client";

import { Badge } from "@/components/ui/badge";
import { ProductData } from "@/types";
import Image from "next/image";
import { DeleteIcon, EditIcon, ViewIcon } from "../../../../../../public/icons";
import { ProductTableComponent } from "@/components/custom-table/productIndex";

interface iProps {
  handleEdit: (product: any) => void;
  handleView: (product: any) => void;
  handleDelete: (product: any) => void;
  setPageSize: React.Dispatch<React.SetStateAction<string>>;
  data?: any[];
  currentPage: any;
  onPageChange: (value: any) => void;
  pageSize: any;
  totalPages: any;
  loading: boolean;
}

const ProductDataTable: React.FC<iProps> = ({
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
  // ✅ Enhanced debugging
  console.log('📊 ProductDataTable Debug:', {
    data,
    dataType: typeof data,
    isArray: Array.isArray(data),
    dataLength: data?.length,
    firstItem: data?.[0],
    loading,
    currentPage,
    totalPages
  });

  // ✅ Robust data safety check
  const safeData = Array.isArray(data) ? data : [];

  if (loading) {
    return (
      <div className="text-center py-8">
        <p>Loading products...</p>
      </div>
    );
  }

  if (safeData.length === 0) {
    return (
      <div className="text-center py-8">
        <p>No products available</p>
      </div>
    );
  }

  const cellRenderers = {
    name: (item: any) => (
      <div className="font-medium flex items-center gap-3">
        <Image
          src={item.options?.[0]?.image?.[0] || "/images/bladmin-login.jpg"}
          width={36}
          height={36}
          alt="Product image"
          className="w-8 h-8 rounded-md"
          onError={(e) => {
            e.currentTarget.src = "/images/bladmin-login.jpg";
          }}
        />
        <div>
          <p>{item.name || "Unknown Product"}</p>
          <p className="font-normal text-xs text-[#A0AEC0]">
            {item.manufacturer?.name || "Unknown Manufacturer"}
          </p>
        </div>
      </div>
    ),

    price: (item: any) => (
      <div className="inline-flex items-center justify-center whitespace-nowrap px-3 py-2 font-medium text-black rounded-md">
        ₦{item.options?.[0]?.price?.toLocaleString() || 'N/A'}
      </div>
    ),

    category: (item: any) => (
      <div className="inline-flex items-center justify-center whitespace-nowrap px-3 py-2 font-medium text-black rounded-md">
        {item.category?.name || 'N/A'}
      </div>
    ),

    bulk: (item: any) => (
      <div>
        <div className="inline-flex items-center justify-center whitespace-nowrap px-3 py-2 font-medium text-black rounded-md">
          ₦{item.options?.[0]?.sellingPrice?.toLocaleString() || item.options?.[0]?.bulkPrice?.toLocaleString() || 'N/A'}
        </div>
        <p className="font-normal text-xs text-[#A0AEC0]">
          {item.options?.[0]?.markupType === "PERCENTAGE" ? "" : "₦"}
          {item.options?.[0]?.markupValue || 0}{" "}
          {item.options?.[0]?.markupType === "PERCENTAGE" ? "% OFF" : "OFF"}
        </p>
      </div>
    ),

    quantitySold: (item: any) => (
      <span className="font-medium">{item.totalSold || 0}</span>
    ),

    productid: (item: any) => (
      <div className="font-medium">#{item.id}</div>
    ),

    status: (item: any) => {
      const inventory = item.options?.[0]?.inventory || 0;
      const lowStockThreshold = item.options?.[0]?.lowStockThreshold || 10;

      return (
        <Badge
          variant="outline"
          className={`inline-flex items-center justify-center text-xs px-4 py-1 font-medium rounded-md ${inventory === 0
            ? "bg-[#FFEDEC] text-[#E03137]"
            : inventory <= lowStockThreshold
              ? "bg-[#CBD5E0] text-[#FFFFFF]"
              : "bg-[#E7F7EF] text-[#0CAF60]"
            }`}
        >
          {inventory === 0
            ? "Out of Stock"
            : inventory <= lowStockThreshold
              ? "Low Stock"
              : "In Stock"}
        </Badge>
      );
    },

    action: (item: any) => (
      <div className="flex gap-2.5">
        <div
          className="bg-[#27A376] p-2 rounded-lg cursor-pointer hover:bg-[#1f8a60] transition-colors"
          onClick={() => handleView(item)}
          title="View Product"
        >
          <ViewIcon />
        </div>
        <div
          className="bg-[#2F78EE] p-2 rounded-lg cursor-pointer hover:bg-[#2563eb] transition-colors"
          onClick={() => handleEdit(item)}
          title="Edit Product"
        >
          <EditIcon />
        </div>
        <div
          className="bg-[#E03137] p-2 rounded-lg cursor-pointer hover:bg-[#dc2626] transition-colors"
          onClick={() => handleDelete(item)}
          title="Delete Product"
        >
          <DeleteIcon />
        </div>
      </div>
    ),
  };

  const columnOrder = [
    "name",
    "price",
    "bulk",
    "quantitySold",
    "category",
    "productid",
    "status",
    "action",
  ];

  const columnLabels = {
    status: "Status",
    name: "Product Name",
    category: "Category",
    price: "Price",
    bulk: "Bulk price",
    quantitySold: "Qty Sold",
    action: "Actions",
    productid: "Product ID",
  };

  return (
    <ProductTableComponent
      tableData={safeData}
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

export default ProductDataTable;