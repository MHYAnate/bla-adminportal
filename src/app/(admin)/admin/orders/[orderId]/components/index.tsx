"use client";
import React, { useMemo, useCallback, useState } from "react";
import { ViewIcon } from "../../../../../../../public/icons";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetOrderInfo, useProcessRefund } from "@/services/orders";
import { RefundModal, PaymentInfoDisplay } from "./refund";
import { formatDate, formatDateTime } from "@/lib/utils";
import { useRouter } from "next/navigation";
import httpService from "@/services/httpService";
import { routes } from "@/services/api-routes";
import {
	Edit,
	RefreshCw,
	Truck,
	Calendar,
	Eye,
	Package,
	CreditCard,
	MapPin,
	User,
	Download,
	CheckCircle,
	Clock,
	AlertCircle,
	X,
	ShoppingCart,
} from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
	DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import BackButton from "./backbtn";

// Product Details Modal Component
const ProductDetailsModal = React.memo(
	({
		product,
		onClose,
		isOpen,
	}: {
		product: any;
		onClose: () => void;
		isOpen: boolean;
	}) => {
		if (!product) return null;

		return (
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl border-0 shadow-2xl">
					<DialogHeader className="border-b border-gray-100 pb-4">
						<DialogTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900">
							<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
								<Package className="w-5 h-5 text-white" />
							</div>
							Product Details
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-6 pt-4">
						<div className="flex gap-6">
							<div className="w-32 h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center overflow-hidden">
								{product.image ? (
									<Image
										src={product.image || "/placeholder.svg"}
										alt={product.name}
										width={128}
										height={128}
										className="w-full h-full object-cover rounded-2xl"
										onError={(e) => {
											(e.target as HTMLImageElement).style.display = "none";
										}}
									/>
								) : (
									<Package className="w-12 h-12 text-gray-400" />
								)}
							</div>
							<div className="flex-1">
								<h3 className="text-2xl font-bold text-gray-900 mb-3">
									{product.name}
								</h3>
								<p className="text-gray-600 mb-6 leading-relaxed">
									{product.shortDescription}
								</p>
								<div className="grid grid-cols-2 gap-6">
									<div className="space-y-1">
										<span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
											Category
										</span>
										<p className="text-lg font-semibold text-gray-900">
											{product.category?.name || "N/A"}
										</p>
									</div>
									<div className="space-y-1">
										<span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
											Manufacturer
										</span>
										<p className="text-lg font-semibold text-gray-900">
											{product.manufacturer?.name || "N/A"}
										</p>
									</div>
									<div className="space-y-1">
										<span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
											Processing Time
										</span>
										<p className="text-lg font-semibold text-gray-900">
											{product.processingTime || "N/A"} days
										</p>
									</div>
									<div className="space-y-1">
										<span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
											Returns
										</span>
										<p className="text-lg font-semibold text-gray-900">
											{product.acceptsReturns ? "Accepted" : "Not Accepted"}
										</p>
									</div>
								</div>
							</div>
						</div>
						<div className="flex justify-end pt-6 border-t border-gray-100">
							<Button
								onClick={onClose}
								className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-8 py-3 rounded-xl font-semibold"
							>
								Close
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		);
	}
);
ProductDetailsModal.displayName = "ProductDetailsModal";

// Order Tracking Modal Component
const OrderTrackingModal = React.memo(
	({
		order,
		onClose,
		isOpen,
	}: {
		order: any;
		onClose: () => void;
		isOpen: boolean;
	}) => {
		if (!order) return null;

		const getTrackingSteps = useCallback(
			(status: string, paymentStatus: string) => {
				const steps = [
					{
						id: 1,
						name: "Order Placed",
						status: "completed",
						icon: <CheckCircle className="w-6 h-6" />,
						description: "Order has been confirmed",
					},
					{
						id: 2,
						name: "Payment",
						status: paymentStatus === "PAID" ? "completed" : "current",
						icon: <CreditCard className="w-6 h-6" />,
						description: "Payment processing",
					},
					{
						id: 3,
						name: "Processing",
						status:
							status === "PROCESSING"
								? "current"
								: ["SHIPPED", "DELIVERED", "COMPLETED"].includes(status)
								? "completed"
								: "pending",
						icon: <Package className="w-6 h-6" />,
						description: "Order is being prepared",
					},
					{
						id: 4,
						name: "Shipped",
						status:
							status === "SHIPPED"
								? "current"
								: ["DELIVERED", "COMPLETED"].includes(status)
								? "completed"
								: "pending",
						icon: <Truck className="w-6 h-6" />,
						description: "Order is on the way",
					},
					{
						id: 5,
						name: "Delivered",
						status: ["DELIVERED", "COMPLETED"].includes(status)
							? "completed"
							: "pending",
						icon: <CheckCircle className="w-6 h-6" />,
						description: "Order has been delivered",
					},
				];
				return steps;
			},
			[]
		);

		const trackingSteps = useMemo(
			() => getTrackingSteps(order.status, order.paymentStatus),
			[order.status, order.paymentStatus, getTrackingSteps]
		);

		return (
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl border-0 shadow-2xl">
					<DialogHeader className="border-b border-gray-100 pb-6">
						<DialogTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900">
							<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
								<Truck className="w-6 h-6 text-white" />
							</div>
							Order Tracking
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-8 pt-6">
						{/* Progress Tracker */}
						<div className="mb-10">
							<div className="flex items-center justify-between relative">
								<div className="absolute top-6 left-12 right-12 h-1 bg-gray-100 rounded-full z-0"></div>
								<div
									className="absolute top-6 left-12 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full z-0 transition-all duration-1000 ease-out"
									style={{
										width: `${(() => {
											const completedSteps = trackingSteps.filter(
												(step) => step.status === "completed"
											).length;
											const totalGaps = trackingSteps.length - 1;
											return Math.max(
												0,
												((completedSteps - 1) / totalGaps) * 100
											);
										})()}%`,
									}}
								/>
								{trackingSteps.map((step, index) => (
									<div
										key={step.id}
										className="flex flex-col items-center relative z-10 bg-white px-3"
									>
										<div
											className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-lg transition-all duration-500 ${
												step.status === "completed"
													? "bg-gradient-to-br from-green-500 to-emerald-600 text-white scale-110"
													: step.status === "current"
													? "bg-gradient-to-br from-blue-500 to-purple-600 text-white scale-110 animate-pulse"
													: "bg-gray-100 text-gray-400"
											}`}
										>
											{step.icon}
										</div>
										<span
											className={`text-sm text-center font-bold max-w-24 leading-tight ${
												step.status === "completed" || step.status === "current"
													? "text-gray-900"
													: "text-gray-400"
											}`}
										>
											{step.name}
										</span>
										<span className="text-xs text-gray-500 text-center max-w-28 mt-2 leading-tight">
											{step.description}
										</span>
									</div>
								))}
							</div>
						</div>

						{/* Order Details Grid */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
								<h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
									<div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
										<Package className="w-4 h-4 text-white" />
									</div>
									Order Information
								</h3>
								<div className="space-y-4">
									<div className="flex justify-between items-center">
										<span className="text-gray-600 font-medium">Order ID:</span>
										<span className="font-bold text-gray-900">#{order.id}</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-gray-600 font-medium">Date:</span>
										<span className="font-bold text-gray-900">
											{formatDate(order.createdAt)}
										</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-gray-600 font-medium">Status:</span>
										<Badge
											className={`px-3 py-1 rounded-full font-semibold ${
												order.status === "DELIVERED"
													? "bg-green-100 text-green-800"
													: "bg-yellow-100 text-yellow-800"
											}`}
										>
											{order.status}
										</Badge>
									</div>
									<div className="flex justify-between items-center">
										<span className="text-gray-600 font-medium">
											Total Amount:
										</span>
										<span className="font-bold text-xl text-gray-900">
											₦{(order.totalPrice || 0).toLocaleString()}
										</span>
									</div>
								</div>
							</div>

							<div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
								<h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
									<div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center">
										<Truck className="w-4 h-4 text-white" />
									</div>
									Shipping Information
								</h3>
								<div className="space-y-4">
									{order.shipping && (
										<>
											<div className="flex justify-between items-center">
												<span className="text-gray-600 font-medium">
													Distance:
												</span>
												<span className="font-bold text-gray-900">
													{order.shipping.distance} km
												</span>
											</div>
											<div className="flex justify-between items-center">
												<span className="text-gray-600 font-medium">
													Shipping Fee:
												</span>
												<span className="font-bold text-gray-900">
													₦
													{(
														order.shipping.totalShippingFee || 0
													).toLocaleString()}
												</span>
											</div>
										</>
									)}
									<div className="flex justify-between items-center">
										<span className="text-gray-600 font-medium">
											Estimated Delivery:
										</span>
										<span className="font-bold text-gray-900">
											{(() => {
												const date = new Date(order.createdAt);
												date.setDate(date.getDate() + 7);
												return formatDate(date.toISOString());
											})()}
										</span>
									</div>
								</div>
							</div>
						</div>

						<div className="flex justify-end pt-6 border-t border-gray-100">
							<Button
								onClick={onClose}
								className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg"
							>
								Close
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		);
	}
);
OrderTrackingModal.displayName = "OrderTrackingModal";

// Type definitions
interface OrderStatus {
	variant: "default" | "secondary" | "destructive" | "outline";
	text: string;
}

interface StatusTransition {
	value: string;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
	color: string;
}

// Enhanced order data type matching your backend response
interface ProcessedOrderData {
	id: any;
	orderId?: string;
	status: string;
	totalPrice: number;
	createdAt: string;
	updatedAt?: string;
	paymentStatus: string;
	orderType?: string;
	user: any;
	items: any[];
	timeline: any[];
	shipping: any;
	breakdown: any;
	summary: any;
	transactions?: any[];
	adminAlerts?: any[];
	notes?: any[];
	// Payment fields from your controller
	amountPaid?: number;
	amountDue?: number;
	[key: string]: any;
}

// Main Order Details Component
interface OrderDetailsProps {
	orderId?: string;
	setClose?: React.Dispatch<React.SetStateAction<boolean>>;
	isModal?: boolean;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
	orderId,
	setClose,
	isModal = false,
}) => {
	const router = useRouter();
	const [trackingModalOpen, setTrackingModalOpen] = useState(false);
	const [productModalOpen, setProductModalOpen] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
	const [refundModalOpen, setRefundModalOpen] = useState(false);
	const processRefundMutation = useProcessRefund();

	// Validate orderId before proceeding
	if (!orderId) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
				<div className="text-center max-w-md mx-auto">
					<div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
						<AlertCircle className="w-10 h-10 text-red-600" />
					</div>
					<h2 className="text-2xl font-bold text-gray-900 mb-3">
						Invalid Order ID
					</h2>
					<p className="text-gray-600 mb-8">
						No order ID was provided. Please check the URL and try again.
					</p>
					<Button
						onClick={() => router.back()}
						className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold"
					>
						{isModal ? "Close" : "Go Back"}
					</Button>
				</div>
			</div>
		);
	}

	const {
		getOrderInfoData: rawData,
		getOrderInfoIsLoading,
		getOrderInfoError,
		refetchOrderInfo,
	} = useGetOrderInfo({
		enabled: Boolean(orderId),
		orderId: orderId,
	} as any);

	// Helper functions for safe property access
	const getAmountPaid = useCallback((orderData: any): number => {
		return typeof orderData?.amountPaid === "number"
			? orderData.amountPaid
			: typeof orderData?.breakdown?.amountPaid === "number"
			? orderData.breakdown.amountPaid
			: 0;
	}, []);

	const getAmountDue = useCallback((orderData: any): number => {
		return typeof orderData?.amountDue === "number"
			? orderData.amountDue
			: typeof orderData?.breakdown?.amountDue === "number"
			? orderData.breakdown.amountDue
			: 0;
	}, []);

	// Determine payment type and schedule based on available data
	const getPaymentInfo = useCallback(
		(order: any) => {
			const paymentStatus = order.paymentStatus || "PENDING";
			const orderType = order.orderType || "IMMEDIATE";

			// Determine if it's pay on delivery based on amount due vs total
			const totalPrice = order.totalPrice || 0;
			const amountPaid = getAmountPaid(order);
			const amountDue = getAmountDue(order);

			const isPayOnDelivery =
				amountDue === totalPrice &&
				amountPaid === 0 &&
				paymentStatus === "PENDING";
			const requiresImmediatePayment =
				paymentStatus === "PENDING" && !isPayOnDelivery;
			const isScheduled =
				orderType === "SCHEDULED" || Boolean(order.scheduledDeliveryDate);

			return {
				paymentStatus,
				orderType,
				isPayOnDelivery,
				requiresImmediatePayment,
				isScheduled,
				method: isPayOnDelivery ? "Pay on Delivery" : "Online Payment",
			};
		},
		[getAmountPaid, getAmountDue]
	);

	// Memoized callbacks to prevent infinite loops
	const handleViewProduct = useCallback((product: any) => {
		setSelectedProduct(product);
		setProductModalOpen(true);
	}, []);

	const handleOpenTrackingModal = useCallback(() => {
		setTrackingModalOpen(true);
	}, []);

	const handleClose = useCallback(() => {
		if (setClose) {
			setClose(false);
		} else {
			router.back();
		}
	}, [setClose, router]);

	const handleStatusUpdate = useCallback(
		async (newStatus: string) => {
			if (!orderId) {
				toast.error("No order ID available");
				return;
			}

			setIsUpdatingStatus(true);
			try {
				const response = await httpService.patchData(
					{
						status: newStatus,
						notes: `Status updated to ${newStatus} via admin panel`,
					},
					routes.updateOrderStatus(orderId)
				);

				if (refetchOrderInfo) {
					await refetchOrderInfo();
				}

				toast.success(`Order status successfully updated to ${newStatus}`);
			} catch (error: any) {
				console.error("Failed to update order status:", error);
				toast.error(
					`Failed to update order status: ${error?.message || "Unknown error"}`
				);
			} finally {
				setIsUpdatingStatus(false);
			}
		},
		[orderId, refetchOrderInfo]
	);

	const handleRefundSuccess = useCallback(() => {
		// Custom logic after successful refund
		console.log("Refund completed successfully");
		// Refresh order data
		if (refetchOrderInfo) {
			refetchOrderInfo();
		}
		// Optional: Show additional success message or redirect
		toast.success("Order refunded and data refreshed");
	}, [refetchOrderInfo]);

	const handleRetry = useCallback(() => {
		if (refetchOrderInfo) {
			refetchOrderInfo();
		}
	}, [refetchOrderInfo]);

	// Memoized processed data based on your controller's response structure
	const processedOrderData = useMemo((): ProcessedOrderData | null => {
		if (!rawData) return null;

		return {
			...rawData,
			id: rawData.id,
			orderId:
				rawData.orderId || `#${String(rawData.id || "").padStart(6, "0")}`,
			status: rawData.status || "PENDING",
			totalPrice: Number(rawData.totalPrice) || 0,
			createdAt: rawData.createdAt || new Date().toISOString(),
			paymentStatus: rawData.paymentStatus || "PENDING",
			orderType: rawData.orderType || "IMMEDIATE",
			items: Array.isArray(rawData.items) ? rawData.items : [],
			timeline: Array.isArray(rawData.timeline) ? rawData.timeline : [],
			user: rawData.user || {},
			summary: rawData.summary || {},
			breakdown: rawData.breakdown || {},
			shipping: rawData.shipping || null,
			transactions: rawData.transactions || [],
			adminAlerts: rawData.adminAlerts || [],
			notes: rawData.notes || [],
			amountPaid: rawData.amountPaid || rawData.breakdown?.amountPaid || 0,
			amountDue: rawData.amountDue || rawData.breakdown?.amountDue || 0,
		};
	}, [rawData]);

	// Memoized shipping address calculation
	const shippingAddress = useMemo(() => {
		if (!processedOrderData) return null;

		// Look for shipping address in timeline or user profile
		const orderCreatedEvent = processedOrderData.timeline?.find(
			(event: any) =>
				event?.action === "ORDER_CREATED" && event?.details?.shippingAddress
		);

		if (orderCreatedEvent?.details?.shippingAddress) {
			return orderCreatedEvent.details.shippingAddress;
		}

		// Fallback to user profile address
		const user = processedOrderData.user;
		if (user?.profile?.address || user?.businessProfile?.businessAddress) {
			return {
				fullAddress:
					user.profile?.address || user.businessProfile?.businessAddress,
				city: "N/A",
				stateProvince: "N/A",
				country: "Nigeria",
				postalCode: "N/A",
			};
		}

		return null;
	}, [processedOrderData]);

	// Memoized status info
	const statusInfo = useMemo(() => {
		if (!processedOrderData)
			return { variant: "secondary" as const, text: "Unknown" };

		const statusMap: Record<string, OrderStatus> = {
			PENDING: { variant: "secondary" as const, text: "Pending" },
			SCHEDULED: { variant: "secondary" as const, text: "Scheduled" },
			PROCESSING: { variant: "default" as const, text: "Processing" },
			ONGOING: { variant: "default" as const, text: "Ongoing" },
			SHIPPED: { variant: "default" as const, text: "Shipped" },
			DELIVERED: { variant: "default" as const, text: "Delivered" },
			COMPLETED: { variant: "default" as const, text: "Completed" },
			CANCELLED: { variant: "destructive" as const, text: "Cancelled" },
		};

		return (
			statusMap[processedOrderData.status] || {
				variant: "secondary" as const,
				text: processedOrderData.status,
			}
		);
	}, [processedOrderData]);

	// Memoized available transitions
	const availableTransitions = useMemo(() => {
		if (!processedOrderData) return [];

		const statusTransitions: Record<string, StatusTransition[]> = {
			PENDING: [
				{
					value: "PROCESSING",
					label: "Start Processing",
					icon: Package,
					color: "text-blue-600",
				},
				{
					value: "CANCELLED",
					label: "Cancel Order",
					icon: X,
					color: "text-red-600",
				},
			],
			SCHEDULED: [
				{
					value: "PENDING",
					label: "Mark as Pending",
					icon: Clock,
					color: "text-orange-600",
				},
				{
					value: "PROCESSING",
					label: "Start Processing",
					icon: Package,
					color: "text-blue-600",
				},
				{
					value: "CANCELLED",
					label: "Cancel Order",
					icon: X,
					color: "text-red-600",
				},
			],
			PROCESSING: [
				{
					value: "SHIPPED",
					label: "Mark as Shipped",
					icon: Truck,
					color: "text-purple-600",
				},
				{
					value: "COMPLETED",
					label: "Mark as Completed",
					icon: CheckCircle,
					color: "text-green-600",
				},
				{
					value: "CANCELLED",
					label: "Cancel Order",
					icon: X,
					color: "text-red-600",
				},
			],
			ONGOING: [
				{
					value: "PROCESSING",
					label: "Start Processing",
					icon: Package,
					color: "text-blue-600",
				},
				{
					value: "SHIPPED",
					label: "Mark as Shipped",
					icon: Truck,
					color: "text-purple-600",
				},
				{
					value: "DELIVERED",
					label: "Mark as Delivered",
					icon: CheckCircle,
					color: "text-green-600",
				},
			],
			SHIPPED: [
				{
					value: "DELIVERED",
					label: "Mark as Delivered",
					icon: CheckCircle,
					color: "text-green-600",
				},
			],
			DELIVERED: [
				{
					value: "COMPLETED",
					label: "Complete Order",
					icon: CheckCircle,
					color: "text-green-600",
				},
			],
			CANCELLED: [],
			COMPLETED: [],
		};

		return statusTransitions[processedOrderData.status] || [];
	}, [processedOrderData]);

	// Loading state
	if (getOrderInfoIsLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
						<div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
					</div>
					<p className="text-xl font-bold text-gray-900 mb-2">
						Loading order details...
					</p>
					<p className="text-sm text-gray-600">Order #{orderId}</p>
				</div>
			</div>
		);
	}

	// Error state
	if (getOrderInfoError) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
				<div className="text-center max-w-md mx-auto">
					<div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
						<AlertCircle className="w-10 h-10 text-red-600" />
					</div>
					<h2 className="text-2xl font-bold text-gray-900 mb-3">
						Error Loading Order
					</h2>
					<p className="text-gray-600 mb-8">{getOrderInfoError}</p>
					<div className="flex gap-4 justify-center">
						<Button
							variant="outline"
							onClick={handleClose}
							className="px-6 py-3 rounded-xl font-semibold"
						>
							{isModal ? "Close" : "Go Back"}
						</Button>
						<Button
							onClick={handleRetry}
							className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold"
						>
							<RefreshCw className="w-4 h-4 mr-2" />
							Try Again
						</Button>
					</div>
				</div>
			</div>
		);
	}

	// Empty state
	if (!processedOrderData) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
				<div className="text-center max-w-md mx-auto">
					<div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
						<Package className="w-10 h-10 text-gray-400" />
					</div>
					<h2 className="text-2xl font-bold text-gray-900 mb-3">
						Order Not Found
					</h2>
					<p className="text-gray-600 mb-8">
						The order #{orderId} could not be found.
					</p>
					<div className="flex gap-4 justify-center">
						<Button
							variant="outline"
							onClick={handleClose}
							className="px-6 py-3 rounded-xl font-semibold"
						>
							{isModal ? "Close" : "Go Back"}
						</Button>
						<Button
							onClick={handleRetry}
							className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold"
						>
							<RefreshCw className="w-4 h-4 mr-2" />
							Try Again
						</Button>
					</div>
				</div>
			</div>
		);
	}

	// At this point, we have valid data
	const order = processedOrderData;
	const customer = order.user;
	const profile = customer?.profile || customer?.businessProfile;
	const paymentInfo = getPaymentInfo(order);

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto">
				<BackButton />
				{/* Main Content Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Left Column */}
					<div className="lg:col-span-2 space-y-8">
						{/* Header with Order ID and Actions */}
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<h1 className="text-2xl font-bold text-gray-900">
									Order# {order.orderId || order.id}
								</h1>
								<Badge
									className={`px-3 py-1 rounded-lg text-sm font-semibold ${
										statusInfo.variant === "default"
											? "bg-green-100 text-green-800"
											: statusInfo.variant === "destructive"
											? "bg-red-100 text-red-800"
											: "bg-yellow-100 text-yellow-800"
									}`}
								>
									{statusInfo.text}
								</Badge>
								<Badge className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-semibold">
									{paymentInfo.orderType}
								</Badge>
							</div>

							<div className="flex gap-3">
								<Button
									variant="outline"
									onClick={() => setRefundModalOpen(true)}
									disabled={
										processRefundMutation.isPending ||
										order.paymentStatus !== "PAID" ||
										["REFUNDED", "CANCELLED"].includes(order.status)
									}
									className="px-4 py-2 rounded-lg font-semibold border hover:bg-gray-50"
								>
									Refund
								</Button>

								{/* Status Update Dropdown */}
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg"
											disabled={
												isUpdatingStatus || availableTransitions.length === 0
											}
										>
											{isUpdatingStatus ? (
												<>
													<RefreshCw className="w-4 h-4 animate-spin mr-2" />
													Updating...
												</>
											) : (
												"Edit order"
											)}
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align="end"
										className="w-64 bg-white rounded-lg border shadow-lg"
									>
										<DropdownMenuLabel className="flex items-center gap-2 text-gray-900 font-bold py-3">
											<ShoppingCart className="w-4 h-4" />
											Update Order Status
										</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<div className="px-3 py-2 text-xs text-gray-500 font-semibold">
											Current:{" "}
											<span className="font-bold text-gray-700">
												{statusInfo.text}
											</span>
										</div>
										<DropdownMenuSeparator />
										{availableTransitions.length === 0 ? (
											<div className="px-3 py-3 text-sm text-gray-500 italic">
												No status changes available
											</div>
										) : (
											availableTransitions.map((transition) => {
												const IconComponent = transition.icon;
												return (
													<DropdownMenuItem
														key={transition.value}
														onClick={() => handleStatusUpdate(transition.value)}
														className="flex items-center gap-3 cursor-pointer py-3 px-3 rounded-lg mx-1 my-1 hover:bg-gray-50"
													>
														<IconComponent
															className={`w-4 h-4 ${transition.color}`}
														/>
														<span className="font-semibold">
															{transition.label}
														</span>
													</DropdownMenuItem>
												);
											})
										)}
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>

						{/* Order Progress Bar */}
						<Card className="bg-white rounded-xl border-0 shadow-sm">
							<CardContent className="p-6">
								<h3 className="text-lg font-bold text-gray-900 mb-6">
									Order Progress
								</h3>
								<div className="relative mb-8">
									{/* Background progress line */}
									<div className="absolute top-6 left-0 right-0 h-2 bg-gray-100 rounded-full z-0"></div>
									{/* Active progress line */}
									<div
										className="absolute top-6 left-0 h-2 bg-green-500 rounded-full z-0 transition-all duration-1000 ease-out"
										style={{
											width: `${(() => {
												const steps = [
													{ key: "ORDER_PLACED", completed: true },
													{
														key: "PAYMENT",
														completed: order.paymentStatus === "PAID",
													},
													{
														key: "PROCESSING",
														completed: [
															"PROCESSING",
															"ONGOING",
															"SHIPPED",
															"DELIVERED",
															"COMPLETED",
														].includes(order.status),
													},
													{
														key: "SHIPPING",
														completed: [
															"SHIPPED",
															"DELIVERED",
															"COMPLETED",
														].includes(order.status),
													},
													{
														key: "DELIVERED",
														completed: ["DELIVERED", "COMPLETED"].includes(
															order.status
														),
													},
												];
												const completedSteps = steps.filter(
													(step) => step.completed
												).length;
												return Math.max(0, (completedSteps - 1) * 25); // 25% for each step
											})()}%`,
										}}
									/>

									{/* Progress steps */}
									<div className="relative z-10 flex items-center justify-between">
										{[
											{
												label: "Order Confirmed",
												status: "completed",
												isActive: true,
											},
											{
												label: "Payment Pending",
												status:
													order.paymentStatus === "PAID"
														? "completed"
														: "current",
												isActive: order.paymentStatus === "PAID",
											},
											{
												label: "Processing",
												status: ["PROCESSING", "ONGOING"].includes(order.status)
													? "current"
													: ["SHIPPED", "DELIVERED", "COMPLETED"].includes(
															order.status
													  )
													? "completed"
													: "pending",
												isActive: [
													"PROCESSING",
													"ONGOING",
													"SHIPPED",
													"DELIVERED",
													"COMPLETED",
												].includes(order.status),
											},
											{
												label: "Shipping",
												status:
													order.status === "SHIPPED"
														? "current"
														: ["DELIVERED", "COMPLETED"].includes(order.status)
														? "completed"
														: "pending",
												isActive: [
													"SHIPPED",
													"DELIVERED",
													"COMPLETED",
												].includes(order.status),
											},
											{
												label: "Delivered",
												status: ["DELIVERED", "COMPLETED"].includes(
													order.status
												)
													? "completed"
													: "pending",
												isActive: ["DELIVERED", "COMPLETED"].includes(
													order.status
												),
											},
										].map((step, index) => (
											<div
												key={index}
												className="flex flex-col items-center bg-white"
											>
												<div
													className={`w-12 h-12 rounded-full mb-2 transition-all duration-500 flex items-center justify-center ${
														step.status === "completed"
															? "bg-green-500 text-white"
															: step.status === "current"
															? "bg-yellow-500 text-white"
															: "bg-gray-200 text-gray-400"
													}`}
												>
													<CheckCircle className="w-6 h-6" />
												</div>
												<span
													className={`text-xs text-center font-semibold max-w-20 leading-tight ${
														step.isActive ? "text-gray-900" : "text-gray-400"
													}`}
												>
													{step.label}
												</span>
											</div>
										))}
									</div>
								</div>

								{/* Estimated delivery and track button */}
								<div className="flex justify-between items-center pt-4 border-t border-gray-100">
									<div className="text-sm text-gray-600">
										<span className="font-semibold">
											Estimated shipping date:{" "}
										</span>
										{(() => {
											const date = new Date(order.createdAt);
											date.setDate(date.getDate() + 7);
											return formatDate(date.toISOString());
										})()}
									</div>
									<Button
										onClick={handleOpenTrackingModal}
										className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg"
									>
										Track order
									</Button>
								</div>
							</CardContent>
						</Card>

						{/* Order Timeline */}
						<Card className="bg-white rounded-xl border-0 shadow-sm">
							<CardHeader>
								<CardTitle className="text-xl font-bold text-gray-900">
									Order Timeline
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{order.timeline && order.timeline.length > 0 ? (
										order.timeline.map((event: any, index: number) => (
											<div
												key={index}
												className="flex gap-3 p-3 rounded-lg border border-gray-100"
											>
												<div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0">
													<div className="w-3 h-3 bg-white rounded-full"></div>
												</div>
												<div className="flex-1">
													<div className="flex items-center justify-between mb-1">
														<h4 className="font-semibold text-gray-900 capitalize">
															{event?.action?.replace?.(/_/g, " ") ||
																"Order Update"}
														</h4>
														<span className="text-xs text-gray-500">
															{formatDateTime(
																event?.createdAt || order.createdAt
															)}
														</span>
													</div>
													<p className="text-sm text-gray-600">
														{event?.details?.description ||
															event?.details?.adminNotes ||
															"Order status updated"}
													</p>
													{event?.details?.previousStatus && (
														<div className="mt-2">
															<Badge className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
																Download Invoice
															</Badge>
														</div>
													)}
												</div>
											</div>
										))
									) : (
										<div className="text-center py-8">
											<Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
											<p className="text-gray-500">
												No timeline events available
											</p>
										</div>
									)}
								</div>
							</CardContent>
						</Card>

						{/* Products Table */}
						<Card className="bg-white rounded-xl border-0 shadow-sm">
							<CardContent className="p-0">
								<div className="overflow-x-auto">
									<table className="w-full">
										<thead className="bg-gray-50">
											<tr>
												<th className="text-left py-4 px-6 font-semibold text-gray-900">
													Product Name
												</th>
												<th className="text-left py-4 px-6 font-semibold text-gray-900">
													Amount
												</th>
												{/* <th className="text-left py-4 px-6 font-semibold text-gray-900">Order ID</th> */}
												<th className="text-left py-4 px-6 font-semibold text-gray-900">
													QTY
												</th>
												<th className="text-left py-4 px-6 font-semibold text-gray-900">
													Order Status
												</th>
												<th className="text-left py-4 px-6 font-semibold text-gray-900">
													Action
												</th>
											</tr>
										</thead>
										<tbody>
											{order.items && order.items.length > 0 ? (
												order.items.map((item: any, index: number) => (
													<tr
														key={index}
														className="border-b border-gray-100 hover:bg-gray-50"
													>
														<td className="py-4 px-6">
															<div className="flex items-center gap-3">
																<div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
																	{item.product?.image ? (
																		<Image
																			src={
																				item.product.image || "/placeholder.svg"
																			}
																			alt={item.product?.name || "Product"}
																			width={48}
																			height={48}
																			className="w-full h-full object-cover rounded-lg"
																			onError={(e) => {
																				(
																					e.target as HTMLImageElement
																				).style.display = "none";
																			}}
																		/>
																	) : (
																		<Package className="w-6 h-6 text-gray-400" />
																	)}
																</div>
																<div>
																	<p className="font-semibold text-gray-900">
																		{item.product?.name || "Unknown Product"}
																	</p>
																	<p className="text-xs text-gray-500">
																		{item.product?.category?.name ||
																			"No Category"}
																	</p>
																</div>
															</div>
														</td>
														<td className="py-4 px-6 font-semibold text-gray-900">
															₦
															{(
																item.price ||
																item.unitPrice ||
																0
															).toLocaleString()}
														</td>
														{/* <td className="py-4 px-6 font-semibold text-gray-900">
                              #{String(order.id).slice(-6)}
                            </td> */}
														<td className="py-4 px-6 font-semibold text-gray-900">
															{item.quantity || 0}
														</td>
														<td className="py-4 px-6">
															<Badge
																className={`px-2 py-1 rounded text-xs font-semibold ${
																	order.status === "DELIVERED" ||
																	order.status === "COMPLETED"
																		? "bg-green-100 text-green-800"
																		: order.status === "PROCESSING"
																		? "bg-yellow-100 text-yellow-800"
																		: order.status === "CANCELLED"
																		? "bg-red-100 text-red-800"
																		: "bg-gray-100 text-gray-800"
																}`}
															>
																{order.status}
															</Badge>
														</td>
														<td className="py-4 px-6">
															<div className="flex gap-2">
																<Button
																	variant="ghost"
																	size="sm"
																	onClick={() =>
																		handleViewProduct(item.product || item)
																	}
																	className="text-green-600 hover:text-green-700 hover:bg-green-50 p-2 rounded"
																>
																	<Eye className="w-7 h-7" />
																</Button>
															</div>
														</td>
													</tr>
												))
											) : (
												<tr>
													<td colSpan={6} className="py-12 text-center">
														<Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
														<p className="text-gray-500">No products found</p>
													</td>
												</tr>
											)}
										</tbody>
									</table>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Right Column - Customer Info and Order Summary */}
					<div className="space-y-6">
						{/* Customer Info */}
						<Card className="bg-white rounded-xl border-0 shadow-sm">
							<CardContent className="p-6">
								<div className="flex items-center gap-4 mb-6">
									<div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
										{profile?.profileImage ? (
											<Image
												src={profile.profileImage || "/placeholder.svg"}
												alt="Customer"
												width={64}
												height={64}
												className="w-full h-full object-cover rounded-full"
												onError={(e) => {
													(e.target as HTMLImageElement).style.display = "none";
												}}
											/>
										) : (
											<User className="w-8 h-8 text-gray-400" />
										)}
									</div>
									<div>
										<h3 className="text-lg font-bold text-gray-900">
											{profile?.fullName ||
												profile?.businessName ||
												customer?.email ||
												"Unknown Customer"}
										</h3>
										<p className="text-sm text-gray-600">
											{customer?.email || "No email"}
										</p>
										<Badge className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-1">
											Active
										</Badge>
									</div>
								</div>

								{/* Shipping Address */}
								<div>
									<h4 className="text-md font-bold text-gray-900 mb-3 flex items-center gap-2">
										<MapPin className="w-4 h-4" />
										Shipping Address
									</h4>
									<div className="space-y-2 text-sm">
										<div>
											<span className="text-gray-500">Primary address:</span>
											<p className="font-semibold text-gray-900">
												{shippingAddress?.fullAddress ||
													profile?.address ||
													"Address not available"}
											</p>
										</div>
										<div className="grid grid-cols-2 gap-2 text-xs">
											<div>
												<span className="text-gray-500">City:</span>
												<p className="font-semibold">
													{shippingAddress?.city || "Lagos"}
												</p>
											</div>
											<div>
												<span className="text-gray-500">State/Province:</span>
												<p className="font-semibold">
													{shippingAddress?.stateProvince || "Lagos Mainland"}
												</p>
											</div>
											<div>
												<span className="text-gray-500">Country:</span>
												<p className="font-semibold">
													{shippingAddress?.country || "Nigeria"}
												</p>
											</div>
											<div>
												<span className="text-gray-500">Post Code:</span>
												<p className="font-semibold">
													{shippingAddress?.postalCode || "101233"}
												</p>
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Order Summary */}
						<Card className="bg-white rounded-xl border-0 shadow-sm">
							<CardHeader>
								<CardTitle className="text-lg font-bold text-gray-900">
									Order Summary
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									<div className="flex justify-between items-center text-sm">
										<span className="text-gray-600">Quantity:</span>
										<span className="font-semibold">
											{order.summary?.totalQuantity || order.items?.length || 0}
										</span>
									</div>
									<div className="flex justify-between items-center text-sm">
										<span className="text-gray-600">Sub Total:</span>
										<span className="font-semibold">
											₦{(order.summary?.itemsSubtotal || 0).toLocaleString()}
										</span>
									</div>
									<div className="flex justify-between items-center text-sm">
										<span className="text-gray-600">Tax:</span>
										<span className="font-semibold">6%</span>
									</div>
									<div className="flex justify-between items-center text-sm">
										<span className="text-gray-600">Shipping Fee:</span>
										<span className="font-semibold">
											₦{(order.summary?.shippingFee || 0).toLocaleString()}
										</span>
									</div>
									<div className="flex justify-between items-center text-sm">
										<span className="text-gray-600">Discount:</span>
										<span className="font-semibold text-red-500">
											-₦{(order.summary?.discount || 0).toLocaleString()}
										</span>
									</div>

									<Separator className="my-3" />

									<div className="flex justify-between items-center">
										<span className="text-lg font-bold text-gray-900">
											Total Amount:
										</span>
										<span className="text-lg font-bold text-gray-900">
											₦{(order.totalPrice || 0).toLocaleString()}
										</span>
									</div>

									<div className="mt-4">
										<PaymentInfoDisplay order={order} />
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>

			{/* Modals */}
			<OrderTrackingModal
				order={order}
				isOpen={trackingModalOpen}
				onClose={() => setTrackingModalOpen(false)}
			/>

			<ProductDetailsModal
				product={selectedProduct}
				isOpen={productModalOpen}
				onClose={() => {
					setProductModalOpen(false);
					setSelectedProduct(null);
				}}
			/>

			<RefundModal
				order={order}
				isOpen={refundModalOpen}
				onClose={() => setRefundModalOpen(false)}
				onRefundSuccess={handleRefundSuccess}
			/>
		</div>
	);
};

export default React.memo(OrderDetails);
