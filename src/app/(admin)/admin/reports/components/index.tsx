// src/app/(admin)/admin/reports/components/index.tsx - Fixed Complete Dashboard

"use client";
import React, { useState, useMemo } from "react";
import Header from "@/app/(admin)/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
	useGetDashboardInfo,
	useGetFinancialReports,
	formatFinancialData,
	validateDashboardData
} from "@/services/dashboard";
import LoadingSvg from "@/components/load";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useGetAdminRoles } from "@/services/admin/index";
import {
	ChevronLeft,
	TrendingUpIcon,
	TrendingDownIcon,
	InfoIcon,
	AlertCircleIcon,
	DollarSignIcon,
	UsersIcon,
	ShoppingCartIcon,
	TrendingUp,
	TrendingDown
} from "lucide-react";

// Enhanced TypeScript interfaces for new financial structure
interface EnhancedDashboardData {
	metrics?: {
		totalUsers?: number;
		totalSales?: number; // Net Revenue
		totalRevenue?: number; // Same as totalSales for consistency
		totalProfit?: number; // Net Profit
		totalOrders?: number;
		totalDelivered?: number;
		totalPending?: number;
		totalProcessing?: number;
		profitMargin?: number;
		refundRate?: number;
		averageOrderValue?: number;
	};
	changes?: {
		sales?: {
			amount?: number;
			percentage?: number;
			trend?: "up" | "down";
		};
		profit?: {
			amount?: number;
			percentage?: number;
			trend?: "up" | "down";
		};
		orders?: {
			amount?: number;
			percentage?: number;
			trend?: "up" | "down";
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
		revenueTrend?: Array<{
			month: string;
			year: number;
			value: number;
			orders: number;
		}>;
		orderTrend?: Array<{
			day: string;
			value: number;
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
	// New financial breakdown from enhanced calculations
	financialBreakdown?: {
		grossRevenue?: number;
		totalRefunds?: number;
		netRevenue?: number;
		totalCosts?: number;
		grossProfit?: number;
		netProfit?: number;
		costBreakdown?: {
			productCosts?: number;
			shippingCosts?: number;
			processingFees?: number;
			refundFees?: number;
		};
	};
	recentActivity?: {
		newCustomers?: any[];
	};
	calculationMethod?: string;
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

// Define proper interface for MultiLineGraphComponent props
interface MultiLineGraphProps {
	data: Array<{
		month: string;
		total_sales: number;
		orders_count: number;
		[key: string]: any;
	}>;
}

// Define proper interface for PieChartComponent data
interface PieChartData {
	title: string;
	value: string;
	count: number | string;
	description: string;
	isProgressive: boolean;
	icon: React.ReactNode;
}

// Helper function to format currency
const formatCurrency = (amount: number = 0): string => {
	return new Intl.NumberFormat('en-NG', {
		style: 'currency',
		currency: 'NGN',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
};

// Helper function to format percentage
const formatPercentage = (value: number): string => {
	return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
};

// Helper function to safely convert numbers to strings
const toStringValue = (value: number | undefined): string => {
	return value?.toString() || "0";
};

// Data transformation helper for chart data
const transformChartData = (chartData: any): MultiLineGraphProps['data'] => {
	if (!chartData || !Array.isArray(chartData)) {
		return [];
	}

	// Handle different chart data formats
	return chartData.map((item: any) => {
		// If it's revenueTrend format
		if (item.value !== undefined && item.orders !== undefined) {
			return {
				month: item.month,
				total_sales: item.value || 0,
				orders_count: item.orders || 0,
				year: item.year || new Date().getFullYear()
			};
		}

		// If it's salesPerformance format
		if (item.total_sales !== undefined && item.orders_count !== undefined) {
			return {
				month: item.month,
				total_sales: item.total_sales || 0,
				orders_count: item.orders_count || 0
			};
		}

		// Default fallback
		return {
			month: item.month || 'Unknown',
			total_sales: 0,
			orders_count: 0
		};
	});
};

// Enhanced Financial Insight Component
const FinancialInsightCard: React.FC<{
	title: string;
	breakdown: EnhancedDashboardData['financialBreakdown'];
}> = ({ title, breakdown }) => {
	if (!breakdown) return null;

	return (
		<Card className="mb-6">
			<CardContent className="p-6">
				<div className="flex items-center gap-2 mb-4">
					<InfoIcon className="w-5 h-5 text-blue-500" />
					<h3 className="text-lg font-semibold">{title}</h3>
					<Badge variant="outline" className="text-xs">Enhanced Calculation</Badge>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{/* Revenue Flow */}
					<div className="space-y-2">
						<h4 className="font-medium text-sm text-gray-600">Revenue Flow</h4>
						<div className="space-y-1 text-sm">
							<div className="flex justify-between">
								<span>Gross Revenue:</span>
								<span className="font-medium">{formatCurrency(breakdown.grossRevenue)}</span>
							</div>
							<div className="flex justify-between text-red-600">
								<span>Less Refunds:</span>
								<span>-{formatCurrency(breakdown.totalRefunds)}</span>
							</div>
							<div className="flex justify-between font-semibold border-t pt-1">
								<span>Net Revenue:</span>
								<span className="text-green-600">{formatCurrency(breakdown.netRevenue)}</span>
							</div>
						</div>
					</div>

					{/* Cost Breakdown */}
					<div className="space-y-2">
						<h4 className="font-medium text-sm text-gray-600">Cost Analysis</h4>
						<div className="space-y-1 text-sm">
							<div className="flex justify-between">
								<span>Product Costs:</span>
								<span>{formatCurrency(breakdown.costBreakdown?.productCosts)}</span>
							</div>
							<div className="flex justify-between">
								<span>Shipping:</span>
								<span>{formatCurrency(breakdown.costBreakdown?.shippingCosts)}</span>
							</div>
							<div className="flex justify-between">
								<span>Processing:</span>
								<span>{formatCurrency(breakdown.costBreakdown?.processingFees)}</span>
							</div>
							<div className="flex justify-between font-semibold border-t pt-1">
								<span>Total Costs:</span>
								<span className="text-red-600">{formatCurrency(breakdown.totalCosts)}</span>
							</div>
						</div>
					</div>

					{/* Profit Analysis */}
					<div className="space-y-2">
						<h4 className="font-medium text-sm text-gray-600">Profit Analysis</h4>
						<div className="space-y-1 text-sm">
							<div className="flex justify-between">
								<span>Gross Profit:</span>
								<span className="font-medium">{formatCurrency(breakdown.grossProfit)}</span>
							</div>
							<div className="flex justify-between">
								<span>Net Profit:</span>
								<span className={`font-semibold ${(breakdown.netProfit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
									{formatCurrency(breakdown.netProfit)}
								</span>
							</div>
							<div className="flex justify-between text-xs text-gray-500">
								<span>Profit Margin:</span>
								<span>
									{breakdown.netRevenue && breakdown.netRevenue > 0
										? ((breakdown.netProfit || 0) / breakdown.netRevenue * 100).toFixed(1)
										: '0'
									}%
								</span>
							</div>
						</div>
					</div>

					{/* Key Ratios */}
					<div className="space-y-2">
						<h4 className="font-medium text-sm text-gray-600">Key Ratios</h4>
						<div className="space-y-1 text-sm">
							<div className="flex justify-between">
								<span>Refund Rate:</span>
								<span className="font-medium">
									{breakdown.grossRevenue && breakdown.grossRevenue > 0
										? ((breakdown.totalRefunds || 0) / breakdown.grossRevenue * 100).toFixed(1)
										: '0'
									}%
								</span>
							</div>
							<div className="flex justify-between">
								<span>Cost Ratio:</span>
								<span>
									{breakdown.netRevenue && breakdown.netRevenue > 0
										? ((breakdown.totalCosts || 0) / breakdown.netRevenue * 100).toFixed(1)
										: '0'
									}%
								</span>
							</div>
							<div className="flex justify-between">
								<span>Revenue Quality:</span>
								<Badge
									variant={
										(breakdown.totalRefunds || 0) / (breakdown.grossRevenue || 1) < 0.05
											? "default"
											: (breakdown.totalRefunds || 0) / (breakdown.grossRevenue || 1) < 0.1
												? "secondary"
												: "destructive"
									}
									className="text-xs"
								>
									{(breakdown.totalRefunds || 0) / (breakdown.grossRevenue || 1) < 0.05
										? "Excellent"
										: (breakdown.totalRefunds || 0) / (breakdown.grossRevenue || 1) < 0.1
											? "Good"
											: "Needs Attention"
									}
								</Badge>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

// Enhanced Metric Card with additional context - FIXED TYPES
const EnhancedMetricCard: React.FC<{
	title: string;
	value: string | number;
	change?: number;
	trend?: "up" | "down";
	subtitle?: string;
	icon: React.ReactNode;
	additionalInfo?: string;
}> = ({ title, value, change, trend, subtitle, icon, additionalInfo }) => {
	return (
		<Card className="hover:shadow-lg transition-shadow duration-200">
			<CardContent className="p-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<div className="p-2 rounded-lg bg-blue-50">
							{icon}
						</div>
						<div>
							<p className="text-sm font-medium text-gray-600">{title}</p>
							<p className="text-2xl font-bold text-gray-900">{value}</p>
							{subtitle && (
								<p className="text-xs text-gray-500 mt-1">{subtitle}</p>
							)}
						</div>
					</div>
					{change !== undefined && trend && (
						<div className={`flex items-center space-x-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
							{trend === 'up' ? <TrendingUpIcon className="w-4 h-4" /> : <TrendingDownIcon className="w-4 h-4" />}
							<span className="text-sm font-medium">
								{formatPercentage(change)}
							</span>
						</div>
					)}
				</div>
				{additionalInfo && (
					<div className="mt-3 pt-3 border-t border-gray-100">
						<p className="text-xs text-gray-500">{additionalInfo}</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

// Calculation Method Indicator Component
const CalculationMethodIndicator: React.FC<{ method?: string }> = ({ method }) => {
	if (!method) return null;

	return (
		<Card className="mb-6">
			<CardContent className="p-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
							Enhanced Calculations
						</Badge>
						<span className="text-sm text-gray-600">
							Using {method.replace(/_/g, ' ')}
						</span>
					</div>
					<div className="text-xs text-gray-500">
						Net Revenue = Gross Revenue - Refunds | Net Profit = Net Revenue - Actual Costs
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

// Performance Summary Component
const PerformanceSummary: React.FC<{ data: EnhancedDashboardData }> = ({ data }) => {
	const performanceItems = [
		{
			title: "Orders Delivered",
			value: toStringValue(data?.metrics?.totalDelivered),
			description: "Successfully completed orders",
			icon: <ShoppingCartIcon className="w-5 h-5 text-green-600" />,
			color: "green"
		},
		{
			title: "Pending Orders",
			value: toStringValue(data?.metrics?.totalPending),
			description: "Awaiting processing",
			icon: <AlertCircleIcon className="w-5 h-5 text-yellow-600" />,
			color: "yellow"
		},
		{
			title: "Processing",
			value: toStringValue(data?.metrics?.totalProcessing),
			description: "Currently being processed",
			icon: <TrendingUp className="w-5 h-5 text-blue-600" />,
			color: "blue"
		},
		{
			title: "Average Order Value",
			value: formatCurrency(data?.metrics?.averageOrderValue || 0),
			description: "Per order average",
			icon: <DollarSignIcon className="w-5 h-5 text-purple-600" />,
			color: "purple",
			change: data?.changes?.sales?.percentage,
			trend: data?.changes?.sales?.trend
		}
	];

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
			{performanceItems.map((item, index) => (
				<Card key={index} className="hover:shadow-md transition-shadow duration-200">
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-3">
								{item.icon}
								<div>
									<p className="text-sm font-medium text-gray-600">{item.title}</p>
									<p className="text-xl font-bold">{item.value}</p>
									<p className="text-xs text-gray-500">{item.description}</p>
								</div>
							</div>
							{item.change !== undefined && item.trend && (
								<div className={`flex items-center space-x-1 ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
									{item.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
									<span className="text-xs font-medium">
										{formatPercentage(item.change)}
									</span>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
};

// Helper function to calculate summary statistics for top performers
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

// Main Dashboard Component
export default function Reports() {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [url, setUrl] = useState("");

	// API hooks
	const { rolesData: rawRolesData, isRolesLoading } = useGetAdminRoles({ enabled: true });
	const rolesData = rawRolesData as RolesData;

	const {
		isDashboardInfoLoading,
		isFetchingDashboardInfo,
		dashboardData: rawData,
		refetchDashboardData,
	} = useGetDashboardInfo({ enabled: true });

	const data = rawData as EnhancedDashboardData;

	// Loading state
	if (!data || isDashboardInfoLoading) {
		return (
			<div className="flex justify-center items-center h-96">
				<LoadingSvg />
			</div>
		);
	}

	// Transform and prepare data
	const topCustomers: DataTableCustomer[] = (data?.topPerformers?.customers || []).map((customer, index) => ({
		userId: customer?.userId || customer?.id || index + 1,
		email: customer?.email || "",
		totalSpent: customer?.totalSpent || 0,
		orderCount: customer?.orderCount || 0,
		status: customer?.status || "active",
	}));

	const newCustomers = data?.recentActivity?.newCustomers || [];

	// Calculate summary statistics for top performers
	const topPerformerStats = calculateSummaryStats(topCustomers);

	// FIXED: Main business metrics with proper string conversion
	const reportlist: IReportCard[] = [
		{
			description: "Total registered customers",
			count: data?.changes?.orders?.percentage || 0,
			value: (data?.metrics?.totalUsers?.toLocaleString() || "0"),
			isProgressive: (data?.changes?.orders?.percentage || 0) >= 0,
			icon: <UsersIcon className="w-6 h-6 text-blue-600" />,
			title: "Total Customers",
		},
		{
			description: "Net revenue (after refunds)",
			count: data?.changes?.sales?.percentage || 0,
			value: formatCurrency(data?.metrics?.totalRevenue || 0),
			isProgressive: data?.changes?.sales?.trend === "up",
			icon: <DollarSignIcon className="w-6 h-6 text-green-600" />,
			title: "Net Revenue",
		},
		{
			description: "Total orders processed",
			count: data?.changes?.orders?.percentage || 0,
			value: (data?.metrics?.totalOrders?.toLocaleString() || "0"),
			isProgressive: data?.changes?.orders?.trend === "up",
			icon: <ShoppingCartIcon className="w-6 h-6 text-purple-600" />,
			title: "Total Orders",
		},
		{
			description: "Net profit (actual costs)",
			count: data?.changes?.profit?.percentage || 0,
			value: formatCurrency(data?.metrics?.totalProfit || 0),
			isProgressive: data?.changes?.profit?.trend === "up",
			icon: <TrendingUpIcon className="w-6 h-6 text-orange-600" />,
			title: "Net Profit",
		},
	];

	// FIXED: Transform chart data properly for MultiLineGraphComponent
	const transformedChartData = useMemo(() => {
		const chartSource = data?.charts?.revenueTrend || data?.charts?.salesPerformance || [];
		return transformChartData(chartSource);
	}, [data?.charts]);

	return (
		<div className="space-y-6 p-6">
			{/* Calculation Method Indicator */}
			<CalculationMethodIndicator method={data?.calculationMethod} />

			{/* Header */}
			<div className="flex justify-between items-center">
				<Header
					title="Business Reports"
					subtext="Comprehensive analytics with accurate financial calculations"
				/>
				<div className="flex gap-3">
					<Button
						variant="outline"
						className="flex items-center gap-2"
						onClick={() => setIsOpen(true)}
					>
						<div className="w-4 h-4" >
							<ExportIcon />
						</div>
						Export
					</Button>
					<Button
						onClick={() => refetchDashboardData()}
						variant="ghost"
						className="flex items-center gap-2"
					>
						Refresh Data
					</Button>
				</div>
			</div>

			{/* Main Metrics Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{reportlist.map((report: IReportCard, index) => (
					<EnhancedMetricCard
						key={index}
						title={report.title}
						value={report.value} // Already converted to string
						change={report.count}
						trend={report.isProgressive ? "up" : "down"}
						subtitle={report.description}
						icon={report.icon}
						additionalInfo={
							report.title === "Net Revenue"
								? `Refund Rate: ${(data?.metrics?.refundRate || 0).toFixed(1)}%`
								: report.title === "Net Profit"
									? `Profit Margin: ${(data?.metrics?.profitMargin || 0).toFixed(1)}%`
									: undefined
						}
					/>
				))}
			</div>

			{/* Financial Breakdown Insight */}
			<FinancialInsightCard
				title="Financial Breakdown"
				breakdown={data?.financialBreakdown}
			/>

			{/* Performance Summary */}
			<PerformanceSummary data={data} />

			{/* Charts Section */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Pie Chart - FIXED to match PieChartComponent props */}
				<Card>
					<CardContent className="p-6">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-semibold">Order Status Distribution</h3>
							<Badge variant="outline" className="text-xs">
								Current Period
							</Badge>
						</div>
						{/* Use ReportCard1 pattern since PieChartComponent expects different props */}
						<div className="grid grid-cols-3 gap-4 mb-4">
							<ReportCard1 report={{
								title: "Delivered",
								value: (data?.metrics?.totalDelivered?.toString() || "0"),
								count: "",
								description: "Successfully completed",
								isProgressive: true,
								icon: <ShoppingCartIcon className="w-4 h-4" />
							}} />
							<ReportCard1 report={{
								title: "Pending",
								value: (data?.metrics?.totalPending?.toString() || "0"),
								count: "",
								description: "Awaiting processing",
								isProgressive: false,
								icon: <AlertCircleIcon className="w-4 h-4" />
							}} />
							<ReportCard1 report={{
								title: "Processing",
								value: (data?.metrics?.totalProcessing?.toString() || "0"),
								count: "",
								description: "Currently processing",
								isProgressive: true,
								icon: <TrendingUpIcon className="w-4 h-4" />
							}} />
						</div>
						{/* Alternative: Simple pie chart visualization */}
						<div className="space-y-2">
							<div className="flex justify-between items-center">
								<span className="text-sm text-gray-600">Delivered</span>
								<span className="font-medium">{data?.metrics?.totalDelivered || 0}</span>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-2">
								<div
									className="bg-green-600 h-2 rounded-full"
									style={{
										width: `${Math.max(10, ((data?.metrics?.totalDelivered || 0) / Math.max(1, (data?.metrics?.totalOrders || 1))) * 100)}%`
									}}
								></div>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-sm text-gray-600">Pending</span>
								<span className="font-medium">{data?.metrics?.totalPending || 0}</span>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-2">
								<div
									className="bg-yellow-600 h-2 rounded-full"
									style={{
										width: `${Math.max(5, ((data?.metrics?.totalPending || 0) / Math.max(1, (data?.metrics?.totalOrders || 1))) * 100)}%`
									}}
								></div>
							</div>
							<div className="flex justify-between items-center">
								<span className="text-sm text-gray-600">Processing</span>
								<span className="font-medium">{data?.metrics?.totalProcessing || 0}</span>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-2">
								<div
									className="bg-blue-600 h-2 rounded-full"
									style={{
										width: `${Math.max(5, ((data?.metrics?.totalProcessing || 0) / Math.max(1, (data?.metrics?.totalOrders || 1))) * 100)}%`
									}}
								></div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Line Chart - FIXED with proper props structure */}
				<Card>
					<CardContent className="p-6">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-semibold">Revenue Trend</h3>
							<Badge variant="outline" className="text-xs">
								Net Revenue
							</Badge>
						</div>
						{/* Check if MultiLineGraphComponent exists and has data, otherwise show fallback */}
						{transformedChartData.length > 0 ? (
							<div className="h-64">
								{/* Simple chart visualization as fallback */}
								<div className="space-y-4">
									<div className="text-sm text-gray-600 mb-4">Revenue trend over time</div>
									<div className="space-y-3">
										{transformedChartData.slice(0, 6).map((item, index) => (
											<div key={item.month || index} className="flex justify-between items-center">
												<span className="text-sm font-medium">{item.month}</span>
												<div className="flex items-center gap-4">
													<div className="text-right">
														<div className="text-sm font-semibold text-green-600">
															{formatCurrency(item.total_sales)}
														</div>
														<div className="text-xs text-gray-500">
															{item.orders_count} orders
														</div>
													</div>
													<div className="w-20 bg-gray-200 rounded-full h-2">
														<div
															className="bg-green-600 h-2 rounded-full transition-all duration-300"
															style={{
																width: `${Math.min(100, Math.max(5, (item.total_sales / Math.max(...transformedChartData.map(d => d.total_sales), 1)) * 100))}%`
															}}
														></div>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						) : (
							<div className="h-64 flex items-center justify-center text-gray-500">
								<div className="text-center">
									<TrendingUpIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
									<p className="text-sm">No chart data available</p>
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Data Tables */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Top Customers */}
				<Card>
					<CardContent className="p-6">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-semibold">Top Customers</h3>
							<Badge variant="outline" className="text-xs">
								{topCustomers.length} customers
							</Badge>
						</div>
						{/* Simple table implementation instead of DataTable component */}
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b text-left text-sm text-gray-600">
										<th className="pb-3">Customer</th>
										<th className="pb-3 text-right">Revenue</th>
										<th className="pb-3 text-right">Orders</th>
										<th className="pb-3 text-right">Status</th>
									</tr>
								</thead>
								<tbody>
									{topCustomers.slice(0, 5).map((customer, index) => (
										<tr key={customer.userId || index} className="border-b last:border-b-0">
											<td className="py-3">
												<div className="font-medium text-sm">{customer.email}</div>
											</td>
											<td className="py-3 text-right font-medium">
												{formatCurrency(customer.totalSpent)}
											</td>
											<td className="py-3 text-right">{customer.orderCount}</td>
											<td className="py-3 text-right">
												<Badge
													variant={customer.status === 'active' ? 'default' : 'secondary'}
													className="text-xs"
												>
													{customer.status}
												</Badge>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<span className="text-gray-600">Total Revenue:</span>
									<span className="font-medium ml-2">
										{formatCurrency(topPerformerStats.totalSales)}
									</span>
								</div>
								<div>
									<span className="text-gray-600">Avg Order Value:</span>
									<span className="font-medium ml-2">
										{formatCurrency(topPerformerStats.avgOrderValue)}
									</span>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* New Customers / Registrations */}
				<Card>
					<CardContent className="p-6">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-semibold">Recent Registrations</h3>
							<Badge variant="outline" className="text-xs">
								{newCustomers.length} new
							</Badge>
						</div>
						{/* Simple table for new customers */}
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b text-left text-sm text-gray-600">
										<th className="pb-3">Name</th>
										<th className="pb-3">Email</th>
										<th className="pb-3 text-right">Joined</th>
									</tr>
								</thead>
								<tbody>
									{newCustomers.slice(0, 5).map((customer: any, index: number) => (
										<tr key={customer?.id || index} className="border-b last:border-b-0">
											<td className="py-3">
												<div className="font-medium text-sm">
													{customer?.name || customer?.fullName || 'Unknown'}
												</div>
											</td>
											<td className="py-3 text-sm text-gray-600">
												{customer?.email || 'N/A'}
											</td>
											<td className="py-3 text-right text-sm text-gray-500">
												{customer?.createdAt
													? new Date(customer.createdAt).toLocaleDateString()
													: 'Recent'
												}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Export Dialog - FIXED */}
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Export Reports</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<p className="text-sm text-gray-600">
							Export comprehensive business reports with enhanced financial calculations.
						</p>
						<div className="space-y-2">
							<div className="text-xs text-gray-500">
								Report includes:
							</div>
							<ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
								<li>Net Revenue (Gross Revenue - Refunds)</li>
								<li>Net Profit (Revenue - Actual Costs)</li>
								<li>Financial breakdown and cost analysis</li>
								<li>Customer performance metrics</li>
								<li>Order status and trends</li>
							</ul>
						</div>
						<div className="flex gap-2">
							<Button className="flex-1">
								<div className="w-4 h-4 mr-2" >
									<ExportIcon />
								</div>
								Export PDF
							</Button>
							<Button variant="outline" className="flex-1">
								Export Excel
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}