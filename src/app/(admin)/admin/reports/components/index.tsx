"use client";
import React, { useState, useMemo } from "react";
import Header from "@/app/(admin)/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DataTable from "./data-table";
import {
	ExportIcon,
	TotalOrderIcon,
	TotalPendingIcon,
	TotalSalesIcon,
	TotalUserIcon,
} from "../../../../../../public/icons";
import ReportCard from "@/components/report-card";
import ReportCard1 from "@/components/report-card/index1";
import { IReportCard } from "@/types";
import { PieChartComponent } from "@/app/(admin)/components/pie-chart";
import MultiLineGraphComponent from "./linegraph";
import { useGetDashboardInfo } from "@/services/dashboard";
import LoadingSvg from "@/components/load";
import AddCustomer from "./add-customer";
import { ChevronLeft } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useGetAdminRoles } from "@/services/admin/index";
import RegDataTable from "./RegData-table";

// Enhanced TypeScript interfaces
interface DashboardData {
	metrics?: {
		customers?: {
			changePercentage?: number;
			total?: number;
			trend?: string;
		};
		revenue?: {
			changePercentage?: number;
			total?: number;
			trend?: string;
		};
		orders?: {
			changePercentage?: number;
			total?: number;
			trend?: string;
		};
		profits?: {
			changePercentage?: number;
			total?: number;
			trend?: string;
		};
	};
	charts?: {
		orderSummary?: Array<{
			sales?: number;
			[key: string]: any;
		}>;
		salesPerformance?: Array<{
			month: string;
			orders_count: number;
			total_sales: number;
		}>;
	};
	topPerformers?: {
		customers?: Array<{
			userId?: number;
			email?: string;
			totalSpent?: number;
			orderCount?: number;
			status?: string;
			[key: string]: any;
		}>;
	};
	recentActivity?: {
		newCustomers?: any[];
	};
}

interface RolesData {
	data?: any[];
	[key: string]: any;
}

interface DataTableCustomer {
	userId: number;
	email: string;
	totalSpent: number;
	orderCount: number;
	status: string;
}

// Helper function to calculate summary statistics
const calculateSummaryStats = (customers: DataTableCustomer[]) => {
	const totalSales = customers.reduce((acc, customer) => acc + customer.totalSpent, 0);
	const totalOrders = customers.reduce((acc, customer) => acc + customer.orderCount, 0);
	const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;
	const customerCount = customers.length;

	return {
		totalSales,
		totalOrders,
		avgOrderValue,
		customerCount,
	};
};

export default function Reports() {
	// ✅ ALL HOOKS AT THE TOP
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [url, setUrl] = useState("");

	// API hooks
	const { rolesData: rawRolesData, isRolesLoading } = useGetAdminRoles({ enabled: true });
	const {
		isDashboardInfoLoading,
		isFetchingDashboardInfo,
		dashboardData: rawData,
		refetchDashboardData,
	} = useGetDashboardInfo({ enabled: true });

	// ✅ Process data with useMemo
	const rolesData = useMemo(() => rawRolesData as RolesData, [rawRolesData]);
	const safeRolesData = useMemo(() => Array.isArray(rolesData?.data) ? rolesData.data : [], [rolesData]);
	const data = useMemo(() => rawData as DashboardData, [rawData]);

	// ✅ Calculate monthly performance stats with proper useMemo
	const monthlyPerformanceStats = useMemo(() => {
		const salesData = data?.charts?.salesPerformance || [];

		if (!salesData || salesData.length === 0) {
			return { totalSales: 0, totalOrders: 0, avgMonthlySales: 0 };
		}

		const totalSales = salesData.reduce((acc, curr) => acc + (curr.total_sales || 0), 0);
		const totalOrders = salesData.reduce((acc, curr) => acc + (curr.orders_count || 0), 0);
		const avgMonthlySales = totalSales / salesData.length;

		return { totalSales, totalOrders, avgMonthlySales };
	}, [data?.charts?.salesPerformance]);

	// ✅ Process other data after hooks
	const topCustomers: DataTableCustomer[] = useMemo(() =>
		(data?.topPerformers?.customers || []).map((customer, index) => ({
			userId: customer?.userId || customer?.id || index + 1,
			email: customer?.email || "",
			totalSpent: customer?.totalSpent || 0,
			orderCount: customer?.orderCount || 0,
			status: customer?.status || "active",
		}))
		, [data?.topPerformers?.customers]);

	const newCustomers = useMemo(() => data?.recentActivity?.newCustomers || [], [data?.recentActivity?.newCustomers]);
	const salesData = useMemo(() => data?.charts?.salesPerformance || [], [data?.charts?.salesPerformance]);

	// Calculate summary statistics for top performers
	const topPerformerStats = useMemo(() => calculateSummaryStats(topCustomers), [topCustomers]);

	// ✅ NOW safe for early returns after all hooks
	if (!data || isDashboardInfoLoading) {
		return (
			<div className="flex justify-center items-center h-96">
				<LoadingSvg />
			</div>
		);
	}

	// Main business metrics (overall stats)
	const reportlist: IReportCard[] = [
		{
			description: "Total across all customers",
			count: data?.metrics?.customers?.changePercentage || 0,
			value: data?.metrics?.customers?.total?.toLocaleString() || "0",
			isProgressive: data?.metrics?.customers?.trend === "up",
			icon: <TotalUserIcon />,
			title: "All Customers",
		},
		{
			description: "Total business revenue",
			count: data?.metrics?.revenue?.changePercentage || 0,
			value: `₦${data?.metrics?.revenue?.total?.toLocaleString() || "0"}`,
			isProgressive: data?.metrics?.revenue?.trend === "up",
			icon: <TotalSalesIcon />,
			title: "Total Revenue",
		},
		{
			description: "Total orders processed",
			count: data?.metrics?.orders?.changePercentage || 0,
			value: data?.metrics?.orders?.total?.toLocaleString() || "0",
			isProgressive: data?.metrics?.orders?.trend === "up",
			icon: <TotalOrderIcon />,
			title: "Total Orders",
		},
		{
			description: "Total business profit",
			count: data?.metrics?.profits?.changePercentage || 0,
			value: `₦${data?.metrics?.profits?.total?.toLocaleString() || "0"}`,
			isProgressive: data?.metrics?.profits?.trend === "up",
			icon: <TotalPendingIcon />,
			title: "Total Profit",
		},
	];

	// Secondary metrics
	const reportlist1 = [
		{
			description: "Orders delivered successfully",
			count: "",
			value: data?.charts?.orderSummary?.[0]?.sales?.toString() || "0",
			isProgressive: true,
			icon: <TotalUserIcon />,
			title: "Total Delivered",
		},
		{
			description: "Orders awaiting processing",
			count: "",
			value: data?.charts?.orderSummary?.[2]?.sales?.toString() || "0",
			isProgressive: false,
			icon: <TotalOrderIcon />,
			title: "Total Pending",
		},
	];

	// Pie chart data for top customers
	const chartData = topCustomers.slice(0, 4).map((customer, index) => ({
		title: customer.email.split('@')[0],
		values: customer.totalSpent,
		fill: ["#FE964A", "#2DD4BF", "#8C62FF", "#E03137"][index % 4],
	}));

	return (
		<section>
			{/* Header */}
			<Card className="bg-white mb-8">
				<CardContent className="p-4 flex justify-between items-center">
					<Header title="Customer Reports" subtext="Comprehensive customer analytics and management." />
					<div className="flex gap-5">
						<Button
							variant={"outline"}
							className="font-bold text-base w-auto py-4 px-5 flex gap-2 items-center"
							size={"xl"}
						>
							<ExportIcon /> Download
						</Button>
						<Button
							variant={"warning"}
							className="font-bold text-base w-auto py-4 px-5"
							size={"xl"}
							onClick={() => setIsOpen(true)}
						>
							+ Add New
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* URL Display */}
			{url !== "" && (
				<div className="p-4 mb-8 bg-white rounded-lg shadow w-full max-w-md">
					<h2 className="text-lg font-semibold mb-2">Generated Link</h2>
					<div className="bg-gray-100 text-sm text-gray-700 px-3 py-2 rounded break-words w-full">
						{url}
					</div>
				</div>
			)}

			{/* Main Business Metrics */}
			<div className="mb-6">
				<h3 className="text-lg font-semibold text-gray-800 mb-4">Overall Business Metrics</h3>
				<div className="grid grid-cols-4 gap-4">
					{reportlist?.map((report: IReportCard, index) => (
						<ReportCard report={report} key={index} />
					))}
				</div>
			</div>

			{/* Order Status Metrics */}
			<div className="mb-6">
				<h3 className="text-lg font-semibold text-gray-800 mb-4">Order Status Overview</h3>
				<div className="grid grid-cols-2 gap-4">
					{reportlist1?.map((report: any, index) => (
						<ReportCard1 report={report} key={index} />
					))}
				</div>
			</div>

			Charts Section
			<div className="mb-6">
				<h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Analytics</h3>
				<div className="flex gap-4">
					<div className="flex-1">
						<MultiLineGraphComponent salesData={salesData} />
						{/* CORRECTED Line Graph Summary - uses ONLY monthly data */}

					</div>
					{/* <div className="w-[339px]">
						<PieChartComponent
							title="Top Customer Distribution"
							value={topPerformerStats.customerCount}
							chartData={chartData}
						/>
					</div> */}
				</div>
			</div>

			{/* Top Performers Section */}
			<div className="mb-6">
				<h3 className="text-lg font-semibold text-gray-800 mb-4">Top Performing Customers</h3>

				{/* Top Performers Summary */}
				<Card className="mb-4 bg-green-50">
					<CardContent className="p-4">
						<h6 className="font-semibold text-green-800 mb-3">Top Performers Summary</h6>
						<div className="grid grid-cols-4 gap-4">
							<div className="text-center">
								<p className="text-sm text-green-600">Customers</p>
								<p className="text-xl font-bold text-green-900">{topPerformerStats.customerCount}</p>
							</div>
							<div className="text-center">
								<p className="text-sm text-green-600">Total Sales</p>
								<p className="text-xl font-bold text-green-900">
									₦{topPerformerStats.totalSales.toLocaleString()}
								</p>
							</div>
							<div className="text-center">
								<p className="text-sm text-green-600">Total Orders</p>
								<p className="text-xl font-bold text-green-900">{topPerformerStats.totalOrders}</p>
							</div>
							<div className="text-center">
								<p className="text-sm text-green-600">Avg Order Value</p>
								<p className="text-xl font-bold text-green-900">
									₦{topPerformerStats.avgOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<DataTable
					customers={topCustomers}
					refetch={refetchDashboardData}
				/>
			</div>

			{/* New Customers Section */}
			<div className="mb-6">
				<h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Customer Registrations</h3>
				<RegDataTable
					customers={newCustomers}
					refetch={refetchDashboardData}
				/>
			</div>

			{/* Add Customer Dialog */}
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className="right-[30px] p-8 max-w-[35.56rem]">
					<DialogHeader>
						<DialogTitle className="mb-6 text-2xl font-bold text-[#111827] flex gap-4.5 items-center">
							<div onClick={() => setIsOpen(false)} className="cursor-pointer">
								<ChevronLeft size={24} />
							</div>
							Add New Customer
						</DialogTitle>
					</DialogHeader>
					<AddCustomer
						setUrl={setUrl}
						setClose={() => setIsOpen(false)}
						roles={safeRolesData}
					/>
				</DialogContent>
			</Dialog>
		</section>
	);
}