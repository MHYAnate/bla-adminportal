"use client";

import { Badge } from "@/components/ui/badge";
import { AdminsData } from "@/types";
import Image from "next/image";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarIcon,
  DeleteIcon,
  EditIcon,
  PersonIcon,
  RepIcon,
  ViewIcon,
} from "../../../../../../public/icons";
import { TableComponent } from "@/components/custom-table";
import { SelectFilter } from "@/app/(admin)/components/select-filter";
import { InputFilter } from "@/app/(admin)/components/input-filter";
import Link from "next/link";
import { ROUTES } from "@/constant/routes";

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
  const tableData: AdminsData[] = [
    {
      id: 1,
      name: "Jennifer Lawal",
      role: "Admin",
      description: "Super Admin in charge",
      date: "24 Mar 2023",
      status: "active",
      rolecount: 5,
    },
    {
      id: 2,
      name: "Jennifer Lawal",
      role: "Inventory Management",
      description: "Super Admin in charge",
      date: "24 Mar 2023",
      status: "pending",
      rolecount: 5,
    },
    {
      id: 3,
      name: "Jennifer Lawal",
      role: "Admin",
      description: "Super Admin in charge",
      date: "24 Mar 2023",
      status: "Inactive",
      rolecount: 5,
    },
  ];

  const cellRenderers = {
    name: (item: AdminsData) => (
      <div className="font-medium flex items-center gap-3">
        <Image
          src="/images/user-avatar.png"
          width={24}
          height={24}
          alt="Admin avatar"
          className="w-6 h-6 rounded-full"
        />
        {item.name}
      </div>
    ),
    role: (item: AdminsData) => (
      <div className="font-medium flex items-center gap-3">
        {item.role.toLowerCase() === "admin" ? <PersonIcon /> : <RepIcon />}
        {item.role}
      </div>
    ),
    description: (item: AdminsData) => (
      <span className="font-medium">{item.description}</span>
    ),
    date: (item: AdminsData) => (
      <div className="font-medium flex items-center gap-3">
        <CalendarIcon />
        {item.date}
      </div>
    ),
    status: (item: AdminsData) => (
      <Badge
        variant={
          item.status.toLowerCase() === "active"
            ? "success"
            : item.status.toLowerCase() === "pending"
            ? "tertiary"
            : "warning"
        }
        className="py-1 px-[26px] font-medium"
      >
        {item.status.toUpperCase()}
      </Badge>
    ),
    rolecount: (item: AdminsData) => (
      <span className="font-medium">{item.rolecount}</span>
    ),

    action: (item: AdminsData) => (
      <div className="flex gap-2.5">
        <Link
          href={`${ROUTES.ADMIN.SIDEBAR.ADMINS}/${item?.id}?tab=general`}
          className="bg-[#27A376] p-2.5 rounded-lg"
        >
          <ViewIcon />
        </Link>
        <div className="bg-[#2F78EE] p-2.5 rounded-lg">
          <EditIcon />
        </div>
        <div className="bg-[#E03137] p-2.5 rounded-lg">
          <DeleteIcon />
        </div>
      </div>
    ),
  };

  const columnOrder: (keyof AdminsData)[] = [
    "name",
    "role",
    "description",
    "date",
    "status",
    "rolecount",
    "action",
  ];

  const columnLabels = {
    status: "Admin Status",
    name: "Name",
    role: "Role",
    description: "Description",
    action: "",
    date: "Created Date",
    rolecount: "Number of roles",
  };

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <h6 className="font-semibold text-lg text-[#111827] mb-1">
          Total users with their roles
        </h6>
        <p className="text-[#687588] font-medium text-sm mb-6">
          Find all administrator accounts and their associate roles.
        </p>
        <div className="flex items-center gap-4 mb-6">
          <InputFilter setQuery={setFilter} />

          <SelectFilter
            setFilter={setRole}
            placeholder="Select Role"
            list={roleList}
          />
          <SelectFilter setFilter={setRole} list={roleList} />
        </div>
        <TableComponent<AdminsData>
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
