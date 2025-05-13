"use client";

import { Badge } from "@/components/ui/badge";
import { InventoryData } from "@/types";
import Image from "next/image";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { InventoryTableComponent } from "@/components/custom-table/indexInventry";
import { SelectFilter } from "@/app/(admin)/components/select-filter";
import {
  DeleteIcon,
  EditIcon,
  ViewIcon,
} from "../../../../../../../public/icons";

interface iProps {
  handleEdit?: () => void;
  handleView?: () => void;
  handleDelete?: () => void;
}

const DataTable: React.FC<iProps> = ({
  handleEdit,
  handleView,
  handleDelete,
}) => {
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [role, setRole] = useState<string>("");
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

  const tableData: InventoryData[] = [
    {
      id: 1,
      productname: "Rice",
      currentStock: "55,000",
      minStockLimit: "55,000",
      maxStockLimit: "55,000",
      status: "In stock",
    },
    {
      id: 2,
      productname: "Rice",
      currentStock: "55,000",
      minStockLimit: "55,000",
      maxStockLimit: "55,000",
      status: "Out of stock",
    },
    {
      id: 3,
      productname: "Rice",
      currentStock: "55,000",
      minStockLimit: "55,000",
      maxStockLimit: "55,000",
      status: "In stock",
    },
    {
      id: 4,
      productname: "Rice",
      currentStock: "55,000",
      minStockLimit: "55,000",
      maxStockLimit: "55,000",
      status: "Out of stock",
    },
  ];

  const cellRenderers = {
    name: (item: InventoryData) => (
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
    currentStock: (item: InventoryData) => (
      <div className="font-medium">{item.currentStock}</div>
    ),
    minStockLimit: (item: InventoryData) => (
      <span className="font-medium">{item.minStockLimit}</span>
    ),
    maxStockLimit: (item: InventoryData) => (
      <div className="font-medium">{item.maxStockLimit}</div>
    ),
    status: (item: InventoryData) => (
      <Badge
        variant={
          item.status.toLowerCase() === "in stock" ? "success" : "destructive"
        }
        className="py-1 px-[26px] font-semibold"
      >
        {item.status.toUpperCase()}
      </Badge>
    ),
    action: (item: InventoryData) => (
      <div className="flex gap-2.5">
        <div className="bg-[#27A376] p-2.5 rounded-lg" onClick={handleView}>
          <ViewIcon />
        </div>
        <div className="bg-[#2F78EE] p-2.5 rounded-lg" onClick={handleEdit}>
          <EditIcon />
        </div>
        <div className="bg-[#E03137] p-2.5 rounded-lg" onClick={handleDelete}>
          <DeleteIcon />
        </div>
      </div>
    ),
  };

  const columnOrder: (keyof InventoryData)[] = [
    "name",
    "currentStock",
    "minStockLimit",
    "maxStockLimit",
    "status",
    "action",
  ];

  const columnLabels = {
    status: " Status",
    name: "Prroduct Name",
    currentStock: "Current Stock",
    minStockLimit: "Min. Stock Limit",
    action: "",
    maxStockLimit: "Max Stock Limit",
  };

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-6 justify-between">
          <h6 className="font-semibold text-lg text-[#111827]">
            Inventory List
          </h6>
          {/* <InputFilter setQuery={setFilter} /> */}

          <SelectFilter
            setFilter={setRole}
            placeholder="Select Role"
            list={roleList}
          />
        </div>
        <InventoryTableComponent<InventoryData>
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
