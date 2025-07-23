// "use client"

// import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

// const orderData = [
//   { month: "Jan", Ordered: 4000, Delivered: 3500 },
//   { month: "Feb", Ordered: 1900, Delivered: 2400 },
//   { month: "Mar", Ordered: 3000, Delivered: 4000 },
//   { month: "Apr", Ordered: 2500, Delivered: 3800 },
//   { month: "May", Ordered: 2400, Delivered: 3600 },
// ]

// const CustomLegend = () => (
//   <div className="flex items-center justify-start gap-6 mt-6 ml-12">
//     <div className="flex items-center gap-2">
//       <div className="w-3 h-3 rounded-full bg-amber-500"></div>
//       <span className="text-gray-500 text-sm">Ordered</span>
//     </div>
//     <div className="flex items-center gap-2">
//       <div className="w-3 h-3 rounded-full bg-emerald-700"></div>
//       <span className="text-gray-500 text-sm">Delivered</span>
//     </div>
//   </div>
// )

// export default function OrderSummary() {
//   return (
//     <div className="w-full max-w-6xl mx-auto p-8 bg-gray-50">
//       <div className="bg-white rounded-lg p-8 shadow-sm">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-light text-gray-800">Order Summary</h1>
//         </div>

//         {/* Chart */}
//         <div className="h-80">
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart
//               data={orderData}
//               margin={{
//                 top: 20,
//                 right: 30,
//                 left: 60,
//                 bottom: 20,
//               }}
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
//                 domain={[1000, 4000]}
//                 ticks={[1000, 2000, 3000, 4000]}
//               />
//               <Line
//                 type="monotone"
//                 dataKey="Ordered"
//                 stroke="#f59e0b"
//                 strokeWidth={3}
//                 dot={false}
//                 activeDot={{ r: 4, fill: "#f59e0b" }}
//               />
//               <Line
//                 type="monotone"
//                 dataKey="Delivered"
//                 stroke="#065f46"
//                 strokeWidth={3}
//                 dot={false}
//                 activeDot={{ r: 4, fill: "#065f46" }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Custom Legend */}
//         <CustomLegend />
//       </div>
//     </div>
//   )
// }

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
import { useState } from "react"

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
    {/* <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-sky-600"></div>
      <span className="text-gray-500 text-sm">Delivery Rate (%)</span>
    </div> */}
  </div>
)

const CustomTooltip = ({ active, payload, label }:any) => {
  if (active && payload && payload.length) {
    const ordered = payload.find((p:any) => p.dataKey === "Ordered")?.value
    const delivered = payload.find((p:any) => p.dataKey === "Delivered")?.value
    // const rate = payload.find((p:any) => p.dataKey === "DeliveryRate")?.value

    return (
      <div className="bg-white border shadow-sm p-3 rounded-md text-sm text-gray-800">
        <p className="font-medium mb-1">{label}</p>
        <p>Ordered: {ordered}</p>
        <p>Delivered: {delivered}</p>
        {/* <p>Delivery Rate: {rate?.toFixed(1)}%</p> */}
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
    setOrdersSummaryFilter,
  } = useGetOrdersSummary()

  // Trigger filter on button click
  const handleTimeframeChange = (value: "3m" | "6m" | "12m") => {
    setTimeframe(value)
    setOrdersSummaryFilter({ timeframe: value })
  }

  // Transform backend data
  // const transformedData =
  //   getOrdersSummaryData?.data?.map((item:any) => ({
  //     month: item.month,
  //     Ordered: item.ordered,
  //     Delivered: item.delivered,
  //     DeliveryRate:
  //       item.ordered === 0 ? 0 : (item.delivered / item.ordered) * 100,
  //   })) ?? []

  const transformedData = Array.isArray(getOrdersSummaryData?.data)
  ? getOrdersSummaryData.data.map((item: any) => ({
      month: item.month,
      Ordered: item.ordered,
      Delivered: item.delivered,
      DeliveryRate:
        item.ordered === 0 ? 0 : (item.delivered / item.ordered) * 100,
    }))
  : []

  return (
    <div className="w-full  bg-gray-50">
      <div className="bg-white rounded-lg p-8 shadow-sm">
        {/* Header + Filters */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-light text-gray-800">Order Summary</h1>
          {/* <div className="flex gap-2">
            {["3m", "6m", "12m"].map((range) => (
              <Button
                key={range}
                variant={timeframe === range ? "default" : "outline"}
                className="text-sm"
                onClick={() => handleTimeframeChange(range as any)}
              >
                {range === "3m"
                  ? "Last 3M"
                  : range === "6m"
                  ? "Last 6M"
                  : "Last 12M"}
              </Button>
            ))}
          </div> */}
        </div>

        {/* Chart */}
        <div className="h-80">
          {getOrdersSummaryIsLoading ? (
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

// "use client"

// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   ResponsiveContainer,
// } from "recharts"
// import { useGetOrdersSummary } from "@/services/orders"

// const CustomLegend = () => (
//   <div className="flex items-center justify-start gap-6 mt-6 ml-12">
//     <div className="flex items-center gap-2">
//       <div className="w-3 h-3 rounded-full bg-amber-500"></div>
//       <span className="text-gray-500 text-sm">Ordered</span>
//     </div>
//     <div className="flex items-center gap-2">
//       <div className="w-3 h-3 rounded-full bg-emerald-700"></div>
//       <span className="text-gray-500 text-sm">Delivered</span>
//     </div>
//   </div>
// )

// export default function OrderSummary() {
//   const {
//     getOrdersSummaryData,
//     getOrdersSummaryIsLoading,
//     refetchOrdersSummary,
//     setOrdersSummaryFilter,
//   } = useGetOrdersSummary()

//   console.log(getOrdersSummaryData, "checkSuMaRy")

//     // Transform backend data
//   // const transformedData =
//   //   getOrdersSummaryData?.data?.map((item:any) => ({
//   //     month: item.month,
//   //     Ordered: item.ordered,
//   //     Delivered: item.delivered,
//   //     DeliveryRate:
//   //       item.ordered === 0 ? 0 : (item.delivered / item.ordered) * 100,
//   //   })) ?? []

//   const transformedData = Array.isArray(getOrdersSummaryData?.data)
//   ? getOrdersSummaryData.data.map((item: any) => ({
//       month: item.month,
//       Ordered: item.ordered,
//       Delivered: item.delivered,
//       DeliveryRate:
//         item.ordered === 0 ? 0 : (item.delivered / item.ordered) * 100,
//     }))
//   : []

//   // const transformedData =
//   //   getOrdersSummaryData?.data?.map((item: { month: any; ordered: any; delivered: any }) => ({
//   //     month: item.month,
//   //     Ordered: item.ordered,
//   //     Delivered: item.delivered,
//   //   })) ?? []

//   return (
//     <div className="w-full ">
//       <div className="bg-white rounded-lg p-8 shadow-sm">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-light text-gray-800">Order Summary</h1>
//         </div>

//         {/* Chart */}
//         <div className="h-80">
//           {getOrdersSummaryIsLoading ? (
//             <div className="flex justify-center items-center h-full text-gray-500">
//               Loading...
//             </div>
//           ) : (
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart
//                 data={transformedData}
//                 margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
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
//                   domain={[0, "auto"]}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="Ordered"
//                   stroke="#f59e0b"
//                   strokeWidth={3}
//                   dot={false}
//                   activeDot={{ r: 4, fill: "#f59e0b" }}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="Delivered"
//                   stroke="#065f46"
//                   strokeWidth={3}
//                   dot={false}
//                   activeDot={{ r: 4, fill: "#065f46" }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           )}
//         </div>

//         {/* Custom Legend */}
//         <CustomLegend />
//       </div>
//     </div>
//   )
// }
