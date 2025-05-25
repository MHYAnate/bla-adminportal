"use client";

import Image from "next/image";
import { useState } from "react";
import { DeleteIcon, ViewIcon } from "../../../../../../public/icons";
import { TableComponent } from "@/components/custom-table";
import { OrderTableComponent } from "@/components/custom-table/orderIndex";

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
import { capitalizeFirstLetter } from "@/lib/utils";
interface iProps {
  data?: any;
  currentPage: number;
  handleDelete: () => void;
  onPageChange: (value: number) => void;
  pageSize: number;
  totalPages: number;
  setPageSize: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
}

const DataTable: React.FC<iProps> = ({
  data,
  currentPage,
  onPageChange,
  pageSize,
  totalPages,
  handleDelete,
  loading,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
        <div>
          <p className="font-normal">{item?.user?.email || "----"}</p>
          <p className="text-[0.75rem] text-[#A0AEC0]">
            {item?.user?.id || "---"}
          </p>
        </div>
      </div>
    ),
    customertype: (item: OrdersData) => (
      <div className="font-normal">
        {capitalizeFirstLetter(item?.user?.type || "----")}
      </div>
    ),
    orderid: (item: OrdersData) => (
      <div className="font-normal">{item?.id}</div>
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
          <div className="bg-[#27A376] p-2.5 rounded-lg">
            <ViewIcon />
          </div>
        </Link>
        <div className="bg-[#E03137] p-2.5 rounded-lg" onClick={handleDelete}>
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
    <>
      <OrderTableComponent<OrdersData>
        tableData={data}
        currentPage={currentPage}
        onPageChange={onPageChange}
        totalPages={Math.ceil(totalPages / pageSize)}
        cellRenderers={cellRenderers}
        columnOrder={columnOrder}
        columnLabels={columnLabels}
        isLoading={loading}
      />

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
    </>
  );
};

export default DataTable;
