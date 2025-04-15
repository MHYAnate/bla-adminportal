"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { CardDescription } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  totalsales: {
    label: "totalsales",
    color: "#FFC837",
  },
} satisfies ChartConfig;

interface iProps {
  data?: Record<string, string | number>[];
}

export default function LineGraphComponent({ data }: iProps) {
  const formatToKOrM = (value: number) => {
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
    if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";
    return value.toString();
  };
  return (
    <div className="h-full flex flex-col">
      <div className="mb-9">
        <CardDescription className="flex gap-4 justify-between items-center">
          <div>
            <h6 className="text-[#111827] font-bold text-xl mb-4">
              Sales Performance
            </h6>
          </div>
        </CardDescription>
      </div>

      <div className="flex-1">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <LineChart
            accessibilityLayer
            data={data || []}
            margin={{ left: 0, right: 12 }}
            className="h-full w-full"
          >
            <CartesianGrid vertical={true} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              dataKey={"total_sales"}
              tickFormatter={formatToKOrM}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="total_sales"
              type="monotone"
              stroke="var(--color-totalsales)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
}
