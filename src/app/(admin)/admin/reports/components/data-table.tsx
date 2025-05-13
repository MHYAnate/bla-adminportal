"use client";

import Image from "next/image";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteIcon, ViewIcon } from "../../../../../../public/icons";
import { TableComponent } from "@/components/custom-table";
import { ReportTableComponent } from "@/components/custom-table/reportIndex";
import { SelectFilter } from "@/app/(admin)/components/select-filter";
import { InputFilter } from "@/app/(admin)/components/input-filter";
import { ReportsData } from "@/types";

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

  const tableData: ReportsData[] = [
    {
      id: 1,
      name: "Jennifer Lawal",
      customertype: "Admin",
      ordercount: 5,
      totalsales: "68,000.00",
      aov: "68,000.00",
      email: "mirabel@gmail.com",
    },
    {
      id: 2,
      name: "Hanna Baptista",
      customertype: "Admin",
      ordercount: 5,
      totalsales: "68,000.00",
      aov: "68,000.00",
      email: "mirabel@gmail.com",
    },
    {
      id: 3,
      name: "Lawal Mutiu",
      customertype: "Admin",
      ordercount: 5,
      totalsales: "68,000.00",
      aov: "68,000.00",
      email: "mirabel@gmail.com",
    },
  ];

  const cellRenderers = {
    name: (item: ReportsData) => (
      <div className="font-normal flex items-center gap-3">
        <Image
          src="/images/user-avatar.png"
          width={24}
          height={24}
          alt="Admin avatar"
          className="w-6 h-6 rounded-full"
        />
        <div>
          <p>{item.name}</p>
          <p className="font-normal text-[0.75rem] text-[#A0AEC0]">
            {item.email}
          </p>
        </div>
      </div>
    ),
    customertype: (item: ReportsData) => (
      <div className="font-normal">{item.customertype}</div>
    ),
    totalsales: (item: ReportsData) => (
      <span className="font-normal">NGN {item.totalsales}</span>
    ),
    aov: (item: ReportsData) => (
      <div className="font-normal">NGN {item.aov}</div>
    ),
    ordercount: (item: ReportsData) => (
      <span className="font-normal">{item.ordercount}</span>
    ),

    action: (item: ReportsData) => (
      <div className="flex gap-2.5">
        <div className="bg-[#27A376] p-2.5 rounded-lg">
          <ViewIcon />
        </div>
        <div className="bg-[#E03137] p-2.5 rounded-lg">
          <DeleteIcon />
        </div>
      </div>
    ),
  };

  const columnOrder: (keyof ReportsData)[] = [
    "name",
    "customertype",
    "totalsales",
    "aov",
    "ordercount",
    "action",
  ];

  const columnLabels = {
    name: "Customer Name",
    customertype: "Customer Type",
    totalsales: "Total Sales",
    action: "",
    aov: "AOV",
    ordercount: "Order Count",
  };

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <h6 className="font-semibold text-lg text-[#111827] mb-6">
          Detailed Metrics Table
        </h6>

        <div className="flex items-center gap-4 mb-6">
          <InputFilter setQuery={setFilter} placeholder="Search customers" />

          <SelectFilter
            setFilter={setRole}
            placeholder="Customer Type"
            list={roleList}
          />
          <SelectFilter setFilter={setRole} list={roleList} placeholder="AOV" />
        </div>
        <ReportTableComponent<ReportsData>
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
