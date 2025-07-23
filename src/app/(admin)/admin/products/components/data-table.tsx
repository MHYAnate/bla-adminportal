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
          src={item.options[0]?.image[0] ? item.options[0]?.image[0]:"/images/bladmin-login.jpg"}
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
    stock: (item: any) => (
      <div className="inline-flex items-center justify-center whitespace-nowrap px-3 py-2 font-medium text-black rounded-md">₦ {item.options[0]?.stockPrice
        || 'N/A'}</div>
    ),
    price: (item: any) => (
      <div className="inline-flex items-center justify-center whitespace-nowrap px-3 py-2 font-medium text-black rounded-md">₦ {item.options[0]?.price || 'N/A'}</div>
    ),
    bulk: (item: any) => (
      <div>
      <div className="inline-flex items-center justify-center whitespace-nowrap px-3 py-2 font-medium text-black rounded-md ">₦ {item.options[0]?.sellingPrice || 'N/A'}</div>
      <p className="font-normal text-xs text-[#A0AEC0]">
       {item.options[0]?.markupType === "PERCENTAGE"? "" : "₦"}{`${item.options[0]?.markupValue
}  `} {item.options[0]?.markupType === "PERCENTAGE"? "% OFF" : "OFF"} 
      </p>
    </div>
     
    ),
    quantity: (item: any) => (
      <span className="font-medium">{item.options[0]?.inventory || 0}</span>
    ),
    productid: (item: any) => (
      <div className="font-medium">#{item.id}</div>
    ),
    status: (item: any) => (
      // <Badge
      //   variant={item?.inventory == 0 ? "warning" : "outline"}
      //   className={item?.inventory == 0?"py-1 px-4 font-semibold":item?.inventory <= item?.lowStockThreshold?"py-1 px-4 font-semibold bg-[#7594c6]":"py-1 px-4 font-semibold bg-[#27A376]"}
      // >
      //   {item?.inventory == 0 ? "Out of Stock" :item?.inventory <= item?.lowStockThreshold ? "Low Stock":"In stock"}
      // </Badge>
      <Badge
  variant="outline"
  className={`inline-flex items-center justify-center whitespace-nowrap text-xs px-3 py-2 font-medium text-white rounded-md ${
    item.options[0]?.inventory === 0
      ? "bg-red-600"
      : item.options[0]?.inventory <= item.options[0]?.lowStockThreshold
      ? "bg-slate-500"
      : "bg-green-600"
  }`}
>
  {item.options[0]?.inventory === 0
    ? "Out of Stock"
    : item.options[0]?.inventory <= item.options[0]?.lowStockThreshold
    ? "Low Stock"
    : "In Stock"}
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
    "stock",
    "price",
    "bulk",
    "quantity",
    "productid",
    "status",
    "action",
  ];

  const columnLabels = {
    status: "Status",
    name: "Product Name",
    stock:"Stock price",
    price: "Retail price",
    bulk:"Bulk price",
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