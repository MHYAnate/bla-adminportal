"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { month: "January", ordered: 186, delivered: 80 },
  { month: "February", ordered: 305, delivered: 200 },
  { month: "March", ordered: 237, delivered: 120 },
  { month: "April", ordered: 73, delivered: 190 },
  { month: "May", ordered: 209, delivered: 130 },
  { month: "June", ordered: 214, delivered: 140 },
];

const chartConfig = {
  ordered: {
    label: "Ordered",
    color: "#DBA362",
  },
  delivered: {
    label: "Delivered",
    color: "#134134",
  },
} satisfies ChartConfig;

export default function LineGraphComponent() {
  return (
    <Card className="py-6 flex-1 px-1">
      <div className="flex items-center justify-between mb-6">
        <h5 className="font-bold text-[#383E49] text-2xl">Order Summary</h5>
      </div>

      <CardContent className="p-0 mb-5">
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: -5,
              right: 0,
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
              dataKey="ordered"
              type="monotone"
              stroke="var(--color-ordered)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="delivered"
              type="monotone"
              stroke="var(--color-delivered)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex gap-6 ps-[125px]">
        <div className="flex items-center gap-2 text-xs text-[#667085] font-dmsans">
          <div className="h-[15px] w-[15px] rounded-full bg-[#134134]"></div>
          <p>Ordered</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#667085] font-dmsans">
          <div className="h-[15px] w-[15px] rounded-full bg-[#FFBF3B]"></div>
          <p>Delivered</p>
        </div>
      </CardFooter>
    </Card>
  );
}
