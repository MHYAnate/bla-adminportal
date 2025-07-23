// "use client";

// import { Card, CardContent } from "@/components/ui/card";
// import { ShoppingBagIcon } from "../../../../../../../public/icons";
// import OrderDetailsCard from "@/components/widgets/order-details";
// import { useGetCustomerOrderHistory } from "@/services/customers";
// import { useEffect } from "react";

// interface iProps {
//   customerId: string;
// }

// const OrderHistory: React.FC<iProps> = ({ customerId }) => {
//   const order = {
//     name: "Mr. Rice. Foreign long rice (50kg)",
//     price: "55,000",
//     orderid: "#112343",
//     date: "08 / 02 / 25",
//     status: "Ongoing",
//     id: 1,
//   };

//   const {
//     getCustomerOrderHistoryIsLoading,
//     getCustomerOrderHistoryData,
//     setCustomerOrderHistoryFilter,
//     getCustomerOrderHistoryError,
//     refetchCustomerOrderHistoryInfo,
//   } = useGetCustomerOrderHistory();

//   console.log("orderHistory", getCustomerOrderHistoryData)

//   useEffect(() => {
//     setCustomerOrderHistoryFilter(customerId);
//   }, [customerId]);

//   console.log(customerId);

//   return (
//     <>
//       <div className="flex gap-2 mb-6">
//         <Card className="w-full bg-[#ABFFD5]">
//           <CardContent className="gap-4 p-6">
//             <h6 className="font-bold text-base text-[#111827] mb-5">
//               Delivered
//             </h6>
//             <div className="flex gap-2.5 items-center">
//               <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#134134]">
//                 <ShoppingBagIcon />
//               </div>
//               <p className="text-[#676767] text-xs font-dmsans">
//                 23 Orders Delivered
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//         <Card className="w-full bg-[#FFE2B3]">
//           <CardContent className="gap-4 p-6">
//             <h6 className="font-bold text-base text-[#111827] mb-5">Ongoing</h6>
//             <div className="flex gap-2.5 items-center">
//               <div className="w-12 h-12 rounded-full flex bg-[#FCB84B] items-center justify-center">
//                 <ShoppingBagIcon />
//               </div>
//               <p className="text-[#676767] text-xs font-dmsans">
//                 23 Ongoing Orders
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//         <Card className="w-full bg-[#FFCEDA]">
//           <CardContent className="gap-4 p-6">
//             <h6 className="font-bold text-base text-[#111827] mb-5">
//               Cancelled
//             </h6>
//             <div className="flex gap-2.5 items-center">
//               <div className="w-12 h-12 rounded-full bg-[#FB678C] flex items-center justify-center">
//                 <ShoppingBagIcon />
//               </div>
//               <p className="text-[#676767] text-xs font-dmsans">
//                 23 Cancelled Orders
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//       <div className="flex flex-col gap-6">
//         {<OrderDetailsCard item={order} />}
//       </div>
//     </>
//   );
// };

// export default OrderHistory;

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
    setCustomerOrderHistoryFilter,
  } = useGetCustomerOrderHistory();
    console.log("orderHistory", getCustomerOrderHistoryData)

  useEffect(() => {
    if (customerId) {
      setCustomerOrderHistoryFilter(customerId);
    }
  }, [customerId]);

  const summary = getCustomerOrderHistoryData?.summary;
  const orders = getCustomerOrderHistoryData?.orders ?? [];

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
        {orders.map((order:any) => {
          const product = order.items?.[0];

          const item = {
            id: order.id,
            name: product?.productName || "Unnamed Product",
            price: order.totalPrice.toLocaleString(),
            orderid: order.orderReference,
            date: format(new Date(order.createdAt), "dd/MM/yy"),
            status: mapStatusToLabel(order.status),
            url: product?.image || "/images/logo.png", // fallback handled in component
            quantity:order.items[0]?.quantity
            .toLocaleString(),
          };

          return <OrderDetailsCard key={order.id} item={item} />;
        })}
      </div>
    </>
  );
};

export default OrderHistory;

// Helper to convert API status to "badge category"
function mapStatusToLabel(status: string) {
  const s = status.toUpperCase();
  if (s === "DELIVERED") return "Delivered";
  if (["PENDING", "PROCESSING", "SCHEDULED", "SHIPPED"].includes(s))
    return "Ongoing";
  if (s === "CANCELLED") return "Cancelled";
  return "Unknown";
}

