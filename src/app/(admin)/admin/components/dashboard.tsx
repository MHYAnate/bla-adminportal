"use client";

import { Card, CardContent } from "@/components/ui/card";
import Header from "../../components/header";
import {
  DashboardTotalCustomersIcon,
  DashboardTotalOrderIcon,
  DashboardTotalProductsIcon,
  DashboardTotalRevenueIcon,
  DowngressIcon,
  ProgressIcon,
} from "../../../../../public/icons";
import LineGraphComponent from "../../components/line-chart";
import CustomersDataTable from "./customers-datatable";
import { useGetDashboardInfo } from "@/services/dashboard";
import { formatNumber } from "@/lib/utils";
import { TopCustomersChart } from "./top-customers-chart";
import { TopProductsChart } from "./top-products";
import { TopOrdersChart } from "./total-orders";

const Dashboard: React.FC = () => {
  const {
    isDashboardInfoLoading,
    isFetchingDashboardInfo,
    dashboardData: data,
  } = useGetDashboardInfo({ enabled: true });

  return (
    <section>
      <Header
        title="Good morning, Evelyn."
        subtext="Welcome to Buylocal Admin. Manage Inventory, Store and Assign Roles. "
      />
      <Card className="mt-[26px] mb-6">
        <CardContent className="p-4 gap-4 flex">
          <div className="grid grid-cols-2 flex-1 h-full">
            <div className="p-6 bg-[#FFCEDB] flex flex-col h-full">
              <DashboardTotalRevenueIcon />
              <h1 className="mt-1 mb-3 font-bold 2xl:text-[2rem] text-[1.5rem] text-[#111827] break-words w-full">
                {data?.metrics?.revenue?.total
                  ? formatNumber(Number(data?.metrics?.revenue?.total))
                  : "0.00"}
              </h1>
              <div className="mt-auto mb-1">
                <div
                  className={`${
                    data?.metrics?.revenue?.trend.toLowerCase() !== "down"
                      ? "gap-1 bg-[#E7F7EF] rounded-[10px] items-center py-1 px-2.5 inline-flex text-[#27A376] font-bold text-xs"
                      : "gap-1 bg-[#FFEDEC] rounded-[10px] items-center py-1 px-2.5 inline-flex text-[#E03137] font-bold text-xs"
                  }`}
                >
                  {data?.metrics?.revenue?.trend.toLowerCase() === "down" ? (
                    <DowngressIcon />
                  ) : (
                    <ProgressIcon />
                  )}
                  <p>
                    {data?.metrics?.revenue?.changePercentage
                      ? formatNumber(
                          Number(data?.metrics?.revenue?.changePercentage)
                        )
                      : "0.00"}
                    %
                  </p>
                </div>
              </div>
              <p className="font-semibold text-sm text-[#111827]">
                Total Revenue
              </p>
            </div>
            <div className="p-6 bg-[#FFE2B3] flex flex-col h-full">
              <DashboardTotalProductsIcon />
              <h1 className="mt-1 mb-3 font-bold 2xl:text-[2rem] text-[1.5rem] text-[#111827] break-words w-full">
                {data?.metrics?.profits?.total
                  ? formatNumber(Number(data?.metrics?.profits?.total))
                  : "0.00"}
              </h1>
              <div className="mt-auto mb-1">
                <div
                  className={`${
                    data?.metrics?.revenue?.trend.toLowerCase() !== "down"
                      ? "gap-1 bg-[#E7F7EF] rounded-[10px] items-center py-1 px-2.5 inline-flex text-[#27A376] font-bold text-xs"
                      : "gap-1 bg-[#FFEDEC] rounded-[10px] items-center py-1 px-2.5 inline-flex text-[#E03137] font-bold text-xs"
                  }`}
                >
                  {data?.metrics?.profits?.trend.toLowerCase() === "down" ? (
                    <DowngressIcon />
                  ) : (
                    <ProgressIcon />
                  )}
                  <p>
                    {data?.metrics?.profits?.changePercentage
                      ? formatNumber(
                          Number(data?.metrics?.profits?.changePercentage)
                        )
                      : "0.00"}
                    %
                  </p>
                </div>
              </div>
              <p className="font-semibold text-sm text-[#111827]">
                Total Profits
              </p>
            </div>
            <div className="p-6 bg-[#ABFFD5] flex flex-col h-full">
              <DashboardTotalOrderIcon />
              <h1 className="mt-1 mb-3 font-bold 2xl:text-[2rem] text-[1.5rem] text-[#111827] break-words w-full">
                {data?.metrics?.orders?.total
                  ? formatNumber(Number(data?.metrics?.orders?.total))
                  : "0.00"}
              </h1>
              <div className="mt-auto mb-1">
                <div
                  className={`${
                    data?.metrics?.orders?.trend.toLowerCase() !== "down"
                      ? "gap-1 bg-[#E7F7EF] rounded-[10px] items-center py-1 px-2.5 inline-flex text-[#27A376] font-bold text-xs"
                      : "gap-1 bg-[#FFEDEC] rounded-[10px] items-center py-1 px-2.5 inline-flex text-[#E03137] font-bold text-xs"
                  }`}
                >
                  {data?.metrics?.orders?.trend.toLowerCase() === "down" ? (
                    <DowngressIcon />
                  ) : (
                    <ProgressIcon />
                  )}
                  <p>
                    {data?.metrics?.orders?.changePercentage
                      ? formatNumber(
                          Number(data?.orders?.revenue?.changePercentage)
                        )
                      : "0.00"}
                    %
                  </p>
                </div>
              </div>
              <p className="font-semibold text-sm text-[#111827]">
                Total Orders
              </p>
            </div>
            <div className="p-6 bg-[#B59BFD] flex flex-col h-full">
              <DashboardTotalCustomersIcon />
              <h1 className="mt-1 mb-3 font-bold 2xl:text-[2rem] text-[1.5rem] text-[#111827] break-words w-full">
                {data?.metrics?.customers?.total
                  ? formatNumber(Number(data?.metrics?.customers?.total))
                  : "0.00"}
              </h1>
              <div className="mt-auto mb-1">
                <div
                  className={`${
                    data?.metrics?.customers?.trend.toLowerCase() !== "down"
                      ? "gap-1 bg-[#E7F7EF] rounded-[10px] items-center py-1 px-2.5 inline-flex text-[#27A376] font-bold text-xs"
                      : "gap-1 bg-[#FFEDEC] rounded-[10px] items-center py-1 px-2.5 inline-flex text-[#E03137] font-bold text-xs"
                  }`}
                >
                  {data?.metrics?.customers?.trend.toLowerCase() === "down" ? (
                    <DowngressIcon />
                  ) : (
                    <ProgressIcon />
                  )}
                  <p>
                    {data?.metrics?.customers?.changePercentage
                      ? formatNumber(
                          Number(data?.metrics?.customers?.changePercentage)
                        )
                      : "0.00"}
                    %
                  </p>
                </div>
              </div>
              <p className="font-semibold text-sm text-[#111827]">
                Total Customers
              </p>
            </div>
          </div>
          <div className="flex-1 h-auto">
            <LineGraphComponent data={data?.charts?.salesPerformance || []} />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-6 mb-6">
        <TopOrdersChart data={data?.charts?.orderSummary || []} />
        <TopProductsChart data={data?.topPerformers?.products || []} />
        <TopCustomersChart data={data?.topPerformers?.customers || []} />
      </div>

      <CustomersDataTable
        data={data?.recentActivity?.newCustomers || []}
        loading={isDashboardInfoLoading || isDashboardInfoLoading}
      />
    </section>
  );
};

export default Dashboard;
