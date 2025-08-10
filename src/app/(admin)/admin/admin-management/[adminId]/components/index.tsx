"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useHandlePush } from "@/hooks/use-handle-push";
import { ROUTES } from "@/constant/routes";
import AdminUserDetail from "./admin-user-detail";
import { useGetAdminRoles } from "@/services/admin/index"; // Remove useGetAdminInfo
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import DebugAdminStatus from "./debug"


export default function AdminDetailPage() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const adminId = pathSegments[pathSegments.length - 1];
  const { handlePush } = useHandlePush();

  // Only fetch roles - AdminUserDetail handles admin data internally
  const {
    rolesData,
    isRolesLoading,
    rolesError
  } = useGetAdminRoles({ enabled: true });

  // Handle errors
  useEffect(() => {
    if (rolesError) {
      toast.error("Failed to load roles data");
      console.error("Roles error:", rolesError);
    }
  }, [rolesError]);

  // Redirect if no adminId
  useEffect(() => {
    if (!adminId) {
      handlePush(ROUTES.ADMIN.SIDEBAR.ADMINS);
    }
  }, [adminId, handlePush]);

  // Loading state
  if (isRolesLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-60 gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading admin details...</p>
      </div>
    );
  }

  // Pass only the props that AdminUserDetail expects
  return (
    <AdminUserDetail
      adminId={adminId}
      roles={rolesData || []}
    />
  );
}