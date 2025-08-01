"use client";

import { useEffect } from "react";
import OrderDetails from "./components";
import { useGetOrderInfo } from "@/services/orders";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface OrderDetailsPageProps {
  params: {
    orderId: string;
  };
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const router = useRouter();
  const { orderId } = params;

  // Initialize the hook without orderId parameter
  const {
    getOrderInfoData,
    getOrderInfoIsLoading,
    getOrderInfoError,
    setOrderInfoFilter,
  } = useGetOrderInfo({ enabled: !!orderId });

  // Set the order filter when component mounts or orderId changes
  useEffect(() => {
    if (orderId && setOrderInfoFilter) {
      setOrderInfoFilter({ orderId });
    }
  }, [orderId, setOrderInfoFilter]);

  useEffect(() => {
    // Add any page-level effects here
    if (!orderId) {
      router.push('/admin/orders');
    }
  }, [orderId, router]);

  // Show loading state at page level if needed
  if (!orderId) {
    return (
      <section className="p-6">
        <Card className="bg-white">
          <CardContent className="p-6 text-center">
            <p className="text-red-500">Invalid order ID</p>
            <Button
              variant="outline"
              onClick={() => router.push('/admin/orders')}
              className="mt-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section>
      <OrderDetails
        orderId={orderId}
        isModal={false} // Explicitly set to false for page context
      />
    </section>
  );
}