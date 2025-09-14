// // // "use client";

// // // import Header from "@/app/(admin)/components/header";
// // // import { Button } from "@/components/ui/button";
// // // import { Card, CardContent } from "@/components/ui/card";
// // // import DataTable from "./data-table";
// // // import {
// // //   DeliveredIcon,
// // //   ExportIcon,
// // //   InprogressIcon,
// // //   OrderCancelIcon,
// // //   OrderShippedIcon,
// // //   PaymentRefundIcon,
// // //   PendingPaymentIcon,
// // //   PendingReviewIcon,
// // // } from "../../../../../../public/icons";
// // // import { IOrderCard } from "@/types";
// // // import OrderCard from "@/components/widgets/order";
// // // import { OrderBarComponent } from "./order-bar-chart";
// // // import LineGraphComponent from "./line-graph";
// // // import {
// // //   useGetDashboardInfo, // For real-time updates after refunds
// // //   calculateProfitMargin,
// // //   calculateRefundRate
// // // } from "@/services/dashboard";
// // // import {
// // //   useGetOrders,
// // //   useGetOrdersAnalytics,
// // //   useGetOrdersSummary,
// // //   useGetOrderSummaryChart,
// // //   useGetSalesData,
// // // } from "@/services/orders";
// // // import { InputFilter } from "@/app/(admin)/components/input-filter";
// // // import { SelectFilter } from "@/app/(admin)/components/select-filter";
// // // import { useEffect, useState, useMemo, useCallback } from "react";
// // // import DeleteContent from "@/app/(admin)/components/delete-content";
// // // import {
// // //   Dialog,
// // //   DialogContent,
// // //   DialogHeader,
// // //   DialogTitle,
// // // } from "@/components/ui/dialog";
// // // import DatePickerWithRange from "@/components/ui/date-picker";
// // // import SalesChart from "./orderSales";
// // // import OrderSummary from "./orderSummarySide";
// // // import { toast } from "sonner";
// // // import { useRouter, useSearchParams } from "next/navigation";
// // // import { ROUTES } from "@/constant/routes";

// // // // FIXED: Complete type definitions
// // // interface OrderSummaryData {
// // //   paymentRefund?: number;
// // //   orderCancel?: number;
// // //   orderShipped?: number;
// // //   inProgress?: number;
// // //   pendingReview?: number;
// // //   pendingPayment?: number;
// // //   delivered?: number;
// // //   ongoing?: number;
// // //   totalRevenue?: number;
// // //   totalOrders?: number;
// // // }

// // // interface OrdersSummaryResponse {
// // //   data?: OrderSummaryData;
// // // }

// // // interface Order {
// // //   id: string;
// // //   status: string;
// // //   // Add other order properties as needed
// // // }

// // // interface OrdersResponse {
// // //   data?: Order[];
// // //   total?: number;
// // //   page?: number;
// // //   limit?: number;
// // //   pagination?: {
// // //     totalPages?: number;
// // //     totalItems?: number;
// // //     hasNext?: boolean;
// // //     hasPrev?: boolean;
// // //   };
// // // }

// // // // FIXED: Define filter object type
// // // interface OrdersFilter {
// // //   pageNumber: number;
// // //   pageSize: number;
// // //   search?: string;
// // //   status?: string;
// // //   customerType?: string;
// // //   dateFrom?: string;
// // //   dateTo?: string;
// // // }

// // // export default function Orders() {
// // //   const router = useRouter();
// // //   const searchParams = useSearchParams();
// // //   const statusFilter = searchParams.get('status') || '';

// // //   // Hooks for data fetching with proper typing
// // //   const {
// // //     orderSummary,
// // //     orderSummarySummary,
// // //     isOrderSummaryLoading,
// // //     orderSummaryError
// // //   } = useGetOrderSummaryChart({ timeframe: '6m' });

// // //   const {
// // //     getOrdersData: data,
// // //     getOrdersError,
// // //     getOrdersIsLoading,
// // //     setOrdersFilter,
// // //     refetchOrders,
// // //     totalPages,
// // //     totalItems,
// // //   } = useGetOrders() as {
// // //     getOrdersData: OrdersResponse;
// // //     getOrdersError: any;
// // //     getOrdersIsLoading: boolean;
// // //     setOrdersFilter: (filter: any) => void;
// // //     refetchOrders: () => void;
// // //     totalPages: number;
// // //     totalItems: number;
// // //   };

// // //   const {
// // //     getOrdersSummaryData,
// // //     getOrdersSummaryIsLoading,
// // //     getOrdersSummaryError,
// // //     refetchOrdersSummary,
// // //     setOrdersSummaryFilter,
// // //   } = useGetOrdersSummary() as {
// // //     getOrdersSummaryData: OrdersSummaryResponse;
// // //     getOrdersSummaryIsLoading: boolean;
// // //     getOrdersSummaryError: any;
// // //     refetchOrdersSummary: () => void;
// // //     setOrdersSummaryFilter: (filter: any) => void;
// // //   };

// // //   const {
// // //     salesData,
// // //     isSalesLoading,
// // //     salesError,
// // //     setSalesFilter
// // //   } = useGetSalesData();

// // //   const {
// // //     getOrdersAnalyticsData,
// // //     getOrdersAnalyticsIsLoading,
// // //     getOrdersAnalyticsError,
// // //     refetchOrdersAnalytics,
// // //     setOrdersAnalyticsFilter,
// // //   } = useGetOrdersAnalytics();

// // //   // Local state
// // //   const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
// // //   const [filter, setFilter] = useState<string>("");
// // //   const [status, setStatus] = useState<string>(statusFilter);
// // //   const [customerType, setCustomerType] = useState<string>("");
// // //   const [pageSize, setPageSize] = useState<string>("10");
// // //   const [currentPage, setCurrentPage] = useState(1);
// // //   const [startDate, setStartDate] = useState<string | null>(null);
// // //   const [endDate, setEndDate] = useState<string | null>(null);
// // //   const [startDateSales, setStartDateSales] = useState<string | null>(null);
// // //   const [endDateSales, setEndDateSales] = useState<string | null>(null);
// // //   const [filterSales, setFilterSales] = useState<string>("");

// // //   // Map backend status to frontend status
// // //   const mapStatusToFrontend = useCallback((backendStatus: string): string => {
// // //     switch (backendStatus?.toLowerCase()) {
// // //       case 'pending':
// // //       case 'processing':
// // //       case 'shipped':
// // //       case 'confirmed':
// // //         return 'ongoing';
// // //       case 'delivered':
// // //       case 'completed':
// // //         return 'delivered';
// // //       case 'cancelled':
// // //       case 'refunded':
// // //         return 'cancelled';
// // //       default:
// // //         return 'ongoing';
// // //     }
// // //   }, []);

// // //   const mapStatusToBackend = useCallback((frontendStatus: string): string => {
// // //     switch (frontendStatus?.toLowerCase()) {
// // //       case 'ongoing':
// // //         return 'PENDING,PROCESSING,SHIPPED,ONGOING'; // ✅ Use ONGOING instead of CONFIRMED
// // //       case 'delivered':
// // //         return 'DELIVERED,COMPLETED'; // ✅ Both exist in your enum
// // //       case 'cancelled':
// // //         return 'CANCELLED'; // ✅ Remove REFUNDED since it's not in enum
// // //       default:
// // //         return '';
// // //     }
// // //   }, []);

// // //   // Filter options with valid values
// // //   const customerList = useMemo(() => [
// // //     { text: "All Types", value: "all" },
// // //     { text: "Individual", value: "individual" },
// // //     { text: "Business", value: "business" },
// // //   ], []);

// // //   const statusList = useMemo(() => [
// // //     { text: "All Status", value: "all" },
// // //     { text: "Ongoing", value: "ongoing" },
// // //     { text: "Delivered", value: "delivered" },
// // //     { text: "Cancelled", value: "cancelled" },
// // //   ], []);

// // //   // Order cards data - updated to match your requirements
// // //   const orderlist: IOrderCard[] = useMemo(() => [
// // //     {
// // //       value: getOrdersSummaryData?.data?.paymentRefund || 0,
// // //       icon: <PaymentRefundIcon />,
// // //       title: "Payment Refund",
// // //     },
// // //     {
// // //       value: getOrdersSummaryData?.data?.orderCancel || 0,
// // //       icon: <OrderCancelIcon />,
// // //       title: "Order Cancel",
// // //     },
// // //     {
// // //       value: getOrdersSummaryData?.data?.orderShipped || 0,
// // //       icon: <OrderShippedIcon />,
// // //       title: "Order Shipped",
// // //     },
// // //     {
// // //       value: getOrdersSummaryData?.data?.inProgress || getOrdersSummaryData?.data?.ongoing || 0,
// // //       icon: <InprogressIcon />,
// // //       title: "In Progress",
// // //     },
// // //     {
// // //       value: getOrdersSummaryData?.data?.pendingReview || 0,
// // //       icon: <PendingReviewIcon />,
// // //       title: "Pending Review",
// // //     },
// // //     {
// // //       value: getOrdersSummaryData?.data?.pendingPayment || 0,
// // //       icon: <PendingPaymentIcon />,
// // //       title: "Pending Payment",
// // //     },
// // //     {
// // //       value: getOrdersSummaryData?.data?.delivered || 0,
// // //       icon: <DeliveredIcon />,
// // //       title: "Delivered",
// // //     },
// // //     {
// // //       value: getOrdersSummaryData?.data?.totalRevenue || 0,
// // //       icon: <PendingPaymentIcon />,
// // //       title: "Total Revenue",
// // //       isRevenue: true,
// // //     },
// // //   ], [getOrdersSummaryData?.data]);

// // //   // FIXED: Create properly typed filter object for the API
// // //   const ordersFilter = useMemo((): OrdersFilter => {
// // //     const filterObj: OrdersFilter = {
// // //       pageNumber: currentPage,
// // //       pageSize: parseInt(pageSize),
// // //     };

// // //     // Add other filters only if they have values
// // //     if (filter && filter.trim()) {
// // //       filterObj.search = filter.trim();
// // //     }

// // //     if (status && status !== "all") {
// // //       filterObj.status = mapStatusToBackend(status);
// // //       console.log('Setting status filter:', status, '→', filterObj.status);
// // //     }

// // //     if (customerType && customerType !== "all") {
// // //       filterObj.customerType = customerType;
// // //     }

// // //     if (startDate) {
// // //       filterObj.dateFrom = startDate;
// // //     }

// // //     if (endDate) {
// // //       filterObj.dateTo = endDate;
// // //     }

// // //     console.log('Complete orders filter:', filterObj);
// // //     return filterObj;
// // //   }, [currentPage, pageSize, filter, status, customerType, startDate, endDate, mapStatusToBackend]);

// // //   const analyticsFilter = useMemo(() => ({
// // //     period: filterSales,
// // //     startDate: startDateSales,
// // //     endDate: endDateSales,
// // //   }), [filterSales, startDateSales, endDateSales]);

// // //   const salesFilter = useMemo(() => ({
// // //     period: filterSales,
// // //     startDate: startDateSales,
// // //     endDate: endDateSales,
// // //     year: new Date().getFullYear(),
// // //   }), [filterSales, startDateSales, endDateSales]);



// // //   // Handle page change
// // //   const onPageChange = useCallback((page: number) => {
// // //     setCurrentPage(page);

// // //     const params = new URLSearchParams();
// // //     params.set('page', currentPage.toString());
// // //      // Update URL without page reload
// // //         router.push(`${ROUTES.ADMIN.SIDEBAR.ORDERS}?${params.toString()}`, { scroll: false });

// // //   }, []);

// // //   // Filter change handlers
// // //   const handleCustomerTypeChange = useCallback((value: string) => {
// // //     setCustomerType(value);
// // //   }, []);

// // //   const handleStatusChange = useCallback((value: string) => {
// // //     setStatus(value);
// // //     // Update URL to reflect status filter
// // //     const params = new URLSearchParams(searchParams.toString());
// // //     if (value === "all") {
// // //       params.delete('status');
// // //     } else {
// // //       params.set('status', value);
// // //     }
// // //     router.push(`/admin/orders?${params.toString()}`);
// // //   }, [router, searchParams]);

// // //   // ADDED: Refresh handler for DataTable
// // //   const handleRefreshOrders = useCallback(() => {
// // //     console.log('Refreshing orders data...');
// // //     if (refetchOrders) {
// // //       refetchOrders();
// // //     }
// // //     // Also refresh summary data
// // //     if (refetchOrdersSummary) {
// // //       refetchOrdersSummary();
// // //     }
// // //   }, [refetchOrders, refetchOrdersSummary]);

// // //   // Handle export
// // //   const handleExport = useCallback(async () => {
// // //     try {
// // //       const exportData = {
// // //         orders: data?.data || [],
// // //         filters: {
// // //           search: filter,
// // //           status: status === "all" ? "" : status,
// // //           customerType: customerType === "all" ? "" : customerType,
// // //           dateFrom: startDate,
// // //           dateTo: endDate,
// // //         },
// // //         timestamp: new Date().toISOString(),
// // //       };

// // //       const dataStr = JSON.stringify(exportData, null, 2);
// // //       const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
// // //       const exportFileDefaultName = `orders-export-${new Date().toISOString().split('T')[0]}.json`;

// // //       const linkElement = document.createElement('a');
// // //       linkElement.setAttribute('href', dataUri);
// // //       linkElement.setAttribute('download', exportFileDefaultName);
// // //       linkElement.click();

// // //       toast.success("Orders exported successfully");
// // //     } catch (error) {
// // //       console.error('Export error:', error);
// // //       toast.error("Failed to export orders");
// // //     }
// // //   }, [data?.data, filter, status, customerType, startDate, endDate]);

// // //   // Handle delete
// // //   const handleDelete = useCallback(async () => {
// // //     try {
// // //       setIsDeleteOpen(false);
// // //       toast.success("Order deleted successfully");
// // //       handleRefreshOrders();
// // //     } catch (error) {
// // //       console.error('Delete error:', error);
// // //       toast.error("Failed to delete order");
// // //     }
// // //   }, [handleRefreshOrders]);

// // //   // Apply filters effect
// // //   useEffect(() => {
// // //     console.log('Applying filter to orders:', ordersFilter);
// // //     if (setOrdersFilter) {
// // //       setOrdersFilter(ordersFilter);
// // //     }
// // //   }, [ordersFilter, setOrdersFilter]);

// // //   // Apply analytics filters
// // //   useEffect(() => {
// // //     if (setSalesFilter) {
// // //       setSalesFilter(salesFilter);
// // //     }
// // //   }, [salesFilter, setSalesFilter]);

// // //   useEffect(() => {
// // //     if (setOrdersAnalyticsFilter) {
// // //       setOrdersAnalyticsFilter(analyticsFilter);
// // //     }
// // //   }, [analyticsFilter, setOrdersAnalyticsFilter]);

// // //   // Set status from URL params
// // //   useEffect(() => {
// // //     if (statusFilter && statusFilter !== status) {
// // //       setStatus(statusFilter);
// // //     }
// // //   }, [statusFilter]);

// // //   useEffect(() => {
// // //     if (data) {
// // //       console.log('Orders data received:', {
// // //         total: data?.total,
// // //         count: data?.data?.length,
// // //         firstItem: data?.data?.[0],
// // //         // FIXED: Safe access to pagination
// // //         pagination: data?.pagination || 'No pagination data'
// // //       });
// // //     }
// // //   }, [data]);

// // //   useEffect(() => {
// // //     if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
// // //       const uniqueStatuses = [...new Set(data.data.map(order => order?.status).filter(Boolean))];
// // //       console.log('🔍 Actual backend status values:', uniqueStatuses);

// // //       // Test each status mapping
// // //       uniqueStatuses.forEach(status => {
// // //         console.log(`Status "${status}" maps to frontend: "${mapStatusToFrontend(status)}"`);
// // //       });
// // //     }
// // //   }, [data, mapStatusToFrontend]);

// // //   useEffect(() => {
// // //     console.log('Orders component mounted');

// // //     // Check if any global event listeners are blocking navigation
// // //     const handleClick = (e: Event) => {
// // //       console.log('Global click detected:', e.target);
// // //     };

// // //     document.addEventListener('click', handleClick);

// // //     return () => {
// // //       document.removeEventListener('click', handleClick);
// // //     };
// // //   }, []);

// // //   useEffect(() => {
// // //     console.log('Status filter changed:', {
// // //       status,
// // //       mappedStatus: status !== "all" ? mapStatusToBackend(status) : 'none'
// // //     });
// // //   }, [status, mapStatusToBackend]);

// // //   // Show error messages
// // //   useEffect(() => {
// // //     if (getOrdersError) {
// // //       console.error('Orders error:', getOrdersError);
// // //       toast.error("Failed to load orders");
// // //     }
// // //   }, [getOrdersError]);

// // //   useEffect(() => {
// // //     const handleAllClicks = (e: MouseEvent) => {
// // //       const target = e.target as HTMLElement;
// // //       if (target.closest('[data-sidebar]')) {
// // //         console.log('🎯 Sidebar click detected:', {
// // //           tag: target.tagName,
// // //           classes: target.className,
// // //           text: target.textContent?.trim(),
// // //           dataset: target.dataset
// // //         });
// // //       }
// // //     };

// // //     document.addEventListener('click', handleAllClicks, true);
// // //     return () => document.removeEventListener('click', handleAllClicks, true);
// // //   }, []);

// // //   useEffect(() => {
// // //     if (getOrdersSummaryError) {
// // //       console.error('Orders summary error:', getOrdersSummaryError);
// // //       toast.error("Failed to load order summary");
// // //     }
// // //   }, [getOrdersSummaryError]);

// // //   useEffect(() => {
// // //     if (orderSummaryError) {
// // //       console.error('Order summary chart error:', orderSummaryError);
// // //       toast.error("Failed to load order chart data");
// // //     }
// // //   }, [orderSummaryError]);

// // //   useEffect(() => {
// // //     if (salesError) {
// // //       console.error('Sales error:', salesError);
// // //       toast.error("Failed to load sales data");
// // //     }
// // //   }, [salesError]);

// // //   return (
// // //     <section>
// // //       <Card className="bg-white">
// // //         <CardContent className="p-4">
// // //           {/* Header */}
// // //           <div className="flex justify-between items-center mb-8">
// // //             <Header title="Order History" subtext="Manage orders." />
// // //             <div className="flex gap-5">
// // //               <Button
// // //                 variant="outline"
// // //                 className="font-bold text-base w-auto py-4 px-5 flex gap-2 items-center"
// // //                 size="xl"
// // //                 onClick={handleExport}
// // //                 disabled={getOrdersIsLoading}
// // //               >
// // //                 <ExportIcon />
// // //                 {getOrdersIsLoading ? "Loading..." : "Download"}
// // //               </Button>
// // //             </div>
// // //           </div>

// // //           {/* Order Cards */}
// // //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
// // //             {orderlist.map((report: IOrderCard, index) => (
// // //               <OrderCard
// // //                 report={report}
// // //                 key={`order-card-${index}`}
// // //                 loading={getOrdersSummaryIsLoading}
// // //               />
// // //             ))}
// // //           </div>

// // //           {/* Charts Section */}
// // //           <div className="bg-gray-50 rounded-lg p-6 mb-8">
// // //             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// // //               <SalesChart />
// // //               <OrderSummary />
// // //             </div>
// // //           </div>

// // //           {/* Detailed Order Table */}
// // //           <div className="bg-white">
// // //             <div className="p-6">
// // //               <h6 className="font-semibold text-lg text-[#111827] mb-6">
// // //                 Detailed Order Table
// // //               </h6>

// // //               {/* Filters */}
// // //               <div className="flex flex-wrap items-center gap-4 mb-6">
// // //                 <div className="min-w-[200px]">
// // //                   <InputFilter
// // //                     setQuery={setFilter}
// // //                     placeholder="Search orders..."
// // //                   />
// // //                 </div>
// // //                 <div className="min-w-[150px]">
// // //                   <SelectFilter
// // //                     setFilter={handleCustomerTypeChange}
// // //                     placeholder="Customer Type"
// // //                     list={customerList}
// // //                   />
// // //                 </div>
// // //                 <div className="min-w-[150px]">
// // //                   <SelectFilter
// // //                     setFilter={handleStatusChange}
// // //                     placeholder="Order Status"
// // //                     list={statusList}
// // //                     value={status}
// // //                   />
// // //                 </div>
// // //                 <div className="min-w-[250px]">
// // //                   <DatePickerWithRange
// // //                     setFromDate={setStartDate}
// // //                     setToDate={setEndDate}
// // //                   />
// // //                 </div>
// // //               </div>

// // //               <DataTable
// // //                 data={data?.data || []}
// // //                 currentPage={currentPage}
// // //                 onPageChange={onPageChange}
// // //                 pageSize={parseInt(pageSize)}
// // //                 totalPages={totalPages || Math.ceil((data?.total || 0) / parseInt(pageSize))}
// // //                 setPageSize={setPageSize}
// // //                 loading={getOrdersIsLoading}
// // //                 mapStatusToFrontend={mapStatusToFrontend}
// // //                 onRefreshData={handleRefreshOrders}
// // //               />
// // //             </div>
// // //           </div>
// // //         </CardContent>
// // //       </Card>

// // //       {/* Delete Dialog */}
// // //       <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
// // //         <DialogContent className="max-w-[33.75rem] left-[50%] translate-x-[-50%]">
// // //           <DialogHeader>
// // //             <DialogTitle className="mb-6 text-2xl font-bold text-[#111827] flex gap-4.5 items-center">
// // //               Delete Order
// // //             </DialogTitle>
// // //           </DialogHeader>
// // //           <DeleteContent
// // //             isLoading={() => false}
// // //             handleClick={handleDelete}
// // //             handleClose={() => setIsDeleteOpen(false)}
// // //             title="Order"
// // //           />
// // //         </DialogContent>
// // //       </Dialog>
// // //     </section>
// // //   );
// // // }

// // "use client";

// // import Header from "@/app/(admin)/components/header";
// // import { Button } from "@/components/ui/button";
// // import { Card, CardContent } from "@/components/ui/card";
// // import DataTable from "./data-table";
// // import {
// //   DeliveredIcon,
// //   ExportIcon,
// //   InprogressIcon,
// //   OrderCancelIcon,
// //   OrderShippedIcon,
// //   PaymentRefundIcon,
// //   PendingPaymentIcon,
// //   PendingReviewIcon,
// // } from "../../../../../../public/icons";
// // import { IOrderCard } from "@/types";
// // import OrderCard from "@/components/widgets/order";
// // import { OrderBarComponent } from "./order-bar-chart";
// // import LineGraphComponent from "./line-graph";
// // import {
// //   useGetDashboardInfo, // For real-time updates after refunds
// //   calculateProfitMargin,
// //   calculateRefundRate
// // } from "@/services/dashboard";
// // import {
// //   useGetOrders,
// //   useGetOrdersAnalytics,
// //   useGetOrdersSummary,
// //   useGetOrderSummaryChart,
// //   useGetSalesData,
// // } from "@/services/orders";
// // import { InputFilter } from "@/app/(admin)/components/input-filter";
// // import { SelectFilter } from "@/app/(admin)/components/select-filter";
// // import { useEffect, useState, useMemo, useCallback } from "react";
// // import DeleteContent from "@/app/(admin)/components/delete-content";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogHeader,
// //   DialogTitle,
// // } from "@/components/ui/dialog";
// // import DatePickerWithRange from "@/components/ui/date-picker";
// // import SalesChart from "./orderSales";
// // import OrderSummary from "./orderSummarySide";
// // import { toast } from "sonner";
// // import { useRouter, useSearchParams } from "next/navigation";
// // import { ROUTES } from "@/constant/routes";

// // // FIXED: Complete type definitions
// // interface OrderSummaryData {
// //   paymentRefund?: number;
// //   orderCancel?: number;
// //   orderShipped?: number;
// //   inProgress?: number;
// //   pendingReview?: number;
// //   pendingPayment?: number;
// //   delivered?: number;
// //   ongoing?: number;
// //   totalRevenue?: number;
// //   totalOrders?: number;
// // }

// // interface OrdersSummaryResponse {
// //   data?: OrderSummaryData;
// // }

// // interface Order {
// //   id: string;
// //   status: string;
// //   // Add other order properties as needed
// // }

// // interface OrdersResponse {
// //   data?: Order[];
// //   total?: number;
// //   page?: number;
// //   limit?: number;
// //   pagination?: {
// //     totalPages?: number;
// //     totalItems?: number;
// //     hasNext?: boolean;
// //     hasPrev?: boolean;
// //   };
// // }

// // // FIXED: Define filter object type
// // interface OrdersFilter {
// //   pageNumber: number;
// //   pageSize: number;
// //   search?: string;
// //   status?: string;
// //   customerType?: string;
// //   dateFrom?: string;
// //   dateTo?: string;
// // }

// // export default function Orders() {
// //   const router = useRouter();
// //   const searchParams = useSearchParams();
// //   const statusFilter = searchParams.get('status') || '';
  
// //   // FIXED: Initialize currentPage from URL params
// //   const pageParam = searchParams.get('page');
// //   const initialPage = pageParam ? parseInt(pageParam, 10) : 1;

// //   // Hooks for data fetching with proper typing
// //   const {
// //     orderSummary,
// //     orderSummarySummary,
// //     isOrderSummaryLoading,
// //     orderSummaryError
// //   } = useGetOrderSummaryChart({ timeframe: '6m' });

// //   const {
// //     getOrdersData: data,
// //     getOrdersError,
// //     getOrdersIsLoading,
// //     setOrdersFilter,
// //     refetchOrders,
// //     totalPages,
// //     totalItems,
// //   } = useGetOrders() as {
// //     getOrdersData: OrdersResponse;
// //     getOrdersError: any;
// //     getOrdersIsLoading: boolean;
// //     setOrdersFilter: (filter: any) => void;
// //     refetchOrders: () => void;
// //     totalPages: number;
// //     totalItems: number;
// //   };

// //   const {
// //     getOrdersSummaryData,
// //     getOrdersSummaryIsLoading,
// //     getOrdersSummaryError,
// //     refetchOrdersSummary,
// //     setOrdersSummaryFilter,
// //   } = useGetOrdersSummary() as {
// //     getOrdersSummaryData: OrdersSummaryResponse;
// //     getOrdersSummaryIsLoading: boolean;
// //     getOrdersSummaryError: any;
// //     refetchOrdersSummary: () => void;
// //     setOrdersSummaryFilter: (filter: any) => void;
// //   };

// //   const {
// //     salesData,
// //     isSalesLoading,
// //     salesError,
// //     setSalesFilter
// //   } = useGetSalesData();

// //   const {
// //     getOrdersAnalyticsData,
// //     getOrdersAnalyticsIsLoading,
// //     getOrdersAnalyticsError,
// //     refetchOrdersAnalytics,
// //     setOrdersAnalyticsFilter,
// //   } = useGetOrdersAnalytics();

// //   // FIXED: Initialize currentPage with value from URL
// //   const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
// //   const [filter, setFilter] = useState<string>("");
// //   const [status, setStatus] = useState<string>(statusFilter);
// //   const [customerType, setCustomerType] = useState<string>("");
// //   const [pageSize, setPageSize] = useState<string>("10");
// //   const [currentPage, setCurrentPage] = useState(initialPage); // FIXED: Initialize from URL
// //   const [startDate, setStartDate] = useState<string | null>(null);
// //   const [endDate, setEndDate] = useState<string | null>(null);
// //   const [startDateSales, setStartDateSales] = useState<string | null>(null);
// //   const [endDateSales, setEndDateSales] = useState<string | null>(null);
// //   const [filterSales, setFilterSales] = useState<string>("");

// //   // Map backend status to frontend status
// //   const mapStatusToFrontend = useCallback((backendStatus: string): string => {
// //     switch (backendStatus?.toLowerCase()) {
// //       case 'pending':
// //       case 'processing':
// //       case 'shipped':
// //       case 'confirmed':
// //         return 'ongoing';
// //       case 'delivered':
// //       case 'completed':
// //         return 'delivered';
// //       case 'cancelled':
// //       case 'refunded':
// //         return 'cancelled';
// //       default:
// //         return 'ongoing';
// //     }
// //   }, []);

// //   const mapStatusToBackend = useCallback((frontendStatus: string): string => {
// //     switch (frontendStatus?.toLowerCase()) {
// //       case 'ongoing':
// //         return 'PENDING,PROCESSING,SHIPPED,ONGOING'; // ✅ Use ONGOING instead of CONFIRMED
// //       case 'delivered':
// //         return 'DELIVERED,COMPLETED'; // ✅ Both exist in your enum
// //       case 'cancelled':
// //         return 'CANCELLED'; // ✅ Remove REFUNDED since it's not in enum
// //       default:
// //         return '';
// //     }
// //   }, []);

// //   // Filter options with valid values
// //   const customerList = useMemo(() => [
// //     { text: "All Types", value: "all" },
// //     { text: "Individual", value: "individual" },
// //     { text: "Business", value: "business" },
// //   ], []);

// //   const statusList = useMemo(() => [
// //     { text: "All Status", value: "all" },
// //     { text: "Ongoing", value: "ongoing" },
// //     { text: "Delivered", value: "delivered" },
// //     { text: "Cancelled", value: "cancelled" },
// //   ], []);

// //   // Order cards data - updated to match your requirements
// //   const orderlist: IOrderCard[] = useMemo(() => [
// //     {
// //       value: getOrdersSummaryData?.data?.paymentRefund || 0,
// //       icon: <PaymentRefundIcon />,
// //       title: "Payment Refund",
// //     },
// //     {
// //       value: getOrdersSummaryData?.data?.orderCancel || 0,
// //       icon: <OrderCancelIcon />,
// //       title: "Cancelled Orders",
// //     },
// //     {
// //       value: getOrdersSummaryData?.data?.orderShipped || 0,
// //       icon: <OrderShippedIcon />,
// //       title: "Shipped Orders",
// //     },
// //     {
// //       value: getOrdersSummaryData?.data?.inProgress || getOrdersSummaryData?.data?.ongoing || 0,
// //       icon: <InprogressIcon />,
// //       title: "In Progress",
// //     },
// //     {
// //       value: getOrdersSummaryData?.data?.pendingReview || 0,
// //       icon: <PendingReviewIcon />,
// //       title: "Pending Review",
// //     },
// //     {
// //       value: getOrdersSummaryData?.data?.pendingPayment || 0,
// //       icon: <PendingPaymentIcon />,
// //       title: "Pending Payments",
// //     },
// //     {
// //       value: getOrdersSummaryData?.data?.delivered || 0,
// //       icon: <DeliveredIcon />,
// //       title: "Delivered",
// //     },
// //     {
// //       value: getOrdersSummaryData?.data?.totalRevenue || 0,
// //       icon: <PendingPaymentIcon />,
// //       title: "Total Revenue",
// //       isRevenue: true,
// //     },
// //   ], [getOrdersSummaryData?.data]);

// //   // FIXED: Create properly typed filter object for the API
// //   const ordersFilter = useMemo((): OrdersFilter => {
// //     const filterObj: OrdersFilter = {
// //       pageNumber: currentPage,
// //       pageSize: parseInt(pageSize),
// //     };

// //     // Add other filters only if they have values
// //     if (filter && filter.trim()) {
// //       filterObj.search = filter.trim();
// //     }

// //     if (status && status !== "all") {
// //       filterObj.status = mapStatusToBackend(status);
// //       console.log('Setting status filter:', status, '→', filterObj.status);
// //     }

// //     if (customerType && customerType !== "all") {
// //       filterObj.customerType = customerType;
// //     }

// //     if (startDate) {
// //       filterObj.dateFrom = startDate;
// //     }

// //     if (endDate) {
// //       filterObj.dateTo = endDate;
// //     }

// //     console.log('Complete orders filter:', filterObj);
// //     return filterObj;
// //   }, [currentPage, pageSize, filter, status, customerType, startDate, endDate, mapStatusToBackend]);

// //   const analyticsFilter = useMemo(() => ({
// //     period: filterSales,
// //     startDate: startDateSales,
// //     endDate: endDateSales,
// //   }), [filterSales, startDateSales, endDateSales]);

// //   const salesFilter = useMemo(() => ({
// //     period: filterSales,
// //     startDate: startDateSales,
// //     endDate: endDateSales,
// //     year: new Date().getFullYear(),
// //   }), [filterSales, startDateSales, endDateSales]);

// //   // FIXED: Handle page change with correct parameter usage
// //   const onPageChange = useCallback((page: number) => {
// //     setCurrentPage(page);

// //     const params = new URLSearchParams();
// //     params.set('page', page.toString()); // FIXED: Use 'page' parameter instead of 'currentPage'
    
// //     // Preserve other search params
// //     if (status && status !== "all") {
// //       params.set('status', status);
// //     }
    
// //     // Update URL without page reload
// //     router.push(`${ROUTES.ADMIN.SIDEBAR.ORDERS}?${params.toString()}`, { scroll: false });
// //   }, [router, status]);

// //   // Filter change handlers
// //   const handleCustomerTypeChange = useCallback((value: string) => {
// //     setCustomerType(value);
// //     // Reset to first page when filters change
// //     setCurrentPage(1);
// //     const params = new URLSearchParams(searchParams.toString());
// //     params.set('page', '1');
// //     if (value === "all") {
// //       params.delete('customerType');
// //     } else {
// //       params.set('customerType', value);
// //     }
// //     router.push(`/admin/orders?${params.toString()}`);
// //   }, [router, searchParams]);

// //   const handleStatusChange = useCallback((value: string) => {
// //     setStatus(value);
// //     // Reset to first page when filters change
// //     setCurrentPage(1);
// //     // Update URL to reflect status filter
// //     const params = new URLSearchParams(searchParams.toString());
// //     params.set('page', '1'); // Reset to page 1 when changing filters
// //     if (value === "all") {
// //       params.delete('status');
// //     } else {
// //       params.set('status', value);
// //     }
// //     router.push(`/admin/orders?${params.toString()}`);
// //   }, [router, searchParams]);

// //   // ADDED: Refresh handler for DataTable
// //   const handleRefreshOrders = useCallback(() => {
// //     console.log('Refreshing orders data...');
// //     if (refetchOrders) {
// //       refetchOrders();
// //     }
// //     // Also refresh summary data
// //     if (refetchOrdersSummary) {
// //       refetchOrdersSummary();
// //     }
// //   }, [refetchOrders, refetchOrdersSummary]);

// //   // Handle export
// //   const handleExport = useCallback(async () => {
// //     try {
// //       const exportData = {
// //         orders: data?.data || [],
// //         filters: {
// //           search: filter,
// //           status: status === "all" ? "" : status,
// //           customerType: customerType === "all" ? "" : customerType,
// //           dateFrom: startDate,
// //           dateTo: endDate,
// //         },
// //         timestamp: new Date().toISOString(),
// //       };

// //       const dataStr = JSON.stringify(exportData, null, 2);
// //       const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
// //       const exportFileDefaultName = `orders-export-${new Date().toISOString().split('T')[0]}.json`;

// //       const linkElement = document.createElement('a');
// //       linkElement.setAttribute('href', dataUri);
// //       linkElement.setAttribute('download', exportFileDefaultName);
// //       linkElement.click();

// //       toast.success("Orders exported successfully");
// //     } catch (error) {
// //       console.error('Export error:', error);
// //       toast.error("Failed to export orders");
// //     }
// //   }, [data?.data, filter, status, customerType, startDate, endDate]);

// //   // Handle delete
// //   const handleDelete = useCallback(async () => {
// //     try {
// //       setIsDeleteOpen(false);
// //       toast.success("Order deleted successfully");
// //       handleRefreshOrders();
// //     } catch (error) {
// //       console.error('Delete error:', error);
// //       toast.error("Failed to delete order");
// //     }
// //   }, [handleRefreshOrders]);

// //   // Apply filters effect
// //   useEffect(() => {
// //     console.log('Applying filter to orders:', ordersFilter);
// //     if (setOrdersFilter) {
// //       setOrdersFilter(ordersFilter);
// //     }
// //   }, [ordersFilter, setOrdersFilter]);

// //   // Apply analytics filters
// //   useEffect(() => {
// //     if (setSalesFilter) {
// //       setSalesFilter(salesFilter);
// //     }
// //   }, [salesFilter, setSalesFilter]);

// //   useEffect(() => {
// //     if (setOrdersAnalyticsFilter) {
// //       setOrdersAnalyticsFilter(analyticsFilter);
// //     }
// //   }, [analyticsFilter, setOrdersAnalyticsFilter]);

// //   // FIXED: Update currentPage when URL param changes
// //   useEffect(() => {
// //     const pageParam = searchParams.get('page');
// //     if (pageParam) {
// //       const pageNumber = parseInt(pageParam, 10);
// //       if (!isNaN(pageNumber) && pageNumber !== currentPage) {
// //         setCurrentPage(pageNumber);
// //       }
// //     }
// //   }, [searchParams, currentPage]);

// //   // Set status from URL params
// //   useEffect(() => {
// //     if (statusFilter && statusFilter !== status) {
// //       setStatus(statusFilter);
// //     }
// //   }, [statusFilter]);

// //   useEffect(() => {
// //     if (data) {
// //       console.log('Orders data received:', {
// //         total: data?.total,
// //         count: data?.data?.length,
// //         firstItem: data?.data?.[0],
// //         // FIXED: Safe access to pagination
// //         pagination: data?.pagination || 'No pagination data'
// //       });
// //     }
// //   }, [data]);

// //   useEffect(() => {
// //     if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
// //       const uniqueStatuses = [...new Set(data.data.map(order => order?.status).filter(Boolean))];
// //       console.log('🔍 Actual backend status values:', uniqueStatuses);

// //       // Test each status mapping
// //       uniqueStatuses.forEach(status => {
// //         console.log(`Status "${status}" maps to frontend: "${mapStatusToFrontend(status)}"`);
// //       });
// //     }
// //   }, [data, mapStatusToFrontend]);

// //   useEffect(() => {
// //     console.log('Orders component mounted');

// //     // Check if any global event listeners are blocking navigation
// //     const handleClick = (e: Event) => {
// //       console.log('Global click detected:', e.target);
// //     };

// //     document.addEventListener('click', handleClick);

// //     return () => {
// //       document.removeEventListener('click', handleClick);
// //     };
// //   }, []);

// //   useEffect(() => {
// //     console.log('Status filter changed:', {
// //       status,
// //       mappedStatus: status !== "all" ? mapStatusToBackend(status) : 'none'
// //     });
// //   }, [status, mapStatusToBackend]);

// //   // Show error messages
// //   useEffect(() => {
// //     if (getOrdersError) {
// //       console.error('Orders error:', getOrdersError);
// //       toast.error("Failed to load orders");
// //     }
// //   }, [getOrdersError]);

// //   useEffect(() => {
// //     const handleAllClicks = (e: MouseEvent) => {
// //       const target = e.target as HTMLElement;
// //       if (target.closest('[data-sidebar]')) {
// //         console.log('🎯 Sidebar click detected:', {
// //           tag: target.tagName,
// //           classes: target.className,
// //           text: target.textContent?.trim(),
// //           dataset: target.dataset
// //         });
// //       }
// //     };

// //     document.addEventListener('click', handleAllClicks, true);
// //     return () => document.removeEventListener('click', handleAllClicks, true);
// //   }, []);

// //   useEffect(() => {
// //     if (getOrdersSummaryError) {
// //       console.error('Orders summary error:', getOrdersSummaryError);
// //       toast.error("Failed to load order summary");
// //     }
// //   }, [getOrdersSummaryError]);

// //   useEffect(() => {
// //     if (orderSummaryError) {
// //       console.error('Order summary chart error:', orderSummaryError);
// //       toast.error("Failed to load order chart data");
// //     }
// //   }, [orderSummaryError]);

// //   useEffect(() => {
// //     if (salesError) {
// //       console.error('Sales error:', salesError);
// //       toast.error("Failed to load sales data");
// //     }
// //   }, [salesError]);

// //   return (
// //     <section>
// //       <Card className="bg-white">
// //         <CardContent className="p-4">
// //           {/* Header */}
// //           <div className="flex justify-between items-center mb-8">
// //             <Header title="Order History" subtext="Manage orders." />
// //             <div className="flex gap-5">
// //               <Button
// //                 variant="outline"
// //                 className="font-bold text-base w-auto py-4 px-5 flex gap-2 items-center"
// //                 size="xl"
// //                 onClick={handleExport}
// //                 disabled={getOrdersIsLoading}
// //               >
// //                 <ExportIcon />
// //                 {getOrdersIsLoading ? "Loading..." : "Download"}
// //               </Button>
// //             </div>
// //           </div>

// //           {/* Order Cards */}
// //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
// //             {orderlist.map((report: IOrderCard, index) => (
// //               <OrderCard
// //                 report={report}
// //                 key={`order-card-${index}`}
// //                 loading={getOrdersSummaryIsLoading}
// //               />
// //             ))}
// //           </div>

// //           {/* Charts Section */}
// //           <div className="bg-gray-50 rounded-lg p-6 mb-8">
// //             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //               <SalesChart />
// //               <OrderSummary />
// //             </div>
// //           </div>

// //           {/* Detailed Order Table */}
// //           <div className="bg-white">
// //             <div className="p-6">
// //               <h6 className="font-semibold text-lg text-[#111827] mb-6">
// //                 Detailed Order Table
// //               </h6>

// //               {/* Filters */}
// //               <div className="flex flex-wrap items-center gap-4 mb-6">
// //                 <div className="min-w-[200px]">
// //                   <InputFilter
// //                     setQuery={setFilter}
// //                     placeholder="Search orders..."
// //                   />
// //                 </div>
// //                 <div className="min-w-[150px]">
// //                   <SelectFilter
// //                     setFilter={handleCustomerTypeChange}
// //                     placeholder="Customer Type"
// //                     list={customerList}
// //                   />
// //                 </div>
// //                 <div className="min-w-[150px]">
// //                   <SelectFilter
// //                     setFilter={handleStatusChange}
// //                     placeholder="Order Status"
// //                     list={statusList}
// //                     value={status}
// //                   />
// //                 </div>
// //                 <div className="min-w-[250px]">
// //                   <DatePickerWithRange
// //                     setFromDate={setStartDate}
// //                     setToDate={setEndDate}
// //                   />
// //                 </div>
// //               </div>

// //               <DataTable
// //                 data={data?.data || []}
// //                 currentPage={currentPage}
// //                 onPageChange={onPageChange}
// //                 pageSize={parseInt(pageSize)}
// //                 totalPages={totalPages || Math.ceil((data?.total || 0) / parseInt(pageSize))}
// //                 setPageSize={setPageSize}
// //                 loading={getOrdersIsLoading}
// //                 mapStatusToFrontend={mapStatusToFrontend}
// //                 onRefreshData={handleRefreshOrders}
// //               />
// //             </div>
// //           </div>
// //         </CardContent>
// //       </Card>

// //       {/* Delete Dialog */}
// //       <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
// //         <DialogContent className="max-w-[33.75rem] left-[50%] translate-x-[-50%]">
// //           <DialogHeader>
// //             <DialogTitle className="mb-6 text-2xl font-bold text-[#111827] flex gap-4.5 items-center">
// //               Delete Order
// //             </DialogTitle>
// //           </DialogHeader>
// //           <DeleteContent
// //             isLoading={() => false}
// //             handleClick={handleDelete}
// //             handleClose={() => setIsDeleteOpen(false)}
// //             title="Order"
// //           />
// //         </DialogContent>
// //       </Dialog>
// //     </section>
// //   );
// // }

// // src/app/(admin)/orders/page.tsx
// "use client";

// import Header from "@/app/(admin)/components/header";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import DataTable from "./data-table";
// import {
//   DeliveredIcon,
//   ExportIcon,
//   InprogressIcon,
//   OrderCancelIcon,
//   OrderShippedIcon,
//   PaymentRefundIcon,
//   PendingPaymentIcon,
//   PendingReviewIcon,
// } from "../../../../../../public/icons";
// import { IOrderCard } from "@/types";
// import OrderCard from "@/components/widgets/order";
// import { OrderBarComponent } from "./order-bar-chart";
// import LineGraphComponent from "./line-graph";
// import {
//   useGetDashboardInfo,
//   calculateProfitMargin,
//   calculateRefundRate
// } from "@/services/dashboard";
// import {
//   useGetOrders,
//   useGetOrdersAnalytics,
//   useGetOrdersSummary,
//   useGetOrderSummaryChart,
//   useGetSalesData,
// } from "@/services/orders";
// import { InputFilter } from "@/app/(admin)/components/input-filter";
// import { SelectFilter } from "@/app/(admin)/components/select-filter";
// import { useEffect, useState, useMemo, useCallback } from "react";
// import DeleteContent from "@/app/(admin)/components/delete-content";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import DatePickerWithRange from "@/components/ui/date-picker";
// import SalesChart from "./orderSales";
// import OrderSummary from "./orderSummarySide";
// import { toast } from "sonner";
// import { useRouter, useSearchParams } from "next/navigation";
// import { ROUTES } from "@/constant/routes";
// import { DateRangeFilter } from "@/app/(admin)/components/date-range-filter";
// import { format, subDays } from "date-fns";
// import * as XLSX from "xlsx";

// // FIXED: Complete type definitions
// interface OrderSummaryData {
//   paymentRefund?: number;
//   orderCancel?: number;
//   orderShipped?: number;
//   inProgress?: number;
//   pendingReview?: number;
//   pendingPayment?: number;
//   delivered?: number;
//   ongoing?: number;
//   totalRevenue?: number;
//   totalOrders?: number;
// }

// interface OrdersSummaryResponse {
//   data?: OrderSummaryData;
// }

// interface Order {
//   id: string;
//   status: string;
//   // Add other order properties as needed
// }

// interface OrdersResponse {
//   data?: Order[];
//   total?: number;
//   page?: number;
//   limit?: number;
//   pagination?: {
//     totalPages?: number;
//     totalItems?: number;
//     hasNext?: boolean;
//     hasPrev?: boolean;
//   };
// }

// // FIXED: Define filter object type
// interface OrdersFilter {
//   pageNumber: number;
//   pageSize: number;
//   search?: string;
//   status?: string;
//   customerType?: string;
//   dateFrom?: string;
//   dateTo?: string;
// }

// export default function Orders() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const statusFilter = searchParams.get('status') || '';
  
//   // FIXED: Initialize currentPage from URL params
//   const pageParam = searchParams.get('page');
//   const initialPage = pageParam ? parseInt(pageParam, 10) : 1;

//   // Date range states
//   const [dateRange, setDateRange] = useState<string>('all');
//   const [dateFrom, setDateFrom] = useState<string>('');
//   const [dateTo, setDateTo] = useState<string>('');

//   // Hooks for data fetching with proper typing
//   const {
//     orderSummary,
//     orderSummarySummary,
//     isOrderSummaryLoading,
//     orderSummaryError
//   } = useGetOrderSummaryChart({ timeframe: '6m' });

//   const {
//     getOrdersData: data,
//     getOrdersError,
//     getOrdersIsLoading,
//     setOrdersFilter,
//     refetchOrders,
//     totalPages,
//     totalItems,
//   } = useGetOrders() as {
//     getOrdersData: OrdersResponse;
//     getOrdersError: any;
//     getOrdersIsLoading: boolean;
//     setOrdersFilter: (filter: any) => void;
//     refetchOrders: () => void;
//     totalPages: number;
//     totalItems: number;
//   };

//   const {
//     getOrdersSummaryData,
//     getOrdersSummaryIsLoading,
//     getOrdersSummaryError,
//     refetchOrdersSummary,
//     setOrdersSummaryFilter,
//   } = useGetOrdersSummary() as {
//     getOrdersSummaryData: OrdersSummaryResponse;
//     getOrdersSummaryIsLoading: boolean;
//     getOrdersSummaryError: any;
//     refetchOrdersSummary: () => void;
//     setOrdersSummaryFilter: (filter: any) => void;
//   };

//   const {
//     salesData,
//     isSalesLoading,
//     salesError,
//     setSalesFilter
//   } = useGetSalesData();

//   const {
//     getOrdersAnalyticsData,
//     getOrdersAnalyticsIsLoading,
//     getOrdersAnalyticsError,
//     refetchOrdersAnalytics,
//     setOrdersAnalyticsFilter,
//   } = useGetOrdersAnalytics();

//   // FIXED: Initialize currentPage with value from URL
//   const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
//   const [filter, setFilter] = useState<string>("");
//   const [status, setStatus] = useState<string>(statusFilter);
//   const [customerType, setCustomerType] = useState<string>("");
//   const [pageSize, setPageSize] = useState<string>("10");
//   const [currentPage, setCurrentPage] = useState(initialPage);
//   const [startDateSales, setStartDateSales] = useState<string | null>(null);
//   const [endDateSales, setEndDateSales] = useState<string | null>(null);
//   const [filterSales, setFilterSales] = useState<string>("");

//   // Handle date range changes
//   const handleDateRangeChange = useCallback((value: string) => {
//     setDateRange(value);
    
//     const today = new Date();
//     let fromDate = '';
//     let toDate = format(today, 'yyyy-MM-dd');
    
//     switch (value) {
//       case 'today':
//         fromDate = toDate;
//         break;
//       case 'last7days':
//         fromDate = format(subDays(today, 7), 'yyyy-MM-dd');
//         break;
//       case 'last30days':
//         fromDate = format(subDays(today, 30), 'yyyy-MM-dd');
//         break;
//       case 'last90days':
//         fromDate = format(subDays(today, 90), 'yyyy-MM-dd');
//         break;
//       case 'custom':
//         // Keep existing custom dates if they exist
//         if (!dateFrom || !dateTo) {
//           fromDate = format(subDays(today, 30), 'yyyy-MM-dd');
//           setDateFrom(fromDate);
//           setDateTo(toDate);
//         }
//         return; // Don't reset dates for custom
//       default: // 'all'
//         fromDate = '';
//         toDate = '';
//     }
    
//     setDateFrom(fromDate);
//     setDateTo(toDate);
//   }, [dateFrom, dateTo]);

//   const handleDateFromChange = useCallback((value: string) => {
//     setDateFrom(value);
//     setDateRange('custom');
//   }, []);

//   const handleDateToChange = useCallback((value: string) => {
//     setDateTo(value);
//     setDateRange('custom');
//   }, []);

//   // Map backend status to frontend status
//   const mapStatusToFrontend = useCallback((backendStatus: string): string => {
//     switch (backendStatus?.toLowerCase()) {
//       case 'pending':
//       case 'processing':
//       case 'shipped':
//       case 'confirmed':
//         return 'ongoing';
//       case 'delivered':
//       case 'completed':
//         return 'delivered';
//       case 'cancelled':
//       case 'refunded':
//         return 'cancelled';
//       default:
//         return 'ongoing';
//     }
//   }, []);

//   const mapStatusToBackend = useCallback((frontendStatus: string): string => {
//     switch (frontendStatus?.toLowerCase()) {
//       case 'ongoing':
//         return 'PENDING,PROCESSING,SHIPPED,ONGOING';
//       case 'delivered':
//         return 'DELIVERED,COMPLETED';
//       case 'cancelled':
//         return 'CANCELLED';
//       default:
//         return '';
//     }
//   }, []);

//   // Filter options with valid values
//   const customerList = useMemo(() => [
//     { text: "All Types", value: "all" },
//     { text: "Individual", value: "individual" },
//     { text: "Business", value: "business" },
//   ], []);

//   const statusList = useMemo(() => [
//     { text: "All Status", value: "all" },
//     { text: "Ongoing", value: "ongoing" },
//     { text: "Delivered", value: "delivered" },
//     { text: "Cancelled", value: "cancelled" },
//   ], []);

//   // Order cards data - updated to match your requirements
//   const orderlist: IOrderCard[] = useMemo(() => [
//     {
//       value: getOrdersSummaryData?.data?.paymentRefund || 0,
//       icon: <PaymentRefundIcon />,
//       title: "Payment Refund",
//     },
//     {
//       value: getOrdersSummaryData?.data?.orderCancel || 0,
//       icon: <OrderCancelIcon />,
//       title: "Cancelled Orders",
//     },
//     {
//       value: getOrdersSummaryData?.data?.orderShipped || 0,
//       icon: <OrderShippedIcon />,
//       title: "Shipped Orders",
//     },
//     {
//       value: getOrdersSummaryData?.data?.inProgress || getOrdersSummaryData?.data?.ongoing || 0,
//       icon: <InprogressIcon />,
//       title: "In Progress",
//     },
//     {
//       value: getOrdersSummaryData?.data?.pendingReview || 0,
//       icon: <PendingReviewIcon />,
//       title: "Pending Review",
//     },
//     {
//       value: getOrdersSummaryData?.data?.pendingPayment || 0,
//       icon: <PendingPaymentIcon />,
//       title: "Pending Payments",
//     },
//     {
//       value: getOrdersSummaryData?.data?.delivered || 0,
//       icon: <DeliveredIcon />,
//       title: "Delivered",
//     },
//     {
//       value: getOrdersSummaryData?.data?.totalRevenue || 0,
//       icon: <PendingPaymentIcon />,
//       title: "Total Revenue",
//       isRevenue: true,
//     },
//   ], [getOrdersSummaryData?.data]);

//   // FIXED: Create properly typed filter object for the API
//   const ordersFilter = useMemo((): OrdersFilter => {
//     const filterObj: OrdersFilter = {
//       pageNumber: currentPage,
//       pageSize: parseInt(pageSize),
//     };

//     // Add other filters only if they have values
//     if (filter && filter.trim()) {
//       filterObj.search = filter.trim();
//     }

//     if (status && status !== "all") {
//       filterObj.status = mapStatusToBackend(status);
//       console.log('Setting status filter:', status, '→', filterObj.status);
//     }

//     if (customerType && customerType !== "all") {
//       filterObj.customerType = customerType;
//     }

//     // Apply date range filters
//     if (dateFrom) {
//       filterObj.dateFrom = dateFrom;
//     }

//     if (dateTo) {
//       filterObj.dateTo = dateTo;
//     }

//     console.log('Complete orders filter:', filterObj);
//     return filterObj;
//   }, [currentPage, pageSize, filter, status, customerType, dateFrom, dateTo, mapStatusToBackend]);

//   const analyticsFilter = useMemo(() => ({
//     period: filterSales,
//     startDate: startDateSales,
//     endDate: endDateSales,
//   }), [filterSales, startDateSales, endDateSales]);

//   const salesFilter = useMemo(() => ({
//     period: filterSales,
//     startDate: startDateSales,
//     endDate: endDateSales,
//     year: new Date().getFullYear(),
//   }), [filterSales, startDateSales, endDateSales]);

//   // FIXED: Handle page change with correct parameter usage
//   const onPageChange = useCallback((page: number) => {
//     setCurrentPage(page);

//     const params = new URLSearchParams();
//     params.set('page', page.toString());
    
//     // Preserve other search params
//     if (status && status !== "all") {
//       params.set('status', status);
//     }
    
//     // Update URL without page reload
//     router.push(`${ROUTES.ADMIN.SIDEBAR.ORDERS}?${params.toString()}`, { scroll: false });
//   }, [router, status]);

//   // Filter change handlers
//   const handleCustomerTypeChange = useCallback((value: string) => {
//     setCustomerType(value);
//     // Reset to first page when filters change
//     setCurrentPage(1);
//     const params = new URLSearchParams(searchParams.toString());
//     params.set('page', '1');
//     if (value === "all") {
//       params.delete('customerType');
//     } else {
//       params.set('customerType', value);
//     }
//     router.push(`/admin/orders?${params.toString()}`);
//   }, [router, searchParams]);

//   const handleStatusChange = useCallback((value: string) => {
//     setStatus(value);
//     // Reset to first page when filters change
//     setCurrentPage(1);
//     // Update URL to reflect status filter
//     const params = new URLSearchParams(searchParams.toString());
//     params.set('page', '1');
//     if (value === "all") {
//       params.delete('status');
//     } else {
//       params.set('status', value);
//     }
//     router.push(`/admin/orders?${params.toString()}`);
//   }, [router, searchParams]);

//   // ADDED: Refresh handler for DataTable
//   const handleRefreshOrders = useCallback(() => {
//     console.log('Refreshing orders data...');
//     if (refetchOrders) {
//       refetchOrders();
//     }
//     // Also refresh summary data
//     if (refetchOrdersSummary) {
//       refetchOrdersSummary();
//     }
//   }, [refetchOrders, refetchOrdersSummary]);


//   const formatDataForExcel = useCallback((orders: any) => {
//     if (!Array.isArray(orders)) {
//       console.warn("Expected an array but got:", orders);
//       return [];
//     }

//     return orders?.map((order: any) => ({
//       id: order.id,
//       orderId: order.orderId,
//       customerName: order.customer?.name || order.user?.profile?.fullName || "Unknown Customer",
//       customerEmail: order.customer?.email || order.user?.email || "No email",
//       customerType: order.customer?.type || order.user?.type || "individual",
//       totalPrice: order.totalPrice || order.amount || 0,
//       status: order.status || 'pending',
//       paymentStatus: order.paymentStatus || 'pending',
//       createdAt: order.createdAt,
//       updatedAt: order.updatedAt
//     }));
//   }, []);

//   // Handle Excel export
//   const handleExport = useCallback(() => {
//     try {
//       const formattedData = formatDataForExcel(data?.data);
//       const worksheet = XLSX.utils.json_to_sheet(formattedData);
//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
      
//       // Auto-size columns
//       const maxWidth = formattedData.reduce((w: number, r: any) => Math.max(w, String(r.customerName).length), 10);
//       worksheet['!cols'] = [{ wch: maxWidth }];
      
//       XLSX.writeFile(workbook, "orders.xlsx");
//       toast.success("Orders exported successfully");
//     } catch (error) {
//       console.error('Export error:', error);
//       toast.error("Failed to export orders");
//     }
//   }, [data?.data, formatDataForExcel]);
//       const downloadExcel = () => {
//         const formattedData = formatDataForExcel(data?.data);
//         const worksheet = XLSX.utils.json_to_sheet(formattedData);
//         const workbook = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
    
//         XLSX.writeFile(workbook, "customers.xlsx");
//       };
//       console.log(data, "downP");

//   // Handle delete
//   const handleDelete = useCallback(async () => {
//     try {
//       setIsDeleteOpen(false);
//       toast.success("Order deleted successfully");
//       handleRefreshOrders();
//     } catch (error) {
//       console.error('Delete error:', error);
//       toast.error("Failed to delete order");
//     }
//   }, [handleRefreshOrders]);

//   // Apply filters effect
//   useEffect(() => {
//     console.log('Applying filter to orders:', ordersFilter);
//     if (setOrdersFilter) {
//       setOrdersFilter(ordersFilter);
//     }
//   }, [ordersFilter, setOrdersFilter]);

//   // Apply analytics filters
//   useEffect(() => {
//     if (setSalesFilter) {
//       setSalesFilter(salesFilter);
//     }
//   }, [salesFilter, setSalesFilter]);

//   useEffect(() => {
//     if (setOrdersAnalyticsFilter) {
//       setOrdersAnalyticsFilter(analyticsFilter);
//     }
//   }, [analyticsFilter, setOrdersAnalyticsFilter]);

//   // FIXED: Update currentPage when URL param changes
//   useEffect(() => {
//     const pageParam = searchParams.get('page');
//     if (pageParam) {
//       const pageNumber = parseInt(pageParam, 10);
//       if (!isNaN(pageNumber) && pageNumber !== currentPage) {
//         setCurrentPage(pageNumber);
//       }
//     }
//   }, [searchParams, currentPage]);

//   // Set status from URL params
//   useEffect(() => {
//     if (statusFilter && statusFilter !== status) {
//       setStatus(statusFilter);
//     }
//   }, [statusFilter]);

//   useEffect(() => {
//     if (data) {
//       console.log('Orders data received:', {
//         total: data?.total,
//         count: data?.data?.length,
//         firstItem: data?.data?.[0],
//         pagination: data?.pagination || 'No pagination data'
//       });
//     }
//   }, [data]);

//   useEffect(() => {
//     if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
//       const uniqueStatuses = [...new Set(data.data.map(order => order?.status).filter(Boolean))];
//       console.log('🔍 Actual backend status values:', uniqueStatuses);

//       // Test each status mapping
//       uniqueStatuses.forEach(status => {
//         console.log(`Status "${status}" maps to frontend: "${mapStatusToFrontend(status)}"`);
//       });
//     }
//   }, [data, mapStatusToFrontend]);

//   useEffect(() => {
//     console.log('Orders component mounted');

//     // Check if any global event listeners are blocking navigation
//     const handleClick = (e: Event) => {
//       console.log('Global click detected:', e.target);
//     };

//     document.addEventListener('click', handleClick);

//     return () => {
//       document.removeEventListener('click', handleClick);
//     };
//   }, []);

//   useEffect(() => {
//     console.log('Status filter changed:', {
//       status,
//       mappedStatus: status !== "all" ? mapStatusToBackend(status) : 'none'
//     });
//   }, [status, mapStatusToBackend]);

//   // Show error messages
//   useEffect(() => {
//     if (getOrdersError) {
//       console.error('Orders error:', getOrdersError);
//       toast.error("Failed to load orders");
//     }
//   }, [getOrdersError]);

//   useEffect(() => {
//     const handleAllClicks = (e: MouseEvent) => {
//       const target = e.target as HTMLElement;
//       if (target.closest('[data-sidebar]')) {
//         console.log('🎯 Sidebar click detected:', {
//           tag: target.tagName,
//           classes: target.className,
//           text: target.textContent?.trim(),
//           dataset: target.dataset
//         });
//       }
//     };

//     document.addEventListener('click', handleAllClicks, true);
//     return () => document.removeEventListener('click', handleAllClicks, true);
//   }, []);

//   useEffect(() => {
//     if (getOrdersSummaryError) {
//       console.error('Orders summary error:', getOrdersSummaryError);
//       toast.error("Failed to load order summary");
//     }
//   }, [getOrdersSummaryError]);

//   useEffect(() => {
//     if (orderSummaryError) {
//       console.error('Order summary chart error:', orderSummaryError);
//       toast.error("Failed to load order chart data");
//     }
//   }, [orderSummaryError]);

//   useEffect(() => {
//     if (salesError) {
//       console.error('Sales error:', salesError);
//       toast.error("Failed to load sales data");
//     }
//   }, [salesError]);

//   return (
//     <section>
//       <Card className="bg-white">
//         <CardContent className="p-4">
//           {/* Header */}
//           <div className="flex justify-between items-center mb-8">
//             <Header title="Order History" subtext="Manage orders." />
//             <div className="flex gap-5">
//               <Button
//                 variant="outline"
//                 className="font-bold text-base w-auto py-4 px-5 flex gap-2 items-center"
//                 size="xl"
//                 onClick={handleExport}
//                 disabled={getOrdersIsLoading}
//               >
//                 <ExportIcon />
//                 {getOrdersIsLoading ? "Loading..." : "Download"}
//               </Button>
//             </div>
//           </div>

//           {/* Order Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//             {orderlist.map((report: IOrderCard, index) => (
//               <OrderCard
//                 report={report}
//                 key={`order-card-${index}`}
//                 loading={getOrdersSummaryIsLoading}
//               />
//             ))}
//           </div>

//           {/* Charts Section */}
//           <div className="bg-gray-50 rounded-lg p-6 mb-8">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <SalesChart />
//               <OrderSummary />
//             </div>
//           </div>

//           {/* Detailed Order Table */}
//           <div className="bg-white">
//             <div className="p-6">
//               <h6 className="font-semibold text-lg text-[#111827] mb-6">
//                 Detailed Order Table
//               </h6>

//               {/* Filters */}
//               <div className="flex flex-wrap items-center gap-4 mb-6">
//                 <div className="min-w-[200px]">
//                   <InputFilter
//                     setQuery={setFilter}
//                     placeholder="Search orders..."
//                   />
//                 </div>
//                 <div className="min-w-[150px]">
//                   <SelectFilter
//                     setFilter={handleCustomerTypeChange}
//                     placeholder="Customer Type"
//                     list={customerList}
//                   />
//                 </div>
//                 <div className="min-w-[150px]">
//                   <SelectFilter
//                     setFilter={handleStatusChange}
//                     placeholder="Order Status"
//                     list={statusList}
//                     value={status}
//                   />
//                 </div>
//                 <div className="min-w-[250px]">
//                   <DateRangeFilter
//                     dateRange={dateRange}
//                     dateFrom={dateFrom}
//                     dateTo={dateTo}
//                     onDateRangeChange={handleDateRangeChange}
//                     onDateFromChange={handleDateFromChange}
//                     onDateToChange={handleDateToChange}
//                   />
//                 </div>
//               </div>

//               <DataTable
//                 data={data?.data || []}
//                 currentPage={currentPage}
//                 onPageChange={onPageChange}
//                 pageSize={parseInt(pageSize)}
//                 totalPages={totalPages || Math.ceil((data?.total || 0) / parseInt(pageSize))}
//                 setPageSize={setPageSize}
//                 loading={getOrdersIsLoading}
//                 mapStatusToFrontend={mapStatusToFrontend}
//                 onRefreshData={handleRefreshOrders}
//               />
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Delete Dialog */}
//       <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
//         <DialogContent className="max-w-[33.75rem] left-[50%] translate-x-[-50%]">
//           <DialogHeader>
//             <DialogTitle className="mb-6 text-2xl font-bold text-[#111827] flex gap-4.5 items-center">
//               Delete Order
//             </DialogTitle>
//           </DialogHeader>
//           <DeleteContent
//             isLoading={() => false}
//             handleClick={handleDelete}
//             handleClose={() => setIsDeleteOpen(false)}
//             title="Order"
//           />
//         </DialogContent>
//       </Dialog>
//     </section>
//   );
// }

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
  useGetDashboardInfo,
  calculateProfitMargin,
  calculateRefundRate
} from "@/services/dashboard";
import {
  useGetOrders,
  useGetOrdersAnalytics,
  useGetOrdersSummary,
  useGetOrderSummaryChart,
  useGetSalesData,
} from "@/services/orders";
import { InputFilter } from "@/app/(admin)/components/input-filter";
import { SelectFilter } from "@/app/(admin)/components/select-filter";
import { useEffect, useState, useMemo, useCallback } from "react";
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
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/constant/routes";
import { DateRangeFilter } from "@/app/(admin)/components/date-range-filter";
import { format, subDays } from "date-fns";
import * as XLSX from "xlsx";

// Complete type definitions
interface OrderSummaryData {
  paymentRefund?: number;
  orderCancel?: number;
  orderShipped?: number;
  inProgress?: number;
  pendingReview?: number;
  pendingPayment?: number;
  delivered?: number;
  ongoing?: number;
  totalRevenue?: number;
  totalOrders?: number;
}

interface OrdersSummaryResponse {
  data?: OrderSummaryData;
}

interface Order {
  id: string;
  status: string;
}

interface OrdersResponse {
  data?: Order[];
  total?: number;
  page?: number;
  limit?: number;
  pagination?: {
    totalPages?: number;
    totalItems?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
}

// Define filter object type
interface OrdersFilter {
  pageNumber: number;
  pageSize: number;
  search?: string;
  status?: string;
  customerType?: string;
  dateFrom?: string;
  dateTo?: string;
}

export default function Orders() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get('status') || '';
  
  // Initialize currentPage from URL params
  const pageParam = searchParams.get('page');
  const initialPage = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;

  // Date range states
  const [dateRange, setDateRange] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

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
    refetchOrders,
    totalPages,
    totalItems,
  } = useGetOrders() as {
    getOrdersData: OrdersResponse;
    getOrdersError: any;
    getOrdersIsLoading: boolean;
    setOrdersFilter: (filter: any) => void;
    refetchOrders: () => void;
    totalPages: number;
    totalItems: number;
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
  } = useGetSalesData();

  const {
    getOrdersAnalyticsData,
    getOrdersAnalyticsIsLoading,
    getOrdersAnalyticsError,
    refetchOrdersAnalytics,
    setOrdersAnalyticsFilter,
  } = useGetOrdersAnalytics();

  // State management
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");
  const [status, setStatus] = useState<string>(statusFilter);
  const [customerType, setCustomerType] = useState<string>("");
  const [pageSize, setPageSize] = useState<string>("10");
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [startDateSales, setStartDateSales] = useState<string | null>(null);
  const [endDateSales, setEndDateSales] = useState<string | null>(null);
  const [filterSales, setFilterSales] = useState<string>("");

  // Handle date range changes
  const handleDateRangeChange = useCallback((value: string) => {
    setDateRange(value);
    
    const today = new Date();
    let fromDate = '';
    let toDate = format(today, 'yyyy-MM-dd');
    
    switch (value) {
      case 'today':
        fromDate = toDate;
        break;
      case 'last7days':
        fromDate = format(subDays(today, 7), 'yyyy-MM-dd');
        break;
      case 'last30days':
        fromDate = format(subDays(today, 30), 'yyyy-MM-dd');
        break;
      case 'last90days':
        fromDate = format(subDays(today, 90), 'yyyy-MM-dd');
        break;
      case 'custom':
        if (!dateFrom || !dateTo) {
          fromDate = format(subDays(today, 30), 'yyyy-MM-dd');
          setDateFrom(fromDate);
          setDateTo(toDate);
        }
        return;
      default:
        fromDate = '';
        toDate = '';
    }
    
    setDateFrom(fromDate);
    setDateTo(toDate);
  }, [dateFrom, dateTo]);

  const handleDateFromChange = useCallback((value: string) => {
    setDateFrom(value);
    setDateRange('custom');
  }, []);

  const handleDateToChange = useCallback((value: string) => {
    setDateTo(value);
    setDateRange('custom');
  }, []);

  // Map backend status to frontend status
  const mapStatusToFrontend = useCallback((backendStatus: string): string => {
    switch (backendStatus?.toLowerCase()) {
      case 'pending':
      case 'processing':
      case 'shipped':
      case 'confirmed':
        return 'ongoing';
      case 'delivered':
      case 'completed':
        return 'delivered';
      case 'cancelled':
      case 'refunded':
        return 'cancelled';
      default:
        return 'ongoing';
    }
  }, []);

  const mapStatusToBackend = useCallback((frontendStatus: string): string => {
    switch (frontendStatus?.toLowerCase()) {
      case 'ongoing':
        return 'PENDING,PROCESSING,SHIPPED,ONGOING';
      case 'delivered':
        return 'DELIVERED,COMPLETED';
      case 'cancelled':
        return 'CANCELLED';
      default:
        return '';
    }
  }, []);

  // Filter options with valid values
  const customerList = useMemo(() => [
    { text: "All Types", value: "all" },
    { text: "Individual", value: "individual" },
    { text: "Business", value: "business" },
  ], []);

  const statusList = useMemo(() => [
    { text: "All Status", value: "all" },
    { text: "Ongoing", value: "ongoing" },
    { text: "Delivered", value: "delivered" },
    { text: "Cancelled", value: "cancelled" },
  ], []);

  // Order cards data
  const orderlist: IOrderCard[] = useMemo(() => [
    {
      value: getOrdersSummaryData?.data?.paymentRefund || 0,
      icon: <PaymentRefundIcon />,
      title: "Payment Refund",
    },
    {
      value: getOrdersSummaryData?.data?.orderCancel || 0,
      icon: <OrderCancelIcon />,
      title: "Cancelled Orders",
    },
    {
      value: getOrdersSummaryData?.data?.orderShipped || 0,
      icon: <OrderShippedIcon />,
      title: "Shipped Orders",
    },
    {
      value: getOrdersSummaryData?.data?.inProgress || getOrdersSummaryData?.data?.ongoing || 0,
      icon: <InprogressIcon />,
      title: "In Progress",
    },
    {
      value: getOrdersSummaryData?.data?.pendingReview || 0,
      icon: <PendingReviewIcon />,
      title: "Pending Review",
    },
    {
      value: getOrdersSummaryData?.data?.pendingPayment || 0,
      icon: <PendingPaymentIcon />,
      title: "Pending Payments",
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
  ], [getOrdersSummaryData?.data]);

  // FIX: Create properly typed filter object for the API
  const ordersFilter = useMemo((): OrdersFilter => {
    const filterObj: OrdersFilter = {
      pageNumber: currentPage,
      pageSize: parseInt(pageSize),
    };

    if (filter && filter.trim()) {
      filterObj.search = filter.trim();
    }

    if (status && status !== "all") {
      filterObj.status = mapStatusToBackend(status);
    }

    if (customerType && customerType !== "all") {
      filterObj.customerType = customerType;
    }

    if (dateFrom) {
      filterObj.dateFrom = dateFrom;
    }

    if (dateTo) {
      filterObj.dateTo = dateTo;
    }

    return filterObj;
  }, [currentPage, pageSize, filter, status, customerType, dateFrom, dateTo, mapStatusToBackend]);

  const analyticsFilter = useMemo(() => ({
    period: filterSales,
    startDate: startDateSales,
    endDate: endDateSales,
  }), [filterSales, startDateSales, endDateSales]);

  const salesFilter = useMemo(() => ({
    period: filterSales,
    startDate: startDateSales,
    endDate: endDateSales,
    year: new Date().getFullYear(),
  }), [filterSales, startDateSales, endDateSales]);

  // FIX: Handle page change with correct parameter usage and bounds checking
  const onPageChange = useCallback((page: number) => {
    const safePage = Math.max(1, Math.min(page, totalPages || 1));
    setCurrentPage(safePage);

    const params = new URLSearchParams(searchParams.toString());
    params.set('page', safePage.toString());
    
    if (status && status !== "all") {
      params.set('status', status);
    }
    
    router.push(`${ROUTES.ADMIN.SIDEBAR.ORDERS}?${params.toString()}`, { scroll: false });
  }, [router, status, searchParams, totalPages]);

  // Filter change handlers
  const handleCustomerTypeChange = useCallback((value: string) => {
    setCustomerType(value);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');
    if (value === "all") {
      params.delete('customerType');
    } else {
      params.set('customerType', value);
    }
    router.push(`/admin/orders?${params.toString()}`);
  }, [router, searchParams]);

  const handleStatusChange = useCallback((value: string) => {
    setStatus(value);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');
    if (value === "all") {
      params.delete('status');
    } else {
      params.set('status', value);
    }
    router.push(`/admin/orders?${params.toString()}`);
  }, [router, searchParams]);

  // FIX: Handle page size change with proper bounds checking
  const handlePageSizeChange = useCallback((value: string) => {
    const newPageSize = parseInt(value);
    const newTotalPages = Math.ceil((totalItems || 0) / newPageSize);
    const newCurrentPage = Math.min(currentPage, newTotalPages || 1);
    
    setPageSize(value);
    setCurrentPage(newCurrentPage);
    
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newCurrentPage.toString());
    params.set('pageSize', value);
    
    router.push(`/admin/orders?${params.toString()}`, { scroll: false });
  }, [currentPage, totalItems, router, searchParams]);

  // Refresh handler for DataTable
  const handleRefreshOrders = useCallback(() => {
    if (refetchOrders) {
      refetchOrders();
    }
    if (refetchOrdersSummary) {
      refetchOrdersSummary();
    }
  }, [refetchOrders, refetchOrdersSummary]);

  const formatDataForExcel = useCallback((orders: any) => {
    if (!Array.isArray(orders)) {
      console.warn("Expected an array but got:", orders);
      return [];
    }

    return orders?.map((order: any) => ({
      id: order.id,
      orderId: order.orderId,
      customerName: order.customer?.name || order.user?.profile?.fullName || "Unknown Customer",
      customerEmail: order.customer?.email || order.user?.email || "No email",
      customerType: order.customer?.type || order.user?.type || "individual",
      totalPrice: order.totalPrice || order.amount || 0,
      status: order.status || 'pending',
      paymentStatus: order.paymentStatus || 'pending',
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }));
  }, []);

  // Handle Excel export
  const handleExport = useCallback(() => {
    try {
      const formattedData = formatDataForExcel(data?.data);
      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
      
      const maxWidth = formattedData.reduce((w: number, r: any) => Math.max(w, String(r.customerName).length), 10);
      worksheet['!cols'] = [{ wch: maxWidth }];
      
      XLSX.writeFile(workbook, "orders.xlsx");
      toast.success("Orders exported successfully");
    } catch (error) {
      console.error('Export error:', error);
      toast.error("Failed to export orders");
    }
  }, [data?.data, formatDataForExcel]);

  // Handle delete
  const handleDelete = useCallback(async () => {
    try {
      setIsDeleteOpen(false);
      toast.success("Order deleted successfully");
      handleRefreshOrders();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error("Failed to delete order");
    }
  }, [handleRefreshOrders]);

  // Apply filters effect
  useEffect(() => {
    if (setOrdersFilter) {
      setOrdersFilter(ordersFilter);
    }
  }, [ordersFilter, setOrdersFilter]);

  // Apply analytics filters
  useEffect(() => {
    if (setSalesFilter) {
      setSalesFilter(salesFilter);
    }
  }, [salesFilter, setSalesFilter]);

  useEffect(() => {
    if (setOrdersAnalyticsFilter) {
      setOrdersAnalyticsFilter(analyticsFilter);
    }
  }, [analyticsFilter, setOrdersAnalyticsFilter]);

  // Update currentPage when URL param changes
  useEffect(() => {
    const pageParam = searchParams.get('page');
    if (pageParam) {
      const pageNumber = Math.max(1, parseInt(pageParam, 10));
      if (!isNaN(pageNumber) && pageNumber !== currentPage) {
        setCurrentPage(pageNumber);
      }
    }
  }, [searchParams, currentPage]);

  // Set status from URL params
  useEffect(() => {
    if (statusFilter && statusFilter !== status) {
      setStatus(statusFilter);
    }
  }, [statusFilter, status]);

  // Show error messages
  useEffect(() => {
    if (getOrdersError) {
      console.error('Orders error:', getOrdersError);
      toast.error("Failed to load orders");
    }
  }, [getOrdersError]);

  useEffect(() => {
    if (getOrdersSummaryError) {
      console.error('Orders summary error:', getOrdersSummaryError);
      toast.error("Failed to load order summary");
    }
  }, [getOrdersSummaryError]);

  useEffect(() => {
    if (orderSummaryError) {
      console.error('Order summary chart error:', orderSummaryError);
      toast.error("Failed to load order chart data");
    }
  }, [orderSummaryError]);

  useEffect(() => {
    if (salesError) {
      console.error('Sales error:', salesError);
      toast.error("Failed to load sales data");
    }
  }, [salesError]);

  return (
    <section className="p-6">
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
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
                key={`order-card-${index}`}
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
              <h6 className="font-semibold text-lg text-gray-900 mb-6">
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
                    setFilter={handleCustomerTypeChange}
                    placeholder="Customer Type"
                    list={customerList}
                  />
                </div>
                <div className="min-w-[150px]">
                  <SelectFilter
                    setFilter={handleStatusChange}
                    placeholder="Order Status"
                    list={statusList}
                    value={status}
                  />
                </div>
                <div className="min-w-[250px]">
                  <DateRangeFilter
                    dateRange={dateRange}
                    dateFrom={dateFrom}
                    dateTo={dateTo}
                    onDateRangeChange={handleDateRangeChange}
                    onDateFromChange={handleDateFromChange}
                    onDateToChange={handleDateToChange}
                  />
                </div>
              </div>

              <DataTable
                data={data?.data || []}
                currentPage={currentPage}
                onPageChange={onPageChange}
                pageSize={parseInt(pageSize)}
                totalPages={totalPages || Math.ceil((data?.total || 0) / parseInt(pageSize))}
                setPageSize={handlePageSizeChange as any}
                loading={getOrdersIsLoading}
                mapStatusToFrontend={mapStatusToFrontend}
                onRefreshData={handleRefreshOrders}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-[33.75rem] left-[50%] translate-x-[-50%]">
          <DialogHeader>
            <DialogTitle className="mb-6 text-2xl font-bold text-gray-900 flex gap-4.5 items-center">
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