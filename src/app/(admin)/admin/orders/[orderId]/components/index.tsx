"use client";

import React, { useEffect, useMemo, useCallback, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetOrderInfo } from "@/services/orders";
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
              {product.image || product.images?.[0] ? (
                <Image
                  src={product.image || product.images[0]}
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
              <p className="text-gray-600 mb-4">{product.shortDescription || product.description}</p>
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
                  <p className="font-medium">{product.processingTimeDays || 'N/A'} days</p>
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
  }, []);

  const trackingSteps = useMemo(() =>
    getTrackingSteps(order.status, order.paymentStatus),
    [order.status, order.paymentStatus, getTrackingSteps]
  );

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

// Processed order data type - ensures all required fields are present
interface ProcessedOrderData {
  // Core required fields
  id: any;
  orderId: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  paymentStatus: string;

  // Arrays (always present, may be empty)
  items: any[];
  timeline: any[];

  // Objects (always present, may be empty)
  user: any;
  summary: any;
  breakdown: any;

  // Optional/nullable fields
  shipping: any;

  // Payment fields (always numbers, may be 0)
  amountPaid: number;
  amountDue: number;

  // Additional optional fields
  updatedAt?: string;
  orderType?: string;
  userId?: number;

  // Allow additional properties from raw data
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

  // Validate orderId before proceeding
  if (!orderId) {
    console.error("OrderDetails: No orderId provided");
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

  // ✅ FIXED: Memoize all callbacks with stable dependencies
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
      console.error('No order ID available');
      toast.error('No order ID available');
      return;
    }

    setIsUpdatingStatus(true);

    try {
      console.log(`Updating order ${orderId} to status: ${newStatus}`);

      const response = await httpService.patchData(
        { status: newStatus, notes: `Status updated to ${newStatus} via admin panel` },
        routes.updateOrderStatus(orderId)
      );

      console.log('✅ Order status update response:', response);

      // Refresh the order data
      if (refetchOrderInfo) {
        await refetchOrderInfo();
      }

      console.log(`✅ Order ${orderId} successfully updated to ${newStatus}`);
      toast.success(`Order status successfully updated to ${newStatus}`);

    } catch (error: any) {
      console.error('❌ Failed to update order status:', error);
      toast.error(`Failed to update order status: ${error?.message || 'Unknown error'}`);
    } finally {
      setIsUpdatingStatus(false);
    }
  }, [orderId, refetchOrderInfo]);

  const handleRetry = useCallback(() => {
    console.log('🔄 Retrying order data fetch...');
    if (refetchOrderInfo) {
      refetchOrderInfo();
    }
  }, [refetchOrderInfo]);

  // ✅ Helper functions for safe property access
  const getAmountPaid = useCallback((orderData: any): number => {
    return typeof orderData?.amountPaid === 'number' ? orderData.amountPaid : 0;
  }, []);

  const getAmountDue = useCallback((orderData: any): number => {
    return typeof orderData?.amountDue === 'number' ? orderData.amountDue : 0;
  }, []);

  // ✅ FIXED: Memoize processed data to prevent re-renders
  const processedOrderData = useMemo(() => {
    if (!rawData) return null;

    // Create a properly typed processed order data object with explicit typing
    const processed = {
      // Spread all existing properties first
      ...rawData,
      // Then override/ensure required properties
      id: rawData.id,
      orderId: rawData.orderId || `#${String(rawData.id || '').padStart(6, '0')}`,
      status: rawData.status || 'PENDING',
      totalPrice: Number(rawData.totalPrice) || 0,
      createdAt: rawData.createdAt || new Date().toISOString(),
      paymentStatus: rawData.paymentStatus || 'PENDING',
      items: Array.isArray(rawData.items) ? rawData.items : [],
      timeline: Array.isArray(rawData.timeline) ? rawData.timeline : [],
      user: rawData.user || {},
      summary: rawData.summary || {},
      breakdown: rawData.breakdown || {},
      shipping: rawData.shipping || null,
      // Payment properties with explicit handling
      amountPaid: (rawData as any).amountPaid || 0,
      amountDue: (rawData as any).amountDue || 0,
    };

    return processed;
  }, [rawData]);

  // ✅ FIXED: Memoize shipping address calculation
  const shippingAddress = useMemo(() => {
    if (!processedOrderData) return null;

    // First try to find in timeline - look for ORDER_CREATED event specifically
    const orderCreatedEvent = processedOrderData.timeline?.find((event: any) =>
      event?.action === 'ORDER_CREATED' && event?.details?.shippingAddress
    );

    if (orderCreatedEvent?.details?.shippingAddress) {
      return orderCreatedEvent.details.shippingAddress;
    }

    // Fallback: try first timeline entry with shipping address
    const timelineWithAddress = processedOrderData.timeline?.find((event: any) =>
      event?.details?.shippingAddress
    );

    if (timelineWithAddress?.details?.shippingAddress) {
      return timelineWithAddress.details.shippingAddress;
    }

    // Fallback: try user profile address
    if (processedOrderData.user?.profile?.address || processedOrderData.user?.businessProfile?.businessAddress) {
      return {
        fullAddress: processedOrderData.user?.profile?.address || processedOrderData.user?.businessProfile?.businessAddress,
        city: 'N/A',
        stateProvince: 'N/A',
        country: 'N/A',
        postalCode: 'N/A'
      };
    }

    return null;
  }, [processedOrderData]);

  // ✅ FIXED: Memoize status badge and transitions
  const statusInfo = useMemo(() => {
    if (!processedOrderData) return { variant: 'secondary' as const, text: 'Unknown' };

    const statusMap: Record<string, OrderStatus> = {
      'PENDING': { variant: 'secondary' as const, text: 'Pending' },
      'PROCESSING': { variant: 'default' as const, text: 'In Progress' },
      'SHIPPED': { variant: 'default' as const, text: 'Shipped' },
      'DELIVERED': { variant: 'default' as const, text: 'Delivered' },
      'COMPLETED': { variant: 'default' as const, text: 'Completed' },
      'CANCELLED': { variant: 'destructive' as const, text: 'Cancelled' }
    };
    return statusMap[processedOrderData.status] || { variant: 'secondary' as const, text: processedOrderData.status };
  }, [processedOrderData]);

  const availableTransitions = useMemo(() => {
    if (!processedOrderData) return [];

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

  // Handle errors
  if (getOrderInfoError) {
    const errorMessage = getOrderInfoError.includes('not found')
      ? `Order #${orderId} was not found or you don't have permission to view it.`
      : getOrderInfoError;

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
            {errorMessage}
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

  // Handle empty data
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
                  onClick={() => toast.info('Advanced edit options coming soon')}
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
                      Order Date: {formatDate(order.createdAt)} | Order Time: {formatDateTime(order.createdAt)}
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
                      { label: "Payment Pending", status: order.paymentStatus === "PAID" ? "completed" : "current" },
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
                      const date = new Date(order.createdAt);
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
                  {order.timeline && order.timeline.length > 0 ? (
                    order.timeline.map((event: any, index: number) => (
                      <div key={index} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0">
                          <Package className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{event?.action?.replace?.(/_/g, ' ') || 'Order Update'}</h4>
                            <span className="text-sm text-gray-500">
                              {formatDateTime(event?.createdAt || order.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {event?.details?.description || "Order status updated"}
                          </p>
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
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item: any, index: number) => (
                          <tr key={index} className="border-b">
                            <td className="py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                                  {item.product?.image || item.product?.images?.[0] ? (
                                    <Image
                                      src={item.product.image || item.product.images[0]}
                                      alt={item.product?.name || 'Product'}
                                      width={40}
                                      height={40}
                                      className="w-full h-full object-cover rounded"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                      }}
                                    />
                                  ) : (
                                    <Package className="w-5 h-5 text-gray-400" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium">{item.product?.name || item.name || 'Unknown Product'}</p>
                                  <p className="text-sm text-gray-500">{item.product?.category?.name || item.category || 'No Category'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 font-medium">₦{(item.price || 0).toLocaleString()}</td>
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
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-gray-500">
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
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
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
                <CardTitle>{profile?.fullName || profile?.businessName || customer?.email || 'Unknown Customer'}</CardTitle>
                <p className="text-sm text-gray-500">{customer?.type || "Customer"}</p>
                <Badge className="bg-green-100 text-green-800">ACTIVE</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{customer?.email || 'No email'}</span>
                  </div>
                  {profile?.phoneNumber && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{profile.phoneNumber}</span>
                    </div>
                  )}
                </div>
              </CardContent>
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

                  {/* Payment Status */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Payment Status:</span>
                      <Badge variant={order.paymentStatus === 'PAID' ? 'default' : 'secondary'}>
                        {order.paymentStatus}
                      </Badge>
                    </div>
                    {getAmountPaid(order) > 0 && (
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-600">Amount Paid:</span>
                        <span className="text-sm font-medium">₦{getAmountPaid(order).toLocaleString()}</span>
                      </div>
                    )}
                    {getAmountDue(order) > 0 && (
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-600">Amount Due:</span>
                        <span className="text-sm font-medium text-red-600">₦{getAmountDue(order).toLocaleString()}</span>
                      </div>
                    )}
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
    </div>
  );
};

export default React.memo(OrderDetails);