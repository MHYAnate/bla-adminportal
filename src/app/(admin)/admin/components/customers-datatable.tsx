"use client";

import { Badge } from "@/components/ui/badge";
import { CustomersData } from "@/types";
import Image from "next/image";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TableComponent } from "@/components/custom-table";
import Link from "next/link";

const CustomersDataTable: React.FC = () => {
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };
  const tableData: CustomersData[] = [
    {
      id: "1",
      customername: "Alice Johnson",
      customertype: "Individual",
      customerid: "CUST001",
      customerstatus: "Active",
      kyc: "Verified",
    },
    {
      id: "2",
      customername: "Bob Williams",
      customertype: "Business Owner",
      customerid: "CUST002",
      customerstatus: "Inactive",
      kyc: "Flagged",
    },
    {
      id: "3",
      customername: "Charlie Brown",
      customertype: "Individual",
      customerid: "CUST003",
      customerstatus: "Active",
      kyc: "Under Review",
    },
    {
      id: "4",
      customername: "Diana Smith",
      customertype: "Individual",
      customerid: "CUST004",
      customerstatus: "Inactive",
      kyc: "Verified",
    },
    {
      id: "5",
      customername: "Ethan Martinez",
      customertype: "Business Owner",
      customerid: "CUST005",
      customerstatus: "Active",
      kyc: "Flagged",
    },
  ];

  const cellRenderers = {
    name: (item: CustomersData) => (
      <div className="font-medium flex items-center gap-3">
        <Image
          src="/images/user-avatar.png"
          width={24}
          height={24}
          alt="Admin avatar"
          className="w-6 h-6 rounded-full"
        />
        <div>
          <p> {item.customername}</p>
          <p className="font-normal text-[0.75rem] text-[#A0AEC0]">
            {item?.email || "lincoln@unpixel.com"}
          </p>
        </div>
      </div>
    ),
    customertype: (item: CustomersData) => (
      <span className="font-medium">{item.customertype}</span>
    ),
    customerid: (item: CustomersData) => (
      <div className="font-medium flex items-center gap-3">
        {item.customerid}
      </div>
    ),
    kyc: (item: CustomersData) => (
      <Badge
        variant={
          item.kyc.toLowerCase() === "verified"
            ? "success"
            : item.kyc.toLowerCase() === "pending"
            ? "tertiary"
            : item.kyc.toLowerCase() === "flagged"
            ? "destructive"
            : "warning"
        }
        className="py-1 px-[26px] font-bold text-[10px]"
      >
        {item.kyc.toUpperCase()}
      </Badge>
    ),
    customerstatus: (item: CustomersData) => (
      <div className="font-medium flex items-center gap-3">
        {item.customerstatus}
      </div>
    ),
  };

  const columnOrder: (keyof CustomersData)[] = [
    "customername",
    "customertype",
    "customerid",
    "kyc",
    "customerstatus",
  ];

  const columnLabels = {
    customername: "Name",
    customertype: "Customer Type",
    customerid: "Customer ID",
    customerstatus: "Customer Status",
    kyc: "KYC",
  };

  return (
    <Card className="bg-white flex-1">
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <h6 className="font-semibold text-lg text-[#111827] mb-1">
            Top 5 Customers
          </h6>
          <Link href="#" className="text-sm font-medium underline">
            View All
          </Link>
        </div>

        <TableComponent<CustomersData>
          tableData={tableData}
          currentPage={currentPage}
          onPageChange={onPageChange}
          totalPages={Math.ceil(tableData.length / pageSize)}
          cellRenderers={cellRenderers}
          columnOrder={columnOrder}
          columnLabels={columnLabels}
        />
        <div className="border-t pt-2 mt-2 border-[#E9EAEC] flex justify-between items-center mb-2">
          <h6 className="font-semibold text-lg text-[#111827] mb-1">
            Top 5 Business Owners
          </h6>
          <Link href="#" className="text-sm font-medium underline">
            View All
          </Link>
        </div>

        <TableComponent<CustomersData>
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

export default CustomersDataTable;
