"use client";

import Header from "@/app/(admin)/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DataTable from "./data-table";
import {
  ExportIcon,
  TotalOrderIcon,
  TotalOrdersIcon,
  TotalPendingIcon,
  TotalSalesIcon,
} from "../../../../../../public/icons";
import ReportCard from "@/components/report-card";
import { IReportCard } from "@/types";

export default function Orders() {
  const orderlist = [
    {
      description: "Up from yesterday",
      count: 8.5,
      value: "405,689",
      isProgressive: true,
      icon: <TotalOrdersIcon />,
      title: "Total Orders",
    },
    {
      description: "Up from yesterday",
      count: 8.5,
      value: "NGN891,000",
      isProgressive: false,
      icon: <TotalSalesIcon />,
      title: "Order Delivered",
    },
    {
      description: "Up from yesterday",
      count: 8.5,
      value: 293,
      isProgressive: true,
      icon: <TotalOrderIcon />,
      title: "Ongoing Order",
    },
    {
      description: "Up from yesterday",
      count: 8.5,
      value: 48,
      isProgressive: false,
      icon: <TotalPendingIcon />,
      title: "Cancelled Order",
    },
  ];
  return (
    <section>
      <Card className="bg-white mb-8">
        <CardContent className="p-4 flex justify-between items-center">
          <Header title="Order History" subtext="Manage orders." />
          <div className="flex gap-5">
            <Button
              variant={"outline"}
              className="font-bold text-base w-auto py-4 px-5 flex gap-2 items-center"
              size={"xl"}
            >
              <ExportIcon /> Download
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {orderlist.map((report: IReportCard, index) => (
          <ReportCard report={report} key={index} />
        ))}
      </div>
      <DataTable />
    </section>
  );
}
