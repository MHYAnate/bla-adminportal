"use client";

import Header from "@/app/(admin)/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DataTable from "./data-table";
import {
  DeliveredIcon,
  ExportIcon,
  InprogressIcon,
  OrderCancelIcon,
  OrderDeliveringIcon,
  OrderShippedIcon,
  PaymentRefundIcon,
  PendingPaymentIcon,
  PendingReviewIcon,
} from "../../../../../../public/icons";
import { IOrderCard } from "@/types";
import OrderCard from "@/components/widgets/order";
import { OrderBarComponent } from "./order-bar-chart";
import LineGraphComponent from "./line-graph";

export default function Orders() {
  const orderlist = [
    {
      value: "405,689",
      icon: <PaymentRefundIcon />,
      title: "Payment Refund",
    },
    {
      value: "22",
      icon: <OrderCancelIcon />,
      title: "Order Cancelled",
    },
    {
      value: 293,
      icon: <OrderShippedIcon />,
      title: "Order Shipped",
    },
    {
      value: 48,
      icon: <OrderDeliveringIcon />,
      title: "Order Delivering",
    },
    {
      value: 48,
      icon: <PendingReviewIcon />,
      title: "Pending Review",
    },
    {
      value: 48,
      icon: <PendingPaymentIcon />,
      title: "Pending Payment",
    },
    {
      value: 48,
      icon: <DeliveredIcon />,
      title: "Delivered",
    },
    {
      value: 48,
      icon: <InprogressIcon />,
      title: "In Progress",
    },
  ];
  return (
    <section>
      <Card className="bg-white">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-8">
            <Header title="Order History" subtext="Manage orders." />
            <div className="flex gap-5">
              <Button
                variant={"outline"}
                className="font-bold text-base w-auto py-4 px-5 flex gap-2 items-center"
                size={"xl"}
              >
                <ExportIcon /> Download
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {orderlist.map((report: IOrderCard, index) => (
              <OrderCard report={report} key={index} />
            ))}
          </div>
          <div className="flex gap-5">
            <OrderBarComponent />
            <LineGraphComponent />
          </div>
          <DataTable />
        </CardContent>
      </Card>
    </section>
  );
}
