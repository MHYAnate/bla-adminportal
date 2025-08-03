"use client";

import React from "react";
import OrderDetails from "./components";

interface OrderDetailsPageProps {
  params: {
    orderId: string;
  };
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { orderId } = params;

  // ✅ Add debugging and validation
  console.log('🎯 OrderDetailsPage props:', { params, orderId });

  // ✅ Ensure orderId is valid before rendering
  if (!orderId) {
    console.error('❌ No orderId found in params:', params);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Invalid Order ID</h2>
          <p className="text-gray-600">No order ID was provided in the URL.</p>
        </div>
      </div>
    );
  }

  // ✅ Clean the orderId (remove any hash symbols or leading zeros if needed)
  const cleanOrderId = String(orderId).replace('#', '').trim();

  console.log('🎯 Clean orderId for fetching:', cleanOrderId);

  return (
    <div className="min-h-screen">
      <OrderDetails
        orderId={cleanOrderId}
        isModal={false}
      />
    </div>
  );
}