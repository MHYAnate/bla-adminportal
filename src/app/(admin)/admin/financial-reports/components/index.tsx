"use client";

import Header from "@/app/(admin)/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExportIcon } from "../../../../../../public/icons";
import FinancialReportCard from "@/components/widgets/financial-report-card";
import { IFinancialReportCard } from "@/types";
import LineGraphComponent from "@/app/(admin)/components/line-chart";

const FinancialReport: React.FC = () => {
  const reportlist = [
    {
      description: "Up from yesterday",
      count: 8.5,
      value: "40,689",
      isProgressive: true,
      title: "Total Users",
    },
    {
      description: "Up from yesterday",
      count: 8.5,
      value: "891,000",
      isProgressive: false,
      title: "Total Sales",
    },
    {
      description: "Up from yesterday",
      count: 8.5,
      value: 10293,
      isProgressive: true,
      title: "Total Order",
    },
  ];
  return (
    <div>
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex justify-between mb-6">
            <Header title="Financial Reports" subtext="Manage finances." />
            <div className="flex gap-5">
              <Button
                variant={"outline"}
                className="font-bold text-base w-auto py-4 px-5 flex gap-2 items-center"
                size={"xl"}
              >
                <ExportIcon /> Download
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {reportlist.map((report: IFinancialReportCard, index) => (
              <FinancialReportCard report={report} key={index} />
            ))}
          </div>
          <LineGraphComponent />
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialReport;
