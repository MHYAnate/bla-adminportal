"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useHandlePush } from "@/hooks/use-handle-push";
import { ROUTES } from "@/constant/routes";
import UserDetail from "./customerDetail";
import { useGetAdminRoles } from "@/services/admin/index";
import { useGetDashboardInfo } from "@/services/dashboard";
import UserMetricDetail from "./metricDetail";

// Define TypeScript interfaces for the dashboard data
interface DashboardData {
  recentActivity?: {
    newCustomers?: Array<{
      id: string | number;
      [key: string]: any;
    }>;
  };
  topPerformers?: {
    customers?: Array<{
      userId: string | number;
      totalSpent?: number;
      [key: string]: any;
    }>;
  };
  [key: string]: any;
}

interface RolesData {
  data?: any[];
  [key: string]: any;
}

export default function AdminDetailPage() {
  const pathname = usePathname();
  const adminId = pathname.split("/").pop();
  const { handlePush } = useHandlePush();

  const { rolesData: rawRolesData } = useGetAdminRoles({ enabled: true });
  const rolesData = rawRolesData as RolesData;

  if (!adminId) {
    handlePush(ROUTES.ADMIN.SIDEBAR.ADMINS);
    return null;
  }

  const {
    isDashboardInfoLoading,
    isFetchingDashboardInfo,
    dashboardData: rawData,
    refetchDashboardData,
  } = useGetDashboardInfo({ enabled: true });

  // Type assertion for dashboard data
  const data = rawData as DashboardData;

  console.log("fixCheckerCustomerData", data?.recentActivity?.newCustomers);

  const UserMetric = data?.topPerformers?.customers?.find(
    (customer: any) => customer.userId == adminId
  );

  console.log("fixxx", UserMetric, "fixxxId", adminId);

  return (
    UserMetric?.totalSpent ? (
      <UserMetricDetail adminId={adminId} roles={rolesData || []} />
    ) : (
      <UserDetail adminId={adminId} roles={rolesData || []} />
    )
  );
}