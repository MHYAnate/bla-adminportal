// src/app/(admin)/admin/support/components/data-table.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";
import { SelectFilter } from "@/app/(admin)/components/select-filter";
import { DeleteIcon, ViewIcon } from "../../../../../../public/icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft } from "lucide-react";
import ViewSupportRequest from "./view-support-request";
import DeleteContent from "@/app/(admin)/components/delete-content";
import {
  getStatusBadgeColor,
  getPriorityBadgeColor,
  formatSupportRequestForTable
} from "@/services/support";

interface DataTableProps {
  data: any[];
  pagination?: any;
  summary?: any;
  filters: any;
  onFiltersChange: (filters: any) => void;
  onRefresh: () => void;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  pagination,
  summary,
  filters,
  onFiltersChange,
  onRefresh
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>("view");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleView = (supportRequest: any) => {
    setSelectedRequest(supportRequest);
    setCurrentTab("view");
    setIsOpen(true);
  };

  const handleDelete = (supportRequest: any) => {
    setSelectedRequest(supportRequest);
    setCurrentTab("delete");
    setIsOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRequest) return;

    setIsDeleting(true);
    try {
      // Add your delete logic here
      console.log("Deleting support request:", selectedRequest.id);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Close dialog and refresh data
      setIsOpen(false);
      onRefresh();

      // Show success message
      console.log("Support request deleted successfully");
    } catch (error) {
      console.error("Failed to delete support request:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    // Convert "all_*" values back to empty strings for API
    const apiValue = value.startsWith('all_') ? '' : value;
    onFiltersChange({ ...filters, [key]: apiValue, page: 1 });
  };

  const handleSearch = (search: string) => {
    onFiltersChange({ ...filters, search, page: 1 });
  };

  const statusOptions = [
    { text: "All Statuses", value: "all_statuses" }, // Fixed: Changed from empty string
    { text: "New", value: "NEW" },
    { text: "In Progress", value: "IN_PROGRESS" },
    { text: "Resolved", value: "RESOLVED" },
  ];

  const categoryOptions = [
    { text: "All Categories", value: "all_categories" }, // Fixed: Changed from empty string
    { text: "Product", value: "PRODUCT" },
    { text: "Order", value: "ORDER" },
    { text: "Delivery", value: "DELIVERY" },
    { text: "General", value: "GENERAL" },
    { text: "Other", value: "OTHER" },
  ];

  const priorityOptions = [
    { text: "All Priorities", value: "all_priorities" }, // Fixed: Changed from empty string
    { text: "Low", value: "LOW" },
    { text: "Medium", value: "MEDIUM" },
    { text: "High", value: "HIGH" },
    { text: "Urgent", value: "URGENT" },
  ];

  // Format data for display
  const formattedData = data.map(formatSupportRequestForTable);

  return (
    <>
      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900">Total Requests</h3>
            <p className="text-2xl font-bold text-blue-600">{summary.total || 0}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-900">New</h3>
            <p className="text-2xl font-bold text-yellow-600">{summary.byStatus?.NEW || 0}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-orange-900">In Progress</h3>
            <p className="text-2xl font-bold text-orange-600">{summary.byStatus?.IN_PROGRESS || 0}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-900">Resolved</h3>
            <p className="text-2xl font-bold text-green-600">{summary.byStatus?.RESOLVED || 0}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6 justify-between">
        <h6 className="font-semibold text-lg text-[#111827]">Support Requests</h6>

        <div className="flex items-center gap-4">
          <Input
            placeholder="Search requests..."
            value={filters.search || ''}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-64"
          />

          <SelectFilter
            setFilter={(value: string) => handleFilterChange('status', value)}
            placeholder="Filter by Status"
            list={statusOptions}
          />

          <SelectFilter
            setFilter={(value: string) => handleFilterChange('category', value)}
            placeholder="Filter by Category"
            list={categoryOptions}
          />

          <SelectFilter
            setFilter={(value: string) => handleFilterChange('priority', value)}
            placeholder="Filter by Priority"
            list={priorityOptions}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 font-medium text-gray-900">Customer</th>
              <th className="text-left p-4 font-medium text-gray-900">Support ID</th>
              <th className="text-left p-4 font-medium text-gray-900">Category</th>
              <th className="text-left p-4 font-medium text-gray-900">Subject</th>
              <th className="text-left p-4 font-medium text-gray-900">Priority</th>
              <th className="text-left p-4 font-medium text-gray-900">Status</th>
              <th className="text-left p-4 font-medium text-gray-900">Assigned To</th>
              <th className="text-left p-4 font-medium text-gray-900">Date</th>
              <th className="text-left p-4 font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {formattedData.map((request) => (
              <tr key={request.id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/images/user-avatar.png"
                      width={36}
                      height={36}
                      alt="Customer avatar"
                      className="w-9 h-9 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{request.customer}</p>
                      <p className="text-sm text-gray-500">{request.customerEmail}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 font-medium">{request.supportId}</td>
                <td className="p-4">{request.category}</td>
                <td className="p-4">
                  <div className="max-w-xs">
                    <p className="font-medium truncate">{request.subject}</p>
                    <p className="text-sm text-gray-500 truncate">{request.messageSnippet}</p>
                  </div>
                </td>
                <td className="p-4">
                  <Badge className={`${getPriorityBadgeColor(request.priority)} py-1 px-3 font-semibold`}>
                    {request.priority}
                  </Badge>
                </td>
                <td className="p-4">
                  <Badge className={`${getStatusBadgeColor(request.status)} py-1 px-3 font-semibold`}>
                    {request.status}
                  </Badge>
                </td>
                <td className="p-4">{request.assignedAdmin || 'Unassigned'}</td>
                <td className="p-4 text-sm text-gray-500">{request.formattedDate}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      className="bg-[#27A376] p-2 rounded-lg hover:bg-[#219a6b] transition-colors"
                      onClick={() => handleView(request)}
                      title="View Details"
                    >
                      <ViewIcon />
                    </button>
                    <button
                      className="bg-[#E03137] p-2 rounded-lg hover:bg-[#c82d33] transition-colors"
                      onClick={() => handleDelete(request)}
                      title="Delete Request"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* No Data Message */}
        {formattedData.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No support requests found.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-700">
            Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of {pagination.totalItems} results
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={!pagination.hasPreviousPage}
              onClick={() => onFiltersChange({ ...filters, page: pagination.currentPage - 1 })}
            >
              Previous
            </Button>
            <span className="px-3 py-1 text-sm font-medium">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              disabled={!pagination.hasNextPage}
              onClick={() => onFiltersChange({ ...filters, page: pagination.currentPage + 1 })}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Dialog for View/Delete */}
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <DialogContent
          className={`${currentTab === "delete"
            ? "max-w-[33.75rem] left-[50%] translate-x-[-50%]"
            : "right-0 p-8 max-w-[40.56rem] h-screen overflow-y-scroll"
            }`}
        >
          {currentTab === "view" && (
            <DialogHeader>
              <DialogTitle className="mb-6 text-2xl font-bold text-[#111827] flex gap-[18px] items-center">
                <div
                  onClick={() => setIsOpen(false)}
                  className="cursor-pointer"
                >
                  <ChevronLeft size={24} />
                </div>
                <div>
                  <h5 className="font-bold text-2xl text-[#111827] mb-2">
                    Support Request Details
                  </h5>
                  <p className="font-medium text-sm text-[#98A2B3]">
                    Review and manage customer support request.
                  </p>
                </div>
              </DialogTitle>
            </DialogHeader>
          )}

          {currentTab === "view" ? (
            <ViewSupportRequest
              supportRequest={selectedRequest}
              onClose={() => setIsOpen(false)}
              onRefresh={onRefresh}
            />
          ) : (
            <DeleteContent
              handleClose={() => setIsOpen(false)}
              handleClick={handleConfirmDelete}
              title="Support Request"
              isLoading={isDeleting}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DataTable;