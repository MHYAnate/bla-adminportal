"use client";

import { Badge } from "@/components/ui/badge";
import { ProductData } from "@/types";
import Image from "next/image";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TableComponent } from "@/components/custom-table";

const DataTable: React.FC = () => {
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const tableData: ProductData[] = [
    {
      id: 1,
      productname: "Rice",
      price: "55,000",
      quantity: 50,
      productid: "#123456",
      status: "In stock",
    },
    {
      id: 2,
      productname: "Spagetti",
      price: "55,000",
      quantity: 50,
      productid: "#123456",
      status: "Out of stock",
    },
    {
      id: 3,
      productname: "Nescafe Classic Coffe",
      price: "55,000",
      quantity: 50,
      productid: "#123456",
      status: "In stock",
    },
    {
      id: 4,
      productname: "Cowpea",
      price: "55,000",
      quantity: 50,
      productid: "#123456",
      status: "Out of stock",
    },
  ];

  const cellRenderers = {
    name: (item: ProductData) => (
      <div className="font-medium flex items-center gap-3">
        <Image
          src="/images/user-avatar.png"
          width={36}
          height={36}
          alt="Admin avatar"
          className="w-9 h-9 rounded-full"
        />
        <div>
          <p> {item.productname}</p>
          <p className="font-normal text-[0.75rem] text-[#A0AEC0]">Cocoa</p>
        </div>
      </div>
    ),
    price: (item: ProductData) => (
      <div className="font-medium">NGN{item.price}</div>
    ),
    quantity: (item: ProductData) => (
      <span className="font-medium">{item.quantity}</span>
    ),
    productid: (item: ProductData) => (
      <div className="font-medium">{item.productid}</div>
    ),
  };

  const columnOrder: (keyof ProductData)[] = [
    "name",
    "price",
    "quantity",
    "productid",
  ];

  const columnLabels = {
    name: "Prroduct Name",
    price: "Price",
    quantity: "Quantity",
    productid: "Product ID",
  };

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <TableComponent<ProductData>
          tableData={tableData}
          currentPage={currentPage}
          onPageChange={onPageChange}
          totalPages={Math.ceil(tableData.length / pageSize)}
          cellRenderers={cellRenderers}
          columnOrder={columnOrder}
          columnLabels={columnLabels}
        />
      </CardContent>
    </Card>
  );
};

export default DataTable;
