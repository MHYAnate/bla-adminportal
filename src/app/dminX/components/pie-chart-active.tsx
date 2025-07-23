"use client";

import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { SelectFilter } from "./select-filter";
import { useState } from "react";
const chartData = [
  { title: "Ongoing", values: 275, fill: "#EC9F01" },
  { title: "Cancelled", values: 200, fill: "#E03137" },
  { title: "Delivered", values: 187, fill: "#27A376" },
];

const chartConfig = {
  values: {
    label: "values",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
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
interface iProps {
  showFilter?: boolean;
}

export function PieActiveComponent({ showFilter = false }: iProps) {
  const [filter, setFilter] = useState<string>("");
  return (
    <Card className="flex flex-col p-6 w-full h-auto">
      <div className="flex items-center mb-6 justify-between">
        <h5 className="font-bold text-[#111827]">Order Summary</h5>
        {showFilter && (
          <div className="w-[72px]">
            <SelectFilter setFilter={setFilter} list={list} />
          </div>
        )}
      </div>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="values"
              nameKey="title"
              innerRadius={60}
              strokeWidth={0}
              activeIndex={0}
              paddingAngle={10}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <Sector {...props} outerRadius={outerRadius + 20} />
              )}
              label={({ cx, cy }) => (
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  className="fill-[#111827] text-2xl font-bold"
                >
                  <tspan x={cx} y={cy}>
                    121
                  </tspan>
                  <tspan x={cx} y={cy + 24} className="fill-[#A0AEC0] text-xs">
                    Total Order.
                  </tspan>
                </text>
              )}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <div className="flex flex-col gap-3">
        {chartData?.map((data, index) => (
          <div className="flex items-center gap-3" key={index}>
            <div
              className={`w-[10px] h-[10px] rounded-full`}
              style={{ backgroundColor: data.fill }}
            ></div>
            <p className="text-[#687588] text-xs font-medium me-auto">
              {data?.title}
            </p>
            <h6 className="font-bold text-sm text-[#111827]">{data?.values}</h6>
          </div>
        ))}
      </div>
    </Card>
  );
}
