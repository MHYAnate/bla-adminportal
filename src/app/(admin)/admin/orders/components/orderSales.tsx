// "use client"

// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
// import { Calendar } from "lucide-react"
// import { Button } from "@/components/ui/button"

// const salesData = [
//   { month: "Jan", Individual: 55000, "Business Owner": 48000 },
//   { month: "Feb", Individual: 57000, "Business Owner": 46000 },
//   { month: "Mar", Individual: 43000, "Business Owner": 52000 },
//   { month: "Apr", Individual: 35000, "Business Owner": 42000 },
//   { month: "May", Individual: 42000, "Business Owner": 45000 },
//   { month: "Jun", Individual: 26000, "Business Owner": 39000 },
//   { month: "Jul", Individual: 55000, "Business Owner": 48000 },
//   { month: "Aug", Individual: 44000, "Business Owner": 41000 },
//   { month: "Sep", Individual: 44000, "Business Owner": 42000 },
//   { month: "Oct", Individual: 35000, "Business Owner": 43000 },
// ]

// const CustomLegend = () => (
//   <div className="flex items-center justify-start gap-6 mt-6 ml-12">
//     <div className="flex items-center gap-2">
//       <div className="w-3 h-3 rounded-full bg-emerald-700"></div>
//       <span className="text-gray-600 text-sm">Individual</span>
//     </div>
//     <div className="flex items-center gap-2">
//       <div className="w-3 h-3 rounded-full bg-amber-400"></div>
//       <span className="text-gray-600 text-sm">Business Owner</span>
//     </div>
//   </div>
// )

// export default function Component() {
//   return (
//     <div className="w-full max-w-6xl mx-auto p-8 bg-gray-50 min-h-screen">
//       <div className="bg-white rounded-lg p-8 shadow-sm">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <h1 className="text-3xl font-light text-gray-800">Sales</h1>
//           <Button variant="outline" className="flex items-center gap-2 text-gray-600 bg-transparent">
//             Last Week
//             <Calendar className="w-4 h-4" />
//           </Button>
//         </div>

//         {/* Chart */}
//         <div className="h-96">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart
//               data={salesData}
//               margin={{
//                 top: 20,
//                 right: 30,
//                 left: 60,
//                 bottom: 20,
//               }}
//               barCategoryGap="20%"
//             >
//               <CartesianGrid strokeDasharray="none" stroke="#e5e7eb" horizontal={true} vertical={false} />
//               <XAxis
//                 dataKey="month"
//                 axisLine={false}
//                 tickLine={false}
//                 tick={{ fill: "#9ca3af", fontSize: 14 }}
//                 dy={10}
//               />
//               <YAxis
//                 axisLine={false}
//                 tickLine={false}
//                 tick={{ fill: "#9ca3af", fontSize: 14 }}
//                 tickFormatter={(value) => `${(value / 1000).toFixed(0)},000`}
//                 domain={[10000, 60000]}
//                 ticks={[10000, 20000, 30000, 40000, 50000, 60000]}
//               />
//               <Bar dataKey="Individual" fill="#065f46" radius={[0, 0, 0, 0]} maxBarSize={40} />
//               <Bar dataKey="Business Owner" fill="#fbbf24" radius={[0, 0, 0, 0]} maxBarSize={40} />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Custom Legend */}
//         <CustomLegend />
//       </div>
//     </div>
//   )
// }


// "use client"

// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   ResponsiveContainer,
// } from "recharts"
// import { Calendar } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { useGetSalesData } from "@/services/orders"

// const CustomLegend = () => (
//   <div className="flex items-center justify-start gap-6 mt-6 ml-12">
//     <div className="flex items-center gap-2">
//       <div className="w-3 h-3 rounded-full bg-emerald-700"></div>
//       <span className="text-gray-600 text-sm">Individual</span>
//     </div>
//     <div className="flex items-center gap-2">
//       <div className="w-3 h-3 rounded-full bg-amber-400"></div>
//       <span className="text-gray-600 text-sm">Business Owner</span>
//     </div>
//   </div>
// )

// export default function SalesChart() {
//   const { salesData, isSalesLoading, salesError, salesYear } = useGetSalesData()

//   const transformedData =
//     salesData?.data?.map((item: { month: any; individual: any; businessOwner: any }) => ({
//       month: item.month,
//       Individual: item.individual,
//       "Business Owner": item.businessOwner,
//     })) ?? []

//   return (
//     <div className="w-full max-w-6xl mx-auto p-8 bg-gray-50 min-h-screen">
//       <div className="bg-white rounded-lg p-8 shadow-sm">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <h1 className="text-3xl font-light text-gray-800">Sales</h1>
//           <Button
//             variant="outline"
//             className="flex items-center gap-2 text-gray-600 bg-transparent"
//           >
//             {salesYear || "This Year"}
//             <Calendar className="w-4 h-4" />
//           </Button>
//         </div>

//         {/* Chart */}
//         <div className="h-96">
//           {isSalesLoading ? (
//             <div className="flex justify-center items-center h-full text-gray-500">
//               Loading...
//             </div>
//           ) : salesError ? (
//             <div className="text-red-500 text-center">
//               Failed to load sales data.
//             </div>
//           ) : (
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart
//                 data={transformedData}
//                 margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
//                 barCategoryGap="20%"
//               >
//                 <CartesianGrid
//                   strokeDasharray="none"
//                   stroke="#e5e7eb"
//                   horizontal={true}
//                   vertical={false}
//                 />
//                 <XAxis
//                   dataKey="month"
//                   axisLine={false}
//                   tickLine={false}
//                   tick={{ fill: "#9ca3af", fontSize: 14 }}
//                   dy={10}
//                 />
//                 <YAxis
//                   axisLine={false}
//                   tickLine={false}
//                   tick={{ fill: "#9ca3af", fontSize: 14 }}
//                   tickFormatter={(value) =>
//                     `${(value / 1000).toFixed(0)},000`
//                   }
//                   domain={[0, "auto"]}
//                 />
//                 <Bar
//                   dataKey="Individual"
//                   fill="#065f46"
//                   radius={[0, 0, 0, 0]}
//                   maxBarSize={40}
//                 />
//                 <Bar
//                   dataKey="Business Owner"
//                   fill="#fbbf24"
//                   radius={[0, 0, 0, 0]}
//                   maxBarSize={40}
//                 />
//               </BarChart>
//             </ResponsiveContainer>
//           )}
//         </div>

//         {/* Custom Legend */}
//         <CustomLegend />
//       </div>
//     </div>
//   )
// }

"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Line,
} from "recharts"
import html2canvas from "html2canvas"
import { useState, useEffect, useRef } from "react"
import { Calendar, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGetSalesData } from "@/services/orders"

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
  const [compareMode, setCompareMode] = useState(false)

  const {
    salesData,
    isSalesLoading,
    salesError,
    salesYear,
  } = useGetSalesData()

  const {
    salesData: compareData,
    salesYear: setCompareFilter,
  } = useGetSalesData({ enabled: compareMode })

  // Fetch main data
  useEffect(() => {
    if (salesYear) {
      salesYear({ timeframe })
    }
  }, [timeframe])

  // Fetch comparison data for 3m if compare mode is on
  useEffect(() => {
    if (compareMode && setCompareFilter) {
      setCompareFilter({ timeframe: "3m" })
    }
  }, [compareMode])

  const transform = (data: any[] = []) =>
    data.map((item: any) => ({
      month: item.month,
      Individual: item.individual,
      "Business Owner": item.businessOwner,
      Total: item.individual + item.businessOwner,
    }))

  const mainData = transform(salesData?.data)
  const comparison = compareMode ? transform(compareData?.data) : []

  const avgLine = () => {
    if (!mainData.length) return null
    const totalAvg =
      mainData.reduce((sum, d) => sum + d.Total, 0) / mainData.length
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
  }

  const exportChart = async () => {
    if (!chartRef.current) return
    const canvas = await html2canvas(chartRef.current)
    const link = document.createElement("a")
    link.download = `sales-chart-${Date.now()}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  return (
    <div className="w-full min-h-screen">
      <div className="bg-white rounded-lg p-8 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-light text-gray-800">Sales</h1>
          <div className="flex items-center gap-2">
            <Button onClick={exportChart} variant="ghost" size="icon">
              <Download className="w-5 h-5" />
            </Button>
            {/* <Button
              variant={compareMode ? "default" : "outline"}
              onClick={() => setCompareMode((prev) => !prev)}
            >
              {compareMode ? "Hide Comparison" : "Compare w/ 3M"}
            </Button> */}
          </div>
        </div>

        {/* Time Range Buttons */}
       

        {/* Chart */}
        <div className="h-80" ref={chartRef}>
          {isSalesLoading ? (
            <div className="flex justify-center items-center h-full text-gray-500">
              Loading...
            </div>
          ) : salesError ? (
            <div className="text-red-500 text-center">
              Failed to load sales data.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mainData}
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
                  tickFormatter={(value) =>
                    `${(value / 1000).toFixed(0)},000`
                  }
                  domain={[0, "auto"]}
                />
                <Tooltip />
                {/* <Legend /> */}
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
                {/* {compareMode && (
                  <>
                 <Bar dataKey="Individual" fill="#8884d8" radius={[4, 4, 0, 0]} />
                 <Bar dataKey="Business Owner" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                  </>
                )} */}
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
