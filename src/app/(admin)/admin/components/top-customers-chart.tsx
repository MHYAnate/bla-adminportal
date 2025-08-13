// src/app/(admin)/admin/components/top-customers-chart.tsx

"use client";

import { Pie, PieChart } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatNumber } from "@/lib/utils";

interface CustomerData {
  email: string;
  totalSpent: number;
  orderCount: number;
}

interface iProps {
  data: CustomerData[];
}

export function TopCustomersChart({ data }: iProps) {
  // Filter out any null/undefined customers and ensure they have required fields
  const validData = (data || []).filter(customer =>
    customer &&
    customer.email &&
    typeof customer.totalSpent === 'number'
  );

  const totalSpent = validData.reduce(
    (acc, customer) => acc + Number(customer?.totalSpent || 0),
    0
  );

  const customerColors = ["#9333EA", "#2DD4BF", "#F97316", "#0000FF"]; // purple, aqua green, orange, light grey

  const coloredData = validData.map((item, index) => ({
    ...item,
    fill: customerColors[index] || "#94A3B8", // fallback color if more than 4 items
  }));

  const chartConfig = coloredData.reduce((acc, item, index) => {
    acc[`customer_${index + 1}`] = {
      label: item.email || "Unknown",
      color: item.fill,
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>) satisfies ChartConfig;

  // Handle case where there's no valid data
  if (validData.length === 0) {
    return (
      <Card className="flex flex-col p-6 w-full h-auto">
        <div className="flex items-center justify-between">
          <h5 className="font-bold text-[#111827]">Top Customers</h5>
        </div>
        <CardContent className="flex-1 pb-0 flex items-center justify-center">
          <p className="text-gray-500 text-sm">No customer data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col p-6 w-full h-auto">
      <div className="flex items-center justify-between">
        <h5 className="font-bold text-[#111827]">Top Customers</h5>
      </div>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] flex justify-center items-center"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={coloredData}
              dataKey="totalSpent"
              nameKey="email"
              innerRadius={60}
              strokeWidth={0}
              activeIndex={0}
              paddingAngle={3}
              label={({ cx, cy }) => (
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  className="fill-[#111827] text-sm font-bold"
                >
                  <tspan x={cx} y={cy}>
                    {Math.floor(totalSpent || 0)} {/* No decimals */}
                  </tspan>
                  <tspan x={cx} y={cy + 24} className="fill-[#A0AEC0] text-xs">
                    Total Sales
                  </tspan>
                </text>
              )}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>

      <div className="flex flex-col gap-3">
        {coloredData.map((data, index) => (
          <div className="flex items-center gap-3" key={index}>
            <div
              className={`w-[10px] h-[10px] rounded-full`}
              style={{ backgroundColor: data.fill }}
            ></div>
            <p className="text-[#687588] text-xs font-medium me-auto">
              {/* FIX: Add safety check for email before splitting */}
              {data.email ? data.email.split('@')[0] : 'Unknown'}
            </p>
            <h6 className="font-bold text-sm text-[#111827]">
              {Math.floor(data.totalSpent || 0)}
            </h6>
          </div>
        ))}
      </div>
    </Card>
  );
}