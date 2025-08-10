"use client";

import { Badge } from "@/components/ui/badge";
import { CustomersData } from "@/types";
import Image from "next/image";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CustomerTableComponent } from "@/components/custom-table/index2";
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

  // ✅ CRITICAL FIX: Filter out admin users - only show business and individual customers
  const filteredData = (data || []).filter((item: CustomersData) => {
    const customerType =
      (item?.customerType !== undefined && item?.customerType !== null
        ? String(item.customerType)
        : "") ||
      (item?.type !== undefined && item?.type !== null
        ? String(item.type)
        : "");

    const customerTypeLower = customerType.toLowerCase();

    return customerTypeLower === "business" || customerTypeLower === "individual";
  });


  console.log('🔍 CustomersDataTable Debug:', {
    originalDataLength: data?.length || 0,
    filteredDataLength: filteredData.length,
    customerTypes: filteredData.map((item: CustomersData) => item?.customerType || item?.type)
  });

  const cellRenderers = {
    fullName: (item: CustomersData) => (
      <div className="font-medium flex items-center gap-3">
        <Image
          src="/images/user-avatar.png"
          width={24}
          height={24}
          alt="Customer avatar"
          className="w-6 h-6 rounded-full"
        />
        <div>
          {/* ✅ ENHANCED: Handle both 'name' and potential other field names */}
          <p>{item?.name || item?.fullName || "----"}</p>
          <p className="font-normal text-[0.75rem] text-[#A0AEC0]">
            {item?.email || "No email provided"}
          </p>
        </div>
      </div>
    ),

    type: (item: CustomersData) => (
      <span className="font-medium">
        {/* ✅ ENHANCED: Handle both customerType and type fields */}
        {capitalizeFirstLetter(
          item?.customerType?.toString() ||
          item?.type?.toString() ||
          "customer"
        )}
      </span>
    ),

    id: (item: CustomersData) => (
      <div className="font-medium flex items-center gap-3">{item?.id}</div>
    ),

    kyc: (item: CustomersData) => {
      // ✅ ENHANCED: Handle multiple KYC field variations
      const kycStatus = item?.kycStatus || item?.kyc || 'pending';
      const statusLower = kycStatus.toString().toLowerCase();

      return (
        <Badge
          variant={
            statusLower === "verified"
              ? "success"
              : statusLower === "pending" || statusLower === "not verified"
                ? "tertiary"
                : statusLower === "flagged"
                  ? "destructive"
                  : "warning"
          }
          className="py-1 px-[26px] font-bold text-[10px]"
        >
          {kycStatus.toString().toUpperCase()}
        </Badge>
      );
    },

    status: (item: CustomersData) => {
      // ✅ ENHANCED: Handle both customerStatus and status fields
      const customerStatus = item?.customerStatus || item?.status || 'INACTIVE';
      const statusLower = customerStatus.toString().toLowerCase();

      return (
        <Badge
          variant={
            statusLower === "active"
              ? "success"
              : statusLower === "inactive"
                ? "tertiary"
                : statusLower === "suspended"
                  ? "destructive"
                  : "warning"
          }
          className="py-1 px-[26px] font-bold text-[10px]"
        >
          {customerStatus.toString().toUpperCase()}
        </Badge>
      );
    },

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

        {/* ✅ Show filtered data count in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-2 bg-blue-50 rounded text-xs">
            <strong>🔍 Recent Customers Debug:</strong> Showing {filteredData.length} customers
            (filtered from {data?.length || 0} total)
          </div>
        )}

        <CustomerTableComponent<CustomersData>
          tableData={filteredData} // ✅ Use filtered data instead of raw data
          currentPage={currentPage}
          onPageChange={onPageChange}
          totalPages={Math.ceil(filteredData.length / pageSize)} // ✅ Calculate based on filtered data
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