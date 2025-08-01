"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Line,
} from "recharts"
import html2canvas from "html2canvas"
import { useState, useEffect, useRef, useCallback } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGetSalesData } from "@/services/orders"

// Define types for the data
interface SalesDataItem {
  month: string;
  individual: number;
  businessOwner: number;
  total?: number;
}

interface SalesDataResponse {
  data?: SalesDataItem[];
  success?: boolean;
  error?: string;
}

// Type for the hook's return value
interface UseSalesDataReturn {
  salesData?: SalesDataResponse;
  isSalesLoading: boolean;
  salesError?: Error;
  salesYear?: (params: { timeframe: string }) => void;
  setSalesFilter?: (params: { timeframe: string }) => void;
}

const CustomLegend = () => (
  <div className="flex items-center justify-start gap-6 mt-6 ml-12">
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-emerald-700"></div>
      <span className="text-gray-600 text-sm">Individual</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
      <span className="text-gray-600 text-sm">Business Owner</span>
    </div>
  </div>
)

export default function SalesChart() {
  const chartRef = useRef<HTMLDivElement>(null)
  const [timeframe, setTimeframe] = useState<"3m" | "6m" | "12m">("6m")

  // Type the hook response
  const {
    salesData,
    isSalesLoading,
    salesError,
    salesYear,
  } = useGetSalesData() as UseSalesDataReturn

  // Fetch data when timeframe changes
  useEffect(() => {
    if (salesYear) {
      try {
        salesYear({ timeframe })
      } catch (error) {
        console.error("Error fetching sales data:", error)
      }
    }
  }, [timeframe, salesYear])

  // Transform data with proper typing and error handling
  const transformData = useCallback((data: SalesDataItem[] = []) => {
    return data.map(item => ({
      month: item.month,
      Individual: item.individual,
      "Business Owner": item.businessOwner,
      Total: (item.individual || 0) + (item.businessOwner || 0),
    }))
  }, [])

  const transformedData = salesData?.data ? transformData(salesData.data) : []

  // Calculate average line if data exists
  const avgLine = useCallback(() => {
    if (!transformedData.length) return null
    const totalAvg = transformedData.reduce((sum, d) => sum + (d.Total || 0), 0) / transformedData.length
    return (
      <Line
        type="monotone"
        dataKey={() => totalAvg}
        stroke="#94a3b8"
        strokeDasharray="5 5"
        dot={false}
        name="Avg. Sales"
      />
    )
  }, [transformedData])

  const exportChart = async () => {
    if (!chartRef.current) return
    try {
      const canvas = await html2canvas(chartRef.current)
      const link = document.createElement("a")
      link.download = `sales-chart-${Date.now()}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    } catch (error) {
      console.error("Error exporting chart:", error)
    }
  }

  return (
    <div className="w-full min-h-screen">
      <div className="bg-white rounded-lg p-8 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-light text-gray-800">Sales</h1>
          <div className="flex items-center gap-2">
            <Button
              onClick={exportChart}
              variant="ghost"
              size="icon"
              disabled={isSalesLoading || !transformedData.length}
            >
              <Download className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Chart */}
        <div className="h-80" ref={chartRef}>
          {isSalesLoading ? (
            <div className="flex justify-center items-center h-full text-gray-500">
              Loading sales data...
            </div>
          ) : salesError ? (
            <div className="text-red-500 text-center">
              Failed to load sales data: {salesError.message}
            </div>
          ) : salesData?.error ? (
            <div className="text-red-500 text-center">
              {salesData.error}
            </div>
          ) : !transformedData.length ? (
            <div className="flex justify-center items-center h-full text-gray-500">
              No sales data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={transformedData}
                margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
                barCategoryGap="20%"
              >
                <CartesianGrid
                  strokeDasharray="none"
                  stroke="#e5e7eb"
                  horizontal={true}
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
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 14 }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  domain={[0, "auto"]}
                />
                <Tooltip />
                <Bar
                  dataKey="Individual"
                  fill="#065f46"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
                <Bar
                  dataKey="Business Owner"
                  fill="#fbbf24"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
                {avgLine()}
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Legend */}
        <CustomLegend />
      </div>
    </div>
  )
}