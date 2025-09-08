// src/app/(admin)/admin/support/components/support-filters.tsx
"use client";

import { Input } from "@/components/ui/input";
import { SelectFilter } from "@/app/(admin)/components/select-filter";
import { DateRangeFilter } from "@/app/(admin)/components/date-range-filter";

// interface SupportFiltersProps {
//   filters: any;
//   onSearch: (search: string) => void;
//   onFilterChange: (key: string, value: string) => void;
// }


interface SupportFiltersProps {
  filters: any;
  onSearch: (search: string) => void;
  onFilterChange: (key: string, value: string) => void;
  onDateRangeChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
}

const SupportFilters: React.FC<SupportFiltersProps> = ({
  filters,
  onSearch,
  onFilterChange,
  onDateRangeChange,
  onDateFromChange,
  onDateToChange,
}) => {
  const statusOptions = [
    { text: "All Statuses", value: "all_statuses" },
    { text: "New", value: "NEW" },
    { text: "In Progress", value: "IN_PROGRESS" },
    { text: "Resolved", value: "RESOLVED" },
  ];

  const categoryOptions = [
    { text: "All Categories", value: "all_categories" },
    { text: "Product", value: "PRODUCT" },
    { text: "Order", value: "ORDER" },
    { text: "Delivery", value: "DELIVERY" },
    { text: "General", value: "GENERAL" },
    { text: "Other", value: "OTHER" },
  ];

  const priorityOptions = [
    { text: "All Priorities", value: "all_priorities" },
    { text: "Low", value: "LOW" },
    { text: "Medium", value: "MEDIUM" },
    { text: "High", value: "HIGH" },
    { text: "Urgent", value: "URGENT" },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center gap-4 mb-6 justify-between">
        <h6 className="font-semibold text-lg text-[#111827]">
          Support Requests
        </h6>

        <div className="flex items-center gap-4">
          <Input
            placeholder="Search requests..."
            value={filters.search || ""}
            onChange={(e) => onSearch(e.target.value)}
            className="w-64"
          />

          <SelectFilter
            setFilter={(value: string) => onFilterChange("status", value)}
            placeholder="Filter by Status"
            list={statusOptions}
          />

          <SelectFilter
            setFilter={(value: string) => onFilterChange("category", value)}
            placeholder="Filter by Category"
            list={categoryOptions}
          />

<DateRangeFilter
            dateRange={filters.dateRange}
            dateFrom={filters.dateFrom}
            dateTo={filters.dateTo}
            onDateRangeChange={onDateRangeChange}
            onDateFromChange={onDateFromChange}
            onDateToChange={onDateToChange}
          />

          {/* <SelectFilter
            setFilter={(value: string) => onFilterChange("priority", value)}
            placeholder="Filter by Priority"
            list={priorityOptions}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default SupportFilters;