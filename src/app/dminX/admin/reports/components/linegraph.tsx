// "use client";

// import * as React from "react";
// import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";

// interface MultiLineGraphProps {
//   salesData: Array<{
//     period: string;
//     value: number;
//   }>;
// }

// const chartConfig = {
//   sales: {
//     label: "Sales Performance",
//     color: "hsl(var(--chart-1))",
//   },
// } satisfies ChartConfig;

// export default function MultiLineGraphComponent({ salesData }: MultiLineGraphProps) {
//   const chartData = salesData.map((item) => ({
//     date: item.period,
//     value: item.value,
//   }));

//   console.log(salesData, "salesData")

//   const totalSales = salesData.reduce((acc, curr) => acc + curr.value, 0);

//   return (
//     <Card className="flex-1">
//       <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0">
//         <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
//           <CardTitle>Customer Sales Performance</CardTitle>
//         </div>
//         <div className="flex">
//           <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left sm:px-8 sm:py-6">
//             <span className="text-xs text-muted-foreground">
//               Total Sales
//             </span>
//             <span className="text-lg font-bold leading-none sm:text-3xl">
//               {totalSales.toLocaleString()}
//             </span>
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent className="px-2 sm:p-6">
//         <ChartContainer
//           config={chartConfig}
//           className="aspect-auto h-[250px] w-full"
//         >
//           <LineChart
//             accessibilityLayer
//             data={chartData}
//             margin={{ left: 12, right: 12 }}
//           >
//             <CartesianGrid vertical={false} />
//             <XAxis
//               dataKey="date"
//               tickLine={false}
//               axisLine={false}
//               tickMargin={8}
//               minTickGap={32}
//               tickFormatter={(value) =>
//                 new Date(value).toLocaleDateString("en-US", {
//                   month: "short",
//                   day: "numeric",
//                 })
//               }
//             />
//             <ChartTooltip
//               content={
//                 <ChartTooltipContent
//                   className="w-[150px]"
//                   nameKey="sales"
//                   labelFormatter={(value) =>
//                     new Date(value).toLocaleDateString("en-US", {
//                       month: "short",
//                       day: "numeric",
//                       year: "numeric",
//                     })
//                   }
//                 />
//               }
//             />
//             <Line
//               dataKey="value"
//               type="monotone"
//               stroke="hsl(var(--chart-1))"
//               strokeWidth={2}
//               dot={false}
//             />
//           </LineChart>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
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
} satisfies ChartConfig;

export default function MultiLineGraphComponent({ salesData }: MultiLineGraphProps) {
  // Transform data to match expected format
  const chartData = salesData?.map((item) => ({
    date: item?.month,
    value: item?.total_sales,
  }));

  // Parse month strings into Date objects for proper formatting
  const parseMonth = (monthString: string) => {
    const [year, month] = monthString.split('-');
    return new Date(parseInt(year), parseInt(month) - 1);
  };

  const totalSales = salesData?.reduce((acc, curr) => acc + curr.total_sales, 0);

  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Sales Performance</CardTitle>
        </div>
        <div className="flex">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left sm:px-8 sm:py-6">
            <span className="text-xs text-muted-foreground">
              Total Sales
            </span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
            ₦{totalSales?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => 
                parseMonth(value)?.toLocaleDateString("en-US", {
                  month: "short",
                  year: "2-digit"
                })
              }
            />
           <ChartTooltip
  content={
    <ChartTooltipContent
      className="w-[150px]"
      nameKey="sales"
      labelFormatter={(value) =>
        parseMonth(value)?.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric"
        })
      }
      formatter={(value) => [
        `	₦${Number(value)?.toLocaleString(undefined, { 
          maximumFractionDigits: 2,
          minimumFractionDigits: 2
        })}`,
        ""
      ]}
    />
  }
/>
            <Line
              dataKey="value"
              type="monotone"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}