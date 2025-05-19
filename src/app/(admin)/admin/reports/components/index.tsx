"use client";
import React, { useState } from "react";
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

export default function Reports() {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [url, setUrl] = useState("");
	const { rolesData, isRolesLoading } = useGetAdminRoles({ enabled: true });
	const safeRolesData = Array.isArray(rolesData.data) ? rolesData.data : [];
	const {
		isDashboardInfoLoading,
		isFetchingDashboardInfo,
		dashboardData: data,
		refetchDashboardData,
	} = useGetDashboardInfo({ enabled: true });

	if (!data || isDashboardInfoLoading)
		return (
			<div className="flex justify-center items-center">
				<LoadingSvg />
			</div>
		);
	console.log(data, "datafull");

	const reportlist = [
		{
			description: "From previous month",
			count: data?.metrics?.customers?.changePercentage,
			value: data?.metrics?.customers?.total?.toLocaleString(),
			isProgressive: data?.metrics?.customers?.trend === "up",
			icon: <TotalUserIcon />,
			title: "Total Customers",
		},
		{
			description: "From previous month",
			count: data?.metrics?.revenue?.changePercentage,
			value: `NGN${data?.metrics?.revenue?.total?.toLocaleString()}`,
			isProgressive: data?.metrics?.revenue?.trend === "up",
			icon: <TotalSalesIcon />,
			title: "Total Sales",
		},
		{
			description: "From previous month",
			count: data?.metrics?.orders?.changePercentage,
			value: data?.metrics?.orders?.total?.toLocaleString(),
			isProgressive: data?.metrics?.orders?.trend === "up",
			icon: <TotalOrderIcon />,
			title: "Total Order",
		},
		{
			description: "From previous month",
			count: data?.metrics?.profits?.changePercentage,
			value: `NGN${data?.metrics?.profits?.total?.toLocaleString()}`,
			isProgressive: data?.metrics?.profits?.trend === "up",
			icon: <TotalPendingIcon />,
			title: "Total Profit",
		},
	];

	const reportlist1 = [
		{
			description: "From previous month",
			count: "",
			value: "",
			isProgressive: data?.metrics?.customers?.trend === "up",
			icon: <TotalUserIcon />,
			title: "Total Delivered",
		},
		{
			description: "From previous month",
			// count: data.metrics.orders.changePercentage,
			value: data?.charts?.orderSummary[2]?.sales,
			isProgressive: data?.metrics?.revenue?.trend === "up",
			icon: <TotalOrderIcon />,
			title: "Total Pending",
		},
	];

	const chartData = data?.topPerformers?.customers?.map(
		(customer: { email: any; totalSpent: any }, index: number) => ({
			title: customer?.email,
			values: customer?.totalSpent,
			fill: ["#FE964A", "#2DD4BF", "#8C62FF", "#8C62FF"][index % 4],
		})
	);



	return (
		<section>
			<Card className="bg-white mb-8">
				<CardContent className="p-4 flex justify-between items-center">
					<Header title="Customer Reports" subtext="Manage customers." />
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
			{url !== "" && (
				<div className="p-4 mb-8 bg-white rounded-lg shadow w-full max-w-md">
					<h2 className="text-lg font-semibold mb-2">Copy Link</h2>
					<div className="bg-gray-100 text-sm text-gray-700 px-3 py-2 rounded break-words w-full">
						{url}
					</div>
				</div>
			)}

			<div className="grid grid-cols-4 gap-4 mb-6">
				{reportlist?.map((report: IReportCard, index) => (
					<ReportCard report={report} key={index} />
				))}
			</div>
			<div className="grid grid-cols-2 gap-4 mb-6">
				{reportlist1?.map((report: any, index) => (
					<ReportCard1 report={report} key={index} />
				))}
			</div>

			<div className="flex gap-4 mb-6">
				<MultiLineGraphComponent salesData={data?.charts?.salesPerformance} />
				<div className="w-[339px]">
					<PieChartComponent
						title="Total Customers"
						value={data?.metrics?.customers?.total}
						chartData={chartData}
					/>
				</div>
			</div>
			<DataTable
				customers={data?.topPerformers?.customers}
				refetch={refetchDashboardData}
			/>
			<div className="mt-5 mb-5" />
			<RegDataTable
				customers={data?.recentActivity?.newCustomers}
				refetch={refetchDashboardData}
			/>
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
