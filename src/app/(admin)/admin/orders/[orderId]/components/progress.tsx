import React from "react";
import { CheckCircle, Clock, Package, Truck } from "lucide-react";

interface ProgressProps {
  value: number;
  className?: string;
  order?: {
    paymentStatus: string;
    status: string;
  };
  showLabels?: boolean;
}

const Progress: React.FC<ProgressProps> = ({ 
  value, 
  className = "", 
  order,
  showLabels = false 
}) => {
  // Calculate steps and completion for order tracking if order data is provided
  const getOrderProgressData = () => {
    if (!order) return null;
    
    const paymentCompleted = order.paymentStatus === "PAID" || order.paymentStatus === "PARTIALLY_PAID";
    const steps = paymentCompleted ? 4 : 3;
    
    const completed = 
      (paymentCompleted ? 1 : 0) + 
      (["PROCESSING", "ONGOING", "SHIPPED", "DELIVERED", "COMPLETED"].includes(order.status) ? 1 : 0) +
      (["SHIPPED", "DELIVERED", "COMPLETED"].includes(order.status) ? 1 : 0) +
      (["DELIVERED", "COMPLETED"].includes(order.status) ? 1 : 0);
    
    return {
      steps,
      completed,
      percentage: (completed / steps) * 100
    };
  };

  const progressData = getOrderProgressData();
  const progressValue = progressData ? progressData.percentage : value;

  return (
    <div className={`w-full ${className}`}>
      {/* Progress Bar */}
      <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progressValue}%` }}
          role="progressbar"
          aria-valuenow={progressValue}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* Progress Labels (if enabled) */}
      {showLabels && progressData && (
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{progressData.completed}/{progressData.steps} completed</span>
          <span>{Math.round(progressValue)}%</span>
        </div>
      )}

      {/* Order Tracking Steps (if order data provided) */}
      {order && (
        <div className="grid grid-cols-4 gap-4 mt-4">
          {/* Payment Step */}
          <div className="flex flex-col items-center text-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
              order.paymentStatus === "PAID" || order.paymentStatus === "PARTIALLY_PAID" 
                ? "bg-green-100 text-green-600" 
                : "bg-gray-100 text-gray-400"
            }`}>
              {order.paymentStatus === "PAID" || order.paymentStatus === "PARTIALLY_PAID" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <Clock className="w-5 h-5" />
              )}
            </div>
            <span className="text-xs font-medium">
              {order.paymentStatus === "PAID" || order.paymentStatus === "PARTIALLY_PAID" 
                ? "Order Confirmed" 
                : "Payment Pending"}
            </span>
          </div>

          {/* Processing Step */}
          <div className="flex flex-col items-center text-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
              ["PROCESSING", "ONGOING", "SHIPPED", "DELIVERED", "COMPLETED"].includes(order.status)
                ? (order.status === "PROCESSING" || order.status === "ONGOING" 
                    ? "bg-blue-100 text-blue-600" 
                    : "bg-green-100 text-green-600")
                : "bg-gray-100 text-gray-400"
            }`}>
              <Package className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium">Processing</span>
          </div>

          {/* Shipping Step */}
          <div className="flex flex-col items-center text-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
              ["SHIPPED", "DELIVERED", "COMPLETED"].includes(order.status)
                ? (order.status === "SHIPPED" 
                    ? "bg-blue-100 text-blue-600" 
                    : "bg-green-100 text-green-600")
                : "bg-gray-100 text-gray-400"
            }`}>
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium">Shipped</span>
          </div>

          {/* Delivery Step */}
          <div className="flex flex-col items-center text-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
              ["DELIVERED", "COMPLETED"].includes(order.status)
                ? "bg-green-100 text-green-600"
                : "bg-gray-100 text-gray-400"
            }`}>
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium">Delivered</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Progress;