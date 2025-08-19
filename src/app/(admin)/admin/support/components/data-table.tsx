// // src/app/(admin)/admin/support/components/data-table.tsx
// "use client";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import Image from "next/image";
// import { useState } from "react";
// import { SelectFilter } from "@/app/(admin)/components/select-filter";
// import { DeleteIcon, ViewIcon } from "../../../../../../public/icons";
// import {
// 	Dialog,
// 	DialogContent,
// 	DialogHeader,
// 	DialogTitle,
// } from "@/components/ui/dialog";
// import { ChevronLeft } from "lucide-react";
// import ViewSupportRequest from "./view-support-request";
// import DeleteContent from "@/app/(admin)/components/delete-content";
// import {
// 	getStatusBadgeColor,
// 	getPriorityBadgeColor,
// 	formatSupportRequestForTable,
// } from "@/services/support";
// import Link from "next/link";
// import { ROUTES } from "@/constant/routes";

// interface DataTableProps {
// 	data: any[];
// 	pagination?: any;
// 	summary?: any;
// 	filters: any;
// 	onFiltersChange: (filters: any) => void;
// 	onRefresh: () => void;
// }

// const DataTable: React.FC<DataTableProps> = ({
// 	data,
// 	pagination,
// 	summary,
// 	filters,
// 	onFiltersChange,
// 	onRefresh,
// }) => {
// 	const [isOpen, setIsOpen] = useState<boolean>(false);
// 	const [currentTab, setCurrentTab] = useState<string>("view");
// 	const [selectedRequest, setSelectedRequest] = useState<any>(null);
// 	const [isDeleting, setIsDeleting] = useState<boolean>(false);

// 	const handleView = (supportRequest: any) => {
// 		setSelectedRequest(supportRequest);
// 		setCurrentTab("view");
// 		setIsOpen(true);
// 	};

// 	const handleDelete = (supportRequest: any) => {
// 		setSelectedRequest(supportRequest);
// 		setCurrentTab("delete");
// 		setIsOpen(true);
// 	};

// 	const handleConfirmDelete = async () => {
// 		if (!selectedRequest) return;

// 		setIsDeleting(true);
// 		try {
// 			// Add your delete logic here
// 			console.log("Deleting support request:", selectedRequest.id);

// 			// Simulate API call
// 			await new Promise((resolve) => setTimeout(resolve, 1000));

// 			// Close dialog and refresh data
// 			setIsOpen(false);
// 			onRefresh();

// 			// Show success message
// 			console.log("Support request deleted successfully");
// 		} catch (error) {
// 			console.error("Failed to delete support request:", error);
// 		} finally {
// 			setIsDeleting(false);
// 		}
// 	};

// 	const handleFilterChange = (key: string, value: string) => {
// 		// Convert "all_*" values back to empty strings for API
// 		const apiValue = value.startsWith("all_") ? "" : value;
// 		onFiltersChange({ ...filters, [key]: apiValue, page: 1 });
// 	};

// 	const handleSearch = (search: string) => {
// 		onFiltersChange({ ...filters, search, page: 1 });
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

// 	// Format data for display
// 	const formattedData = data.map(formatSupportRequestForTable);

// 	return (
// 		<div>
// 			{/* Summary Stats */}
		
// 			{summary && (
// 				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
					
// 					<div className="bg-blue-50 p-4 rounded-lg">
// 						<h3 className="text-sm font-medium text-blue-900">
// 							Total Requests
// 						</h3>
// 						<p className="text-2xl font-bold text-blue-600">
// 							{summary.total || 0}
// 						</p>
// 					</div>
// 					<div className="bg-yellow-50 p-4 rounded-lg">
// 						<h3 className="text-sm font-medium text-yellow-900">New</h3>
// 						<p className="text-2xl font-bold text-yellow-600">
// 							{summary.byStatus?.NEW || 0}
// 						</p>
// 					</div>
// 					<div className="bg-orange-50 p-4 rounded-lg">
// 						<h3 className="text-sm font-medium text-orange-900">In Progress</h3>
// 						<p className="text-2xl font-bold text-orange-600">
// 							{summary.byStatus?.IN_PROGRESS || 0}
// 						</p>
// 					</div>
// 					<div className="bg-green-50 p-4 rounded-lg">
// 						<h3 className="text-sm font-medium text-green-900">Resolved</h3>
// 						<p className="text-2xl font-bold text-green-600">
// 							{summary.byStatus?.RESOLVED || 0}
// 						</p>
// 					</div>
// 				</div>
// 			)}
			

// 			{/* Filters */}
// 			{/* <div className="flex items-center gap-4 mb-6 justify-between">

// 				<h6 className="font-semibold text-lg text-[#111827]">
// 					Support Requests
// 				</h6>

// 				<div className="flex items-center gap-4">
// 					<Input
// 						placeholder="Search requests..."
// 						value={filters.search || ""}
// 						onChange={(e) => handleSearch(e.target.value)}
// 						className="w-64"
// 					/>

// 					<SelectFilter
// 						setFilter={(value: string) => handleFilterChange("status", value)}
// 						placeholder="Filter by Status"
// 						list={statusOptions}
// 					/>

// 					<SelectFilter
// 						setFilter={(value: string) => handleFilterChange("category", value)}
// 						placeholder="Filter by Category"
// 						list={categoryOptions}
// 					/>

// 					<SelectFilter
// 						setFilter={(value: string) => handleFilterChange("priority", value)}
// 						placeholder="Filter by Priority"
// 						list={priorityOptions}
// 					/>
// 				</div>
// 			</div> */}

// 			{/* Table */}
// 			<div className="overflow-x-auto">
		
// 				<table className="w-full border border-gray-200 rounded-lg text-xs">
					
// 					<thead className="bg-gray-50">
// 						<tr>
// 							<th className="text-left p-2 font-medium text-gray-900">
// 								Customer
// 							</th>
// 							<th className="text-left p-2 font-medium text-gray-900">
// 								Support ID
// 							</th>
// 							<th className="text-left p-2 font-medium text-gray-900">
// 								Category
// 							</th>
// 							<th className="text-left p-2 font-medium text-gray-900">Type</th>
// 							<th className="text-left p-2 font-medium text-gray-900">
// 								Priority
// 							</th>
// 							<th className="text-left p-2 font-medium text-gray-900">
// 								Status
// 							</th>
// 							<th className="text-left p-2 font-medium text-gray-900">
// 								Assigned To
// 							</th>
// 							<th className="text-left p-2 font-medium text-gray-900">Date</th>
// 							<th className="text-left p-2 font-medium text-gray-900">
// 								Actions
// 							</th>
// 						</tr>
// 					</thead>
// 					<tbody>
// 						{formattedData.map((request) => (
// 							<tr
// 								key={request.id}
// 								className="border-t border-gray-200 hover:bg-gray-50"
// 							>
// 								<td className="p-2">
// 									<div className="flex items-center gap-2">
// 										<Image
// 											src="/images/user-avatar.jpg"
// 											width={24}
// 											height={24}
// 											alt="Customer avatar"
// 											className="w-6 h-6 rounded-full"
// 										/>
// 										<div>
// 											<p className="font-medium text-xs">{request.customer}</p>
// 											<p className="text-[10px] text-gray-500">
// 												{request.customerEmail}
// 											</p>
// 										</div>
// 									</div>
// 								</td>
// 								<td className="p-2 font-medium text-xs">{request.supportId}</td>
// 								<td className="p-2 text-xs">{request.category}</td>
// 								<td className="p-2">
// 									<div className="max-w-xs">
// 										<p className="font-medium truncate text-xs">
// 											{request.customerType}
// 										</p>
// 										{/* <p className="text-[10px] text-gray-500 truncate">
// 											{request.messageSnippet}
// 										</p> */}
// 									</div>
// 								</td>
// 								<td className="p-2">
// 									<Badge
// 										className={`${getPriorityBadgeColor(
// 											request.priority
// 										)} py-[2px] px-2 text-xs font-semibold`}
// 									>
// 										{request.priority}
// 									</Badge>
// 								</td>
// 								<td className="p-2">
// 									<Badge
// 										className={`${getStatusBadgeColor(
// 											request.status
// 										)} py-[2px] px-2 text-xs font-semibold`}
// 									>
// 										{request.status}
// 									</Badge>
// 								</td>
// 								<td className="p-2 text-xs">
// 									{request.assignedAdmin || "Unassigned"}
// 								</td>
// 								<td className="p-2 text-[10px] text-gray-500">
// 									{request.formattedDate}
// 								</td>
// 								<td className="p-2">
// 									<div className="flex justify-center items-center">
// 										<button
// 											className="bg-[#27A376] p-1 rounded-md hover:bg-[#219a6b] transition-colors"
// 											onClick={() => handleView(request)}
// 											title="View Details"
// 										>
// 											<ViewIcon />
// 										</button>
// 										{/* <button
//                       className="bg-[#E03137] p-2 rounded-lg hover:bg-[#c82d33] transition-colors"
//                       onClick={() => handleDelete(request)}
//                       title="Delete Request"
//                     >
//                       <DeleteIcon />
//                     </button> */}
// 									</div>
// 								</td>
// 							</tr>
// 						))}
// 					</tbody>
// 				</table>

				

// 				{/* No Data Message */}
// 				{formattedData.length === 0 && (
// 					<div className="text-center py-4">
// 						<p className="text-xs text-gray-500">No support requests found.</p>
// 					</div>
// 				)}
// 			</div>

// 			{/* Pagination */}
// 			{pagination && pagination.totalPages > 1 && (
// 				<div className="flex items-center justify-between mt-6">
// 					<p className="text-sm text-gray-700">
// 						Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}{" "}
// 						to{" "}
// 						{Math.min(
// 							pagination.currentPage * pagination.itemsPerPage,
// 							pagination.totalItems
// 						)}{" "}
// 						of {pagination.totalItems} results
// 					</p>
// 					<div className="flex items-center gap-2">
// 						<Button
// 							variant="outline"
// 							disabled={!pagination.hasPreviousPage}
// 							onClick={() =>
// 								onFiltersChange({
// 									...filters,
// 									page: pagination.currentPage - 1,
// 								})
// 							}
// 						>
// 							Previous
// 						</Button>
// 						<span className="px-3 py-1 text-sm font-medium">
// 							Page {pagination.currentPage} of {pagination.totalPages}
// 						</span>
// 						<Button
// 							variant="outline"
// 							disabled={!pagination.hasNextPage}
// 							onClick={() =>
// 								onFiltersChange({
// 									...filters,
// 									page: pagination.currentPage + 1,
// 								})
// 							}
// 						>
// 							Next
// 						</Button>
// 					</div>
// 				</div>
// 			)}

// 			{/* Dialog for View/Delete */}
// 			<Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
// 				<DialogContent
// 					className={`${
// 						currentTab === "delete"
// 							? "max-w-[33.75rem] left-[50%] translate-x-[-50%]"
// 							: "right-0 p-8 max-w-[40.56rem] h-screen overflow-y-scroll"
// 					}`}
// 				>
// 					{currentTab === "view" && (
// 						<DialogHeader>
// 							<DialogTitle className="mb-6 text-2xl font-bold text-[#111827] flex gap-[18px] items-center">
// 								<div
// 									onClick={() => setIsOpen(false)}
// 									className="cursor-pointer"
// 								>
// 									<ChevronLeft size={24} />
// 								</div>
// 								<div>
// 									<h5 className="font-bold text-2xl text-[#111827] mb-2">
// 										Support Request Details
// 									</h5>
// 									<p className="font-medium text-sm text-[#98A2B3]">
// 										Review and manage customer support request.
// 									</p>
// 								</div>
// 							</DialogTitle>
// 						</DialogHeader>
// 					)}

// 					{currentTab === "view" ? (
// 						<ViewSupportRequest
// 							supportRequest={selectedRequest}
// 							onClose={() => setIsOpen(false)}
// 							onRefresh={onRefresh}
// 						/>
// 					) : (
// 						<DeleteContent
// 							handleClose={() => setIsOpen(false)}
// 							handleClick={handleConfirmDelete}
// 							title="Support Request"
// 							isLoading={isDeleting}
// 						/>
// 					)}
// 				</DialogContent>
// 			</Dialog>
// 		</div>
// 	);
// };

// export default DataTable;

// src/app/(admin)/admin/support/components/data-table.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { ViewIcon } from "../../../../../../public/icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, Loader2 } from "lucide-react";
import ViewSupportRequest from "./view-support-request";
import {
  getStatusBadgeColor,
  getPriorityBadgeColor,
  formatSupportRequestForTable,
} from "@/services/support";

interface DataTableProps {
  data: any[];
  pagination?: any;
  summary?: any;
  filters: any;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  pagination,
  summary,
  onPageChange,
  onRefresh,
  isLoading,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const handleView = (supportRequest: any) => {
    setSelectedRequest(supportRequest);
    setIsOpen(true);
  };

  // Format data for display
  const formattedData = data.map(formatSupportRequestForTable);

  return (
    <div>
      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="text-sm font-medium text-blue-900">
              Total Requests
            </h3>
            <p className="text-2xl font-bold text-blue-600">
              {summary.total || 0}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <h3 className="text-sm font-medium text-yellow-900">New</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {summary.byStatus?.NEW || 0}
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
            <h3 className="text-sm font-medium text-orange-900">In Progress</h3>
            <p className="text-2xl font-bold text-orange-600">
              {summary.byStatus?.IN_PROGRESS || 0}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h3 className="text-sm font-medium text-green-900">Resolved</h3>
            <p className="text-2xl font-bold text-green-600">
              {summary.byStatus?.RESOLVED || 0}
            </p>
          </div>
        </div>
      )}

      {/* Table with loading indicator */}
      <div className="overflow-x-auto relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        )}
        
        <table className="w-full border border-gray-200 rounded-lg text-xs">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3 font-medium text-gray-900">
                Customer
              </th>
              <th className="text-left p-3 font-medium text-gray-900">
                Support ID
              </th>
              <th className="text-left p-3 font-medium text-gray-900">
                Category
              </th>
              <th className="text-left p-3 font-medium text-gray-900">Type</th>
              {/* <th className="text-left p-3 font-medium text-gray-900">
                Priority
              </th> */}
              <th className="text-left p-3 font-medium text-gray-900">
                Status
              </th>
              <th className="text-left p-3 font-medium text-gray-900">
                Assigned To
              </th>
              <th className="text-left p-3 font-medium text-gray-900">Date</th>
              <th className="text-left p-3 font-medium text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {formattedData.map((request) => (
              <tr
                key={request.id}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
                    <div>
                      <p className="font-medium text-sm">{request.customer}</p>
                      <p className="text-xs text-gray-500">
                        {request.customerEmail}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-3 font-medium text-sm">{request.supportId}</td>
                <td className="p-3 text-sm">{request.category}</td>
                <td className="p-3">
                  <div className="max-w-xs">
                    <p className="font-medium truncate text-sm">
                      {request.customerType}
                    </p>
                  </div>
                </td>
                {/* <td className="p-3">
                  <Badge
                    className={`${getPriorityBadgeColor(
                      request.priority
                    )} py-1 px-3 text-xs font-semibold`}
                  >
                    {request.priority}
                  </Badge>
                </td> */}
                <td className="p-3">
                  <Badge
                    className={`${getStatusBadgeColor(
                      request.status
                    )} py-1 px-3 text-xs font-semibold`}
                  >
                    {request.status}
                  </Badge>
                </td>
                <td className="p-3 text-sm">
                  {request.assignedAdmin || "Unassigned"}
                </td>
                <td className="p-3 text-xs text-gray-500">
                  {request.formattedDate}
                </td>
                <td className="p-3">
                  <div className="flex justify-center items-center">
                    <button
                      className="bg-[#27A376] p-2 rounded-md hover:bg-[#219a6b] transition-colors"
                      onClick={() => handleView(request)}
                      title="View Details"
                      disabled={isLoading}
                    >
                      <ViewIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* No Data Message */}
        {formattedData.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No support requests found.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-700">
            Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}{" "}
            to{" "}
            {Math.min(
              pagination.currentPage * pagination.itemsPerPage,
              pagination.totalItems
            )}{" "}
            of {pagination.totalItems} results
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700"
              disabled={!pagination.hasPreviousPage || isLoading}
              onClick={() => onPageChange(pagination.currentPage - 1)}
            >
              Previous
            </Button>
            <span className="px-3 py-1 text-sm font-medium text-gray-700">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700"
              disabled={!pagination.hasNextPage || isLoading}
              onClick={() => onPageChange(pagination.currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Dialog for View */}
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="right-0 p-8 max-w-[40.56rem] h-screen overflow-y-scroll">
              <DialogHeader>
                <DialogTitle className="mb-6 text-2xl font-bold text-[#111827] flex gap-[18px] items-center">
                  <div onClick={() => setIsOpen(false)} className="cursor-pointer">
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
              <ViewSupportRequest
                supportRequest={selectedRequest}
                onClose={() => setIsOpen(false)}
                onRefresh={onRefresh}
              />
            </DialogContent>
          </Dialog>
    </div>
  );
};

export default DataTable;