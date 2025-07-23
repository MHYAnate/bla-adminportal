"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Trash2, ChevronDown, ArrowLeft, Calendar } from "lucide-react";
import { useState } from "react";
import { useGetOrders } from "@/services/orders";
import {
  CalendarIcon,
  DeleteIcon,
  EditIcon,
  PersonIcon,
  RepIcon,
  ViewIcon,
} from "../../../../../../public/icons";

// ... (getStatusColor, getPaymentStatus, getStatusBadge functions remain the same)

const OrderTrackingModal = ({ order, onClose }: { 
  order: any; 
  onClose: () => void 
}) => {
  if (!order) return null;

  const getTrackingSteps = (status: string, paymentStatus: string) => {
    const steps = [
      { id: 1, name: "Order Placed", status: "completed", icon: "💰" },
      { 
        id: 2, 
        name: "Payment", 
        status: paymentStatus === "PAID" ? "completed" : 
                paymentStatus === "PARTIALLY_PAID" ? "current" : "pending", 
        icon: "💳" 
      },
      { 
        id: 3, 
        name: "Processing", 
        status: status === "PROCESSING" ? "current" : 
                status === "COMPLETED" ? "completed" : "pending", 
        icon: "📦" 
      },
      { 
        id: 4, 
        name: "Delivered", 
        status: status === "COMPLETED" ? "completed" : "pending", 
        icon: "🏠" 
      },
    ];
    return steps;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getEstimatedDelivery = (createdAt: string, processingTime: number) => {
    const date = new Date(createdAt);
    date.setDate(date.getDate() + processingTime);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const trackingSteps = getTrackingSteps(order.status, order.paymentStatus);
  
  // Calculate unit price
  const unitPrice = order.breakdown.itemsSubtotal / order.totalQuantity;
  const formattedUnitPrice = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(unitPrice);

  return (
    <div className="fixed top-0 right-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-auto">
      <div className="w-full max-w-4xl bg-white rounded-lg p-8 shadow-sm max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1"
              onClick={onClose}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-semibold text-gray-800">
              Order Tracking - {order.orderId}
            </h1>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Home</span>
            <span>›</span>
            <span>Orders</span>
            <span>›</span>
            <span className="text-gray-800">Tracking</span>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            {/* Progress line background */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 z-0"></div>

            {trackingSteps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center relative z-10">
                {/* Step icon */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-lg mb-2 border-4 border-white shadow-sm ${
                    step.status === "completed" 
                      ? "bg-green-500 text-white" 
                      : step.status === "current"
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {step.icon}
                </div>

                {/* Step label */}
                <span
                  className={`text-xs text-center max-w-16 ${
                    step.status === "completed" || step.status === "current"
                      ? "text-gray-800 font-medium"
                      : "text-gray-400"
                  }`}
                >
                  {step.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Product Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <span className="text-gray-500 text-sm">Order ID</span>
                <p className="font-semibold text-gray-800">{order.orderId}</p>
              </div>

              <div>
                <span className="text-gray-500 text-sm">Brand:</span>
                <p className="font-semibold text-gray-800">
                  {order.product.manufacturer.name}
                </p>
              </div>

              <div>
                <span className="text-gray-500 text-sm">Category:</span>
                <p className="font-semibold text-gray-800">
                  {order.product.category.name}
                </p>
              </div>

              <div>
                <span className="text-gray-500 text-sm">Quantity:</span>
                <p className="font-semibold text-gray-800">
                  {order.totalQuantity}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-gray-500 text-sm">Date Created</span>
                <p className="font-semibold text-gray-800">
                  {formatDate(order.createdAt)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-500" />
                <span className="text-green-500 font-medium">
                  Estimated delivery:{" "}
                  {getEstimatedDelivery(
                    order.createdAt,
                    order.product.processingTime
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Card */}
        <div className="flex flex-col md:flex-row items-start gap-6 p-6 bg-gray-50 rounded-lg">
          <div className="w-full md:w-32 h-40 bg-white rounded-lg overflow-hidden shadow-sm flex items-center justify-center">
            <img
              src={order.product.image || "/placeholder.svg"}
              alt={order.product.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {order.product.name}
            </h3>
            <p className="text-gray-600 mb-3">
              {order.totalQuantity} item(s)
            </p>
            <p className="text-gray-600 mb-3">
              {formattedUnitPrice} × {order.totalQuantity}
            </p>
            <p className="text-xl font-bold text-gray-800 mb-3">
              Total: {order.breakdown.formatted.items}
            </p>
            <Badge
              className={`${
                order.status === "COMPLETED"
                  ? "bg-green-100 text-green-800"
                  : order.status === "PROCESSING"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              } hover:bg-opacity-80`}
            >
              {order.status === "COMPLETED"
                ? "Delivered"
                : order.status.charAt(0) +
                  order.status.slice(1).toLowerCase()}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};


const getStatusColor = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "green";
    case "PROCESSING":
      return "yellow";
    case "PENDING":
      return "gray";
    case "CANCELLED":
      return "red";
    default:
      return "gray";
  }
};

const getPaymentStatus = (paymentStatus: string) => {
  switch (paymentStatus) {
    case "PAID":
      return "Paid";
    case "PENDING":
      return "Pending";
    case "PARTIALLY_PAID":
      return "Partially Paid";
    default:
      return paymentStatus.toLowerCase().replace("_", " ");
  }
};

const getStatusBadge = (status: string) => {
  const color = getStatusColor(status);
  const colorClasses = {
    green: "bg-green-100 text-green-800 hover:bg-green-100",
    yellow: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    gray: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    red: "bg-red-100 text-red-800 hover:bg-red-100",
  };

  return (
    <div className="flex items-center gap-2">
      <Badge
        className={
          colorClasses[color as keyof typeof colorClasses] || "bg-gray-100"
        }
      >
        {status.charAt(0) + status.slice(1).toLowerCase()}
      </Badge>
      <ChevronDown className="w-4 h-4 text-gray-400" />
    </div>
  );
};

export default function DetailedOrderTable() {
  const {
    getOrdersData: data,
    getOrdersError,
    getOrdersIsLoading,
    setOrdersFilter,
  } = useGetOrders();

  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  if (getOrdersIsLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-8 bg-gray-50">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  if (getOrdersError || !data?.success) {
    return (
      <div className="w-full max-w-7xl mx-auto p-8 bg-gray-50">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-red-500">
            Error loading orders: { "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  const orders = data?.data || [];

  return (
    <div className="w-full max-w-7xl mx-auto p-8 bg-gray-50">
      {/* Order Tracking Modal */}
      {selectedOrder && (
        <OrderTrackingModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {/* Rest of the table component */}
      <div className="bg-white rounded-lg shadow-sm">
               <div className="p-6 border-b border-gray-200">
           <h1 className="text-xl font-semibold text-gray-800">
             Detailed Order Table
           </h1>
         </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
                       <TableHeader>
               <TableRow className="bg-gray-50">
                 <TableHead className="w-12">
                   <Checkbox />
                 </TableHead>
                 <TableHead className="font-medium text-gray-600">Name</TableHead>
                 <TableHead className="font-medium text-gray-600">
                   Customer
                 </TableHead>
                 <TableHead className="font-medium text-gray-600">
                   Amount
                 </TableHead>
                 <TableHead className="font-medium text-gray-600">
                   Product Name
                 </TableHead>
                 <TableHead className="font-medium text-gray-600">
                   Order ID
                 </TableHead>
                 <TableHead className="font-medium text-gray-600">
                   Order Status
                 </TableHead>
                 <TableHead className="font-medium text-gray-600">
                   Action
                 </TableHead>
               </TableRow>
             </TableHeader>
            <TableBody>
              {orders.map((order:any) => (
                <TableRow key={order.id} className="hover:bg-gray-50">
                                    <TableCell>
                     <Checkbox />
                   </TableCell>
                   <TableCell>
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                         <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                       </div>
                       <div>
                         <p className="font-medium text-gray-800">
                           {order.customer.name}
                         </p>
                         <p className="text-sm text-gray-500">
                           {order.customer.email}
                         </p>
                       </div>
                     </div>
                   </TableCell>
                   <TableCell>
                     <span className="text-gray-700 capitalize">
                       {order.customer.type}
                     </span>
                     <p className="text-sm text-gray-500">
                       {getPaymentStatus(order.paymentStatus)}
                     </p>
                   </TableCell>
                   <TableCell>
                     <span className="font-medium text-gray-800">
                       {order.breakdown.formatted.total}
                     </span>
                   </TableCell>
                   <TableCell>
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded overflow-hidden bg-gray-200">
                         <img
                          src={order.product.image}
                          alt={order.product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/placeholder.svg";
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {order.product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.product.manufacturer.name}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-gray-800">
                      {order.orderId}
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        
                       className="bg-[#27A376] p-2.5 rounded-lg"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <ViewIcon/>
                      </div>
                      {/* <Button size="sm" variant="destructive" className="p-2">
                        <DeleteIcon/>
                      </Button> */}
                          <div
                                onClick={()=>{}}
                                className="bg-[#E03137] p-2.5 rounded-lg cursor-pointer"
                              >
                                <DeleteIcon />
                              </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}