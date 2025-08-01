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
import { useState, useMemo, useCallback } from "react";

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

interface ChartDataItem {
  month: string;
  ordered: number;
  delivered: number;
}

export default function LineGraphComponent() {
  const [timeframe, setTimeframe] = useState<"3m" | "5m" | "6m" | "12m">("5m");

  const {
    orderSummary,
    orderSummarySummary,
    isOrderSummaryLoading,
    orderSummaryError,
    setOrderSummaryFilter
  } = useGetOrderSummaryChart({ timeframe });

  // Memoize the chart data transformation to prevent unnecessary re-computations
  const chartData = useMemo((): ChartDataItem[] => {
    if (!orderSummary?.data || !Array.isArray(orderSummary.data)) {
      return [];
    }

    return orderSummary.data.map((item: any) => ({
      month: item.month || '',
      ordered: Number(item.ordered) || 0,
      delivered: Number(item.delivered) || 0,
    }));
  }, [orderSummary?.data]);

  // Memoize the timeframe change handler
  const handleTimeframeChange = useCallback((value: "3m" | "5m" | "6m" | "12m") => {
    setTimeframe(value);
    if (setOrderSummaryFilter) {
      setOrderSummaryFilter({ timeframe: value });
    }
  }, [setOrderSummaryFilter]);

  // Memoize timeframe options
  const timeframeOptions = useMemo(() => [
    { value: "3m" as const, label: "3M" },
    { value: "5m" as const, label: "5M" },
    { value: "6m" as const, label: "6M" },
    { value: "12m" as const, label: "12M" },
  ], []);

  return (
    <Card className="py-6 flex-1 px-1">
      <div className="flex items-center justify-between mb-6">
        <h5 className="font-bold text-[#383E49] text-2xl">Order Summary</h5>

        {/* Timeframe selector */}
        <div className="flex gap-2">
          {timeframeOptions.map((option) => (
            <Button
              key={option.value}
              variant={timeframe === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => handleTimeframeChange(option.value)}
              className="text-xs"
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <CardContent className="p-0 mb-5">
        {isOrderSummaryLoading ? (
          <div className="h-[280px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <p className="ml-3">Loading chart data...</p>
          </div>
        ) : orderSummaryError ? (
          <div className="h-[280px] flex items-center justify-center flex-col">
            <p className="text-red-500 mb-2">Error loading chart data</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleTimeframeChange(timeframe)}
            >
              Retry
            </Button>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-[280px] flex items-center justify-center">
            <p className="text-gray-500">No chart data available</p>
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