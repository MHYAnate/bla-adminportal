"use client";

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useToggleAdminPermission } from '@/services/admin/permissions';
import { useGetAdminRoles, useGetAdminPermissions } from '@/services/admin';
import { Separator } from '@/components/ui/separator';
import { Lock, Unlock, Shield, Settings } from 'lucide-react';

interface Permission {
  id: number;
  name: string;
  description?: string;
  category?: string;
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

export const PermissionsTab = ({ adminData }: { adminData: AdminData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [adminPermissions, setAdminPermissions] = useState<Set<number>>(new Set());
  const [groupedPermissions, setGroupedPermissions] = useState<Record<string, Permission[]>>({});

  const { mutate: togglePermission, isPending } = useToggleAdminPermission(adminData.id);
  const { rolesData, isRolesLoading } = useGetAdminRoles({ enabled: true });
  const { permissionsData, isPermissionsLoading } = useGetAdminPermissions({ enabled: true });

  let rolesArray: Role[] = [];
  let permissionsArray: Permission[] = [];

  // Process roles data
  if (Array.isArray(rolesData)) {
    rolesArray = rolesData;
  } else if (rolesData?.data && Array.isArray(rolesData.data)) {
    rolesArray = rolesData.data;
  }

  // Process permissions data
  if (Array.isArray(permissionsData)) {
    permissionsArray = permissionsData;
  } else if (permissionsData?.data && Array.isArray(permissionsData.data)) {
    permissionsArray = permissionsData.data;
  }

  // Group permissions by category
  useEffect(() => {
    if (permissionsArray.length > 0) {
      const grouped = permissionsArray.reduce((acc: Record<string, Permission[]>, permission: Permission) => {
        const category = permission.category || 'general';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(permission);
        return acc;
      }, {});
      setGroupedPermissions(grouped);
    }
  }, [permissionsArray]);

  // Calculate current admin permissions from roles
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
            // Fallback: check permissions that have this role
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

  const handleTogglePermission = (permissionId: number) => {
    togglePermission(permissionId, {
      onSuccess: () => {
        // Update local state immediately for better UX
        setAdminPermissions(prev => {
          const newSet = new Set(prev);
          if (newSet.has(permissionId)) {
            newSet.delete(permissionId);
          } else {
            newSet.add(permissionId);
          }
          return newSet;
        });
        toast.success('Permission updated successfully');
      },
      onError: (error: any) => {
        console.error('Toggle permission error:', error);
        toast.error('Failed to update permission');
      }
    });
  };

  const formatPermissionName = (name: string) => {
    return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getCategoryDisplayName = (category: string) => {
    const categoryMap: Record<string, string> = {
      'admin': 'Admin Access',
      'manager': 'Manager Access',
      'general': 'General Access',
      'user': 'User Management',
      'product': 'Product Management',
      'order': 'Order Management',
      'inventory': 'Inventory Management',
      'report': 'Reports & Analytics',
      'financial': 'Financial Operations',
      'system': 'System Administration'
    };

    return categoryMap[category.toLowerCase()] || category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + ' Access';
  };

  const isLoading = isRolesLoading || isPermissionsLoading || isPending;
  const hasPermissions = adminPermissions.size > 0;

  if (isLoading && adminPermissions.size === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Shield className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Permissions Management</h2>
            <p className="text-gray-600">Toggle individual permissions for this admin</p>
          </div>
        </div>

        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
          className={isEditing ? "border-orange-500 text-orange-600" : "bg-orange-500 hover:bg-orange-600"}
        >
          {isEditing ? (
            <>
              <Lock className="w-4 h-4 mr-2" />
              Lock Editing
            </>
          ) : (
            <>
              <Settings className="w-4 h-4 mr-2" />
              Edit Permissions
            </>
          )}
        </Button>
      </div>

      {/* Permissions Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${hasPermissions ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="font-medium text-gray-900">
              {adminPermissions.size} Permission{adminPermissions.size !== 1 ? 's' : ''} Active
            </span>
          </div>
          <span className="text-sm text-gray-600">
            Total Available: {permissionsArray.length}
          </span>
        </div>
      </div>

      {/* Permissions List */}
      {Object.keys(groupedPermissions).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedPermissions).map(([category, permissions]) => {
            const categoryDisplayName = getCategoryDisplayName(category);
            const categoryPermissions = permissions.filter(p => adminPermissions.has(p.id));

            return (
              <div key={category} className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{categoryDisplayName}</h3>
                    <span className="text-sm text-gray-600">
                      {categoryPermissions.length}/{permissions.length} enabled
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  {permissions.map((permission) => {
                    const hasPermission = adminPermissions.has(permission.id);

                    return (
                      <div key={permission.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${hasPermission ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {formatPermissionName(permission.name)}
                              </h4>
                              {permission.description && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {permission.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="ml-4">
                          <Switch
                            checked={hasPermission}
                            onCheckedChange={() => handleTogglePermission(permission.id)}
                            disabled={!isEditing || isPending}
                            className="data-[state=checked]:bg-green-500"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Permissions Available</h3>
          <p className="text-gray-600">This admin doesn't have any permissions assigned yet.</p>
        </div>
      )}

      {/* Edit Mode Warning */}
      {isEditing && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Unlock className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-orange-800">Edit Mode Active</h4>
              <p className="text-sm text-orange-700 mt-1">
                You can now toggle permissions on/off. Changes are saved immediately.
                Click "Lock Editing" when finished to prevent accidental changes.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};