"use client";

// ✅ Import React hooks
import React, { useEffect } from "react";
import OrderDetails from "./components";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

interface OrderDetailsPageProps {
  params: {
    orderId: string;
  };
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const router = useRouter();
  const { orderId } = params;

  console.log('🎯 OrderDetailsPage rendered with orderId:', orderId);
  console.log('🔍 Params object:', params);

  // ✅ Redirect if no orderId
  useEffect(() => {
    if (!orderId) {
      console.error('❌ No orderId provided, redirecting...');
      router.push('/admin/orders');
    }
  }, [orderId, router]);

  // ✅ Debug: Log when this page component is mounted
  useEffect(() => {
    console.log('🔧 OrderDetailsPage mounted:', {
      orderId,
      pathname: typeof window !== 'undefined' ? window.location.pathname : 'SSR',
      href: typeof window !== 'undefined' ? window.location.href : 'SSR'
    });
  }, [orderId]);

  // ✅ Show invalid ID state
  if (!orderId) {
    return (
      <section className="min-h-screen p-6">
        <Card className="bg-white">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5l-6.928-12c-.77-.833-2.694-.833-3.464 0l-6.928 12c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Invalid Order ID</h3>
            <p className="text-gray-500 mb-4">The order ID provided is not valid.</p>
            <Button
              variant="outline"
              onClick={() => router.push('/admin/orders')}
              className="flex items-center gap-2 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Orders
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  // ✅ Render your existing OrderDetails component
  console.log('✅ Rendering OrderDetails component with orderId:', orderId);

  return (
    <section className="min-h-screen">
      <OrderDetails
        orderId={orderId}
        isModal={false}
      // Don't pass setClose since it's not a modal
      />
    </section>
  );
}