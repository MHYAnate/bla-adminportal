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

  const getTrackingSteps = useMemo(() => (status: string, paymentStatus: string) => {
    const steps = [
      {
        id: 1,
        name: "Order Placed",
        status: "completed",
        icon: <CheckCircle className="w-6 h-6" />,
        description: "Order has been confirmed"
      },
      {
        id: 2,
        name: "Payment",
        status: paymentStatus === "PAID" ? "completed" : "current",
        icon: <CreditCard className="w-6 h-6" />,
        description: "Payment processing"
      },
      {
        id: 3,
        name: "Processing",
        status: status === "PROCESSING" ? "current" :
          ["SHIPPED", "DELIVERED", "COMPLETED"].includes(status) ? "completed" : "pending",
        icon: <Package className="w-6 h-6" />,
        description: "Order is being prepared"
      },
      {
        id: 4,
        name: "Shipped",
        status: status === "SHIPPED" ? "current" :
          ["DELIVERED", "COMPLETED"].includes(status) ? "completed" : "pending",
        icon: <Truck className="w-6 h-6" />,
        description: "Order is on the way"
      },
      {
        id: 5,
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

// Main Order Details Component
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

  const handleStatusUpdate = useCallback(async (newStatus: string) => {
    if (!orderId) {
      toast.error('No order ID available');
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
  }, [orderId, refetchOrderInfo]);

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

  // Memoized available transitions
  const availableTransitions = useMemo(() => {
    if (!processedOrderData) return [];

    const statusTransitions: Record<string, StatusTransition[]> = {
      'PENDING': [
        { value: 'PROCESSING', label: 'Start Processing', icon: Package, color: 'text-blue-600' },
        { value: 'CANCELLED', label: 'Cancel Order', icon: X, color: 'text-red-600' }
      ],
      'SCHEDULED': [
        { value: 'PENDING', label: 'Mark as Pending', icon: Clock, color: 'text-orange-600' },
        { value: 'PROCESSING', label: 'Start Processing', icon: Package, color: 'text-blue-600' },
        { value: 'CANCELLED', label: 'Cancel Order', icon: X, color: 'text-red-600' }
      ],
      'PROCESSING': [
        { value: 'SHIPPED', label: 'Mark as Shipped', icon: Truck, color: 'text-purple-600' },
        { value: 'COMPLETED', label: 'Mark as Completed', icon: CheckCircle, color: 'text-green-600' },
        { value: 'CANCELLED', label: 'Cancel Order', icon: X, color: 'text-red-600' }
      ],
      'ONGOING': [
        { value: 'PROCESSING', label: 'Start Processing', icon: Package, color: 'text-blue-600' },
        { value: 'SHIPPED', label: 'Mark as Shipped', icon: Truck, color: 'text-purple-600' },
        { value: 'DELIVERED', label: 'Mark as Delivered', icon: CheckCircle, color: 'text-green-600' }
      ],
      'SHIPPED': [
        { value: 'DELIVERED', label: 'Mark as Delivered', icon: CheckCircle, color: 'text-green-600' }
      ],
      'DELIVERED': [
        { value: 'COMPLETED', label: 'Complete Order', icon: CheckCircle, color: 'text-green-600' }
      ],
      'CANCELLED': [],
      'COMPLETED': []
    };

    return statusTransitions[processedOrderData.status] || [];
  }, [processedOrderData]);

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
                            disabled={isUpdatingStatus || availableTransitions.length === 0}
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
                              No status changes available
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


                {/* Progress Bar */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-6">Order Progress</h3>

                  <div className="relative">
                    {/* Progress line container */}
                    <div className="absolute top-4 left-0 right-0 h-2 bg-gray-200 rounded-full z-0"></div>

                    {/* Active progress line */}
                    <div
                      className="absolute top-4 left-0 h-2 bg-green-500 rounded-full z-0 transition-all duration-500"
                      style={{
                        width: `${(() => {
                          const steps = [
                            { key: "ORDER_PLACED", completed: true },
                            { key: "PAYMENT", completed: order.paymentStatus === "PAID" },
                            { key: "PROCESSING", completed: ["PROCESSING", "ONGOING", "SHIPPED", "DELIVERED", "COMPLETED"].includes(order.status) },
                            { key: "SHIPPING", completed: ["SHIPPED", "DELIVERED", "COMPLETED"].includes(order.status) },
                            { key: "DELIVERED", completed: ["DELIVERED", "COMPLETED"].includes(order.status) }
                          ];

                          const completedSteps = steps.filter(step => step.completed).length;
                          return (completedSteps - 1) * 25; // 25% for each step (100% / 4 gaps)
                        })()}%`
                      }}
                    />

                    {/* Progress steps */}
                    <div className="relative z-10 flex items-center justify-between">
                      {[
                        {
                          label: "Order Confirming",
                          status: "completed",
                          isActive: true
                        },
                        {
                          label: order.paymentStatus === "PAID" ? "Payment Completed" : "Payment Pending",
                          status: order.paymentStatus === "PAID" ? "completed" : "current",
                          isActive: order.paymentStatus === "PAID"
                        },
                        {
                          label: "Processing",
                          status: ["PROCESSING", "ONGOING"].includes(order.status) ? "current" :
                            ["SHIPPED", "DELIVERED", "COMPLETED"].includes(order.status) ? "completed" : "pending",
                          isActive: ["PROCESSING", "ONGOING", "SHIPPED", "DELIVERED", "COMPLETED"].includes(order.status),
                          showSpinner: ["PROCESSING", "ONGOING"].includes(order.status)
                        },
                        {
                          label: "Shipping",
                          status: order.status === "SHIPPED" ? "current" :
                            ["DELIVERED", "COMPLETED"].includes(order.status) ? "completed" : "pending",
                          isActive: ["SHIPPED", "DELIVERED", "COMPLETED"].includes(order.status)
                        },
                        {
                          label: "Delivered",
                          status: ["DELIVERED", "COMPLETED"].includes(order.status) ? "completed" : "pending",
                          isActive: ["DELIVERED", "COMPLETED"].includes(order.status)
                        }
                      ].map((step, index) => (
                        <div key={index} className="flex flex-col items-center bg-white px-1">
                          {/* Step indicator - just colored dots */}
                          <div
                            className={`w-3 h-3 rounded-full mb-3 transition-all duration-300 ${step.status === "completed"
                              ? "bg-green-500"
                              : step.isActive
                                ? "bg-yellow-500"
                                : "bg-gray-300"
                              }`}
                          />


                          {/* Step label */}
                          <span
                            className={`text-xs text-center font-medium max-w-20 leading-tight ${step.isActive || step.status === "completed"
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
                      Estimated delivery: {(() => {
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
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Order Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.timeline && order.timeline.length > 0 ? (
                    order.timeline.map((event: any, index: number) => (
                      <div key={index} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0">
                          <Package className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-xl lowercase">{event?.action?.replace?.(/_/g, ' ') || 'Order Update'}</h4>
                            <span className="text-sm text-gray-500">
                              {formatDateTime(event?.createdAt || order.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {event?.details?.description ||
                              event?.details?.adminNotes ||
                              "Order status updated"}
                          </p>
                          {event?.details?.previousStatus && (
                            <p className="text-xs text-gray-500 mt-1">
                              Changed from {event.details.previousStatus} to {event.status}
                            </p>
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
                                {/* <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                                  {item.product?.image ? (
                                    <Image
                                      src={item.order?.product.image}
                                      alt={item.product?.name || 'Product'}
                                      width={48}
                                      height={48}
                                      className="w-full h-full object-cover rounded"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                      }}
                                    />
                                  ) : (
                                    <Package className="w-6 h-6 text-gray-400" />
                                  )}
                                </div> */}
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

            {/* Admin Alerts (if any) */}
            {/* {order.adminAlerts && order.adminAlerts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Admin Alerts ({order.adminAlerts.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {order.adminAlerts.map((alert: any, index: number) => (
                      <div key={index} className={`p-3 rounded-lg border ${alert.isResolved ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                        }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{alert.alertType?.replace(/_/g, ' ')}</span>
                          <Badge variant={alert.isResolved ? 'default' : 'destructive'}>
                            {alert.isResolved ? 'Resolved' : 'Active'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                        {alert.isResolved && alert.resolvedAt && (
                          <p className="text-xs text-green-600 mt-1">
                            Resolved on {formatDateTime(alert.resolvedAt)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )} */}
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