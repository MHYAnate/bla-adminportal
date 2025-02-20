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
import { PieActiveComponent } from "../../components/pie-chart-active";
import { PieChartComponent } from "../../components/pie-chart";
import CustomersDataTable from "./customers-datatable";

const Dashboard: React.FC = () => {
  const chartData = [
    { title: "Rice", values: 275, fill: "#FE964A" },
    { title: "Beans", values: 200, fill: "#2DD4BF" },
    { title: "Garri", values: 187, fill: "#8C62FF" },
  ];
  return (
    <section>
      <Header
        title="Good morning, Evelyn."
        subtext="Welcome to Buylocal Admin. Manage Inventory, Store and Assign Roles. "
      />
      <Card className="mt-[26px] mb-6">
        <CardContent className="p-4 gap-4 flex">
          <div className="grid grid-cols-2 flex-1">
            <div className="p-6 bg-[#FFCEDB]">
              <DashboardTotalRevenueIcon />
              <div className="my-4 flex justify-between mb-4 items-center">
                <h1 className="font-bold text-[2rem] text-[#111827]">1,123</h1>
                <div>
                  <div className="gap-1 bg-[#E7F7EF] rounded-[10px] items-center py-1 px-2.5 inline-flex text-[#27A376] font-bold text-xs">
                    <ProgressIcon /> <p>+4,10%</p>
                  </div>
                </div>
              </div>
              <p className="font-semibold text-sm text-[#111827]">
                Total Revenue
              </p>
            </div>
            <div className="p-6 bg-[#FFE2B3]">
              <DashboardTotalProductsIcon />
              <div className="my-4 flex justify-between mb-4 items-center">
                <h1 className="font-bold text-[2rem] text-[#111827]">1,123</h1>
                <div>
                  <div className="gap-1 bg-[#E7F7EF] rounded-[10px] items-center py-1 px-2.5 inline-flex text-[#27A376] font-bold text-xs">
                    <ProgressIcon /> <p>+4,10%</p>
                  </div>
                </div>
              </div>
              <p className="font-semibold text-sm text-[#111827]">
                Total Products
              </p>
            </div>
            <div className="p-6 bg-[#ABFFD5]">
              <DashboardTotalOrderIcon />
              <div className="my-4 flex justify-between mb-4 items-center">
                <h1 className="font-bold text-[2rem] text-[#111827]">1,123</h1>
                <div>
                  <div className="gap-1 bg-[#E7F7EF] rounded-[10px] items-center py-1 px-2.5 inline-flex text-[#27A376] font-bold text-xs">
                    <ProgressIcon /> <p>+4,10%</p>
                  </div>
                </div>
              </div>
              <p className="font-semibold text-sm text-[#111827]">
                Total Orders
              </p>
            </div>
            <div className="p-6 bg-[#B59BFD]">
              <DashboardTotalCustomersIcon />
              <div className="my-4 flex justify-between mb-4 items-center">
                <h1 className="font-bold text-[2rem] text-[#111827]">1,123</h1>
                <div>
                  <div className="gap-1 bg-[#FFEDEC] rounded-[10px] items-center py-1 px-2.5 inline-flex text-[#E03137] font-bold text-xs">
                    <DowngressIcon /> <p>+4,10%</p>
                  </div>
                </div>
              </div>
              <p className="font-semibold text-sm text-[#111827]">
                Total Customers
              </p>
            </div>
          </div>
          <div className="flex-1">
            <LineGraphComponent />
          </div>
        </CardContent>
      </Card>
      <div className="flex gap-4">
        <CustomersDataTable />
        <div className="w-[339px]">
          <PieActiveComponent />
          <PieChartComponent
            title="Total Sales"
            value={121}
            chartData={chartData}
          />
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
