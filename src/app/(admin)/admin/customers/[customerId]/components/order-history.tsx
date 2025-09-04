"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBagIcon } from "../../../../../../../public/icons";
import OrderDetailsCard from "@/components/widgets/order-details";
import { useGetCustomerOrderHistory } from "@/services/customers";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface iProps {
	customerId: string;
}

const ITEMS_PER_PAGE = 5;

const OrderHistory: React.FC<iProps> = ({ customerId }) => {
	const {
		getCustomerOrderHistoryIsLoading,
		getCustomerOrderHistoryData,
		getCustomerOrderHistoryError,
		setCustomerOrderHistoryFilter,
	} = useGetCustomerOrderHistory();

	const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
	const [page, setPage] = useState(1);

	useEffect(() => {
		if (customerId) {
			setCustomerOrderHistoryFilter(customerId);
		}
	}, [customerId, setCustomerOrderHistoryFilter]);

	if (getCustomerOrderHistoryIsLoading) {
		return (
			<div className="flex items-center justify-center min-h-[200px]">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
					<p className="mt-2 text-sm">Loading order history...</p>
				</div>
			</div>
		);
	}

	if (getCustomerOrderHistoryError) {
		return (
			<div className="flex items-center justify-center min-h-[200px]">
				<div className="text-center text-red-600">
					<p className="text-sm">Error loading order history</p>
					<p className="text-xs">{getCustomerOrderHistoryError}</p>
				</div>
			</div>
		);
	}

	const summary = getCustomerOrderHistoryData?.summary;
	const orders = getCustomerOrderHistoryData?.orders ?? [];

	if (!getCustomerOrderHistoryData || (!summary && orders.length === 0)) {
		return (
			<div className="flex items-center justify-center min-h-[200px]">
				<div className="text-center text-gray-500">
					<p>No order history found</p>
				</div>
			</div>
		);
	}

	const deliveredCount = summary?.orderCounts?.DELIVERED || 0;
	const cancelledCount = summary?.orderCounts?.CANCELLED || 0;
	const ongoingCount =
		(summary?.orderCounts?.PENDING || 0) +
		(summary?.orderCounts?.PROCESSING || 0) +
		(summary?.orderCounts?.SCHEDULED || 0) +
		(summary?.orderCounts?.SHIPPED || 0);

	// ✅ Calculate totals
	const getOrderTotal = (order: any) =>
		order.items?.reduce(
			(sum: number, item: any) =>
				sum + (item.price || 0) * (item.quantity || 1),
			0
		) || 0;

	const allOrdersTotal = orders.reduce(
		(sum: number, order: any) => sum + getOrderTotal(order),
		0
	);

	// Pagination
	const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
	const paginatedOrders = orders.slice(
		(page - 1) * ITEMS_PER_PAGE,
		page * ITEMS_PER_PAGE
	);

	return (
		<>
			{/* Summary Cards */}
			<div className="flex gap-2 mb-6">
				<Card className="w-full bg-[#ABFFD5]">
					<CardContent className="gap-4 p-6">
						<h6 className="font-bold text-base text-[#111827] mb-5">
							Delivered
						</h6>
						<div className="flex gap-2.5 items-center">
							<div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#134134]">
								<ShoppingBagIcon />
							</div>
							<p className="text-[#676767] text-xs font-dmsans">
								{deliveredCount} Orders Delivered
							</p>
						</div>
					</CardContent>
				</Card>
				<Card className="w-full bg-[#FFE2B3]">
					<CardContent className="gap-4 p-6">
						<h6 className="font-bold text-base text-[#111827] mb-5">Ongoing</h6>
						<div className="flex gap-2.5 items-center">
							<div className="w-12 h-12 rounded-full flex bg-[#FCB84B] items-center justify-center">
								<ShoppingBagIcon />
							</div>
							<p className="text-[#676767] text-xs font-dmsans">
								{ongoingCount} Ongoing Orders
							</p>
						</div>
					</CardContent>
				</Card>
				<Card className="w-full bg-[#FFCEDA]">
					<CardContent className="gap-4 p-6">
						<h6 className="font-bold text-base text-[#111827] mb-5">
							Cancelled
						</h6>
						<div className="flex gap-2.5 items-center">
							<div className="w-12 h-12 rounded-full bg-[#FB678C] flex items-center justify-center">
								<ShoppingBagIcon />
							</div>
							<p className="text-[#676767] text-xs font-dmsans">
								{cancelledCount} Cancelled Orders
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* 🔝 Overall Total */}
			<div className="mb-6 p-4 bg-gray-50 rounded-xl text-center">
				<p className="text-sm text-gray-600">Total Value of All Orders</p>
				<p className="text-2xl font-bold text-gray-900">
					₦{allOrdersTotal.toLocaleString()}
				</p>
			</div>

			{/* Orders List */}
			<div className="flex flex-col gap-8">
				{paginatedOrders.map((order: any) => {
					const isExpanded = expandedOrderId === order.id;
					const productCount = order.items?.length || 0;
					const orderTotal = getOrderTotal(order);

					return (
						<Card
						key={order.id}
						className="group border-0 bg-blue-900 text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden"
					>
					
							<CardContent className="p-0">
								<div className="p-6 border-b border-gray-100">
									<div className="flex justify-between items-start mb-4">
										<div className="space-y-1">
											<div className="flex items-center gap-3">
												<h3 className="font-semibold text-lg text-white">
													{order.orderReference}
												</h3>
												<span
													className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
														mapStatusToLabel(order.status) === "Delivered"
															? "bg-green-100 text-green-800"
															: mapStatusToLabel(order.status) === "Ongoing"
															? "bg-yellow-100 text-yellow-800"
															: mapStatusToLabel(order.status) === "Cancelled"
															? "bg-red-100 text-red-800"
															: mapStatusToLabel(order.status) === "Completed"
															? "bg-blue-100 text-blue-800"
															: "bg-gray-100 text-gray-800"
													}`}
												>
													{mapStatusToLabel(order.status)}
												</span>
											</div>
											<p className="text-sm text-gray-500 font-medium">
												{format(new Date(order.createdAt), "MMM dd, yyyy")}
											</p>
										</div>
										<div className="text-right space-y-1">
											<p className="text-xl font-bold text-white">
												₦{orderTotal.toLocaleString()}
											</p>
											<p className="text-sm text-gray-500 font-medium">
												{productCount} {productCount === 1 ? "item" : "items"}
											</p>
										</div>
									</div>

									{!isExpanded ? (
										<Button
											variant="outline"
											size="sm"
											onClick={() => setExpandedOrderId(order.id)}
											className="w-full bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700 font-medium transition-colors duration-200 rounded-xl h-10"
										>
											<span className="flex items-center gap-2">
												View Order Details
												<svg
													className="w-4 h-4"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M19 9l-7 7-7-7"
													/>
												</svg>
											</span>
										</Button>
									) : (
										<Button
											variant="ghost"
											size="sm"
											onClick={() => setExpandedOrderId(null)}
											className="w-full text-gray-600 hover:text-gray-800 hover:bg-gray-50 font-medium transition-colors duration-200 rounded-xl h-10"
										>
											<span className="flex items-center gap-2">
												Hide Details
												<svg
													className="w-4 h-4"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M5 15l7-7 7 7"
													/>
												</svg>
											</span>
										</Button>
									)}
								</div>

								{isExpanded && (
									<div className="p-6 bg-gray-50/50 space-y-4">
										<div className="space-y-3">
											{order.items.map((product: any) => {
												const item = {
													id: order.id,
													name: product?.productName || "Unnamed Product",
													price: product.price?.toLocaleString() || "0",
													orderid: order.orderReference,
													date: format(new Date(order.createdAt), "dd/MM/yy"),
													status: mapStatusToLabel(order.status),
													url: product?.image || "/images/logo.png",
													quantity: product?.quantity?.toLocaleString() || "1",
												};
												return (
													<div
														key={product.id}
														className="bg-white rounded-xl shadow-sm border border-gray-100"
													>
														<OrderDetailsCard item={item} />
													</div>
												);
											})}
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					);
				})}
			</div>

			{/* Pagination Controls */}
			{totalPages > 1 && (
				<div className="flex justify-center items-center gap-6 mt-8">
					<Button
						variant="outline"
						size="sm"
						disabled={page === 1}
						onClick={() => setPage((p) => p - 1)}
						className="px-4 py-2 rounded-lg text-sm font-medium"
					>
						Previous
					</Button>

					<div className="flex items-center gap-1 text-sm text-gray-700 font-medium">
						<span>Page</span>
						<span className="px-2 py-1 bg-gray-100 rounded-md text-gray-900">
							{page}
						</span>
						<span>of</span>
						<span className="px-2 py-1 bg-gray-100 rounded-md text-gray-900">
							{totalPages}
						</span>
					</div>

					<Button
						variant="outline"
						size="sm"
						disabled={page === totalPages}
						onClick={() => setPage((p) => p + 1)}
						className="px-4 py-2 rounded-lg text-sm font-medium"
					>
						Next
					</Button>
				</div>
			)}
		</>
	);
};

export default OrderHistory;

function mapStatusToLabel(status: string) {
	const s = status?.toUpperCase() || "";
	if (s === "DELIVERED") return "Delivered";
	if (["PENDING", "PROCESSING", "SCHEDULED", "SHIPPED"].includes(s))
		return "Ongoing";
	if (s === "CANCELLED") return "Cancelled";
	if (s === "COMPLETED") return "Completed";
	return "Unknown";
}
