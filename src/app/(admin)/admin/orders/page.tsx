"use client";

import { Suspense, useEffect } from "react";
import Orders from "./components";
import { Card, CardContent } from "@/components/ui/card";
import { OrdersErrorBoundary } from "@/components/error-boundary"; // Adjust path as needed

// Loading component for the orders page
const OrdersLoading = () => (
  <section className="p-6">
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>

          {/* Cards skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>

          {/* Charts skeleton */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80 bg-gray-200 rounded"></div>
              <div className="h-80 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Table skeleton */}
          <div className="bg-white">
            <div className="p-6">
              <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </section>
);

export default function OrdersPage() {
  // REMOVED: The problematic global click listener that was interfering with navigation
  // This was likely preventing sidebar navigation and other click events from working properly

  // FIXED: Only add necessary event listeners for debugging if needed
  useEffect(() => {
    // Only add debugging in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('Orders page mounted in development mode');

      // Optional: Add minimal debugging without interfering with navigation
      const handleError = (e: ErrorEvent) => {
        console.error('Orders page error:', e.error);
      };

      window.addEventListener('error', handleError);

      return () => {
        window.removeEventListener('error', handleError);
      };
    }
  }, []);

  return (
    <OrdersErrorBoundary>
      <Suspense fallback={<OrdersLoading />}>
        {/* FIXED: Removed unnecessary section wrapper that might cause layout issues */}
        <Orders />
      </Suspense>
    </OrdersErrorBoundary>
  );
}