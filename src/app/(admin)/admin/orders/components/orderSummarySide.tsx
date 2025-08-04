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
import { useGetSalesData } from "@/services/orders"
import { useState } from "react"

const CustomLegend = () => (
  <div className="flex items-center justify-start gap-6 mt-6 ml-12">
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
      <span className="text-gray-500 text-sm">Individual Orders</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-emerald-700"></div>
      <span className="text-gray-500 text-sm">Business Orders</span>
    </div>
  </div>
)

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const individual = payload.find((p: any) => p.dataKey === "Ordered")?.value
    const business = payload.find((p: any) => p.dataKey === "Delivered")?.value

    return (
      <div className="bg-white border shadow-sm p-3 rounded-md text-sm text-gray-800">
        <p className="font-medium mb-1">{label}</p>
        <p>Individual Orders: {individual}</p>
        <p>Business Orders: {business}</p>
      </div>
    )
  }

  return null
}

export default function OrderSummary() {
  const [timeframe, setTimeframe] = useState<"3m" | "6m" | "12m">("6m")
  const currentYear = new Date().getFullYear()

  const {
    isSalesLoading,
    salesData,
    setSalesFilter,
    salesError,
  } = useGetSalesData()

  // Debug logs
  console.log('isSalesLoading:', isSalesLoading)
  console.log('salesData:', salesData)
  console.log('salesError:', salesError)

  // Trigger filter on button click
  const handleTimeframeChange = (value: "3m" | "6m" | "12m") => {
    setTimeframe(value)
    setSalesFilter({ timeframe: value })
  }

  const transformedData = Array.isArray(salesData?.data)
    ? salesData.data.map((item: any) => ({
      month: item.month,
      Ordered: item.individualOrders || 0, // Individual orders
      Delivered: item.businessOwnerOrders || 0, // Business owner orders
      DeliveryRate: 100, // Not used currently
    }))
    : []

  return (
    <div className="w-full  bg-gray-50">
      <div className="bg-white rounded-lg p-8 shadow-sm">
        {/* Header + Filters */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-light text-gray-800">Order Summary</h1>

        </div>

        {/* Chart */}
        <div className="h-80">
          {isSalesLoading ? (
            <div className="flex justify-center items-center h-full text-gray-500">
              Loading...
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
                // tickFormatter={(v) => `${v.toFixed(0)}%`}
                // tick={{ fill: "#9ca3af", fontSize: 14 }}
                // domain={[0, 100]}
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

        {/* Legend */}
        <CustomLegend />
      </div>
    </div>
  )
}