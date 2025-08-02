"use client";

import { useEffect } from "react";
import OrderDetails from "./components";
import { useGetOrderInfo } from "@/services/orders";
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

  // Use the existing hook pattern
  const {
    getOrderInfoData,
    getOrderInfoIsLoading,
    getOrderInfoError,
    refetchOrderInfo,
    setOrderInfoFilter,
  } = useGetOrderInfo({
    enabled: !!orderId
  });

  // Set the filter when component mounts or orderId changes
  useEffect(() => {
    if (orderId && setOrderInfoFilter) {
      console.log('📡 Setting order filter for orderId:', orderId);
      setOrderInfoFilter({ orderId });
    }
  }, [orderId, setOrderInfoFilter]);

  // Debug data changes
  useEffect(() => {
    console.log('📊 Order details page data state:', {
      orderId,
      loading: getOrderInfoIsLoading,
      hasData: !!getOrderInfoData,
      error: getOrderInfoError,
      data: getOrderInfoData
    });
  }, [orderId, getOrderInfoData, getOrderInfoIsLoading, getOrderInfoError]);

  // Handle retry
  const handleRetry = () => {
    console.log('🔄 Retrying order info fetch for orderId:', orderId);
    if (setOrderInfoFilter) {
      setOrderInfoFilter({ orderId });
    }
    if (refetchOrderInfo) {
      refetchOrderInfo();
    }
  };

  // Handle error message
  const getErrorMessage = () => {
    if (!getOrderInfoError) return "Failed to load order details";

    if (typeof getOrderInfoError === 'string') {
      return getOrderInfoError;
    }

    if (getOrderInfoError && typeof getOrderInfoError === 'object') {
      const errorObj = getOrderInfoError as any;
      if (errorObj.message) {
        return String(errorObj.message);
      }
    }

    return String(getOrderInfoError) || "Failed to load order details";
  };

  // Redirect if no orderId
  useEffect(() => {
    if (!orderId) {
      console.error('❌ No orderId provided, redirecting...');
      router.push('/admin/orders');
    }
  }, [orderId, router]);

  // Debug: Log when this page component is mounted
  useEffect(() => {
    console.log('🔧 OrderDetailsPage mounted:', {
      orderId,
      pathname: window.location.pathname,
      href: window.location.href
    });
  }, [orderId]);

  // Show loading state
  if (getOrderInfoIsLoading) {
    return (
      <section className="p-6">
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/admin/orders')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Orders
                </Button>
                <h1 className="text-2xl font-bold text-gray-800">
                  Loading Order #{orderId}
                </h1>
              </div>
            </div>
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading order details...</p>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  // Show error state
  if (getOrderInfoError) {
    return (
      <section className="p-6">
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/admin/orders')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Orders
                </Button>
                <h1 className="text-2xl font-bold text-gray-800">
                  Order #{orderId} - Error
                </h1>
              </div>
            </div>
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Order</h3>
              <p className="text-red-500 mb-4">
                {getErrorMessage()}
              </p>
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  onClick={() => router.push('/admin/orders')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Orders
                </Button>
                <Button
                  onClick={handleRetry}
                  className="bg-orange-500 hover:bg-orange-600 flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  // Show empty data state
  if (!getOrderInfoData) {
    return (
      <section className="p-6">
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/admin/orders')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Orders
                </Button>
                <h1 className="text-2xl font-bold text-gray-800">
                  Order #{orderId}
                </h1>
              </div>
            </div>
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Order Not Found</h3>
              <p className="text-gray-500 mb-4">
                The order with ID #{orderId} could not be found.
              </p>
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  onClick={() => router.push('/admin/orders')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Orders
                </Button>
                <Button
                  onClick={handleRetry}
                  className="bg-orange-500 hover:bg-orange-600 flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  // Successfully loaded - render the order details component
  console.log('✅ Rendering OrderDetails component with data:', getOrderInfoData);

  return (
    <section>
      <OrderDetails
        orderId={orderId}
        isModal={false}
      />
    </section>
  );
}