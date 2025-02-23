"use client";

import { StockData } from "@/types";
import { useState } from "react";
import { TableComponent } from "@/components/custom-table";
import { SelectFilter } from "@/app/(admin)/components/select-filter";
import { InputFilter } from "@/app/(admin)/components/input-filter";
import {
  CalendarIcon,
  DeleteIcon,
  EditIcon,
  ViewIcon,
} from "../../../../../../public/icons";
import Image from "next/image";

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

  const tableData = [
    {
      productname: "Smartphone",
      createddate: "2025-02-10",
      costprice: "45,000",
      sellingprice: "65,000",
      change: "increase",
      role: "Admin",
      updatedby: "Kazeem",
    },
    {
      productname: "Laptop",
      createddate: "2025-01-20",
      costprice: "80,000",
      sellingprice: "100,000",
      change: "increase",
      role: "Manager",
      updatedby: "Kazeem",
    },
    {
      productname: "Headphones",
      createddate: "2025-02-05",
      costprice: "8,000",
      sellingprice: "12,000",
      change: "increase",
      role: "User",
      updatedby: "Kazeem",
    },
  ];

  const cellRenderers = {
    productname: (item: StockData) => (
      <div className="font-normal flex items-center gap-3">
        <Image
          src="/images/user-avatar.png"
          width={36}
          height={36}
          alt="Admin avatar"
          className="w-9 h-9 rounded-full"
        />
        <div>
          <p>{item.productname}</p>
          <p className="font-normal text-[0.75rem] text-[#A0AEC0]">Coffee</p>
        </div>
      </div>
    ),
    createddate: (item: StockData) => (
      <div className="font-medium flex items-center gap-3">
        <CalendarIcon />
        <p>{item.createddate}</p>
      </div>
    ),
    costprice: (item: StockData) => (
      <span className="font-medium">₦{item.costprice}</span>
    ),
    sellingprice: (item: StockData) => (
      <span className="font-medium">₦{item.sellingprice}</span>
    ),
    change: (item: StockData) => (
      <div className="font-medium">{item.change}%</div>
    ),
    updatedby: (item: StockData) => (
      <div className="font-normal flex items-center gap-3">
        <Image
          src="/images/user-avatar.png"
          width={24}
          height={24}
          alt="Admin avatar"
          className="w-6 h-6 rounded-full"
        />
        <div>
          <p>{item.updatedby}</p>
          <p className="font-normal text-[0.75rem] text-[#A0AEC0]">
            {item.role}
          </p>
        </div>
      </div>
    ),
    action: (item: StockData) => (
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

  const columnOrder: (keyof StockData)[] = [
    "productname",
    "createddate",
    "costprice",
    "sellingprice",
    "change",
    "updatedby",
    "action",
  ];

  const columnLabels = {
    productname: "Product Name",
    createddate: "Created Date",
    costprice: "Cost Price",
    sellingprice: "Selling Price",
    change: "Change (%)",
    updatedby: "Updated By",
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
      <TableComponent<StockData>
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
