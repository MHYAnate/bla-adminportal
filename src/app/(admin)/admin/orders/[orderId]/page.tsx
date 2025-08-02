"use client";

// ✅ Import React first
import React from "react";
import OrderDetails from "./components";

interface OrderDetailsPageProps {
  params: {
    orderId: string;
  };
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { orderId } = params;

  console.log('🎯 OrderDetailsPage rendered with orderId:', orderId);

  // ✅ Minimal page - just render the OrderDetails component
  return (
    <div className="min-h-screen">
      <OrderDetails
        orderId={orderId}
        isModal={false}
      />
    </div>
  );
}