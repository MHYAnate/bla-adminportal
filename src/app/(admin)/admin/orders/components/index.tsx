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
import {
  useGetOrders,
  useGetOrdersAnalytics,
  useGetOrdersSummary,
} from "@/services/orders";
import { InputFilter } from "@/app/(admin)/components/input-filter";
import { SelectFilter } from "@/app/(admin)/components/select-filter";
import { useEffect, useState } from "react";
import DeleteContent from "@/app/(admin)/components/delete-content";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DatePickerWithRange from "@/components/ui/date-picker";

export default function Orders() {
  const {
    getOrdersData: data,
    getOrdersError,
    getOrdersIsLoading,
    setOrdersFilter,
  } = useGetOrders();

  const {
    getOrdersSummaryData,
    getOrdersSummaryIsLoading,
    refetchOrdersSummary,
    setOrdersSummaryFilter,
  } = useGetOrdersSummary();

  const {
    getOrdersAnalyticsData,
    getOrdersAnalyticsIsLoading,
    refetchOrdersAnalytics,
    setOrdersAnalyticsFilter,
  } = useGetOrdersAnalytics();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [pageSize, setPageSize] = useState<string>("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [startDateSales, setStartDateSales] = useState<string | null>(null);
  const [endDateSales, setEndDateSales] = useState<string | null>(null);
  const [filterSales, setFilterSales] = useState<string>("");
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const customerList = [
    {
      text: "Individual",
      value: "individual",
    },
    {
      text: "business",
      value: "business",
    },
  ];

  const orderlist = [
    // {
    //   value: "405,689",
    //   icon: <PaymentRefundIcon />,
    //   title: "Payment Refund",
    // },
    {
      value: getOrdersSummaryData?.data?.cancelled || 0,
      icon: <OrderCancelIcon />,
      title: "Order Cancelled",
    },
    {
      value: 293,
      icon: <OrderShippedIcon />,
      title: "Order Shipped",
    },
    {
      value: getOrdersSummaryData?.data?.processing || 0,
      icon: <OrderDeliveringIcon />,
      title: "Order Delivering",
    },
    {
      value: getOrdersSummaryData?.data?.pending || 0,
      icon: <PendingPaymentIcon />,
      title: "Pending Orders",
    },
    {
      value: getOrdersSummaryData?.data?.scheduled || 0,
      icon: <PendingReviewIcon />,
      title: "Order Scheduled",
    },
    {
      value: 48,
      icon: <DeliveredIcon />,
      title: "Delivered",
    },
    {
      value: getOrdersSummaryData?.data?.totalRevenue || 0,
      icon: <PendingPaymentIcon />,
      title: "Total Revenue",
    },
  ];

  const payload = {
    pageNumber: currentPage,
    pageSize,
    search: filter,
  };

  useEffect(() => {
    const payload = {
      period: filterSales,
      startDate: startDateSales,
      endDate: endDateSales,
    };
    setOrdersAnalyticsFilter(payload);
  }, [filterSales, startDateSales, endDateSales]);

  useEffect(() => {
    setOrdersFilter(payload);
  }, [currentPage, pageSize, filter]);

  console.log(getOrdersSummaryData);

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
            <OrderBarComponent
              data={getOrdersAnalyticsData?.data || []}
              setFilter={setFilterSales}
              setStartDate={setStartDateSales}
              setEndDate={setEndDateSales}
            />
            {/* <LineGraphComponent /> */}
          </div>
          <div className="bg-white">
            <div className="p-6">
              <h6 className="font-semibold text-lg text-[#111827] mb-6">
                Detailed Order Table
              </h6>

              <div className="flex items-center gap-4 mb-6">
                <InputFilter
                  setQuery={setFilter}
                  placeholder="Search customers"
                />
                <SelectFilter
                  setFilter={setStatus}
                  placeholder="Customer Type"
                  list={customerList}
                />
                <SelectFilter
                  setFilter={setStatus}
                  placeholder="Order Status"
                  list={customerList}
                />
                <DatePickerWithRange
                  setFromDate={setStartDate}
                  setToDate={setEndDate}
                />
              </div>
              <DataTable
                data={data?.data || []}
                currentPage={currentPage}
                onPageChange={onPageChange}
                pageSize={Number(pageSize)}
                totalPages={data?.total}
                setPageSize={setPageSize}
                handleDelete={() => {
                  setIsOpen(true);
                }}
                loading={getOrdersIsLoading}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(!open)}>
        <DialogContent
          className={`${"max-w-[33.75rem] left-[50%] translate-x-[-50%]"}`}
        >
          <DialogHeader>
            <DialogTitle className="mb-6 text-2xl font-bold text-[#111827] flex gap-4.5 items-center">
              Delete Order
            </DialogTitle>
          </DialogHeader>
          {/* <CreateCustomer setClose={() => setIsOpen(false)} /> */}
          <DeleteContent handleClose={() => setIsOpen(false)} title="Order" />
        </DialogContent>
      </Dialog>
    </section>
  );
}
