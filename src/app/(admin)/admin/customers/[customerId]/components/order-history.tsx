"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBagIcon } from "../../../../../../../public/icons";
import OrderDetailsCard from "@/components/widgets/order-details";
import { useGetCustomerOrderHistory } from "@/services/customers";
import { useEffect } from "react";
import { format } from "date-fns";

interface iProps {
  customerId: string;
}

const OrderHistory: React.FC<iProps> = ({ customerId }) => {
  const {
    getCustomerOrderHistoryIsLoading,
    getCustomerOrderHistoryData,
    getCustomerOrderHistoryError,
    setCustomerOrderHistoryFilter,
  } = useGetCustomerOrderHistory();

  console.log("🛒 OrderHistory Debug:", {
    customerId,
    data: getCustomerOrderHistoryData,
    loading: getCustomerOrderHistoryIsLoading,
    error: getCustomerOrderHistoryError
  });

  useEffect(() => {
    console.log("🛒 OrderHistory mounted with customerId:", customerId);
    if (customerId) {
      // ✅ Ensure we're passing the right type
      setCustomerOrderHistoryFilter(customerId);
    }
  }, [customerId, setCustomerOrderHistoryFilter]);

  // Show loading state
  if (getCustomerOrderHistoryIsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm">Loading order history...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (getCustomerOrderHistoryError) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center text-red-600">
          <p className="text-sm">Error loading order history</p>
          <p className="text-xs">{getCustomerOrderHistoryError}</p>
        </div>
      </div>
    );
  }

  // ✅ Access data correctly based on your API response structure
  const summary = getCustomerOrderHistoryData?.summary;
  const orders = getCustomerOrderHistoryData?.orders ?? [];

  console.log("📊 Processed order data:", { summary, orders: orders.length });

  // If no data, show empty state
  if (!getCustomerOrderHistoryData || (!summary && orders.length === 0)) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center text-gray-500">
          <p>No order history found</p>
        </div>
      </div>
    );
  }

  const deliveredCount = summary?.orderCounts?.DELIVERED || 0;
  const cancelledCount = summary?.orderCounts?.CANCELLED || 0;
  const ongoingCount =
    (summary?.orderCounts?.PENDING || 0) +
    (summary?.orderCounts?.PROCESSING || 0) +
    (summary?.orderCounts?.SCHEDULED || 0) +
    (summary?.orderCounts?.SHIPPED || 0);

  return (
    <>
      {/* Summary Cards */}
      <div className="flex gap-2 mb-6">
        <Card className="w-full bg-[#ABFFD5]">
          <CardContent className="gap-4 p-6">
            <h6 className="font-bold text-base text-[#111827] mb-5">
              Delivered
            </h6>
            <div className="flex gap-2.5 items-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#134134]">
                <ShoppingBagIcon />
              </div>
              <p className="text-[#676767] text-xs font-dmsans">
                {deliveredCount} Orders Delivered
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full bg-[#FFE2B3]">
          <CardContent className="gap-4 p-6">
            <h6 className="font-bold text-base text-[#111827] mb-5">Ongoing</h6>
            <div className="flex gap-2.5 items-center">
              <div className="w-12 h-12 rounded-full flex bg-[#FCB84B] items-center justify-center">
                <ShoppingBagIcon />
              </div>
              <p className="text-[#676767] text-xs font-dmsans">
                {ongoingCount} Ongoing Orders
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full bg-[#FFCEDA]">
          <CardContent className="gap-4 p-6">
            <h6 className="font-bold text-base text-[#111827] mb-5">
              Cancelled
            </h6>
            <div className="flex gap-2.5 items-center">
              <div className="w-12 h-12 rounded-full bg-[#FB678C] flex items-center justify-center">
                <ShoppingBagIcon />
              </div>
              <p className="text-[#676767] text-xs font-dmsans">
                {cancelledCount} Cancelled Orders
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <div className="flex flex-col gap-6">
        {orders.length > 0 ? (
          orders.map((order: any) => {
            const product = order.items?.[0];

            const item = {
              id: order.id,
              name: product?.productName || "Unnamed Product",
              price: order.totalPrice?.toLocaleString() || "0",
              orderid: order.orderReference,
              date: format(new Date(order.createdAt), "dd/MM/yy"),
              status: mapStatusToLabel(order.status),
              url: product?.image || "/images/logo.png",
              quantity: product?.quantity?.toLocaleString() || "1",
            };

            return <OrderDetailsCard key={order.id} item={item} />;
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No orders found for this customer</p>
          </div>
        )}
      </div>
    </>
  );
};

export default OrderHistory;

// Helper to convert API status to "badge category"
function mapStatusToLabel(status: string) {
  const s = status?.toUpperCase() || "";
  if (s === "DELIVERED") return "Delivered";
  if (["PENDING", "PROCESSING", "SCHEDULED", "SHIPPED"].includes(s))
    return "Ongoing";
  if (s === "CANCELLED") return "Cancelled";
  return "Unknown";
}