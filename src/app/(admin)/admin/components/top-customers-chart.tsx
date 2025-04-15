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
  const totalSpent = data?.reduce(
    (acc, customer) => acc + Number(customer?.totalSpent),
    0
  );

  const coloredData = data.map((item, index) => ({
    ...item,
    fill: `hsl(var(--chart-${(index % 5) + 1}))`,
  }));

  const chartConfig = coloredData.reduce((acc, item, index) => {
    acc[`customer_${index + 1}`] = {
      label: item.email,
      color: item.fill,
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>) satisfies ChartConfig;

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
                    {formatNumber(totalSpent || 0.0)}
                  </tspan>
                  <tspan x={cx} y={cy + 24} className="fill-[#A0AEC0] text-xs">
                    Total Customers
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
              {data.orderCount || 0}
            </p>
            <h6 className="font-bold text-sm text-[#111827]">
              {data.totalSpent}
            </h6>
          </div>
        ))}
      </div>
    </Card>
  );
}
