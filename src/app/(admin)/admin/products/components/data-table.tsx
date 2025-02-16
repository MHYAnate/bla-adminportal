"use client";

import { Badge } from "@/components/ui/badge";
import { ProductData, AdminsData } from "@/types";
import Image from "next/image";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteIcon, EditIcon, ViewIcon } from "../../../../../../public/icons";
import { TableComponent } from "@/components/custom-table";
import { SelectFilter } from "@/app/(admin)/components/select-filter";
import { InputFilter } from "@/app/(admin)/components/input-filter";

const DataTable: React.FC = () => {
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [role, setRole] = useState<string>("");
  const [filter, setFilter] = useState<string>("");
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };
  const roleList = [
    {
      text: "Admin",
      value: "admin",
    },
    {
      text: "Super Admin",
      value: "super-admin",
    },
  ];

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
    status: (item: ProductData) => (
      <Badge
        variant={
          item.status.toLowerCase() === "in stock" ? "success" : "destructive"
        }
        className="py-1 px-[26px] font-semibold"
      >
        {item.status.toUpperCase()}
      </Badge>
    ),
    action: (item: ProductData) => (
      <div className="flex gap-2.5">
        <div className="bg-[#27A376] p-2.5 rounded-lg">
          <ViewIcon />
        </div>
        <div className="bg-[#2F78EE] p-2.5 rounded-lg">
          <EditIcon />
        </div>
        <div className="bg-[#E03137] p-2.5 rounded-lg">
          <DeleteIcon />
        </div>
      </div>
    ),
  };

  const columnOrder: (keyof AdminsData)[] = [
    "name",
    "price",
    "quantity",
    "productid",
    "status",
    "action",
  ];

  const columnLabels = {
    status: "Product Status",
    name: "Prroduct Name",
    price: "Price",
    quantity: "Quantity",
    action: "",
    productid: "Product ID",
  };

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <h6 className="font-semibold text-lg text-[#111827] mb-6">
          Detailed Product Table
        </h6>
        <div className="flex items-center gap-4 mb-6">
          <InputFilter setQuery={setFilter} />

          <SelectFilter
            setFilter={setRole}
            placeholder="Select Role"
            list={roleList}
          />
        </div>
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
