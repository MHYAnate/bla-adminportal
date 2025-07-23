"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { SelectFilter } from "@/app/(admin)/components/select-filter";
import DatePickerWithRange from "@/components/ui/date-picker";
const chartData = [
  { month: "January", purchase: 186, sales: 80 },
  { month: "February", purchase: 305, sales: 200 },
  { month: "March", purchase: 237, sales: 120 },
  { month: "April", purchase: 73, sales: 190 },
  { month: "May", purchase: 209, sales: 130 },
  { month: "June", purchase: 214, sales: 140 },
];

const chartConfig = {
  amount: {
    label: "Amount",
    color: "#134134",
  },
  orders: {
    label: "Orders",
    color: "#FFBF3B",
  },
} satisfies ChartConfig;

const list = [
  {
    text: "Day",
    value: "day",
  },
  {
    text: "Week",
    value: "week",
  },
  {
    text: "Month",
    value: "month",
  },
  {
    text: "Year",
    value: "year",
  },
];

export function OrderBarComponent({
  data,
  setFilter,
  setStartDate,
  setEndDate,
}: {
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  setStartDate: React.Dispatch<React.SetStateAction<string | null>>;
  setEndDate: React.Dispatch<React.SetStateAction<string | null>>;
  data: any;
}) {
  return (
    <Card className="p-6 flex-1">
      <h5 className="font-bold text-[#383E49] text-2xl mb-6">
        Sales & Purchases
      </h5>
      <div className="mb-6 flex justify-between items-center">
        <div className="w-[110px]">
          <SelectFilter
            setFilter={setFilter}
            list={list}
            placeholder="Select duration"
          />
        </div>
        <DatePickerWithRange
          setFromDate={setStartDate}
          setToDate={setEndDate}
        />
      </div>
      <CardContent className="p-0 mb-5">
        <ChartContainer config={chartConfig} className="max-h-[300px] w-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <YAxis tickLine={false} axisLine={false} tickMargin={10} />

            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="amount" fill="var(--color-amount)" radius={4} />
            <Bar dataKey="orders" fill="var(--color-orders)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex gap-6 ps-[125px]">
        <div className="flex items-center gap-2 text-xs text-[#667085] font-dmsans">
          <div className="h-[15px] w-[15px] rounded-full bg-[#134134]"></div>
          <p>Amount</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#667085] font-dmsans">
          <div className="h-[15px] w-[15px] rounded-full bg-[#FFBF3B]"></div>
          <p>Orders</p>
        </div>
      </CardFooter>
    </Card>
  );
}
