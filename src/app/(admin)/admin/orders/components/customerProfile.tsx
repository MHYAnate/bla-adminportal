"use client";

import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { useGetOrderInfo } from "@/services/orders";
import { formatDate } from "@/lib/utils";
import { useMemo } from "react";

// Define the types for the customer data
interface Profile {
  profileImage?: string;
  fullName?: string;
  businessName?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
}

interface Customer {
  email: string;
  type?: string;
  isActive: boolean;
  createdAt: string;
  profile?: Profile;
  businessProfile?: Profile;
}

interface OrderInfoResponse {
  user?: Customer;
  // Add other properties if your API returns more data
}

interface CustomerProfileProps {
  orderId?: string;
  customerData?: Customer;
}

export default function CustomerProfile({ orderId, customerData }: CustomerProfileProps) {
  // Type the hook response
  const {
    getOrderInfoData: orderData,
    getOrderInfoIsLoading,
    getOrderInfoError,
  } = useGetOrderInfo() as {
    getOrderInfoData: OrderInfoResponse;
    getOrderInfoIsLoading: boolean;
    getOrderInfoError: any;
  };

  // Memoize customer and profile data
  const { customer, profile } = useMemo(() => {
    const cust = customerData || orderData?.user;
    const prof = cust?.profile || cust?.businessProfile;
    return { customer: cust, profile: prof };
  }, [customerData, orderData?.user]);

  // Memoize loading state
  const isLoading = useMemo(() => {
    return getOrderInfoIsLoading && !customerData;
  }, [getOrderInfoIsLoading, customerData]);

  // Memoize error state
  const hasError = useMemo(() => {
    return getOrderInfoError && !customerData;
  }, [getOrderInfoError, customerData]);

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto p-8 bg-gray-50">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="animate-pulse">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-gray-200 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="w-full max-w-md mx-auto p-8 bg-gray-50">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="text-center">
            <p className="text-red-500 mb-4">Failed to load customer profile</p>
            <p className="text-gray-500 text-sm">{getOrderInfoError}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="w-full max-w-md mx-auto p-8 bg-gray-50">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="text-center">
            <p className="text-gray-500">Customer data not available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-gray-50">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        {/* Profile Section */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 rounded-full overflow-hidden mb-4 bg-gray-200">
            <img
              src={profile?.profileImage || "/images/bladmin-login.jpg"}
              alt={profile?.fullName || profile?.businessName || "Customer"}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/bladmin-login.jpg";
              }}
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-1">
            {profile?.fullName || profile?.businessName || customer.email}
          </h2>
          <p className="text-gray-500 text-sm mb-3 capitalize">
            {customer.type || "Individual"}
          </p>
          <Badge
            className={`px-3 py-1 text-xs font-medium ${customer.isActive
                ? "bg-green-100 text-green-800 hover:bg-green-100"
                : "bg-red-100 text-red-800 hover:bg-red-100"
              }`}
          >
            {customer.isActive ? "ACTIVE" : "INACTIVE"}
          </Badge>
        </div>

        {/* Customer Details */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-800">Customer Details</h3>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="text-sm text-gray-500">Email</label>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-800 break-all">
                  {customer.email}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="text-sm text-gray-500">Phone</label>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-800">
                  {profile?.phoneNumber || "Not provided"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="text-sm text-gray-500">Address</label>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-800">
                  {profile?.address || "Not provided"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="text-sm text-gray-500">City</label>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-800">
                  {profile?.city || "Not provided"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="text-sm text-gray-500">Date Joined</label>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-800">
                  {customer.createdAt ? formatDate(customer.createdAt) : "Not available"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}