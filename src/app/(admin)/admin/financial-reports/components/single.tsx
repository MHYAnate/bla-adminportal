"use client"

import type React from "react"

import { PieChart, Pie, Cell } from "recharts"

interface SinglePieComponentProps {
  percentage: number
  color: string
  trend: "up" | "down"
}

const SinglePieComponent: React.FC<SinglePieComponentProps> = ({ percentage, color, trend }) => {
  // Ensure percentage is between 0 and 100
  const safePercentage = Math.min(Math.max(percentage, 0), 100)

  // Data for the pie chart
  const data = [
    { name: "Value", value: safePercentage },
    { name: "Remaining", value: 100 - safePercentage },
  ]

  // Colors based on trend
  const activeColor = trend === "up" ? color : "#F93C65"
  const inactiveColor = "#F5F5F5"

  return (
    <PieChart width={60} height={60}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={18}
        outerRadius={25}
        paddingAngle={0}
        dataKey="value"
        startAngle={90}
        endAngle={-270}
        stroke="none"
      >
        <Cell key="cell-0" fill={activeColor} />
        <Cell key="cell-1" fill={inactiveColor} />
      </Pie>
    </PieChart>
  )
}

export default SinglePieComponent
