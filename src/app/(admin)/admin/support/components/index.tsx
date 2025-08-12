"use client";

import React, { useState, useMemo } from "react";
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
  useSupportRequests,
  formatSupportRequestForTable,
  getStatusBadgeColor,
  getPriorityBadgeColor,

} from "@/services/support";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SupportRequestDetails from "./support-request-details";
import SupportStatusUpdate from "./support-status-update";
import { toast } from "sonner";

// =================== TYPESCRIPT INTERFACES ===================
interface SupportFilters {
  category: string;
  status: string;
  priority: string;
  search: string;
  sortBy: string;
  sortOrder: string;
}

interface SupportData {
  id: string | number;
  supportId?: string;
  customer: string;
  customerEmail?: string;
  category: string;
  status: string;
  priority: string;
  subject: string; // Made required to match SupportRequestData
  messageSnippet?: string;
  assignedAdmin?: string;
  assignedAdminId?: number | string; // Added for SupportStatusUpdate
  resolutionChannel?: string; // Added for SupportStatusUpdate
  internalNotes?: string; // Added for SupportStatusUpdate
  formattedDate: string;
  formattedTime?: string;
}

interface TableColumn {
  key: string;
  label: string;
  render?: (value: any, row?: any) => React.ReactNode;
}

// =================== COMPONENT ===================
const SupportManagement: React.FC = () => {
  // State management
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);

  // FIXED: Individual state for each filter with proper typing
  const [filters, setFilters] = useState<SupportFilters>({
    category: "",
    status: "",
    priority: "",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc"
  });

  // Modal states
  const [selectedRequest, setSelectedRequest] = useState<SupportData | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);

  // FIXED: Default to cards view like feedback
  const [activeView, setActiveView] = useState<"cards" | "table">("cards");

  // Combine filters for API call
  const queryParams = useMemo(() => ({
    page: currentPage,
    limit: pageSize,
    ...filters
  }), [currentPage, pageSize, filters]);

  const {
    data: supportData,
    isLoading,
    error,
    refetch
  } = useSupportRequests(queryParams);

  // FIXED: Process data for display based on active view
  const supportRequests = useMemo((): SupportData[] => {
    if (!supportData?.data) return [];

    if (Array.isArray(supportData.data)) {
      return supportData.data.map((item: any) =>
        activeView === 'cards' ? SupportRequestCard(item) : formatSupportRequestForTable(item)
      );
    }

    return [];
  }, [supportData, activeView]);

  const totalCount: number = supportData?.pagination?.totalCount || supportData?.totalCount || 0;
  const totalPages: number = Math.ceil(totalCount / pageSize);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (!supportRequests.length) {
      return { total: 0, new: 0, inProgress: 0, resolved: 0 };
    }

    return {
      total: supportRequests.length,
      new: supportRequests.filter((req: any) => req.status === 'NEW').length,
      inProgress: supportRequests.filter((req: any) => req.status === 'IN_PROGRESS').length,
      resolved: supportRequests.filter((req: any) => req.status === 'RESOLVED').length,
    };
  }, [supportRequests]);

  // FIXED: Event handlers
  const handleFilterChange = (key: keyof SupportFilters, value: string): void => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleViewRequest = (request: SupportData): void => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleUpdateRequest = (request: SupportData): void => {
    setSelectedRequest(request);
    setShowUpdateModal(true);
  };

  const handleCloseModals = (): void => {
    setShowDetailsModal(false);
    setShowUpdateModal(false);
    setSelectedRequest(null);
  };

  const handleUpdateSuccess = (): void => {
    refetch();
    handleCloseModals();
    toast.success("Support request updated successfully");
  };

  // FIXED: Table columns configuration like feedback
  const tableColumns: TableColumn[] = [
    {
      key: 'supportId',
      label: 'Support ID',
      render: (value: string) => (
        <span className="font-medium text-blue-600">{value}</span>
      )
    },
    {
      key: 'customer',
      label: 'Customer',
      render: (value: string, row: SupportData) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-gray-500">{row.customerEmail}</div>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      render: (value: string) => (
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
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
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <Badge className={getStatusBadgeColor(value)}>
          {value?.replace('_', ' ') || ''}
        </Badge>
      )
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (value: string) => (
        <Badge className={getPriorityBadgeColor(value)}>
          {value}
        </Badge>
      )
    },
    {
      key: 'formattedDate',
      label: 'Created',
      render: (value: string, row: SupportData) => (
        <div>
          <div className="text-sm">{value}</div>
          <div className="text-xs text-gray-500">{row.formattedTime}</div>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: SupportData) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewRequest(row)}
            className="text-blue-600 hover:text-blue-800"
          >
            <div className="h-4 w-4">
              <ViewIcon />
            </div>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleUpdateRequest(row)}
            className="text-green-600 hover:text-green-800"
          >
            <div className="h-4 w-4">
              <EditIcon />
            </div>
          </Button>
        </div>
      )
    }
  ];

  // FIXED: Card view component with visible action buttons
  const SupportRequestCard = ({ request }: { request: SupportData }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-blue-600 mb-2">
              {request.supportId}
            </CardTitle>
            <p className="text-sm text-gray-600">{request.customer}</p>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <Badge className={getStatusBadgeColor(request.status)}>
              {request?.status?.replace('_', ' ') || ''}
            </Badge>
            <Badge className={getPriorityBadgeColor(request.priority)}>
              {request.priority}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <span className="font-medium text-sm">Category:</span>{' '}
            <Badge variant="outline" className="ml-1 bg-blue-50 text-blue-700">
              {request.category}
            </Badge>
          </div>

          {request.subject && (
            <div>
              <span className="font-medium text-sm">Subject:</span>
              <p className="text-sm text-gray-600 mt-1">{request.subject}</p>
            </div>
          )}

          {request.messageSnippet && (
            <div>
              <span className="font-medium text-sm">Message:</span>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{request.messageSnippet}</p>
            </div>
          )}

          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Assigned: {request.assignedAdmin || 'Unassigned'}</span>
            <span>{request.formattedDate}</span>
          </div>

          {/* FIXED: Visible action buttons */}
          <div className="flex space-x-2 mt-4 pt-3 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewRequest(request)}
              className="flex-1 text-sm"
            >
              <div className="h-4 w-4 mr-1">
                <ViewIcon />
              </div>
              View Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleUpdateRequest(request)}
              className="flex-1 text-sm"
            >
              <div className="h-4 w-4 mr-1">
                <EditIcon />
              </div>
              Update
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-600 mb-4">Error loading support requests</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header title="Support Management" />

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold">{summaryStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">New</p>
                <p className="text-2xl font-bold text-blue-600">{summaryStats.new}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">{summaryStats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{summaryStats.resolved}</p>
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

            {/* FIXED: Filters with proper state setters */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Input
                placeholder="Search tickets..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />

              <Select
                value={filters.category}
                onValueChange={(value) => handleFilterChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  <SelectItem value="PRODUCT">Product</SelectItem>
                  <SelectItem value="ORDER">Order</SelectItem>
                  <SelectItem value="DELIVERY">Delivery</SelectItem>
                  <SelectItem value="GENERAL">General</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
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
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.priority}
                onValueChange={(value) => handleFilterChange('priority', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Priorities</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
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
                  <SelectItem value="createdAt">Date Created</SelectItem>
                  <SelectItem value="updatedAt">Last Updated</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
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
              {supportRequests.map((request) => (
                <SupportRequestCard key={request.id} request={request} />
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
                      {supportRequests.map((row) => (
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
      {showDetailsModal && selectedRequest && (
        <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Support Request Details</DialogTitle>
            </DialogHeader>
            <SupportRequestDetails
              supportId={selectedRequest.id}
              onClose={handleCloseModals}
            />
          </DialogContent>
        </Dialog>
      )}

      {showUpdateModal && selectedRequest && (
        <Dialog open={showUpdateModal} onOpenChange={setShowUpdateModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Update Support Request</DialogTitle>
            </DialogHeader>
            <SupportStatusUpdate
              supportRequest={selectedRequest}
              onSuccess={handleUpdateSuccess}
              onClose={handleCloseModals}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SupportManagement;