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
import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Download, RefreshCw } from "lucide-react"
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

interface TransformedDataItem {
  month: string;
  Individual: number;
  "Business Owner": number;
  Total: number;
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

  // ✅ FIXED: Use setSalesFilter instead of salesYear to avoid infinite loops
  const {
    isSalesLoading,
    isFetchingSales,
    salesData: rawData,
    salesError,
    refetchSales: refetchSalesData,
    setSalesFilter,
  } = useGetSalesData({
    enabled: true,
    initialFilter: { timeframe, year: new Date().getFullYear() }
  }) as UseSalesDataReturn

  // Type assertion for the sales data with proper null checking
  const data = useMemo(() => rawData as SalesDataResponse, [rawData])

  // ✅ FIXED: Use setSalesFilter with proper dependencies
  useEffect(() => {
    if (setSalesFilter) {
      setSalesFilter((prevFilter: any) => ({
        ...prevFilter,
        timeframe,
        year: new Date().getFullYear(),
      }));
    }
  }, [timeframe]); // ✅ Remove setSalesFilter from dependencies

  // Transform data with proper typing and error handling - memoized
  const transformData = useCallback((data: SalesDataItem[] = []): TransformedDataItem[] => {
    if (!Array.isArray(data)) return [];

    return data.map(item => ({
      month: item.month || '',
      Individual: Number(item.individual) || 0,
      "Business Owner": Number(item.businessOwner) || 0,
      Total: (Number(item.individual) || 0) + (Number(item.businessOwner) || 0),
    }))
  }, [])

  const transformedData = useMemo(() => {
    return data?.data ? transformData(data.data) : []
  }, [data?.data, transformData])

  // Calculate average line if data exists - memoized
  const avgLine = useMemo(() => {
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

  // Memoize export function
  const exportChart = useCallback(async () => {
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
  }, [])

  // Memoize refresh handler
  const handleRefresh = useCallback(() => {
    if (refetchSalesData) {
      refetchSalesData();
    }
  }, [refetchSalesData]);

  // ✅ ADDED: Timeframe change handler
  const handleTimeframeChange = useCallback((newTimeframe: "3m" | "6m" | "12m") => {
    setTimeframe(newTimeframe);
  }, []);

  // Loading state
  if (isSalesLoading || isFetchingSales) {
    return (
      <div className="w-full bg-white rounded-lg p-8 shadow-sm">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mr-3"></div>
          <span>Loading sales data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg p-8 shadow-sm" ref={chartRef}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-light text-gray-800">Sales Analytics</h1>
          <div className="flex items-center gap-2">
            {/* ✅ ADDED: Timeframe selector */}
            {/* <div className="flex gap-1 mr-4">
              {(['3m', '6m', '12m'] as const).map((tf) => (
                <Button
                  key={tf}
                  variant={timeframe === tf ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTimeframeChange(tf)}
                  className="px-3 py-1 text-xs"
                >
                  {tf.toUpperCase()}
                </Button>
              ))}
            </div> */}
            <Button
              onClick={exportChart}
              variant="ghost"
              size="icon"
              disabled={!transformedData.length}
              title="Export Chart"
            >
              <Download className="w-5 h-5" />
            </Button>
            {/* <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isSalesLoading || isFetchingSales}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${(isSalesLoading || isFetchingSales) ? 'animate-spin' : ''}`} />
              Refresh
            </Button> */}
          </div>
        </div>

        <div className="h-80">
          {salesError ? (
            <div className="flex flex-col items-center justify-center h-full text-red-500">
              <p className="text-center mb-4">Error loading sales data: {salesError}</p>
              <Button variant="outline" onClick={handleRefresh}>
                Try Again
              </Button>
            </div>
          ) : data?.error ? (
            <div className="flex flex-col items-center justify-center h-full text-red-500">
              <p className="text-center mb-4">{data.error}</p>
              <Button variant="outline" onClick={handleRefresh}>
                Try Again
              </Button>
            </div>
          ) : !transformedData.length ? (
            <div className="flex justify-center items-center h-full text-gray-500">
              <div className="text-center">
                <p className="mb-4">No sales data available</p>
                <Button variant="outline" onClick={handleRefresh}>
                  Refresh Data
                </Button>
              </div>
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
                <Tooltip
                  formatter={(value, name) => [
                    typeof value === 'number' ? value.toLocaleString() : value,
                    name
                  ]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
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
                {avgLine}
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <CustomLegend />
      </div>
    </div>
  )
}