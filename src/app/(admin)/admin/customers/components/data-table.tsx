"use client";

import { Badge } from "@/components/ui/badge";
import { CustomersData } from "@/types";
import Image from "next/image";
import { useState } from "react";
import { TableComponent } from "@/components/custom-table";
import { DeleteIcon, EditIcon, ViewIcon } from "../../../../../../public/icons";
import { InputFilter } from "@/app/(admin)/components/input-filter";
import { SelectFilter } from "@/app/(admin)/components/select-filter";
import Link from "next/link";
import { ROUTES } from "@/constant/routes";
import { capitalizeFirstLetter } from "@/lib/utils";
interface iProps {
  data?: any;
}

const DataTable: React.FC<iProps> = ({ data }) => {
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
          <p> {item?.name || "----"}</p>
          <p className="font-normal text-[0.75rem] text-[#A0AEC0]">
            {item?.email || "lincoln@unpixel.com"}
          </p>
        </div>
      </div>
    ),
    customertype: (item: CustomersData) => (
      <span className="font-medium">
        {capitalizeFirstLetter(item?.customerType.toString() || "")}
      </span>
    ),
    id: (item: CustomersData) => (
      <div className="font-medium flex items-center gap-3">{item.id}</div>
    ),
    kyc: (item: CustomersData) => (
      <Badge
        variant={
          item?.kyc?.toLowerCase() === "verified"
            ? "success"
            : item?.kyc?.toLowerCase() === "pending"
            ? "tertiary"
            : item?.kyc?.toLowerCase() === "flagged"
            ? "destructive"
            : "warning"
        }
        className="py-1 px-[26px] font-bold"
      >
        {item?.kyc?.toUpperCase()}
      </Badge>
    ),
    customerstatus: (item: CustomersData) => (
      <div className="font-medium flex items-center gap-3">{item?.status}</div>
    ),

    action: (item: CustomersData) => (
      <div className="flex gap-2.5">
        <Link
          href={`${ROUTES.ADMIN.SIDEBAR.CUSTOMERS}/${item?.id}?tab=general`}
          className="bg-[#27A376] p-2.5 rounded-lg"
        >
          <ViewIcon />
        </Link>
        <div className="bg-[#E03137] p-2.5 rounded-lg">
          <DeleteIcon />
        </div>
      </div>
    ),
  };

  const columnOrder: (keyof CustomersData)[] = [
    "name",
    "customerType",
    "id",
    "customerstatus",
    "kyc",
    "action",
  ];

  const columnLabels = {
    name: "Name",
    customerType: "Customer Type",
    id: "Customer ID",
    customerstatus: "Customer Status",
    kyc: "KYC",
    action: "Action",
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <InputFilter setQuery={setFilter} />
        <SelectFilter
          setFilter={setRole}
          placeholder="Select Role"
          list={roleList}
        />
        <SelectFilter setFilter={setRole} list={roleList} />
      </div>
      <TableComponent<CustomersData>
        tableData={data}
        currentPage={currentPage}
        onPageChange={onPageChange}
        totalPages={Math.ceil(data.length / pageSize)}
        cellRenderers={cellRenderers}
        columnOrder={columnOrder}
        columnLabels={columnLabels}
      />
    </div>
  );
};

export default DataTable;
