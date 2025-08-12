"use client";

import Header from "@/app/(admin)/components/header";
import DataTable from "./data-table";
import { Card, CardContent } from "@/components/ui/card";
import { useSupportRequests } from "@/services/support";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const Support: React.FC = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    category: '',
    priority: '',
    search: ''
  });

  const {
    data: supportData,
    isLoading,
    error,
    refetch
  } = useSupportRequests(filters);

  if (error) {
    return (
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-600">Error loading support requests: {error.message}</p>
            <button
              onClick={() => refetch()}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-8">
            <Header
              title="Customer Support Center"
              subtext="Manage customer support requests efficiently. Track, assign, and resolve customer issues."
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading support requests...</span>
            </div>
          ) : (
            <DataTable
              data={supportData?.data || []}
              pagination={supportData?.pagination}
              summary={supportData?.summary}
              filters={filters}
              onFiltersChange={setFilters}
              onRefresh={refetch}
            />
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default Support;
