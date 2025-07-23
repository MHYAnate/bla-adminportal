"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBagIcon } from "../../../../../../../public/icons";
import OrderDetailsCard from "@/components/widgets/order-details";
import { useGetCustomerOrderHistory } from "@/services/customers";
import { useEffect } from "react";

interface iProps {
  customerId: string;
}

const OrderHistory: React.FC<iProps> = ({ customerId }) => {
  const order = {
    name: "Mr. Rice. Foreign long rice (50kg)",
    price: "55,000",
    orderid: "#112343",
    date: "08 / 02 / 25",
    status: "Ongoing",
    id: 1,
  };

  const {
    getCustomerOrderHistoryIsLoading,
    getCustomerOrderHistoryData,
    setCustomerOrderHistoryFilter,
    getCustomerOrderHistoryError,
    refetchCustomerOrderHistoryInfo,
  } = useGetCustomerOrderHistory();

  useEffect(() => {
    setCustomerOrderHistoryFilter(customerId);
  }, [customerId]);

  console.log(customerId);

  return (
    <>
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
                23 Orders Delivered
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
                23 Ongoing Orders
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
                23 Cancelled Orders
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-6">
        {<OrderDetailsCard item={order} />}
      </div>
    </>
  );
};

export default OrderHistory;
