"use client";

import React, { useState, useEffect } from "react";
import { useCreateAdminRole, useGetAdminPermissions } from "@/services/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

interface Permission {
  id: number;
  name: string;
  description: string;
  category: string;
}

export default function CreateRoleForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<Set<number>>(new Set());
  const [groupedPermissions, setGroupedPermissions] = useState<Record<string, Permission[]>>({});

  // ✅ Fetch permissions
  const { permissionsData, isPermissionsLoading } = useGetAdminPermissions({ enabled: true });

  // ✅ Create role hook
  const { createRolePayload, createRoleIsLoading } = useCreateAdminRole(
    (response: { message: any; data: any; }) => {
      console.log('Role created successfully:', response);
      toast.success(response.message || "Role created successfully!");
      handleCancel(); // Reset form on success
    }
  );

  // ✅ Process permissions data
  useEffect(() => {
    console.log('Permissions data received:', permissionsData);

    let permissionsArray: Permission[] = [];

    // Handle different possible data structures
    if (Array.isArray(permissionsData)) {
      permissionsArray = permissionsData;
    } else if (permissionsData?.data && Array.isArray(permissionsData.data)) {
      permissionsArray = permissionsData.data;
    } else if (permissionsData?.permissions && Array.isArray(permissionsData.permissions)) {
      permissionsArray = permissionsData.permissions;
    } else if (permissionsData && !isPermissionsLoading) {
      console.warn("Unexpected permissionsData structure:", permissionsData);
      // Try to extract permissions from any nested structure
      const possibleArrays = Object.values(permissionsData).filter(Array.isArray);
      if (possibleArrays.length > 0) {
        permissionsArray = possibleArrays[0] as Permission[];
      }
    }

    console.log('Processed permissions array:', permissionsArray);

    if (permissionsArray.length > 0) {
      const grouped = permissionsArray.reduce((acc: Record<string, Permission[]>, permission: Permission) => {
        const category = permission.category || "General";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(permission);
        return acc;
      }, {});

      console.log('Grouped permissions:', grouped);
      setGroupedPermissions(grouped);
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

    console.log('Submitting role:', {
      ...formData,
      permissionIds: Array.from(selectedPermissionIds)
    });

    try {
      await createRolePayload({
        ...formData,
        permissionIds: Array.from(selectedPermissionIds),
      });
    } catch (error: any) {
      console.error("Error creating role:", error);
      toast.error(error.message || "Failed to create role. Please try again.");
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

  // ✅ Debug render
  console.log('Component render state:', {
    isPermissionsLoading,
    permissionsDataType: typeof permissionsData,
    permissionsDataKeys: permissionsData ? Object.keys(permissionsData) : 'null',
    groupedPermissionsKeys: Object.keys(groupedPermissions),
    selectedPermissionsCount: selectedPermissionIds.size
  });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg border">
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Create New Admin Role</h2>
          <p className="text-gray-600 mt-1">Define a new role and assign the appropriate permissions.</p>
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
                />
              </div>
            </div>
          </div>

          {/* Permissions Section */}
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Assign Permissions</h3>
            {isPermissionsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading permissions...</p>
                </div>
              </div>
            ) : Object.keys(groupedPermissions).length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No permissions available</p>
                <p className="text-sm text-gray-400 mt-1">
                  Debug: {JSON.stringify({ permissionsData, isPermissionsLoading })}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedPermissions).map(([category, permissions]) => (
                  <div key={category}>
                    <h4 className="text-md font-semibold text-gray-800 mb-3">{category}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md">
                          <Checkbox
                            id={`perm-${permission.id}`}
                            checked={selectedPermissionIds.has(permission.id)}
                            onCheckedChange={() => handlePermissionChange(permission.id)}
                            className="mt-1"
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
                    <Separator className="mt-6" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={createRoleIsLoading}
              className="px-6 py-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.name.trim() || createRoleIsLoading}
              variant="warning"
              className="px-6 py-2"
            >
              {createRoleIsLoading ? "Creating Role..." : "Create Role"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}