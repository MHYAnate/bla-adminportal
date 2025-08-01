"use client";

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
import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, RefreshCw, Truck } from "lucide-react";
import { IOrderItem } from "@/types";

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
  const {
    getOrderInfoData: data,
    getOrderInfoIsLoading,
    getOrderInfoError,
    setOrderInfoFilter,
  } = useGetOrderInfo() as {
    getOrderInfoData: OrderData | null;
    getOrderInfoIsLoading: boolean;
    getOrderInfoError: any;
    setOrderInfoFilter: (orderId: string) => void;
  };

  React.useEffect(() => {
    if (orderId) {
      setOrderInfoFilter(orderId);
    }
  }, [orderId, setOrderInfoFilter]);

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
            onClick={() => setClose ? setClose(false) : router.back()}
          >
            {isModal ? "Close" : "Go Back"}
          </Button>
          <Button
            onClick={() => orderId && setOrderInfoFilter(orderId)}
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

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return 'success';
      case 'pending':
        return 'tertiary';
      case 'processing':
        return 'warning';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const transformedItems: IOrderItem[] = data.items?.map((item) => ({
    productName: item.product?.name || "Unknown Product",
    quantity: item.quantity,
    price: item.price?.toLocaleString() || "0",
    total: (item.price * item.quantity)?.toLocaleString() || "0",
    status: item.status || data.status,
    image: item.product?.image || item.product?.options?.[0]?.image?.[0],
    productId: item.product?.id?.toString(),
    category: item.product?.category?.name,
    brand: item.product?.manufacturer?.name,
  })) || [];

  const handleClose = () => {
    if (setClose) {
      setClose(false);
    } else {
      router.back();
    }
  };

  const handleEditOrder = () => {
    if (isModal && setClose) setClose(false);
    router.push(`/admin/orders/${orderId}/edit`);
  };

  const handleTrackOrder = () => {
    router.push(`/admin/orders/${orderId}/track`);
  };

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
              {profile?.fullName || profile?.businessName || customer.email}
            </h5>
            <Badge
              variant={getStatusVariant(data.status)}
              className="py-2 px-6 font-bold text-sm"
            >
              {data.status.toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <h6 className="font-semibold text-lg text-[#111827] mb-4">
            Contact Information
          </h6>

          <div className="flex gap-3 items-center">
            <MailIcon />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold text-sm text-[#111827]">
                {customer.email}
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

        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <h6 className="font-semibold text-lg text-[#111827] mb-4">
            Order Information
          </h6>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-semibold text-sm text-[#111827]">
                #{data.id}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="font-semibold text-sm text-[#111827]">
                {formatDate(data.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Order Time</p>
              <p className="font-semibold text-sm text-[#111827]">
                {formatDateTime(data.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="font-semibold text-lg text-[#111827]">
                ₦{data.totalPrice?.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Payment Status</p>
              <Badge
                variant={data.paymentStatus === 'PAID' ? 'success' : 'warning'}
                className="mt-1"
              >
                {data.paymentStatus}
              </Badge>
            </div>

            <div>
              <p className="text-sm text-gray-500">Items Count</p>
              <p className="font-semibold text-sm text-[#111827]">
                {data.items?.length || 0} items
              </p>
            </div>
          </div>
        </div>

        <div>
          <h5 className="text-lg font-semibold text-[#111827] mb-4">
            Order Items ({transformedItems.length})
          </h5>

          {transformedItems.length > 0 ? (
            <div className="space-y-4">
              {transformedItems.map((item, index) => (
                <OrderItemCard key={index} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No items found in this order
            </div>
          )}
        </div>

        {data.breakdown && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h6 className="font-semibold text-lg text-[#111827] mb-4">
              Order Summary
            </h6>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">
                  ₦{data.breakdown.itemsSubtotal?.toLocaleString()}
                </span>
              </div>
              {data.breakdown.shippingFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-semibold">
                    ₦{data.breakdown.shippingFee?.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>₦{data.totalPrice?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

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