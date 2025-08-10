"use client";

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useGetAdminRoles } from '@/services/admin';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, Users, Lock, AlertCircle, Info } from 'lucide-react';

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
    description?: string;
    permissions?: Permission[];
  };
}

interface AdminData {
  id: number | string;
  email?: string;
  fullName?: string;
  roles?: UserRole[];
  status?: string;
}

interface PermissionsTabProps {
  adminData: AdminData;
}

export const PermissionsTab: React.FC<PermissionsTabProps> = ({ adminData }) => {
  const [adminPermissions, setAdminPermissions] = useState<Set<number>>(new Set());
  const [rolePermissions, setRolePermissions] = useState<Map<number, Permission[]>>(new Map());

  const { rolesData, isRolesLoading } = useGetAdminRoles({ enabled: true });

  // Process roles data
  let rolesArray: Role[] = [];
  if (Array.isArray(rolesData)) {
    rolesArray = rolesData;
  } else if (rolesData?.data && Array.isArray(rolesData.data)) {
    rolesArray = rolesData.data;
  }

  // Extract all permissions from all roles (since we don't have a separate permissions endpoint)
  const allPermissions: Permission[] = React.useMemo(() => {
    const permissionsMap = new Map<number, Permission>();

    rolesArray.forEach(role => {
      if (role.permissions) {
        role.permissions.forEach(permission => {
          permissionsMap.set(permission.id, permission);
        });
      }
    });

    return Array.from(permissionsMap.values());
  }, [rolesArray]);

  useEffect(() => {
    if (adminData?.roles && rolesArray.length) {
      const currentPermissions = new Set<number>();
      const rolePermissionMap = new Map<number, Permission[]>();

      adminData.roles.forEach((userRole: UserRole) => {
        const roleId = userRole.role?.id || userRole.roleId || userRole.id;
        if (roleId) {
          const fullRole = rolesArray.find((role) => role.id === roleId);
          if (fullRole?.permissions?.length) {
            // Store permissions for this specific role
            rolePermissionMap.set(roleId, fullRole.permissions);
            fullRole.permissions.forEach((perm) => currentPermissions.add(perm.id));
          }
        }
      });

      setAdminPermissions(currentPermissions);
      setRolePermissions(rolePermissionMap);
    }
  }, [adminData, rolesArray]);

  const isLoading = isRolesLoading;

  // Get all permissions accessible to this admin
  const adminAccessiblePermissions = allPermissions.filter((permission) =>
    adminPermissions.has(permission.id)
  );

  // Group permissions by role for display
  const permissionsByRole = Array.from(rolePermissions.entries()).map(([roleId, permissions]) => {
    const role = rolesArray.find(r => r.id === roleId) ||
      adminData.roles?.find(ur => ur.role?.id === roleId)?.role;
    return {
      role: role || { id: roleId, name: 'Unknown Role' },
      permissions
    };
  });

  // Get role information for the admin
  const adminRoles = adminData.roles?.map(userRole => {
    const roleId = userRole.role?.id || userRole.roleId || userRole.id;
    return rolesArray.find(role => role.id === roleId) || userRole.role;
  }).filter(Boolean) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold">Role-Based Permissions</h2>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Lock className="h-3 w-3" />
          Read-Only View
        </Badge>
      </div>

      {/* Role-Based Access Info */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Role-Based Access Control</h3>
              <p className="text-sm text-blue-800">
                This admin's permissions are automatically inherited from their assigned roles.
                To modify permissions, update the role configuration or assign different roles.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Roles */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-600" />
          Assigned Roles ({adminRoles.length})
        </h3>

        {adminRoles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {adminRoles.map((role, index) => {
              const rolePerms = rolePermissions.get(role?.id || 0) || [];
              return (
                <Card key={role?.id || index} className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">
                        {role?.name?.replace(/_/g, ' ') || 'Unknown Role'}
                      </h4>
                      <Badge variant="secondary" className="text-xs">
                        {rolePerms.length} permissions
                      </Badge>
                    </div>
                    {role?.description && (
                      <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                    )}
                    <div className="text-xs text-gray-500">
                      Role ID: {role?.id || 'Unknown'}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">No roles assigned</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Permissions Breakdown by Role */}
      {permissionsByRole.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-gray-600" />
            Permissions by Role
          </h3>

          {permissionsByRole.map(({ role, permissions }) => (
            <Card key={role.id} className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    {role.name?.replace(/_/g, ' ') || 'Unknown Role'}
                  </h4>
                  <Badge variant="outline">
                    {permissions.length} permissions
                  </Badge>
                </div>

                {permissions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {permissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50"
                      >
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 text-sm">
                            {permission.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </h5>
                          {permission.description && (
                            <p className="text-xs text-gray-500 mt-1">
                              {permission.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="success" className="text-xs">
                            Enabled
                          </Badge>
                          <Lock className="h-3 w-3 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No permissions defined for this role</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* All Permissions Summary */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">
            All Available Permissions ({adminAccessiblePermissions.length})
          </h3>
          <div className="text-sm text-gray-500">
            Inherited from {adminRoles.length} role{adminRoles.length !== 1 ? 's' : ''}
          </div>
        </div>

        {adminAccessiblePermissions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {adminAccessiblePermissions.map((permission) => {
              // Find which roles grant this permission
              const grantingRoles = adminRoles.filter(role =>
                rolePermissions.get(role?.id || 0)?.some(p => p.id === permission.id)
              );

              return (
                <Card key={permission.id} className="border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">
                        {permission.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </h4>
                      <Badge variant="success" className="text-xs">
                        Active
                      </Badge>
                    </div>

                    {permission.description && (
                      <p className="text-xs text-gray-600 mb-3">
                        {permission.description}
                      </p>
                    )}

                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Granted by:</span>
                      {grantingRoles.length > 0 ? (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {grantingRoles.map(role => (
                            <Badge key={role?.id || Math.random()} variant="outline" className="text-xs">
                              {role?.name?.replace(/_/g, ' ') || 'Unknown Role'}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="ml-1">Unknown role</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">No permissions found</p>
                  <p className="text-xs mt-1">
                    This admin has no permissions assigned through their roles.
                    Consider assigning appropriate roles to grant access.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Permission Management Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <h4 className="font-medium mb-1">Permission Management</h4>
              <p className="mb-2">
                This admin's permissions are managed through role assignment:
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>To modify permissions: Update role configurations in the Roles section</li>
                <li>To change access level: Assign different roles to this admin</li>
                <li>All changes take effect immediately across the system</li>
                <li>Role integrity is maintained - no direct permission editing</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading permissions...</span>
        </div>
      )}


    </div>
  );
};