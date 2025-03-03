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
  { month: "January", purchase: 186, sales: 80 },
  { month: "February", purchase: 305, sales: 200 },
  { month: "March", purchase: 237, sales: 120 },
  { month: "April", purchase: 73, sales: 190 },
  { month: "May", purchase: 209, sales: 130 },
  { month: "June", purchase: 214, sales: 140 },
];

const chartConfig = {
  purchase: {
    label: "Purchase",
    color: "#134134",
  },
  sales: {
    label: "Sales",
    color: "#FFBF3B",
  },
} satisfies ChartConfig;
const list = [
  {
    text: "Admin",
    value: "admin",
  },
  {
    text: "Super Admin",
    value: "super-admin",
  },
];

export function OrderBarComponent() {
  const [filter, setFilter] = useState<string>("");
  return (
    <Card className="p-6 flex-1">
      <div className="flex items-center justify-between mb-6">
        <h5 className="font-bold text-[#383E49] text-2xl">Sales & Purchases</h5>
        <div className="w-[110px]">
          <SelectFilter setFilter={setFilter} list={list} customSize={false} />
        </div>
      </div>
      <CardContent className="p-0 mb-5">
        <ChartContainer config={chartConfig} className="max-h-[300px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <YAxis tickLine={false} axisLine={false} tickMargin={10} />

            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="purchase" fill="var(--color-purchase)" radius={4} />
            <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex gap-6 ps-[125px]">
        <div className="flex items-center gap-2 text-xs text-[#667085] font-dmsans">
          <div className="h-[15px] w-[15px] rounded-full bg-[#134134]"></div>
          <p>Purchase</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#667085] font-dmsans">
          <div className="h-[15px] w-[15px] rounded-full bg-[#FFBF3B]"></div>
          <p>Sales</p>
        </div>
      </CardFooter>
    </Card>
  );
}
