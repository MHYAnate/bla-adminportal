"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, RotateCcw, Loader2 } from "lucide-react";
import { useGetOrderInfo } from "@/services/orders";
import { useUpdateOrderStatus } from "@/services/orders/useOrderActions"
import { useState } from "react";
import { toast } from "sonner";
import React from "react";

// Define interfaces for type safety
interface Product {
  id: string;
  name: string;
  processingTime: number;
}

interface OrderData {
  id: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  product?: Product;
}

interface ManageOrdersProps {
  orderId: string;
}

// Wrapper for the mutation to add proper typing
interface UpdateOrderParams {
  orderId: string;
  status: string;
  notes: string;
}

const useTypedUpdateOrderStatus = () => {
  const mutation = useUpdateOrderStatus();

  return {
    ...mutation,
    mutateAsync: async (variables: UpdateOrderParams) => {
      // Cast to unknown first to avoid direct any usage
      return mutation.mutateAsync(variables as unknown as void);
    }
  };
};

const progressSteps = [
  { id: 1, name: "Order Confirming", status: "completed" },
  { id: 2, name: "Payment Pending", status: "completed" },
  { id: 3, name: "Processing", status: "current" },
  { id: 4, name: "Shipping", status: "pending" },
  { id: 5, name: "Delivered", status: "pending" },
];

// Helper function to format date and time
const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const ProgressBar = ({ currentStatus }: { currentStatus: string }) => {
  const getStepStatus = (stepName: string, orderStatus: string) => {
    const statusFlow = {
      'PENDING': 1,
      'PROCESSING': 2,
      'SHIPPED': 3,
      'DELIVERED': 4,
      'COMPLETED': 5
    };

    const currentStep = statusFlow[orderStatus as keyof typeof statusFlow] || 0;
    const stepIndex = progressSteps.findIndex(s => s.name.includes(stepName)) + 1;

    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'pending';
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium text-gray-800">Order Progress</h2>
      <div className="relative">
        <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 rounded-full"></div>
        <div className="flex justify-between relative">
          {progressSteps.map((step) => {
            const status = getStepStatus(step.name, currentStatus);
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div className="relative z-10 mb-2">
                  {status === "completed" && <div className="w-8 h-2 bg-green-500 rounded-full"></div>}
                  {status === "current" && (
                    <div className="w-8 h-2 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Loader2 className="w-3 h-3 text-white animate-spin absolute" />
                    </div>
                  )}
                  {status === "pending" && <div className="w-8 h-2 bg-gray-300 rounded-full"></div>}
                </div>
                <span className={`text-sm ${status === "completed" || status === "current" ? "text-gray-800" : "text-gray-400"}`}>
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default function ManageOrders({ orderId }: ManageOrdersProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    getOrderInfoData: data,
    getOrderInfoIsLoading,
    setOrderInfoFilter,
  } = useGetOrderInfo() as {
    getOrderInfoData: OrderData | null;
    getOrderInfoIsLoading: boolean;
    setOrderInfoFilter: (orderId: string) => void;
  };

  const updateOrderStatus = useTypedUpdateOrderStatus();

  React.useEffect(() => {
    if (orderId) {
      setOrderInfoFilter(orderId);
    }
  }, [orderId, setOrderInfoFilter]);

  const handleRefund = async () => {
    if (!data) return;
    setIsProcessing(true);
    try {
      // Add refund logic here
      toast.success("Refund processed successfully");
    } catch (error) {
      toast.error("Failed to process refund");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!data) return;

    setIsProcessing(true);
    try {
      await updateOrderStatus.mutateAsync({
        orderId: data.id,
        status: newStatus,
        notes: `Status updated to ${newStatus} by admin`
      });
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update order status");
    } finally {
      setIsProcessing(false);
    }
  };

  if (getOrderInfoIsLoading || !data) {
    return (
      <div className="w-full max-w-6xl mx-auto p-8 bg-gray-50">
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  const estimatedDelivery = new Date(data.createdAt);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + (data.product?.processingTime || 7));

  return (
    <div className="w-full max-w-6xl mx-auto p-8 bg-gray-50">
      <div className="bg-white rounded-lg p-8 shadow-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-light text-gray-600 mb-6">Manage orders</h1>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-semibold text-gray-800">Order#: {data.id}</h2>
              <Badge className={`px-3 py-1 ${data.paymentStatus === 'PAID' ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                {data.paymentStatus}
              </Badge>
              <Badge className={`px-3 py-1 ${data.status === 'COMPLETED' ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                {data.status === 'PROCESSING' ? 'In Progress' : data.status}
              </Badge>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-transparent"
                onClick={handleRefund}
                disabled={isProcessing || data.paymentStatus === 'REFUNDED'}
              >
                <RotateCcw className="w-4 h-4" />
                Refund
              </Button>
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => handleStatusUpdate('PROCESSING')}
                disabled={isProcessing}
              >
                Edit order
              </Button>
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            Order / Order Details / Order #{data.id} - {formatDateTime(data.createdAt)}
          </p>
        </div>

        <div className="mb-8">
          <ProgressBar currentStatus={data.status} />
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-5 h-5" />
            <span>Estimated delivery: {estimatedDelivery.toLocaleDateString()}</span>
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2">
            Track order
            <MapPin className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}