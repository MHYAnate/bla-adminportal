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

import { DowngressIcon, ProgressIcon } from "../../../../../../public/icons";
import SinglePieComponent from "@/app/(admin)/components/single-pie";
import DashboardMetricCard from "./finChart";
import LoadingSvg from "@/components/load";
import FinDataTable from "./table";
import CustomerAnalyticsTable from "./table";
import CustomerTable from "./table";

const FinancialReport: React.FC = () => {

	const { reportsData, totalSales, averageAOV,refetch } = useGetFinancialReports({});

	// Access data

	const { dashboardData, isFetchingDashboard, error, refreshDashboard } =
		useGetDashboardReports({
			filter: {
				// Can add time filters if backend supports them
				// timeframe: 'last6months'
			},
		});

	console.log("report data", reportsData, "dashboard data", dashboardData);

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
	return (
		<div>
      {isFetchingDashboard?<LoadingSvg/>:<Card className="bg-white">
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
								value={dashboardData?.metrics?.revenue.currentMonth}
								changePercentage={
									dashboardData?.metrics?.revenue.changePercentage
								}
								trend={dashboardData.metrics.revenue.trend}
								isCurrency
							/>

							<DashboardMetricCard
								title="Monthly Orders"
								value={dashboardData?.metrics?.orders?.currentMonth}
								changePercentage={
									dashboardData?.metrics?.orders?.changePercentage
								}
								trend={dashboardData?.metrics?.orders?.trend}
							/>
							

							<DashboardMetricCard
								title="Total Profit"
								value={dashboardData.metrics.profits.currentMonth}
								changePercentage={
									dashboardData.metrics.profits.changePercentage
								}
								trend={dashboardData.metrics.profits.trend}
								isCurrency
							/>
              
						</div>
					
					<RevenueChart data={dashboardData} />
      <div className="mt-10 mb-10"/>
          <CustomerTable data={reportsData.data} refetch={refetch} />
				</CardContent>
			</Card>}
			
		</div>
	);
};

export default FinancialReport;
