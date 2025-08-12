

"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/app/(admin)/components/header";
import LoadingSvg from "@/components/load";
import { ViewIcon, EditIcon } from "../../../../../../public/icons";
import {
  useFeedback,
  formatFeedbackForTable,
  formatFeedbackForCard,
  getFeedbackTypeBadgeColor,
  getFeedbackStatusBadgeColor,
  getCustomerTypeDisplayName,
  formatRatingStars,
  calculateFeedbackSummary
} from "@/services/feedback";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FeedbackDetails from "./feedback-details";
import FeedbackStatusUpdate from "./feedback-status-update";
import { toast } from "sonner";

// =================== TYPESCRIPT INTERFACES ===================

interface FeedbackSummaryStats {
  total: number;
  byType: {
    RATINGS?: number;
    COMMENTS?: number;
    SUGGESTIONS?: number;
    COMPLAINTS?: number;
    [key: string]: number | undefined;
  };
  byStatus: {
    [key: string]: number;
  };
  averageRating: number | string;
}

interface FeedbackFilters {
  feedbackType: string;
  customerType: string;
  status: string;
  search: string;
  sortBy: string;
  sortOrder: string;
}

interface FeedbackData {
  id: string | number;
  feedbackId?: string;
  customer: string;
  customerEmail?: string;
  customerType: string;
  type: string;
  subject?: string;
  messageSnippet?: string;
  message?: string;
  rating?: number;
  ratingStars?: string;
  status: string;
  product?: string;
  order?: string;
  formattedDate: string;
  formattedTime?: string;
  createdAt: string;
  updatedAt?: string;
}

interface TableColumn {
  key: string;
  label: string;
  render?: (value: any, row?: any) => React.ReactNode;
}

// =================== COMPONENT ===================

const FeedbackManagement: React.FC = () => {
  // State management
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [filters, setFilters] = useState<FeedbackFilters>({
    feedbackType: "",
    customerType: "",
    status: "",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc"
  });

  // Modal states
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackData | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<"cards" | "table">("cards");

  // Fetch feedback with filters
  const queryParams = useMemo(() => ({
    page: currentPage,
    limit: pageSize,
    ...filters
  }), [currentPage, pageSize, filters]);

  const {
    data: feedbackData,
    isLoading,
    error,
    refetch
  } = useFeedback(queryParams);

  // Process data for display
  const feedbackList = useMemo((): FeedbackData[] => {
    if (!feedbackData?.data) return [];

    if (Array.isArray(feedbackData.data)) {
      return feedbackData.data.map((item: any) =>
        activeView === 'cards' ? formatFeedbackForCard(item) : formatFeedbackForTable(item)
      );
    }

    return [];
  }, [feedbackData, activeView]);

  const totalCount: number = feedbackData?.pagination?.totalCount || feedbackData?.totalCount || 0;
  const totalPages: number = Math.ceil(totalCount / pageSize);

  // Calculate summary statistics with proper typing
  const summaryStats = useMemo((): FeedbackSummaryStats => {
    if (!feedbackData?.data) {
      return {
        total: 0,
        byType: {},
        byStatus: {},
        averageRating: 0
      };
    }
    return calculateFeedbackSummary(feedbackData.data) as FeedbackSummaryStats;
  }, [feedbackData]);

  // Event handlers
  const handleFilterChange = (key: keyof FeedbackFilters, value: string): void => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleViewFeedback = (feedback: FeedbackData): void => {
    setSelectedFeedback(feedback);
    setShowDetailsModal(true);
  };

  const handleUpdateFeedback = (feedback: FeedbackData): void => {
    setSelectedFeedback(feedback);
    setShowUpdateModal(true);
  };

  const handleCloseModals = (): void => {
    setShowDetailsModal(false);
    setShowUpdateModal(false);
    setSelectedFeedback(null);
  };

  const handleUpdateSuccess = (): void => {
    refetch();
    handleCloseModals();
    toast.success("Feedback status updated successfully");
  };

  // Table columns configuration with proper typing
  const tableColumns: TableColumn[] = [
    {
      key: 'feedbackId',
      label: 'Feedback ID',
      render: (value: string) => (
        <span className="font-medium text-purple-600">{value}</span>
      )
    },
    {
      key: 'customer',
      label: 'Customer',
      render: (value: string, row: FeedbackData) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-gray-500">{row.customerEmail}</div>
          <Badge variant="outline" className="text-xs mt-1">
            {row.customerType}
          </Badge>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (value: string, row: FeedbackData) => (
        <Badge className={getFeedbackTypeBadgeColor(row.type || value)}>
          {value}
        </Badge>
      )
    },
    {
      key: 'subject',
      label: 'Subject',
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      )
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (value: number, row: FeedbackData) => (
        <div className="flex items-center space-x-1">
          <span className="text-yellow-500">{row.ratingStars || 'N/A'}</span>
          {value && <span className="text-sm text-gray-500">({value})</span>}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Badge className={getFeedbackStatusBadgeColor(value)}>
          {value?.replace('_', ' ') || ''}
        </Badge>
      )
    },
    {
      key: 'formattedDate',
      label: 'Submitted',
      render: (value: string, row: FeedbackData) => (
        <div>
          <div className="text-sm">{value}</div>
          <div className="text-xs text-gray-500">{row.formattedTime}</div>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: FeedbackData) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewFeedback(row)}
            className="text-blue-600 hover:text-blue-800"
          >
            <div className="h-4 w-4" >
              <ViewIcon />
            </div>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleUpdateFeedback(row)}
            className="text-green-600 hover:text-green-800"
          >
            <div className="h-4 w-4" >
              <EditIcon />
            </div>
          </Button>
        </div>
      )
    }
  ];

  // Card view component
  const FeedbackCard = ({ feedback }: { feedback: FeedbackData }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <CardTitle className="text-lg font-semibold text-purple-600">
                {feedback.feedbackId}
              </CardTitle>
              <Badge className={getFeedbackTypeBadgeColor(feedback.type)}>
                {feedback.type}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">{feedback.customer}</p>
            <Badge variant="outline" className="text-xs mt-1">
              {feedback.customerType}
            </Badge>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <Badge className={getFeedbackStatusBadgeColor(feedback.status)}>
              {feedback?.status?.replace('_', ' ') || ''}
            </Badge>
            {feedback.rating && (
              <div className="flex items-center space-x-1">
                <span className="text-yellow-500 text-sm">{feedback.ratingStars}</span>
                <span className="text-xs text-gray-500">({feedback.rating})</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600 line-clamp-3">
              {feedback.messageSnippet}
            </p>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Product: {feedback.product}</span>
            <span>{feedback.formattedDate}</span>
          </div>

          <div className="flex space-x-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewFeedback(feedback)}
              className="flex-1"
            >
              <div className="h-4 w-4 mr-1">
                <ViewIcon />
              </div>
              View Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleUpdateFeedback(feedback)}
              className="flex-1"
            >
              <div className="h-4 w-4 mr-1">
                <EditIcon />
              </div>
              Update Status
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-600 mb-4">Error loading feedback</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header
        title="Feedback Management"
      />

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Feedback</p>
                <p className="text-2xl font-bold">{summaryStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Ratings</p>
                <p className="text-2xl font-bold text-yellow-600">{summaryStats.byType.RATINGS || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Suggestions</p>
                <p className="text-2xl font-bold text-green-600">{summaryStats.byType.SUGGESTIONS || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Complaints</p>
                <p className="text-2xl font-bold text-red-600">{summaryStats.byType.COMPLAINTS || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-blue-600">{summaryStats.averageRating}⭐</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and View Toggle */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* View Toggle */}
            <div className="flex justify-between items-center">
              <Tabs value={activeView} onValueChange={(value) => setActiveView(value as "cards" | "table")}>
                <TabsList>
                  <TabsTrigger value="cards">Card View</TabsTrigger>
                  <TabsTrigger value="table">Table View</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Filters - USING NATIVE UI COMPONENTS */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Input
                placeholder="Search feedback..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />

              <Select
                value={filters.feedbackType}
                onValueChange={(value) => handleFilterChange('feedbackType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Feedback Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">All Types</SelectItem>
                  <SelectItem value="RATINGS">Ratings</SelectItem>
                  <SelectItem value="COMMENTS">Comments</SelectItem>
                  <SelectItem value="SUGGESTIONS">Suggestions</SelectItem>
                  <SelectItem value="COMPLAINTS">Complaints</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.customerType}
                onValueChange={(value) => handleFilterChange('customerType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Customer Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">All Customers</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="business">Business Owner</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">All Statuses</SelectItem>
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="REVIEWED">Reviewed</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.sortBy}
                onValueChange={(value) => handleFilterChange('sortBy', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Date Submitted</SelectItem>
                  <SelectItem value="updatedAt">Last Updated</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="type">Type</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Area */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSvg />
        </div>
      ) : (
        <Tabs value={activeView} className="space-y-4">
          <TabsContent value="cards">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {feedbackList.map((feedback) => (
                <FeedbackCard key={feedback.id} feedback={feedback} />
              ))}
            </div>

            {/* Pagination for cards view */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="table">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        {tableColumns.map((column) => (
                          <th key={column.key} className="text-left p-4 font-medium text-gray-600">
                            {column.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {feedbackList.map((row) => (
                        <tr key={row.id} className="border-b hover:bg-gray-50">
                          {tableColumns.map((column) => (
                            <td key={column.key} className="p-4">
                              {column.render
                                ? column.render((row as any)[column.key], row)
                                : (row as any)[column.key]
                              }
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Simple pagination for table */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 p-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Modals */}
      {showDetailsModal && selectedFeedback && (
        <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Feedback Details</DialogTitle>
            </DialogHeader>
            <FeedbackDetails
              feedbackId={selectedFeedback.id}
              onClose={handleCloseModals}
            />
          </DialogContent>
        </Dialog>
      )}

      {showUpdateModal && selectedFeedback && (
        <Dialog open={showUpdateModal} onOpenChange={setShowUpdateModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Update Feedback Status</DialogTitle>
            </DialogHeader>
            <FeedbackStatusUpdate
              feedback={selectedFeedback}
              onSuccess={handleUpdateSuccess}
              onClose={handleCloseModals}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default FeedbackManagement;