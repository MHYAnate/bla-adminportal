"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { useGetOrdersSummary } from "@/services/orders"
import { Button } from "@/components/ui/button"
import { useState, useMemo, useCallback } from "react"

// Define types for the data
interface OrderSummaryDataItem {
  month: string;
  ordered: number;
  delivered: number;
}

interface OrderSummaryResponse {
  data?: OrderSummaryDataItem[];
}

interface TransformedDataItem {
  month: string;
  Ordered: number;
  Delivered: number;
  DeliveryRate: number;
}

const CustomLegend = () => (
  <div className="flex items-center justify-start gap-6 mt-6 ml-12">
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
      <span className="text-gray-500 text-sm">Ordered</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-emerald-700"></div>
      <span className="text-gray-500 text-sm">Delivered</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 border-2 border-blue-600 border-dashed rounded-full"></div>
      <span className="text-gray-500 text-sm">Delivery Rate (%)</span>
    </div>
  </div>
)

interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    dataKey: string;
    value: number;
    color?: string;
  }[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const ordered = payload.find((p) => p.dataKey === "Ordered")?.value
    const delivered = payload.find((p) => p.dataKey === "Delivered")?.value
    const deliveryRate = payload.find((p) => p.dataKey === "DeliveryRate")?.value

    return (
      <div className="bg-white border shadow-sm p-3 rounded-md text-sm text-gray-800">
        <p className="font-medium mb-1">{label}</p>
        <p>Ordered: {ordered?.toLocaleString()}</p>
        <p>Delivered: {delivered?.toLocaleString()}</p>
        <p>Delivery Rate: {deliveryRate?.toFixed(1)}%</p>
      </div>
    )
  }

  return null
}

export default function OrderSummary() {
  const [timeframe, setTimeframe] = useState<"3m" | "6m" | "12m">("6m")

  const {
    getOrdersSummaryData,
    getOrdersSummaryIsLoading,
    getOrdersSummaryError,
    setOrdersSummaryFilter,
  } = useGetOrdersSummary() as {
    getOrdersSummaryData: OrderSummaryResponse;
    getOrdersSummaryIsLoading: boolean;
    getOrdersSummaryError: any;
    setOrdersSummaryFilter: (params: { timeframe: string }) => void;
  };

  // Memoize the timeframe change handler
  const handleTimeframeChange = useCallback((value: "3m" | "6m" | "12m") => {
    setTimeframe(value)
    if (setOrdersSummaryFilter) {
      setOrdersSummaryFilter({ timeframe: value })
    }
  }, [setOrdersSummaryFilter])

  // Memoize the data transformation
  const transformedData: TransformedDataItem[] = useMemo(() => {
    if (!getOrdersSummaryData?.data || !Array.isArray(getOrdersSummaryData.data)) {
      return [];
    }

    return getOrdersSummaryData.data.map((item) => {
      const ordered = Number(item.ordered) || 0;
      const delivered = Number(item.delivered) || 0;
      const deliveryRate = ordered === 0 ? 0 : (delivered / ordered) * 100;

      return {
        month: item.month || '',
        Ordered: ordered,
        Delivered: delivered,
        DeliveryRate: deliveryRate,
      };
    });
  }, [getOrdersSummaryData?.data]);

  // Memoize timeframe options
  const timeframeOptions = useMemo(() => [
    { value: "3m" as const, label: "3M" },
    { value: "6m" as const, label: "6M" },
    { value: "12m" as const, label: "12M" },
  ], []);

  return (
    <div className="w-full bg-gray-50">
      <div className="bg-white rounded-lg p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-light text-gray-800">Order Summary</h1>

          {/* Timeframe selector */}
          <div className="flex gap-2">
            {timeframeOptions.map((option) => (
              <Button
                key={option.value}
                variant={timeframe === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => handleTimeframeChange(option.value)}
                className="text-xs"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="h-80">
          {getOrdersSummaryIsLoading ? (
            <div className="flex justify-center items-center h-full text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mr-3"></div>
              <span>Loading order summary...</span>
            </div>
          ) : getOrdersSummaryError ? (
            <div className="flex flex-col items-center justify-center h-full text-red-500">
              <p className="text-center mb-4">Error loading order summary</p>
              <Button variant="outline" onClick={() => handleTimeframeChange(timeframe)}>
                Try Again
              </Button>
            </div>
          ) : transformedData.length === 0 ? (
            <div className="flex justify-center items-center h-full text-gray-500">
              <div className="text-center">
                <p className="mb-4">No order summary data available</p>
                <Button variant="outline" onClick={() => handleTimeframeChange(timeframe)}>
                  Refresh Data
                </Button>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={transformedData}
                margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="none"
                  stroke="#e5e7eb"
                  horizontal
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 14 }}
                  dy={10}
                />
                <YAxis
                  yAxisId="left"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 14 }}
                  domain={[0, "auto"]}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 14 }}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="Ordered"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 4, fill: "#f59e0b" }}
                  animationDuration={500}
                  yAxisId="left"
                />
                <Line
                  type="monotone"
                  dataKey="Delivered"
                  stroke="#065f46"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 4, fill: "#065f46" }}
                  animationDuration={500}
                  yAxisId="left"
                />
                <Line
                  type="monotone"
                  dataKey="DeliveryRate"
                  stroke="#0284c7"
                  strokeWidth={2}
                  strokeDasharray="6 3"
                  dot={false}
                  animationDuration={500}
                  yAxisId="right"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <CustomLegend />
      </div>
    </div>
  )
}