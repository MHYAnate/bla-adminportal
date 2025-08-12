// src/app/(admin)/admin/feedback/components/index.tsx
"use client";

import Header from "@/app/(admin)/components/header";
import { InputFilter } from "@/app/(admin)/components/input-filter";
import { SelectFilter } from "@/app/(admin)/components/select-filter";
import { Card, CardContent } from "@/components/ui/card";
import FeedbackCard from "@/components/widgets/feeedback";
import { useState } from "react";
import ViewFeedback from "./view-feedback";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, Loader2 } from "lucide-react";
import { FeedbackBarComponent } from "./feedback-chart";
import { useFeedback } from "@/services/feedback";
import { formatFeedbackForCard } from "@/services/feedback";

const Feedbacks: React.FC = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12, // For card layout
    feedbackType: '',
    customerType: '',
    status: '',
    search: ''
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);

  // Separate state for each filter to match component expectations
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all_types');
  const [selectedCustomerType, setSelectedCustomerType] = useState<string>('all_customers');
  const [selectedStatus, setSelectedStatus] = useState<string>('all_statuses');

  const {
    data: feedbackData,
    isLoading,
    error,
    refetch
  } = useFeedback(filters);

  // Update filters when individual states change
  const updateFilters = (key: keyof typeof filters, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  // Handle search query change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    updateFilters('search', value);
  };

  // Handle filter changes
  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    updateFilters('feedbackType', value === 'all_types' ? '' : value);
  };

  const handleCustomerTypeChange = (value: string) => {
    setSelectedCustomerType(value);
    updateFilters('customerType', value === 'all_customers' ? '' : value);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    updateFilters('status', value === 'all_statuses' ? '' : value);
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleFeedbackClick = (feedback: any) => {
    setSelectedFeedback(feedback);
    setIsOpen(true);
  };

  const typeOptions = [
    { text: "All Types", value: "all_types" }, // Fixed: Changed from empty string
    { text: "Ratings", value: "RATINGS" },
    { text: "Comments", value: "COMMENTS" },
    { text: "Suggestions", value: "SUGGESTIONS" },
    { text: "Complaints", value: "COMPLAINTS" },
  ];

  const customerTypeOptions = [
    { text: "All Customers", value: "all_customers" }, // Fixed: Changed from empty string
    { text: "Individual", value: "individual" },
    { text: "Business Owner", value: "business" },
  ];

  const statusOptions = [
    { text: "All Statuses", value: "all_statuses" }, // Fixed: Changed from empty string
    { text: "New", value: "NEW" },
    { text: "Reviewed", value: "REVIEWED" },
    { text: "In Progress", value: "IN_PROGRESS" },
    { text: "Resolved", value: "RESOLVED" },
    { text: "Closed", value: "CLOSED" },
  ];

  if (error) {
    return (
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-600">Error loading feedback: {error.message}</p>
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
          <div className="flex justify-between items-center mb-6">
            <Header
              title="Customer Feedback Center"
              subtext="View and manage customer feedback to improve service and address concerns effectively."
            />
          </div>

          {/* Analytics Chart */}
          <FeedbackBarComponent summary={feedbackData?.summary} />

          {/* Filters */}
          <div className="flex items-center gap-4 my-6 flex-wrap">
            <InputFilter
              setQuery={setSearchQuery}
              placeholder="Search feedback..."
            />

            <SelectFilter
              setFilter={handleTypeChange}
              placeholder="Select Type"
              list={typeOptions}
            />

            <SelectFilter
              setFilter={handleCustomerTypeChange}
              placeholder="Select Customer Type"
              list={customerTypeOptions}
            />

            <SelectFilter
              setFilter={handleStatusChange}
              placeholder="Select Status"
              list={statusOptions}
            />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading feedback...</span>
            </div>
          )}

          {/* Feedback Cards Grid */}
          {!isLoading && feedbackData?.data && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {feedbackData.data.map((feedback: any) => {
                  const formattedFeedback = formatFeedbackForCard(feedback);
                  return (
                    <FeedbackCard
                      key={feedback.id}
                      feedback={formattedFeedback}
                      onClick={() => handleFeedbackClick(feedback)}
                    />
                  );
                })}
              </div>

              {/* No Results */}
              {feedbackData.data.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No feedback found matching your criteria.</p>
                </div>
              )}

              {/* Pagination - Fixed with direct function calls */}
              {feedbackData.pagination && feedbackData.pagination.totalPages > 1 && (
                <div className="flex items-center justify-center mt-8 gap-2">
                  <button
                    disabled={!feedbackData.pagination.hasPreviousPage}
                    onClick={() => handlePageChange(filters.page - 1)}
                    className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-sm font-medium">
                    Page {feedbackData.pagination.currentPage} of {feedbackData.pagination.totalPages}
                  </span>
                  <button
                    disabled={!feedbackData.pagination.hasNextPage}
                    onClick={() => handlePageChange(filters.page + 1)}
                    className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Feedback Details Dialog */}
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <DialogContent className="right-0 p-8 max-w-[40.56rem] h-screen overflow-y-scroll">
          <DialogHeader>
            <DialogTitle className="mb-6 text-2xl font-bold text-[#111827] flex gap-[18px] items-center">
              <div onClick={() => setIsOpen(false)} className="cursor-pointer">
                <ChevronLeft size={24} />
              </div>
              <div>
                <h5 className="font-bold text-2xl text-[#111827] mb-2">
                  Feedback Details
                </h5>
                <p className="font-medium text-sm text-[#98A2B3]">
                  Review and manage customer feedback.
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>

          <ViewFeedback
            feedback={selectedFeedback}
            onClose={() => setIsOpen(false)}
            onRefresh={refetch}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Feedbacks;