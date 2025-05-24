"use client";

import { useEffect, useState } from "react";
import Header from "@/app/(admin)/components/header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
  CallIcon,
  LocationIcon,
  MailIcon,
} from "../../../../../../../public/icons";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeneralInfo from "../components/general-info";
import { useSearchParams } from "next/navigation";
import { useHandlePush } from "@/hooks/use-handle-push";
import { ROUTES } from "@/constant/routes";
import PermissionsTab from "./permissions-tab";
import { useGetAdmins } from "@/services/admin";
interface AdminUserDetailProps {
  adminId: string;
  roles: any;
}

const AdminUserDetail: React.FC<AdminUserDetailProps> = ({ adminId, roles }) => {
  const params = useSearchParams();
  const tabParam = params.get("tab");
  const { handlePush } = useHandlePush();

   const{adminsData, isAdminsLoading,refetchAdmins }= useGetAdmins({ enabled: true });
   console.log(adminId, "id", adminsData);


   console.log("compare to saferroledata", roles)

   const admin = adminsData.find(
		(admin: {id:string}) => admin.id == adminId
	);

  console.log("adminData", admin);

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
  if (isAdminsLoading) {
    return (
      <div>
        <Header title="Administrator Information" showBack={true} />
        <div className="mt-5">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-center items-center h-60">
                <p className="text-muted-foreground">Loading admin information...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // If we have data, determine the status
  const status =admin?.status && admin?.status;
  const adminRoles = admin?.roles || [];
  const adminName = admin?.adminProfile?.username
|| "Administrator";
const adminPhone = admin?.adminProfile?.phone
|| "number";
  const adminEmail = admin?.email || "admin@example.com";

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
                <h6 className="text-center text-[#111827] text-xl mb-2.5">{adminName}</h6>
                <p className="text-[#687588] text-sm mb-2.5 text-center">
                  {admin?.roles[0]?.role?.name}
                  
                </p>
                <p className="text-[#687588] text-sm mb-6 text-center">
                  @{adminName?.toLowerCase().replace(/\s+/g, "_")}
                </p>
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
              </div>
              <div className="mb-6 pb-6 border-b border-[#F1F2F4]">
                <div className="flex gap-3 items-center mb-4">
                  <MailIcon />
                  <p className="font-semibold text-sm text-[#111827]">
                    {adminEmail}
                  </p>
                </div>
                <div className="flex gap-3 items-center mb-4">
                  <CallIcon />
                  <p className="font-semibold text-sm text-[#111827]">
                    {adminPhone || "Not provided"}
                  </p>
                </div>
                <div className="flex gap-3 items-center mb-4">
                  <LocationIcon />
                  <p className="font-semibold text-sm text-[#111827]">
                    {admin?.location || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardContent className="p-6">
            <Tabs defaultValue={tabParam || "general"}>
              <TabsList className="justify-start border-b w-full mb-6">
                {tabs.map((tab, index) => (
                  <TabsTrigger
                    value={tab.value}
                    key={index}
                    className={`w-2/12 flex-col pb-0`}
                    onClick={() =>
                      handlePush(
                        `${ROUTES.ADMIN.SIDEBAR.ADMINS}/${adminId}?tab=${tab.value}`
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
              </TabsList>

              <TabsContent value="general">
                <GeneralInfo adminData={admin} roles={roles.data} />
              </TabsContent>
              <TabsContent value="permissions">
                <PermissionsTab adminData={admin} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminUserDetail;