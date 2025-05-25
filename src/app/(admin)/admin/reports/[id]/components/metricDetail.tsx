"use client";
import Header from "@/app/(admin)/components/header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
  CalendarIcon,
  CallIcon,
  LocationIcon,
  MailIcon,
  PersonIcon,
} from "../../../../../../../public/icons";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeneralInfo from "../components/customerGenaralInfo";
import { useSearchParams } from "next/navigation";
import { useHandlePush } from "@/hooks/use-handle-push";
import { ROUTES } from "@/constant/routes";
import PermissionsTab from "./permitTab";
import { useGetAdmins } from "@/services/admin";
import { useGetDashboardInfo } from "@/services/dashboard";
import { useGetAdminRoles } from "@/services/admin/index";



interface UserMetricDetailProps {
  adminId: string;
  roles: any;
}

const UserMetricDetail: React.FC<UserMetricDetailProps> = ({ adminId, roles }) => {
  const params = useSearchParams();
  const tabParam = params.get("tab");
  const { handlePush } = useHandlePush();
  
  console.log("customerId", adminId)


     console.log("compare to saferroledata", roles)

     const { rolesData, isRolesLoading } = useGetAdminRoles({ enabled: true });
    const safeRolesData = Array.isArray(rolesData.data) ? rolesData.data : [];
    const {
      isDashboardInfoLoading,
      isFetchingDashboardInfo,
      dashboardData: data,
      refetchDashboardData,
    } = useGetDashboardInfo({ enabled: true });

  //  const User = data .find(
  //   (admin:any) => admin.recentActivity.
  //   newCustomers.id == adminId
  // );

  const User = data?.topPerformers?.customers?.find(
    (customer: any) => customer.userId == adminId
  );

  console.log("CustomerDataMetric", User,"data" ,data);

  const tabs = [
    {
      value: "general",
      text: "General",
    },
    {
      value: "permissions",
      text: "Permissions",
    }
  ];

  // If still loading, show a simple loading state
  if (isDashboardInfoLoading) {
    return (
      <div>
        <Header title="Customer Information" showBack={true} />
        <div className="mt-5">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-center items-center h-60">
                <p className="text-muted-foreground">Loading information...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // If we have data, determine the status
  const lastOrderDate =	User?.lastOrderDate
    ? new Date(User.lastOrderDate).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Not available";
  const orderCount = User?.orderCount;
  const status = User?.status;
  const totalSpent = User?.totalSpent;
  const UserKyc = User?.kycStatus;
  const UserJD = User?.joinDate;
  const UserEmail = User?.email || "admin@example.com";

  return (
    <div>
      <Header title="Administrator Information" showBack={true} />
      <div className="flex flex-col md:flex-row gap-6 mt-5">
        <Card className="w-full md:w-[300px]">
          <CardContent className="p-6">
            <div>
              <div className="mb-6 pb-6 border-b border-[#F1F2F4] ">
                <div className="flex items-center justify-center mt-6">
                  <Image
                    height={100}
                    width={100}
                    alt="Admin avatar"
                    src="/images/user-avatar.jpg"
                    className="w-[100px] h-[100px] rounded-full object-cover"
                  />
                </div>
                <div className="flex gap-3 items-center mb-4">
                  <MailIcon />
                  <p className="font-semibold text-sm text-[#111827]">
                    {UserEmail}
                  </p>
                </div>
                <div className="flex justify-center">
                  <Badge
                    variant={
                      status?.toLowerCase() === "active"
                        ? "success"
                        : status?.toLowerCase() === "pending"
                        ? "tertiary"
                        : "warning"
                    }
                    className="py-1 px-[26px] font-medium"
                  >
                    {status?.toUpperCase()}
                  </Badge>
                </div>
                {/* <p className="text-[#687588] text-sm mb-6 text-center">
                  @{UserName?.toLowerCase().replace(/\s+/g, "_")}
                </p> */}
            
              </div>
              <div className="mb-6 pb-6 border-b border-[#F1F2F4]">
              
                <div className="flex gap-3 items-center mb-4">
                  {/* <CallIcon /> */}
                  <p className="font-semibold text-sm text-[#111827]">
                  Total Spent : N{totalSpent
 || "Not provided"}
                  </p>
                </div>
                <div className="flex gap-3 items-center mb-4">
                 <CalendarIcon />
                  <p className="font-semibold text-sm text-[#111827]">
                    
                  Last Order Date : {lastOrderDate}
                  </p>
                </div>
                <div className="flex gap-3 items-center mb-4">
                  <PersonIcon />
                  <p className="font-semibold text-sm text-[#111827]">
                  Order Count :{orderCount}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardContent className="p-6">
            <Tabs defaultValue={tabParam || "general"}>
              {/* <TabsList className="justify-start border-b w-full mb-6">
                {tabs.map((tab, index) => (
                  <TabsTrigger
                    value={tab.value}
                    key={index}
                    className={`w-2/12 flex-col pb-0`}
                    onClick={() =>
                      handlePush(
                        `${ROUTES.ADMIN.SIDEBAR.REPORTS}/${adminId}?tab=${tab.value}`
                      )
                    }
                  >
                    <p
                      className={`w-full text-center pb-[9px] ${
                        (tabParam || "general") === tab.value
                          ? "border-b-2 border-[#EC9F01] text-[#030C0A]"
                          : "border-b-2 border-transparent text-[#111827]"
                      }`}
                    >
                      {tab.text}
                    </p>
                  </TabsTrigger>
                ))}
              </TabsList> */}

              {/* <TabsContent value="general">
                <GeneralInfo Data={User} roles={roles.data} />
              </TabsContent> */}
              {/* <TabsContent value="permissions">
                <PermissionsTab Data={User} />
              </TabsContent> */}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default  UserMetricDetail;