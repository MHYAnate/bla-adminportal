"use client";

import Header from "@/app/(admin)/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DataTable from "./data-table";
import {
  ExportIcon,
  TotalOrderIcon,
  TotalPendingIcon,
  TotalSalesIcon,
  TotalUserIcon,
} from "../../../../../../public/icons";
import ReportCard from "@/components/report-card";
import { IReportCard } from "@/types";
import { PieChartComponent } from "@/app/(admin)/components/pie-chart";
import MultiLineGraphComponent from "./linegraph";

export default function Reports() {
  const reportlist = [
    {
      description: "Up from yesterday",
      count: 8.5,
      value: "40,689",
      isProgressive: true,
      icon: <TotalUserIcon />,
      title: "Total Users",
    },
    {
      description: "Up from yesterday",
      count: 8.5,
      value: "NGN891,000",
      isProgressive: false,
      icon: <TotalSalesIcon />,
      title: "Total Sales",
    },
    {
      description: "Up from yesterday",
      count: 8.5,
      value: 10293,
      isProgressive: true,
      icon: <TotalOrderIcon />,
      title: "Total Order",
    },
    {
      description: "Up from yesterday",
      count: 8.5,
      value: 2040,
      isProgressive: false,
      icon: <TotalPendingIcon />,
      title: "Total Pending",
    },
  ];
  const chartData = [
    { title: "Ibukun", values: 27, fill: "#FE964A" },
    { title: "Semilore", values: 20, fill: "#2DD4BF" },
    { title: "Taofeek", values: 17, fill: "#8C62FF" },
    { title: "Sammy", values: 18, fill: "#8C62FF" },
  ];
  return (
    <section>
      <Card className="bg-white mb-8">
        <CardContent className="p-4 flex justify-between items-center">
          <Header title="Customer Reports" subtext="Manage customers." />
          <div className="flex gap-5">
            <Button
              variant={"outline"}
              className="font-bold text-base w-auto py-4 px-5 flex gap-2 items-center"
              size={"xl"}
            >
              <ExportIcon /> Download
            </Button>
            <Button
              variant={"warning"}
              className="font-bold text-base w-auto py-4 px-5"
              size={"xl"}
            >
              + Add New
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {reportlist.map((report: IReportCard, index) => (
          <ReportCard report={report} key={index} />
        ))}
      </div>
      <div className="flex gap-4 mb-6">
        <MultiLineGraphComponent />
        <div className="w-[339px]">
          <PieChartComponent
            title="Total Customers"
            value={121}
            chartData={chartData}
          />
        </div>
      </div>
      <DataTable />
    </section>
  );
}
