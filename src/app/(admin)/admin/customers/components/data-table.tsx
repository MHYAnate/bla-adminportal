"use client";

import { Badge } from "@/components/ui/badge";
import { CustomersData } from "@/types";
import Image from "next/image";
import { CustomerTableComponent } from "@/components/custom-table/index2";
import { ViewIcon } from "../../../../../../public/icons";
import Link from "next/link";
import { ROUTES } from "@/constant/routes";
import { capitalizeFirstLetter } from "@/lib/utils";

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


  // ✅ REMOVED: No frontend filtering - let backend handle customer type filtering
  // The backend should already be returning only business and individual customers

  const cellRenderers = {
    name: (item: CustomersData) => (
      <div className="font-medium flex items-center gap-3">
        <Image
          src="/images/user-avatar.png"
          width={24}
          height={24}
          alt="Customer avatar"
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

    // ✅ FIXED: Handle both customerType and type fields consistently
    customerType: (item: CustomersData) => {
      const customerType = item?.customerType || item?.type || "customer";
      return (
        <span className="font-medium">
          {capitalizeFirstLetter(customerType.toString())}
        </span>
      );
    },

    id: (item: CustomersData) => (
      <div className="font-medium flex items-center gap-3">{item?.id}</div>
    ),

    // ✅ FIXED: Improved KYC status handling
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

    // ✅ FIXED: Better customer status handling
    customerStatus: (item: CustomersData) => {
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

  // ✅ FIXED: Corrected column order to match your cellRenderers
  const columnOrder: (keyof CustomersData)[] = [
    "name",
    "customerType",
    "id",
    "customerStatus",
    "kyc",
    "action",
  ];

  const columnLabels = {
    name: "Name",
    customerType: "Customer Type",
    id: "Customer ID",
    customerStatus: "Customer Status",
    kyc: "KYC",
    action: "Action",
  };

  return (
    <div>
      <CustomerTableComponent<CustomersData>
        tableData={data || []} // ✅ Use raw data - no filtering
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