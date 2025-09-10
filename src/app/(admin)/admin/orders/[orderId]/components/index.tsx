// // "use client";
// // import React, { useMemo, useCallback, useState } from "react";
// // import { ViewIcon } from "../../../../../../../public/icons";
// // import Image from "next/image";
// // import { Badge } from "@/components/ui/badge";
// // import { Button } from "@/components/ui/button";
// // import { useGetOrderInfo } from "@/services/orders";
// // import { RefundModal, PaymentInfoDisplay } from "./refund";
// // import { formatDate, formatDateTime } from "@/lib/utils";
// // import { useRouter } from "next/navigation";
// // import httpService from "@/services/httpService";
// // import { routes } from "@/services/api-routes";
// // import {
// // 	Edit,
// // 	RefreshCw,
// // 	Truck,
// // 	Calendar,
// // 	Eye,
// // 	Package,
// // 	CreditCard,
// // 	MapPin,
// // 	User,
// // 	Download,
// // 	CheckCircle,
// // 	Clock,
// // 	AlertCircle,
// // 	X,
// // 	ShoppingCart,
// // } from "lucide-react";
// // import {
// // 	Dialog,
// // 	DialogContent,
// // 	DialogHeader,
// // 	DialogTitle,
// // } from "@/components/ui/dialog";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Separator } from "@/components/ui/separator";
// // import {
// // 	DropdownMenu,
// // 	DropdownMenuContent,
// // 	DropdownMenuItem,
// // 	DropdownMenuTrigger,
// // 	DropdownMenuSeparator,
// // 	DropdownMenuLabel,
// // } from "@/components/ui/dropdown-menu";
// // import { toast } from "sonner";
// // import { useMutation, useQueryClient } from '@tanstack/react-query';
// // import BackButton from "./backbtn";

// // // ✅ Enhanced refund hook 
// // const useProcessRefund = () => {
// // 	const queryClient = useQueryClient();

// // 	return useMutation({
// // 		mutationFn: async (refundData: any) => {
// // 			console.log('🔄 Processing refund request:', refundData);

// // 			const response = await httpService.postData(
// // 				routes.processRefund(refundData.orderId),
// // 				{
// // 					amount: refundData.amount,
// // 					reason: refundData.reason,
// // 					refundType: refundData.refundType,
// // 					breakdown: refundData.breakdown
// // 				}
// // 			);

// // 			return response;
// // 		},
// // 		onSuccess: (data, variables) => {
// // 			console.log('✅ Refund processed successfully:', data);

// // 			// Invalidate relevant queries to refresh data
// // 			queryClient.invalidateQueries({
// // 				queryKey: ['orderInfo', variables.orderId]
// // 			});
// // 			queryClient.invalidateQueries({
// // 				queryKey: ['orders']
// // 			});

// // 			toast.success(`Refund of ₦${data.data.refundAmount.toLocaleString()} processed successfully`);
// // 		},
// // 		onError: (error: any) => {
// // 			console.error('❌ Refund processing failed:', error);

// // 			const errorMessage = error?.response?.data?.error ||
// // 				error?.message ||
// // 				'Failed to process refund';

// // 			toast.error(`Refund failed: ${errorMessage}`);
// // 		}
// // 	});
// // };

// // // ✅ Order actions hook
// // const useOrderActions = (order: any) => {
// // 	const processRefundMutation = useProcessRefund();

// // 	const processRefund = useCallback(async (refundData: any) => {
// // 		if (!order?.id) {
// // 			throw new Error('Order ID is required');
// // 		}

// // 		// Check refund eligibility
// // 		if (order.paymentStatus !== 'PAID') {
// // 			throw new Error(`Order payment status is ${order.paymentStatus}. Only paid orders can be refunded.`);
// // 		}

// // 		if (order.paymentStatus === 'REFUNDED') {
// // 			throw new Error('Order has already been refunded.');
// // 		}

// // 		if (['CANCELLED'].includes(order.status)) {
// // 			throw new Error('Cancelled orders cannot be refunded.');
// // 		}

// // 		return processRefundMutation.mutateAsync({
// // 			...refundData,
// // 			orderId: order.id
// // 		});
// // 	}, [order?.id, order?.paymentStatus, order?.status, processRefundMutation]);

// // 	const refundEligibility = useMemo(() => {
// // 		if (!order) return { canRefund: false, reason: 'Order not found' };

// // 		if (order.paymentStatus !== 'PAID') {
// // 			return {
// // 				canRefund: false,
// // 				reason: `Order payment status is ${order.paymentStatus}. Only paid orders can be refunded.`
// // 			};
// // 		}

// // 		if (order.paymentStatus === 'REFUNDED') {
// // 			return {
// // 				canRefund: false,
// // 				reason: 'Order has already been refunded.'
// // 			};
// // 		}

// // 		if (['CANCELLED'].includes(order.status)) {
// // 			return {
// // 				canRefund: false,
// // 				reason: 'Cancelled orders cannot be refunded.'
// // 			};
// // 		}

// // 		return { canRefund: true, reason: null };
// // 	}, [order]);

// // 	return {
// // 		processRefund,
// // 		isProcessingRefund: processRefundMutation.isPending,
// // 		refundError: processRefundMutation.error,
// // 		refundEligibility,
// // 	};
// // };

// // // Product Details Modal Component
// // const ProductDetailsModal = React.memo(
// // 	({
// // 		product,
// // 		onClose,
// // 		isOpen,
// // 	}: {
// // 		product: any;
// // 		onClose: () => void;
// // 		isOpen: boolean;
// // 	}) => {
// // 		if (!product) return null;

// // 		return (
// // 			<Dialog open={isOpen} onOpenChange={onClose}>
// // 				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl border-0 shadow-2xl">
// // 					<DialogHeader className="border-b border-gray-100 pb-4">
// // 						<DialogTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900">
// // 							<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
// // 								<Package className="w-5 h-5 text-white" />
// // 							</div>
// // 							Product Details
// // 						</DialogTitle>
// // 					</DialogHeader>
// // 					<div className="space-y-6 pt-4">
// // 						<div className="flex gap-6">
// // 							<div className="w-32 h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center overflow-hidden">
// // 								{product.image ? (
// // 									<Image
// // 										src={product.image || "/placeholder.svg"}
// // 										alt={product.name}
// // 										width={128}
// // 										height={128}
// // 										className="w-full h-full object-cover rounded-2xl"
// // 										onError={(e) => {
// // 											(e.target as HTMLImageElement).style.display = "none";
// // 										}}
// // 									/>
// // 								) : (
// // 									<Package className="w-12 h-12 text-gray-400" />
// // 								)}
// // 							</div>
// // 							<div className="flex-1">
// // 								<h3 className="text-2xl font-bold text-gray-900 mb-3">
// // 									{product.name}
// // 								</h3>
// // 								<p className="text-gray-600 mb-6 leading-relaxed">
// // 									{product.shortDescription}
// // 								</p>
// // 								<div className="grid grid-cols-2 gap-6">
// // 									<div className="space-y-1">
// // 										<span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
// // 											Category
// // 										</span>
// // 										<p className="text-lg font-semibold text-gray-900">
// // 											{product.category?.name || "N/A"}
// // 										</p>
// // 									</div>
// // 									<div className="space-y-1">
// // 										<span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
// // 											Manufacturer
// // 										</span>
// // 										<p className="text-lg font-semibold text-gray-900">
// // 											{product.manufacturer?.name || "N/A"}
// // 										</p>
// // 									</div>
// // 									<div className="space-y-1">
// // 										<span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
// // 											Processing Time
// // 										</span>
// // 										<p className="text-lg font-semibold text-gray-900">
// // 											{product.processingTime || "N/A"} days
// // 										</p>
// // 									</div>
// // 									<div className="space-y-1">
// // 										<span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
// // 											Returns
// // 										</span>
// // 										<p className="text-lg font-semibold text-gray-900">
// // 											{product.acceptsReturns ? "Accepted" : "Not Accepted"}
// // 										</p>
// // 									</div>
// // 								</div>
// // 							</div>
// // 						</div>
// // 						<div className="flex justify-end pt-6 border-t border-gray-100">
// // 							<Button
// // 								onClick={onClose}
// // 								className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-8 py-3 rounded-xl font-semibold"
// // 							>
// // 								Close
// // 							</Button>
// // 						</div>
// // 					</div>
// // 				</DialogContent>
// // 			</Dialog>
// // 		);
// // 	}
// // );
// // ProductDetailsModal.displayName = "ProductDetailsModal";

// // // Order Tracking Modal Component
// // const OrderTrackingModal = React.memo(
// // 	({
// // 		order,
// // 		onClose,
// // 		isOpen,
// // 	}: {
// // 		order: any;
// // 		onClose: () => void;
// // 		isOpen: boolean;
// // 	}) => {
// // 		if (!order) return null;

// // 		const getTrackingSteps = useCallback(
// // 			(status: string, paymentStatus: string) => {
// // 				const steps = [
// // 					{
// // 						id: 1,
// // 						name: "Order Placed",
// // 						status: "completed",
// // 						icon: <CheckCircle className="w-6 h-6" />,
// // 						description: "Order has been confirmed",
// // 					},
// // 					{
// // 						id: 2,
// // 						name: "Payment",
// // 						status: paymentStatus === "PAID" ? "completed" : "current",
// // 						icon: <CreditCard className="w-6 h-6" />,
// // 						description: "Payment processing",
// // 					},
// // 					{
// // 						id: 3,
// // 						name: "Processing",
// // 						status:
// // 							status === "PROCESSING"
// // 								? "current"
// // 								: ["SHIPPED", "DELIVERED", "COMPLETED"].includes(status)
// // 									? "completed"
// // 									: "pending",
// // 						icon: <Package className="w-6 h-6" />,
// // 						description: "Order is being prepared",
// // 					},
// // 					{
// // 						id: 4,
// // 						name: "Shipped",
// // 						status:
// // 							status === "SHIPPED"
// // 								? "current"
// // 								: ["DELIVERED", "COMPLETED"].includes(status)
// // 									? "completed"
// // 									: "pending",
// // 						icon: <Truck className="w-6 h-6" />,
// // 						description: "Order is on the way",
// // 					},
// // 					{
// // 						id: 5,
// // 						name: "Delivered",
// // 						status: ["DELIVERED", "COMPLETED"].includes(status)
// // 							? "completed"
// // 							: "pending",
// // 						icon: <CheckCircle className="w-6 h-6" />,
// // 						description: "Order has been delivered",
// // 					},
// // 				];
// // 				return steps;
// // 			},
// // 			[]
// // 		);

// // 		const trackingSteps = useMemo(
// // 			() => getTrackingSteps(order.status, order.paymentStatus),
// // 			[order.status, order.paymentStatus, getTrackingSteps]
// // 		);

// // 		return (
// // 			<Dialog open={isOpen} onOpenChange={onClose}>
// // 				<DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl border-0 shadow-2xl">
// // 					<DialogHeader className="border-b border-gray-100 pb-6">
// // 						<DialogTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900">
// // 							<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
// // 								<Truck className="w-6 h-6 text-white" />
// // 							</div>
// // 							Order Tracking
// // 						</DialogTitle>
// // 					</DialogHeader>
// // 					<div className="space-y-8 pt-6">
// // 						{/* Progress Tracker */}
// // 						<div className="mb-10">
// // 							<div className="flex items-center justify-between relative">
// // 								<div className="absolute top-6 left-12 right-12 h-1 bg-gray-100 rounded-full z-0"></div>
// // 								<div
// // 									className="absolute top-6 left-12 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full z-0 transition-all duration-1000 ease-out"
// // 									style={{
// // 										width: `${(() => {
// // 											const completedSteps = trackingSteps.filter(
// // 												(step) => step.status === "completed"
// // 											).length;
// // 											const totalGaps = trackingSteps.length - 1;
// // 											return Math.max(
// // 												0,
// // 												((completedSteps - 1) / totalGaps) * 100
// // 											);
// // 										})()}%`,
// // 									}}
// // 								/>
// // 								{trackingSteps.map((step, index) => (
// // 									<div
// // 										key={step.id}
// // 										className="flex flex-col items-center relative z-10 bg-white px-3"
// // 									>
// // 										<div
// // 											className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-lg transition-all duration-500 ${step.status === "completed"
// // 												? "bg-gradient-to-br from-green-500 to-emerald-600 text-white scale-110"
// // 												: step.status === "current"
// // 													? "bg-gradient-to-br from-blue-500 to-purple-600 text-white scale-110 animate-pulse"
// // 													: "bg-gray-100 text-gray-400"
// // 												}`}
// // 										>
// // 											{step.icon}
// // 										</div>
// // 										<span
// // 											className={`text-sm text-center font-bold max-w-24 leading-tight ${step.status === "completed" || step.status === "current"
// // 												? "text-gray-900"
// // 												: "text-gray-400"
// // 												}`}
// // 										>
// // 											{step.name}
// // 										</span>
// // 										<span className="text-xs text-gray-500 text-center max-w-28 mt-2 leading-tight">
// // 											{step.description}
// // 										</span>
// // 									</div>
// // 								))}
// // 							</div>
// // 						</div>

// // 						{/* Order Details Grid */}
// // 						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
// // 							<div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
// // 								<h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
// // 									<div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
// // 										<Package className="w-4 h-4 text-white" />
// // 									</div>
// // 									Order Information
// // 								</h3>
// // 								<div className="space-y-4">
// // 									<div className="flex justify-between items-center">
// // 										<span className="text-gray-600 font-medium">Order ID:</span>
// // 										<span className="font-bold text-gray-900">#{order.id}</span>
// // 									</div>
// // 									<div className="flex justify-between items-center">
// // 										<span className="text-gray-600 font-medium">Date:</span>
// // 										<span className="font-bold text-gray-900">
// // 											{formatDate(order.createdAt)}
// // 										</span>
// // 									</div>
// // 									<div className="flex justify-between items-center">
// // 										<span className="text-gray-600 font-medium">Status:</span>
// // 										<Badge
// // 											className={`px-3 py-1 rounded-full font-semibold ${order.status === "DELIVERED"
// // 												? "bg-green-100 text-green-800"
// // 												: "bg-yellow-100 text-yellow-800"
// // 												}`}
// // 										>
// // 											{order.status}
// // 										</Badge>
// // 									</div>
// // 									<div className="flex justify-between items-center">
// // 										<span className="text-gray-600 font-medium">
// // 											Total Amount:
// // 										</span>
// // 										<span className="font-bold text-xl text-gray-900">
// // 											₦{(order.totalPrice || 0).toLocaleString()}
// // 										</span>
// // 									</div>
// // 								</div>
// // 							</div>

// // 							<div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
// // 								<h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
// // 									<div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center">
// // 										<Truck className="w-4 h-4 text-white" />
// // 									</div>
// // 									Shipping Information
// // 								</h3>
// // 								<div className="space-y-4">
// // 									{order.shipping && (
// // 										<>
// // 											<div className="flex justify-between items-center">
// // 												<span className="text-gray-600 font-medium">
// // 													Distance:
// // 												</span>
// // 												<span className="font-bold text-gray-900">
// // 													{order.shipping.distance} km
// // 												</span>
// // 											</div>
// // 											<div className="flex justify-between items-center">
// // 												<span className="text-gray-600 font-medium">
// // 													Shipping Fee:
// // 												</span>
// // 												<span className="font-bold text-gray-900">
// // 													₦
// // 													{(
// // 														order.shipping.totalShippingFee || 0
// // 													).toLocaleString()}
// // 												</span>
// // 											</div>
// // 										</>
// // 									)}
// // 									<div className="flex justify-between items-center">
// // 										<span className="text-gray-600 font-medium">
// // 											Estimated Delivery:
// // 										</span>
// // 										<span className="font-bold text-gray-900">
// // 											{(() => {
// // 												const date = new Date(order.createdAt);
// // 												date.setDate(date.getDate() + 7);
// // 												return formatDate(date.toISOString());
// // 											})()}
// // 										</span>
// // 									</div>
// // 								</div>
// // 							</div>
// // 						</div>

// // 						<div className="flex justify-end pt-6 border-t border-gray-100">
// // 							<Button
// // 								onClick={onClose}
// // 								className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg"
// // 							>
// // 								Close
// // 							</Button>
// // 						</div>
// // 					</div>
// // 				</DialogContent>
// // 			</Dialog>
// // 		);
// // 	}
// // );
// // OrderTrackingModal.displayName = "OrderTrackingModal";

// // // Type definitions
// // interface OrderStatus {
// // 	variant: "default" | "secondary" | "destructive" | "outline";
// // 	text: string;
// // }

// // interface StatusTransition {
// // 	value: string;
// // 	label: string;
// // 	icon: React.ComponentType<{ className?: string }>;
// // 	color: string;
// // }

// // // Enhanced order data type matching your backend response
// // interface ProcessedOrderData {
// // 	id: any;
// // 	orderId?: string;
// // 	status: string;
// // 	totalPrice: number;
// // 	createdAt: string;
// // 	updatedAt?: string;
// // 	paymentStatus: string;
// // 	orderType?: string;
// // 	user: any;
// // 	items: any[];
// // 	timeline: any[];
// // 	shipping: any;
// // 	breakdown: any;
// // 	summary: any;
// // 	transactions?: any[];
// // 	adminAlerts?: any[];
// // 	notes?: any[];
// // 	// Payment fields from your controller
// // 	amountPaid?: number;
// // 	amountDue?: number;
// // 	[key: string]: any;
// // }

// // // Main Order Details Component
// // interface OrderDetailsProps {
// // 	orderId?: string;
// // 	setClose?: React.Dispatch<React.SetStateAction<boolean>>;
// // 	isModal?: boolean;
// // }

// // const OrderDetails: React.FC<OrderDetailsProps> = ({
// // 	orderId,
// // 	setClose,
// // 	isModal = false,
// // }) => {
// // 	const router = useRouter();
// // 	const [trackingModalOpen, setTrackingModalOpen] = useState(false);
// // 	const [productModalOpen, setProductModalOpen] = useState(false);
// // 	const [selectedProduct, setSelectedProduct] = useState(null);
// // 	const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
// // 	const [refundModalOpen, setRefundModalOpen] = useState(false);

// // 	// Validate orderId before proceeding
// // 	if (!orderId) {
// // 		return (
// // 			<div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
// // 				<div className="text-center max-w-md mx-auto">
// // 					<div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
// // 						<AlertCircle className="w-10 h-10 text-red-600" />
// // 					</div>
// // 					<h2 className="text-2xl font-bold text-gray-900 mb-3">
// // 						Invalid Order ID
// // 					</h2>
// // 					<p className="text-gray-600 mb-8">
// // 						No order ID was provided. Please check the URL and try again.
// // 					</p>
// // 					<Button
// // 						onClick={() => router.back()}
// // 						className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold"
// // 					>
// // 						{isModal ? "Close" : "Go Back"}
// // 					</Button>
// // 				</div>
// // 			</div>
// // 		);
// // 	}

// // 	const {
// // 		getOrderInfoData: rawData,
// // 		getOrderInfoIsLoading,
// // 		getOrderInfoError,
// // 		refetchOrderInfo,
// // 	} = useGetOrderInfo({
// // 		enabled: Boolean(orderId),
// // 		orderId: orderId,
// // 	} as any);

// // 	// Memoized processed data based on your controller's response structure
// // 	const processedOrderData = useMemo((): ProcessedOrderData | null => {
// // 		if (!rawData) return null;

// // 		return {
// // 			...rawData,
// // 			id: rawData.id,
// // 			orderId:
// // 				rawData.orderId || `#${String(rawData.id || "").padStart(6, "0")}`,
// // 			status: rawData.status || "PENDING",
// // 			totalPrice: Number(rawData.totalPrice) || 0,
// // 			createdAt: rawData.createdAt || new Date().toISOString(),
// // 			paymentStatus: rawData.paymentStatus || "PENDING",
// // 			orderType: rawData.orderType || "IMMEDIATE",
// // 			items: Array.isArray(rawData.items) ? rawData.items : [],
// // 			timeline: Array.isArray(rawData.timeline) ? rawData.timeline : [],
// // 			user: rawData.user || {},
// // 			summary: rawData.summary || {},
// // 			breakdown: rawData.breakdown || {},
// // 			shipping: rawData.shipping || null,
// // 			transactions: rawData.transactions || [],
// // 			adminAlerts: rawData.adminAlerts || [],
// // 			notes: rawData.notes || [],
// // 			amountPaid: rawData.amountPaid || rawData.breakdown?.amountPaid || 0,
// // 			amountDue: rawData.amountDue || rawData.breakdown?.amountDue || 0,
// // 		};
// // 	}, [rawData]);

// // 	// ✅ Use order actions hook with the processed data
// // 	const { processRefund, isProcessingRefund, refundEligibility } = useOrderActions(processedOrderData);

// // 	// Helper functions for safe property access
// // 	const getAmountPaid = useCallback((orderData: any): number => {
// // 		return typeof orderData?.amountPaid === "number"
// // 			? orderData.amountPaid
// // 			: typeof orderData?.breakdown?.amountPaid === "number"
// // 				? orderData.breakdown.amountPaid
// // 				: 0;
// // 	}, []);

// // 	const getAmountDue = useCallback((orderData: any): number => {
// // 		return typeof orderData?.amountDue === "number"
// // 			? orderData.amountDue
// // 			: typeof orderData?.breakdown?.amountDue === "number"
// // 				? orderData.breakdown.amountDue
// // 				: 0;
// // 	}, []);

// // 	// Determine payment type and schedule based on available data
// // 	const getPaymentInfo = useCallback(
// // 		(order: any) => {
// // 			const paymentStatus = order.paymentStatus || "PENDING";
// // 			const orderType = order.orderType || "IMMEDIATE";

// // 			// Determine if it's pay on delivery based on amount due vs total
// // 			const totalPrice = order.totalPrice || 0;
// // 			const amountPaid = getAmountPaid(order);
// // 			const amountDue = getAmountDue(order);

// // 			const isPayOnDelivery =
// // 				amountDue === totalPrice &&
// // 				amountPaid === 0 &&
// // 				paymentStatus === "PENDING";
// // 			const requiresImmediatePayment =
// // 				paymentStatus === "PENDING" && !isPayOnDelivery;
// // 			const isScheduled =
// // 				orderType === "SCHEDULED" || Boolean(order.scheduledDeliveryDate);

// // 			return {
// // 				paymentStatus,
// // 				orderType,
// // 				isPayOnDelivery,
// // 				requiresImmediatePayment,
// // 				isScheduled,
// // 				method: isPayOnDelivery ? "Pay on Delivery" : "Online Payment",
// // 			};
// // 		},
// // 		[getAmountPaid, getAmountDue]
// // 	);

// // 	// Memoized callbacks to prevent infinite loops
// // 	const handleViewProduct = useCallback((product: any) => {
// // 		setSelectedProduct(product);
// // 		setProductModalOpen(true);
// // 	}, []);

// // 	const handleOpenTrackingModal = useCallback(() => {
// // 		setTrackingModalOpen(true);
// // 	}, []);

// // 	const handleClose = useCallback(() => {
// // 		if (setClose) {
// // 			setClose(false);
// // 		} else {
// // 			router.back();
// // 		}
// // 	}, [setClose, router]);

// // 	const handleStatusUpdate = useCallback(
// // 		async (newStatus: string) => {
// // 			if (!orderId) {
// // 				toast.error("No order ID available");
// // 				return;
// // 			}

// // 			setIsUpdatingStatus(true);
// // 			try {
// // 				const response = await httpService.patchData(
// // 					routes.updateOrderStatus(orderId),
// // 					{
// // 						status: newStatus,
// // 						notes: `Status updated to ${newStatus} via admin panel`,
// // 					}
// // 				);

// // 				if (refetchOrderInfo) {
// // 					await refetchOrderInfo();
// // 				}

// // 				toast.success(`Order status successfully updated to ${newStatus}`);
// // 			} catch (error: any) {
// // 				console.error("Failed to update order status:", error);
// // 				toast.error(
// // 					`Failed to update order status: ${error?.message || "Unknown error"}`
// // 				);
// // 			} finally {
// // 				setIsUpdatingStatus(false);
// // 			}
// // 		},
// // 		[orderId, refetchOrderInfo]
// // 	);

// // 	const handleRefundSuccess = useCallback(() => {
// // 		// Custom logic after successful refund
// // 		console.log("Refund completed successfully");
// // 		// Refresh order data
// // 		if (refetchOrderInfo) {
// // 			refetchOrderInfo();
// // 		}
// // 		// Optional: Show additional success message or redirect
// // 		toast.success("Order refunded and data refreshed");
// // 	}, [refetchOrderInfo]);

// // 	const handleRetry = useCallback(() => {
// // 		if (refetchOrderInfo) {
// // 			refetchOrderInfo();
// // 		}
// // 	}, [refetchOrderInfo]);

// // 	// Memoized shipping address calculation
// // 	const shippingAddress = useMemo(() => {
// // 		if (!processedOrderData) return null;

// // 		// Look for shipping address in timeline or user profile
// // 		const orderCreatedEvent = processedOrderData.timeline?.find(
// // 			(event: any) =>
// // 				event?.action === "ORDER_CREATED" && event?.details?.shippingAddress
// // 		);

// // 		if (orderCreatedEvent?.details?.shippingAddress) {
// // 			return orderCreatedEvent.details.shippingAddress;
// // 		}

// // 		// Fallback to user profile address
// // 		const user = processedOrderData.user;
// // 		if (user?.profile?.address || user?.businessProfile?.businessAddress) {
// // 			return {
// // 				fullAddress:
// // 					user.profile?.address || user.businessProfile?.businessAddress,
// // 				city: "N/A",
// // 				stateProvince: "N/A",
// // 				country: "Nigeria",
// // 				postalCode: "N/A",
// // 			};
// // 		}

// // 		return null;
// // 	}, [processedOrderData]);

// // 	// Memoized status info
// // 	const statusInfo = useMemo(() => {
// // 		if (!processedOrderData)
// // 			return { variant: "secondary" as const, text: "Unknown" };

// // 		const statusMap: Record<string, OrderStatus> = {
// // 			PENDING: { variant: "secondary" as const, text: "Pending" },
// // 			SCHEDULED: { variant: "secondary" as const, text: "Scheduled" },
// // 			PROCESSING: { variant: "default" as const, text: "Processing" },
// // 			ONGOING: { variant: "default" as const, text: "Ongoing" },
// // 			SHIPPED: { variant: "default" as const, text: "Shipped" },
// // 			DELIVERED: { variant: "default" as const, text: "Delivered" },
// // 			COMPLETED: { variant: "default" as const, text: "Completed" },
// // 			CANCELLED: { variant: "destructive" as const, text: "Cancelled" },
// // 		};

// // 		return (
// // 			statusMap[processedOrderData.status] || {
// // 				variant: "secondary" as const,
// // 				text: processedOrderData.status,
// // 			}
// // 		);
// // 	}, [processedOrderData]);

// // 	// Memoized available transitions
// // 	const availableTransitions = useMemo(() => {
// // 		if (!processedOrderData) return [];

// // 		const statusTransitions: Record<string, StatusTransition[]> = {
// // 			PENDING: [
// // 				{
// // 					value: "PROCESSING",
// // 					label: "Start Processing",
// // 					icon: Package,
// // 					color: "text-blue-600",
// // 				},
// // 				{
// // 					value: "CANCELLED",
// // 					label: "Cancel Order",
// // 					icon: X,
// // 					color: "text-red-600",
// // 				},
// // 			],
// // 			SCHEDULED: [
// // 				{
// // 					value: "PENDING",
// // 					label: "Mark as Pending",
// // 					icon: Clock,
// // 					color: "text-orange-600",
// // 				},
// // 				{
// // 					value: "PROCESSING",
// // 					label: "Start Processing",
// // 					icon: Package,
// // 					color: "text-blue-600",
// // 				},
// // 				{
// // 					value: "CANCELLED",
// // 					label: "Cancel Order",
// // 					icon: X,
// // 					color: "text-red-600",
// // 				},
// // 			],
// // 			PROCESSING: [
// // 				{
// // 					value: "SHIPPED",
// // 					label: "Mark as Shipped",
// // 					icon: Truck,
// // 					color: "text-purple-600",
// // 				},
// // 				{
// // 					value: "COMPLETED",
// // 					label: "Mark as Completed",
// // 					icon: CheckCircle,
// // 					color: "text-green-600",
// // 				},
// // 				{
// // 					value: "CANCELLED",
// // 					label: "Cancel Order",
// // 					icon: X,
// // 					color: "text-red-600",
// // 				},
// // 			],
// // 			ONGOING: [
// // 				{
// // 					value: "PROCESSING",
// // 					label: "Start Processing",
// // 					icon: Package,
// // 					color: "text-blue-600",
// // 				},
// // 				{
// // 					value: "SHIPPED",
// // 					label: "Mark as Shipped",
// // 					icon: Truck,
// // 					color: "text-purple-600",
// // 				},
// // 				{
// // 					value: "DELIVERED",
// // 					label: "Mark as Delivered",
// // 					icon: CheckCircle,
// // 					color: "text-green-600",
// // 				},
// // 			],
// // 			SHIPPED: [
// // 				{
// // 					value: "DELIVERED",
// // 					label: "Mark as Delivered",
// // 					icon: CheckCircle,
// // 					color: "text-green-600",
// // 				},
// // 			],
// // 			DELIVERED: [
// // 				{
// // 					value: "COMPLETED",
// // 					label: "Complete Order",
// // 					icon: CheckCircle,
// // 					color: "text-green-600",
// // 				},
// // 			],
// // 			CANCELLED: [],
// // 			COMPLETED: [],
// // 		};

// // 		return statusTransitions[processedOrderData.status] || [];
// // 	}, [processedOrderData]);

// // 	// ✅ Helper function for timeline event descriptions
// // 	const getEventDescription = (action: string): string => {
// // 		const descriptions: Record<string, string> = {
// // 			'ORDER_CREATED': 'Order has been placed and confirmed',
// // 			'PAYMENT_RECEIVED': 'Payment has been successfully processed',
// // 			'PAYMENT_PENDING': 'Waiting for payment confirmation',
// // 			'ORDER_PROCESSING': 'Order is being prepared for shipment',
// // 			'ORDER_SHIPPED': 'Order has been shipped to customer',
// // 			'ORDER_DELIVERED': 'Order has been successfully delivered',
// // 			'ORDER_CANCELLED': 'Order has been cancelled',
// // 			'STATUS_UPDATED': 'Order status has been updated by admin',
// // 			'REFUND_PROCESSED': 'Refund has been processed for this order'
// // 		};

// // 		return descriptions[action] || 'Order status updated';
// // 	};

// // 	// Loading state
// // 	if (getOrderInfoIsLoading) {
// // 		return (
// // 			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
// // 				<div className="text-center">
// // 					<div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
// // 						<div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
// // 					</div>
// // 					<p className="text-xl font-bold text-gray-900 mb-2">
// // 						Loading order details...
// // 					</p>
// // 					<p className="text-sm text-gray-600">Order #{orderId}</p>
// // 				</div>
// // 			</div>
// // 		);
// // 	}

// // 	// Error state
// // 	if (getOrderInfoError) {
// // 		return (
// // 			<div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
// // 				<div className="text-center max-w-md mx-auto">
// // 					<div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
// // 						<AlertCircle className="w-10 h-10 text-red-600" />
// // 					</div>
// // 					<h2 className="text-2xl font-bold text-gray-900 mb-3">
// // 						Error Loading Order
// // 					</h2>
// // 					<p className="text-gray-600 mb-8">{getOrderInfoError}</p>
// // 					<div className="flex gap-4 justify-center">
// // 						<Button
// // 							variant="outline"
// // 							onClick={handleClose}
// // 							className="px-6 py-3 rounded-xl font-semibold"
// // 						>
// // 							{isModal ? "Close" : "Go Back"}
// // 						</Button>
// // 						<Button
// // 							onClick={handleRetry}
// // 							className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold"
// // 						>
// // 							<RefreshCw className="w-4 h-4 mr-2" />
// // 							Try Again
// // 						</Button>
// // 					</div>
// // 				</div>
// // 			</div>
// // 		);
// // 	}

// // 	// Empty state
// // 	if (!processedOrderData) {
// // 		return (
// // 			<div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
// // 				<div className="text-center max-w-md mx-auto">
// // 					<div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
// // 						<Package className="w-10 h-10 text-gray-400" />
// // 					</div>
// // 					<h2 className="text-2xl font-bold text-gray-900 mb-3">
// // 						Order Not Found
// // 					</h2>
// // 					<p className="text-gray-600 mb-8">
// // 						The order #{orderId} could not be found.
// // 					</p>
// // 					<div className="flex gap-4 justify-center">
// // 						<Button
// // 							variant="outline"
// // 							onClick={handleClose}
// // 							className="px-6 py-3 rounded-xl font-semibold"
// // 						>
// // 							{isModal ? "Close" : "Go Back"}
// // 						</Button>
// // 						<Button
// // 							onClick={handleRetry}
// // 							className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold"
// // 						>
// // 							<RefreshCw className="w-4 h-4 mr-2" />
// // 							Try Again
// // 						</Button>
// // 					</div>
// // 				</div>
// // 			</div>
// // 		);
// // 	}

// // 	// At this point, we have valid data
// // 	const order = processedOrderData;
// // 	const customer = order.user;
// // 	const profile = customer?.profile || customer?.businessProfile;
// // 	const paymentInfo = getPaymentInfo(order);

// // 	return (
// // 		<div className="min-h-screen bg-gray-50 p-6">
// // 			<div className="max-w-7xl mx-auto">
// // 				<BackButton />
// // 				{/* Main Content Grid */}
// // 				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
// // 					{/* Left Column */}
// // 					<div className="lg:col-span-2 space-y-8">
// // 						{/* Header with Order ID and Actions */}
// // 						<div className="flex items-center justify-between">
// // 							<div className="flex items-center gap-4">
// // 								<h1 className="text-2xl font-bold text-gray-900">
// // 									Order# {order.orderId || order.id}
// // 								</h1>
// // 								<Badge
// // 									className={`px-3 py-1 rounded-lg text-sm font-semibold ${statusInfo.variant === "default"
// // 										? "bg-green-100 text-green-800"
// // 										: statusInfo.variant === "destructive"
// // 											? "bg-red-100 text-red-800"
// // 											: "bg-yellow-100 text-yellow-800"
// // 										}`}
// // 								>
// // 									{statusInfo.text}
// // 								</Badge>
// // 								<Badge className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-semibold">
// // 									{paymentInfo.orderType}
// // 								</Badge>
// // 							</div>

// // 							<div className="flex gap-3">
// // 								<Button
// // 									variant="outline"
// // 									onClick={() => setRefundModalOpen(true)}
// // 									disabled={
// // 										isProcessingRefund ||
// // 										!refundEligibility.canRefund
// // 									}
// // 									className="px-4 py-2 rounded-lg font-semibold border hover:bg-gray-50"
// // 								>
// // 									{isProcessingRefund ? (
// // 										<>
// // 											<RefreshCw className="w-4 h-4 mr-2 animate-spin" />
// // 											Processing...
// // 										</>
// // 									) : (
// // 										"Refund"
// // 									)}
// // 								</Button>

// // 								{/* Status Update Dropdown */}
// // 								<DropdownMenu>
// // 									<DropdownMenuTrigger asChild>
// // 										<Button
// // 											className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg"
// // 											disabled={
// // 												isUpdatingStatus || availableTransitions.length === 0
// // 											}
// // 										>
// // 											{isUpdatingStatus ? (
// // 												<>
// // 													<RefreshCw className="w-4 h-4 animate-spin mr-2" />
// // 													Updating...
// // 												</>
// // 											) : (
// // 												"Edit order"
// // 											)}
// // 										</Button>
// // 									</DropdownMenuTrigger>
// // 									<DropdownMenuContent
// // 										align="end"
// // 										className="w-64 bg-white rounded-lg border shadow-lg"
// // 									>
// // 										<DropdownMenuLabel className="flex items-center gap-2 text-gray-900 font-bold py-3">
// // 											<ShoppingCart className="w-4 h-4" />
// // 											Update Order Status
// // 										</DropdownMenuLabel>
// // 										<DropdownMenuSeparator />
// // 										<div className="px-3 py-2 text-xs text-gray-500 font-semibold">
// // 											Current:{" "}
// // 											<span className="font-bold text-gray-700">
// // 												{statusInfo.text}
// // 											</span>
// // 										</div>
// // 										<DropdownMenuSeparator />
// // 										{availableTransitions.length === 0 ? (
// // 											<div className="px-3 py-3 text-sm text-gray-500 italic">
// // 												No status changes available
// // 											</div>
// // 										) : (
// // 											availableTransitions.map((transition) => {
// // 												const IconComponent = transition.icon;
// // 												return (
// // 													<DropdownMenuItem
// // 														key={transition.value}
// // 														onClick={() => handleStatusUpdate(transition.value)}
// // 														className="flex items-center gap-3 cursor-pointer py-3 px-3 rounded-lg mx-1 my-1 hover:bg-gray-50"
// // 													>
// // 														<IconComponent
// // 															className={`w-4 h-4 ${transition.color}`}
// // 														/>
// // 														<span className="font-semibold">
// // 															{transition.label}
// // 														</span>
// // 													</DropdownMenuItem>
// // 												);
// // 											})
// // 										)}
// // 									</DropdownMenuContent>
// // 								</DropdownMenu>
// // 							</div>
// // 						</div>

// // 						{/* Order Progress Bar */}
// // 						<Card className="bg-white rounded-xl border-0 shadow-sm">
// // 							<CardContent className="p-6">
// // 								<h3 className="text-lg font-bold text-gray-900 mb-6">
// // 									Order Progress
// // 								</h3>
// // 								<div className="relative mb-8">
// // 									{/* Background progress line */}
// // 									<div className="absolute top-6 left-0 right-0 h-2 bg-gray-100 rounded-full z-0"></div>
// // 									{/* Active progress line */}
// // 									<div
// // 										className="absolute top-6 left-0 h-2 bg-green-500 rounded-full z-0 transition-all duration-1000 ease-out"
// // 										style={{
// // 											width: `${(() => {
// // 												const steps = [
// // 													{ key: "ORDER_PLACED", completed: true },
// // 													{
// // 														key: "PAYMENT",
// // 														completed: order.paymentStatus === "PAID",
// // 													},
// // 													{
// // 														key: "PROCESSING",
// // 														completed: [
// // 															"PROCESSING",
// // 															"ONGOING",
// // 															"SHIPPED",
// // 															"DELIVERED",
// // 															"COMPLETED",
// // 														].includes(order.status),
// // 													},
// // 													{
// // 														key: "SHIPPING",
// // 														completed: [
// // 															"SHIPPED",
// // 															"DELIVERED",
// // 															"COMPLETED",
// // 														].includes(order.status),
// // 													},
// // 													{
// // 														key: "DELIVERED",
// // 														completed: ["DELIVERED", "COMPLETED"].includes(
// // 															order.status
// // 														),
// // 													},
// // 												];
// // 												const completedSteps = steps.filter(
// // 													(step) => step.completed
// // 												).length;
// // 												return Math.max(0, (completedSteps - 1) * 25); // 25% for each step
// // 											})()}%`,
// // 										}}
// // 									/>

// // 									{/* Progress steps */}
// // 									<div className="relative z-10 flex items-center justify-between">
// // 										{[
// // 											{
// // 												label: "Order Confirmed",
// // 												status: "completed",
// // 												isActive: true,
// // 											},
// // 											{
// // 												label: "Payment Pending",
// // 												status:
// // 													order.paymentStatus === "PAID"
// // 														? "completed"
// // 														: "current",
// // 												isActive: order.paymentStatus === "PAID",
// // 											},
// // 											{
// // 												label: "Processing",
// // 												status: ["PROCESSING", "ONGOING"].includes(order.status)
// // 													? "current"
// // 													: ["SHIPPED", "DELIVERED", "COMPLETED"].includes(
// // 														order.status
// // 													)
// // 														? "completed"
// // 														: "pending",
// // 												isActive: [
// // 													"PROCESSING",
// // 													"ONGOING",
// // 													"SHIPPED",
// // 													"DELIVERED",
// // 													"COMPLETED",
// // 												].includes(order.status),
// // 											},
// // 											{
// // 												label: "Shipping",
// // 												status:
// // 													order.status === "SHIPPED"
// // 														? "current"
// // 														: ["DELIVERED", "COMPLETED"].includes(order.status)
// // 															? "completed"
// // 															: "pending",
// // 												isActive: [
// // 													"SHIPPED",
// // 													"DELIVERED",
// // 													"COMPLETED",
// // 												].includes(order.status),
// // 											},
// // 											{
// // 												label: "Delivered",
// // 												status: ["DELIVERED", "COMPLETED"].includes(
// // 													order.status
// // 												)
// // 													? "completed"
// // 													: "pending",
// // 												isActive: ["DELIVERED", "COMPLETED"].includes(
// // 													order.status
// // 												),
// // 											},
// // 										].map((step, index) => (
// // 											<div
// // 												key={index}
// // 												className="flex flex-col items-center bg-white"
// // 											>
// // 												<div
// // 													className={`w-12 h-12 rounded-full mb-2 transition-all duration-500 flex items-center justify-center ${step.status === "completed"
// // 														? "bg-green-500 text-white"
// // 														: step.status === "current"
// // 															? "bg-yellow-500 text-white"
// // 															: "bg-gray-200 text-gray-400"
// // 														}`}
// // 												>
// // 													<CheckCircle className="w-6 h-6" />
// // 												</div>
// // 												<span
// // 													className={`text-xs text-center font-semibold max-w-20 leading-tight ${step.isActive ? "text-gray-900" : "text-gray-400"
// // 														}`}
// // 												>
// // 													{step.label}
// // 												</span>
// // 											</div>
// // 										))}
// // 									</div>
// // 								</div>

// // 								{/* Estimated delivery and track button */}
// // 								<div className="flex justify-between items-center pt-4 border-t border-gray-100">
// // 									<div className="text-sm text-gray-600">
// // 										<span className="font-semibold">
// // 											Estimated shipping date:{" "}
// // 										</span>
// // 										{(() => {
// // 											const date = new Date(order.createdAt);
// // 											date.setDate(date.getDate() + 7);
// // 											return formatDate(date.toISOString());
// // 										})()}
// // 									</div>
// // 									<Button
// // 										onClick={handleOpenTrackingModal}
// // 										className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg"
// // 									>
// // 										Track order
// // 									</Button>
// // 								</div>
// // 							</CardContent>
// // 						</Card>

// // 						{/* Order Timeline */}
// // 						<Card className="bg-white rounded-xl border-0 shadow-sm">
// // 							<CardHeader>
// // 								<CardTitle className="text-xl font-bold text-gray-900">
// // 									Order Timeline
// // 								</CardTitle>
// // 							</CardHeader>
// // 							<CardContent>
// // 								<div className="space-y-4">
// // 									{order.timeline && order.timeline.length > 0 ? (
// // 										// ✅ FIX: Ensure chronological order (oldest first) and add timeline validation
// // 										(() => {
// // 											// Validate and sort timeline to ensure proper chronological order
// // 											const sortedTimeline = [...order.timeline].sort((a, b) => {
// // 												const dateA = new Date(a.createdAt || a.displayTime || order.createdAt);
// // 												const dateB = new Date(b.createdAt || b.displayTime || order.createdAt);
// // 												return dateA.getTime() - dateB.getTime(); // Ascending order (oldest first)
// // 											});

// // 											// Debug timeline ordering
// // 											console.log('📅 Frontend Timeline Order Check:', {
// // 												originalLength: order.timeline.length,
// // 												sortedLength: sortedTimeline.length,
// // 												firstEvent: {
// // 													action: sortedTimeline[0]?.action,
// // 													time: sortedTimeline[0]?.createdAt || sortedTimeline[0]?.displayTime,
// // 													formatted: sortedTimeline[0]?.formattedAction
// // 												},
// // 												lastEvent: {
// // 													action: sortedTimeline[sortedTimeline.length - 1]?.action,
// // 													time: sortedTimeline[sortedTimeline.length - 1]?.createdAt || sortedTimeline[sortedTimeline.length - 1]?.displayTime,
// // 													formatted: sortedTimeline[sortedTimeline.length - 1]?.formattedAction
// // 												}
// // 											});

// // 											return sortedTimeline.map((event, index) => (
// // 												<div
// // 													key={`timeline-${event.id || index}`}
// // 													className="flex gap-3 p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
// // 												>
// // 													{/* Timeline indicator */}
// // 													<div className="flex flex-col items-center">
// // 														<div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0">
// // 															<div className="w-3 h-3 bg-white rounded-full"></div>
// // 														</div>
// // 														{/* Connect line to next event (except for last event) */}
// // 														{index < sortedTimeline.length - 1 && (
// // 															<div className="w-0.5 h-6 bg-gray-200 mt-2"></div>
// // 														)}
// // 													</div>

// // 													{/* Event content */}
// // 													<div className="flex-1">
// // 														<div className="flex items-center justify-between mb-1">
// // 															<h4 className="font-semibold text-gray-900 capitalize flex items-center gap-2">
// // 																{/* ✅ FIX: Show proper event title with sequence */}
// // 																{event?.formattedAction ||
// // 																	event?.action?.replace?.(/_/g, " ") ||
// // 																	"Order Update"}
// // 																{/* Show sequence number for debugging */}
// // 																{process.env.NODE_ENV === 'development' && (
// // 																	<span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
// // 																		#{event.sequenceNumber || index + 1}
// // 																	</span>
// // 																)}
// // 															</h4>
// // 															<span className="text-xs text-gray-500">
// // 																{formatDateTime(
// // 																	event?.createdAt ||
// // 																	event?.displayTime ||
// // 																	order.createdAt
// // 																)}
// // 															</span>
// // 														</div>

// // 														<p className="text-sm text-gray-600">
// // 															{event?.details?.description ||
// // 																event?.details?.adminNotes ||
// // 																getEventDescription(event?.action) ||
// // 																"Order status updated"}
// // 														</p>

// // 														{/* Show status badge for important events */}
// // 														{event?.details?.previousStatus && (
// // 															<div className="mt-2">
// // 																<Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
// // 																	Status: {event.details.previousStatus} → {event?.details?.newStatus || 'Updated'}
// // 																</Badge>
// // 															</div>
// // 														)}

// // 														{/* Show payment information for payment events */}
// // 														{event?.action?.includes('PAYMENT') && event?.details?.amount && (
// // 															<div className="mt-2">
// // 																<Badge className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
// // 																	Amount: ₦{Number(event.details.amount).toLocaleString()}
// // 																</Badge>
// // 															</div>
// // 														)}

// // 														{/* Show refund information for refund events */}
// // 														{event?.action === 'REFUND_PROCESSED' && (
// // 															<div className="mt-2 space-y-1">
// // 																<Badge className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
// // 																	Refund: ₦{Number(event.details?.refundAmount || 0).toLocaleString()}
// // 																</Badge>
// // 																{event.details?.breakdown && (
// // 																	<div className="text-xs text-gray-500">
// // 																		Items: ₦{Number(event.details.itemsRefund || 0).toLocaleString()} •
// // 																		Shipping: ₦{Number(event.details.shippingRefund || 0).toLocaleString()}
// // 																	</div>
// // 																)}
// // 															</div>
// // 														)}
// // 													</div>
// // 												</div>
// // 											));
// // 										})()
// // 									) : (
// // 										<div className="text-center py-8">
// // 											<Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
// // 											<p className="text-gray-500">No timeline events available</p>
// // 										</div>
// // 									)}
// // 								</div>
// // 							</CardContent>
// // 						</Card>

// // 						{/* Products Table */}
// // 						<Card className="bg-white rounded-xl border-0 shadow-sm">
// // 							<CardContent className="p-0">
// // 								<div className="overflow-x-auto">
// // 									<table className="w-full">
// // 										<thead className="bg-gray-50">
// // 											<tr>
// // 												<th className="text-left py-4 px-6 font-semibold text-gray-900">
// // 													Product Name
// // 												</th>
// // 												<th className="text-left py-4 px-6 font-semibold text-gray-900">
// // 													Amount
// // 												</th>
// // 												<th className="text-left py-4 px-6 font-semibold text-gray-900">
// // 													QTY
// // 												</th>
// // 												<th className="text-left py-4 px-6 font-semibold text-gray-900">
// // 													Order Status
// // 												</th>
// // 												<th className="text-left py-4 px-6 font-semibold text-gray-900">
// // 													Action
// // 												</th>
// // 											</tr>
// // 										</thead>
// // 										<tbody>
// // 											{order.items && order.items.length > 0 ? (
// // 												order.items.map((item: any, index: number) => (
// // 													<tr
// // 														key={index}
// // 														className="border-b border-gray-100 hover:bg-gray-50"
// // 													>
// // 														<td className="py-4 px-6">
// // 															<div className="flex items-center gap-3">
// // 																<div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
// // 																	{item.product?.image ? (
// // 																		<Image
// // 																			src={
// // 																				item.product.image || "/placeholder.svg"
// // 																			}
// // 																			alt={item.product?.name || "Product"}
// // 																			width={48}
// // 																			height={48}
// // 																			className="w-full h-full object-cover rounded-lg"
// // 																			onError={(e) => {
// // 																				(
// // 																					e.target as HTMLImageElement
// // 																				).style.display = "none";
// // 																			}}
// // 																		/>
// // 																	) : (
// // 																		<Package className="w-6 h-6 text-gray-400" />
// // 																	)}
// // 																</div>
// // 																<div>
// // 																	<p className="font-semibold text-gray-900">
// // 																		{item.product?.name || "Unknown Product"}
// // 																	</p>
// // 																	<p className="text-xs text-gray-500">
// // 																		{item.product?.category?.name ||
// // 																			"No Category"}
// // 																	</p>
// // 																</div>
// // 															</div>
// // 														</td>
// // 														<td className="py-4 px-6 font-semibold text-gray-900">
// // 															₦
// // 															{(
// // 																item.price ||
// // 																item.unitPrice ||
// // 																0
// // 															).toLocaleString()}
// // 														</td>
// // 														<td className="py-4 px-6 font-semibold text-gray-900">
// // 															{item.quantity || 0}
// // 														</td>
// // 														<td className="py-4 px-6">
// // 															<Badge
// // 																className={`px-2 py-1 rounded text-xs font-semibold ${order.status === "DELIVERED" ||
// // 																	order.status === "COMPLETED"
// // 																	? "bg-green-100 text-green-800"
// // 																	: order.status === "PROCESSING"
// // 																		? "bg-yellow-100 text-yellow-800"
// // 																		: order.status === "CANCELLED"
// // 																			? "bg-red-100 text-red-800"
// // 																			: "bg-gray-100 text-gray-800"
// // 																	}`}
// // 															>
// // 																{order.status}
// // 															</Badge>
// // 														</td>
// // 														<td className="py-4 px-6">
// // 															<div className="flex gap-2">
// // 																<Button
// // 																	variant="ghost"
// // 																	size="sm"
// // 																	onClick={() =>
// // 																		handleViewProduct(item.product || item)
// // 																	}
// // 																	className="text-green-600 hover:text-green-700 hover:bg-green-50 p-2 rounded"
// // 																>
// // 																	<Eye className="w-7 h-7" />
// // 																</Button>
// // 															</div>
// // 														</td>
// // 													</tr>
// // 												))
// // 											) : (
// // 												<tr>
// // 													<td colSpan={5} className="py-12 text-center">
// // 														<Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
// // 														<p className="text-gray-500">No products found</p>
// // 													</td>
// // 												</tr>
// // 											)}
// // 										</tbody>
// // 									</table>
// // 								</div>
// // 							</CardContent>
// // 						</Card>
// // 					</div>

// // 					{/* Right Column - Customer Info and Order Summary */}
// // 					<div className="space-y-6">
// // 						{/* Customer Info */}
// // 						<Card className="bg-white rounded-xl border-0 shadow-sm">
// // 							<CardContent className="p-6">
// // 								<div className="flex items-center gap-4 mb-6">
// // 									<div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
// // 										{profile?.profileImage ? (
// // 											<Image
// // 												src={profile.profileImage || "/placeholder.svg"}
// // 												alt="Customer"
// // 												width={64}
// // 												height={64}
// // 												className="w-full h-full object-cover rounded-full"
// // 												onError={(e) => {
// // 													(e.target as HTMLImageElement).style.display = "none";
// // 												}}
// // 											/>
// // 										) : (
// // 											<User className="w-8 h-8 text-gray-400" />
// // 										)}
// // 									</div>
// // 									<div>
// // 										<h3 className="text-lg font-bold text-gray-900">
// // 											{profile?.fullName ||
// // 												profile?.businessName ||
// // 												customer?.email ||
// // 												"Unknown Customer"}
// // 										</h3>
// // 										<p className="text-sm text-gray-600">
// // 											{customer?.email || "No email"}
// // 										</p>
// // 										<Badge className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-1">
// // 											Active
// // 										</Badge>
// // 									</div>
// // 								</div>

// // 								{/* Shipping Address */}
// // 								<div>
// // 									<h4 className="text-md font-bold text-gray-900 mb-3 flex items-center gap-2">
// // 										<MapPin className="w-4 h-4" />
// // 										Shipping Address
// // 									</h4>
// // 									<div className="space-y-2 text-sm">
// // 										<div>
// // 											<span className="text-gray-500">Primary address:</span>
// // 											<p className="font-semibold text-gray-900">
// // 												{shippingAddress?.fullAddress ||
// // 													profile?.address ||
// // 													"Address not available"}
// // 											</p>
// // 										</div>
// // 										<div className="grid grid-cols-2 gap-2 text-xs">
// // 											<div>
// // 												<span className="text-gray-500">City:</span>
// // 												<p className="font-semibold">
// // 													{shippingAddress?.city || "Lagos"}
// // 												</p>
// // 											</div>
// // 											<div>
// // 												<span className="text-gray-500">State/Province:</span>
// // 												<p className="font-semibold">
// // 													{shippingAddress?.stateProvince || "Lagos Mainland"}
// // 												</p>
// // 											</div>
// // 											<div>
// // 												<span className="text-gray-500">Country:</span>
// // 												<p className="font-semibold">
// // 													{shippingAddress?.country || "Nigeria"}
// // 												</p>
// // 											</div>
// // 											<div>
// // 												<span className="text-gray-500">Post Code:</span>
// // 												<p className="font-semibold">
// // 													{shippingAddress?.postalCode || "101233"}
// // 												</p>
// // 											</div>
// // 										</div>
// // 									</div>
// // 								</div>
// // 							</CardContent>
// // 						</Card>

// // 						{/* Order Summary */}
// // 						<Card className="bg-white rounded-xl border-0 shadow-sm">
// // 							<CardHeader>
// // 								<CardTitle className="text-lg font-bold text-gray-900">
// // 									Order Summary
// // 								</CardTitle>
// // 							</CardHeader>
// // 							<CardContent>
// // 								<div className="space-y-3">
// // 									<div className="flex justify-between items-center text-sm">
// // 										<span className="text-gray-600">Quantity:</span>
// // 										<span className="font-semibold">
// // 											{order.summary?.totalQuantity || order.items?.length || 0}
// // 										</span>
// // 									</div>
// // 									<div className="flex justify-between items-center text-sm">
// // 										<span className="text-gray-600">Sub Total:</span>
// // 										<span className="font-semibold">
// // 											₦{(order.summary?.itemsSubtotal || 0).toLocaleString()}
// // 										</span>
// // 									</div>
// // 									<div className="flex justify-between items-center text-sm">
// // 										<span className="text-gray-600">Tax:</span>
// // 										<span className="font-semibold">6%</span>
// // 									</div>
// // 									<div className="flex justify-between items-center text-sm">
// // 										<span className="text-gray-600">Shipping Fee:</span>
// // 										<span className="font-semibold">
// // 											₦{(order.summary?.shippingFee || order.shipping?.totalShippingFee || 0).toLocaleString()}
// // 										</span>
// // 									</div>
// // 									<div className="flex justify-between items-center text-sm">
// // 										<span className="text-gray-600">Discount:</span>
// // 										<span className="font-semibold text-red-500">
// // 											-₦{(order.summary?.discount || 0).toLocaleString()}
// // 										</span>
// // 									</div>

// // 									<Separator className="my-3" />

// // 									<div className="flex justify-between items-center">
// // 										<span className="text-lg font-bold text-gray-900">
// // 											Total Amount:
// // 										</span>
// // 										<span className="text-lg font-bold text-gray-900">
// // 											₦{(order.totalPrice || 0).toLocaleString()}
// // 										</span>
// // 									</div>

// // 									<div className="mt-4">
// // 										<PaymentInfoDisplay order={order} />
// // 									</div>
// // 								</div>
// // 							</CardContent>
// // 						</Card>
// // 					</div>
// // 				</div>
// // 			</div>

// // 			{/* Modals */}
// // 			<OrderTrackingModal
// // 				order={order}
// // 				isOpen={trackingModalOpen}
// // 				onClose={() => setTrackingModalOpen(false)}
// // 			/>

// // 			<ProductDetailsModal
// // 				product={selectedProduct}
// // 				isOpen={productModalOpen}
// // 				onClose={() => {
// // 					setProductModalOpen(false);
// // 					setSelectedProduct(null);
// // 				}}
// // 			/>

// // 			<RefundModal
// // 				order={order}
// // 				isOpen={refundModalOpen}
// // 				onClose={() => setRefundModalOpen(false)}
// // 				onRefundSuccess={handleRefundSuccess}
// // 			/>
// // 		</div>
// // 	);
// // };

// // export default React.memo(OrderDetails);

// // "use client";

// // import React, { useMemo, useCallback, useState } from "react";
// // import Image from "next/image";
// // import { Badge } from "@/components/ui/badge";
// // import { Button } from "@/components/ui/button";
// // import { useGetOrderInfo, useProcessRefund } from "@/services/orders";
// // import { RefundModal, PaymentInfoDisplay } from './refund';
// // import { formatDate, formatDateTime } from "@/lib/utils";
// // import { useRouter } from "next/navigation";
// // import httpService from "@/services/httpService";
// // import { routes } from "@/services/api-routes";
// // import {
// //   ArrowLeft,
// //   Edit,
// //   RefreshCw,
// //   Truck,
// //   Calendar,
// //   Eye,
// //   Package,
// //   CreditCard,
// //   MapPin,
// //   User,
// //   Phone,
// //   Mail,
// //   Download,
// //   CheckCircle,
// //   Circle,
// //   Clock,
// //   AlertCircle,
// //   X,
// //   ChevronDown,
// //   AlertTriangle,
// //   ShoppingCart
// // } from "lucide-react";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogHeader,
// //   DialogTitle,
// // } from "@/components/ui/dialog";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Separator } from "@/components/ui/separator";
// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuItem,
// //   DropdownMenuTrigger,
// //   DropdownMenuSeparator,
// //   DropdownMenuLabel,
// // } from "@/components/ui/dropdown-menu";
// // import { toast } from "sonner";

// // // Product Details Modal Component
// // const ProductDetailsModal = React.memo(({
// //   product,
// //   onClose,
// //   isOpen
// // }: {
// //   product: any;
// //   onClose: () => void;
// //   isOpen: boolean;
// // }) => {
// //   if (!product) return null;

// //   return (
// //     <Dialog open={isOpen} onOpenChange={onClose}>
// //       <DialogContent className="max-w-2xl h-full flex flex-col right-0 overflow-y-auto">
// //         <DialogHeader>
// //           <DialogTitle className="flex items-center gap-3 mb-4">
// //             <Package className="w-5 h-5" />
// //             <span className="text-xl font-semibold">Product Details</span>
// //           </DialogTitle>
// //         </DialogHeader>

// //         <div className="space-y-6">
// //           <div className="flex gap-6">
// //             <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
// //               {product.image ? (
// //                 <Image
// //                   src={product.image}
// //                   alt={product.name}
// //                   width={128}
// //                   height={128}
// //                   className="w-full h-full object-cover rounded-lg"
// //                   onError={(e) => {
// //                     (e.target as HTMLImageElement).style.display = 'none';
// //                   }}
// //                 />
// //               ) : (
// //                 <Package className="w-12 h-12 text-gray-400" />
// //               )}
// //             </div>
// //             <div className="flex-1">
// //               <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
// //               <p className="text-gray-600 mb-4">{product.shortDescription}</p>
// //               <div className="grid grid-cols-2 gap-4 text-sm">
// //                 <div>
// //                   <span className="text-gray-500">Category:</span>
// //                   <p className="font-medium">{product.category?.name || "N/A"}</p>
// //                 </div>
// //                 <div>
// //                   <span className="text-gray-500">Manufacturer:</span>
// //                   <p className="font-medium">{product.manufacturer?.name || "N/A"}</p>
// //                 </div>
// //                 <div>
// //                   <span className="text-gray-500">Processing Time:</span>
// //                   <p className="font-medium">{product.processingTime || 'N/A'} days</p>
// //                 </div>
// //                 <div>
// //                   <span className="text-gray-500">Returns:</span>
// //                   <p className="font-medium">{product.acceptsReturns ? "Accepted" : "Not Accepted"}</p>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="flex justify-end">
// //             <Button onClick={onClose} variant="outline">
// //               Close
// //             </Button>
// //           </div>
// //         </div>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // });

// // ProductDetailsModal.displayName = 'ProductDetailsModal';

// // // Order Tracking Modal Component
// // const OrderTrackingModal = React.memo(({
// //   order,
// //   onClose,
// //   isOpen
// // }: {
// //   order: any;
// //   onClose: () => void;
// //   isOpen: boolean;
// // }) => {
// //   if (!order) return null;

// //   const getTrackingSteps = useMemo(() => (status: string, paymentStatus: string) => {
// //     const steps = [
// //       {
// //         id: 1,
// //         name: "Order Placed",
// //         status: "completed",
// //         icon: <CheckCircle className="w-6 h-6" />,
// //         description: "Order has been confirmed"
// //       },
// //       {
// //         id: 2,
// //         name: "Payment",
// //         status: paymentStatus === "PAID" ? "completed" : "current",
// //         icon: <CreditCard className="w-6 h-6" />,
// //         description: "Payment processing"
// //       },
// //       {
// //         id: 3,
// //         name: "Processing",
// //         status: status === "PROCESSING" ? "current" :
// //           ["SHIPPED", "DELIVERED", "COMPLETED"].includes(status) ? "completed" : "pending",
// //         icon: <Package className="w-6 h-6" />,
// //         description: "Order is being prepared"
// //       },
// //       {
// //         id: 4,
// //         name: "Shipped",
// //         status: status === "SHIPPED" ? "current" :
// //           ["DELIVERED", "COMPLETED"].includes(status) ? "completed" : "pending",
// //         icon: <Truck className="w-6 h-6" />,
// //         description: "Order is on the way"
// //       },
// //       {
// //         id: 5,
// //         name: "Delivered",
// //         status: ["DELIVERED", "COMPLETED"].includes(status) ? "completed" : "pending",
// //         icon: <CheckCircle className="w-6 h-6" />,
// //         description: "Order has been delivered"
// //       },
// //     ];
// //     return steps;
// //   }, []);

// //   const trackingSteps = useMemo(() =>
// //     getTrackingSteps(order.status, order.paymentStatus),
// //     [order.status, order.paymentStatus, getTrackingSteps]
// //   );

// //   return (
// //     <Dialog open={isOpen} onOpenChange={onClose}>
// //       <DialogContent className="max-w-4xl h-full flex flex-col  right-0">
// //         <DialogHeader>
// //           <DialogTitle className="flex items-center gap-3 mb-4">
// //             <Truck className="w-6 h-6" />
// //             <span className="text-2xl font-semibold">Order Tracking</span>
// //           </DialogTitle>
// //         </DialogHeader>

// //         <div className="space-y-6">
// //           {/* Progress Tracker */}
// //           <div className="mb-8">
// //             <div className="flex items-center justify-between relative">
// //               <div className="absolute top-6 left-10 right-0 h-0.5 bg-gray-200 z-0"></div>

// //               {trackingSteps.map((step) => (
// //                 <div key={step.id} className="flex flex-col items-center relative z-10 bg-white px-2">
// //                   <div
// //                     className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 border-4 border-white shadow-sm ${step.status === "completed"
// //                       ? "bg-green-500 text-white"
// //                       : step.status === "current"
// //                         ? "bg-yellow-500 text-white"
// //                         : "bg-gray-200 text-gray-400"
// //                       }`}
// //                   >
// //                     {step.icon}
// //                   </div>
// //                   <span
// //                     className={`text-xs text-center font-medium max-w-20 ${step.status === "completed" || step.status === "current"
// //                       ? "text-gray-800"
// //                       : "text-gray-400"
// //                       }`}
// //                   >
// //                     {step.name}
// //                   </span>
// //                   <span className="text-xs text-gray-500 text-center max-w-24 mt-1">
// //                     {step.description}
// //                   </span>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>

// //           {/* Order Details */}
// //           <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
// //             <div>
// //               <h3 className="font-semibold mb-3">Order Information</h3>
// //               <div className="space-y-2 text-sm">
// //                 <div className="flex justify-between">
// //                   <span className="text-gray-600">Order ID:</span>
// //                   <span className="font-medium">#{order.id}</span>
// //                 </div>
// //                 <div className="flex justify-between">
// //                   <span className="text-gray-600">Date:</span>
// //                   <span className="font-medium">{formatDate(order.createdAt)}</span>
// //                 </div>
// //                 <div className="flex justify-between">
// //                   <span className="text-gray-600">Status:</span>
// //                   <Badge variant={order.status === "DELIVERED" ? "default" : "secondary"}>
// //                     {order.status}
// //                   </Badge>
// //                 </div>
// //                 <div className="flex justify-between">
// //                   <span className="text-gray-600">Total Amount:</span>
// //                   <span className="font-medium">₦{(order.totalPrice || 0).toLocaleString()}</span>
// //                 </div>
// //               </div>
// //             </div>

// //             <div>
// //               <h3 className="font-semibold mb-3">Shipping Information</h3>
// //               <div className="space-y-2 text-sm">
// //                 {order.shipping && (
// //                   <>
// //                     <div className="flex justify-between">
// //                       <span className="text-gray-600">Distance:</span>
// //                       <span className="font-medium">{order.shipping.distance} km</span>
// //                     </div>
// //                     <div className="flex justify-between">
// //                       <span className="text-gray-600">Shipping Fee:</span>
// //                       <span className="font-medium">₦{(order.shipping.totalShippingFee || 0).toLocaleString()}</span>
// //                     </div>
// //                   </>
// //                 )}
// //                 <div className="flex justify-between">
// //                   <span className="text-gray-600">Estimated Delivery:</span>
// //                   <span className="font-medium">
// //                     {(() => {
// //                       const date = new Date(order.createdAt);
// //                       date.setDate(date.getDate() + 7);
// //                       return formatDate(date.toISOString());
// //                     })()}
// //                   </span>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="flex justify-end pt-4">
// //             <Button onClick={onClose} className="bg-orange-500 hover:bg-orange-600">
// //               Close
// //             </Button>
// //           </div>
// //         </div>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // });

// // OrderTrackingModal.displayName = 'OrderTrackingModal';

// // // Type definitions
// // interface OrderStatus {
// //   variant: 'default' | 'secondary' | 'destructive' | 'outline';
// //   text: string;
// // }

// // interface StatusTransition {
// //   value: string;
// //   label: string;
// //   icon: React.ComponentType<{ className?: string }>;
// //   color: string;
// // }

// // // Enhanced order data type matching your backend response
// // interface ProcessedOrderData {
// //   id: any;
// //   orderId?: string;
// //   status: string;
// //   totalPrice: number;
// //   createdAt: string;
// //   updatedAt?: string;
// //   paymentStatus: string;
// //   orderType?: string;
// //   user: any;
// //   items: any[];
// //   timeline: any[];
// //   shipping: any;
// //   breakdown: any;
// //   summary: any;
// //   transactions?: any[];
// //   adminAlerts?: any[];
// //   notes?: any[];
// //   // Payment fields from your controller
// //   amountPaid?: number;
// //   amountDue?: number;
// //   [key: string]: any;
// // }

// // // Main Order Details Component
// // interface OrderDetailsProps {
// //   orderId?: string;
// //   setClose?: React.Dispatch<React.SetStateAction<boolean>>;
// //   isModal?: boolean;
// // }

// // const OrderDetails: React.FC<OrderDetailsProps> = ({
// //   orderId,
// //   setClose,
// //   isModal = false
// // }) => {
// //   const router = useRouter();
// //   const [trackingModalOpen, setTrackingModalOpen] = useState(false);
// //   const [productModalOpen, setProductModalOpen] = useState(false);
// //   const [selectedProduct, setSelectedProduct] = useState(null);
// //   const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
// //   const [refundModalOpen, setRefundModalOpen] = useState(false);


// //   const processRefundMutation = useProcessRefund();



// //   // Validate orderId before proceeding
// //   if (!orderId) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <div className="text-center max-w-md mx-auto p-6">
// //           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
// //             <AlertCircle className="w-8 h-8 text-red-600" />
// //           </div>
// //           <h2 className="text-xl font-semibold text-gray-900 mb-2">
// //             Invalid Order ID
// //           </h2>
// //           <p className="text-gray-600 mb-6">
// //             No order ID was provided. Please check the URL and try again.
// //           </p>
// //           <Button onClick={() => router.back()} className="bg-orange-500 hover:bg-orange-600">
// //             {isModal ? "Close" : "Go Back"}
// //           </Button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const {
// //     getOrderInfoData: rawData,
// //     getOrderInfoIsLoading,
// //     getOrderInfoError,
// //     refetchOrderInfo,
// //   } = useGetOrderInfo({
// //     enabled: Boolean(orderId),
// //     orderId: orderId
// //   } as any);

// //   // Helper functions for safe property access
// //   const getAmountPaid = useCallback((orderData: any): number => {
// //     return typeof orderData?.amountPaid === 'number' ? orderData.amountPaid :
// //       typeof orderData?.breakdown?.amountPaid === 'number' ? orderData.breakdown.amountPaid : 0;
// //   }, []);

// //   const getAmountDue = useCallback((orderData: any): number => {
// //     return typeof orderData?.amountDue === 'number' ? orderData.amountDue :
// //       typeof orderData?.breakdown?.amountDue === 'number' ? orderData.breakdown.amountDue : 0;
// //   }, []);

// //   // Determine payment type and schedule based on available data
// //   const getPaymentInfo = useCallback((order: any) => {
// //     const paymentStatus = order.paymentStatus || 'PENDING';
// //     const orderType = order.orderType || 'IMMEDIATE';

// //     // Determine if it's pay on delivery based on amount due vs total
// //     const totalPrice = order.totalPrice || 0;
// //     const amountPaid = getAmountPaid(order);
// //     const amountDue = getAmountDue(order);

// //     const isPayOnDelivery = amountDue === totalPrice && amountPaid === 0 && paymentStatus === 'PENDING';
// //     const requiresImmediatePayment = paymentStatus === 'PENDING' && !isPayOnDelivery;
// //     const isScheduled = orderType === 'SCHEDULED' || Boolean(order.scheduledDeliveryDate);

// //     return {
// //       paymentStatus,
// //       orderType,
// //       isPayOnDelivery,
// //       requiresImmediatePayment,
// //       isScheduled,
// //       method: isPayOnDelivery ? 'Pay on Delivery' : 'Online Payment'
// //     };
// //   }, [getAmountPaid, getAmountDue]);

// //   // Memoized callbacks to prevent infinite loops
// //   const handleViewProduct = useCallback((product: any) => {
// //     setSelectedProduct(product);
// //     setProductModalOpen(true);
// //   }, []);

// //   const handleOpenTrackingModal = useCallback(() => {
// //     setTrackingModalOpen(true);
// //   }, []);

// //   const handleClose = useCallback(() => {
// //     if (setClose) {
// //       setClose(false);
// //     } else {
// //       router.back();
// //     }
// //   }, [setClose, router]);

// //   const handleStatusUpdate = useCallback(async (newStatus: string) => {
// //     if (!orderId) {
// //       toast.error('No order ID available');
// //       return;
// //     }

// //     setIsUpdatingStatus(true);

// //     try {
// //       const response = await httpService.patchData(
// //         {
// //           status: newStatus,
// //           notes: `Status updated to ${newStatus} via admin panel`
// //         },
// //         routes.updateOrderStatus(orderId)
// //       );

// //       if (refetchOrderInfo) {
// //         await refetchOrderInfo();
// //       }

// //       toast.success(`Order status successfully updated to ${newStatus}`);
// //     } catch (error: any) {
// //       console.error('Failed to update order status:', error);
// //       toast.error(`Failed to update order status: ${error?.message || 'Unknown error'}`);
// //     } finally {
// //       setIsUpdatingStatus(false);
// //     }
// //   }, [orderId, refetchOrderInfo]);

// //   const handleRefundSuccess = useCallback(() => {
// //     // Custom logic after successful refund
// //     console.log('Refund completed successfully');

// //     // Refresh order data
// //     if (refetchOrderInfo) {
// //       refetchOrderInfo();
// //     }

// //     // Optional: Show additional success message or redirect
// //     toast.success('Order refunded and data refreshed');
// //   }, [refetchOrderInfo]);

// //   const handleRetry = useCallback(() => {
// //     if (refetchOrderInfo) {
// //       refetchOrderInfo();
// //     }
// //   }, [refetchOrderInfo]);

// //   // Memoized processed data based on your controller's response structure
// //   const processedOrderData = useMemo((): ProcessedOrderData | null => {
// //     if (!rawData) return null;

// //     return {
// //       ...rawData,
// //       id: rawData.id,
// //       orderId: rawData.orderId || `#${String(rawData.id || '').padStart(6, '0')}`,
// //       status: rawData.status || 'PENDING',
// //       totalPrice: Number(rawData.totalPrice) || 0,
// //       createdAt: rawData.createdAt || new Date().toISOString(),
// //       paymentStatus: rawData.paymentStatus || 'PENDING',
// //       orderType: rawData.orderType || 'IMMEDIATE',
// //       items: Array.isArray(rawData.items) ? rawData.items : [],
// //       timeline: Array.isArray(rawData.timeline) ? rawData.timeline : [],
// //       user: rawData.user || {},
// //       summary: rawData.summary || {},
// //       breakdown: rawData.breakdown || {},
// //       shipping: rawData.shipping || null,
// //       transactions: rawData.transactions || [],
// //       adminAlerts: rawData.adminAlerts || [],
// //       notes: rawData.notes || [],
// //       amountPaid: rawData.amountPaid || rawData.breakdown?.amountPaid || 0,
// //       amountDue: rawData.amountDue || rawData.breakdown?.amountDue || 0,
// //     };
// //   }, [rawData]);

// //   // Memoized shipping address calculation
// //   const shippingAddress = useMemo(() => {
// //     if (!processedOrderData) return null;

// //     // Look for shipping address in timeline or user profile
// //     const orderCreatedEvent = processedOrderData.timeline?.find((event: any) =>
// //       event?.action === 'ORDER_CREATED' && event?.details?.shippingAddress
// //     );

// //     if (orderCreatedEvent?.details?.shippingAddress) {
// //       return orderCreatedEvent.details.shippingAddress;
// //     }

// //     // Fallback to user profile address
// //     const user = processedOrderData.user;
// //     if (user?.profile?.address || user?.businessProfile?.businessAddress) {
// //       return {
// //         fullAddress: user.profile?.address || user.businessProfile?.businessAddress,
// //         city: 'N/A',
// //         stateProvince: 'N/A',
// //         country: 'Nigeria',
// //         postalCode: 'N/A'
// //       };
// //     }

// //     return null;
// //   }, [processedOrderData]);

// //   // Memoized status info
// //   const statusInfo = useMemo(() => {
// //     if (!processedOrderData) return { variant: 'secondary' as const, text: 'Unknown' };

// //     const statusMap: Record<string, OrderStatus> = {
// //       'PENDING': { variant: 'secondary' as const, text: 'Pending' },
// //       'SCHEDULED': { variant: 'secondary' as const, text: 'Scheduled' },
// //       'PROCESSING': { variant: 'default' as const, text: 'Processing' },
// //       'ONGOING': { variant: 'default' as const, text: 'Ongoing' },
// //       'SHIPPED': { variant: 'default' as const, text: 'Shipped' },
// //       'DELIVERED': { variant: 'default' as const, text: 'Delivered' },
// //       'COMPLETED': { variant: 'default' as const, text: 'Completed' },
// //       'CANCELLED': { variant: 'destructive' as const, text: 'Cancelled' }
// //     };
// //     return statusMap[processedOrderData.status] || { variant: 'secondary' as const, text: processedOrderData.status };
// //   }, [processedOrderData]);

// //   // Memoized available transitions
// //   const availableTransitions = useMemo(() => {
// //     if (!processedOrderData) return [];

// //     const statusTransitions: Record<string, StatusTransition[]> = {
// //       'PENDING': [
// //         { value: 'PROCESSING', label: 'Start Processing', icon: Package, color: 'text-blue-600' },
// //         { value: 'CANCELLED', label: 'Cancel Order', icon: X, color: 'text-red-600' }
// //       ],
// //       'SCHEDULED': [
// //         { value: 'PENDING', label: 'Mark as Pending', icon: Clock, color: 'text-orange-600' },
// //         { value: 'PROCESSING', label: 'Start Processing', icon: Package, color: 'text-blue-600' },
// //         { value: 'CANCELLED', label: 'Cancel Order', icon: X, color: 'text-red-600' }
// //       ],
// //       'PROCESSING': [
// //         { value: 'SHIPPED', label: 'Mark as Shipped', icon: Truck, color: 'text-purple-600' },
// //         { value: 'COMPLETED', label: 'Mark as Completed', icon: CheckCircle, color: 'text-green-600' },
// //         { value: 'CANCELLED', label: 'Cancel Order', icon: X, color: 'text-red-600' }
// //       ],
// //       'ONGOING': [
// //         { value: 'PROCESSING', label: 'Start Processing', icon: Package, color: 'text-blue-600' },
// //         { value: 'SHIPPED', label: 'Mark as Shipped', icon: Truck, color: 'text-purple-600' },
// //         { value: 'DELIVERED', label: 'Mark as Delivered', icon: CheckCircle, color: 'text-green-600' }
// //       ],
// //       'SHIPPED': [
// //         { value: 'DELIVERED', label: 'Mark as Delivered', icon: CheckCircle, color: 'text-green-600' }
// //       ],
// //       'DELIVERED': [
// //         { value: 'COMPLETED', label: 'Complete Order', icon: CheckCircle, color: 'text-green-600' }
// //       ],
// //       'CANCELLED': [],
// //       'COMPLETED': []
// //     };

// //     return statusTransitions[processedOrderData.status] || [];
// //   }, [processedOrderData]);

// //   // Loading state
// //   if (getOrderInfoIsLoading) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <div className="text-center">
// //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
// //           <p className="text-lg font-medium">Loading order details...</p>
// //           <p className="text-sm text-gray-500 mt-2">Order #{orderId}</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // Error state
// //   if (getOrderInfoError) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <div className="text-center max-w-md mx-auto p-6">
// //           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
// //             <AlertCircle className="w-8 h-8 text-red-600" />
// //           </div>
// //           <h2 className="text-xl font-semibold text-gray-900 mb-2">
// //             Error Loading Order
// //           </h2>
// //           <p className="text-gray-600 mb-6">
// //             {getOrderInfoError}
// //           </p>
// //           <div className="flex gap-3 justify-center">
// //             <Button variant="outline" onClick={handleClose}>
// //               {isModal ? "Close" : "Go Back"}
// //             </Button>
// //             <Button onClick={handleRetry} className="bg-orange-500 hover:bg-orange-600">
// //               <RefreshCw className="w-4 h-4 mr-2" />
// //               Try Again
// //             </Button>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // Empty state
// //   if (!processedOrderData) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <div className="text-center max-w-md mx-auto p-6">
// //           <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
// //             <Package className="w-8 h-8 text-gray-400" />
// //           </div>
// //           <h2 className="text-xl font-semibold text-gray-900 mb-2">
// //             Order Not Found
// //           </h2>
// //           <p className="text-gray-600 mb-6">
// //             The order #{orderId} could not be found.
// //           </p>
// //           <div className="flex gap-3 justify-center">
// //             <Button variant="outline" onClick={handleClose}>
// //               {isModal ? "Close" : "Go Back"}
// //             </Button>
// //             <Button onClick={handleRetry} className="bg-orange-500 hover:bg-orange-600">
// //               <RefreshCw className="w-4 h-4 mr-2" />
// //               Try Again
// //             </Button>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // At this point, we have valid data
// //   const order = processedOrderData;
// //   const customer = order.user;
// //   const profile = customer?.profile || customer?.businessProfile;
// //   const paymentInfo = getPaymentInfo(order);

// //   return (
// //     <div className="min-h-screen bg-[#F8F8F8] -50">
// //       <div className=" mx-12  bg-[#fdfafa] p-6">
// //         {/* Header */}
// //         <div className="flex items-center justify-between mb-6">
// //           <div className="flex flex-col items-start gap-2">
// //             <h1 className="text-3xl font-bold">Order Details</h1>
// //             <p className="text-[#687588]">Manage orders</p>
// //           </div>

// //         </div>

// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// //           {/* Left Column - Order Info */}
// //           <div className="lg:col-span-2 space-y-6">
// //             {/* Order Header */}
// //             <Card className="bg-white rounded-lg">
// //               <CardContent className="p-6">
// //                 <div className="flex items-center justify-between mb-4">
// //                   <div className="">
// //                     <div className="flex gap-5 mb-2">
// //                       <h2 className="text-xl font-semibold">Order {order.orderId || `#${order.id}`}</h2>
// //                       <Badge variant={statusInfo.variant} className="px-3 py-1">
// //                         {statusInfo.text}
// //                       </Badge>
// //                     </div>
// //                     <p className="text-gray-500 text-sm">
// //                       Order / Order Details / Order {order.orderId || `#${order.id}`} - {formatDateTime(order.createdAt)}
// //                     </p>

// //                   </div>
// //                   <div>
// //                     <div className="flex flex-row gap-2">
// //                       <div className="flex gap-2">

// //                         <Button
// //                           variant="outline"
// //                           size="sm"
// //                           onClick={() => setRefundModalOpen(true)}
// //                           disabled={
// //                             processRefundMutation.isPending ||
// //                             order.paymentStatus !== 'PAID' ||
// //                             ['REFUNDED', 'CANCELLED'].includes(order.status)
// //                           }
// //                         >
// //                           <Download className="w-4 h-4 mr-2" />
// //                           {processRefundMutation.isPending ? 'Processing...' : 'Refund'}
// //                         </Button>
// //                       </div>

// //                       {/* Status Update Dropdown */}
// //                       <DropdownMenu>
// //                         <DropdownMenuTrigger asChild>
// //                           <Button
// //                             className="bg-[#FFBF3B] text-black font-semibold flex items-center gap-2"
// //                             disabled={isUpdatingStatus || availableTransitions.length === 0}
// //                           >
// //                             {isUpdatingStatus ? (
// //                               <>
// //                                 <RefreshCw className="w-4 h-4 animate-spin" />
// //                                 Updating...
// //                               </>
// //                             ) : (
// //                               <>

// //                                 Edit Order

// //                               </>
// //                             )}
// //                           </Button>
// //                         </DropdownMenuTrigger>
// //                         <DropdownMenuContent align="end" className="w-56">
// //                           <DropdownMenuLabel className="flex items-center gap-2">
// //                             <ShoppingCart className="w-4 h-4" />
// //                             Update Order Status
// //                           </DropdownMenuLabel>
// //                           <DropdownMenuSeparator />

// //                           <div className="px-2 py-1.5 text-xs text-gray-500">
// //                             Current: <span className="font-medium text-gray-700">{statusInfo.text}</span>
// //                           </div>
// //                           <DropdownMenuSeparator />

// //                           {availableTransitions.length === 0 ? (
// //                             <div className="px-2 py-2 text-sm text-gray-500 italic">
// //                               No status changes available
// //                             </div>
// //                           ) : (
// //                             availableTransitions.map((transition) => {
// //                               const IconComponent = transition.icon;
// //                               return (
// //                                 <DropdownMenuItem
// //                                   key={transition.value}
// //                                   onClick={() => handleStatusUpdate(transition.value)}
// //                                   className="flex items-center gap-2 cursor-pointer"
// //                                 >
// //                                   <IconComponent className={`w-4 h-4 ${transition.color}`} />
// //                                   <span>{transition.label}</span>
// //                                 </DropdownMenuItem>
// //                               );
// //                             })
// //                           )}
// //                         </DropdownMenuContent>
// //                       </DropdownMenu>


// //                     </div>
// //                   </div>

// //                 </div>


// //                 {/* Progress Bar */}
// //                 <div className="mb-6">
// //                   <h3 className="text-sm font-medium mb-6">Order Progress</h3>

// //                   <div className="relative">
// //                     {/* Progress line container */}
// //                     <div className="absolute top-4 left-0 right-0 h-2 bg-gray-200 rounded-full z-0"></div>

// //                     {/* Active progress line */}
// //                     <div
// //                       className="absolute top-4 left-0 h-2 bg-green-500 rounded-full z-0 transition-all duration-500"
// //                       style={{
// //                         width: `${(() => {
// //                           const steps = [
// //                             { key: "ORDER_PLACED", completed: true },
// //                             { key: "PAYMENT", completed: order.paymentStatus === "PAID" },
// //                             { key: "PROCESSING", completed: ["PROCESSING", "ONGOING", "SHIPPED", "DELIVERED", "COMPLETED"].includes(order.status) },
// //                             { key: "SHIPPING", completed: ["SHIPPED", "DELIVERED", "COMPLETED"].includes(order.status) },
// //                             { key: "DELIVERED", completed: ["DELIVERED", "COMPLETED"].includes(order.status) }
// //                           ];

// //                           const completedSteps = steps.filter(step => step.completed).length;
// //                           return (completedSteps - 1) * 25; // 25% for each step (100% / 4 gaps)
// //                         })()}%`
// //                       }}
// //                     />

// //                     {/* Progress steps */}
// //                     <div className="relative z-10 flex items-center justify-between">
// //                       {[
// //                         {
// //                           label: "Order Confirming",
// //                           status: "completed",
// //                           isActive: true
// //                         },
// //                         {
// //                           label: order.paymentStatus === "PAID" ? "Payment Completed" : "Payment Pending",
// //                           status: order.paymentStatus === "PAID" ? "completed" : "current",
// //                           isActive: order.paymentStatus === "PAID"
// //                         },
// //                         {
// //                           label: "Processing",
// //                           status: ["PROCESSING", "ONGOING"].includes(order.status) ? "current" :
// //                             ["SHIPPED", "DELIVERED", "COMPLETED"].includes(order.status) ? "completed" : "pending",
// //                           isActive: ["PROCESSING", "ONGOING", "SHIPPED", "DELIVERED", "COMPLETED"].includes(order.status),
// //                           showSpinner: ["PROCESSING", "ONGOING"].includes(order.status)
// //                         },
// //                         {
// //                           label: "Shipping",
// //                           status: order.status === "SHIPPED" ? "current" :
// //                             ["DELIVERED", "COMPLETED"].includes(order.status) ? "completed" : "pending",
// //                           isActive: ["SHIPPED", "DELIVERED", "COMPLETED"].includes(order.status)
// //                         },
// //                         {
// //                           label: "Delivered",
// //                           status: ["DELIVERED", "COMPLETED"].includes(order.status) ? "completed" : "pending",
// //                           isActive: ["DELIVERED", "COMPLETED"].includes(order.status)
// //                         }
// //                       ].map((step, index) => (
// //                         <div key={index} className="flex flex-col items-center bg-white px-1">
// //                           {/* Step indicator - just colored dots */}
// //                           <div
// //                             className={`w-3 h-3 rounded-full mb-3 transition-all duration-300 ${step.status === "completed"
// //                               ? "bg-green-500"
// //                               : step.isActive
// //                                 ? "bg-yellow-500"
// //                                 : "bg-gray-300"
// //                               }`}
// //                           />


// //                           {/* Step label */}
// //                           <span
// //                             className={`text-xs text-center font-medium max-w-20 leading-tight ${step.isActive || step.status === "completed"
// //                               ? "text-gray-800"
// //                               : "text-gray-400"
// //                               }`}
// //                           >
// //                             {step.label}
// //                           </span>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   </div>

// //                   {/* Bottom section with delivery info and tracking */}
// //                   <div className="flex justify-between items-center mt-8">
// //                     <div className="text-sm text-gray-500 flex items-center gap-2">
// //                       <Calendar className="w-4 h-4" />
// //                       Estimated delivery: {(() => {
// //                         const date = new Date(order.createdAt);
// //                         date.setDate(date.getDate() + 7);
// //                         return formatDate(date.toISOString());
// //                       })()}
// //                     </div>
// //                     <div>
// //                       <Button
// //                         variant="outline"
// //                         onClick={handleOpenTrackingModal}
// //                         className="flex items-center gap-2 bg-[#FFBF3B] font-semibold"
// //                       >
// //                         <Truck className="w-4 h-4" />
// //                         Track order
// //                       </Button>
// //                     </div>
// //                   </div>
// //                 </div>

// //                 {/* Payment and Schedule Information */}
// //                 <div className="mt-6 p-4 bg-gray-50 rounded-lg">
// //                   <h4 className="font-bold mb-3">Payment & Schedule Information</h4>
// //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
// //                     <div>
// //                       <span className="font-bold">Payment Method:</span>
// //                       <p className="font-medium">{paymentInfo.method}</p>
// //                     </div>
// //                     <div>
// //                       <span className="font-bold">Order Type:</span>
// //                       <p className="font-medium">{paymentInfo.orderType}</p>
// //                     </div>
// //                     <div>
// //                       <span className="font-bold">Payment Status:</span>
// //                       <Badge variant={order.paymentStatus === 'PAID' ? 'default' : 'secondary'} className="ml-2">
// //                         {order.paymentStatus}
// //                       </Badge>
// //                     </div>
// //                     <div>
// //                       <span className="font-bold">Schedule Type:</span>
// //                       <Badge variant={paymentInfo.isScheduled ? 'secondary' : 'default'} className="ml-2">
// //                         {paymentInfo.isScheduled ? 'Scheduled' : 'Immediate'}
// //                       </Badge>
// //                     </div>
// //                   </div>

// //                   {/* Payment Urgency Indicators */}
// //                   <div className="mt-3 flex gap-2">
// //                     {paymentInfo.requiresImmediatePayment && (
// //                       <Badge className="bg-red-100 text-red-800 text-xs">
// //                         ⚠️ Payment Required
// //                       </Badge>
// //                     )}
// //                     {paymentInfo.isPayOnDelivery && (
// //                       <Badge className="bg-yellow-50 text-black text-xs">
// //                         💰 Pay on Delivery
// //                       </Badge>
// //                     )}
// //                     {paymentInfo.isScheduled && (
// //                       <Badge className="bg-purple-100 text-purple-800 text-xs">
// //                         📅 Scheduled Order
// //                       </Badge>
// //                     )}
// //                     {order.paymentStatus === 'PAID' && (
// //                       <Badge className="bg-green-100 text-green-800 text-xs">
// //                         ✅ Payment Complete
// //                       </Badge>
// //                     )}
// //                   </div>
// //                 </div>
// //               </CardContent>
// //             </Card>

// //             {/* Order Timeline */}
// //             <Card className="rounded-xl">
// //               <CardHeader>
// //                 <CardTitle className="text-2xl">Order Timeline</CardTitle>
// //               </CardHeader>
// //               <CardContent>
// //                 <div className="space-y-4">
// //                   {order.timeline && order.timeline.length > 0 ? (
// //                     order.timeline.map((event: any, index: number) => (
// //                       <div key={index} className="flex gap-3">
// //                         <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0">
// //                           <Package className="w-4 h-4 text-white" />
// //                         </div>
// //                         <div className="flex-1">
// //                           <div className="flex items-center justify-between">
// //                             <h4 className="font-medium text-xl lowercase">{event?.action?.replace?.(/_/g, ' ') || 'Order Update'}</h4>
// //                             <span className="text-sm text-gray-500">
// //                               {formatDateTime(event?.createdAt || order.createdAt)}
// //                             </span>
// //                           </div>
// //                           <p className="text-sm text-gray-600">
// //                             {event?.details?.description ||
// //                               event?.details?.adminNotes ||
// //                               "Order status updated"}
// //                           </p>
// //                           {event?.details?.previousStatus && (
// //                             <p className="text-xs text-gray-500 mt-1">
// //                               Changed from {event.details.previousStatus} to {event.status}
// //                             </p>
// //                           )}
// //                         </div>
// //                       </div>
// //                     ))
// //                   ) : (
// //                     <div className="text-center py-8 text-gray-500">
// //                       <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
// //                       <p>No timeline events available</p>
// //                     </div>
// //                   )}
// //                 </div>
// //               </CardContent>
// //             </Card>

// //             {/* Product Table */}
// //             <Card className="rounded-xl">
// //               <CardHeader>
// //                 <CardTitle>Products ({order.items?.length || 0} items)</CardTitle>
// //               </CardHeader>
// //               <CardContent>
// //                 <div className="overflow-x-auto">
// //                   <table className="w-full">
// //                     <thead>
// //                       <tr className="border-b">
// //                         <th className="text-left py-3">Product</th>
// //                         <th className="text-left py-3">Unit Price</th>
// //                         <th className="text-left py-3">Quantity</th>
// //                         <th className="text-left py-3">Total</th>
// //                         <th className="text-left py-3">Action</th>
// //                       </tr>
// //                     </thead>
// //                     <tbody>
// //                       {order.items && order.items.length > 0 ? (
// //                         order.items.map((item: any, index: number) => (
// //                           <tr key={index} className="border-b">
// //                             <td className="py-3">
// //                               <div className="flex items-center gap-3">
// //                                 {/* <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
// //                                   {item.product?.image ? (
// //                                     <Image
// //                                       src={item.order?.product.image}
// //                                       alt={item.product?.name || 'Product'}
// //                                       width={48}
// //                                       height={48}
// //                                       className="w-full h-full object-cover rounded"
// //                                       onError={(e) => {
// //                                         (e.target as HTMLImageElement).style.display = 'none';
// //                                       }}
// //                                     />
// //                                   ) : (
// //                                     <Package className="w-6 h-6 text-gray-400" />
// //                                   )}
// //                                 </div> */}
// //                                 <div>
// //                                   <p className="font-medium">{item.product?.name || 'Unknown Product'}</p>
// //                                   <p className="text-sm text-gray-500">
// //                                     {item.product?.category?.name || 'No Category'}
// //                                   </p>

// //                                 </div>
// //                               </div>
// //                             </td>
// //                             <td className="py-3 font-medium">₦{(item.price || item.unitPrice || 0).toLocaleString()}</td>
// //                             <td className="py-3">{item.quantity || 0}</td>
// //                             <td className="py-3 font-medium">₦{(item.totalPrice || item.lineTotal || (item.price * item.quantity) || 0).toLocaleString()}</td>
// //                             <td className="py-3">
// //                               <Button
// //                                 variant="ghost"
// //                                 size="sm"
// //                                 onClick={() => handleViewProduct(item.product || item)}
// //                                 className="flex items-center gap-1"
// //                               >
// //                                 <Eye className="w-4 h-4" />
// //                               </Button>
// //                             </td>
// //                           </tr>
// //                         ))
// //                       ) : (
// //                         <tr>
// //                           <td colSpan={5} className="py-8 text-center text-gray-500">
// //                             No products found
// //                           </td>
// //                         </tr>
// //                       )}
// //                     </tbody>
// //                   </table>
// //                 </div>
// //               </CardContent>
// //             </Card>

// //             {/* Admin Alerts (if any) */}
// //             {/* {order.adminAlerts && order.adminAlerts.length > 0 && (
// //               <Card>
// //                 <CardHeader>
// //                   <CardTitle className="flex items-center gap-2">
// //                     <AlertTriangle className="w-5 h-5 text-orange-500" />
// //                     Admin Alerts ({order.adminAlerts.length})
// //                   </CardTitle>
// //                 </CardHeader>
// //                 <CardContent>
// //                   <div className="space-y-3">
// //                     {order.adminAlerts.map((alert: any, index: number) => (
// //                       <div key={index} className={`p-3 rounded-lg border ${alert.isResolved ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
// //                         }`}>
// //                         <div className="flex items-center justify-between">
// //                           <span className="font-medium">{alert.alertType?.replace(/_/g, ' ')}</span>
// //                           <Badge variant={alert.isResolved ? 'default' : 'destructive'}>
// //                             {alert.isResolved ? 'Resolved' : 'Active'}
// //                           </Badge>
// //                         </div>
// //                         <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
// //                         {alert.isResolved && alert.resolvedAt && (
// //                           <p className="text-xs text-green-600 mt-1">
// //                             Resolved on {formatDateTime(alert.resolvedAt)}
// //                           </p>
// //                         )}
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </CardContent>
// //               </Card>
// //             )} */}
// //           </div>

// //           {/* Right Column - Customer & Summary */}
// //           <div className="space-y-6">
// //             {/* Customer Info */}
// //             <Card className="rounded-xl">
// //               <div className="flex items-center pt-6">
// //                 <CardHeader className="text-center">
// //                   <div className="w-[100px] h-[100px] rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
// //                     {profile?.profileImage ? (
// //                       <Image
// //                         src={profile.profileImage}
// //                         alt="Customer"
// //                         width={64}
// //                         height={64}
// //                         className="w-full h-full object-cover rounded-full"
// //                         onError={(e) => {
// //                           (e.target as HTMLImageElement).style.display = 'none';
// //                         }}
// //                       />
// //                     ) : (
// //                       <User className="w-8 h-8 text-gray-400" />
// //                     )}
// //                   </div>

// //                 </CardHeader>
// //                 <CardContent className="flex flex-col gap-2">
// //                   <CardTitle>{profile?.fullName || profile?.businessName || customer?.email || 'Unknown Customer'}</CardTitle>
// //                   <p className="text-sm normalize text-gray-500">{customer?.type || "Customer"}</p>
// //                   <div><Badge className="bg-green-100 text-green-800">ACTIVE</Badge></div>



// //                 </CardContent>
// //               </div>
// //               <Separator />
// //               {/* Shipping Address */}
// //               <CardHeader>
// //                 <CardTitle className="flex items-center gap-2">
// //                   <MapPin className="w-5 h-5" />
// //                   Shipping Address
// //                 </CardTitle>
// //               </CardHeader>
// //               <CardContent>
// //                 <div className="space-y-3">
// //                   <div className="flex items-center">
// //                     <p className="text-sm text-gray-500 w-[150px]">Primary address</p>
// //                     <p className="font-medium">
// //                       {shippingAddress?.fullAddress || profile?.address || "Address not available"}
// //                     </p>
// //                   </div>
// //                   <div className="grid grid-cols-1 gap-3 text-sm">
// //                     <div className="flex items-center">
// //                       <p className="text-gray-500 w-[150px]">City:</p>
// //                       <p className="font-medium">{shippingAddress?.city || "N/A"}</p>
// //                     </div>
// //                     <div className="flex items-center">
// //                       <p className="text-gray-500 w-[150px]">State</p>
// //                       <p className="font-medium">{shippingAddress?.stateProvince || "N/A"}</p>
// //                     </div >
// //                     <div className="flex items-center">
// //                       <p className="text-gray-500 w-[150px]">Country</p>
// //                       <p className="font-medium">{shippingAddress?.country || "Nigeria"}</p>
// //                     </div>
// //                     <div className="flex items-center">
// //                       <p className="text-gray-500 w-[150px]">Post Code</p>
// //                       <p className="font-medium">{shippingAddress?.postalCode || "N/A"}</p>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </CardContent>
// //             </Card>


// //             <Card>

// //             </Card>

// //             {/* Order Summary */}
// //             <Card>
// //               <CardHeader>
// //                 <CardTitle>Order Summary</CardTitle>
// //               </CardHeader>
// //               <CardContent>
// //                 <div className="space-y-3">
// //                   <div className="flex justify-between">
// //                     <span className="text-gray-600">Quantity:</span>
// //                     <span className="font-medium">{order.summary?.totalQuantity || order.items?.length || 0}</span>
// //                   </div>
// //                   <div className="flex justify-between">
// //                     <span className="text-gray-600">Sub Total:</span>
// //                     <span className="font-medium">₦{(order.summary?.itemsSubtotal || 0).toLocaleString()}</span>
// //                   </div>
// //                   <div className="flex justify-between">
// //                     <span className="text-gray-600">Tax:</span>
// //                     <span className="font-medium">6%</span>
// //                   </div>
// //                   <div className="flex justify-between">
// //                     <span className="text-gray-600">Shipping Fee:</span>
// //                     <span className="font-medium">₦{(order.summary?.shippingFee || 0).toLocaleString()}</span>
// //                   </div>
// //                   <div className="flex justify-between">
// //                     <span className="text-gray-600">Discount:</span>
// //                     <span className="font-medium text-red-500">-₦{(order.summary?.discount || 0).toLocaleString()}</span>
// //                   </div>
// //                   <Separator />
// //                   <div className="flex justify-between text-lg font-bold">
// //                     <span>Total Amount:</span>
// //                     <span>₦{(order.totalPrice || 0).toLocaleString()}</span>
// //                   </div>

// //                   {/* Enhanced Payment & Delivery Information */}
// //                   <PaymentInfoDisplay order={order} />
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Modals */}
// //       <OrderTrackingModal
// //         order={order}
// //         isOpen={trackingModalOpen}
// //         onClose={() => setTrackingModalOpen(false)}
// //       />

// //       <ProductDetailsModal
// //         product={selectedProduct}
// //         isOpen={productModalOpen}
// //         onClose={() => {
// //           setProductModalOpen(false);
// //           setSelectedProduct(null);
// //         }}
// //       />

// //       <RefundModal
// //         order={order}
// //         isOpen={refundModalOpen}
// //         onClose={() => setRefundModalOpen(false)}
// //         onRefundSuccess={handleRefundSuccess} // Optional custom success handler
// //       />

// //     </div>

// //   );
// // };

// // export default React.memo(OrderDetails);

// "use client";

// import React, { useMemo, useCallback, useState } from "react";
// import Image from "next/image";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { useGetOrderInfo, useProcessRefund } from "@/services/orders";
// import { RefundModal, PaymentInfoDisplay } from './refund';
// import { formatDate, formatDateTime } from "@/lib/utils";
// import { useRouter } from "next/navigation";
// import httpService from "@/services/httpService";
// import { routes } from "@/services/api-routes";
// import {
//   ArrowLeft,
//   Edit,
//   RefreshCw,
//   Truck,
//   Calendar,
//   Eye,
//   Package,
//   CreditCard,
//   MapPin,
//   User,
//   Phone,
//   Mail,
//   Download,
//   CheckCircle,
//   Circle,
//   Clock,
//   AlertCircle,
//   X,
//   ChevronDown,
//   AlertTriangle,
//   ShoppingCart
// } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
//   DropdownMenuLabel,
// } from "@/components/ui/dropdown-menu";
// import { toast } from "sonner";

// // Product Details Modal Component
// const ProductDetailsModal = React.memo(({
//   product,
//   onClose,
//   isOpen
// }: {
//   product: any;
//   onClose: () => void;
//   isOpen: boolean;
// }) => {
//   if (!product) return null;

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-2xl h-full flex flex-col right-0 overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-3 mb-4">
//             <Package className="w-5 h-5" />
//             <span className="text-xl font-semibold">Product Details</span>
//           </DialogTitle>
//         </DialogHeader>

//         <div className="space-y-6">
//           <div className="flex gap-6">
//             <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
//               {product.image ? (
//                 <Image
//                   src={product.image}
//                   alt={product.name}
//                   width={128}
//                   height={128}
//                   className="w-full h-full object-cover rounded-lg"
//                   onError={(e) => {
//                     (e.target as HTMLImageElement).style.display = 'none';
//                   }}
//                 />
//               ) : (
//                 <Package className="w-12 h-12 text-gray-400" />
//               )}
//             </div>
//             <div className="flex-1">
//               <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
//               <p className="text-gray-600 mb-4">{product.shortDescription}</p>
//               <div className="grid grid-cols-2 gap-4 text-sm">
//                 <div>
//                   <span className="text-gray-500">Category:</span>
//                   <p className="font-medium">{product.category?.name || "N/A"}</p>
//                 </div>
//                 <div>
//                   <span className="text-gray-500">Manufacturer:</span>
//                   <p className="font-medium">{product.manufacturer?.name || "N/A"}</p>
//                 </div>
//                 <div>
//                   <span className="text-gray-500">Processing Time:</span>
//                   <p className="font-medium">{product.processingTime || 'N/A'} days</p>
//                 </div>
//                 <div>
//                   <span className="text-gray-500">Returns:</span>
//                   <p className="font-medium">{product.acceptsReturns ? "Accepted" : "Not Accepted"}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-end">
//             <Button onClick={onClose} variant="outline">
//               Close
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// });

// ProductDetailsModal.displayName = 'ProductDetailsModal';

// // Order Tracking Modal Component
// const OrderTrackingModal = React.memo(({
//   order,
//   onClose,
//   isOpen
// }: {
//   order: any;
//   onClose: () => void;
//   isOpen: boolean;
// }) => {
//   if (!order) return null;

//   // Calculate estimated delivery date based on items
//   const calculateEstimatedDelivery = useCallback((orderData: any) => {
//     if (!orderData?.items?.length) return null;
    
//     let maxProcessingDays = 0;
//     let maxDeliveryDays = 0;
    
//     orderData.items.forEach((item: any) => {
//       const product = item.product || item;
//       if (product.processingTimeDays > maxProcessingDays) {
//         maxProcessingDays = product.processingTimeDays;
//       }
//       if (product.maxDeliveryDays > maxDeliveryDays) {
//         maxDeliveryDays = product.maxDeliveryDays;
//       }
//     });
    
//     if (maxProcessingDays === 0 && maxDeliveryDays === 0) {
//       // Default fallback if no data available
//       maxProcessingDays = 2;
//       maxDeliveryDays = 7;
//     }
    
//     const totalDays = maxProcessingDays + maxDeliveryDays;
//     const date = new Date(orderData.createdAt);
//     date.setDate(date.getDate() + totalDays);
    
//     return formatDate(date.toISOString());
//   }, []);

//   const getTrackingSteps = useMemo(() => (status: string, paymentStatus: string) => {
//     // Determine the initial step based on payment status
//     const paymentStep = {
//       id: 1,
//       name: paymentStatus === "PAID" || paymentStatus === "PARTIALLY_PAID" ? "Order Confirmed" : "Payment Pending",
//       status: paymentStatus === "PAID" || paymentStatus === "PARTIALLY_PAID" ? "completed" : "current",
//       icon: paymentStatus === "PAID" || paymentStatus === "PARTIALLY_PAID" ? 
//         <CheckCircle className="w-6 h-6" /> : <CreditCard className="w-6 h-6" />,
//       description: paymentStatus === "PAID" || paymentStatus === "PARTIALLY_PAID" ? 
//         "Order has been confirmed" : "Waiting for payment"
//     };

//     const steps = [
//       paymentStep,
//       {
//         id: 2,
//         name: "Processing",
//         status: ["PROCESSING", "SHIPPED", "DELIVERED", "COMPLETED"].includes(status) ? 
//           (status === "PROCESSING" ? "current" : "completed") : "pending",
//         icon: <Package className="w-6 h-6" />,
//         description: "Order is being prepared"
//       },
//       {
//         id: 3,
//         name: "Shipped",
//         status: status === "SHIPPED" ? "current" : 
//           ["DELIVERED", "COMPLETED"].includes(status) ? "completed" : "pending",
//         icon: <Truck className="w-6 h-6" />,
//         description: "Order is on the way"
//       },
//       {
//         id: 4,
//         name: "Delivered",
//         status: ["DELIVERED", "COMPLETED"].includes(status) ? "completed" : "pending",
//         icon: <CheckCircle className="w-6 h-6" />,
//         description: "Order has been delivered"
//       },
//     ];
//     return steps;
//   }, []);

//   const trackingSteps = useMemo(() =>
//     getTrackingSteps(order.status, order.paymentStatus),
//     [order.status, order.paymentStatus, getTrackingSteps]
//   );

//   const estimatedDelivery = useMemo(() => 
//     calculateEstimatedDelivery(order), 
//     [order, calculateEstimatedDelivery]
//   );

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-4xl h-full flex flex-col  right-0">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-3 mb-4">
//             <Truck className="w-6 h-6" />
//             <span className="text-2xl font-semibold">Order Tracking</span>
//           </DialogTitle>
//         </DialogHeader>

//         <div className="space-y-6">
//           {/* Progress Tracker */}
//           <div className="mb-8">
//             <div className="flex items-center justify-between relative">
//               <div className="absolute top-6 left-10 right-0 h-0.5 bg-gray-200 z-0"></div>

//               {trackingSteps.map((step) => (
//                 <div key={step.id} className="flex flex-col items-center relative z-10 bg-white px-2">
//                   <div
//                     className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 border-4 border-white shadow-sm ${step.status === "completed"
//                       ? "bg-green-500 text-white"
//                       : step.status === "current"
//                         ? "bg-yellow-500 text-white"
//                         : "bg-gray-200 text-gray-400"
//                       }`}
//                   >
//                     {step.icon}
//                   </div>
//                   <span
//                     className={`text-xs text-center font-medium max-w-20 ${step.status === "completed" || step.status === "current"
//                       ? "text-gray-800"
//                       : "text-gray-400"
//                       }`}
//                   >
//                     {step.name}
//                   </span>
//                   <span className="text-xs text-gray-500 text-center max-w-24 mt-1">
//                     {step.description}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Order Details */}
//           <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
//             <div>
//               <h3 className="font-semibold mb-3">Order Information</h3>
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Order ID:</span>
//                   <span className="font-medium">#{order.id}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Date:</span>
//                   <span className="font-medium">{formatDate(order.createdAt)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Status:</span>
//                   <Badge variant={order.status === "DELIVERED" ? "default" : "secondary"}>
//                     {order.status}
//                   </Badge>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Total Amount:</span>
//                   <span className="font-medium">₦{(order.totalPrice || 0).toLocaleString()}</span>
//                 </div>
//               </div>
//             </div>

//             <div>
//               <h3 className="font-semibold mb-3">Shipping Information</h3>
//               <div className="space-y-2 text-sm">
//                 {order.shipping && (
//                   <>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Distance:</span>
//                       <span className="font-medium">{order.shipping.distance} km</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Shipping Fee:</span>
//                       <span className="font-medium">₦{(order.shipping.totalShippingFee || 0).toLocaleString()}</span>
//                     </div>
//                   </>
//                 )}
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Estimated Delivery:</span>
//                   <span className="font-medium">
//                     {estimatedDelivery || (() => {
//                       const date = new Date(order.createdAt);
//                       date.setDate(date.getDate() + 7);
//                       return formatDate(date.toISOString());
//                     })()}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-end pt-4">
//             <Button onClick={onClose} className="bg-orange-500 hover:bg-orange-600">
//               Close
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// });

// OrderTrackingModal.displayName = 'OrderTrackingModal';

// // Type definitions
// interface OrderStatus {
//   variant: 'default' | 'secondary' | 'destructive' | 'outline';
//   text: string;
// }

// interface StatusTransition {
//   value: string;
//   label: string;
//   icon: React.ComponentType<{ className?: string }>;
//   color: string;
// }

// // Enhanced order data type matching your backend response
// interface ProcessedOrderData {
//   id: any;
//   orderId?: string;
//   status: string;
//   totalPrice: number;
//   createdAt: string;
//   updatedAt?: string;
//   paymentStatus: string;
//   orderType?: string;
//   user: any;
//   items: any[];
//   timeline: any[];
//   shipping: any;
//   breakdown: any;
//   summary: any;
//   transactions?: any[];
//   adminAlerts?: any[];
//   notes?: any[];
//   // Payment fields from your controller
//   amountPaid?: number;
//   amountDue?: number;
//   [key: string]: any;
// }

// // // Main Order Details Component
// // interface OrderDetailsProps {
// //   orderId?: string;
// //   setClose?: React.Dispatch<React.SetStateAction<boolean>>;
// //   isModal?: boolean;
// // }

// // const OrderDetails: React.FC<OrderDetailsProps> = ({
// //   orderId,
// //   setClose,
// //   isModal = false
// // }) => {
// //   const router = useRouter();
// //   const [trackingModalOpen, setTrackingModalOpen] = useState(false);
// //   const [productModalOpen, setProductModalOpen] = useState(false);
// //   const [selectedProduct, setSelectedProduct] = useState(null);
// //   const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
// //   const [refundModalOpen, setRefundModalOpen] = useState(false);

// //   const processRefundMutation = useProcessRefund();

// //   // Validate orderId before proceeding
// //   if (!orderId) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <div className="text-center max-w-md mx-auto p-6">
// //           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
// //             <AlertCircle className="w-8 h-8 text-red-600" />
// //           </div>
// //           <h2 className="text-xl font-semibold text-gray-900 mb-2">
// //             Invalid Order ID
// //           </h2>
// //           <p className="text-gray-600 mb-6">
// //             No order ID was provided. Please check the URL and try again.
// //           </p>
// //           <Button onClick={() => router.back()} className="bg-orange-500 hover:bg-orange-600">
// //             {isModal ? "Close" : "Go Back"}
// //           </Button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const {
// //     getOrderInfoData: rawData,
// //     getOrderInfoIsLoading,
// //     getOrderInfoError,
// //     refetchOrderInfo,
// //   } = useGetOrderInfo({
// //     enabled: Boolean(orderId),
// //     orderId: orderId
// //   } as any);

// //   // Helper functions for safe property access
// //   const getAmountPaid = useCallback((orderData: any): number => {
// //     return typeof orderData?.amountPaid === 'number' ? orderData.amountPaid :
// //       typeof orderData?.breakdown?.amountPaid === 'number' ? orderData.breakdown.amountPaid : 0;
// //   }, []);

// //   const getAmountDue = useCallback((orderData: any): number => {
// //     return typeof orderData?.amountDue === 'number' ? orderData.amountDue :
// //       typeof orderData?.breakdown?.amountDue === 'number' ? orderData.breakdown.amountDue : 0;
// //   }, []);

// //   // Calculate estimated delivery date based on items
// //   const calculateEstimatedDelivery = useCallback((orderData: any) => {
// //     if (!orderData?.items?.length) return null;
    
// //     let maxProcessingDays = 0;
// //     let maxDeliveryDays = 0;
    
// //     orderData.items.forEach((item: any) => {
// //       const product = item.product || item;
// //       if (product.processingTimeDays > maxProcessingDays) {
// //         maxProcessingDays = product.processingTimeDays;
// //       }
// //       if (product.maxDeliveryDays > maxDeliveryDays) {
// //         maxDeliveryDays = product.maxDeliveryDays;
// //       }
// //     });
    
// //     if (maxProcessingDays === 0 && maxDeliveryDays === 0) {
// //       // Default fallback if no data available
// //       maxProcessingDays = 2;
// //       maxDeliveryDays = 7;
// //     }
    
// //     const totalDays = maxProcessingDays + maxDeliveryDays;
// //     const date = new Date(orderData.createdAt);
// //     date.setDate(date.getDate() + totalDays);
    
// //     return formatDate(date.toISOString());
// //   }, []);

// //   // Determine payment type and schedule based on available data
// //   const getPaymentInfo = useCallback((order: any) => {
// //     const paymentStatus = order.paymentStatus || 'PENDING';
// //     const orderType = order.orderType || 'IMMEDIATE';

// //     // Determine if it's pay on delivery based on amount due vs total
// //     const totalPrice = order.totalPrice || 0;
// //     const amountPaid = getAmountPaid(order);
// //     const amountDue = getAmountDue(order);

// //     const isPayOnDelivery = amountDue === totalPrice && amountPaid === 0 && paymentStatus === 'PENDING';
// //     const requiresImmediatePayment = paymentStatus === 'PENDING' && !isPayOnDelivery;
// //     const isScheduled = orderType === 'SCHEDULED' || Boolean(order.scheduledDeliveryDate);

// //     return {
// //       paymentStatus,
// //       orderType,
// //       isPayOnDelivery,
// //       requiresImmediatePayment,
// //       isScheduled,
// //       method: isPayOnDelivery ? 'Pay on Delivery' : 'Online Payment'
// //     };
// //   }, [getAmountPaid, getAmountDue]);

// //   // Memoized callbacks to prevent infinite loops
// //   const handleViewProduct = useCallback((product: any) => {
// //     setSelectedProduct(product);
// //     setProductModalOpen(true);
// //   }, []);

// //   const handleOpenTrackingModal = useCallback(() => {
// //     setTrackingModalOpen(true);
// //   }, []);

// //   const handleClose = useCallback(() => {
// //     if (setClose) {
// //       setClose(false);
// //     } else {
// //       router.back();
// //     }
// //   }, [setClose, router]);

// //   const handleStatusUpdate = useCallback(async (newStatus: string) => {
// //     if (!orderId) {
// //       toast.error('No order ID available');
// //       return;
// //     }

// //     setIsUpdatingStatus(true);

// //     try {
// //       const response = await httpService.patchData(
// //         {
// //           status: newStatus,
// //           notes: `Status updated to ${newStatus} via admin panel`
// //         },
// //         routes.updateOrderStatus(orderId)
// //       );

// //       if (refetchOrderInfo) {
// //         await refetchOrderInfo();
// //       }

// //       toast.success(`Order status successfully updated to ${newStatus}`);
// //     } catch (error: any) {
// //       console.error('Failed to update order status:', error);
// //       toast.error(`Failed to update order status: ${error?.message || 'Unknown error'}`);
// //     } finally {
// //       setIsUpdatingStatus(false);
// //     }
// //   }, [orderId, refetchOrderInfo]);

// //   const handleRefundSuccess = useCallback(() => {
// //     // Custom logic after successful refund
// //     console.log('Refund completed successfully');

// //     // Refresh order data
// //     if (refetchOrderInfo) {
// //       refetchOrderInfo();
// //     }

// //     // Optional: Show additional success message or redirect
// //     toast.success('Order refunded and data refreshed');
// //   }, [refetchOrderInfo]);

// //   const handleRetry = useCallback(() => {
// //     if (refetchOrderInfo) {
// //       refetchOrderInfo();
// //     }
// //   }, [refetchOrderInfo]);

// //   // Memoized processed data based on your controller's response structure
// //   const processedOrderData = useMemo((): ProcessedOrderData | null => {
// //     if (!rawData) return null;

// //     return {
// //       ...rawData,
// //       id: rawData.id,
// //       orderId: rawData.orderId || `#${String(rawData.id || '').padStart(6, '0')}`,
// //       status: rawData.status || 'PENDING',
// //       totalPrice: Number(rawData.totalPrice) || 0,
// //       createdAt: rawData.createdAt || new Date().toISOString(),
// //       paymentStatus: rawData.paymentStatus || 'PENDING',
// //       orderType: rawData.orderType || 'IMMEDIATE',
// //       items: Array.isArray(rawData.items) ? rawData.items : [],
// //       timeline: Array.isArray(rawData.timeline) ? rawData.timeline : [],
// //       user: rawData.user || {},
// //       summary: rawData.summary || {},
// //       breakdown: rawData.breakdown || {},
// //       shipping: rawData.shipping || null,
// //       transactions: rawData.transactions || [],
// //       adminAlerts: rawData.adminAlerts || [],
// //       notes: rawData.notes || [],
// //       amountPaid: rawData.amountPaid || rawData.breakdown?.amountPaid || 0,
// //       amountDue: rawData.amountDue || rawData.breakdown?.amountDue || 0,
// //     };
// //   }, [rawData]);

// //   // Memoized shipping address calculation
// //   const shippingAddress = useMemo(() => {
// //     if (!processedOrderData) return null;

// //     // Look for shipping address in timeline or user profile
// //     const orderCreatedEvent = processedOrderData.timeline?.find((event: any) =>
// //       event?.action === 'ORDER_CREATED' && event?.details?.shippingAddress
// //     );

// //     if (orderCreatedEvent?.details?.shippingAddress) {
// //       return orderCreatedEvent.details.shippingAddress;
// //     }

// //     // Fallback to user profile address
// //     const user = processedOrderData.user;
// //     if (user?.profile?.address || user?.businessProfile?.businessAddress) {
// //       return {
// //         fullAddress: user.profile?.address || user.businessProfile?.businessAddress,
// //         city: 'N/A',
// //         stateProvince: 'N/A',
// //         country: 'Nigeria',
// //         postalCode: 'N/A'
// //       };
// //     }

// //     return null;
// //   }, [processedOrderData]);

// //   // Memoized status info
// //   const statusInfo = useMemo(() => {
// //     if (!processedOrderData) return { variant: 'secondary' as const, text: 'Unknown' };

// //     const statusMap: Record<string, OrderStatus> = {
// //       'PENDING': { variant: 'secondary' as const, text: 'Pending' },
// //       'SCHEDULED': { variant: 'secondary' as const, text: 'Scheduled' },
// //       'PROCESSING': { variant: 'default' as const, text: 'Processing' },
// //       'ONGOING': { variant: 'default' as const, text: 'Ongoing' },
// //       'SHIPPED': { variant: 'default' as const, text: 'Shipped' },
// //       'DELIVERED': { variant: 'default' as const, text: 'Delivered' },
// //       'COMPLETED': { variant: 'default' as const, text: 'Completed' },
// //       'CANCELLED': { variant: 'destructive' as const, text: 'Cancelled' }
// //     };
// //     return statusMap[processedOrderData.status] || { variant: 'secondary' as const, text: processedOrderData.status };
// //   }, [processedOrderData]);

// //   // Memoized available transitions (without cancel option)
// //   const availableTransitions = useMemo(() => {
// //     if (!processedOrderData) return [];
    
// //     // Disable transitions if order is delivered
// //     if (processedOrderData.status === "DELIVERED" || processedOrderData.status === "COMPLETED") {
// //       return [];
// //     }

// //     const statusTransitions: Record<string, StatusTransition[]> = {
// //       'PENDING': [
// //         { value: 'PROCESSING', label: 'Start Processing', icon: Package, color: 'text-blue-600' }
// //       ],
// //       'SCHEDULED': [
// //         { value: 'PENDING', label: 'Mark as Pending', icon: Clock, color: 'text-orange-600' },
// //         { value: 'PROCESSING', label: 'Start Processing', icon: Package, color: 'text-blue-600' }
// //       ],
// //       'PROCESSING': [
// //         { value: 'SHIPPED', label: 'Mark as Shipped', icon: Truck, color: 'text-purple-600' }
// //       ],
// //       'ONGOING': [
// //         { value: 'PROCESSING', label: 'Start Processing', icon: Package, color: 'text-blue-600' },
// //         { value: 'SHIPPED', label: 'Mark as Shipped', icon: Truck, color: 'text-purple-600' }
// //       ],
// //       'SHIPPED': [
// //         { value: 'DELIVERED', label: 'Mark as Delivered', icon: CheckCircle, color: 'text-green-600' }
// //       ],
// //       'CANCELLED': [],
// //       'COMPLETED': []
// //     };

// //     return statusTransitions[processedOrderData.status] || [];
// //   }, [processedOrderData]);

// //   // Calculate estimated delivery
// //   const estimatedDelivery = useMemo(() => 
// //     calculateEstimatedDelivery(processedOrderData), 
// //     [processedOrderData, calculateEstimatedDelivery]
// //   );

// //   // Loading state
// //   if (getOrderInfoIsLoading) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <div className="text-center">
// //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
// //           <p className="text-lg font-medium">Loading order details...</p>
// //           <p className="text-sm text-gray-500 mt-2">Order #{orderId}</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // Error state
// //   if (getOrderInfoError) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <div className="text-center max-w-md mx-auto p-6">
// //           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
// //             <AlertCircle className="w-8 h-8 text-red-600" />
// //           </div>
// //           <h2 className="text-xl font-semibold text-gray-900 mb-2">
// //             Error Loading Order
// //           </h2>
// //           <p className="text-gray-600 mb-6">
// //             {getOrderInfoError}
// //           </p>
// //           <div className="flex gap-3 justify-center">
// //             <Button variant="outline" onClick={handleClose}>
// //               {isModal ? "Close" : "Go Back"}
// //             </Button>
// //             <Button onClick={handleRetry} className="bg-orange-500 hover:bg-orange-600">
// //               <RefreshCw className="w-4 h-4 mr-2" />
// //               Try Again
// //             </Button>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // Empty state
// //   if (!processedOrderData) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <div className="text-center max-w-md mx-auto p-6">
// //           <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
// //             <Package className="w-8 h-8 text-gray-400" />
// //           </div>
// //           <h2 className="text-xl font-semibold text-gray-900 mb-2">
// //             Order Not Found
// //           </h2>
// //           <p className="text-gray-600 mb-6">
// //             The order #{orderId} could not be found.
// //           </p>
// //           <div className="flex gap-3 justify-center">
// //             <Button variant="outline" onClick={handleClose}>
// //               {isModal ? "Close" : "Go Back"}
// //             </Button>
// //             <Button onClick={handleRetry} className="bg-orange-500 hover:bg-orange-600">
// //               <RefreshCw className="w-4 h-4 mr-2" />
// //               Try Again
// //             </Button>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // At this point, we have valid data
// //   const order = processedOrderData;
// //   const customer = order.user;
// //   const profile = customer?.profile || customer?.businessProfile;
// //   const paymentInfo = getPaymentInfo(order);

// //   return (
// //     <div className="min-h-screen bg-[#F8F8F8] -50">
// //       <div className=" mx-12  bg-[#fdfafa] p-6">
// //         {/* Header */}
// //         <div className="flex items-center justify-between mb-6">
// //           <div className="flex flex-col items-start gap-2">
// //             <h1 className="text-3xl font-bold">Order Details</h1>
// //             <p className="text-[#687588]">Manage orders</p>
// //           </div>

// //         </div>

// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// //           {/* Left Column - Order Info */}
// //           <div className="lg:col-span-2 space-y-6">
// //             {/* Order Header */}
// //             <Card className="bg-white rounded-lg">
// //               <CardContent className="p-6">
// //                 <div className="flex items-center justify-between mb-4">
// //                   <div className="">
// //                     <div className="flex gap-5 mb-2">
// //                       <h2 className="text-xl font-semibold">Order {order.orderId || `#${order.id}`}</h2>
// //                       <Badge variant={statusInfo.variant} className="px-3 py-1">
// //                         {statusInfo.text}
// //                       </Badge>
// //                     </div>
// //                     <p className="text-gray-500 text-sm">
// //                       Order / Order Details / Order {order.orderId || `#${order.id}`} - {formatDateTime(order.createdAt)}
// //                     </p>

// //                   </div>
// //                   <div>
// //                     <div className="flex flex-row gap-2">
// //                       <div className="flex gap-2">

// //                         <Button
// //                           variant="outline"
// //                           size="sm"
// //                           onClick={() => setRefundModalOpen(true)}
// //                           disabled={
// //                             processRefundMutation.isPending ||
// //                             order.paymentStatus !== 'PAID' ||
// //                             ['REFUNDED', 'CANCELLED'].includes(order.status)
// //                           }
// //                         >
// //                           <Download className="w-4 h-4 mr-2" />
// //                           {processRefundMutation.isPending ? 'Processing...' : 'Refund'}
// //                         </Button>
// //                       </div>

// //                       {/* Status Update Dropdown */}
// //                       <DropdownMenu>
// //                         <DropdownMenuTrigger asChild>
// //                           <Button
// //                             className="bg-[#FFBF3B] text-black font-semibold flex items-center gap-2"
// //                             disabled={isUpdatingStatus || availableTransitions.length === 0 || order.status === "DELIVERED"}
// //                           >
// //                             {isUpdatingStatus ? (
// //                               <>
// //                                 <RefreshCw className="w-4 h-4 animate-spin" />
// //                                 Updating...
// //                               </>
// //                             ) : (
// //                               <>

// //                                 Edit Order

// //                               </>
// //                             )}
// //                           </Button>
// //                         </DropdownMenuTrigger>
// //                         <DropdownMenuContent align="end" className="w-56">
// //                           <DropdownMenuLabel className="flex items-center gap-2">
// //                             <ShoppingCart className="w-4 h-4" />
// //                             Update Order Status
// //                           </DropdownMenuLabel>
// //                           <DropdownMenuSeparator />

// //                           <div className="px-2 py-1.5 text-xs text-gray-500">
// //                             Current: <span className="font-medium text-gray-700">{statusInfo.text}</span>
// //                           </div>
// //                           <DropdownMenuSeparator />

// //                           {availableTransitions.length === 0 ? (
// //                             <div className="px-2 py-2 text-sm text-gray-500 italic">
// //                               {order.status === "DELIVERED" || order.status === "COMPLETED" 
// //                                 ? "Order completed - no changes allowed" 
// //                                 : "No status changes available"}
// //                             </div>
// //                           ) : (
// //                             availableTransitions.map((transition) => {
// //                               const IconComponent = transition.icon;
// //                               return (
// //                                 <DropdownMenuItem
// //                                   key={transition.value}
// //                                   onClick={() => handleStatusUpdate(transition.value)}
// //                                   className="flex items-center gap-2 cursor-pointer"
// //                                 >
// //                                   <IconComponent className={`w-4 h-4 ${transition.color}`} />
// //                                   <span>{transition.label}</span>
// //                                 </DropdownMenuItem>
// //                               );
// //                             })
// //                           )}
// //                         </DropdownMenuContent>
// //                       </DropdownMenu>


// //                     </div>
// //                   </div>

// //                 </div>


// //                 {/* Progress Bar */}
// //                 <div className="mb-6">
// //                   <h3 className="text-sm font-medium mb-6">Order Progress</h3>

// //                   <div className="relative">
// //                     {/* Progress line container */}
// //                     <div className="absolute top-4 left-0 right-0 h-2 bg-gray-200 rounded-full z-0"></div>

// //                     {/* Active progress line */}
// //                     <div
// //                       className="absolute top-4 left-0 h-2 bg-green-500 rounded-full z-0 transition-all duration-500"
// //                       style={{
// //                         width: `${(() => {
// //                           // Define steps based on payment status and order status
// //                           const paymentCompleted = order.paymentStatus === "PAID" || order.paymentStatus === "PARTIALLY_PAID";
// //                           const steps = [
// //                             { 
// //                               key: "PAYMENT", 
// //                               completed: paymentCompleted 
// //                             },
// //                             { 
// //                               key: "PROCESSING", 
// //                               completed: ["PROCESSING", "ONGOING", "SHIPPED", "DELIVERED", "COMPLETED"].includes(order.status) 
// //                             },
// //                             { 
// //                               key: "SHIPPING", 
// //                               completed: ["SHIPPED", "DELIVERED", "COMPLETED"].includes(order.status) 
// //                             },
// //                             { 
// //                               key: "DELIVERED", 
// //                               completed: ["DELIVERED", "COMPLETED"].includes(order.status) 
// //                             }
// //                           ];

// //                           const completedSteps = steps.filter(step => step.completed).length;
// //                           return (completedSteps / steps.length) * 100;
// //                         })()}%`
// //                       }}
// //                     />

// //                     {/* Progress steps */}
// //                     <div className="relative z-10 flex items-center justify-between">
// //                       {[
// //                         {
// //                           label: order.paymentStatus === "PAID" || order.paymentStatus === "PARTIALLY_PAID" 
// //                             ? "Order Confirmed" 
// //                             : "Payment Pending",
// //                           status: order.paymentStatus === "PAID" || order.paymentStatus === "PARTIALLY_PAID" 
// //                             ? "completed" 
// //                             : "current",
// //                           isActive: true
// //                         },
// //                         {
// //                           label: "Processing",
// //                           status: ["PROCESSING", "ONGOING"].includes(order.status) ? "current" :
// //                             ["SHIPPED", "DELIVERED", "COMPLETED"].includes(order.status) ? "completed" : "pending",
// //                           isActive: ["PROCESSING", "ONGOING", "SHIPPED", "DELIVERED", "COMPLETED"].includes(order.status),
// //                           showSpinner: ["PROCESSING", "ONGOING"].includes(order.status)
// //                         },
// //                         {
// //                           label: "Shipping",
// //                           status: order.status === "SHIPPED" ? "current" :
// //                             ["DELIVERED", "COMPLETED"].includes(order.status) ? "completed" : "pending",
// //                           isActive: ["SHIPPED", "DELIVERED", "COMPLETED"].includes(order.status)
// //                         },
// //                         {
// //                           label: "Delivered",
// //                           status: ["DELIVERED", "COMPLETED"].includes(order.status) ? "completed" : "pending",
// //                           isActive: ["DELIVERED", "COMPLETED"].includes(order.status)
// //                         }
// //                       ].map((step, index) => (
// //                         <div key={index} className="flex flex-col items-center bg-white px-1">
// //                           {/* Step indicator - just colored dots */}
// //                           <div
// //                             className={`w-3 h-3 rounded-full mb-3 transition-all duration-300 ${step.status === "completed"
// //                               ? "bg-green-500"
// //                               : step.status === "current"
// //                                 ? "bg-yellow-500"
// //                                 : "bg-gray-300"
// //                               }`}
// //                           />


// //                           {/* Step label */}
// //                           <span
// //                             className={`text-xs text-center font-medium max-w-20 leading-tight ${step.isActive || step.status === "completed"
// //                               ? "text-gray-800"
// //                               : "text-gray-400"
// //                               }`}
// //                           >
// //                             {step.label}
// //                           </span>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   </div>

// //                   {/* Bottom section with delivery info and tracking */}
// //                   <div className="flex justify-between items-center mt-8">
// //                     <div className="text-sm text-gray-500 flex items-center gap-2">
// //                       <Calendar className="w-4 h-4" />
// //                       Estimated delivery: {estimatedDelivery || (() => {
// //                         const date = new Date(order.createdAt);
// //                         date.setDate(date.getDate() + 7);
// //                         return formatDate(date.toISOString());
// //                       })()}
// //                     </div>
// //                     <div>
// //                       <Button
// //                         variant="outline"
// //                         onClick={handleOpenTrackingModal}
// //                         className="flex items-center gap-2 bg-[#FFBF3B] font-semibold"
// //                       >
// //                         <Truck className="w-4 h-4" />
// //                         Track order
// //                       </Button>
// //                     </div>
// //                   </div>
// //                 </div>

// //                 {/* Payment and Schedule Information */}
// //                 <div className="mt-6 p-4 bg-gray-50 rounded-lg">
// //                   <h4 className="font-bold mb-3">Payment & Schedule Information</h4>
// //                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
// //                     <div>
// //                       <span className="font-bold">Payment Method:</span>
// //                       <p className="font-medium">{paymentInfo.method}</p>
// //                     </div>
// //                     <div>
// //                       <span className="font-bold">Order Type:</span>
// //                       <p className="font-medium">{paymentInfo.orderType}</p>
// //                     </div>
// //                     <div>
// //                       <span className="font-bold">Payment Status:</span>
// //                       <Badge variant={order.paymentStatus === 'PAID' ? 'default' : 'secondary'} className="ml-2">
// //                         {order.paymentStatus}
// //                       </Badge>
// //                     </div>
// //                     <div>
// //                       <span className="font-bold">Schedule Type:</span>
// //                       <Badge variant={paymentInfo.isScheduled ? 'secondary' : 'default'} className="ml-2">
// //                         {paymentInfo.isScheduled ? 'Scheduled' : 'Immediate'}
// //                       </Badge>
// //                     </div>
// //                   </div>

// //                   {/* Payment Urgency Indicators */}
// //                   <div className="mt-3 flex gap-2">
// //                     {paymentInfo.requiresImmediatePayment && (
// //                       <Badge className="bg-red-100 text-red-800 text-xs">
// //                         ⚠️ Payment Required
// //                       </Badge>
// //                     )}
// //                     {paymentInfo.isPayOnDelivery && (
// //                       <Badge className="bg-yellow-50 text-black text-xs">
// //                         💰 Pay on Delivery
// //                       </Badge>
// //                     )}
// //                     {paymentInfo.isScheduled && (
// //                       <Badge className="bg-purple-100 text-purple-800 text-xs">
// //                         📅 Scheduled Order
// //                       </Badge>
// //                     )}
// //                     {order.paymentStatus === 'PAID' && (
// //                       <Badge className="bg-green-100 text-green-800 text-xs">
// //                         ✅ Payment Complete
// //                       </Badge>
// //                     )}
// //                   </div>
// //                 </div>
// //               </CardContent>
// //             </Card>

// //             {/* Order Timeline */}
// //             <Card className="rounded-xl">
// //               <CardHeader>
// //                 <CardTitle className="text-2xl">Order Timeline</CardTitle>
// //               </CardHeader>
// //               <CardContent>
// //                 <div className="space-y-4">
// //                   {order.timeline && order.timeline.length > 0 ? (
// //                     order.timeline.map((event: any, index: number) => (
// //                       <div key={index} className="flex gap-3">
// //                         <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0">
// //                           <Package className="w-4 h-4 text-white" />
// //                         </div>
// //                         <div className="flex-1">
// //                           <div className="flex items-center justify-between">
// //                             <h4 className="font-medium text-xl lowercase">{event?.action?.replace?.(/_/g, ' ') || 'Order Update'}</h4>
// //                             <span className="text-sm text-gray-500">
// //                               {formatDateTime(event?.createdAt || order.createdAt)}
// //                             </span>
// //                           </div>
// //                           <p className="text-sm text-gray-600">
// //                             {event?.details?.description ||
// //                               event?.details?.adminNotes ||
// //                               "Order status updated"}
// //                           </p>
// //                           {event?.details?.previousStatus && (
// //                             <p className="text-xs text-gray-500 mt-1">
// //                               Changed from {event.details.previousStatus} to {event.status}
// //                             </p>
// //                           )}
// //                         </div>
// //                       </div>
// //                     ))
// //                   ) : (
// //                     <div className="text-center py-8 text-gray-500">
// //                       <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
// //                       <p>No timeline events available</p>
// //                     </div>
// //                   )}
// //                 </div>
// //               </CardContent>
// //             </Card>

// //             {/* Product Table */}
// //             <Card className="rounded-xl">
// //               <CardHeader>
// //                 <CardTitle>Products ({order.items?.length || 0} items)</CardTitle>
// //               </CardHeader>
// //               <CardContent>
// //                 <div className="overflow-x-auto">
// //                   <table className="w-full">
// //                     <thead>
// //                       <tr className="border-b">
// //                         <th className="text-left py-3">Product</th>
// //                         <th className="text-left py-3">Unit Price</th>
// //                         <th className="text-left py-3">Quantity</th>
// //                         <th className="text-left py-3">Total</th>
// //                         <th className="text-left py-3">Action</th>
// //                       </tr>
// //                     </thead>
// //                     <tbody>
// //                       {order.items && order.items.length > 0 ? (
// //                         order.items.map((item: any, index: number) => (
// //                           <tr key={index} className="border-b">
// //                             <td className="py-3">
// //                               <div className="flex items-center gap-3">
                        
// //                                 <div>
// //                                   <p className="font-medium">{item.product?.name || 'Unknown Product'}</p>
// //                                   <p className="text-sm text-gray-500">
// //                                     {item.product?.category?.name || 'No Category'}
// //                                   </p>

// //                                 </div>
// //                               </div>
// //                             </td>
// //                             <td className="py-3 font-medium">₦{(item.price || item.unitPrice || 0).toLocaleString()}</td>
// //                             <td className="py-3">{item.quantity || 0}</td>
// //                             <td className="py-3 font-medium">₦{(item.totalPrice || item.lineTotal || (item.price * item.quantity) || 0).toLocaleString()}</td>
// //                             <td className="py-3">
// //                               <Button
// //                                 variant="ghost"
// //                                 size="sm"
// //                                 onClick={() => handleViewProduct(item.product || item)}
// //                                 className="flex items-center gap-1"
// //                               >
// //                                 <Eye className="w-4 h-4" />
// //                               </Button>
// //                             </td>
// //                           </tr>
// //                         ))
// //                       ) : (
// //                         <tr>
// //                           <td colSpan={5} className="py-8 text-center text-gray-500">
// //                             No products found
// //                           </td>
// //                         </tr>
// //                       )}
// //                     </tbody>
// //                   </table>
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           </div>

// //           {/* Right Column - Customer & Summary */}
// //           <div className="space-y-6">
// //             {/* Customer Info */}
// //             <Card className="rounded-xl">
// //               <div className="flex items-center pt-6">
// //                 <CardHeader className="text-center">
// //                   <div className="w-[100px] h-[100px] rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
// //                     {profile?.profileImage ? (
// //                       <Image
// //                         src={profile.profileImage}
// //                         alt="Customer"
// //                         width={64}
// //                         height={64}
// //                         className="w-full h-full object-cover rounded-full"
// //                         onError={(e) => {
// //                           (e.target as HTMLImageElement).style.display = 'none';
// //                         }}
// //                       />
// //                     ) : (
// //                       <User className="w-8 h-8 text-gray-400" />
// //                     )}
// //                   </div>

// //                 </CardHeader>
// //                 <CardContent className="flex flex-col gap-2">
// //                   <CardTitle>{profile?.fullName || profile?.businessName || customer?.email || 'Unknown Customer'}</CardTitle>
// //                   <p className="text-sm normalize text-gray-500">{customer?.type || "Customer"}</p>
// //                   <div><Badge className="bg-green-100 text-green-800">ACTIVE</Badge></div>



// //                 </CardContent>
// //               </div>
// //               <Separator />
// //               {/* Shipping Address */}
// //               <CardHeader>
// //                 <CardTitle className="flex items-center gap-2">
// //                   <MapPin className="w-5 h-5" />
// //                   Shipping Address
// //                 </CardTitle>
// //               </CardHeader>
// //               <CardContent>
// //                 <div className="space-y-3">
// //                   <div className="flex items-center">
// //                     <p className="text-sm text-gray-500 w-[150px]">Primary address</p>
// //                     <p className="font-medium">
// //                       {shippingAddress?.fullAddress || profile?.address || "Address not available"}
// //                     </p>
// //                   </div>
// //                   <div className="grid grid-cols-1 gap-3 text-sm">
// //                     <div className="flex items-center">
// //                       <p className="text-gray-500 w-[150px]">City:</p>
// //                       <p className="font-medium">{shippingAddress?.city || "N/A"}</p>
// //                     </div>
// //                     <div className="flex items-center">
// //                       <p className="text-gray-500 w-[150px]">State</p>
// //                       <p className="font-medium">{shippingAddress?.stateProvince || "N/A"}</p>
// //                     </div >
// //                     <div className="flex items-center">
// //                       <p className="text-gray-500 w-[150px]">Country</p>
// //                       <p className="font-medium">{shippingAddress?.country || "Nigeria"}</p>
// //                     </div>
// //                     <div className="flex items-center">
// //                       <p className="text-gray-500 w-[150px]">Post Code</p>
// //                       <p className="font-medium">{shippingAddress?.postalCode || "N/A"}</p>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </CardContent>
// //             </Card>


// //             <Card>

// //             </Card>

// //             {/* Order Summary */}
// //             <Card>
// //               <CardHeader>
// //                 <CardTitle>Order Summary</CardTitle>
// //               </CardHeader>
// //               <CardContent>
// //                 <div className="space-y-3">
// //                   <div className="flex justify-between">
// //                     <span className="text-gray-600">Quantity:</span>
// //                     <span className="font-medium">{order.summary?.totalQuantity || order.items?.length || 0}</span>
// //                   </div>
// //                   <div className="flex justify-between">
// //                     <span className="text-gray-600">Sub Total:</span>
// //                     <span className="font-medium">₦{(order.summary?.itemsSubtotal || 0).toLocaleString()}</span>
// //                   </div>
// //                   <div className="flex justify-between">
// //                     <span className="text-gray-600">Tax:</span>
// //                     <span className="font-medium">6%</span>
// //                   </div>
// //                   <div className="flex justify-between">
// //                     <span className="text-gray-600">Shipping Fee:</span>
// //                     <span className="font-medium">₦{(order.summary?.shippingFee || 0).toLocaleString()}</span>
// //                   </div>
// //                   <div className="flex justify-between">
// //                     <span className="text-gray-600">Discount:</span>
// //                     <span className="font-medium text-red-500">-₦{(order.summary?.discount || 0).toLocaleString()}</span>
// //                   </div>
// //                   <Separator />
// //                   <div className="flex justify-between text-lg font-bold">
// //                     <span>Total Amount:</span>
// //                     <span>₦{(order.totalPrice || 0).toLocaleString()}</span>
// //                   </div>

// //                   {/* Enhanced Payment & Delivery Information */}
// //                   <PaymentInfoDisplay order={order} />
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Modals */}
// //       <OrderTrackingModal
// //         order={order}
// //         isOpen={trackingModalOpen}
// //         onClose={() => setTrackingModalOpen(false)}
// //       />

// //       <ProductDetailsModal
// //         product={selectedProduct}
// //         isOpen={productModalOpen}
// //         onClose={() => {
// //           setProductModalOpen(false);
// //           setSelectedProduct(null);
// //         }}
// //       />

// //       <RefundModal
// //         order={order}
// //         isOpen={refundModalOpen}
// //         onClose={() => setRefundModalOpen(false)}
// //         onRefundSuccess={handleRefundSuccess} // Optional custom success handler
// //       />

// //     </div>

// //   );
// // };

// // export default React.memo(OrderDetails);


// // Main Order Details Component
// interface OrderDetailsProps {
//   orderId?: string;
//   setClose?: React.Dispatch<React.SetStateAction<boolean>>;
//   isModal?: boolean;
// }

// const OrderDetails: React.FC<OrderDetailsProps> = ({
//   orderId,
//   setClose,
//   isModal = false
// }) => {
//   const router = useRouter();
//   const [trackingModalOpen, setTrackingModalOpen] = useState(false);
//   const [productModalOpen, setProductModalOpen] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
//   const [refundModalOpen, setRefundModalOpen] = useState(false);

//   const processRefundMutation = useProcessRefund();

//   // Validate orderId before proceeding
//   if (!orderId) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center max-w-md mx-auto p-6">
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <AlertCircle className="w-8 h-8 text-red-600" />
//           </div>
//           <h2 className="text-xl font-semibold text-gray-900 mb-2">
//             Invalid Order ID
//           </h2>
//           <p className="text-gray-600 mb-6">
//             No order ID was provided. Please check the URL and try again.
//           </p>
//           <Button onClick={() => router.back()} className="bg-orange-500 hover:bg-orange-600">
//             {isModal ? "Close" : "Go Back"}
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   const {
//     getOrderInfoData: rawData,
//     getOrderInfoIsLoading,
//     getOrderInfoError,
//     refetchOrderInfo,
//   } = useGetOrderInfo({
//     enabled: Boolean(orderId),
//     orderId: orderId
//   } as any);

//   // Helper functions for safe property access
//   const getAmountPaid = useCallback((orderData: any): number => {
//     return typeof orderData?.amountPaid === 'number' ? orderData.amountPaid :
//       typeof orderData?.breakdown?.amountPaid === 'number' ? orderData.breakdown.amountPaid : 0;
//   }, []);

//   const getAmountDue = useCallback((orderData: any): number => {
//     return typeof orderData?.amountDue === 'number' ? orderData.amountDue :
//       typeof orderData?.breakdown?.amountDue === 'number' ? orderData.breakdown.amountDue : 0;
//   }, []);

//   // Calculate estimated delivery date based on items
//   const calculateEstimatedDelivery = useCallback((orderData: any) => {
//     if (!orderData?.items?.length) return null;
    
//     let maxProcessingDays = 0;
//     let maxDeliveryDays = 0;
    
//     orderData.items.forEach((item: any) => {
//       const product = item.product || item;
//       if (product.processingTimeDays > maxProcessingDays) {
//         maxProcessingDays = product.processingTimeDays;
//       }
//       if (product.maxDeliveryDays > maxDeliveryDays) {
//         maxDeliveryDays = product.maxDeliveryDays;
//       }
//     });
    
//     if (maxProcessingDays === 0 && maxDeliveryDays === 0) {
//       // Default fallback if no data available
//       maxProcessingDays = 2;
//       maxDeliveryDays = 7;
//     }
    
//     const totalDays = maxProcessingDays + maxDeliveryDays;
//     const date = new Date(orderData.createdAt);
//     date.setDate(date.getDate() + totalDays);
    
//     return formatDate(date.toISOString());
//   }, []);

//   // Determine payment type and schedule based on available data
//   const getPaymentInfo = useCallback((order: any) => {
//     const paymentStatus = order.paymentStatus || 'PENDING';
//     const orderType = order.orderType || 'IMMEDIATE';

//     // Determine if it's pay on delivery based on amount due vs total
//     const totalPrice = order.totalPrice || 0;
//     const amountPaid = getAmountPaid(order);
//     const amountDue = getAmountDue(order);

//     const isPayOnDelivery = amountDue === totalPrice && amountPaid === 0 && paymentStatus === 'PENDING';
//     const requiresImmediatePayment = paymentStatus === 'PENDING' && !isPayOnDelivery;
//     const isScheduled = orderType === 'SCHEDULED' || Boolean(order.scheduledDeliveryDate);

//     return {
//       paymentStatus,
//       orderType,
//       isPayOnDelivery,
//       requiresImmediatePayment,
//       isScheduled,
//       method: isPayOnDelivery ? 'Pay on Delivery' : 'Online Payment'
//     };
//   }, [getAmountPaid, getAmountDue]);

//   // Memoized callbacks to prevent infinite loops
//   const handleViewProduct = useCallback((product: any) => {
//     setSelectedProduct(product);
//     setProductModalOpen(true);
//   }, []);

//   const handleOpenTrackingModal = useCallback(() => {
//     setTrackingModalOpen(true);
//   }, []);

//   const handleClose = useCallback(() => {
//     if (setClose) {
//       setClose(false);
//     } else {
//       router.back();
//     }
//   }, [setClose, router]);


//   const handleRefundSuccess = useCallback(() => {
//     // Custom logic after successful refund
//     console.log('Refund completed successfully');

//     // Refresh order data
//     if (refetchOrderInfo) {
//       refetchOrderInfo();
//     }

//     // Optional: Show additional success message or redirect
//     toast.success('Order refunded and data refreshed');
//   }, [refetchOrderInfo]);

//   const handleRetry = useCallback(() => {
//     if (refetchOrderInfo) {
//       refetchOrderInfo();
//     }
//   }, [refetchOrderInfo]);

//   // Memoized processed data based on your controller's response structure
//   const processedOrderData = useMemo((): ProcessedOrderData | null => {
//     if (!rawData) return null;

//     return {
//       ...rawData,
//       id: rawData.id,
//       orderId: rawData.orderId || `#${String(rawData.id || '').padStart(6, '0')}`,
//       status: rawData.status || 'PENDING',
//       totalPrice: Number(rawData.totalPrice) || 0,
//       createdAt: rawData.createdAt || new Date().toISOString(),
//       paymentStatus: rawData.paymentStatus || 'PENDING',
//       orderType: rawData.orderType || 'IMMEDIATE',
//       items: Array.isArray(rawData.items) ? rawData.items : [],
//       timeline: Array.isArray(rawData.timeline) ? rawData.timeline : [],
//       user: rawData.user || {},
//       summary: rawData.summary || {},
//       breakdown: rawData.breakdown || {},
//       shipping: rawData.shipping || null,
//       transactions: rawData.transactions || [],
//       adminAlerts: rawData.adminAlerts || [],
//       notes: rawData.notes || [],
//       amountPaid: rawData.amountPaid || rawData.breakdown?.amountPaid || 0,
//       amountDue: rawData.amountDue || rawData.breakdown?.amountDue || 0,
//     };
//   }, [rawData]);

  
//   const handleStatusUpdate = useCallback(async (newStatus: string) => {
//     if (!orderId) {
//       toast.error('No order ID available');
//       return;
//     }

//     // Prevent updating to processing if payment is not made
//     if (newStatus === "PROCESSING" && 
//         processedOrderData?.paymentStatus !== "PAID" && 
//         processedOrderData?.paymentStatus !== "PARTIALLY_PAID") {
//       toast.error('Cannot process order without payment confirmation');
//       return;
//     }

//     setIsUpdatingStatus(true);

//     try {
//       const response = await httpService.patchData(
//         {
//           status: newStatus,
//           notes: `Status updated to ${newStatus} via admin panel`
//         },
//         routes.updateOrderStatus(orderId)
//       );

//       if (refetchOrderInfo) {
//         await refetchOrderInfo();
//       }

//       toast.success(`Order status successfully updated to ${newStatus}`);
//     } catch (error: any) {
//       console.error('Failed to update order status:', error);
//       toast.error(`Failed to update order status: ${error?.message || 'Unknown error'}`);
//     } finally {
//       setIsUpdatingStatus(false);
//     }
//   }, [orderId, refetchOrderInfo, processedOrderData]);

//   // Memoized shipping address calculation
//   const shippingAddress = useMemo(() => {
//     if (!processedOrderData) return null;

//     // Look for shipping address in timeline or user profile
//     const orderCreatedEvent = processedOrderData.timeline?.find((event: any) =>
//       event?.action === 'ORDER_CREATED' && event?.details?.shippingAddress
//     );

//     if (orderCreatedEvent?.details?.shippingAddress) {
//       return orderCreatedEvent.details.shippingAddress;
//     }

//     // Fallback to user profile address
//     const user = processedOrderData.user;
//     if (user?.profile?.address || user?.businessProfile?.businessAddress) {
//       return {
//         fullAddress: user.profile?.address || user.businessProfile?.businessAddress,
//         city: 'N/A',
//         stateProvince: 'N/A',
//         country: 'Nigeria',
//         postalCode: 'N/A'
//       };
//     }

//     return null;
//   }, [processedOrderData]);

//   // Memoized status info
//   const statusInfo = useMemo(() => {
//     if (!processedOrderData) return { variant: 'secondary' as const, text: 'Unknown' };

//     const statusMap: Record<string, OrderStatus> = {
//       'PENDING': { variant: 'secondary' as const, text: 'Pending' },
//       'SCHEDULED': { variant: 'secondary' as const, text: 'Scheduled' },
//       'PROCESSING': { variant: 'default' as const, text: 'Processing' },
//       'ONGOING': { variant: 'default' as const, text: 'Ongoing' },
//       'SHIPPED': { variant: 'default' as const, text: 'Shipped' },
//       'DELIVERED': { variant: 'default' as const, text: 'Delivered' },
//       'COMPLETED': { variant: 'default' as const, text: 'Completed' },
//       'CANCELLED': { variant: 'destructive' as const, text: 'Cancelled' }
//     };
//     return statusMap[processedOrderData.status] || { variant: 'secondary' as const, text: processedOrderData.status };
//   }, [processedOrderData]);

//   // Memoized available transitions (without cancel option)
//   const availableTransitions = useMemo(() => {
//     if (!processedOrderData) return [];
    
//     // Disable transitions if order is delivered
//     if (processedOrderData.status === "DELIVERED" || processedOrderData.status === "COMPLETED") {
//       return [];
//     }

//     const statusTransitions: Record<string, StatusTransition[]> = {
//       'PENDING': [],
//       'SCHEDULED': [
//         { value: 'PENDING', label: 'Mark as Pending', icon: Clock, color: 'text-orange-600' }
//       ],
//       'PROCESSING': [
//         { value: 'SHIPPED', label: 'Mark as Shipped', icon: Truck, color: 'text-purple-600' }
//       ],
//       'ONGOING': [
//         { value: 'SHIPPED', label: 'Mark as Shipped', icon: Truck, color: 'text-purple-600' }
//       ],
//       'SHIPPED': [
//         { value: 'DELIVERED', label: 'Mark as Delivered', icon: CheckCircle, color: 'text-green-600' }
//       ],
//       'CANCELLED': [],
//       'COMPLETED': []
//     };

//     // Only allow moving to processing if payment is made
//     const paymentCompleted = processedOrderData.paymentStatus === "PAID" || 
//                             processedOrderData.paymentStatus === "PARTIALLY_PAID";
    
//     if (paymentCompleted) {
//       if (processedOrderData.status === "PENDING") {
//         statusTransitions['PENDING'].push(
//           { value: 'PROCESSING', label: 'Start Processing', icon: Package, color: 'text-blue-600' }
//         );
//       }
//       if (processedOrderData.status === "SCHEDULED") {
//         statusTransitions['SCHEDULED'].push(
//           { value: 'PROCESSING', label: 'Start Processing', icon: Package, color: 'text-blue-600' }
//         );
//       }
//     }

//     return statusTransitions[processedOrderData.status] || [];
//   }, [processedOrderData]);

//   // Calculate estimated delivery
//   const estimatedDelivery = useMemo(() => 
//     calculateEstimatedDelivery(processedOrderData), 
//     [processedOrderData, calculateEstimatedDelivery]
//   );

//   // Loading state
//   if (getOrderInfoIsLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
//           <p className="text-lg font-medium">Loading order details...</p>
//           <p className="text-sm text-gray-500 mt-2">Order #{orderId}</p>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (getOrderInfoError) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center max-w-md mx-auto p-6">
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <AlertCircle className="w-8 h-8 text-red-600" />
//           </div>
//           <h2 className="text-xl font-semibold text-gray-900 mb-2">
//             Error Loading Order
//           </h2>
//           <p className="text-gray-600 mb-6">
//             {getOrderInfoError}
//           </p>
//           <div className="flex gap-3 justify-center">
//             <Button variant="outline" onClick={handleClose}>
//               {isModal ? "Close" : "Go Back"}
//             </Button>
//             <Button onClick={handleRetry} className="bg-orange-500 hover:bg-orange-600">
//               <RefreshCw className="w-4 h-4 mr-2" />
//               Try Again
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Empty state
//   if (!processedOrderData) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center max-w-md mx-auto p-6">
//           <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <Package className="w-8 h-8 text-gray-400" />
//           </div>
//           <h2 className="text-xl font-semibold text-gray-900 mb-2">
//             Order Not Found
//           </h2>
//           <p className="text-gray-600 mb-6">
//             The order #{orderId} could not be found.
//           </p>
//           <div className="flex gap-3 justify-center">
//             <Button variant="outline" onClick={handleClose}>
//               {isModal ? "Close" : "Go Back"}
//             </Button>
//             <Button onClick={handleRetry} className="bg-orange-500 hover:bg-orange-600">
//               <RefreshCw className="w-4 h-4 mr-2" />
//               Try Again
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // At this point, we have valid data
//   const order = processedOrderData;
//   const customer = order.user;
//   const profile = customer?.profile || customer?.businessProfile;
//   const paymentInfo = getPaymentInfo(order);

//   return (
//     <div className="min-h-screen bg-[#F8F8F8] -50">
//       <div className=" mx-12  bg-[#fdfafa] p-6">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex flex-col items-start gap-2">
//             <h1 className="text-3xl font-bold">Order Details</h1>
//             <p className="text-[#687588]">Manage orders</p>
//           </div>

//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Left Column - Order Info */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Order Header */}
//             <Card className="bg-white rounded-lg">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="">
//                     <div className="flex gap-5 mb-2">
//                       <h2 className="text-xl font-semibold">Order {order.orderId || `#${order.id}`}</h2>
//                       <Badge variant={statusInfo.variant} className="px-3 py-1">
//                         {statusInfo.text}
//                       </Badge>
//                     </div>
//                     <p className="text-gray-500 text-sm">
//                       Order / Order Details / Order {order.orderId || `#${order.id}`} - {formatDateTime(order.createdAt)}
//                     </p>

//                   </div>
//                   <div>
//                     <div className="flex flex-row gap-2">
//                       <div className="flex gap-2">

//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => setRefundModalOpen(true)}
//                           disabled={
//                             processRefundMutation.isPending ||
//                             order.paymentStatus !== 'PAID' ||
//                             ['REFUNDED', 'CANCELLED'].includes(order.status)
//                           }
//                         >
//                           <Download className="w-4 h-4 mr-2" />
//                           {processRefundMutation.isPending ? 'Processing...' : 'Refund'}
//                         </Button>
//                       </div>

//                       {/* Status Update Dropdown */}
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button
//                             className="bg-[#FFBF3B] text-black font-semibold flex items-center gap-2"
//                             disabled={isUpdatingStatus || availableTransitions.length === 0 || order.status === "DELIVERED"}
//                           >
//                             {isUpdatingStatus ? (
//                               <>
//                                 <RefreshCw className="w-4 h-4 animate-spin" />
//                                 Updating...
//                               </>
//                             ) : (
//                               <>

//                                 Edit Order

//                               </>
//                             )}
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end" className="w-56">
//                           <DropdownMenuLabel className="flex items-center gap-2">
//                             <ShoppingCart className="w-4 h-4" />
//                             Update Order Status
//                           </DropdownMenuLabel>
//                           <DropdownMenuSeparator />

//                           <div className="px-2 py-1.5 text-xs text-gray-500">
//                             Current: <span className="font-medium text-gray-700">{statusInfo.text}</span>
//                           </div>
//                           <DropdownMenuSeparator />

//                           {availableTransitions.length === 0 ? (
//                             <div className="px-2 py-2 text-sm text-gray-500 italic">
//                               {order.status === "DELIVERED" || order.status === "COMPLETED" 
//                                 ? "Order completed - no changes allowed" 
//                                 : order.paymentStatus !== "PAID" && order.paymentStatus !== "PARTIALLY_PAID"
//                                 ? "Awaiting payment confirmation"
//                                 : "No status changes available"}
//                             </div>
//                           ) : (
//                             availableTransitions.map((transition) => {
//                               const IconComponent = transition.icon;
//                               return (
//                                 <DropdownMenuItem
//                                   key={transition.value}
//                                   onClick={() => handleStatusUpdate(transition.value)}
//                                   className="flex items-center gap-2 cursor-pointer"
//                                 >
//                                   <IconComponent className={`w-4 h-4 ${transition.color}`} />
//                                   <span>{transition.label}</span>
//                                 </DropdownMenuItem>
//                               );
//                             })
//                           )}
//                         </DropdownMenuContent>
//                       </DropdownMenu>


//                     </div>
//                   </div>

//                 </div>


//                 {/* Progress Bar */}
//                 <div className="mb-6">
//                   <h3 className="text-sm font-medium mb-6">Order Progress</h3>

//                   <div className="relative">
//                     {/* Progress line container */}
//                     <div className="absolute top-4 left-0 right-0 h-2 bg-gray-200 rounded-full z-0"></div>

//                     {/* Active progress line */}
//                     <div
//                       className="absolute top-4 left-0 h-2 bg-green-500 rounded-full z-0 transition-all duration-500"
//                       style={{
//                         width: `${(() => {
//                           // Define steps based on payment status and order status
//                           const paymentCompleted = order.paymentStatus === "PAID" || order.paymentStatus === "PARTIALLY_PAID";
//                           const steps = [
//                             { 
//                               key: "PAYMENT", 
//                               completed: paymentCompleted 
//                             },
//                             { 
//                               key: "PROCESSING", 
//                               completed: ["PROCESSING", "ONGOING", "SHIPPED", "DELIVERED", "COMPLETED"].includes(order.status) 
//                             },
//                             { 
//                               key: "SHIPPING", 
//                               completed: ["SHIPPED", "DELIVERED", "COMPLETED"].includes(order.status) 
//                             },
//                             { 
//                               key: "DELIVERED", 
//                               completed: ["DELIVERED", "COMPLETED"].includes(order.status) 
//                             }
//                           ];

//                           const completedSteps = steps.filter(step => step.completed).length;
//                           return (completedSteps / steps.length) * 100;
//                         })()}%`
//                       }}
//                     />

//                     {/* Progress steps */}
//                     <div className="relative z-10 flex items-center justify-between">
//                       {[
//                         {
//                           label: order.paymentStatus === "PAID" || order.paymentStatus === "PARTIALLY_PAID" 
//                             ? "Order Confirmed" 
//                             : "Payment Pending",
//                           status: order.paymentStatus === "PAID" || order.paymentStatus === "PARTIALLY_PAID" 
//                             ? "completed" 
//                             : "current",
//                           isActive: true
//                         },
//                         {
//                           label: "Processing",
//                           status: ["PROCESSING", "ONGOING"].includes(order.status) ? "current" :
//                             ["SHIPPED", "DELIVERED", "COMPLETED"].includes(order.status) ? "completed" : "pending",
//                           isActive: ["PROCESSING", "ONGOING", "SHIPPED", "DELIVERED", "COMPLETED"].includes(order.status),
//                           showSpinner: ["PROCESSING", "ONGOING"].includes(order.status)
//                         },
//                         {
//                           label: "Shipping",
//                           status: order.status === "SHIPPED" ? "current" :
//                             ["DELIVERED", "COMPLETED"].includes(order.status) ? "completed" : "pending",
//                           isActive: ["SHIPPED", "DELIVERED", "COMPLETED"].includes(order.status)
//                         },
//                         {
//                           label: "Delivered",
//                           status: ["DELIVERED", "COMPLETED"].includes(order.status) ? "completed" : "pending",
//                           isActive: ["DELIVERED", "COMPLETED"].includes(order.status)
//                         }
//                       ].map((step, index) => (
//                         <div key={index} className="flex flex-col items-center bg-white px-1">
//                           {/* Step indicator - just colored dots */}
//                           <div
//                             className={`w-3 h-3 rounded-full mb-3 transition-all duration-300 ${step.status === "completed"
//                               ? "bg-green-500"
//                               : step.status === "current"
//                                 ? "bg-yellow-500"
//                                 : "bg-gray-300"
//                               }`}
//                           />


//                           {/* Step label */}
//                           <span
//                             className={`text-xs text-center font-medium max-w-20 leading-tight ${step.isActive || step.status === "completed"
//                               ? "text-gray-800"
//                               : "text-gray-400"
//                               }`}
//                           >
//                             {step.label}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Bottom section with delivery info and tracking */}
//                   <div className="flex justify-between items-center mt-8">
//                     <div className="text-sm text-gray-500 flex items-center gap-2">
//                       <Calendar className="w-4 h-4" />
//                       Estimated delivery: {estimatedDelivery || (() => {
//                         const date = new Date(order.createdAt);
//                         date.setDate(date.getDate() + 7);
//                         return formatDate(date.toISOString());
//                       })()}
//                     </div>
//                     <div>
//                       <Button
//                         variant="outline"
//                         onClick={handleOpenTrackingModal}
//                         className="flex items-center gap-2 bg-[#FFBF3B] font-semibold"
//                       >
//                         <Truck className="w-4 h-4" />
//                         Track order
//                       </Button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Payment and Schedule Information */}
//                 <div className="mt-6 p-4 bg-gray-50 rounded-lg">
//                   <h4 className="font-bold mb-3">Payment & Schedule Information</h4>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                     <div>
//                       <span className="font-bold">Payment Method:</span>
//                       <p className="font-medium">{paymentInfo.method}</p>
//                     </div>
//                     <div>
//                       <span className="font-bold">Order Type:</span>
//                       <p className="font-medium">{paymentInfo.orderType}</p>
//                     </div>
//                     <div>
//                       <span className="font-bold">Payment Status:</span>
//                       <Badge variant={order.paymentStatus === 'PAID' ? 'default' : 'secondary'} className="ml-2">
//                         {order.paymentStatus}
//                       </Badge>
//                     </div>
//                     <div>
//                       <span className="font-bold">Schedule Type:</span>
//                       <Badge variant={paymentInfo.isScheduled ? 'secondary' : 'default'} className="ml-2">
//                         {paymentInfo.isScheduled ? 'Scheduled' : 'Immediate'}
//                       </Badge>
//                     </div>
//                   </div>

//                   {/* Payment Urgency Indicators */}
//                   <div className="mt-3 flex gap-2">
//                     {paymentInfo.requiresImmediatePayment && (
//                       <Badge className="bg-red-100 text-red-800 text-xs">
//                         ⚠️ Payment Required
//                       </Badge>
//                     )}
//                     {paymentInfo.isPayOnDelivery && (
//                       <Badge className="bg-yellow-50 text-black text-xs">
//                         💰 Pay on Delivery
//                       </Badge>
//                     )}
//                     {paymentInfo.isScheduled && (
//                       <Badge className="bg-purple-100 text-purple-800 text-xs">
//                         📅 Scheduled Order
//                       </Badge>
//                     )}
//                     {order.paymentStatus === 'PAID' && (
//                       <Badge className="bg-green-100 text-green-800 text-xs">
//                         ✅ Payment Complete
//                       </Badge>
//                     )}
//                     {order.paymentStatus === 'PARTIALLY_PAID' && (
//                       <Badge className="bg-yellow-100 text-yellow-800 text-xs">
//                         ⚠️ Partial Payment
//                       </Badge>
//                     )}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Order Timeline */}
//             <Card className="rounded-xl">
//               <CardHeader>
//                 <CardTitle className="text-2xl">Order Timeline</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {order.timeline && order.timeline.length > 0 ? (
//                     order.timeline.map((event: any, index: number) => (
//                       <div key={index} className="flex gap-3">
//                         <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0">
//                           <Package className="w-4 h-4 text-white" />
//                         </div>
//                         <div className="flex-1">
//                           <div className="flex items-center justify-between">
//                             <h4 className="font-medium text-xl lowercase">{event?.action?.replace?.(/_/g, ' ') || 'Order Update'}</h4>
//                             <span className="text-sm text-gray-500">
//                               {formatDateTime(event?.createdAt || order.createdAt)}
//                             </span>
//                           </div>
//                           <p className="text-sm text-gray-600">
//                             {event?.details?.description ||
//                               event?.details?.adminNotes ||
//                               "Order status updated"}
//                           </p>
//                           {event?.details?.previousStatus && (
//                             <p className="text-xs text-gray-500 mt-1">
//                               Changed from {event.details.previousStatus} to {event.status}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="text-center py-8 text-gray-500">
//                       <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
//                       <p>No timeline events available</p>
//                     </div>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Product Table */}
//             <Card className="rounded-xl">
//               <CardHeader>
//                 <CardTitle>Products ({order.items?.length || 0} items)</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead>
//                       <tr className="border-b">
//                         <th className="text-left py-3">Product</th>
//                         <th className="text-left py-3">Unit Price</th>
//                         <th className="text-left py-3">Quantity</th>
//                         <th className="text-left py-3">Total</th>
//                         <th className="text-left py-3">Action</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {order.items && order.items.length > 0 ? (
//                         order.items.map((item: any, index: number) => (
//                           <tr key={index} className="border-b">
//                             <td className="py-3">
//                               <div className="flex items-center gap-3">
                        
//                                 <div>
//                                   <p className="font-medium">{item.product?.name || 'Unknown Product'}</p>
//                                   <p className="text-sm text-gray-500">
//                                     {item.product?.category?.name || 'No Category'}
//                                   </p>

//                                 </div>
//                               </div>
//                             </td>
//                             <td className="py-3 font-medium">₦{(item.price || item.unitPrice || 0).toLocaleString()}</td>
//                             <td className="py-3">{item.quantity || 0}</td>
//                             <td className="py-3 font-medium">₦{(item.totalPrice || item.lineTotal || (item.price * item.quantity) || 0).toLocaleString()}</td>
//                             <td className="py-3">
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() => handleViewProduct(item.product || item)}
//                                 className="flex items-center gap-1"
//                               >
//                                 <Eye className="w-4 h-4" />
//                               </Button>
//                             </td>
//                           </tr>
//                         ))
//                       ) : (
//                         <tr>
//                           <td colSpan={5} className="py-8 text-center text-gray-500">
//                             No products found
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Right Column - Customer & Summary */}
//           <div className="space-y-6">
//             {/* Customer Info */}
//             <Card className="rounded-xl">
//               <div className="flex items-center pt-6">
//                 <CardHeader className="text-center">
//                   <div className="w-[100px] h-[100px] rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
//                     {profile?.profileImage ? (
//                       <Image
//                         src={profile.profileImage}
//                         alt="Customer"
//                         width={64}
//                         height={64}
//                         className="w-full h-full object-cover rounded-full"
//                         onError={(e) => {
//                           (e.target as HTMLImageElement).style.display = 'none';
//                         }}
//                       />
//                     ) : (
//                       <User className="w-8 h-8 text-gray-400" />
//                     )}
//                   </div>

//                 </CardHeader>
//                 <CardContent className="flex flex-col gap-2">
//                   <CardTitle>{profile?.fullName || profile?.businessName || customer?.email || 'Unknown Customer'}</CardTitle>
//                   <p className="text-sm normalize text-gray-500">{customer?.type || "Customer"}</p>
//                   <div><Badge className="bg-green-100 text-green-800">ACTIVE</Badge></div>



//                 </CardContent>
//               </div>
//               <Separator />
//               {/* Shipping Address */}
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <MapPin className="w-5 h-5" />
//                   Shipping Address
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-3">
//                   <div className="flex items-center">
//                     <p className="text-sm text-gray-500 w-[150px]">Primary address</p>
//                     <p className="font-medium">
//                       {shippingAddress?.fullAddress || profile?.address || "Address not available"}
//                     </p>
//                   </div>
//                   <div className="grid grid-cols-1 gap-3 text-sm">
//                     <div className="flex items-center">
//                       <p className="text-gray-500 w-[150px]">City:</p>
//                       <p className="font-medium">{shippingAddress?.city || "N/A"}</p>
//                     </div>
//                     <div className="flex items-center">
//                       <p className="text-gray-500 w-[150px]">State</p>
//                       <p className="font-medium">{shippingAddress?.stateProvince || "N/A"}</p>
//                     </div >
//                     <div className="flex items-center">
//                       <p className="text-gray-500 w-[150px]">Country</p>
//                       <p className="font-medium">{shippingAddress?.country || "Nigeria"}</p>
//                     </div>
//                     <div className="flex items-center">
//                       <p className="text-gray-500 w-[150px]">Post Code</p>
//                       <p className="font-medium">{shippingAddress?.postalCode || "N/A"}</p>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>


//             <Card>

//             </Card>

//             {/* Order Summary */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Order Summary</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-3">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Quantity:</span>
//                     <span className="font-medium">{order.summary?.totalQuantity || order.items?.length || 0}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Sub Total:</span>
//                     <span className="font-medium">₦{(order.summary?.itemsSubtotal || 0).toLocaleString()}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Tax:</span>
//                     <span className="font-medium">6%</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Shipping Fee:</span>
//                     <span className="font-medium">₦{(order.summary?.shippingFee || 0).toLocaleString()}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Discount:</span>
//                     <span className="font-medium text-red-500">-₦{(order.summary?.discount || 0).toLocaleString()}</span>
//                   </div>
//                   <Separator />
//                   <div className="flex justify-between text-lg font-bold">
//                     <span>Total Amount:</span>
//                     <span>₦{(order.totalPrice || 0).toLocaleString()}</span>
//                   </div>

//                   {/* Enhanced Payment & Delivery Information */}
//                   <PaymentInfoDisplay order={order} />
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>

//       {/* Modals */}
//       <OrderTrackingModal
//         order={order}
//         isOpen={trackingModalOpen}
//         onClose={() => setTrackingModalOpen(false)}
//       />

//       <ProductDetailsModal
//         product={selectedProduct}
//         isOpen={productModalOpen}
//         onClose={() => {
//           setProductModalOpen(false);
//           setSelectedProduct(null);
//         }}
//       />

//       <RefundModal
//         order={order}
//         isOpen={refundModalOpen}
//         onClose={() => setRefundModalOpen(false)}
//         onRefundSuccess={handleRefundSuccess} // Optional custom success handler
//       />

//     </div>

//   );
// };

// export default React.memo(OrderDetails);

"use client";

import React, { useMemo, useCallback, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetOrderInfo, useProcessRefund } from "@/services/orders";
import { RefundModal, PaymentInfoDisplay } from './refund';
import { formatDate, formatDateTime } from "@/lib/utils";
import { useRouter } from "next/navigation";
import httpService from "@/services/httpService";
import { routes } from "@/services/api-routes";
import {
  ArrowLeft,
  Edit,
  RefreshCw,
  Truck,
  Calendar,
  Eye,
  Package,
  CreditCard,
  MapPin,
  User,
  Phone,
  Mail,
  Download,
  CheckCircle,
  Circle,
  Clock,
  AlertCircle,
  X,
  ChevronDown,
  AlertTriangle,
  ShoppingCart
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

// Product Details Modal Component
const ProductDetailsModal = React.memo(({
  product,
  onClose,
  isOpen
}: {
  product: any;
  onClose: () => void;
  isOpen: boolean;
}) => {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-full flex flex-col right-0 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 mb-4">
            <Package className="w-5 h-5" />
            <span className="text-xl font-semibold">Product Details</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex gap-6">
            <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <Package className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-4">{product.shortDescription}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Category:</span>
                  <p className="font-medium">{product.category?.name || "N/A"}</p>
                </div>
                <div>
                  <span className="text-gray-500">Manufacturer:</span>
                  <p className="font-medium">{product.manufacturer?.name || "N/A"}</p>
                </div>
                <div>
                  <span className="text-gray-500">Processing Time:</span>
                  <p className="font-medium">{product.processingTime || 'N/A'} days</p>
                </div>
                <div>
                  <span className="text-gray-500">Returns:</span>
                  <p className="font-medium">{product.acceptsReturns ? "Accepted" : "Not Accepted"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

ProductDetailsModal.displayName = 'ProductDetailsModal';

// Order Tracking Modal Component
const OrderTrackingModal = React.memo(({
  order,
  onClose,
  isOpen
}: {
  order: any;
  onClose: () => void;
  isOpen: boolean;
}) => {
  if (!order) return null;

  // Calculate estimated delivery date based on items
  const calculateEstimatedDelivery = useCallback((orderData: any) => {
    if (!orderData?.items?.length) return null;
    
    let maxProcessingDays = 0;
    let maxDeliveryDays = 0;
    
    orderData.items.forEach((item: any) => {
      const product = item.product || item;
      if (product.processingTimeDays > maxProcessingDays) {
        maxProcessingDays = product.processingTimeDays;
      }
      if (product.maxDeliveryDays > maxDeliveryDays) {
        maxDeliveryDays = product.maxDeliveryDays;
      }
    });
    
    if (maxProcessingDays === 0 && maxDeliveryDays === 0) {
      // Default fallback if no data available
      maxProcessingDays = 2;
      maxDeliveryDays = 7;
    }
    
    const totalDays = maxProcessingDays + maxDeliveryDays;
    const date = new Date(orderData.createdAt);
    date.setDate(date.getDate() + totalDays);
    
    return formatDate(date.toISOString());
  }, []);

  const getTrackingSteps = useMemo(() => (status: string, paymentStatus: string) => {
    // Determine the initial step based on payment status
    const paymentStep = {
      id: 1,
      name: paymentStatus === "PAID" || paymentStatus === "PARTIALLY_PAID" ? "Order Confirmed" : "Payment Pending",
      status: paymentStatus === "PAID" || paymentStatus === "PARTIALLY_PAID" ? "completed" : "current",
      icon: paymentStatus === "PAID" || paymentStatus === "PARTIALLY_PAID" ? 
        <CheckCircle className="w-6 h-6" /> : <CreditCard className="w-6 h-6" />,
      description: paymentStatus === "PAID" || paymentStatus === "PARTIALLY_PAID" ? 
        "Order has been confirmed" : "Waiting for payment"
    };

    const steps = [
      paymentStep,
      {
        id: 2,
        name: "Processing",
        status: ["PROCESSING", "SHIPPED", "DELIVERED", "COMPLETED"].includes(status) ? 
          (status === "PROCESSING" ? "current" : "completed") : "pending",
        icon: <Package className="w-6 h-6" />,
        description: "Order is being prepared"
      },
      {
        id: 3,
        name: "Shipped",
        status: status === "SHIPPED" ? "current" : 
          ["DELIVERED", "COMPLETED"].includes(status) ? "completed" : "pending",
        icon: <Truck className="w-6 h-6" />,
        description: "Order is on the way"
      },
      {
        id: 4,
        name: "Delivered",
        status: ["DELIVERED", "COMPLETED"].includes(status) ? "completed" : "pending",
        icon: <CheckCircle className="w-6 h-6" />,
        description: "Order has been delivered"
      },
    ];
    return steps;
  }, []);

  const trackingSteps = useMemo(() =>
    getTrackingSteps(order.status, order.paymentStatus),
    [order.status, order.paymentStatus, getTrackingSteps]
  );

  const estimatedDelivery = useMemo(() => 
    calculateEstimatedDelivery(order), 
    [order, calculateEstimatedDelivery]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-full flex flex-col  right-0">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 mb-4">
            <Truck className="w-6 h-6" />
            <span className="text-2xl font-semibold">Order Tracking</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Tracker */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-6 left-10 right-0 h-0.5 bg-gray-200 z-0"></div>

              {trackingSteps.map((step) => (
                <div key={step.id} className="flex flex-col items-center relative z-10 bg-white px-2">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 border-4 border-white shadow-sm ${step.status === "completed"
                      ? "bg-green-500 text-white"
                      : step.status === "current"
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-200 text-gray-400"
                      }`}
                  >
                    {step.icon}
                  </div>
                  <span
                    className={`text-xs text-center font-medium max-w-20 ${step.status === "completed" || step.status === "current"
                      ? "text-gray-800"
                      : "text-gray-400"
                      }`}
                  >
                    {step.name}
                  </span>
                  <span className="text-xs text-gray-500 text-center max-w-24 mt-1">
                    {step.description}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Order Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">#{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge variant={order.status === "DELIVERED" ? "default" : "secondary"}>
                    {order.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-medium">₦{(order.totalPrice || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Shipping Information</h3>
              <div className="space-y-2 text-sm">
                {order.shipping && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Distance:</span>
                      <span className="font-medium">{order.shipping.distance} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping Fee:</span>
                      <span className="font-medium">₦{(order.shipping.totalShippingFee || 0).toLocaleString()}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Delivery:</span>
                  <span className="font-medium">
                    {estimatedDelivery || (() => {
                      const date = new Date(order.createdAt);
                      date.setDate(date.getDate() + 7);
                      return formatDate(date.toISOString());
                    })()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={onClose} className="bg-orange-500 hover:bg-orange-600">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

OrderTrackingModal.displayName = 'OrderTrackingModal';

// Type definitions
interface OrderStatus {
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
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
interface OrderDetailsProps {
  orderId?: string;
  setClose?: React.Dispatch<React.SetStateAction<boolean>>;
  isModal?: boolean;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  orderId,
  setClose,
  isModal = false
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Invalid Order ID
          </h2>
          <p className="text-gray-600 mb-6">
            No order ID was provided. Please check the URL and try again.
          </p>
          <Button onClick={() => router.back()} className="bg-orange-500 hover:bg-orange-600">
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
    orderId: orderId
  } as any);

  // Helper functions for safe property access
  const getAmountPaid = useCallback((orderData: any): number => {
    return typeof orderData?.amountPaid === 'number' ? orderData.amountPaid :
      typeof orderData?.breakdown?.amountPaid === 'number' ? orderData.breakdown.amountPaid : 0;
  }, []);

  const getAmountDue = useCallback((orderData: any): number => {
    return typeof orderData?.amountDue === 'number' ? orderData.amountDue :
      typeof orderData?.breakdown?.amountDue === 'number' ? orderData.breakdown.amountDue : 0;
  }, []);

  // Calculate estimated delivery date based on items
  const calculateEstimatedDelivery = useCallback((orderData: any) => {
    if (!orderData?.items?.length) return null;
    
    let maxProcessingDays = 0;
    let maxDeliveryDays = 0;
    
    orderData.items.forEach((item: any) => {
      const product = item.product || item;
      if (product.processingTimeDays > maxProcessingDays) {
        maxProcessingDays = product.processingTimeDays;
      }
      if (product.maxDeliveryDays > maxDeliveryDays) {
        maxDeliveryDays = product.maxDeliveryDays;
      }
    });
    
    if (maxProcessingDays === 0 && maxDeliveryDays === 0) {
      // Default fallback if no data available
      maxProcessingDays = 2;
      maxDeliveryDays = 7;
    }
    
    const totalDays = maxProcessingDays + maxDeliveryDays;
    const date = new Date(orderData.createdAt);
    date.setDate(date.getDate() + totalDays);
    
    return formatDate(date.toISOString());
  }, []);

  // Determine payment type and schedule based on available data
  const getPaymentInfo = useCallback((order: any) => {
    const paymentStatus = order.paymentStatus || 'PENDING';
    const orderType = order.orderType || 'IMMEDIATE';

    // Determine if it's pay on delivery based on amount due vs total
    const totalPrice = order.totalPrice || 0;
    const amountPaid = getAmountPaid(order);
    const amountDue = getAmountDue(order);

    const isPayOnDelivery = amountDue === totalPrice && amountPaid === 0 && paymentStatus === 'PENDING';
    const requiresImmediatePayment = paymentStatus === 'PENDING' && !isPayOnDelivery;
    const isScheduled = orderType === 'SCHEDULED' || Boolean(order.scheduledDeliveryDate);

    return {
      paymentStatus,
      orderType,
      isPayOnDelivery,
      requiresImmediatePayment,
      isScheduled,
      method: isPayOnDelivery ? 'Pay on Delivery' : 'Online Payment'
    };
  }, [getAmountPaid, getAmountDue]);

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


  const handleRefundSuccess = useCallback(() => {
    // Custom logic after successful refund
    console.log('Refund completed successfully');

    // Refresh order data
    if (refetchOrderInfo) {
      refetchOrderInfo();
    }

    // Optional: Show additional success message or redirect
    toast.success('Order refunded and data refreshed');
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
      orderId: rawData.orderId || `#${String(rawData.id || '').padStart(6, '0')}`,
      status: rawData.status || 'PENDING',
      totalPrice: Number(rawData.totalPrice) || 0,
      createdAt: rawData.createdAt || new Date().toISOString(),
      paymentStatus: rawData.paymentStatus || 'PENDING',
      orderType: rawData.orderType || 'IMMEDIATE',
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

  
  const handleStatusUpdate = useCallback(async (newStatus: string) => {
    if (!orderId) {
      toast.error('No order ID available');
      return;
    }

    // Prevent updating to processing if payment is not made
    if (newStatus === "PROCESSING" && 
        processedOrderData?.paymentStatus !== "PAID" && 
        processedOrderData?.paymentStatus !== "PARTIALLY_PAID") {
      toast.error('Cannot process order without payment confirmation');
      return;
    }

    setIsUpdatingStatus(true);

    try {
      const response = await httpService.patchData(
        {
          status: newStatus,
          notes: `Status updated to ${newStatus} via admin panel`
        },
        routes.updateOrderStatus(orderId)
      );

      if (refetchOrderInfo) {
        await refetchOrderInfo();
      }

      toast.success(`Order status successfully updated to ${newStatus}`);
    } catch (error: any) {
      console.error('Failed to update order status:', error);
      toast.error(`Failed to update order status: ${error?.message || 'Unknown error'}`);
    } finally {
      setIsUpdatingStatus(false);
    }
  }, [orderId, refetchOrderInfo, processedOrderData]);

  // Memoized shipping address calculation
  const shippingAddress = useMemo(() => {
    if (!processedOrderData) return null;

    // Look for shipping address in timeline or user profile
    const orderCreatedEvent = processedOrderData.timeline?.find((event: any) =>
      event?.action === 'ORDER_CREATED' && event?.details?.shippingAddress
    );

    if (orderCreatedEvent?.details?.shippingAddress) {
      return orderCreatedEvent.details.shippingAddress;
    }

    // Fallback to user profile address
    const user = processedOrderData.user;
    if (user?.profile?.address || user?.businessProfile?.businessAddress) {
      return {
        fullAddress: user.profile?.address || user.businessProfile?.businessAddress,
        city: 'N/A',
        stateProvince: 'N/A',
        country: 'Nigeria',
        postalCode: 'N/A'
      };
    }

    return null;
  }, [processedOrderData]);

  // Memoized status info
  const statusInfo = useMemo(() => {
    if (!processedOrderData) return { variant: 'secondary' as const, text: 'Unknown' };

    const statusMap: Record<string, OrderStatus> = {
      'PENDING': { variant: 'secondary' as const, text: 'Pending' },
      'SCHEDULED': { variant: 'secondary' as const, text: 'Scheduled' },
      'PROCESSING': { variant: 'default' as const, text: 'Processing' },
      'ONGOING': { variant: 'default' as const, text: 'Ongoing' },
      'SHIPPED': { variant: 'default' as const, text: 'Shipped' },
      'DELIVERED': { variant: 'default' as const, text: 'Delivered' },
      'COMPLETED': { variant: 'default' as const, text: 'Completed' },
      'CANCELLED': { variant: 'destructive' as const, text: 'Cancelled' }
    };
    return statusMap[processedOrderData.status] || { variant: 'secondary' as const, text: processedOrderData.status };
  }, [processedOrderData]);

  // Memoized available transitions (without cancel option)
  const availableTransitions = useMemo(() => {
    if (!processedOrderData) return [];
    
    // Disable transitions if order is delivered
    if (processedOrderData.status === "DELIVERED" || processedOrderData.status === "COMPLETED") {
      return [];
    }

    const statusTransitions: Record<string, StatusTransition[]> = {
      'PENDING': [],
      'SCHEDULED': [
        { value: 'PENDING', label: 'Mark as Pending', icon: Clock, color: 'text-orange-600' }
      ],
      'PROCESSING': [
        { value: 'SHIPPED', label: 'Mark as Shipped', icon: Truck, color: 'text-purple-600' }
      ],
      'ONGOING': [
        { value: 'SHIPPED', label: 'Mark as Shipped', icon: Truck, color: 'text-purple-600' }
      ],
      'SHIPPED': [
        { value: 'DELIVERED', label: 'Mark as Delivered', icon: CheckCircle, color: 'text-green-600' }
      ],
      'CANCELLED': [],
      'COMPLETED': []
    };

    // Only allow moving to processing if payment is made
    const paymentCompleted = processedOrderData.paymentStatus === "PAID" || 
                            processedOrderData.paymentStatus === "PARTIALLY_PAID";
    
    if (paymentCompleted) {
      if (processedOrderData.status === "PENDING") {
        statusTransitions['PENDING'].push(
          { value: 'PROCESSING', label: 'Start Processing', icon: Package, color: 'text-blue-600' }
        );
      }
      if (processedOrderData.status === "SCHEDULED") {
        statusTransitions['SCHEDULED'].push(
          { value: 'PROCESSING', label: 'Start Processing', icon: Package, color: 'text-blue-600' }
        );
      }
    }

    return statusTransitions[processedOrderData.status] || [];
  }, [processedOrderData]);

  // Calculate estimated delivery
  const estimatedDelivery = useMemo(() => 
    calculateEstimatedDelivery(processedOrderData), 
    [processedOrderData, calculateEstimatedDelivery]
  );

  // Loading state
  if (getOrderInfoIsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading order details...</p>
          <p className="text-sm text-gray-500 mt-2">Order #{orderId}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (getOrderInfoError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Order
          </h2>
          <p className="text-gray-600 mb-6">
            {getOrderInfoError}
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={handleClose}>
              {isModal ? "Close" : "Go Back"}
            </Button>
            <Button onClick={handleRetry} className="bg-orange-500 hover:bg-orange-600">
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The order #{orderId} could not be found.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={handleClose}>
              {isModal ? "Close" : "Go Back"}
            </Button>
            <Button onClick={handleRetry} className="bg-orange-500 hover:bg-orange-600">
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
    <div className="min-h-screen bg-[#F8F8F8] -50">
      <div className=" mx-12  bg-[#fdfafa] p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col items-start gap-2">
            <h1 className="text-3xl font-bold">Order Details</h1>
            <p className="text-[#687588]">Manage orders</p>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Header */}
            <Card className="bg-white rounded-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="">
                    <div className="flex gap-5 mb-2">
                      <h2 className="text-xl font-semibold">Order {order.orderId || `#${order.id}`}</h2>
                      <Badge variant={statusInfo.variant} className="px-3 py-1">
                        {statusInfo.text}
                      </Badge>
                    </div>
                    <p className="text-gray-500 text-sm">
                      Order / Order Details / Order {order.orderId || `#${order.id}`} - {formatDateTime(order.createdAt)}
                    </p>

                  </div>
                  <div>
                    <div className="flex flex-row gap-2">
                      <div className="flex gap-2">

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setRefundModalOpen(true)}
                          disabled={
                            processRefundMutation.isPending ||
                            order.paymentStatus !== 'PAID' ||
                            ['REFUNDED', 'CANCELLED'].includes(order.status)
                          }
                        >
                          <Download className="w-4 h-4 mr-2" />
                          {processRefundMutation.isPending ? 'Processing...' : 'Refund'}
                        </Button>
                      </div>

                      {/* Status Update Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            className="bg-[#FFBF3B] text-black font-semibold flex items-center gap-2"
                            disabled={isUpdatingStatus || availableTransitions.length === 0 || order.status === "DELIVERED"}
                          >
                            {isUpdatingStatus ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              <>

                                Edit Order

                              </>
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel className="flex items-center gap-2">
                            <ShoppingCart className="w-4 h-4" />
                            Update Order Status
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />

                          <div className="px-2 py-1.5 text-xs text-gray-500">
                            Current: <span className="font-medium text-gray-700">{statusInfo.text}</span>
                          </div>
                          <DropdownMenuSeparator />

                          {availableTransitions.length === 0 ? (
                            <div className="px-2 py-2 text-sm text-gray-500 italic">
                              {order.status === "DELIVERED" || order.status === "COMPLETED" 
                                ? "Order completed - no changes allowed" 
                                : order.paymentStatus !== "PAID" && order.paymentStatus !== "PARTIALLY_PAID"
                                ? "Awaiting payment confirmation"
                                : "No status changes available"}
                            </div>
                          ) : (
                            availableTransitions.map((transition) => {
                              const IconComponent = transition.icon;
                              return (
                                <DropdownMenuItem
                                  key={transition.value}
                                  onClick={() => handleStatusUpdate(transition.value)}
                                  className="flex items-center gap-2 cursor-pointer"
                                >
                                  <IconComponent className={`w-4 h-4 ${transition.color}`} />
                                  <span>{transition.label}</span>
                                </DropdownMenuItem>
                              );
                            })
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>

                    </div>
                  </div>

                </div>

                {/* Enhanced Progress Bar with Green Highlighting */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-6">Order Progress</h3>

                  <div className="relative">
                    {/* Progress line container */}
                    <div className="absolute top-4 left-0 right-0 h-2 bg-gray-200 rounded-full z-0"></div>

                    {/* Active progress line - Green highlighting */}
                    <div
                      className="absolute top-4 left-0 h-2 bg-green-500 rounded-full z-0 transition-all duration-500"
                      style={{
                        width: `${(() => {
                          // Define steps based on payment status and order status
                          const paymentCompleted = order.paymentStatus === "PAID" || order.paymentStatus === "PARTIALLY_PAID";
                          const steps = [
                            { 
                              key: "PAYMENT", 
                              completed: paymentCompleted 
                            },
                            { 
                              key: "PROCESSING", 
                              completed: ["PROCESSING", "ONGOING", "SHIPPED", "DELIVERED", "COMPLETED"].includes(order.status) 
                            },
                            { 
                              key: "SHIPPING", 
                              completed: ["SHIPPED", "DELIVERED", "COMPLETED"].includes(order.status) 
                            },
                            { 
                              key: "DELIVERED", 
                              completed: ["DELIVERED", "COMPLETED"].includes(order.status) 
                            }
                          ];

                          const completedSteps = steps.filter(step => step.completed).length;
                          return (completedSteps / steps.length) * 100;
                        })()}%`
                      }}
                    />

                    {/* Progress steps with icons */}
                    <div className="relative z-10 flex items-center justify-between">
                      {[
                        {
                          label: order.paymentStatus === "PAID" || order.paymentStatus === "PARTIALLY_PAID" 
                            ? "Order Confirmed" 
                            : "Payment Pending",
                          status: order.paymentStatus === "PAID" || order.paymentStatus === "PARTIALLY_PAID" 
                            ? "completed" 
                            : "current",
                          icon: order.paymentStatus === "PAID" || order.paymentStatus === "PARTIALLY_PAID" 
                            ? <CheckCircle className="w-5 h-5" /> 
                            : <CreditCard className="w-5 h-5" />,
                          isActive: true
                        },
                        {
                          label: "Processing",
                          status: ["PROCESSING", "ONGOING"].includes(order.status) ? "current" :
                            ["SHIPPED", "DELIVERED", "COMPLETED"].includes(order.status) ? "completed" : "pending",
                          icon: <Package className="w-5 h-5" />,
                          isActive: ["PROCESSING", "ONGOING", "SHIPPED", "DELIVERED", "COMPLETED"].includes(order.status),
                          showSpinner: ["PROCESSING", "ONGOING"].includes(order.status)
                        },
                        {
                          label: "Shipping",
                          status: order.status === "SHIPPED" ? "current" :
                            ["DELIVERED", "COMPLETED"].includes(order.status) ? "completed" : "pending",
                          icon: <Truck className="w-5 h-5" />,
                          isActive: ["SHIPPED", "DELIVERED", "COMPLETED"].includes(order.status)
                        },
                        {
                          label: "Delivered",
                          status: ["DELIVERED", "COMPLETED"].includes(order.status) ? "completed" : "pending",
                          icon: <CheckCircle className="w-5 h-5" />,
                          isActive: ["DELIVERED", "COMPLETED"].includes(order.status)
                        }
                      ].map((step, index) => (
                        <div key={index} className="flex flex-col items-center bg-white px-1">
                          {/* Step indicator with icons */}
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 border-4 border-white shadow-sm transition-all duration-300 ${
                              step.status === "completed"
                                ? "bg-green-500 text-white"
                                : step.status === "current"
                                  ? "bg-green-300 text-green-800"
                                  : "bg-gray-200 text-gray-400"
                            }`}
                          >
                            {step.icon}
                            {step.showSpinner && (
                              <RefreshCw className="w-3 h-3 ml-1 animate-spin absolute top-1 right-1" />
                            )}
                          </div>

                          {/* Step label */}
                          <span
                            className={`text-xs text-center font-medium max-w-20 leading-tight ${
                              step.isActive || step.status === "completed"
                                ? "text-gray-800"
                                : "text-gray-400"
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom section with delivery info and tracking */}
                  <div className="flex justify-between items-center mt-8">
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Estimated delivery: {estimatedDelivery || (() => {
                        const date = new Date(order.createdAt);
                        date.setDate(date.getDate() + 7);
                        return formatDate(date.toISOString());
                      })()}
                    </div>
                    <div>
                      <Button
                        variant="outline"
                        onClick={handleOpenTrackingModal}
                        className="flex items-center gap-2 bg-[#FFBF3B] font-semibold"
                      >
                        <Truck className="w-4 h-4" />
                        Track order
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Payment and Schedule Information */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-bold mb-3">Payment & Schedule Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-bold">Payment Method:</span>
                      <p className="font-medium">{paymentInfo.method}</p>
                    </div>
                    <div>
                      <span className="font-bold">Order Type:</span>
                      <p className="font-medium">{paymentInfo.orderType}</p>
                    </div>
                    <div>
                      <span className="font-bold">Payment Status:</span>
                      <Badge variant={order.paymentStatus === 'PAID' ? 'default' : 'secondary'} className="ml-2">
                        {order.paymentStatus}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-bold">Schedule Type:</span>
                      <Badge variant={paymentInfo.isScheduled ? 'secondary' : 'default'} className="ml-2">
                        {paymentInfo.isScheduled ? 'Scheduled' : 'Immediate'}
                      </Badge>
                    </div>
                  </div>

                  {/* Payment Urgency Indicators */}
                  <div className="mt-3 flex gap-2">
                    {paymentInfo.requiresImmediatePayment && (
                      <Badge className="bg-red-100 text-red-800 text-xs">
                        ⚠️ Payment Required
                      </Badge>
                    )}
                    {paymentInfo.isPayOnDelivery && (
                      <Badge className="bg-yellow-50 text-black text-xs">
                        💰 Pay on Delivery
                      </Badge>
                    )}
                    {paymentInfo.isScheduled && (
                      <Badge className="bg-purple-100 text-purple-800 text-xs">
                        📅 Scheduled Order
                      </Badge>
                    )}
                    {order.paymentStatus === 'PAID' && (
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        ✅ Payment Complete
                      </Badge>
                    )}
                    {order.paymentStatus === 'PARTIALLY_PAID' && (
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                        ⚠️ Partial Payment
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Order Timeline with Green Theme */}
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Clock className="w-6 h-6 text-green-600" />
                  Order Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Vertical timeline line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-green-100 z-0"></div>
                  
                  <div className="space-y-6">
                    {order.timeline && order.timeline.length > 0 ? (
                      order.timeline.map((event: any, index: number) => (
                        <div key={index} className="flex gap-4 relative z-10">
                          {/* Timeline indicator */}
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                            {index < order.timeline.length - 1 && (
                              <div className="w-0.5 h-12 bg-green-200 mt-1"></div>
                            )}
                          </div>
                          
                          {/* Timeline content */}
                          <div className="flex-1 bg-green-50 p-4 rounded-lg border border-green-100 mb-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-green-800 text-lg capitalize">
                                {event?.action?.replace?.(/_/g, ' ') || 'Order Update'}
                              </h4>
                              <span className="text-sm text-green-600">
                                {formatDateTime(event?.createdAt || order.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm text-green-700 mt-2">
                              {event?.details?.description ||
                                event?.details?.adminNotes ||
                                "Order status updated"}
                            </p>
                            {event?.details?.previousStatus && (
                              <div className="flex items-center mt-2 text-xs text-green-600">
                                <span className="bg-green-200 px-2 py-1 rounded-md">
                                  Changed from {event.details.previousStatus} to {event.status}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>No timeline events available</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Table */}
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle>Products ({order.items?.length || 0} items)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3">Product</th>
                        <th className="text-left py-3">Unit Price</th>
                        <th className="text-left py-3">Quantity</th>
                        <th className="text-left py-3">Total</th>
                        <th className="text-left py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item: any, index: number) => (
                          <tr key={index} className="border-b">
                            <td className="py-3">
                              <div className="flex items-center gap-3">
                         
                                <div>
                                  <p className="font-medium">{item.product?.name || 'Unknown Product'}</p>
                                  <p className="text-sm text-gray-500">
                                    {item.product?.category?.name || 'No Category'}
                                  </p>

                                </div>
                              </div>
                            </td>
                            <td className="py-3 font-medium">₦{(item.price || item.unitPrice || 0).toLocaleString()}</td>
                            <td className="py-3">{item.quantity || 0}</td>
                            <td className="py-3 font-medium">₦{(item.totalPrice || item.lineTotal || (item.price * item.quantity) || 0).toLocaleString()}</td>
                            <td className="py-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewProduct(item.product || item)}
                                className="flex items-center gap-1"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-gray-500">
                            No products found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Customer & Summary */}
          <div className="space-y-6">
            {/* Customer Info */}
            <Card className="rounded-xl">
              <div className="flex items-center pt-6">
                <CardHeader className="text-center">
                  <div className="w-[100px] h-[100px] rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
                    {profile?.profileImage ? (
                      <Image
                        src={profile.profileImage}
                        alt="Customer"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <User className="w-8 h-8 text-gray-400" />
                    )}
                  </div>

                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <CardTitle>{profile?.fullName || profile?.businessName || customer?.email || 'Unknown Customer'}</CardTitle>
                  <p className="text-sm normalize text-gray-500">{customer?.type || "Customer"}</p>
                  <div><Badge className="bg-green-100 text-green-800">ACTIVE</Badge></div>



                </CardContent>
              </div>
              <Separator />
              {/* Shipping Address */}
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <p className="text-sm text-gray-500 w-[150px]">Primary address</p>
                    <p className="font-medium">
                      {shippingAddress?.fullAddress || profile?.address || "Address not available"}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex items-center">
                      <p className="text-gray-500 w-[150px]">City:</p>
                      <p className="font-medium">{shippingAddress?.city || "N/A"}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-gray-500 w-[150px]">State</p>
                      <p className="font-medium">{shippingAddress?.stateProvince || "N/A"}</p>
                    </div >
                    <div className="flex items-center">
                      <p className="text-gray-500 w-[150px]">Country</p>
                      <p className="font-medium">{shippingAddress?.country || "Nigeria"}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-gray-500 w-[150px]">Post Code</p>
                      <p className="font-medium">{shippingAddress?.postalCode || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>


            <Card>

            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-medium">{order.summary?.totalQuantity || order.items?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sub Total:</span>
                    <span className="font-medium">₦{(order.summary?.itemsSubtotal || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium">6%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping Fee:</span>
                    <span className="font-medium">₦{(order.summary?.shippingFee || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-medium text-red-500">-₦{(order.summary?.discount || 0).toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span>₦{(order.totalPrice || 0).toLocaleString()}</span>
                  </div>

                  {/* Enhanced Payment & Delivery Information */}
                  <PaymentInfoDisplay order={order} />
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
        onRefundSuccess={handleRefundSuccess} // Optional custom success handler
      />

    </div>

  );
};

export default React.memo(OrderDetails);