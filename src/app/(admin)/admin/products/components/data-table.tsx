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
          src={item.options[0]?.image[0] ? item.options[0]?.image[0] : "/images/bladmin-login.jpg"}
          width={36}
          height={36}
          alt="Product image"
          className="w-8 h-8 rounded-md"
        />
        <div>
          <p>{item.name}</p>
          <p className="font-normal text-xs text-[#A0AEC0]">
            {item.manufacturer?.name || "Unknown Manufacturer"}
          </p>
        </div>
      </div>
    ),
    // stock: (item: any) => (
    //   <div className="inline-flex items-center justify-center whitespace-nowrap px-3 py-2 font-medium text-black rounded-md">₦ {item.options[0]?.stockPrice
    //     || 'N/A'}</div>
    // ),
    price: (item: any) => (
      <div className="inline-flex items-center justify-center whitespace-nowrap px-3 py-2 font-medium text-black rounded-md">₦ {item.options[0]?.price || 'N/A'}</div>
    ),
    bulk: (item: any) => (
      <div>
        <div className="inline-flex items-center justify-center whitespace-nowrap px-3 py-2 font-medium text-black rounded-md ">₦ {item.options[0]?.sellingPrice || 'N/A'}</div>
        <p className="font-normal text-xs text-[#A0AEC0]">
          {item.options[0]?.markupType === "PERCENTAGE" ? "" : "₦"}{`${item.options[0]?.markupValue
            }  `} {item.options[0]?.markupType === "PERCENTAGE" ? "% OFF" : "OFF"}
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
        className={`inline-flex items-center justify-center text-xs px-4 py-1 font-medium rounded-md ${item.options[0]?.inventory === 0
          ? "bg-[#FFEDEC] text-[#E03137]"
          : item.options[0]?.inventory <= item.options[0]?.lowStockThreshold
            ? "bg-[#CBD5E0] text-[#FFFFFF]"
            : "bg-[#E7F7EF] text-[#0CAF60]"
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
    // "stock",
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
    // stock: "Stock price",
    price: "Retail price",
    bulk: "Bulk price",
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



// "use client";

// import { Badge } from "@/components/ui/badge";
// import Image from "next/image";
// import { DeleteIcon, EditIcon, ViewIcon } from "../../../../../../public/icons";
// import { ProductTableComponent } from "@/components/custom-table/productIndex";

// interface iProps {
//   handleEdit: (product: any) => void;
//   handleView: (product: any) => void;
//   handleDelete: (product: any) => void;
//   setPageSize: React.Dispatch<React.SetStateAction<string>>;
//   data?: any[];
//   currentPage: any;
//   onPageChange: (value: any) => void;
//   pageSize: any;
//   totalPages: any;
//   loading: boolean;
// }

// const ProductDataTable: React.FC<iProps> = ({
//   handleEdit,
//   handleView,
//   handleDelete,
//   setPageSize,
//   data = [],
//   currentPage,
//   onPageChange,
//   pageSize,
//   totalPages,
//   loading,
// }) => {

//   const calculateBulkPrice = (option: any) => {
//     if (!option || option.discountType === "NONE" || !option.bulkDiscount || !option.price) {
//       return option?.stockPrice || 0;
//     }

//     let bulkPrice = option.price;
//     if (option.discountType === "PERCENTAGE") {
//       bulkPrice = option.price * (1 - option.bulkDiscount / 100);
//     } else if (option.discountType === "FIXED") {
//       bulkPrice = option.price - option.bulkDiscount;
//     }

//     return Math.max(0, bulkPrice);
//   };

//   const cellRenderers = {
//     image: (item: any) => (
//       <div className="w-12 h-12 relative rounded-lg overflow-hidden">
//         <Image
//           src={item.options[0]?.image?.[0] || "/images/bladmin-login.jpg"}
//           width={48}
//           height={48}
//           alt="Product image"
//           className="w-full h-full object-cover"
//         />
//       </div>
//     ),
//     name: (item: any) => (
//       <div className="min-w-[200px]">
//         <p className="font-medium text-sm text-gray-900">{item.name}</p>
//         <p className="text-xs text-gray-500 mt-1 line-clamp-2">
//           {item.shortDescription || "No description available"}
//         </p>
//       </div>
//     ),
//     category: (item: any) => (
//       <div className="font-medium text-sm text-gray-700">
//         {item.category?.name || "Uncategorized"}
//       </div>
//     ),
//     retailPrice: (item: any) => (
//       <div className="font-medium text-sm text-gray-900">
//         ₦{item.options[0]?.price?.toLocaleString() || '0'}
//       </div>
//     ),
//     bulkPrice: (item: any) => {
//       const bulkPrice = calculateBulkPrice(item.options[0]);
//       const hasDiscount = item.options[0]?.discountType !== "NONE" && item.options[0]?.bulkDiscount > 0;

//       return (
//         <div>
//           <div className="font-medium text-sm text-gray-900">
//             ₦{bulkPrice.toLocaleString()}
//           </div>
//           {hasDiscount && (
//             <p className="text-xs text-green-600 mt-1">
//               {item.options[0]?.discountType === "PERCENTAGE" ?
//                 `${item.options[0]?.bulkDiscount}% OFF` :
//                 `₦${item.options[0]?.bulkDiscount} OFF`
//               }
//             </p>
//           )}
//         </div>
//       );
//     },
//     quantitySold: (item: any) => (
//       <div className="font-medium text-sm text-gray-700">
//         {item.totalSold || 0}
//       </div>
//     ),
//     status: (item: any) => {
//       const inventory = item.options[0]?.inventory || 0;
//       const lowStockThreshold = item.options[0]?.lowStockThreshold || 5;

//       let status = "In Stock";
//       let colorClass = "bg-green-600";

//       if (inventory === 0) {
//         status = "Out of Stock";
//         colorClass = "bg-red-600";
//       } else if (inventory <= lowStockThreshold) {
//         status = "Low Stock";
//         colorClass = "bg-yellow-600";
//       }

//       return (
//         <Badge
//           variant="outline"
//           className={`inline-flex items-center justify-center whitespace-nowrap text-xs px-3 py-1 font-medium text-white rounded-full ${colorClass}`}
//         >
//           {status}
//         </Badge>
//       );
//     },
//     action: (item: any) => (
//       <div className="flex gap-2">
//         <div
//           className="bg-[#27A376] p-2 rounded-lg cursor-pointer hover:bg-[#1f8a60] transition-colors"
//           onClick={() => handleView(item)}
//           title="View Product"
//         >
//           <ViewIcon />
//         </div>
//         <div
//           className="bg-[#2F78EE] p-2 rounded-lg cursor-pointer hover:bg-[#2563eb] transition-colors"
//           onClick={() => handleEdit(item)}
//           title="Edit Product"
//         >
//           <EditIcon />
//         </div>
//         <div
//           className="bg-[#E03137] p-2 rounded-lg cursor-pointer hover:bg-[#dc2626] transition-colors"
//           onClick={() => handleDelete(item)}
//           title="Delete Product"
//         >
//           <DeleteIcon />
//         </div>
//       </div>
//     ),
//   };

//   const columnOrder = [
//     "image",
//     "name",
//     "category",
//     "retailPrice",
//     "bulkPrice",
//     "quantitySold",
//     "status",
//     "action",
//   ];

//   const columnLabels = {
//     image: "Image",
//     name: "Product Name",
//     category: "Category",
//     retailPrice: "Retail Price",
//     bulkPrice: "Bulk Price",
//     quantitySold: "Quantity Sold",
//     status: "Status",
//     action: "Actions",
//   };

//   return (
//     <ProductTableComponent
//       tableData={data}
//       currentPage={currentPage}
//       onPageChange={onPageChange}
//       totalPages={totalPages}
//       cellRenderers={cellRenderers}
//       columnOrder={columnOrder}
//       columnLabels={columnLabels}
//       setFilter={setPageSize}
//       isLoading={loading}
//     />
//   );
// };

// export default ProductDataTable;