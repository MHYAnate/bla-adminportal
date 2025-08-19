// Update your src/app/(admin)/admin/customers/components/data-table.tsx

"use client";

import { Badge } from "@/components/ui/badge";
import { CustomersData } from "@/types";
import Image from "next/image";
import { CustomerTableComponent } from "@/components/custom-table/index2";
import { ViewIcon } from "../../../../../../public/icons";
import Link from "next/link";
import { ROUTES } from "@/constant/routes";
import { capitalizeFirstLetter } from "@/lib/utils";
import { CustomerStatusDropdown } from "../../components/customer-status-dropdown";

interface iProps {
  data?: any;
  currentPage: number;
  onPageChange: (value: number) => void;
  handleDelete?: () => void;
  pageSize: number;
  totalPages: number;
  setPageSize: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
}

const DataTable: React.FC<iProps> = ({
  data,
  currentPage,
  onPageChange,
  pageSize,
  totalPages,
  setPageSize,
  handleDelete,
  isLoading,
}) => {
  console.log('DataTable Debug:', {
    dataLength: data?.length,
    currentPage,
    pageSize,
    totalPages,
    actualTotal: totalPages
  });

  const handleStatusUpdate = (customerId: string | number, newStatus: string) => {
    console.log(`Customer ${customerId} status updated to ${newStatus}`);
    // The table will automatically refresh due to query invalidation in the hook
  };

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
          <p>{item?.name || "----"}</p>
          <p className="font-normal text-[0.75rem] text-[#A0AEC0]">
            {item?.email || "No email provided"}
          </p>
        </div>
      </div>
    ),

    customertype: (item: CustomersData) => (
      <span className="font-medium">
        {capitalizeFirstLetter(item?.customerType?.toString() || "")}
      </span>
    ),

    id: (item: CustomersData) => (
      <div className="font-medium flex items-center gap-3">{item.id}</div>
    ),

    kyc: (item: CustomersData) => {
      const kycStatus = item?.kyc || item?.kycStatus || 'pending';
      const statusLower = kycStatus.toString().toLowerCase();

      return (
        <Badge
          variant={
            statusLower === "verified"
              ? "success"
              : statusLower === "pending" || statusLower === "not verified"
                ? "tertiary"
                : "warning"
          }
          className="py-1 px-[26px] font-bold text-[10px]"
        >
          {kycStatus.toString().toUpperCase()}
        </Badge>
      );
    },

    // Updated status cell to use dropdown with proper type handling
    customerstatus: (item: CustomersData) => {
      // Ensure we have a valid ID
      if (!item?.id) {
        return (
          <Badge variant="tertiary" className="py-1 px-[26px] font-bold text-[10px]">
            INACTIVE
          </Badge>
        );
      }

      return (
        <CustomerStatusDropdown
          customer={{
            id: item.id,
            status: item?.status || item?.customerStatus || 'INACTIVE',
            email: item?.email || '',
            name: item?.name || ''
          }}
          onStatusUpdate={handleStatusUpdate}
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
    "name",
    "customertype",
    "id",
    "customerstatus",
    "kyc",
    "action",
  ];

  const columnLabels = {
    name: "Name",
    customertype: "Customer Type",
    id: "Customer ID",
    customerstatus: "Customer Status",
    kyc: "KYC",
    action: "Action",
  };

  return (
    <div>
      <CustomerTableComponent<CustomersData>
        tableData={data}
        currentPage={currentPage}
        onPageChange={onPageChange}
        totalPages={Math.ceil(totalPages / pageSize)}
        cellRenderers={cellRenderers}
        columnOrder={columnOrder}
        columnLabels={columnLabels}
        setFilter={(newPageSize) => {
          console.log('Setting new page size:', newPageSize);
          setPageSize(newPageSize);
        }}
        isLoading={isLoading}
      />
    </div>
  );
};

export default DataTable;