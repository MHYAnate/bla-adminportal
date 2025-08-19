// Update your src/app/(admin)/admin/components/customers-datatable.tsx

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
import { CustomerStatusDropdown } from "./customer-status-dropdown";

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

  const handleStatusUpdate = (customerId: string | number, newStatus: string) => {
    console.log(`Dashboard: Customer ${customerId} status updated to ${newStatus}`);
    // The table will automatically refresh due to query invalidation in the hook
  };

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
          <p>{item?.name || item?.fullName || "----"}</p>
          <p className="font-normal text-[0.75rem] text-[#A0AEC0]">
            {item?.email || "No email provided"}
          </p>
        </div>
      </div>
    ),

    type: (item: CustomersData) => (
      <span className="font-medium">
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

    // Updated status cell with proper null checking
    status: (item: CustomersData) => {
      // Handle case where ID might be undefined
      if (!item?.id) {
        const customerStatus = item?.customerStatus || item?.status || 'INACTIVE';
        return (
          <Badge
            variant={
              customerStatus.toString().toLowerCase() === "active"
                ? "success"
                : customerStatus.toString().toLowerCase() === "inactive"
                  ? "tertiary"
                  : customerStatus.toString().toLowerCase() === "flagged"
                    ? "destructive"
                    : "warning"
            }
            className="py-1 px-[26px] font-bold text-[10px]"
          >
            {customerStatus.toString().toUpperCase()}
          </Badge>
        );
      }

      const customerStatus = item?.customerStatus || item?.status || 'INACTIVE';

      return (
        <CustomerStatusDropdown
          customer={{
            id: item.id, // We've already checked this exists above
            status: customerStatus,
            email: item?.email ? String(item.email) : '',
            name: (item?.name || item?.fullName) ? String(item?.name || item?.fullName) : ''
          }}
          onStatusUpdate={handleStatusUpdate}
          disabled={false}
        />
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
        <CustomerTableComponent<CustomersData>
          tableData={data || []}
          currentPage={currentPage}
          onPageChange={onPageChange}
          totalPages={Math.ceil((data?.length || 0) / pageSize)}
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