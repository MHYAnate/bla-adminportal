// "use client"

// import type React from "react"

// import { Card, CardContent } from "@/components/ui/card"
// import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"
// import SinglePieComponent from "./single"

// interface DashboardMetricCardProps {
//   title: string
//   value: number
//   changePercentage: number
//   trend: "up" | "down"
//   isCurrency?: boolean
//   color?: string
// }

// const DashboardMetricCard: React.FC<DashboardMetricCardProps> = ({
//   title,
//   value,
//   changePercentage,
//   trend,
//   isCurrency = false,
//   color = "#EC9F01",
// }) => {
//   const formattedValue = isCurrency
//     ? `₦${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
//     : value.toLocaleString()

//     return (
//       <Card>
//         <CardContent className="p-3">
//           <div className="flex justify-between items-center mb-2">
//             <div className="text-[#202224]">
//               <p className="text-sm font-medium">{title}</p>
//             </div>
//           </div>
  
//           <div className="flex items-center justify-between">
//             <h5 className="font-bold text-xl text-[#202224]">{formattedValue}</h5>
//             <div className="flex-shrink-0 w-[60px] h-[60px]">
//               <SinglePieComponent percentage={Math.abs(changePercentage)} color={color} trend={trend} />
//             </div>
//           </div>
  
//           <div className="flex items-center mt-2 text-sm">
//             {trend === "up" ? (
//               <div className="w-5 h-5 rounded-full bg-[#00B69B]/10 flex items-center justify-center mr-2">
//                 <ArrowUpIcon className="h-3 w-3 text-[#00B69B]" />
//               </div>
//             ) : (
//               <div className="w-5 h-5 rounded-full bg-[#F93C65]/10 flex items-center justify-center mr-2">
//                 <ArrowDownIcon className="h-3 w-3 text-[#F93C65]" />
//               </div>
//             )}
//             <p className="text-[#606060]">
//               <span className={trend === "up" ? "text-[#00B69B] font-medium" : "text-[#F93C65] font-medium"}>
//                 {Math.abs(changePercentage).toFixed(1)}%
//               </span>{" "}
//               vs previous month
//             </p>
//           </div>
//         </CardContent>
//       </Card>
//     )
//   }
  
// export default DashboardMetricCard

// "use client"

// import type React from "react"
// import { Card, CardContent } from "@/components/ui/card"
// import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"
// import SinglePieComponent from "./single"

// interface DashboardMetricCardProps {
//   title: string
//   value: number
//   changePercentage: number
//   trend: "up" | "down"
//   isCurrency?: boolean
//   color?: string
// }

// const DashboardMetricCard: React.FC<DashboardMetricCardProps> = ({
//   title,
//   value,
//   changePercentage,
//   trend,
//   isCurrency = false,
//   color = "#EC9F01",
// }) => {
//   const formattedValue = isCurrency
//     ? `₦${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
//     : value.toLocaleString()

//   return (
//     <Card className="h-full">
//       <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
//         {/* Title */}
//         <div className="mb-2">
//           <p className="text-sm sm:text-base font-medium text-[#202224]">{title}</p>
//         </div>

//         {/* Value + Pie chart */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//           <h5 className="text-2xl sm:text-xl font-bold text-[#202224]">
//             {formattedValue}
//           </h5>
//           <div className="flex-shrink-0 w-14 h-14 sm:w-[60px] sm:h-[60px]">
//             <SinglePieComponent
//               percentage={Math.abs(changePercentage)}
//               color={color}
//               trend={trend}
//             />
//           </div>
//         </div>

//         {/* Trend comparison */}
//         <div className="flex items-center mt-3 text-sm">
//           <div
//             className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
//               trend === "up" ? "bg-[#00B69B]/10" : "bg-[#F93C65]/10"
//             }`}
//           >
//             {trend === "up" ? (
//               <ArrowUpIcon className="h-3 w-3 text-[#00B69B]" />
//             ) : (
//               <ArrowDownIcon className="h-3 w-3 text-[#F93C65]" />
//             )}
//           </div>
//           <p className="text-[#606060] text-sm sm:text-[13px]">
//             <span
//               className={`font-medium ${
//                 trend === "up" ? "text-[#00B69B]" : "text-[#F93C65]"
//               }`}
//             >
//               {Math.abs(changePercentage).toFixed(1)}%
//             </span>{" "}
//             vs previous month
//           </p>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// export default DashboardMetricCard

"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"
import SinglePieComponent from "./single"

interface DashboardMetricCardProps {
  title: string
  value: number
  changePercentage: number
  trend: "up" | "down"
  isCurrency?: boolean
  color?: string
}

const DashboardMetricCard: React.FC<DashboardMetricCardProps> = ({
  title,
  value,
  changePercentage,
  trend,
  isCurrency = false,
  color = "#EC9F01",
}) => {
  const formattedValue = isCurrency
    ? `₦${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
    : value.toLocaleString()

  return (
    <Card className="h-full min-w-[200px] max-w-sm w-full">
      <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
        {/* Title */}
        <div className="mb-2">
          <p className="text-sm sm:text-base font-medium text-[#202224]">{title}</p>
        </div>

        {/* Value + Pie chart */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h5 className="text-2xl sm:text-xl font-bold text-[#202224]">
            {formattedValue}
          </h5>
          <div className="flex-shrink-0 w-14 h-14 sm:w-[60px] sm:h-[60px]">
            <SinglePieComponent
              percentage={Math.abs(changePercentage)}
              color={color}
              trend={trend}
            />
          </div>
        </div>

        {/* Trend comparison */}
        <div className="flex items-center mt-3 text-sm">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
              trend === "up" ? "bg-[#00B69B]/10" : "bg-[#F93C65]/10"
            }`}
          >
            {trend === "up" ? (
              <ArrowUpIcon className="h-3 w-3 text-[#00B69B]" />
            ) : (
              <ArrowDownIcon className="h-3 w-3 text-[#F93C65]" />
            )}
          </div>
          <p className="text-[#606060] text-sm sm:text-[13px]">
            <span
              className={`font-medium ${
                trend === "up" ? "text-[#00B69B]" : "text-[#F93C65]"
              }`}
            >
              {Math.abs(changePercentage).toFixed(1)}%
            </span>{" "}
            vs previous month
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default DashboardMetricCard
