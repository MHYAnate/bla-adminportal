"use client";

import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { TableComponent } from "@/components/custom-table";
import { ProductTableComponent } from "@/components/custom-table/productIndex";
import { formatMoney } from "@/lib/utils";
import { useMemo } from "react";

interface DataTableProps {
  data: any[];
  currentPage: number;
  onPageChange: (value: number) => void;
  pageSize: number;
  totalPages: number;
  setPageSize: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  currentPage,
  onPageChange,
  pageSize,
  totalPages,
  setPageSize,
  loading,
}) => {
  // Memoize cell renderers to prevent unnecessary re-renders
  const cellRenderers = useMemo(() => ({
    name: (item: any) => (
      <div className="font-medium flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={item?.product?.image || "/images/placeholder-product.png"}
            width={36}
            height={36}
            alt="Product image"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/placeholder-product.png";
            }}
          />
        </div>
        <div>
          <p className="font-medium">{item?.product?.name || "Unknown Product"}</p>
          <p className="font-normal text-[0.75rem] text-[#A0AEC0]">
            {item?.product?.category?.name || "No Category"}
          </p>
        </div>
      </div>
    ),
    price: (item: any) => (
      <div className="font-medium">
        {formatMoney(Number(item?.price) || 0)}
      </div>
    ),
    quantity: (item: any) => (
      <span className="font-medium">{item?.quantity || 0}</span>
    ),
    total: (item: any) => (
      <div className="font-medium">
        {formatMoney((Number(item?.price) || 0) * (Number(item?.quantity) || 0))}
      </div>
    ),
    status: (item: any) => {
      const status = item?.status || "pending";
      const getVariant = (status: string) => {
        switch (status.toLowerCase()) {
          case 'delivered':
          case 'completed':
            return 'success';
          case 'processing':
            return 'warning';
          case 'pending':
            return 'tertiary';
          case 'cancelled':
            return 'destructive';
          default:
            return 'secondary';
        }
      };

      return (
        <Badge variant={getVariant(status)} className="capitalize">
          {status}
        </Badge>
      );
    },
    productid: (item: any) => (
      <div className="font-medium text-gray-600">
        #{item?.product?.id || item?.productId || 'N/A'}
      </div>
    ),
  }), []);

  // Memoize column configuration
  const columnOrder: (keyof any)[] = useMemo(() => [
    "name",
    "price",
    "quantity",
    "total",
    "status",
    "productid",
  ], []);

  const columnLabels = useMemo(() => ({
    name: "Product Name",
    price: "Unit Price",
    quantity: "Quantity",
    total: "Total",
    status: "Status",
    productid: "Product ID",
  }), []);

  // Memoize processed data
  const processedData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    return data.map((item, index) => ({
      ...item,
      id: item.id || `item-${index}`,
      // Ensure required fields exist
      product: item.product || {},
      price: item.price || 0,
      quantity: item.quantity || 0,
      status: item.status || 'pending',
    }));
  }, [data]);

  // Memoize calculated total pages
  const calculatedTotalPages = useMemo(() => {
    return Math.ceil((processedData.length || 0) / pageSize);
  }, [processedData.length, pageSize]);

  if (loading) {
    return (
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="mb-4">
            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-16 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="mb-4">
          <h6 className="font-semibold text-lg text-[#111827]">
            Order Items ({processedData.length || 0})
          </h6>
        </div>

        {processedData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No order items found</p>
          </div>
        ) : (
          <ProductTableComponent<any>
            tableData={processedData}
            currentPage={currentPage}
            onPageChange={onPageChange}
            totalPages={calculatedTotalPages}
            cellRenderers={cellRenderers}
            columnOrder={columnOrder}
            columnLabels={columnLabels}
            isLoading={loading}
            showPagination={processedData.length > pageSize}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default DataTable;