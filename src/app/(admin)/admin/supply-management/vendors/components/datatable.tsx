"use client";

import { Badge } from "@/components/ui/badge";
import { VendorsData } from "@/types";
import { useState } from "react";
import { TableComponent } from "@/components/custom-table";
import { SelectFilter } from "@/app/(admin)/components/select-filter";
import { InputFilter } from "@/app/(admin)/components/input-filter";
import {
  DeleteIcon,
  EditIcon,
  ViewIcon,
} from "../../../../../../../public/icons";

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

  const tableData: VendorsData[] = [
    {
      id: 1,
      name: "Dangote",
      email: "dangote@gmail.com",
      contact: "Arogundade",
      totalproducts: "5,285",
      phonenumber: "09011221122",
      status: "Activated",
    },
    {
      id: 2,
      name: "Dangote",
      email: "dangote@gmail.com",
      contact: "Arogundade",
      totalproducts: "5,285",
      phonenumber: "09011221122",
      status: "Deactivated",
    },
    {
      id: 3,
      name: "Dangote",
      email: "dangote@gmail.com",
      contact: "Arogundade",
      totalproducts: "5,285",
      phonenumber: "09011221122",
      status: "Activated",
    },
  ];

  const cellRenderers = {
    name: (item: VendorsData) => (
      <div className="font-medium">
        <p> {item.name}</p>
        <p className="font-normal text-[0.75rem] text-[#A0AEC0]">
          {item.email}
        </p>
      </div>
    ),
    contact: (item: VendorsData) => (
      <div className="font-medium">{item.contact}</div>
    ),
    phonenumber: (item: VendorsData) => (
      <div className="font-medium">{item.phonenumber}</div>
    ),
    totalproducts: (item: VendorsData) => (
      <span className="font-medium">{item.totalproducts}</span>
    ),
    status: (item: VendorsData) => (
      <Badge
        variant={
          item.status.toLowerCase() === "activated" ? "success" : "destructive"
        }
        className="py-1 px-[26px] font-semibold"
      >
        {item.status.toUpperCase()}
      </Badge>
    ),
    action: (item: VendorsData) => (
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

  const columnOrder: (keyof VendorsData)[] = [
    "name",
    "contact",
    "phonenumber",
    "totalproducts",
    "status",
    "action",
  ];

  const columnLabels = {
    status: "Manufacturer Status",
    name: "Manufacturer Name",
    contact: "Contact Person",
    phonenumber: "Phone Number",
    totalproducts: "Total Products",
    action: "",
  };

  return (
    <div className="mx-6">
      <h6 className="font-semibold text-lg text-[#111827] mb-6">
        Detailed Vendor Table
      </h6>
      <div className="flex items-center gap-4 mb-6">
        <InputFilter setQuery={setFilter} />

        <SelectFilter
          setFilter={setRole}
          placeholder="Select Role"
          list={roleList}
        />
      </div>
      <TableComponent<VendorsData>
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
