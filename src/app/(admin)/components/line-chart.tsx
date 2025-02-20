"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { SelectFilter } from "./select-filter";
import { useState } from "react";
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#FFC837",
  },
  mobile: {
    label: "Mobile",
    color: "#0CAF60",
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

export default function LineGraphComponent() {
  const [filter, setFilter] = useState<string>("");
  return (
    <div>
      <div className="mb-9">
        <CardDescription className="flex gap-4 justify-between items-center">
          <div>
            <h6 className="text-[#111827] font-bold text-xl mb-4">
              Sales Performance
            </h6>
            <div className="flex gap-4">
              <div className="flex gap-1 items-center">
                <div className="w-2 h-2 bg-[#0CAF60] rounded-full"></div>
                <p className="font-bold text-[10px] text-[#111827]">
                  Individual
                </p>
              </div>
              <div className="flex gap-1 items-center">
                <div className="w-2 h-2 bg-[#FFC837] rounded-full"></div>
                <p className="font-bold text-[10px] text-[#111827]">Customer</p>
              </div>
            </div>
          </div>
          <SelectFilter setFilter={setFilter} list={list} />
        </CardDescription>
      </div>
      <div>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: -12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={true} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="desktop"
              type="monotone"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="mobile"
              type="monotone"
              stroke="var(--color-mobile)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
}
