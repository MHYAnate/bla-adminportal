"use client";

import React, { useState, useEffect } from "react";
// ✅ FIX: Updated imports to use unified hooks
import { useCreateRole, useGetAdminPermissions } from "@/services/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Loader2, Shield } from "lucide-react";

interface Permission {
  id: number;
  name: string;
  description: string;
  category?: string;
}

export default function CreateRoleForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<Set<number>>(new Set());
  const [groupedPermissions, setGroupedPermissions] = useState<Record<string, Permission[]>>({});

  // ✅ FIX: Use unified hooks with correct property names
  const { permissionsData, isPermissionsLoading, permissionsError } = useGetAdminPermissions({ enabled: true });

  // ✅ FIX: Use unified create role hook with correct return properties
  const {
    createRole,        // ✅ Function name is 'createRole', not 'createRolePayload'
    isCreating,        // ✅ Loading state is 'isCreating', not 'createRoleIsLoading'
    createRoleError
  } = useCreateRole(); // ✅ No callback parameter needed - use separate success handling

  // ✅ Enhanced permissions processing with better error handling
  useEffect(() => {
    console.log('Permissions data received:', permissionsData);

    if (isPermissionsLoading) return;

    let permissionsArray: Permission[] = [];

    // ✅ The unified hook now uses extractResponseData, so we can expect consistent format
    if (Array.isArray(permissionsData)) {
      permissionsArray = permissionsData;
    } else if (permissionsData && typeof permissionsData === 'object') {
      // Handle any nested structures that might still exist
      console.warn("Unexpected permissionsData structure:", permissionsData);
      const possibleArrays = Object.values(permissionsData).filter(Array.isArray);
      if (possibleArrays.length > 0) {
        permissionsArray = possibleArrays[0] as Permission[];
      }
    }

    console.log('Processed permissions array:', permissionsArray);

    if (permissionsArray.length > 0) {
      // ✅ Enhanced grouping with fallback category
      const grouped = permissionsArray.reduce((acc: Record<string, Permission[]>, permission: Permission) => {
        // More intelligent category extraction
        let category = permission.category || "General";

        // Extract category from permission name if not provided
        if (!permission.category && permission.name) {
          const nameParts = permission.name.split('_');
          if (nameParts.length > 1) {
            category = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1);
          }
        }

        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(permission);
        return acc;
      }, {});

      console.log('Grouped permissions:', grouped);
      setGroupedPermissions(grouped);
    } else if (!isPermissionsLoading) {
      console.warn("No permissions found in data:", permissionsData);
    }
  }, [permissionsData, isPermissionsLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Role name is required.");
      return;
    }

    if (selectedPermissionIds.size === 0) {
      toast.error("At least one permission must be selected.");
      return;
    }

    try {
      // ✅ FIX: Use correct function name and handle success manually
      const response = await createRole({
        ...formData,
        permissionIds: Array.from(selectedPermissionIds),
      });

      // ✅ FIX: Handle success manually since no callback parameter
      console.log("Role created successfully:", response);
      toast.success("Role created successfully!");
      handleCancel();

    } catch (error: any) {
      // Error handling is done in the hook, but we can add specific logging
      console.error("Error creating role:", error);
      // The hook already shows toast.error, so we don't need to show it again
    }
  };

  const handlePermissionChange = (permissionId: number) => {
    setSelectedPermissionIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(permissionId)) {
        newSet.delete(permissionId);
      } else {
        newSet.add(permissionId);
      }
      return newSet;
    });
  };

  const handleCancel = () => {
    setFormData({ name: "", description: "" });
    setSelectedPermissionIds(new Set());
  };

  // ✅ Enhanced error state
  if (permissionsError) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to Load Permissions</h3>
          <p className="text-sm text-gray-600 mb-4">
            Unable to load available permissions for role creation.
          </p>
          <p className="text-xs text-red-500">{permissionsError}</p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg border">
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Create New Admin Role</h2>
            <p className="text-gray-600 mt-1">Define a new role and assign the appropriate permissions.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Details Section */}
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Role Details</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="role-name" className="block text-sm font-medium text-gray-700">
                  Role Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="role-name"
                  type="text"
                  placeholder="e.g., Content Manager"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full mt-1"
                  disabled={isCreating}
                />
              </div>
              <div>
                <label htmlFor="role-description" className="block text-sm font-medium text-gray-700">
                  Role Description
                </label>
                <Textarea
                  id="role-description"
                  placeholder="Briefly describe what this role is for."
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full mt-1 resize-none"
                  disabled={isCreating}
                />
              </div>
            </div>
          </div>

          {/* Permissions Section */}
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Assign Permissions
              {selectedPermissionIds.size > 0 && (
                <span className="ml-2 text-sm text-blue-600">
                  ({selectedPermissionIds.size} selected)
                </span>
              )}
            </h3>

            {isPermissionsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Loader2 className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto" />
                  <p className="mt-2 text-gray-600">Loading permissions...</p>
                </div>
              </div>
            ) : Object.keys(groupedPermissions).length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                <p className="text-gray-500">No permissions available</p>
                <p className="text-sm text-gray-400 mt-1">
                  Please ensure permissions are properly configured in the system.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedPermissions).map(([category, permissions]) => (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-md font-semibold text-gray-800">{category}</h4>
                      <span className="text-sm text-gray-500">
                        {permissions.length} permission{permissions.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
                          <Checkbox
                            id={`perm-${permission.id}`}
                            checked={selectedPermissionIds.has(permission.id)}
                            onCheckedChange={() => handlePermissionChange(permission.id)}
                            className="mt-1"
                            disabled={isCreating}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label htmlFor={`perm-${permission.id}`} className="text-sm font-medium text-gray-700 cursor-pointer">
                              {permission.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </label>
                            {permission.description && (
                              <p className="text-xs text-gray-500">{permission.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {Object.keys(groupedPermissions).indexOf(category) < Object.keys(groupedPermissions).length - 1 && (
                      <Separator className="mt-6" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ✅ Show creation errors from unified hook */}
          {createRoleError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
              <span className="text-red-700 text-sm">{createRoleError}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isCreating}
              className="px-6 py-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.name.trim() || selectedPermissionIds.size === 0 || isCreating}
              variant="warning"
              className="px-6 py-2"
            >
              {/* ✅ FIX: Use correct loading state */}
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Role...
                </>
              ) : (
                "Create Role"
              )}
            </Button>

          </div>
        </form>
      </div >
    </div >
  );
}