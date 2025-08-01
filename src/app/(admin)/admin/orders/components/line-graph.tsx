"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useGetOrderSummaryChart } from "@/services/orders";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
  const [timeframe, setTimeframe] = useState<"3m" | "5m" | "6m" | "12m">("5m");

  const {
    orderSummary,
    orderSummarySummary,
    isOrderSummaryLoading,
    orderSummaryError,
    setOrderSummaryFilter
  } = useGetOrderSummaryChart({ timeframe });

  // Transform the data for the chart
  const chartData = orderSummary?.data?.map((item: any) => ({
    month: item.month,
    ordered: item.ordered,
    delivered: item.delivered,
  })) || [];

  const handleTimeframeChange = (value: "3m" | "5m" | "6m" | "12m") => {
    setTimeframe(value);
    setOrderSummaryFilter({ timeframe: value });
  };

  return (
    <Card className="py-6 flex-1 px-1">
      <div className="flex items-center justify-between mb-6">
        <h5 className="font-bold text-[#383E49] text-2xl">Order Summary</h5>

        {/* Timeframe selector */}
        <div className="flex gap-2">
          {["3m", "5m", "6m", "12m"].map((period) => (
            <Button
              key={period}
              variant={timeframe === period ? "default" : "outline"}
              size="sm"
              onClick={() => handleTimeframeChange(period as any)}
              className="text-xs"
            >
              {period === "3m" ? "3M" : period === "5m" ? "5M" : period === "6m" ? "6M" : "12M"}
            </Button>
          ))}
        </div>
      </div>

      <CardContent className="p-0 mb-5">
        {isOrderSummaryLoading ? (
          <div className="h-[280px] flex items-center justify-center">
            <p>Loading chart data...</p>
          </div>
        ) : orderSummaryError ? (
          <div className="h-[280px] flex items-center justify-center">
            <p className="text-red-500">Error loading chart data</p>
          </div>
        ) : (
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
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
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
        )}
      </CardContent>

      <CardFooter className="flex gap-6 ps-[125px]">
        <div className="flex items-center gap-2 text-xs text-[#667085] font-dmsans">
          <div className="h-[15px] w-[15px] rounded-full bg-[#134134]"></div>
          <p>Delivered</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#667085] font-dmsans">
          <div className="h-[15px] w-[15px] rounded-full bg-[#DBA362]"></div>
          <p>Ordered</p>
        </div>
      </CardFooter>
    </Card>
  );
}