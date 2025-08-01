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
  useGetOrderSummaryChart,
  useGetSalesData,
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
import SalesChart from "./orderSales";
import OrderSummary from "./orderSummarySide";
import DetailedOrderTable from "./orderTable";
import { toast } from "sonner";

// Type definitions
interface SalesDataItem {
  month: string;
  individual: number;
  businessOwner: number;
  total: number;
}

interface SalesDataResponse {
  data?: SalesDataItem[];
}

interface OrderSummaryData {
  orderCancel?: number;
  orderShipped?: number;
  processing?: number;
  pending?: number;
  scheduled?: number;
  delivered?: number;
  totalRevenue?: number;
}

interface OrdersSummaryResponse {
  data?: OrderSummaryData;
}

interface Order {
  id: string;
  // Add other order properties as needed
}

interface OrdersResponse {
  data?: Order[];
  total?: number;
  page?: number;
  limit?: number;
}

export default function Orders() {
  // Hooks for data fetching with proper typing
  const {
    orderSummary,
    orderSummarySummary,
    isOrderSummaryLoading,
    orderSummaryError
  } = useGetOrderSummaryChart({ timeframe: '6m' });

  const {
    getOrdersData: data,
    getOrdersError,
    getOrdersIsLoading,
    setOrdersFilter,
  } = useGetOrders() as {
    getOrdersData: OrdersResponse;
    getOrdersError: any;
    getOrdersIsLoading: boolean;
    setOrdersFilter: (filter: any) => void;
  };

  const {
    getOrdersSummaryData,
    getOrdersSummaryIsLoading,
    getOrdersSummaryError,
    refetchOrdersSummary,
    setOrdersSummaryFilter,
  } = useGetOrdersSummary() as {
    getOrdersSummaryData: OrdersSummaryResponse;
    getOrdersSummaryIsLoading: boolean;
    getOrdersSummaryError: any;
    refetchOrdersSummary: () => void;
    setOrdersSummaryFilter: (filter: any) => void;
  };

  const {
    salesData,
    isSalesLoading,
    salesError,
    setSalesFilter
  } = useGetSalesData() as {
    salesData: SalesDataResponse;
    isSalesLoading: boolean;
    salesError: any;
    setSalesFilter: (filter: any) => void;
  };

  const {
    getOrdersAnalyticsData,
    getOrdersAnalyticsIsLoading,
    getOrdersAnalyticsError,
    refetchOrdersAnalytics,
    setOrdersAnalyticsFilter,
  } = useGetOrdersAnalytics();

  // Local state
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [customerType, setCustomerType] = useState<string>("");
  const [pageSize, setPageSize] = useState<string>("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [startDateSales, setStartDateSales] = useState<string | null>(null);
  const [endDateSales, setEndDateSales] = useState<string | null>(null);
  const [filterSales, setFilterSales] = useState<string>("");

  // Filter options
  const customerList = [
    { text: "All Types", value: "" },
    { text: "Individual", value: "individual" },
    { text: "Business", value: "business" },
  ];

  const statusList = [
    { text: "All Status", value: "" },
    { text: "Pending", value: "pending" },
    { text: "Processing", value: "processing" },
    { text: "Shipped", value: "shipped" },
    { text: "Delivered", value: "delivered" },
    { text: "Cancelled", value: "cancelled" },
  ];

  // Order cards data with proper typing
  const orderlist: IOrderCard[] = [
    {
      value: getOrdersSummaryData?.data?.orderCancel || 0,
      icon: <OrderCancelIcon />,
      title: "Order Cancelled",
    },
    {
      value: getOrdersSummaryData?.data?.orderShipped || 0,
      icon: <OrderShippedIcon />,
      title: "Order Shipped",
    },
    {
      value: getOrdersSummaryData?.data?.processing || 0,
      icon: <OrderDeliveringIcon />,
      title: "Order Processing",
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
      value: getOrdersSummaryData?.data?.delivered || 0,
      icon: <DeliveredIcon />,
      title: "Delivered",
    },
    {
      value: getOrdersSummaryData?.data?.totalRevenue || 0,
      icon: <PendingPaymentIcon />,
      title: "Total Revenue",
      isRevenue: true,
    },
  ];

  // Handle page change
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle export
  const handleExport = async () => {
    try {
      const exportData = {
        orders: data?.data || [],
        filters: {
          search: filter,
          status,
          customerType,
          dateFrom: startDate,
          dateTo: endDate,
        },
        timestamp: new Date().toISOString(),
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const exportFileDefaultName = `orders-export-${new Date().toISOString().split('T')[0]}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      toast.success("Orders exported successfully");
    } catch (error) {
      console.error('Export error:', error);
      toast.error("Failed to export orders");
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      setIsDeleteOpen(false);
      toast.success("Order deleted successfully");
      refetchOrdersSummary();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error("Failed to delete order");
    }
  };

  // Apply filters effect
  useEffect(() => {
    const payload = {
      page: currentPage,
      limit: parseInt(pageSize),
      search: filter,
      status: status || undefined,
      customerType: customerType || undefined,
      dateFrom: startDate || undefined,
      dateTo: endDate || undefined,
    };
    setOrdersFilter(payload);
  }, [currentPage, pageSize, filter, status, customerType, startDate, endDate, setOrdersFilter]);

  // Apply analytics filters
  useEffect(() => {
    if (setSalesFilter) {
      const payload = {
        period: filterSales,
        startDate: startDateSales,
        endDate: endDateSales,
        year: new Date().getFullYear(),
      };
      setSalesFilter(payload);
    }
  }, [filterSales, startDateSales, endDateSales, setSalesFilter]);

  // Apply analytics filters for order analytics
  useEffect(() => {
    const payload = {
      period: filterSales,
      startDate: startDateSales,
      endDate: endDateSales,
    };
    setOrdersAnalyticsFilter(payload);
  }, [filterSales, startDateSales, endDateSales, setOrdersAnalyticsFilter]);

  // Show error messages
  useEffect(() => {
    if (getOrdersError) {
      toast.error("Failed to load orders");
    }
    if (getOrdersSummaryError) {
      toast.error("Failed to load order summary");
    }
    if (orderSummaryError) {
      toast.error("Failed to load order chart data");
    }
    if (salesError) {
      toast.error("Failed to load sales data");
    }
  }, [getOrdersError, getOrdersSummaryError, orderSummaryError, salesError]);

  return (
    <section>
      <Card className="bg-white">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <Header title="Order History" subtext="Manage orders." />
            <div className="flex gap-5">
              <Button
                variant="outline"
                className="font-bold text-base w-auto py-4 px-5 flex gap-2 items-center"
                size="xl"
                onClick={handleExport}
                disabled={getOrdersIsLoading}
              >
                <ExportIcon />
                {getOrdersIsLoading ? "Loading..." : "Download"}
              </Button>
            </div>
          </div>

          {/* Order Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {orderlist.map((report: IOrderCard, index) => (
              <OrderCard
                report={report}
                key={index}
                loading={getOrdersSummaryIsLoading}
              />
            ))}
          </div>

          {/* Charts Section */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SalesChart />
              <OrderSummary />
            </div>
          </div>

          {/* Detailed Order Table */}
          <div className="bg-white">
            <div className="p-6">
              <h6 className="font-semibold text-lg text-[#111827] mb-6">
                Detailed Order Table
              </h6>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="min-w-[200px]">
                  <InputFilter
                    setQuery={setFilter}
                    placeholder="Search orders..."
                  />
                </div>
                <div className="min-w-[150px]">
                  <SelectFilter
                    setFilter={setCustomerType}
                    placeholder="Customer Type"
                    list={customerList}
                  />
                </div>
                <div className="min-w-[150px]">
                  <SelectFilter
                    setFilter={setStatus}
                    placeholder="Order Status"
                    list={statusList}
                  />
                </div>
                <div className="min-w-[250px]">
                  <DatePickerWithRange
                    setFromDate={setStartDate}
                    setToDate={setEndDate}
                  />
                </div>
              </div>

              <DetailedOrderTable />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-[33.75rem] left-[50%] translate-x-[-50%]">
          <DialogHeader>
            <DialogTitle className="mb-6 text-2xl font-bold text-[#111827] flex gap-4.5 items-center">
              Delete Order
            </DialogTitle>
          </DialogHeader>
          <DeleteContent
            isLoading={() => false}
            handleClick={handleDelete}
            handleClose={() => setIsDeleteOpen(false)}
            title="Order"
          />
        </DialogContent>
      </Dialog>
    </section>
  );
}