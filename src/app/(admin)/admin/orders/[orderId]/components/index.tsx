"use client";

import React, { useMemo, useCallback, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetOrderInfo, useProcessRefund } from "@/services/orders";
import { RefundModal, PaymentInfoDisplay } from './refund';
import { formatDate, formatDateTime } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
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
                  <p className="font-medium">{product.processingTimeDays || 'N/A'} days</p>
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
    const steps = [
      {
        id: 1,
        name: "Payment Pending",
        status: paymentStatus === "PAID" || paymentStatus === "PARTIALLY_PAID" ? "completed" : "current",
        icon: <CreditCard className="w-6 h-6" />,
        description: "Waiting for payment"
      },
      {
        id: 2,
        name: "Order Confirmed",
        status: paymentStatus === "PAID" || paymentStatus === "PARTIALLY_PAID" ? "completed" : "pending",
        icon: <CheckCircle className="w-6 h-6" />,
        description: "Order has been confirmed"
      },
      {
        id: 3,
        name: "Processing",
        status: ["PROCESSING", "SHIPPED", "DELIVERED", "COMPLETED"].includes(status) ? 
          (status === "PROCESSING" ? "current" : "completed") : "pending",
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

              {trackingSteps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center relative z-10 bg-white px-2">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 border-4 border-white shadow-sm ${step.status === "completed"
                      ? "bg-green-900 text-white"
                      : step.status === "current"
                        ? "bg-green-500 text-white"
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
  returnPage1?: number; // Added for back button functionality
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  orderId,
  setClose,
  isModal = false,
  returnPage1 = 1 // Default to page 1
}) => {

  const searchParams = useSearchParams();
  const returnPage = searchParams.get('page') || '1';
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
      // Go back to the orders page with the saved page number
      router.push(`/admin/orders?page=${returnPage}`);
    }
  }, [setClose, router, returnPage]);

  const handleBackToOrders = useCallback(() => {
    // Navigate back to the orders page with the saved page number
   
  

    router.push(`/admin/orders?page=${returnPage}`);
  }, [router, returnPage]);

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
        <Button
              variant="outline"
              onClick={handleBackToOrders}
              className="flex items-center gap-2 w-fit mb-5"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Orders
            </Button>
        <div className="flex items-center justify-between mb-6">
          
          <div className="flex items-center gap-4">
            {/* Back Button */}
           
            <div className="flex flex-col items-start gap-2">
              <h1 className="text-3xl font-bold">Order Details</h1>
              <p className="text-[#687588]">Manage orders</p>
            </div>
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
                              key: "PAYMENT_PENDING", 
                              completed: true // Always show first step
                            },
                            { 
                              key: "ORDER_CONFIRMED", 
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
                          return ((completedSteps - 1) / (steps.length - 1)) * 100;
                        })()}%`
                      }}
                    />

                    {/* Progress steps with icons */}
                    <div className="relative z-10 flex items-center justify-between">
                      {[
                        {
                          label: "Payment Pending",
                          status: order.paymentStatus === "PAID" || order.paymentStatus === "PARTIALLY_PAID" ? "completed" : "current",
                          icon: <CreditCard className="w-5 h-5" />,
                          isActive: true
                        },
                        {
                          label: "Order Confirmed",
                          status: order.paymentStatus === "PAID" || order.paymentStatus === "PARTIALLY_PAID" ? "completed" : "pending",
                          icon: <CheckCircle className="w-5 h-5" />,
                          isActive: order.paymentStatus === "PAID" || order.paymentStatus === "PARTIALLY_PAID",
                          showSpinner: false
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
                      <span className="font-bold">Payment Type:</span>
                      <p className="font-medium">{processedOrderData.shipping.paymentType}</p>
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
                          {event?.details?.paymentMethod && <p className="text-sm text-green-700 mt-2">
                            Payment Method : {event?.details?.paymentMethod }
                            </p>}
                            
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
              <div className="flex-col items-center justify-center pt-6">
       
                <CardHeader className="text-center">
  <div className="w-[100px] h-[100px] rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-lg font-semibold text-white shadow-md">
    {customer?.profile?.fullName
      ? customer?.profile?.fullName
          .split(' ')
          .map((word:any) => word[0])
          .join('')
          .toUpperCase()
      : '--'}
  </div>
  </div>

  {/* Email Display */}
  {profile?.email && (
    // <p className="text-sm text-gray-700 break-words max-w-[200px] mx-auto">
    //   {profile.email}
    // </p>
    <p className="text-sm text-gray-700 break-words overflow-hidden whitespace-normal max-w-[100px] mx-auto">
    {profile.email}
  </p>

  )}
</CardHeader>
                <CardContent className="flex flex-col gap-2 ">
                  <CardTitle> <p className="text-sm text-gray-700 break-words overflow-hidden whitespace-normal mx-auto">{profile?.fullName || profile?.businessName || customer?.email || 'Unknown Customer'}</p></CardTitle>
                  <p className="text-base text-gray-800 break-words whitespace-normal max-w-xs">{customer?.email || "No email"}</p>
                  <p className="text-sm text-gray-500">{customer?.type || "Customer"}</p>
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
                     <div className="flex items-center">
                    <p className="text-sm text-gray-500 w-[150px]">Shipping address</p>
                    <p className="font-medium">
                      {shippingAddress?.addressLine1 || profile?.address || "Address not available"}
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
                    <span className="text-gray-600">Shipping Fee:</span>
                    <span className="font-medium">₦{ processedOrderData?.shipping?.totalShippingFee|| "N/A"}</span>
                  </div>
                  {/* <div className="flex justify-between">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-medium text-red-500">-₦{(order.summary?.discount || 0).toLocaleString()}</span>
                  </div> */}
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