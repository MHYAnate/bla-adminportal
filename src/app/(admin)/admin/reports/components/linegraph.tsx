"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface MultiLineGraphProps {
  salesData: Array<{
    month: string;
    orders_count: number;
    total_sales: number;
  }>;
}

const chartConfig = {
  sales: {
    label: "Sales Performance",
    color: "hsl(var(--chart-1))",
  },
  orders: {
    label: "Order Count",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function MultiLineGraphComponent({ salesData }: MultiLineGraphProps) {
  // Transform and validate data
  const chartData = React.useMemo(() => {
    if (!salesData || !Array.isArray(salesData)) return [];

    return salesData.map((item) => ({
      date: item?.month || "",
      sales: item?.total_sales || 0,
      orders: item?.orders_count || 0,
    })).filter(item => item.date !== "");
  }, [salesData]);

  // Parse month strings into Date objects for proper formatting
  const parseMonth = (monthString: string) => {
    if (!monthString) return new Date();
    const [year, month] = monthString.split('-');
    return new Date(parseInt(year) || 0, (parseInt(month) || 1) - 1);
  };

  // Calculate statistics - ONLY from chart data, not external sources
  const stats = React.useMemo(() => {
    if (!chartData.length) return { totalSales: 0, totalOrders: 0, avgMonthlySales: 0 };

    const totalSales = chartData.reduce((acc, curr) => acc + curr.sales, 0);
    const totalOrders = chartData.reduce((acc, curr) => acc + curr.orders, 0);
    const avgMonthlySales = totalSales / chartData.length;

    return { totalSales, totalOrders, avgMonthlySales };
  }, [chartData]);

  // Find best and worst performing months
  const performance = React.useMemo(() => {
    if (!chartData.length) return null;

    const sortedBySales = [...chartData].sort((a, b) => b.sales - a.sales);
    const bestMonth = sortedBySales[0];
    const worstMonth = sortedBySales[sortedBySales.length - 1];

    return { bestMonth, worstMonth };
  }, [chartData]);

  if (!chartData.length) {
    return (
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Monthly Sales Performance</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <div className="text-center">
            <p className="text-gray-500 mb-2">No monthly sales data available</p>
            <p className="text-sm text-gray-400">Chart will display when data is loaded</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Monthly Sales Performance</CardTitle>
          <p className="text-sm text-muted-foreground">
            Revenue and order trends over {chartData.length} month{chartData.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Stats Summary - ONLY from monthly chart data */}
        <div className="flex">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left sm:px-8 sm:py-6 border-r">
            <span className="text-xs text-muted-foreground">Chart Period Sales</span>
            <span className="text-lg font-bold leading-none sm:text-2xl">
              ₦{stats.totalSales.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
            <span className="text-xs text-green-600">
              Sum of {chartData.length} months
            </span>
          </div>
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left sm:px-8 sm:py-6 border-r">
            <span className="text-xs text-muted-foreground">Chart Period Orders</span>
            <span className="text-lg font-bold leading-none sm:text-2xl">
              {stats.totalOrders.toLocaleString()}
            </span>
            <span className="text-xs text-blue-600">
              Total orders
            </span>
          </div>
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left sm:px-8 sm:py-6">
            <span className="text-xs text-muted-foreground">Monthly Average</span>
            <span className="text-lg font-bold leading-none sm:text-2xl">
              ₦{stats.avgMonthlySales.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </span>
            <span className="text-xs text-purple-600">
              Per month avg
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:p-6">
        {/* Performance Insights */}
        {performance && (
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-xs text-green-600 font-medium">Best Performing Month</p>
              <p className="text-sm font-semibold text-green-800">
                {parseMonth(performance.bestMonth.date).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric"
                })}
              </p>
              <p className="text-xs text-green-700">
                ₦{performance.bestMonth.sales.toLocaleString()} • {performance.bestMonth.orders} orders
              </p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <p className="text-xs text-orange-600 font-medium">Lowest Performing Month</p>
              <p className="text-sm font-semibold text-orange-800">
                {parseMonth(performance.worstMonth.date).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric"
                })}
              </p>
              <p className="text-xs text-orange-700">
                ₦{performance.worstMonth.sales.toLocaleString()} • {performance.worstMonth.orders} orders
              </p>
            </div>
          </div>
        )}

        {/* Chart */}
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = parseMonth(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    year: "2-digit"
                  });
                }}
              />
              <YAxis
                yAxisId="sales"
                orientation="left"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
              />
              <YAxis
                yAxisId="orders"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value.toString()}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[200px]"
                    labelFormatter={(value) =>
                      parseMonth(value).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric"
                      })
                    }
                    formatter={(value, name) => {
                      if (name === "sales") {
                        return [
                          `₦${Number(value).toLocaleString(undefined, {
                            maximumFractionDigits: 0
                          })}`,
                          "Monthly Sales"
                        ];
                      }
                      if (name === "orders") {
                        return [
                          `${Number(value).toLocaleString()} orders`,
                          "Monthly Orders"
                        ];
                      }
                      return [value, name];
                    }}
                  />
                }
              />
              <Line
                yAxisId="sales"
                dataKey="sales"
                type="monotone"
                stroke="hsl(var(--chart-1))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "hsl(var(--chart-1))", strokeWidth: 2 }}
              />
              <Line
                yAxisId="orders"
                dataKey="orders"
                type="monotone"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, stroke: "hsl(var(--chart-2))", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Chart Legend */}
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[hsl(var(--chart-1))] rounded-full"></div>
            <span className="text-sm text-gray-600">Monthly Sales Revenue (₦)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-[hsl(var(--chart-2))] rounded-full bg-white"></div>
            <span className="text-sm text-gray-600">Monthly Order Count</span>
          </div>
        </div>

        {/* Data Period Info */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            📊 This chart shows monthly performance data •
            Period: {chartData.length} months •
            Data source: Monthly aggregated sales performance
          </p>
        </div>
      </CardContent>
    </Card>
  );
}