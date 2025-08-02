import Image from "next/image";
import {
  CallIcon,
  LocationIcon,
  MailIcon,
} from "../../../../../../../public/icons";
import { Badge } from "@/components/ui/badge";
import OrderItemCard from "@/components/order-item";
import { Button } from "@/components/ui/button";
import { useGetOrderInfo } from "@/services/orders";
import { formatDate, formatDateTime } from "@/lib/utils";
import React, { useEffect, useMemo, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, RefreshCw, Truck, Calendar, Eye } from "lucide-react";
import { IOrderItem } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
      { id: 1, name: "Order Placed", status: "completed", icon: "💰" },
      {
        id: 2,
        name: "Payment Pending",
        status: paymentStatus === "PAID" ? "completed" :
          paymentStatus === "PARTIALLY_PAID" ? "current" :
            status === "ongoing" ? "current" : "pending",
        icon: "💳"
      },
      {
        id: 3,
        name: "Payment Confirmed",
        status: paymentStatus === "PAID" ? "completed" : "pending",
        icon: "💳"
      },
      {
        id: 4,
        name: "Processing",
        status: status === "ongoing" ? "current" :
          status === "delivered" ? "completed" : "pending",
        icon: "📦"
      },
      {
        id: 5,
        name: "Delivered",
        status: status === "delivered" ? "completed" : "pending",
        icon: "🏠"
      },
    ];
    return steps;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getEstimatedDelivery = (createdAt: string, processingDays: number = 7) => {
    if (!createdAt) return "Not available";
    const date = new Date(createdAt);
    date.setDate(date.getDate() + processingDays);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const trackingSteps = getTrackingSteps(order.status, order.paymentStatus);
  const firstItem = Array.isArray(order.items) && order.items.length > 0 ? order.items[0] : null;

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
            <span className="text-2xl font-semibold text-gray-800">
              Order Tracking - {order.orderId || order.id}
            </span>
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
                <div key={step.id} className="flex flex-col items-center relative z-10">
                  {/* Step icon */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-lg mb-2 border-4 border-white shadow-sm ${step.status === "completed"
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
                    className={`text-xs text-center max-w-16 ${step.status === "completed" || step.status === "current"
                      ? "text-gray-800 font-medium"
                      : "text-gray-400"
                      }`}
                  >
                    {step.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Product Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <span className="text-gray-500 text-sm">Order ID</span>
                  <p className="font-semibold text-gray-800">{order.orderId || order.id}</p>
                </div>

                {firstItem?.product && (
                  <>
                    <div>
                      <span className="text-gray-500 text-sm">Brand:</span>
                      <p className="font-semibold text-gray-800">
                        {firstItem.product.manufacturer?.name || "Unknown Brand"}
                      </p>
                    </div>

                    <div>
                      <span className="text-gray-500 text-sm">Category:</span>
                      <p className="font-semibold text-gray-800">
                        {firstItem.product.category?.name || "Unknown Category"}
                      </p>
                    </div>
                  </>
                )}

                <div>
                  <span className="text-gray-500 text-sm">Quantity:</span>
                  <p className="font-semibold text-gray-800">
                    {order.items?.reduce((total: number, item: OrderItem) => total + (item.quantity || 0), 0) || 1}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-gray-500 text-sm">Date Created</span>
                  <p className="font-semibold text-gray-800">
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-500" />
                  <span className="text-green-500 font-medium">
                    Estimated delivery: {getEstimatedDelivery(order.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Card */}
          {firstItem && (
            <div className="flex flex-col md:flex-row items-start gap-6 p-6 bg-gray-50 rounded-lg">
              <div className="w-full md:w-32 h-40 bg-white rounded-lg overflow-hidden shadow-sm flex items-center justify-center">
                <img
                  src={firstItem.product?.image || firstItem.image || "/images/placeholder-product.png"}
                  alt={firstItem.product?.name || "Product"}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/placeholder-product.png";
                  }}
                />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {firstItem.product?.name || firstItem.productName || "Unknown Product"}
                </h3>
                <p className="text-gray-600 mb-3">
                  {order.items?.length || 1} item(s)
                </p>
                <p className="text-gray-600 mb-3">
                  ₦{((firstItem.price || 0) * (firstItem.quantity || 1)).toLocaleString()} × {firstItem.quantity || 1}
                </p>
                <p className="text-xl font-bold text-gray-800 mb-3">
                  Total: ₦{order.totalPrice?.toLocaleString() || "0"}
                </p>
                <Badge
                  className={`${order.status === "delivered"
                    ? "bg-green-100 text-green-800"
                    : order.status === "ongoing"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                    } hover:bg-opacity-80`}
                >
                  {order.status === "delivered"
                    ? "Delivered"
                    : order.status === "ongoing"
                      ? "In Progress"
                      : order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || "Unknown"}
                </Badge>
              </div>
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={onClose}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Define interfaces for type safety
interface Profile {
  profileImage?: string;
  fullName?: string;
  businessName?: string;
  phoneNumber?: string;
  address?: string;
}

interface User {
  email: string;
  profile?: Profile;
  businessProfile?: Profile;
}

interface Product {
  id: string;
  name: string;
  image?: string;
  category?: { name: string };
  manufacturer?: { name: string };
  options?: Array<{ image?: string[] }>;
}

interface OrderItem {
  product?: Product;
  quantity: number;
  price: number;
  status?: string;
}

interface Breakdown {
  itemsSubtotal: number;
  shippingFee: number;
  total: number;
  formatted?: {
    itemsSubtotal?: string;
    shippingFee?: string;
    total?: string;
  };
}

interface OrderData {
  id: string;
  user: User;
  items: OrderItem[];
  status: string;
  createdAt: string;
  totalPrice: number;
  paymentStatus: string;
  breakdown?: Breakdown;
  orderId?: string;
}

// Extend IOrderItem to include productId and view handler
interface ExtendedIOrderItem extends IOrderItem {
  productId?: string;
  onView?: () => void;
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

  const {
    getOrderInfoData: rawData,
    getOrderInfoIsLoading,
    getOrderInfoError,
    setOrderInfoFilter,
    refetchOrderInfo,
  } = useGetOrderInfo({
    enabled: !!orderId // ✅ Enable only when orderId exists
  });

  // Map backend status to frontend status
  const mapStatusToFrontend = useCallback((backendStatus: string): string => {
    switch (backendStatus?.toLowerCase()) {
      case 'pending':
      case 'processing':
      case 'shipped':
      case 'confirmed':
        return 'ongoing';
      case 'delivered':
      case 'completed':
        return 'delivered';
      case 'cancelled':
      case 'refunded':
        return 'cancelled';
      default:
        return 'ongoing';
    }
  }, []);

  // Type the data properly and provide defaults
  const data: OrderData | null = useMemo(() => {
    if (!rawData) return null;

    const hasFullOrderData = (obj: any): obj is OrderData => {
      return obj &&
        typeof obj.id !== 'undefined' &&
        typeof obj.status !== 'undefined' &&
        typeof obj.totalPrice !== 'undefined' &&
        typeof obj.paymentStatus !== 'undefined';
    };

    if (hasFullOrderData(rawData)) {
      return {
        id: rawData.id || '',
        user: rawData.user || { email: '' },
        items: Array.isArray(rawData.items) ? rawData.items : [],
        status: mapStatusToFrontend(rawData.status || 'ongoing'),
        createdAt: rawData.createdAt || '',
        totalPrice: rawData.totalPrice || 0,
        paymentStatus: rawData.paymentStatus || 'PENDING',
        breakdown: rawData.breakdown || undefined,
        orderId: rawData.orderId || rawData.id,
      } as OrderData;
    } else {
      return {
        id: orderId || '',
        user: rawData.user || { email: '' },
        items: Array.isArray(rawData.items) ? rawData.items : [],
        status: 'ongoing',
        createdAt: '',
        totalPrice: 0,
        paymentStatus: 'PENDING',
        breakdown: rawData.breakdown || undefined,
        orderId: orderId,
      } as OrderData;
    }
  }, [rawData, orderId, mapStatusToFrontend]);

  // Memoize the filter to prevent unnecessary re-renders
  const orderFilter = useMemo(() => ({
    orderId: orderId || ''
  }), [orderId]);

  useEffect(() => {
    console.log('🔧 OrderDetails: Setting up data fetch for orderId:', orderId);

    if (orderId && setOrderInfoFilter) {
      console.log('📡 OrderDetails: Triggering data fetch with filter:', orderFilter);
      setOrderInfoFilter(orderFilter);
    } else {
      console.warn('⚠️ OrderDetails: Missing orderId or setOrderInfoFilter:', {
        orderId,
        hasSetFilter: !!setOrderInfoFilter
      });
    }
  }, [orderId, setOrderInfoFilter, orderFilter]);


  useEffect(() => {
    console.log('📊 OrderDetails data state:', {
      orderId,
      loading: getOrderInfoIsLoading,
      hasData: !!rawData,
      error: getOrderInfoError,
      dataKeys: rawData ? Object.keys(rawData) : []
    });
  }, [orderId, getOrderInfoIsLoading, rawData, getOrderInfoError]);


  // Handle opening tracking modal
  const handleOpenTrackingModal = useCallback(() => {
    setTrackingModalOpen(true);
  }, []);

  // Memoize the transformed items to prevent re-computation
  const transformedItems = useMemo((): ExtendedIOrderItem[] => {
    if (!data?.items || !Array.isArray(data.items)) return [];

    return data.items.map((item: OrderItem, index: number) => ({
      productName: item.product?.name || "Unknown Product",
      quantity: item.quantity || 0,
      price: item.price?.toLocaleString() || "0",
      total: ((item.price || 0) * (item.quantity || 0))?.toLocaleString() || "0",
      status: mapStatusToFrontend(item.status || data.status || "ongoing"),
      image: item.product?.image || item.product?.options?.[0]?.image?.[0] || "/images/placeholder-product.png",
      productId: item.product?.id?.toString() || `item-${index}`,
      category: item.product?.category?.name || "No Category",
      brand: item.product?.manufacturer?.name || "No Brand",
      onView: handleOpenTrackingModal, // Add view handler for tracking modal
    }));
  }, [data?.items, data?.status, mapStatusToFrontend, handleOpenTrackingModal]);

  // Calculate totalPrice from items if not available
  const calculatedTotalPrice = useMemo(() => {
    if (data?.totalPrice && data.totalPrice > 0) {
      return data.totalPrice;
    }

    if (data?.items && Array.isArray(data.items)) {
      return data.items.reduce((total, item) => {
        return total + ((item.price || 0) * (item.quantity || 0));
      }, 0);
    }

    return 0;
  }, [data?.totalPrice, data?.items]);

  // Memoize status variant function
  const getStatusVariant = useCallback((status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'success';
      case 'ongoing':
        return 'warning';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  }, []);

  // Memoize event handlers
  const handleClose = useCallback(() => {
    if (setClose) {
      setClose(false);
    } else {
      router.back();
    }
  }, [setClose, router]);

  const handleEditOrder = useCallback(() => {
    if (isModal && setClose) setClose(false);
    router.push(`/admin/orders/${orderId}/edit`);
  }, [isModal, setClose, router, orderId]);

  const handleTrackOrder = useCallback(() => {
    router.push(`/admin/orders/${orderId}/track`);
  }, [router, orderId]);

  const handleRetry = useCallback(() => {
    console.log('🔄 OrderDetails: Retrying data fetch for orderId:', orderId);
    if (orderId && setOrderInfoFilter) {
      setOrderInfoFilter(orderFilter);
    }
    if (refetchOrderInfo) {
      refetchOrderInfo();
    }
  }, [orderId, setOrderInfoFilter, orderFilter, refetchOrderInfo]);

  if (getOrderInfoIsLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (getOrderInfoError || !data) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-4">
          {getOrderInfoError || "Error loading order details"}
        </p>
        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            onClick={handleClose}
          >
            {isModal ? "Close" : "Go Back"}
          </Button>
          <Button
            onClick={handleRetry}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const customer = data.user;
  const profile = customer?.profile || customer?.businessProfile;

  return (
    <div className={`${isModal ? 'max-w-2xl mx-auto' : 'max-w-6xl mx-auto p-6'}`}>
      {!isModal && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Orders
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleTrackOrder}
              className="flex items-center gap-2"
            >
              <Truck className="w-4 h-4" />
              Track Order
            </Button>
            <Button
              onClick={handleEditOrder}
              className="bg-orange-500 hover:bg-orange-600 flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Order
            </Button>
          </div>
        </div>
      )}

      {/* Customer Profile Section */}
      <div className="text-center mb-6">
        <Image
          width={100}
          height={100}
          alt="Customer avatar"
          src={profile?.profileImage || "/images/bladmin-login.jpg"}
          className="w-[100px] h-[100px] rounded-full object-cover mx-auto border-4 border-white shadow-lg"
        />
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-4">
            <h5 className="text-2xl font-bold text-[#111827]">
              {profile?.fullName || profile?.businessName || customer?.email || "Unknown Customer"}
            </h5>
            <Badge
              variant={getStatusVariant(data.status)}
              className="py-2 px-6 font-bold text-sm uppercase"
            >
              {data.status || "UNKNOWN"}
            </Badge>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <h6 className="font-semibold text-lg text-[#111827] mb-4">
            Contact Information
          </h6>

          <div className="flex gap-3 items-center">
            <MailIcon />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold text-sm text-[#111827]">
                {customer?.email || "Not provided"}
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <CallIcon />
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-semibold text-sm text-[#111827]">
                {profile?.phoneNumber || "Not provided"}
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <LocationIcon />
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-semibold text-sm text-[#111827]">
                {profile?.address || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Order Information */}
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <h6 className="font-semibold text-lg text-[#111827] mb-4">
            Order Information
          </h6>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-semibold text-sm text-[#111827]">
                #{data.orderId || data.id || 'N/A'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="font-semibold text-sm text-[#111827]">
                {data.createdAt ? formatDate(data.createdAt) : "Not available"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Order Time</p>
              <p className="font-semibold text-sm text-[#111827]">
                {data.createdAt ? formatDateTime(data.createdAt) : "Not available"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="font-semibold text-lg text-[#111827]">
                ₦{calculatedTotalPrice?.toLocaleString() || "0"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Payment Status</p>
              <Badge
                variant={data.paymentStatus === 'PAID' ? 'success' : 'warning'}
                className="mt-1"
              >
                {data.paymentStatus || "UNKNOWN"}
              </Badge>
            </div>

            <div>
              <p className="text-sm text-gray-500">Items Count</p>
              <p className="font-semibold text-sm text-[#111827]">
                {transformedItems.length} items
              </p>
            </div>
          </div>

          {/* Estimated Delivery */}
          {data.createdAt && (
            <div className="flex items-center gap-2 mt-4">
              <Calendar className="w-4 h-4 text-green-500" />
              <span className="text-green-500 font-medium">
                Estimated delivery: {
                  (() => {
                    const date = new Date(data.createdAt);
                    date.setDate(date.getDate() + 7); // Add 7 days for estimated delivery
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  })()
                }
              </span>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div>
          <h5 className="text-lg font-semibold text-[#111827] mb-4">
            Order Items ({transformedItems.length})
          </h5>

          {transformedItems.length > 0 ? (
            <div className="space-y-4">
              {transformedItems.map((item, index) => (
                <OrderItemCard key={`${item.productId}-${index}`} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No items found in this order
            </div>
          )}
        </div>

        {/* Order Summary */}
        {data.breakdown && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h6 className="font-semibold text-lg text-[#111827] mb-4">
              Order Summary
            </h6>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">
                  ₦{data.breakdown.itemsSubtotal?.toLocaleString() || "0"}
                </span>
              </div>
              {(data.breakdown.shippingFee || 0) > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-semibold">
                    ₦{data.breakdown.shippingFee?.toLocaleString() || "0"}
                  </span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>₦{calculatedTotalPrice?.toLocaleString() || "0"}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6">
          {isModal ? (
            <Button
              variant="outline"
              size="lg"
              className="px-8"
              onClick={handleClose}
            >
              Close
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleTrackOrder}
                className="flex items-center gap-2"
              >
                <Truck className="w-4 h-4" />
                Track Order
              </Button>
              <Button
                onClick={handleEditOrder}
                className="bg-orange-500 hover:bg-orange-600 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Order
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;