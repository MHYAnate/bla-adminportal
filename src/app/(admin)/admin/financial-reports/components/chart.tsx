// "use client"
// import { useState } from "react"
// import { CartesianGrid, Line, ResponsiveContainer, XAxis, YAxis, Area, ComposedChart, Tooltip } from "recharts"
// import { ArrowUpIcon, ArrowDownIcon, DownloadIcon, InfoIcon } from "lucide-react"
// import { type ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import type { DashboardData } from "@/types" // Assuming you have a type definition

// // Updated color scheme
// const chartConfig = {
//   revenue: {
//     label: "Revenue",
//     color: "#EC9F01", // Gold/amber color as requested
//   },
//   orders: {
//     label: "Orders",
//     color: "#E63946", // Complementary red shade
//   },
// } satisfies ChartConfig

// interface RevenueChartProps {
//   data?: DashboardData
// }

// export default function RevenueChart({ data }: RevenueChartProps) {
//   const [activeView, setActiveView] = useState<"7days" | "30days" | "90days" | "12months">("30days")
//   const [activePoint, setActivePoint] = useState<number | null>(null)

//   // Exchange rate (approximate, for demonstration)
//   const usdToNairaRate = 1500

//   const formatToKOrM = (value: number) => {
//     if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M"
//     if (value >= 1_000) return (value / 1_000).toFixed(1) + "k"
//     return value.toString()
//   }

//   const formatCurrency = (value: number) => {
//     // Convert to Naira and format
//     const nairaValue = value * usdToNairaRate
//     return new Intl.NumberFormat("en-NG", {
//       style: "currency",
//       currency: "NGN",
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(nairaValue)
//   }

//   // Transform sales performance data for the chart with more detailed dates
//   const chartData = data?.charts.salesPerformance.map((item, index) => ({
//     month: new Date(item.month).toLocaleDateString("en-US", { month: "short" }),
//     fullMonth: new Date(item.month).toLocaleDateString("en-US", { month: "long" }),
//     year: new Date(item.month).getFullYear(),
//     total_sales: item.total_sales,
//     orders_count: item.orders_count,
//     rawDate: item.month,
//     index,
//   })) || [
//     {
//       month: "Jan",
//       fullMonth: "January",
//       year: 2023,
//       total_sales: 45000,
//       orders_count: 120,
//       rawDate: "2023-01-01",
//       index: 0,
//     },
//     {
//       month: "Feb",
//       fullMonth: "February",
//       year: 2023,
//       total_sales: 52000,
//       orders_count: 145,
//       rawDate: "2023-02-01",
//       index: 1,
//     },
//     {
//       month: "Mar",
//       fullMonth: "March",
//       year: 2023,
//       total_sales: 49000,
//       orders_count: 132,
//       rawDate: "2023-03-01",
//       index: 2,
//     },
//     {
//       month: "Apr",
//       fullMonth: "April",
//       year: 2023,
//       total_sales: 63000,
//       orders_count: 165,
//       rawDate: "2023-04-01",
//       index: 3,
//     },
//     {
//       month: "May",
//       fullMonth: "May",
//       year: 2023,
//       total_sales: 59000,
//       orders_count: 155,
//       rawDate: "2023-05-01",
//       index: 4,
//     },
//     {
//       month: "Jun",
//       fullMonth: "June",
//       year: 2023,
//       total_sales: 75000,
//       orders_count: 190,
//       rawDate: "2023-06-01",
//       index: 5,
//     },
//     {
//       month: "Jul",
//       fullMonth: "July",
//       year: 2023,
//       total_sales: 68000,
//       orders_count: 175,
//       rawDate: "2023-07-01",
//       index: 6,
//     },
//   ]

//   // Find max value for domain calculation
//   const maxValue = Math.max(...chartData.map((item) => item.total_sales), 0)
//   const maxOrders = Math.max(...chartData.map((item) => item.orders_count), 0)

//   // Calculate revenue metrics
//   const totalRevenue = data?.metrics?.revenue?.total || chartData.reduce((sum, item) => sum + item.total_sales, 0)
//   const revenueTrend = data?.metrics?.revenue?.trend || "up"
//   const revenueChange = data?.metrics?.revenue?.changePercentage || 12.5

//   // Enhanced tooltip with modern design
//   const ModernTooltipContent = ({ active, payload }: any) => {
//     if (active && payload && payload.length) {
//       const dataPoint = payload[0].payload
//       return (
//         <ChartTooltipContent>
//           <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 backdrop-blur-sm">
//             <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
//               {dataPoint.fullMonth} {dataPoint.year}
//             </p>
//             <div className="space-y-3">
//               <div className="flex items-center justify-between gap-8">
//                 <span className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
//                   <div className="w-2 h-2 rounded-full bg-[#EC9F01] mr-2"></div>
//                   Revenue
//                 </span>
//                 <span className="text-base font-bold text-[#EC9F01]">{formatCurrency(dataPoint.total_sales)}</span>
//               </div>
//               <div className="flex items-center justify-between gap-8">
//                 <span className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
//                   <div className="w-2 h-2 rounded-full bg-[#E63946] mr-2"></div>
//                   Orders
//                 </span>
//                 <span className="text-base font-bold text-[#E63946]">{dataPoint.orders_count}</span>
//               </div>
//             </div>
//           </div>
//         </ChartTooltipContent>
//       )
//     }
//     return null
//   }

//   // Custom dot component with hover effect
//   const CustomDot = ({ cx, cy, dataKey, payload, index }: any) => {
//     const isRevenue = dataKey === "total_sales"
//     const color = isRevenue ? "#EC9F01" : "#E63946"
//     const isActive = activePoint === index

//     return (
//       <g>
//         <circle
//           cx={cx}
//           cy={cy}
//           r={isActive ? 8 : 4}
//           fill={color}
//           stroke="white"
//           strokeWidth={2}
//           style={{ transition: "all 0.3s ease" }}
//           onMouseEnter={() => setActivePoint(index)}
//           onMouseLeave={() => setActivePoint(null)}
//         />
//         {isActive && (
//           <circle
//             cx={cx}
//             cy={cy}
//             r={12}
//             fill="transparent"
//             stroke={color}
//             strokeWidth={1.5}
//             strokeDasharray="3 3"
//             style={{ transition: "all 0.3s ease" }}
//           />
//         )}
//         {isActive && (
//           <foreignObject
//             x={cx - 50}
//             y={isRevenue ? cy - 45 : cy + 15}
//             width={100}
//             height={30}
//             style={{ overflow: "visible" }}
//           >
//             <div
//               className={`text-xs font-semibold text-center py-1 px-2 rounded-md shadow-md ${isRevenue ? "bg-[#EC9F01]" : "bg-[#E63946]"} text-white`}
//             >
//               {isRevenue ? formatCurrency(payload.total_sales) : payload.orders_count}
//             </div>
//           </foreignObject>
//         )}
//       </g>
//     )
//   }

//   return (
//     <div className="h-full flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Revenue Overview</h2>
//           <div className="flex items-center mt-2">
//             <span className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalRevenue)}</span>
//             <div
//               className={`ml-3 flex items-center px-2 py-1 rounded-full text-sm font-medium ${
//                 revenueTrend === "up"
//                   ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30"
//                   : "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/30"
//               }`}
//             >
//               {revenueTrend === "up" ? (
//                 <ArrowUpIcon className="h-3 w-3 mr-1" />
//               ) : (
//                 <ArrowDownIcon className="h-3 w-3 mr-1" />
//               )}
//               {Math.abs(revenueChange).toFixed(1)}%
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-col sm:flex-row gap-3">
//           <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)} className="w-full sm:w-auto">
//             <TabsList className="grid grid-cols-4 w-full">
//               <TabsTrigger value="7days">7D</TabsTrigger>
//               <TabsTrigger value="30days">30D</TabsTrigger>
//               <TabsTrigger value="90days">90D</TabsTrigger>
//               <TabsTrigger value="12months">1Y</TabsTrigger>
//             </TabsList>
//           </Tabs>

//           <Button variant="outline" size="icon" className="h-9 w-9">
//             <DownloadIcon className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>

//       <div className="flex-1 min-h-[300px]">
//         <ChartContainer config={chartConfig} className="h-full w-full">
//           <ResponsiveContainer width="100%" height="100%">
//             <ComposedChart
//               data={chartData}
//               margin={{ left: 10, right: 30, top: 20, bottom: 10 }}
//               onMouseLeave={() => setActivePoint(null)}
//             >
//               <defs>
//                 <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#EC9F01" stopOpacity={0.3} />
//                   <stop offset="95%" stopColor="#EC9F01" stopOpacity={0} />
//                 </linearGradient>
//               </defs>
//               <CartesianGrid vertical={true} horizontal={true} stroke="#E5E7EB" strokeDasharray="3 3" />
//               <XAxis
//                 dataKey="month"
//                 tickLine={true}
//                 axisLine={true}
//                 dy={10}
//                 tick={{ fill: "#6B7280", fontSize: 12 }}
//                 label={{
//                   value: "Month",
//                   position: "insideBottom",
//                   offset: -5,
//                   fill: "#6B7280",
//                   fontSize: 12,
//                 }}
//                 padding={{ left: 20, right: 20 }}
//               />
//               <YAxis
//                 yAxisId="left"
//                 tickLine={true}
//                 axisLine={true}
//                 tickCount={8}
//                 tickFormatter={(value) => `₦${formatToKOrM(value * usdToNairaRate)}`}
//                 domain={[0, maxValue * 1.1]}
//                 tick={{ fill: "#6B7280", fontSize: 12 }}
//                 label={{
//                   value: "Revenue (₦)",
//                   angle: -90,
//                   position: "insideLeft",
//                   fill: "#EC9F01",
//                   fontSize: 12,
//                 }}
//               />
//               <YAxis
//                 yAxisId="right"
//                 orientation="right"
//                 tickLine={true}
//                 axisLine={true}
//                 tickCount={8}
//                 tickFormatter={(value) => formatToKOrM(value)}
//                 domain={[0, maxOrders * 1.1]}
//                 tick={{ fill: "#6B7280", fontSize: 12 }}
//                 label={{
//                   value: "Orders",
//                   angle: 90,
//                   position: "insideRight",
//                   fill: "#E63946",
//                   fontSize: 12,
//                 }}
//               />
//               <Tooltip
//                 cursor={{ stroke: "#E5E7EB", strokeWidth: 1, strokeDasharray: "5 5" }}
//                 content={<ModernTooltipContent />}
//                 wrapperStyle={{ outline: "none" }}
//               />
//               <Area
//                 yAxisId="left"
//                 type="monotone"
//                 dataKey="total_sales"
//                 stroke="#EC9F01"
//                 strokeWidth={3}
//                 fill="url(#colorRevenue)"
//                 fillOpacity={1}
//                 dot={(props) => <CustomDot {...props} dataKey="total_sales" />}
//                 activeDot={false}
//               />
//               <Line
//                 yAxisId="right"
//                 type="monotone"
//                 dataKey="orders_count"
//                 stroke="#E63946"
//                 strokeWidth={3}
//                 dot={(props) => <CustomDot {...props} dataKey="orders_count" />}
//                 activeDot={false}
//               />
//             </ComposedChart>
//           </ResponsiveContainer>
//         </ChartContainer>
//       </div>

//       <div className="mt-6 flex flex-wrap gap-6 justify-center sm:justify-start">
//         <div className="flex items-center gap-2">
//           <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#EC9F01] to-[#F7B733]" />
//           <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Revenue (₦)</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#E63946] to-[#FF5A67]" />
//           <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Orders</span>
//         </div>
//         <div className="flex items-center gap-2 ml-auto">
//           <InfoIcon className="h-4 w-4 text-gray-400" />
//           <span className="text-xs text-gray-500 dark:text-gray-400">Hover over points for details</span>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { CartesianGrid, Line, XAxis, YAxis, Area, ComposedChart, Tooltip } from "recharts"
import { ArrowUpIcon, ArrowDownIcon, DownloadIcon, InfoIcon } from "lucide-react"
import { type ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { DashboardData } from "@/types" // Assuming you have a type definition

// Updated color scheme
const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#EC9F01", // Gold/amber color as requested
  },
  orders: {
    label: "Orders",
    color: "#E63946", // Complementary red shade
  },
} satisfies ChartConfig

interface RevenueChartProps {
  data?: DashboardData
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const [isMounted, setIsMounted] = useState(false) // New mounting state
  const [activeView, setActiveView] = useState<"7days" | "30days" | "90days" | "12months">("30days")
  const [activePoint, setActivePoint] = useState<number | null>(null)
  const [containerSize, setContainerSize] = useState({ width: 907, height: 510 })

  useEffect(() => {
    setIsMounted(true)
    // Only calculate dynamic sizes if actually needed
    const handleResize = () => {
      const container = document.getElementById('chart-container')
      if (container) {
        setContainerSize({
          width: container.offsetWidth,
          height: container.offsetHeight
        })
      }
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Exchange rate (approximate, for demonstration)
  const usdToNairaRate = 1500

  const formatToKOrM = (value: number) => {
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M"
    if (value >= 1_000) return (value / 1_000).toFixed(1) + "k"
    return value.toString()
  }

  const formatCurrency = (value: number) => {
    // Convert to Naira and format
    const nairaValue = value * usdToNairaRate
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(nairaValue)
  }

  // Transform sales performance data for the chart with more detailed dates
  const chartData = data?.charts?.salesPerformance?.map((item, index) =>  ({
    month: new Date(item.month).toLocaleDateString("en-US", { month: "short" }),
    fullMonth: new Date(item.month).toLocaleDateString("en-US", { month: "long" }),
    year: new Date(item.month).getFullYear(),
    total_sales: item.total_sales,
    orders_count: item.orders_count,
    rawDate: item.month,
    index,
  })) || [
    {
      month: "Jan",
      fullMonth: "January",
      year: 2023,
      total_sales: 45000,
      orders_count: 120,
      rawDate: "2023-01-01",
      index: 0,
    },
    {
      month: "Feb",
      fullMonth: "February",
      year: 2023,
      total_sales: 52000,
      orders_count: 145,
      rawDate: "2023-02-01",
      index: 1,
    },
    {
      month: "Mar",
      fullMonth: "March",
      year: 2023,
      total_sales: 49000,
      orders_count: 132,
      rawDate: "2023-03-01",
      index: 2,
    },
    {
      month: "Apr",
      fullMonth: "April",
      year: 2023,
      total_sales: 63000,
      orders_count: 165,
      rawDate: "2023-04-01",
      index: 3,
    },
    {
      month: "May",
      fullMonth: "May",
      year: 2023,
      total_sales: 59000,
      orders_count: 155,
      rawDate: "2023-05-01",
      index: 4,
    },
    {
      month: "Jun",
      fullMonth: "June",
      year: 2023,
      total_sales: 75000,
      orders_count: 190,
      rawDate: "2023-06-01",
      index: 5,
    },
    {
      month: "Jul",
      fullMonth: "July",
      year: 2023,
      total_sales: 68000,
      orders_count: 175,
      rawDate: "2023-07-01",
      index: 6,
    },
  ]

  // Find max value for domain calculation
  const maxValue = Math.max(...chartData.map((item) => item.total_sales), 0)
  const maxOrders = Math.max(...chartData.map((item) => item.orders_count), 0)

  // Calculate revenue metrics
  const totalRevenue = data?.metrics?.revenue?.total || chartData.reduce((sum, item) => sum + item.total_sales, 0)
  const revenueTrend = data?.metrics?.revenue?.trend || "up"
  const revenueChange = data?.metrics?.revenue?.changePercentage || 12.5

  // Enhanced tooltip with modern design
  const ModernTooltipContent = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload
      return (
        <ChartTooltipContent>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 backdrop-blur-sm">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              {dataPoint.fullMonth} {dataPoint.year}
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-8">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#EC9F01] mr-2"></div>
                  Revenue
                </span>
                <span className="text-base font-bold text-[#EC9F01]">{formatCurrency(dataPoint.total_sales)}</span>
              </div>
              <div className="flex items-center justify-between gap-8">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-[#E63946] mr-2"></div>
                  Orders
                </span>
                <span className="text-base font-bold text-[#E63946]">{dataPoint.orders_count}</span>
              </div>
            </div>
          </div>
        </ChartTooltipContent>
      )
    }
    return null
  }

  // Custom dot component with hover effect
  const CustomDot = ({ cx, cy, dataKey, payload, index }: any) => {
    const isRevenue = dataKey === "total_sales"
    const color = isRevenue ? "#EC9F01" : "#E63946"
    const isActive = activePoint === index

    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={isActive ? 8 : 4}
          fill={color}
          stroke="white"
          strokeWidth={2}
          style={{ transition: "all 0.3s ease" }}
          onMouseEnter={() => setActivePoint(index)}
          onMouseLeave={() => setActivePoint(null)}
        />
        {isActive && (
          <circle
            cx={cx}
            cy={cy}
            r={12}
            fill="transparent"
            stroke={color}
            strokeWidth={1.5}
            strokeDasharray="3 3"
            style={{ transition: "all 0.3s ease" }}
          />
        )}
        {isActive && (
          <foreignObject
            x={cx - 50}
            y={isRevenue ? cy - 45 : cy + 15}
            width={100}
            height={30}
            style={{ overflow: "visible" }}
          >
            <div
              className={`text-xs font-semibold text-center py-1 px-2 rounded-md shadow-md ${isRevenue ? "bg-[#EC9F01]" : "bg-[#E63946]"} text-white`}
            >
              {isRevenue ? formatCurrency(payload.total_sales) : payload.orders_count}
            </div>
          </foreignObject>
        )}
      </g>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Revenue Overview</h2>
          <div className="flex items-center mt-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalRevenue)}</span>
            <div
              className={`ml-3 flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                revenueTrend === "up"
                  ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30"
                  : "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/30"
              }`}
            >
              {revenueTrend === "up" ? (
                <ArrowUpIcon className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownIcon className="h-3 w-3 mr-1" />
              )}
              {Math.abs(revenueChange).toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)} className="w-full sm:w-auto">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="7days">7D</TabsTrigger>
              <TabsTrigger value="30days">30D</TabsTrigger>
              <TabsTrigger value="90days">90D</TabsTrigger>
              <TabsTrigger value="12months">1Y</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button variant="outline" size="icon" className="h-9 w-9">
            <DownloadIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-[300px]">
   
        <ChartContainer config={chartConfig} className="h-full w-full">
          
          
          {isMounted  ? (
            <ComposedChart
              data={chartData}
              margin={{ left: 10, right: 30, top: 20, bottom: 10 }}
              onMouseLeave={() => setActivePoint(null)}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EC9F01" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EC9F01" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={true} horizontal={true} stroke="#E5E7EB" strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={true}
                axisLine={true}
                dy={10}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                label={{
                  value: "Month",
                  position: "insideBottom",
                  offset: -5,
                  fill: "#6B7280",
                  fontSize: 12,
                }}
                padding={{ left: 20, right: 20 }}
              />
              <YAxis
                yAxisId="left"
                tickLine={true}
                axisLine={true}
                tickCount={8}
                tickFormatter={(value) => `₦${formatToKOrM(value * usdToNairaRate)}`}
                domain={[0, maxValue * 1.1]}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                label={{
                  value: "Revenue (₦)",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#EC9F01",
                  fontSize: 12,
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={true}
                axisLine={true}
                tickCount={8}
                tickFormatter={(value) => formatToKOrM(value)}
                domain={[0, maxOrders * 1.1]}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                label={{
                  value: "Orders",
                  angle: 90,
                  position: "insideRight",
                  fill: "#E63946",
                  fontSize: 12,
                }}
              />
              <Tooltip
                cursor={{ stroke: "#E5E7EB", strokeWidth: 1, strokeDasharray: "5 5" }}
                content={<ModernTooltipContent />}
                wrapperStyle={{ outline: "none" }}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="total_sales"
                stroke="#EC9F01"
                strokeWidth={3}
                fill="url(#colorRevenue)"
                fillOpacity={1}
                dot={(props) => <CustomDot {...props} dataKey="total_sales" />}
                activeDot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="orders_count"
                stroke="#E63946"
                strokeWidth={3}
                dot={(props) => <CustomDot {...props} dataKey="orders_count" />}
                activeDot={false}
              />
            </ComposedChart>
              ):<></>}
        
        </ChartContainer>
       
      </div>

      <div className="mt-6 flex flex-wrap gap-6 justify-center sm:justify-start">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#EC9F01] to-[#F7B733]" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Revenue (₦)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#E63946] to-[#FF5A67]" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Orders</span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <InfoIcon className="h-4 w-4 text-gray-400" />
          <span className="text-xs text-gray-500 dark:text-gray-400">Hover over points for details</span>
        </div>
      </div>
    </div>
  )
}

