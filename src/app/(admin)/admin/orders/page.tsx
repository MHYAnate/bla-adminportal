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

  // Add this to your Orders component for debugging
  useEffect(() => {
    const debugClicks = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      console.log('Click detected:', {
        target: target.tagName,
        className: target.className,
        id: target.id,
        preventDefault: e.defaultPrevented,
        bubbles: e.bubbles,
        path: e.composedPath?.() || 'Not available'
      });
    };

    document.addEventListener('click', debugClicks, true);

    return () => {
      document.removeEventListener('click', debugClicks, true);
    };
  }, []);

  return (
    <OrdersErrorBoundary>
      <Suspense fallback={<OrdersLoading />}>
        <section>
          <Orders />
        </section>
      </Suspense>
    </OrdersErrorBoundary>
  );
}