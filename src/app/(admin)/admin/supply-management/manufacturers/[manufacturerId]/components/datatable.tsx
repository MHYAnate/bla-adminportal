"use client";

import { Badge } from "@/components/ui/badge";
import { ManufacturerData } from "@/types";
import { useState } from "react";
import { TableComponent } from "@/components/custom-table";
import { SelectFilter } from "@/app/(admin)/components/select-filter";
import { InputFilter } from "@/app/(admin)/components/input-filter";
import {
  DeleteIcon,
  EditIcon,
  ViewIcon,
} from "../../../../../../../../public/icons";

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

  const tableData: ManufacturerData[] = [
    {
      id: 1,
      productname: "Rice",
      price: "55,000",
      category: "Grains",
      stocklevel: 50,
      skuid: "#123456",
      status: "Over stock",
      amount: "65,000",
    },
    {
      id: 2,
      productname: "Rice",
      price: "55,000",
      category: "Grains",
      stocklevel: 50,
      skuid: "#123456",
      status: "Low stock",
      amount: "65,000",
    },
    {
      id: 3,
      productname: "Rice",
      price: "55,000",
      category: "Caripa Papaye",
      stocklevel: 50,
      skuid: "#123456",
      status: "Out of stock",
      amount: "65,000",
    },
  ];

  const cellRenderers = {
    name: (item: ManufacturerData) => (
      <div className="font-medium">
        <p> {item.productname}</p>
        <p className="font-normal text-[0.75rem] text-[#A0AEC0]">
          {item.amount}
        </p>
      </div>
    ),
    category: (item: ManufacturerData) => (
      <div className="font-medium">{item.category}</div>
    ),
    skuid: (item: ManufacturerData) => (
      <span className="font-medium">{item.skuid}</span>
    ),
    stocklevel: (item: ManufacturerData) => (
      <div className="font-medium">{item.stocklevel}</div>
    ),
    status: (item: ManufacturerData) => (
      <Badge
        variant={
          item.status.toLowerCase() === "over stock"
            ? "success"
            : item.status.toLowerCase() === "low stock"
            ? "warning"
            : "destructive"
        }
        className="py-1 px-[26px] font-semibold"
      >
        {item.status.toUpperCase()}
      </Badge>
    ),
    action: (item: ManufacturerData) => (
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

  const columnOrder: (keyof ManufacturerData)[] = [
    "name",
    "category",
    "skuid",
    "stocklevel",
    "status",
    "action",
  ];

  const columnLabels = {
    status: "Product Status",
    name: "Prroduct Name",
    category: "Category",
    skuid: "SKU/ID",
    stocklevel: "Stock Level",
    action: "",
  };

  return (
    <div className="mx-6">
      <h6 className="font-semibold text-lg text-[#111827] mb-6">
        Detailed Manufacturers Table
      </h6>
      <div className="flex items-center gap-4 mb-6">
        <InputFilter setQuery={setFilter} />

        <SelectFilter
          setFilter={setRole}
          placeholder="Select Role"
          list={roleList}
        />
      </div>
      <TableComponent<ManufacturerData>
        tableData={tableData}
        currentPage={currentPage}
        onPageChange={onPageChange}
        totalPages={Math.ceil(tableData.length / pageSize)}
        cellRenderers={cellRenderers}
        columnOrder={columnOrder}
        columnLabels={columnLabels}
      />
    </div>
  );
};

export default DataTable;
