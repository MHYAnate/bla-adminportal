"use client";

import Image from "next/image";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteIcon, ViewIcon } from "../../../../../../public/icons";
import { TableComponent } from "@/components/custom-table";
import { SelectFilter } from "@/app/(admin)/components/select-filter";
import { InputFilter } from "@/app/(admin)/components/input-filter";
import { OrdersData } from "@/types";
import { Badge } from "@/components/ui/badge";
import OrderDetails from "./order-details";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constant/routes";

const DataTable: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
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

  const tableData: OrdersData[] = [
    {
      id: 1,
      name: "Jennifer Lawal",
      customertype: "Individual",
      amount: "68,000.00",
      status: "Cancelled",
      orderid: "#908765",
      email: "jenny@gmail.com",
    },
    {
      id: 2,
      name: "Jennifer Lawal",
      customertype: "Individual",
      amount: "68,000.00",
      status: "Pending",
      orderid: "#908765",
      email: "jenny@gmail.com",
    },
    {
      id: 3,
      name: "Jennifer Lawal",
      customertype: "Individual",
      amount: "68,000.00",
      status: "Delivered",
      orderid: "#908765",
      email: "jenny@gmail.com",
    },
  ];

  const cellRenderers = {
    name: (item: OrdersData) => (
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
    customertype: (item: OrdersData) => (
      <div className="font-normal">{item.customertype}</div>
    ),
    orderid: (item: OrdersData) => (
      <div className="font-normal">{item.orderid}</div>
    ),
    amount: (item: OrdersData) => (
      <span className="font-normal">NGN {item.amount}</span>
    ),
    status: (item: OrdersData) => (
      <Badge
        variant={
          item.status.toLowerCase() === "delivered"
            ? "success"
            : item.status.toLowerCase() === "pending"
            ? "tertiary"
            : "warning"
        }
        className="py-1 px-[26px] font-bold"
      >
        {item.status.toUpperCase()}
      </Badge>
    ),
    action: (item: OrdersData) => (
      <div className="flex gap-2.5">
        <Link href={`${ROUTES.ADMIN.SIDEBAR.ORDERS}/1`}>
          <div
            className="bg-[#27A376] p-2.5 rounded-lg"
            // onClick={() => setIsOpen(true)}
          >
            <ViewIcon />
          </div>
        </Link>
        <div className="bg-[#E03137] p-2.5 rounded-lg">
          <DeleteIcon />
        </div>
      </div>
    ),
  };

  const columnOrder: (keyof OrdersData)[] = [
    "name",
    "customertype",
    "amount",
    "orderid",
    "status",
    "action",
  ];

  const columnLabels = {
    name: "Name",
    customertype: "Customer Type",
    amount: "Amount",
    action: "",
    orderid: "Order ID",
    status: "Order Status",
  };

  return (
    <div className="bg-white">
      <div className="p-6">
        <h6 className="font-semibold text-lg text-[#111827] mb-6">
          Detailed Order Table
        </h6>

        <div className="flex items-center gap-4 mb-6">
          <InputFilter setQuery={setFilter} placeholder="Search customers" />

          <SelectFilter
            setFilter={setRole}
            placeholder="Customer Type"
            list={roleList}
          />
          <SelectFilter
            setFilter={setRole}
            placeholder="Order Status"
            list={roleList}
          />
        </div>
        <TableComponent<OrdersData>
          tableData={tableData}
          currentPage={currentPage}
          onPageChange={onPageChange}
          totalPages={Math.ceil(tableData.length / pageSize)}
          cellRenderers={cellRenderers}
          columnOrder={columnOrder}
          columnLabels={columnLabels}
        />
      </div>
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(!open)}>
        <DialogContent className="right-0 p-8 max-w-[47.56rem] h-screen overflow-scroll">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#111827] flex gap-4.5 items-center">
              <div onClick={() => setIsOpen(false)} className="cursor-pointer">
                <ChevronLeft size={24} />
              </div>
              Create new admin
            </DialogTitle>
          </DialogHeader>
          <OrderDetails setClose={setIsOpen} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataTable;
