"use client";

import Header from "@/app/(admin)/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExportIcon } from "../../../../../../public/icons";
import FinancialReportCard from "@/components/widgets/financial-report-card";
import { IFinancialReportCard } from "@/types";
import LineGraphComponent from "@/app/(admin)/components/line-chart";
import {
	useGetDashboardReports,
	useGetFinancialReports,
} from "@/services/reports";
import RevenueChart from "./chart";
import { useGetDashboardInfo } from "@/services/dashboard";

import { DowngressIcon, ProgressIcon } from "../../../../../../public/icons";
import SinglePieComponent from "@/app/(admin)/components/single-pie";
import DashboardMetricCard from "./finChart";
import LoadingSvg from "@/components/load";
import FinDataTable from "./table";
import CustomerAnalyticsTable from "./table";
import CustomerTable from "./table";

// Import the proper types from your types file
import { DashboardData as ImportedDashboardData } from "@/types";

// Define local Customer interface since it's not exported from types
interface Customer {
	name: string;
	email: string;
	type: "individual" | "business";
	totalSpent: number;
}

// Define local interfaces for the raw API data
interface ApiDashboardData {
	metrics?: {
		revenue?: {
			total?: number;
			currentMonth?: number;
			previousMonth?: number;
			changePercentage?: number;
			trend?: string;
		};
		orders?: {
			total?: number;
			currentMonth?: number;
			previousMonth?: number;
			changePercentage?: number;
			trend?: string;
		};
		profits?: {
			total?: number;
			currentMonth?: number;
			previousMonth?: number;
			changePercentage?: number;
			trend?: string;
		};
		customers?: {
			total?: number;
			currentMonth?: number;
			previousMonth?: number;
			changePercentage?: number;
			trend?: string;
		};
	};
	charts?: {
		orderSummary?: any[];
		salesPerformance?: any[];
		[key: string]: any;
	};
	topPerformers?: {
		customers?: Array<{
			name?: string;
			email?: string;
			type?: string;
			totalSpent?: number;
			[key: string]: any;
		}>;
	};
	lastUpdated?: string;
}

const FinancialReport: React.FC = () => {

	const { reportsData, totalSales, averageAOV, refetch } = useGetFinancialReports({});

	// Access data
	const { dashboardData, isFetchingDashboard, error, refreshDashboard } =
		useGetDashboardReports({
			filter: {
				// Can add time filters if backend supports them
				// timeframe: 'last6months'
			},
		});

	const {
		isDashboardInfoLoading,
		isFetchingDashboardInfo,
		dashboardData: rawData,
		refetchDashboardData,
	} = useGetDashboardInfo({ enabled: true });

	// Type assertion for dashboard data
	const apiData = rawData as ApiDashboardData;

	console.log("report data", apiData?.topPerformers?.customers, "dashboard data", dashboardData);

	const reportlist = [
		{
			description: "Up from yesterday",
			count: 8.5,
			value: "40,689",
			isProgressive: true,
			title: "Total Users",
		},
		{
			description: "Up from yesterday",
			count: 8.5,
			value: "891,000",
			isProgressive: false,
			title: "Total Sales",
		},
		{
			description: "Up from yesterday",
			count: 8.5,
			value: 10293,
			isProgressive: true,
			title: "Total Order",
		},
	];

	// Helper function to calculate previous month from current and percentage
	const calculatePreviousMonth = (current: number, changePercentage: number): number => {
		if (changePercentage === 0) return current;
		const multiplier = 1 + (changePercentage / 100);
		return Math.round(current / multiplier);
	};

	// Helper function to normalize customer type
	const normalizeCustomerType = (type?: string): "individual" | "business" => {
		if (!type) return "individual";
		const lowerType = type.toLowerCase();
		if (lowerType.includes("business") || lowerType.includes("company") || lowerType.includes("corp")) {
			return "business";
		}
		return "individual";
	};

	// Transform API customers data to match Customer interface
	const transformedCustomers: Customer[] = (apiData?.topPerformers?.customers || []).map((customer, index) => ({
		name: customer?.name || customer?.email?.split('@')[0] || `Customer ${index + 1}`,
		email: customer?.email || `customer${index + 1}@example.com`,
		type: normalizeCustomerType(customer?.type),
		totalSpent: customer?.totalSpent || 0,
	}));

	// Transform API data to match the RevenueChart component expectations
	const transformedData: ImportedDashboardData = {
		metrics: {
			customers: {
				total: apiData?.metrics?.customers?.total || apiData?.metrics?.customers?.currentMonth || 0,
				currentMonth: apiData?.metrics?.customers?.currentMonth || 0,
				previousMonth: apiData?.metrics?.customers?.previousMonth ||
					calculatePreviousMonth(
						apiData?.metrics?.customers?.currentMonth || 0,
						apiData?.metrics?.customers?.changePercentage || 0
					),
				changePercentage: apiData?.metrics?.customers?.changePercentage || 0,
				trend: (apiData?.metrics?.customers?.trend as "up" | "down") || "up",
			},
			orders: {
				total: apiData?.metrics?.orders?.total || apiData?.metrics?.orders?.currentMonth || 0,
				currentMonth: apiData?.metrics?.orders?.currentMonth || 0,
				previousMonth: apiData?.metrics?.orders?.previousMonth ||
					calculatePreviousMonth(
						apiData?.metrics?.orders?.currentMonth || 0,
						apiData?.metrics?.orders?.changePercentage || 0
					),
				changePercentage: apiData?.metrics?.orders?.changePercentage || 0,
				trend: (apiData?.metrics?.orders?.trend as "up" | "down") || "up",
			},
			profits: {
				total: apiData?.metrics?.profits?.total || apiData?.metrics?.profits?.currentMonth || 0,
				currentMonth: apiData?.metrics?.profits?.currentMonth || 0,
				previousMonth: apiData?.metrics?.profits?.previousMonth ||
					calculatePreviousMonth(
						apiData?.metrics?.profits?.currentMonth || 0,
						apiData?.metrics?.profits?.changePercentage || 0
					),
				changePercentage: apiData?.metrics?.profits?.changePercentage || 0,
				trend: (apiData?.metrics?.profits?.trend as "up" | "down") || "up",
			},
			revenue: {
				total: apiData?.metrics?.revenue?.total || apiData?.metrics?.revenue?.currentMonth || 0,
				currentMonth: apiData?.metrics?.revenue?.currentMonth || 0,
				previousMonth: apiData?.metrics?.revenue?.previousMonth ||
					calculatePreviousMonth(
						apiData?.metrics?.revenue?.currentMonth || 0,
						apiData?.metrics?.revenue?.changePercentage || 0
					),
				changePercentage: apiData?.metrics?.revenue?.changePercentage || 0,
				trend: (apiData?.metrics?.revenue?.trend as "up" | "down") || "up",
			},
		},
		charts: {
			orderSummary: apiData?.charts?.orderSummary || [],
			salesPerformance: apiData?.charts?.salesPerformance || [],
		},
		lastUpdated: apiData?.lastUpdated || new Date().toISOString(),
	};

	// Safe values for DashboardMetricCard props
	const revenueValue: number = apiData?.metrics?.revenue?.currentMonth || 0;
	const revenueChangePercentage: number = apiData?.metrics?.revenue?.changePercentage || 0;
	const revenueTrend: "up" | "down" = (apiData?.metrics?.revenue?.trend === "down") ? "down" : "up";

	const ordersValue: number = apiData?.metrics?.orders?.currentMonth || 0;
	const ordersChangePercentage: number = apiData?.metrics?.orders?.changePercentage || 0;
	const ordersTrend: "up" | "down" = (apiData?.metrics?.orders?.trend === "down") ? "down" : "up";

	const profitsValue: number = apiData?.metrics?.profits?.currentMonth || 0;
	const profitsChangePercentage: number = apiData?.metrics?.profits?.changePercentage || 0;
	const profitsTrend: "up" | "down" = (apiData?.metrics?.profits?.trend === "down") ? "down" : "up";

	return (
		<div>
			{isFetchingDashboard ? (
				<LoadingSvg />
			) : (
				<Card className="bg-white">
					<CardContent className="p-6">
						<div className="flex justify-between mb-6">
							<Header title="Financial Reports" subtext="Manage finances." />
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
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-fit mx-auto mb-6">
							{/* {reportlist.map((report: IFinancialReportCard, index) => (
								<FinancialReportCard report={report} key={index} />
							))} */}

							<DashboardMetricCard
								title="Total Revenue"
								value={revenueValue}
								changePercentage={revenueChangePercentage}
								trend={revenueTrend}
								isCurrency
							/>

							<DashboardMetricCard
								title="Monthly Orders"
								value={ordersValue}
								changePercentage={ordersChangePercentage}
								trend={ordersTrend}
							/>

							<DashboardMetricCard
								title="Total Profit"
								value={profitsValue}
								changePercentage={profitsChangePercentage}
								trend={profitsTrend}
								isCurrency
							/>
						</div>

						<RevenueChart data={transformedData} />
						<div className="mt-10 mb-10" />
						<CustomerTable
							data={transformedCustomers}
							refetch={refetch}
						/>
					</CardContent>
				</Card>
			)}
		</div>
	);
};

export default FinancialReport;