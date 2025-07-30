"use client";

import React from "react";
import { useGetAdminRoles, useGetAdmins } from "@/services/admin/index";

interface Props {
  id: any;
}

export default function Permit({ id }: Props) {
  const { rolesData, isRolesLoading } = useGetAdminRoles({ enabled: true });
  const { adminsData, isAdminsLoading } = useGetAdmins({ enabled: true });

  if (isAdminsLoading || isRolesLoading) {
    return <div>-</div>;
  }

  // ✅ FIXED: Find the admin by ID first
  const targetAdmin = adminsData.find((admin: any) => admin.id == id);

  if (!targetAdmin) {
    return <div>0</div>;
  }

  // ✅ FIXED: Calculate total permissions from all roles
  let totalPermissions = 0;
  if (targetAdmin.roles && targetAdmin.roles.length > 0) {
    targetAdmin.roles.forEach((userRole: any) => {
      // Find the full role data from rolesData
      const fullRole = rolesData.find((role: any) => role.id === userRole.role.id);
      if (fullRole && fullRole.permissions) {
        totalPermissions += fullRole.permissions.length;
      }
    });
  }

  return <div>{totalPermissions}</div>;
}