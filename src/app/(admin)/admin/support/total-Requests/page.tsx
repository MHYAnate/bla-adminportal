// "use client";

// import React, { Suspense, useState } from "react";
// import LoadingSvg from "@/components/load";
// import DataTable from "../components/data-table";
// import { Loader2 } from "lucide-react";
// import { useSupportRequests } from "@/services/support";
// import Link from "next/link";
// import { ROUTES } from "@/constant/routes";
// import { SelectFilter } from "@/app/(admin)/components/select-filter";
// import { Input } from "@/components/ui/input";

// export default function SupportManagementPage() {
// 	const [filters, setFilters] = useState({
// 		page: 1,
// 		limit: 10,
// 		status: "",
// 		category: "",
// 		priority: "",
// 		search: "",
// 	});

// 	const {
// 		data: supportData,
// 		isLoading,
// 		error,
// 		refetch,
// 	} = useSupportRequests(filters);

// 	const handleSearch = (search: string) => {
// 		setFilters({ ...filters, search, page: 1 });
// 	};
// 	const handleFilterChange = (key: string, value: string) => {
// 		// Convert "all_*" values back to empty strings for API
// 		const apiValue = value.startsWith("all_") ? "" : value;
// 		setFilters({ ...filters, [key]: apiValue, page: 1 });
// 	};

// 	const statusOptions = [
// 		{ text: "All Statuses", value: "all_statuses" }, // Fixed: Changed from empty string
// 		{ text: "New", value: "NEW" },
// 		{ text: "In Progress", value: "IN_PROGRESS" },
// 		{ text: "Resolved", value: "RESOLVED" },
// 	];

// 	const categoryOptions = [
// 		{ text: "All Categories", value: "all_categories" }, // Fixed: Changed from empty string
// 		{ text: "Product", value: "PRODUCT" },
// 		{ text: "Order", value: "ORDER" },
// 		{ text: "Delivery", value: "DELIVERY" },
// 		{ text: "General", value: "GENERAL" },
// 		{ text: "Other", value: "OTHER" },
// 	];

// 	const priorityOptions = [
// 		{ text: "All Priorities", value: "all_priorities" }, // Fixed: Changed from empty string
// 		{ text: "Low", value: "LOW" },
// 		{ text: "Medium", value: "MEDIUM" },
// 		{ text: "High", value: "HIGH" },
// 		{ text: "Urgent", value: "URGENT" },
// 	];

// 	return (
// 		<Suspense fallback={<LoadingSvg />}>
// 			<section className=" flex-row gap-2">
// 				{isLoading ? (
// 					<div className="flex justify-center items-center py-8">
// 						<Loader2 className="h-8 w-8 animate-spin" />
// 						<span className="ml-2">Loading support requests...</span>
// 					</div>
// 				) : (
// 					<div>
// 						<div>
// 							<div className="flex items-center gap-4 mb-6 justify-between">
// 								<h6 className="font-semibold text-lg text-[#111827]">
// 									Support Requests
// 								</h6>

// 								<div className="flex items-center gap-4">
// 									<Input
// 										placeholder="Search requests..."
// 										value={filters.search || ""}
// 										onChange={(e) => handleSearch(e.target.value)}
// 										className="w-64"
// 									/>

// 									<SelectFilter
// 										setFilter={(value: string) =>
// 											handleFilterChange("status", value)
// 										}
// 										placeholder="Filter by Status"
// 										list={statusOptions}
// 									/>

// 									<SelectFilter
// 										setFilter={(value: string) =>
// 											handleFilterChange("category", value)
// 										}
// 										placeholder="Filter by Category"
// 										list={categoryOptions}
// 									/>

// 									<SelectFilter
// 										setFilter={(value: string) =>
// 											handleFilterChange("priority", value)
// 										}
// 										placeholder="Filter by Priority"
// 										list={priorityOptions}
// 									/>
// 								</div>
// 							</div>
// 						</div>
// 						<DataTable
// 							data={supportData?.data || []}
// 							pagination={supportData?.pagination}
// 							summary={supportData?.summary}
// 							filters={filters}
// 							onFiltersChange={setFilters}
// 							onRefresh={refetch}
// 						/>
// 					</div>
// 				)}
// 			</section>
// 		</Suspense>
// 	);
// }

// src/app/(admin)/admin/support/page.tsx
"use client";

import React, { useState, useCallback } from "react";
import LoadingSvg from "@/components/load";
import DataTable from "../components/data-table";
import { Loader2 } from "lucide-react";
import { useSupportRequests } from "@/services/support";
import SupportFilters from "../components/support-filters";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ROUTES } from "@/constant/routes";

export default function SupportManagementPage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "",
    category: "",
    priority: "",
    search: "",
  });

  const {
    data: supportData,
    isLoading,
    error,
    refetch,
  } = useSupportRequests(filters);

  console.log(supportData, "spdata")
  // Memoized filter handlers to prevent unnecessary re-renders
  const handleSearch = useCallback((search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  }, []);

  const handleFilterChange = useCallback((key: string, value: string) => {
    const apiValue = value.startsWith("all_") ? "" : value;
    setFilters(prev => ({ ...prev, [key]: apiValue, page: 1 }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Support Management</h1>
        <Link
          href={ROUTES.ADMIN.SIDEBAR.SUPPORT}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-[#687588] border border-[#E9EAEC] rounded-md hover:bg-gray-50"
        >
          Back to Support Dashboard
        </Link>
      </div>

      <Card className="bg-white rounded-lg shadow-sm">
        <CardContent className="p-6">
          <SupportFilters
            filters={filters}
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
          />

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              <p className="mt-4 text-gray-700">Loading support requests...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">Error loading support requests</p>
              <button 
                onClick={() => refetch()}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <DataTable
              data={supportData?.data?.requests|| []}
              pagination={supportData?.data?.pagination}
              summary={supportData?.data?.summary}
              filters={filters}
              onPageChange={handlePageChange}
              onRefresh={refetch}
              isLoading={isLoading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
