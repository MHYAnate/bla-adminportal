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
import { useGetSalesData } from "@/services/orders";

// Define the expected data structure
interface SalesDataItem {
  month: string;
  individual: number;
  businessOwner: number;
  total: number;
}

const chartConfig = {
  individual: {
    label: "Individual",
    color: "#134134",
  },
  businessOwner: {
    label: "Business Owner",
    color: "#FFBF3B",
  },
} satisfies ChartConfig;

const timeframeList = [
  { text: "3 Months", value: "3m" },
  { text: "6 Months", value: "6m" },
  { text: "12 Months", value: "12m" },
];

interface OrderBarComponentProps {
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  setStartDate: React.Dispatch<React.SetStateAction<string | null>>;
  setEndDate: React.Dispatch<React.SetStateAction<string | null>>;
}

export function OrderBarComponent({
  setFilter,
  setStartDate,
  setEndDate,
}: OrderBarComponentProps) {
  // Use type assertion for the hook response
  const { salesData, isSalesLoading, salesError, setSalesFilter } = useGetSalesData();

  // Type the transformed data
  const chartData = (salesData as { data?: SalesDataItem[] })?.data?.map((item) => ({
    month: item.month,
    individual: item.individual,
    businessOwner: item.businessOwner,
    total: item.total,
  })) || [];

  const handleTimeframeChange = (timeframe: string) => {
    setFilter(timeframe);
    setSalesFilter({ year: new Date().getFullYear() });
  };

  return (
    <Card className="p-6 flex-1">
      <h5 className="font-bold text-[#383E49] text-2xl mb-6">
        Sales Analytics
      </h5>

      <div className="mb-6 flex justify-between items-center">
        <div className="w-[140px]">
          <SelectFilter
            setFilter={handleTimeframeChange}
            list={timeframeList}
            placeholder="Select period"
          />
        </div>
        <DatePickerWithRange
          setFromDate={setStartDate}
          setToDate={setEndDate}
        />
      </div>

      <CardContent className="p-0 mb-5">
        {isSalesLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <p>Loading sales data...</p>
          </div>
        ) : salesError ? (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-red-500">Error loading sales data</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="max-h-[300px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
              />
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
              <Bar dataKey="individual" fill="var(--color-individual)" radius={4} />
              <Bar dataKey="businessOwner" fill="var(--color-businessOwner)" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>

      <CardFooter className="flex gap-6 ps-[125px]">
        <div className="flex items-center gap-2 text-xs text-[#667085] font-dmsans">
          <div className="h-[15px] w-[15px] rounded-full bg-[#134134]"></div>
          <p>Individual</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#667085] font-dmsans">
          <div className="h-[15px] w-[15px] rounded-full bg-[#FFBF3B]"></div>
          <p>Business Owner</p>
        </div>
      </CardFooter>
    </Card>
  );
}