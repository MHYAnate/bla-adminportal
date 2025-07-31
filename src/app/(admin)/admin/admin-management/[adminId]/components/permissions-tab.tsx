"use client";

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useToggleAdminPermission } from '@/services/admin/permissions';
import { useGetAdminRoles, useGetAdminPermissions } from '@/services/admin';

interface Permission {
  id: number;
  name: string;
  description?: string;
  roles?: any[];
}

interface Role {
  id: number;
  name: string;
  description?: string;
  permissions?: Permission[];
}

interface UserRole {
  id?: number;
  roleId?: number;
  role?: {
    id: number;
    name?: string;
  };
}

interface AdminData {
  id: number | string;
  email?: string;
  fullName?: string;
  roles?: UserRole[];
  status?: string;
}

export const PermissionsTab = ({ adminData }: { adminData: AdminData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [adminPermissions, setAdminPermissions] = useState<Set<number>>(new Set());

  const { mutate: togglePermission, isPending } = useToggleAdminPermission(adminData.id);
  const { rolesData, isRolesLoading } = useGetAdminRoles({ enabled: true });
  const { permissionsData, isPermissionsLoading } = useGetAdminPermissions({ enabled: true });

  let rolesArray: Role[] = [];
  let permissionsArray: Permission[] = [];

  if (Array.isArray(rolesData)) {
    rolesArray = rolesData;
  } else if (rolesData?.data && Array.isArray(rolesData.data)) {
    rolesArray = rolesData.data;
  }

  if (Array.isArray(permissionsData)) {
    permissionsArray = permissionsData;
  } else if (permissionsData?.data && Array.isArray(permissionsData.data)) {
    permissionsArray = permissionsData.data;
  }

  useEffect(() => {
    if (adminData?.roles && rolesArray.length && permissionsArray.length) {
      const currentPermissions = new Set<number>();

      adminData.roles.forEach((userRole: UserRole) => {
        const roleId = userRole.role?.id || userRole.roleId || userRole.id;
        if (roleId) {
          const fullRole = rolesArray.find((role) => role.id === roleId);
          if (fullRole?.permissions?.length) {
            fullRole.permissions.forEach((perm) => currentPermissions.add(perm.id));
          } else {
            permissionsArray.forEach((perm) => {
              if (perm.roles?.some((r) => r.id === roleId || r.name === fullRole?.name || r.role?.id === roleId)) {
                currentPermissions.add(perm.id);
              }
            });
          }
        }
      });

      setAdminPermissions(currentPermissions);
    }
  }, [adminData, rolesArray, permissionsArray]);

  const isLoading = isRolesLoading || isPermissionsLoading || isPending;

  const adminAccessiblePermissions = permissionsArray.filter((permission) =>
    adminPermissions.has(permission.id)
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Permissions</h2>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="font-medium">
            Role-based Permissions ({adminAccessiblePermissions.length})
          </p>
        </div>

        {adminAccessiblePermissions.length > 0 ? (
          adminAccessiblePermissions.map((permission) => (
            <div
              key={permission.id}
              className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{permission.name}</h3>
                {permission.description && (
                  <p className="text-sm text-gray-500">{permission.description}</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 border border-dashed rounded-lg">
            <p>No permissions found for assigned roles</p>
            <p className="text-xs mt-2">
              Make sure the admin has roles assigned with permissions
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
