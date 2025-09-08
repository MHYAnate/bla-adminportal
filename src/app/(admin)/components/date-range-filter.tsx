// src/app/(admin)/components/date-range-filter.tsx
"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface DateRangeFilterProps {
  dateRange: string;
  dateFrom: string;
  dateTo: string;
  onDateRangeChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
}

export function DateRangeFilter({
  dateRange,
  dateFrom,
  dateTo,
  onDateRangeChange,
  onDateFromChange,
  onDateToChange
}: DateRangeFilterProps) {
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  const dateRangeOptions = [
    { text: "All Time", value: "all" },
    { text: "Today", value: "today" },
    { text: "Yesterday", value: "yesterday" },
    { text: "This Week", value: "thisWeek" },
    { text: "This Month", value: "thisMonth" },
    { text: "Last Week", value: "lastWeek" },
    { text: "Last Month", value: "lastMonth" },
    { text: "Last 7 Days", value: "last7days" },
    { text: "Last 30 Days", value: "last30days" },
    { text: "Last 90 Days", value: "last90days" },
    { text: "Custom Range", value: "custom" }
  ];

  return (
    <div className="flex items-center gap-2">
      <Select value={dateRange} onValueChange={onDateRangeChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Date Range" />
        </SelectTrigger>
        <SelectContent>
          {dateRangeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {dateRange === "custom" && (
        <>
          <Popover open={fromOpen} onOpenChange={setFromOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[130px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom ? format(new Date(dateFrom), "MMM dd, yyyy") : "From Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateFrom ? new Date(dateFrom) : undefined}
                onSelect={(date) => {
                  onDateFromChange(date ? format(date, "yyyy-MM-dd") : "");
                  setFromOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <span className="mx-1">-</span>

          <Popover open={toOpen} onOpenChange={setToOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[130px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateTo ? format(new Date(dateTo), "MMM dd, yyyy") : "To Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateTo ? new Date(dateTo) : undefined}
                onSelect={(date) => {
                  onDateToChange(date ? format(date, "yyyy-MM-dd") : "");
                  setToOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </>
      )}
    </div>
  );
}