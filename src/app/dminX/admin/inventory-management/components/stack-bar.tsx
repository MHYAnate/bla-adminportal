"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
  { month: "July", desktop: 150, mobile: 90 },
  { month: "August", desktop: 250, mobile: 160 },
  { month: "September", desktop: 170, mobile: 110 },
  { month: "October", desktop: 230, mobile: 140 },
  { month: "November", desktop: 260, mobile: 180 },
  { month: "December", desktop: 300, mobile: 220 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#FFBF3B",
  },
  mobile: {
    label: "Mobile",
    color: "#134134",
  },
} satisfies ChartConfig;

export function StackBarComponent() {
  return (
    <Card className="p-7 flex-1">
      <div className="flex items-center justify-between mb-6">
        <h5 className="font-bold text-[#383E49] text-2xl">Stock Report</h5>
        <div>
          <CardFooter className="flex gap-6 ps-[125px]">
            <div className="flex items-center gap-2 text-xs text-[#667085] font-dmsans">
              <div className="h-[15px] w-[15px] rounded-full bg-[#FFBF3B]"></div>
              <p>Stock In</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#667085] font-dmsans">
              <div className="h-[15px] w-[15px] rounded-full bg-[#134134]"></div>
              <p>Stock Out</p>
            </div>
          </CardFooter>
        </div>
      </div>
      <CardContent className="p-0">
        <ChartContainer config={chartConfig} className="max-h-[343px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} horizontal={false} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />

            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Bar
              dataKey="desktop"
              stackId="a"
              fill="var(--color-desktop)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="mobile"
              stackId="a"
              fill="var(--color-mobile)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
// } from "@/components/ui/chart";

// const chartData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
//   { month: "July", desktop: 150, mobile: 90 },
//   { month: "August", desktop: 250, mobile: 160 },
//   { month: "September", desktop: 170, mobile: 110 },
//   { month: "October", desktop: 230, mobile: 140 },
//   { month: "November", desktop: 260, mobile: 180 },
//   { month: "December", desktop: 300, mobile: 220 },
// ];

// const chartConfig = {
//   desktop: {
//     label: "Desktop",
//     color: "#FFBF3B",
//   },
//   mobile: {
//     label: "Mobile",
//     color: "#134134",
//   },
// } satisfies ChartConfig;

// export function StackBarComponent() {
//   return (
//     <Card>
//       <div className="flex items-center justify-between mb-6">
//         <h5 className="font-bold text-[#383E49] text-2xl">Stock Report</h5>
//       </div>
//       <CardContent>
//         <ChartContainer config={chartConfig}>
//           <BarChart accessibilityLayer data={chartData}>
//             <CartesianGrid vertical={false} />
//             <XAxis
//               dataKey="month"
//               tickLine={false}
//               tickMargin={10}
//               axisLine={false}
//               tickFormatter={(value) => value.slice(0, 3)} // Shorten month name
//             />
//             <YAxis />
//             <ChartTooltip content={<ChartTooltipContent hideLabel />} />
//             <Bar
//               dataKey="desktop"
//               stackId="a"
//               fill="var(--color-desktop)"
//               radius={[0, 0, 4, 4]}
//             />
//             <Bar
//               dataKey="mobile"
//               stackId="a"
//               fill="var(--color-mobile)"
//               radius={[4, 4, 0, 0]}
//             />
//           </BarChart>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   );
// }
