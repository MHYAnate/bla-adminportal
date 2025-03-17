// "use client";

// import { Bar, BarChart, XAxis, YAxis } from "recharts";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";

// const chartData = [
//   { month: "January", desktop: 186 },
//   { month: "February", desktop: 305 },
//   { month: "March", desktop: 237 },
//   { month: "April", desktop: 73 },
//   { month: "May", desktop: 209 },
//   { month: "June", desktop: 214 },
// ];

// const chartConfig = {
//   desktop: {
//     label: "Desktop",
//     color: "hsl(var(--chart-1))",
//   },
// } satisfies ChartConfig;

// export function HorizontalBarComponent() {
//   return (
//     <Card className="p-7 w-[274px]">
//       <div className="flex items-center justify-between mb-6">
//         <h5 className="font-bold text-[#383E49] text-2xl">Stock Alerts</h5>
//       </div>
//       <CardContent className="p-0">
//         <ChartContainer config={chartConfig} className="max-h-[343px] w-full">
//           <BarChart
//             accessibilityLayer
//             data={chartData}
//             layout="vertical"
//             width={274}
//             height={chartData.length * 28} // Adjust the height of the chart to fit all bars (each bar is 28px)
//             margin={{
//               left: 0,
//               right: 0,
//               top: 0,
//               bottom: 0,
//             }}
//           >
//             <defs>
//               <linearGradient
//                 id="desktopGradient"
//                 x1="0%"
//                 y1="0%"
//                 x2="100%"
//                 y2="0%"
//               >
//                 <stop offset="0%" stopColor="#FFCD71" />
//                 <stop offset="100%" stopColor="rgba(255, 205, 113, 0)" />
//               </linearGradient>
//             </defs>

//             <XAxis type="number" dataKey="desktop" hide />
//             <YAxis
//               dataKey="month"
//               type="category"
//               tickLine={false}
//               tickMargin={10}
//               axisLine={false}
//               tickFormatter={(value) => value.slice(0, 3)}
//             />
//             <ChartTooltip
//               cursor={false}
//               content={<ChartTooltipContent hideLabel />}
//             />
//             <Bar
//               dataKey="desktop"
//               fill="url(#desktopGradient)"
//               radius={5}
//               barSize={28}
//             />
//           </BarChart>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import { Bar, BarChart, XAxis, YAxis, LabelList } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function HorizontalBarComponent() {
  return (
    <Card className="w-[274px] p-7">
      <div className="flex items-center justify-between mb-6">
        <h5 className="font-bold text-[#383E49] text-2xl">Stock Alerts</h5>
      </div>
      <CardContent className="p-0 h-full">
        <ChartContainer config={chartConfig} className="w-full h-[320px]">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            width={274}
            height={34}
            margin={{
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient
                id="desktopGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#FFCD71" />
                <stop offset="100%" stopColor="rgba(255, 205, 113, 0)" />
              </linearGradient>
            </defs>

            {/* Axis Configuration */}
            <XAxis type="number" dataKey="desktop" hide />
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />

            {/* Tooltip Configuration */}
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            {/* Bar Configuration */}
            <Bar
              dataKey="desktop"
              fill="url(#desktopGradient)" // Apply gradient
              radius={5}
              barSize={34}
            >
              <LabelList
                dataKey="month"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />

              <LabelList
                dataKey="desktop"
                position="insideRight"
                offset={-8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
