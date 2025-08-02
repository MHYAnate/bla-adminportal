"use client";

import React, { useEffect, useMemo, useCallback, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetOrderInfo } from "@/services/orders";
import { formatDate, formatDateTime } from "@/lib/utils";
import { useRouter } from "next/navigation";
// @ts-ignore - Import your services (adjust paths as needed)
import httpService from "@/services/httpService";
// @ts-ignore - Import your routes (adjust paths as needed) 
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

// Product Details Modal Component
const ProductDetailsModal = ({
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 mb-4">
            <Package className="w-5 h-5" />
            <span className="text-xl font-semibold">Product Details</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex gap-6">
            <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
              <Package className="w-12 h-12 text-gray-400" />
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
                  <p className="font-medium">{product.processingTimeDays} days</p>
                </div>
                <div>
                  <span className="text-gray-500">Returns:</span>
                  <p className="font-medium">{product.acceptsReturns ? "Accepted" : "Not Accepted"}</p>
                </div>
              </div>
            </div>
          </div>

          {product.description && (
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-gray-600">{product.description}</p>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Order Tracking Modal Component
const OrderTrackingModal = ({
  order,
  onClose,
  isOpen
}: {
  order: any;
  onClose: () => void;
  isOpen: boolean;
}) => {
  if (!order) return null;

  const getTrackingSteps = (status: string, paymentStatus: string) => {
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
        name: "Payment Pending",
        status: paymentStatus === "PAID" ? "completed" :
          paymentStatus === "PARTIALLY_PAID" ? "current" :
            status === "PROCESSING" ? "current" : "pending",
        icon: <CreditCard className="w-6 h-6" />,
        description: "Awaiting payment confirmation"
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
  };

  const trackingSteps = getTrackingSteps(order.status, order.paymentStatus);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="p-1"
              onClick={onClose}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Truck className="w-6 h-6" />
            <span className="text-2xl font-semibold">Order Tracking</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Home</span>
            <span>›</span>
            <span>Orders</span>
            <span>›</span>
            <span className="text-gray-800">Tracking</span>
          </div>

          {/* Progress Tracker */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              {/* Progress line background */}
              <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 z-0"></div>

              {trackingSteps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center relative z-10 bg-white px-2">
                  {/* Step icon */}
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

                  {/* Step label */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <span className="font-medium">₦{order.totalPrice?.toLocaleString()}</span>
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
                      <span className="font-medium">₦{order.shipping.totalShippingFee?.toLocaleString()}</span>
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

          {/* Close Button */}
          <div className="flex justify-end pt-4">
            <Button onClick={onClose} className="bg-orange-500 hover:bg-orange-600">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Type definitions with more flexible typing
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

// Flexible order data type to handle your backend structure
interface OrderData {
  id: any;
  orderId?: any;
  status: string;
  totalPrice: any;
  createdAt?: string;
  updatedAt?: string;
  paymentStatus?: string;
  orderType?: string;
  amountDue?: number;
  amountPaid?: number;
  userId?: number;
  user: {
    id?: number;
    email?: string;
    type?: string;
    profile?: any;
    businessProfile?: any;
  };
  items?: any[];
  timeline?: any[];
  shipping?: any;
  breakdown?: any;
  summary?: any;
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

  const {
    getOrderInfoData: rawData,
    getOrderInfoIsLoading,
    getOrderInfoError,
    refetchOrderInfo,
  } = useGetOrderInfo({
    enabled: Boolean(orderId),
    orderId: orderId
  } as any);

  // State for updating status
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  // Track initial load completion
  useEffect(() => {
    if (!getOrderInfoIsLoading && (rawData || getOrderInfoError)) {
      setHasInitialLoad(true);
    }
  }, [getOrderInfoIsLoading, rawData, getOrderInfoError]);

  // Handle product view
  const handleViewProduct = useCallback((product: any) => {
    setSelectedProduct(product);
    setProductModalOpen(true);
  }, []);

  // Handle opening tracking modal
  const handleOpenTrackingModal = useCallback(() => {
    setTrackingModalOpen(true);
  }, []);

  // Handle close
  const handleClose = useCallback(() => {
    if (setClose) {
      setClose(false);
    } else {
      router.back();
    }
  }, [setClose, router]);

  // Handle status update using your existing httpService
  const handleStatusUpdate = useCallback(async (newStatus: string) => {
    if (!orderId) {
      console.error('No order ID available');
      return;
    }

    setIsUpdatingStatus(true);

    try {
      console.log(`Updating order ${orderId} to status: ${newStatus}`);

      // Use your existing httpService and routes
      const response = await (httpService as any).patchData(
        {
          status: newStatus,
          notes: `Status updated to ${newStatus} via admin panel`
        },
        (routes as any).updateOrderStatus(orderId)
      );

      console.log('✅ Order status update response:', response);

      // Refresh the order data
      if (refetchOrderInfo) {
        await refetchOrderInfo();
      }

      console.log(`✅ Order ${orderId} successfully updated to ${newStatus}`);

      // Show success message
      alert(`Order status successfully updated to ${newStatus}`);

    } catch (error: any) {
      console.error('❌ Failed to update order status:', error);
      alert(`Failed to update order status: ${error?.message || 'Unknown error'}`);
    } finally {
      setIsUpdatingStatus(false);
    }
  }, [orderId, refetchOrderInfo]);

  const handleEditOrder = useCallback(() => {
    if (isModal && setClose) setClose(false);
    router.push(`/admin/orders/${orderId}/edit`);
  }, [isModal, setClose, router, orderId]);

  const handleRetry = useCallback(() => {
    console.log('🔄 Retrying order data fetch...');
    setHasInitialLoad(false);
    if (refetchOrderInfo) {
      refetchOrderInfo();
    }
  }, [refetchOrderInfo]);

  // Don't show error immediately - give it time to load on first render
  if (getOrderInfoIsLoading && !hasInitialLoad) {
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

  // Only show error after initial load attempt or if we have tried before
  if ((getOrderInfoError && hasInitialLoad) || (getOrderInfoError && !getOrderInfoIsLoading && !rawData)) {
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
            {getOrderInfoError || "Unable to load order details. Please try again."}
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

  // Show loading if still loading and no data
  if (getOrderInfoIsLoading && !rawData) {
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

  // If no data after loading, show empty state
  if (!rawData && hasInitialLoad) {
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
            The order #{orderId} could not be found or you don't have permission to view it.
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

  const order = rawData as OrderData;
  const customer = order.user;
  const profile = customer?.profile || customer?.businessProfile;

  // Safe property access with fallbacks
  const orderCreatedAt = order.createdAt || (rawData as any)?.createdAt || new Date().toISOString();
  const orderPaymentStatus = order.paymentStatus || (rawData as any)?.paymentStatus || 'PENDING';

  // Find shipping address from multiple possible sources
  const getShippingAddress = useCallback(() => {
    // First try to find in timeline - look for ORDER_CREATED event specifically
    const orderCreatedEvent = order.timeline?.find((event: any) =>
      event?.action === 'ORDER_CREATED' && event?.details?.shippingAddress
    );

    if (orderCreatedEvent?.details?.shippingAddress) {
      return orderCreatedEvent.details.shippingAddress;
    }

    // Fallback: try first timeline entry with shipping address
    const timelineWithAddress = order.timeline?.find((event: any) =>
      event?.details?.shippingAddress
    );

    if (timelineWithAddress?.details?.shippingAddress) {
      return timelineWithAddress.details.shippingAddress;
    }

    // Fallback: try direct shipping address on order
    if ((rawData as any)?.shippingAddress) {
      return (rawData as any).shippingAddress;
    }

    // Fallback: try user profile address
    if (order.user?.profile?.address || order.user?.businessProfile?.businessAddress) {
      return {
        fullAddress: order.user?.profile?.address || order.user?.businessProfile?.businessAddress,
        city: 'N/A',
        stateProvince: 'N/A',
        country: 'N/A',
        postalCode: 'N/A'
      };
    }

    return null;
  }, [order.timeline, rawData, order.user]);

  const shippingAddress = getShippingAddress();

  // Get status color and text
  const getStatusBadge = (status: string): OrderStatus => {
    const statusMap: Record<string, OrderStatus> = {
      'PENDING': { variant: 'secondary' as const, text: 'Pending' },
      'PROCESSING': { variant: 'default' as const, text: 'In Progress' },
      'SHIPPED': { variant: 'default' as const, text: 'Shipped' },
      'DELIVERED': { variant: 'default' as const, text: 'Delivered' },
      'COMPLETED': { variant: 'default' as const, text: 'Completed' },
      'CANCELLED': { variant: 'destructive' as const, text: 'Cancelled' }
    };
    return statusMap[status] || { variant: 'secondary' as const, text: status };
  };

  // Get available status transitions based on current status
  const getAvailableStatusTransitions = (currentStatus: string): StatusTransition[] => {
    const statusTransitions: Record<string, StatusTransition[]> = {
      'PENDING': [
        { value: 'PROCESSING', label: 'Start Processing', icon: Package, color: 'text-blue-600' },
        { value: 'CANCELLED', label: 'Cancel Order', icon: X, color: 'text-red-600' }
      ],
      'PROCESSING': [
        { value: 'SHIPPED', label: 'Mark as Shipped', icon: Truck, color: 'text-purple-600' },
        { value: 'CANCELLED', label: 'Cancel Order', icon: X, color: 'text-red-600' }
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

    return statusTransitions[currentStatus] || [];
  };

  const availableTransitions = getAvailableStatusTransitions(order.status);
  const statusInfo = getStatusBadge(order.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={handleClose}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Manage orders
            </Button>
            <h1 className="text-2xl font-bold">Order Details</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleOpenTrackingModal}
              className="flex items-center gap-2"
            >
              <Truck className="w-4 h-4" />
              Track order
            </Button>

            {/* Status Update Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="bg-orange-500 hover:bg-orange-600 flex items-center gap-2"
                  disabled={isUpdatingStatus || availableTransitions.length === 0}
                >
                  {isUpdatingStatus ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4" />
                      Update Progress
                      <ChevronDown className="w-4 h-4" />
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
                  availableTransitions.map((transition: StatusTransition) => {
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

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => alert('Advanced edit options would go here')}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Edit className="w-4 h-4 text-gray-600" />
                  <span>Advanced Edit...</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">Order# {order.id}</h2>
                    <p className="text-gray-500 text-sm">
                      Order Date: {formatDate(orderCreatedAt)} | Order Time: {formatDateTime(orderCreatedAt)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={statusInfo.variant} className="px-3 py-1">
                      {statusInfo.text}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Refund
                    </Button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-4">Order Progress</h3>
                  <div className="flex items-center justify-between">
                    {[
                      { label: "Order Confirming", status: "completed" },
                      { label: "Payment Pending", status: orderPaymentStatus === "PAID" ? "completed" : "current" },
                      { label: "Processing", status: order.status === "PROCESSING" ? "current" : order.status === "SHIPPED" || order.status === "DELIVERED" ? "completed" : "pending" },
                      { label: "Shipping", status: order.status === "SHIPPED" ? "current" : order.status === "DELIVERED" ? "completed" : "pending" },
                      { label: "Delivered", status: order.status === "DELIVERED" ? "completed" : "pending" }
                    ].map((step, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${step.status === "completed" ? "bg-green-500 text-white" :
                            step.status === "current" ? "bg-yellow-500 text-white" :
                              "bg-gray-200 text-gray-500"
                          }`}>
                          {step.status === "completed" ? <CheckCircle className="w-4 h-4" /> :
                            step.status === "current" ? <Clock className="w-4 h-4" /> :
                              <Circle className="w-4 h-4" />}
                        </div>
                        <span className="text-xs mt-2 text-center max-w-16">{step.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-gray-500 mt-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Estimated shipping date: {(() => {
                      const date = new Date(orderCreatedAt);
                      date.setDate(date.getDate() + 7);
                      return formatDate(date.toISOString());
                    })()}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Order Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.timeline?.map((event: any, index: number) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0">
                        <Package className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{event?.action?.replace?.(/_/g, ' ') || 'Order Update'}</h4>
                          <span className="text-sm text-gray-500">
                            {formatDateTime(event?.createdAt || orderCreatedAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {event?.details?.description || "Order status updated"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Product Table */}
            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3">Product Name</th>
                        <th className="text-left py-3">Amount</th>
                        <th className="text-left py-3">QTY</th>
                        <th className="text-left py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items?.map((item: any, index: number) => (
                        <tr key={index} className="border-b">
                          <td className="py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                                <Package className="w-5 h-5 text-gray-400" />
                              </div>
                              <div>
                                <p className="font-medium">{item.product?.name || item.name || 'Unknown Product'}</p>
                                <p className="text-sm text-gray-500">{item.product?.category?.name || item.category || 'No Category'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 font-medium">₦{item.price?.toLocaleString() || '0'}</td>
                          <td className="py-3">{item.quantity || 0}</td>
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
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Customer & Summary */}
          <div className="space-y-6">
            {/* Customer Info */}
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <CardTitle>{profile?.fullName || profile?.businessName || customer?.email}</CardTitle>
                <p className="text-sm text-gray-500">{customer?.type || "Customer"}</p>
                <Badge className="bg-green-100 text-green-800">ACTIVE</Badge>
              </CardHeader>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Primary address</p>
                    <p className="font-medium">
                      {shippingAddress?.fullAddress || "Address not available"}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">City</p>
                      <p className="font-medium">{shippingAddress?.city || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">State/Province</p>
                      <p className="font-medium">{shippingAddress?.stateProvince || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Country</p>
                      <p className="font-medium">{shippingAddress?.country || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Post Code</p>
                      <p className="font-medium">{shippingAddress?.postalCode || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
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
                    <span className="font-medium">{order.summary?.totalQuantity || order.items?.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sub Total:</span>
                    <span className="font-medium">₦{order.summary?.itemsSubtotal?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium">6%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping Fee:</span>
                    <span className="font-medium">₦{order.summary?.shippingFee?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-medium text-red-500">-₦0</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span>₦{order.totalPrice?.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <OrderTrackingModal
        order={{ ...order, createdAt: orderCreatedAt, paymentStatus: orderPaymentStatus }}
        isOpen={trackingModalOpen}
        onClose={() => setTrackingModalOpen(false)}
      />

      <ProductDetailsModal
        product={selectedProduct}
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
      />
    </div>
  );
};

export default OrderDetails;