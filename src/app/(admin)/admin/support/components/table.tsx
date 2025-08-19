"use client";

import { useState } from "react"; //  Import useState
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"; //  Import Dialog components
import { ChevronLeft } from "lucide-react"; //  Import ChevronLeft icon
import {
	getStatusBadgeColor,
	getPriorityBadgeColor,
	formatSupportRequestForTable,
} from "@/services/support";
import { ViewIcon } from "../../../../../../public/icons";
import ViewSupportRequest from "./view-support-request"; //  Import the view component
import Link from "next/link";
import { ROUTES } from "@/constant/routes";

interface SimpleTableProps {
	data: any[];
	onRefresh?: () => void; //  Added onRefresh for consistency
}

const SimpleSupportTable: React.FC<SimpleTableProps> = ({
	data,
	onRefresh = () => {},
}) => {
	//  State for managing the dialog and selected item
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [selectedRequest, setSelectedRequest] = useState<any>(null);

	// Format data for display and take only the first 3 items
	const formattedData = data.map(formatSupportRequestForTable).slice(0, 3);

	//  Handler to open the dialog and set the selected request
	const handleView = (supportRequest: any) => {
		setSelectedRequest(supportRequest);
		setIsOpen(true);
	};

	return (
		<>
			<div className="overflow-x-auto">
				<div className="flex justify-end">
				<Link
            href={ROUTES.ADMIN.SIDEBAR.SUPPORTTABLE}
            className="m-5 text-sm font-medium text-[#687588] underline border border-[#E9EAEC] rounded-md px-[3.56rem] py-4"
          >
            View All
          </Link>
				</div>

				<table className="w-full border border-gray-200 rounded-lg text-xs">
					{/* ... thead remains the same ... */}
					<thead className="bg-gray-50">
						<tr>
							<th className="text-left p-2 font-medium text-gray-900">
								Customer
							</th>
							<th className="text-left p-2 font-medium text-gray-900">
								Support ID
							</th>
							<th className="text-left p-2 font-medium text-gray-900">
								Category
							</th>
							<th className="text-left p-2 font-medium text-gray-900">Type</th>
							{/* <th className="text-left p-2 font-medium text-gray-900">
								Priority
							</th> */}
							<th className="text-left p-2 font-medium text-gray-900">
								Status
							</th>
							<th className="text-left p-2 font-medium text-gray-900">
								Assigned To
							</th>
							<th className="text-left p-2 font-medium text-gray-900">Date</th>
							<th className="text-left p-2 font-medium text-gray-900">
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
								{/* ... other table cells (td) remain the same ... */}
								<td className="p-2">
									<div className="flex items-center gap-2">
										<Image
											src="/images/user-avatar.jpg"
											width={24}
											height={24}
											alt="Customer avatar"
											className="w-6 h-6 rounded-full"
										/>
										<div>
											<p className="font-medium text-xs">{request.customer}</p>
											<p className="text-[10px] text-gray-500">
												{request.customerEmail}
											</p>
										</div>
									</div>
								</td>
								<td className="p-2 font-medium text-xs">{request.supportId}</td>
								<td className="p-2 text-xs">{request.category}</td>
								<td className="p-2">
									<p className="font-medium truncate text-xs">
										{request.customerType}
									</p>
								</td>
								{/* <td className="p-2">
									<Badge
										className={`${getPriorityBadgeColor(
											request.priority
										)} py-[2px] px-2 text-xs font-semibold`}
									>
										{request.priority}
									</Badge>
								</td> */}
								<td className="p-2">
									<Badge
										className={`${getStatusBadgeColor(
											request.status
										)} py-[2px] px-2 text-xs font-semibold`}
									>
										{request.status}
									</Badge>
								</td>
								<td className="p-2 text-xs">
									{request.assignedAdmin || "Unassigned"}
								</td>
								<td className="p-2 text-[10px] text-gray-500">
									{request.formattedDate}
								</td>
								<td className="p-2">
									<div className="flex justify-center items-center">
										<button
											className="bg-[#27A376] p-1 rounded-md hover:bg-[#219a6b] transition-colors"
											title="View Details"
											onClick={() => handleView(request)} //  Added onClick handler
										>
											<ViewIcon />
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>

				{formattedData.length === 0 && (
					<div className="text-center py-4">
						<p className="text-xs text-gray-500">
							No support requests available.
						</p>
					</div>
				)}
			</div>

			{/*  Dialog for viewing support request details */}
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
		</>
	);
};

export default SimpleSupportTable;
