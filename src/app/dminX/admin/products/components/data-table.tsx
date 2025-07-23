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
  const cellRenderers = {
    name: (item: any) => (
      <div className="font-medium flex items-center gap-3">
        <Image
          src="/images/user-avatar.png"
          width={36}
          height={36}
          alt="Product image"
          className="w-9 h-9 rounded-full"
        />
        <div>
          <p>{item.name}</p>
          <p className="font-normal text-xs text-[#A0AEC0]">
            {item.description}
          </p>
        </div>
      </div>
    ),
    price: (item: any) => (
      <div className="font-medium">NGN {item.options?.price || 'N/A'}</div>
    ),
    quantity: (item: any) => (
      <span className="font-medium">{item.options?.inventory || 0}</span>
    ),
    productid: (item: any) => (
      <div className="font-medium">#{item.id}</div>
    ),
    status: (item: any) => (
      <Badge
        variant={item.isActive ? "success" : "destructive"}
        className="py-1 px-4 font-semibold"
      >
        {item.isActive ? "ACTIVE" : "INACTIVE"}
      </Badge>
    ),
    action: (item: any) => (
      <div className="flex gap-2.5">
        <div 
          className="bg-[#27A376] p-2 rounded-lg cursor-pointer" 
          onClick={() => handleView(item)}
        >
          <ViewIcon />
        </div>
        <div 
          className="bg-[#2F78EE] p-2 rounded-lg cursor-pointer" 
          onClick={() => handleEdit(item)}
        >
          <EditIcon />
        </div>
        <div 
          className="bg-[#E03137] p-2 rounded-lg cursor-pointer" 
          onClick={() => handleDelete(item)}
        >
          <DeleteIcon />
        </div>
      </div>
    ),
  };

  const columnOrder = [
    "name",
    "price",
    "quantity",
    "productid",
    "status",
    "action",
  ];

  const columnLabels = {
    status: "Status",
    name: "Product Name",
    price: "Price",
    quantity: "Quantity",
    action: "Actions",
    productid: "ID",
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

export default ProductDataTable;