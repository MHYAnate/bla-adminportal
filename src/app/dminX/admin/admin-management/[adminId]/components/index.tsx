"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useHandlePush } from "@/hooks/use-handle-push";
import { ROUTES } from "@/constant/routes";
import AdminUserDetail from "./admin-user-detail";
import { useGetAdminRoles } from "@/services/admin/index";

export default function AdminDetailPage() {
  const pathname = usePathname();
  const adminId = pathname.split("/").pop();
  const { handlePush } = useHandlePush();
  const { rolesData } = useGetAdminRoles({ enabled: true });

  if (!adminId) {
    handlePush(ROUTES.ADMIN.SIDEBAR.ADMINS);
    return null;
  }

  return <AdminUserDetail adminId={adminId} roles={rolesData || []} />;
}
