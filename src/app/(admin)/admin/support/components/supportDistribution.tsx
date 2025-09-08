"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useState } from "react";
import { useGetSupportWorkloadStats } from "@/services/feedback";

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
  new: { label: "New", color: "#38bdf8" },
  reviewed: { label: "Reviewed", color: "#F59E0B" },
  in_progress: { label: "In Progress", color: "#FB923C" },
  resolved: { label: "Resolved", color: "#10B981" },
  closed: { label: "Closed", color: "#6B7280" },
} satisfies ChartConfig;

export function FeedbackBarComponent({ summary }: FeedbackBarComponentProps) {
  const [filter, setFilter] = useState<string>("all_time");


  const { data: workloadStats, isLoading: statsLoading } = useGetSupportWorkloadStats();

  const distribution = workloadStats?.statusBreakdown;

  const filterList = [
    { text: "All Time", value: "all_time" },
    { text: "Last 30 Days", value: "30d" },
    { text: "Last 7 Days", value: "7d" },
  ];

  const chartData = summary
    ? [
        { category: "New", count: distribution?.NEW || 0 || 0, fill: chartConfig.new.color },
        // { category: "Reviewed", count: summary.byStatus?.REVIEWED || 0, fill: chartConfig.reviewed.color },
        { category: "In Progress", count: distribution?.IN_PROGRESS || 0, fill: chartConfig.in_progress.color },
        { category: "Resolved", count: distribution?.RESOLVED || 0, fill: chartConfig.resolved.color },
        { category: "Closed", count: distribution?.CLOSED || 0, fill: chartConfig.closed.color },
      ]
    : [
        { category: "New", count: 0, fill: chartConfig.new.color },
        // { category: "Reviewed", count: 0, fill: chartConfig.reviewed.color },
        { category: "In Progress", count: 0, fill: chartConfig.in_progress.color },
        { category: "Resolved", count: 0, fill: chartConfig.resolved.color },
        { category: "Closed", count: 0, fill: chartConfig.closed.color },
      ];

  return (
    <Card className="p-1.5 w-auto mx-auto">
  

      <CardContent className="p-0 mt-1.5">
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
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
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex gap-1.5 ps-[6px] mt-2">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center gap-1 text-[8px] text-[#667085] font-dmsans">
            <div
              className="h-[4px] w-[4px] rounded-full"
              style={{ backgroundColor: item.fill }}
            />
            <span>{item.category}: {item.count}</span>
          </div>
        ))}
      </CardFooter>

    
    </Card>
  );
}