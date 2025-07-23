"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useHandlePush } from "@/hooks/use-handle-push";
import { ROUTES } from "@/constant/routes";
import UserDetail from "./customerDetail";
import { useGetAdminRoles } from "@/services/admin/index";
import { useGetDashboardInfo } from "@/services/dashboard";
import UserMetricDetail from "./metricDetail";

export default function AdminDetailPage() {
  const pathname = usePathname();
  const adminId = pathname.split("/").pop();
  const { handlePush } = useHandlePush();
  const { rolesData } = useGetAdminRoles({ enabled: true });

  if (!adminId) {
    handlePush(ROUTES.ADMIN.SIDEBAR.ADMINS);
    return null;
  }

      const {
        isDashboardInfoLoading,
        isFetchingDashboardInfo,
        dashboardData: data,
        refetchDashboardData,
      } = useGetDashboardInfo({ enabled: true });

      console.log("fixCheckerCustomerData", data?.recentActivity?.newCustomers)

      const UserMetric = data?.topPerformers?.customers?.find(
        (customer: any) => customer.userId == adminId
      );

console.log("fixxx", UserMetric, "fixxxId", adminId)

  

  return (
    UserMetric?.totalSpent ?  <UserMetricDetail adminId={adminId} roles={rolesData || []} /> :
  <UserDetail adminId={adminId} roles={rolesData || []} />
);
}
