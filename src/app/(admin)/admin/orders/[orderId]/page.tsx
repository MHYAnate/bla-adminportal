"use client";

import React from "react";
import OrderDetails from "./components";
import { useParams } from "next/navigation";

interface OrderDetailsPageProps {
  params?: {
    orderId: string;
  };
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  // Use useParams as fallback to ensure we get the orderId
  const routeParams = useParams();
  const orderId = params?.orderId || routeParams?.orderId as string;

  console.log('🎯 OrderDetailsPage rendered with orderId:', orderId);
  console.log('📋 Params:', params);
  console.log('📋 Route params:', routeParams);

  // Don't render until we have orderId
  if (!orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading...</p>
          <p className="text-sm text-gray-500">Initializing order details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <OrderDetails
        orderId={orderId}
        isModal={false}
      />
    </div>
  );
}