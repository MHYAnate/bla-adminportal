"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { SelectFilter } from "@/app/(admin)/components/select-filter";
import { useState } from "react";

const chartData = [
  { category: "New", count: 102 },
  { category: "Review", count: 70 },
  { category: "Resolved", count: 35 },
  { category: "Escalated", count: 5 },
];

const chartConfig = {
  new: {
    label: "New",
    color: "#38bdf8",
  },
  review: {
    label: "Review",
    color: "#F59E0B",
  },
  resolved: {
    label: "Resolved",
    color: "#10B981",
  },
  escalated: {
    label: "Escalated",
    color: "#EF4444",
  },
} satisfies ChartConfig;

export function FeedbackBarComponent() {
  const [role, setRole] = useState<string>("");

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

  return (
    <Card className="p-6">
      <h5 className="font-bold text-[#383E49] text-2xl mb-3">
        Feedback Status Distribution
      </h5>
      <SelectFilter
        setFilter={setRole}
        placeholder="Select Role"
        list={roleList}
      />

      <CardContent className="p-0 mt-6">
        <ChartContainer config={chartConfig} className="h-[202px] w-full">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" fill={chartConfig.new.color} />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex gap-6 ps-[24px] mt-8">
        <div className="flex items-center gap-2 text-xs text-[#667085] font-dmsans">
          <div
            className="h-[15px] w-[15px] rounded-full"
            style={{ backgroundColor: chartConfig.new.color }}
          ></div>
          <p>New</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#667085] font-dmsans">
          <div
            className="h-[15px] w-[15px] rounded-full"
            style={{ backgroundColor: chartConfig.review.color }}
          ></div>
          <p>Review</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#667085] font-dmsans">
          <div
            className="h-[15px] w-[15px] rounded-full"
            style={{ backgroundColor: chartConfig.resolved.color }}
          ></div>
          <p>Resolved</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#667085] font-dmsans">
          <div
            className="h-[15px] w-[15px] rounded-full"
            style={{ backgroundColor: chartConfig.escalated.color }}
          ></div>
          <p>Escalated</p>
        </div>
      </CardFooter>
    </Card>
  );
}
