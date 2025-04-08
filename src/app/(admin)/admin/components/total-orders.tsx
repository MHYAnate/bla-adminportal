"use client";
import { Label, Pie, PieChart, Sector } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

interface OrderData {
  status: string;
  sales: number;
}

interface iProps {
  data: OrderData[];
}

export function TopOrdersChart({ data }: iProps) {
  const totalOrders = data.reduce((sum, item) => sum + item.sales, 0);

  const coloredData = data.map((item, index) => ({
    ...item,
    fill: `hsl(var(--chart-${(index % 5) + 1}))`,
  }));

  const chartConfig = coloredData.reduce((acc, item, index) => {
    acc[`customer_${index + 1}`] = {
      label: item.status,
      color: item.fill,
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>) satisfies ChartConfig;

  return (
    <Card className="flex flex-col p-6 w-full h-auto">
      <div className="flex items-center mb-6 justify-between">
        <h5 className="font-bold text-[#111827]">Order Summary</h5>
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
              data={data.map((d, i) => ({
                ...d,
                fill: `hsl(var(--chart-${(i % 5) + 1}))`,
              }))}
              dataKey="sales"
              nameKey="status"
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
                    {totalOrders || 0}
                  </tspan>
                  <tspan x={cx} y={cy + 24} className="fill-[#A0AEC0] text-xs">
                    Total Orders
                  </tspan>
                </text>
              )}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <div className="flex flex-col gap-3">
        {data?.map((item, index) => (
          <div className="flex items-center gap-3" key={index}>
            <div
              className={`w-[10px] h-[10px] rounded-full`}
              style={{
                backgroundColor: `hsl(var(--chart-${(index % 5) + 1}))`,
              }}
            ></div>
            <p className="text-[#687588] text-xs font-medium me-auto">
              {item?.status}
            </p>
            <h6 className="font-bold text-sm text-[#111827]">{item?.sales}</h6>
          </div>
        ))}
      </div>
    </Card>
  );
}
