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

  console.log('OrderDetailsPage rendered with orderId:', orderId);

  // FIXED: Remove orderId from the hook parameters since your service doesn't accept it
  const {
    getOrderInfoData,
    getOrderInfoIsLoading,
    getOrderInfoError,
    setOrderInfoFilter,
    refetchOrderInfo,
  } = useGetOrderInfo({
    enabled: !!orderId
    // Removed orderId parameter since it's not in your service interface
  });

  // Set the order filter when component mounts or orderId changes
  useEffect(() => {
    if (orderId && setOrderInfoFilter) {
      console.log('Setting order filter for orderId:', orderId);
      setOrderInfoFilter({ orderId });
    }
  }, [orderId, setOrderInfoFilter]);

  // Redirect if no orderId
  useEffect(() => {
    if (!orderId) {
      console.error('No orderId provided, redirecting...');
      router.push('/admin/orders');
    }
  }, [orderId, router]);

  // Debug data changes
  useEffect(() => {
    console.log('Order details page data state:', {
      loading: getOrderInfoIsLoading,
      hasData: !!getOrderInfoData,
      error: getOrderInfoError,
      data: getOrderInfoData
    });
  }, [getOrderInfoData, getOrderInfoIsLoading, getOrderInfoError]);

  // Handle retry
  const handleRetry = () => {
    console.log('Retrying order info fetch...');
    if (refetchOrderInfo) {
      refetchOrderInfo();
    }
  };

  // FIXED: Handle error message properly with proper type checking
  const getErrorMessage = () => {
    if (!getOrderInfoError) return "Failed to load order details";

    // Handle different error types safely
    if (typeof getOrderInfoError === 'string') {
      return getOrderInfoError;
    }

    // Check if it's an object with message property
    if (getOrderInfoError && typeof getOrderInfoError === 'object') {
      const errorObj = getOrderInfoError as any; // Type assertion to avoid 'never' type
      if (errorObj.message) {
        return String(errorObj.message);
      }
    }

    // Fallback - convert to string
    return String(getOrderInfoError) || "Failed to load order details";
  };

  // Show loading state while fetching data
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
                <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
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
                <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
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

  // Show invalid ID state
  if (!orderId) {
    return (
      <section className="p-6">
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
                <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
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

  // Render the order details component
  return (
    <section>
      <OrderDetails
        orderId={orderId}
        isModal={false}
      />
    </section>
  );
}