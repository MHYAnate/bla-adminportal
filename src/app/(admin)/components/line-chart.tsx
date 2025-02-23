"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { CardDescription } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { SelectFilter } from "./select-filter";
import { useState } from "react";
const chartData = [
  { month: "January", individual: 186, businessOwner: 80 },
  { month: "February", individual: 305, businessOwner: 200 },
  { month: "March", individual: 237, businessOwner: 120 },
  { month: "April", individual: 73, businessOwner: 190 },
  { month: "May", individual: 209, businessOwner: 130 },
  { month: "June", individual: 214, businessOwner: 140 },
];

const chartConfig = {
  individual: {
    label: "individual",
    color: "#FFC837",
  },
  businessOwner: {
    label: "businessOwner",
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
        <ChartContainer config={chartConfig} className="max-h-[430px] w-full">
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
              dataKey="individual"
              type="monotone"
              stroke="var(--color-individual)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="businessOwner"
              type="monotone"
              stroke="var(--color-businessOwner)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
}
