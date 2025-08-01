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
import LoadingSvg from "@/components/load"

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

// Type for the hook's return value based on what we can see
interface UseSalesDataReturn {
  isSalesLoading: boolean;
  isFetchingSales: boolean;
  salesData: unknown;
  salesYear: (params: { timeframe: string }) => void;
  salesError: string | undefined;
  refetchSales: (options?: any) => Promise<any>;
  setSalesFilter: React.Dispatch<React.SetStateAction<any>>;
  currentFilters: {};
  hasData: boolean;
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

  // Type the hook response based on its actual return values
  const {
    isSalesLoading,
    isFetchingSales,
    salesData: rawData,
    salesYear,
    salesError,
    refetchSales: refetchSalesData,
    setSalesFilter,
  } = useGetSalesData() as UseSalesDataReturn

  // Type assertion for the sales data
  const data = rawData as SalesDataResponse

  // Fetch data when timeframe changes
  useEffect(() => {
    if (salesYear) {
      salesYear({ timeframe })
    }
  }, [timeframe, salesYear])

  // Transform data with proper typing and error handling
  const transformData = useCallback((data: SalesDataItem[] = []) => {
    return data.map(item => ({
      month: item.month,
      Individual: item.individual || 0,
      "Business Owner": item.businessOwner || 0,
      Total: (item.individual || 0) + (item.businessOwner || 0),
    }))
  }, [])

  const transformedData = data?.data ? transformData(data.data) : []

  // Calculate average line if data exists
  const avgLine = useCallback(() => {
    if (!transformedData.length) return null
    const totalAvg = transformedData.reduce((sum, d) => sum + (d.Total || 0), 0) / transformedData.length
    return (
      <Line
        type="monotone"
        stroke="#94a3b8"
        strokeDasharray="5 5"
        dot={false}
        name="Avg. Sales"
        dataKey={() => totalAvg}
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

  if (isSalesLoading || isFetchingSales) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSvg />
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen">
      <div className="bg-white rounded-lg p-8 shadow-sm" ref={chartRef}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-light text-gray-800">Sales Analytics</h1>
          <div className="flex items-center gap-2">
            <Button
              onClick={exportChart}
              variant="ghost"
              size="icon"
              disabled={!transformedData.length}
            >
              <Download className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              onClick={() => refetchSalesData()}
              disabled={isSalesLoading || isFetchingSales}
            >
              Refresh Data
            </Button>
          </div>
        </div>

        <div className="h-80">
          {salesError ? (
            <div className="text-red-500 text-center">
              Error loading sales data: {salesError}
            </div>
          ) : data?.error ? (
            <div className="text-red-500 text-center">
              {data.error}
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
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Individual" fill="#065f46" />
                <Bar dataKey="Business Owner" fill="#fbbf24" />
                {avgLine()}
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <CustomLegend />
      </div>
    </div>
  )
}