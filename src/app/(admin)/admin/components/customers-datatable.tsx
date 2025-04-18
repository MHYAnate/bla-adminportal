"use client";

import { Badge } from "@/components/ui/badge";
import { CustomersData } from "@/types";
import Image from "next/image";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TableComponent } from "@/components/custom-table";
import Link from "next/link";
import { ViewIcon } from "../../../../../public/icons";
import { ROUTES } from "@/constant/routes";
import { capitalizeFirstLetter } from "@/lib/utils";
interface iProps {
  data?: any;
  loading: boolean;
}

const CustomersDataTable: React.FC<iProps> = ({ data, loading }) => {
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const cellRenderers = {
    fullName: (item: CustomersData) => (
      <div className="font-medium flex items-center gap-3">
        <Image
          src="/images/user-avatar.png"
          width={24}
          height={24}
          alt="Admin avatar"
          className="w-6 h-6 rounded-full"
        />
        <div>
          <p> {item?.name || "----"}</p>
          <p className="font-normal text-[0.75rem] text-[#A0AEC0]">
            {item?.email || "lincoln@unpixel.com"}
          </p>
        </div>
      </div>
    ),
    type: (item: CustomersData) => (
      <span className="font-medium">
        {capitalizeFirstLetter(item?.type?.toString() || "customer")}
      </span>
    ),
    id: (item: CustomersData) => (
      <div className="font-medium flex items-center gap-3">{item?.id}</div>
    ),
    kyc: (item: CustomersData) => (
      <Badge
        variant={
          item.kycStatus.toLowerCase() === "verified"
            ? "success"
            : item.kycStatus.toLowerCase() === "pending"
            ? "tertiary"
            : item.kycStatus.toLowerCase() === "flagged"
            ? "destructive"
            : "warning"
        }
        className="py-1 px-[26px] font-bold text-[10px]"
      >
        {item?.kycStatus?.toString().toUpperCase()}
      </Badge>
    ),
    status: (item: CustomersData) => (
      <Badge
        variant={
          item?.status?.toString().toLowerCase() === "active"
            ? "success"
            : "destructive"
        }
        className="py-1 px-[26px] font-bold text-[10px]"
      >
        {item.status}
      </Badge>
    ),
    action: (item: CustomersData) => (
      <div className="flex gap-2.5">
        <Link
          href={`${ROUTES.ADMIN.SIDEBAR.CUSTOMERS}/${item?.id}?tab=general`}
          className="bg-[#27A376] p-2.5 rounded-lg"
        >
          <ViewIcon />
        </Link>
      </div>
    ),
  };

  const columnOrder: (keyof CustomersData)[] = [
    "fullName",
    "type",
    "id",
    "kyc",
    "status",
    "action",
  ];

  const columnLabels = {
    fullName: "Name",
    type: "Customer Type",
    id: "Customer ID",
    status: "Customer Status",
    kyc: "KYC",
    action: "Action",
  };

  return (
    <Card className="bg-white flex-1">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h6 className="font-semibold text-lg text-[#111827]">
            Recent Customers
          </h6>
          <Link
            href={ROUTES.ADMIN.SIDEBAR.CUSTOMERS}
            className="text-sm font-medium text-[#687588] underline border border-[#E9EAEC] rounded-md px-[3.56rem] py-4"
          >
            View All
          </Link>
        </div>
        <TableComponent<CustomersData>
          tableData={data}
          currentPage={currentPage}
          onPageChange={onPageChange}
          totalPages={Math.ceil(data?.length / pageSize)}
          cellRenderers={cellRenderers}
          columnOrder={columnOrder}
          columnLabels={columnLabels}
          isLoading={loading}
          showPagination={false}
        />
      </CardContent>
    </Card>
  );
};

export default CustomersDataTable;
