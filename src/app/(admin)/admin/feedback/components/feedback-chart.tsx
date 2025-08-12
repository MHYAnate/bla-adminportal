// src/app/(admin)/admin/feedback/components/feedback-chart.tsx
"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { SelectFilter } from "@/app/(admin)/components/select-filter";
import { useState } from "react";

// Define the interface for the summary prop
interface FeedbackSummary {
  total: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  averageRating?: number;
}

interface FeedbackBarComponentProps {
  summary?: FeedbackSummary;
}

const chartConfig = {
  new: {
    label: "New",
    color: "#38bdf8",
  },
  reviewed: {
    label: "Reviewed",
    color: "#F59E0B",
  },
  in_progress: {
    label: "In Progress",
    color: "#FB923C",
  },
  resolved: {
    label: "Resolved",
    color: "#10B981",
  },
  closed: {
    label: "Closed",
    color: "#6B7280",
  },
} satisfies ChartConfig;

export function FeedbackBarComponent({ summary }: FeedbackBarComponentProps) {
  const [filter, setFilter] = useState<string>("all_time");

  const filterList = [
    {
      text: "All Time",
      value: "all_time", // Fixed: Changed from empty string
    },
    {
      text: "Last 30 Days",
      value: "30d",
    },
    {
      text: "Last 7 Days",
      value: "7d",
    },
  ];

  // Generate chart data from summary or use defaults
  const chartData = summary ? [
    {
      category: "New",
      count: summary.byStatus?.NEW || 0,
      fill: chartConfig.new.color
    },
    {
      category: "Reviewed",
      count: summary.byStatus?.REVIEWED || 0,
      fill: chartConfig.reviewed.color
    },
    {
      category: "In Progress",
      count: summary.byStatus?.IN_PROGRESS || 0,
      fill: chartConfig.in_progress.color
    },
    {
      category: "Resolved",
      count: summary.byStatus?.RESOLVED || 0,
      fill: chartConfig.resolved.color
    },
    {
      category: "Closed",
      count: summary.byStatus?.CLOSED || 0,
      fill: chartConfig.closed.color
    },
  ] : [
    { category: "New", count: 0, fill: chartConfig.new.color },
    { category: "Reviewed", count: 0, fill: chartConfig.reviewed.color },
    { category: "In Progress", count: 0, fill: chartConfig.in_progress.color },
    { category: "Resolved", count: 0, fill: chartConfig.resolved.color },
    { category: "Closed", count: 0, fill: chartConfig.closed.color },
  ];

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h5 className="font-bold text-[#383E49] text-2xl mb-1">
            Feedback Status Distribution
          </h5>
          <p className="text-sm text-gray-500">
            Total: {summary?.total || 0} feedback submissions
          </p>
        </div>
        <SelectFilter
          setFilter={setFilter}
          placeholder="Select Period"
          list={filterList}
        />
      </div>

      <CardContent className="p-0 mt-6">
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="category" />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" fill="#38bdf8" />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex gap-6 ps-[24px] mt-8">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-xs text-[#667085] font-dmsans">
            <div
              className="h-[15px] w-[15px] rounded-full"
              style={{ backgroundColor: item.fill }}
            />
            <span>{item.category}: {item.count}</span>
          </div>
        ))}
      </CardFooter>

      {/* Additional stats if available */}
      {summary && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{summary.total}</p>
              <p className="text-sm text-gray-500">Total Feedback</p>
            </div>

            {Object.entries(summary.byType || {}).map(([type, count]) => (
              <div key={type} className="text-center">
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-sm text-gray-500">{type}</p>
              </div>
            ))}

            {summary.averageRating && (
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{summary.averageRating}</p>
                <p className="text-sm text-gray-500">Avg Rating</p>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}