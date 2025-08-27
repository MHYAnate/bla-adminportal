"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useFeedback, useGetSupportWorkloadStats } from "@/services/feedback"
import { FeedbackBarComponent } from "./supportDistribution"

interface WorkloadData {
  resolvedWithin24h: number
  resolvedWithin2_3Days: number
  resolvedWithinWeek: number
  unresolved: number
}

const workloadData: Record<string, WorkloadData> = {
  today: {
    resolvedWithin24h: 60,
    resolvedWithin2_3Days: 30,
    resolvedWithinWeek: 15,
    unresolved: 5,
  },
  week: {
    resolvedWithin24h: 58,
    resolvedWithin2_3Days: 32,
    resolvedWithinWeek: 15,
    unresolved: 5,
  },
  month: {
    resolvedWithin24h: 100,
    resolvedWithin2_3Days: 35,
    resolvedWithinWeek: 15,
    unresolved: 5,
  },
}

export function BarComponent() {
  const [selectedPeriod, setSelectedPeriod] = useState("today")
  const currentWorkload = workloadData[selectedPeriod]
  const { data: feedbackData } = useFeedback("")
 

  const { data, isLoading } = useGetSupportWorkloadStats();

  console.log(data, "stat")

  console.log(feedbackData, "ffbb")

  // Handle loading state
  if (!feedbackData || !feedbackData.data.summary?.byStatus) {
    return (
      <div className="flex gap-6 p-6 bg-gray-50 h-fit">
        <div className="flex-[2] bg-white shadow-sm border border-gray-200 rounded-lg p-4">
          <p>Loading support data...</p>
        </div>
        <div className="flex-[3] bg-white shadow-sm border border-gray-200 rounded-lg p-4">
          <p>Loading workload data...</p>
        </div>
      </div>
    )
  }

  // Get status counts with safe defaults
  const statusCounts = feedbackData.data.summary.byStatus
  const feedbackItems = [
    { label: "New", value: statusCounts.NEW || 0, color: "bg-blue-400" },
    { 
      label: "In Progress", 
      value: statusCounts.IN_PROGRESS || 0, 
      color: "bg-green-400" 
    },
    { 
      label: "Reviewed", 
      value: statusCounts.REVIEWED || 0, 
      color: "bg-pink-400" 
    },
    { 
      label: "Resolved", 
      value: statusCounts.RESOLVED || 0, 
      color: "bg-orange-400" 
    },
    { 
      label: "Closed", 
      value: statusCounts.CLOSED || 0, 
      color: "bg-purple-400" 
    },
  ]

  const workloadItems = [
    {
      label: "Resolved",
      sublabel: "within 24 hours",
      value: data?.resolvedWithin24Hours?.percentage
      ,
    },
    {
      label: "Resolved within",
      sublabel: "2-3 days",
      value: data?.resolvedWithin2to3Days?.percentage
      ,
    },
    {
      label: "Resolved within",
      sublabel: "a week",
      value: data?.resolvedWithinWeek?.percentage,
    },
    {
      label: "Unresolved",
      sublabel: "",
      value: data?.unresolved?.percentage,
    },
  ]

  // Calculate max value for scaling with a minimum of 1
  const maxFeedbackValue = Math.max(
    1,
    ...feedbackItems.map(item => item.value)
  )

  const getBarHeight = (value: number) => 
    Math.max(2, (value / maxFeedbackValue) * 100)

  // Generate Y-axis labels dynamically
  const yAxisLabels = [];
  const step = Math.ceil(maxFeedbackValue / 5) || 1;
  for (let i = 0; i <= maxFeedbackValue; i += step) {
    yAxisLabels.push(i);
  }

  


  return (
    <div className="flex gap-6 p-6 bg-gray-50 h-fit">
      {/* Left Component - Support Status Distribution */}
      <Card className="flex-[2] bg-white shadow-sm border border-gray-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium text-gray-700">
              Support Status Distribution
            </CardTitle>
            {/* <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-24 h-8 text-sm border-gray-300">
                <SelectValue />
                <ChevronDown className="h-3 w-3 opacity-50" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select> */}
          </div>
        </CardHeader>
     <FeedbackBarComponent summary={feedbackData?.data.summary} />
      </Card>

      {/* Right Component - Support Team Workload Overview */}
      <Card className="flex-[3] bg-white shadow-sm border border-gray-200">
        <CardHeader className="pb-6">
          <CardTitle className="text-lg font-medium text-gray-700">
            Support Team Workload Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-5">
            {workloadItems.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                {/* Label */}
                <div className="w-32 flex-shrink-0 text-sm text-gray-500">
                  <div>{item.label}</div>
                  {item.sublabel && <div>{item.sublabel}</div>}
                </div>

                {/* Progress Bar Container */}
                <div className="flex-1 relative">
                  <div className="w-full h-4 bg-gray-100 rounded-sm overflow-hidden relative">
                    <div
                      className="h-full bg-green-500 transition-all duration-500 ease-out relative rounded-sm"
                      style={{ width: `${Math.min(item.value, 100)}%` }}
                    />
                  </div>
                  {/* Value Pointer */}
                  <span
                    className="absolute top-1/2 -translate-y-1/2 text-xs text-gray-600 font-medium ml-2"
                    style={{ left: `${Math.min(item.value, 100)}%` }}
                  >
                    {item.value}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Scale indicators */}
          <div className="flex justify-between text-xs text-gray-400 mt-6 pt-2 ml-36">
            {[0, 20, 40, 60, 80, 100].map((value) => (
              <span key={value}>{value}</span>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}