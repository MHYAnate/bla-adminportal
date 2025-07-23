"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const percentage = 81; // ✅ Change this to update the filled part
const emptyColor = "hsla(var(--chart-1), 0.15)";

const chartData = [
  {
    name: "Filled",
    value: percentage,
    fill: "hsl(var(--chart-1))",
  },
  {
    name: "Remaining",
    value: 100 - percentage,
    fill: "transparent", // ✅ This is for the empty part
  },
];

export default function SinglePieComponent() {
  return (
    <div className="flex items-center justify-center">
      <ChartContainer
        config={{}}
        className="w-[116px] h-[116px] flex items-center justify-center"
      >
        <PieChart width={116} height={116}>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={40}
            outerRadius={55}
            strokeWidth={0}
            startAngle={90} // ✅ Ensures it starts from the top
            endAngle={-270} // ✅ Makes sure it's a circular progress
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-xs font-semibold fill-foreground"
                    >
                      {percentage}%
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
}
