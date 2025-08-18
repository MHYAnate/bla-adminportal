"use client";

import React, { useState, useEffect } from "react";
import { useCreateRole, useGetAdminPermissions } from "@/services/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { PermissionsSection } from "./permissions-section";

interface Permission {
  id: number;
  name: string;
  description: string;
  category: string;
}

interface RoleResponse {
  message?: string;
  data?: any;
  error?: string;
}

export default function CreateRoleForm() {
  const [activeTab, setActiveTab] = useState("role");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<Set<number>>(new Set());
  const [groupedPermissions, setGroupedPermissions] = useState<Record<string, Permission[]>>({});

  // ✅ Fetch permissions
  const { permissionsData, isPermissionsLoading } = useGetAdminPermissions({ enabled: true });

  // ✅ Create role hook
  const {
    createRole,
    isCreating,
  } = useCreateRole();

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
      const possibleArrays = Object.values(permissionsData).filter(Array.isArray);
      if (possibleArrays.length > 0) {
        permissionsArray = possibleArrays[0] as Permission[];
      }
    }

    console.log('Processed permissions array:', permissionsArray);

    if (permissionsArray.length > 0) {
      const grouped = permissionsArray.reduce((acc: Record<string, Permission[]>, permission: Permission) => {
        const category = permission.category || "general";
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
      setActiveTab("permissions"); // Switch to permissions tab
      return;
    }

    try {
      const response = await createRole({
        ...formData,
        permissionIds: Array.from(selectedPermissionIds),
      }) as any;

      console.log("Role created successfully:", response);
      toast.success(response?.message || "Role created successfully!");
      handleCancel();
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
    setActiveTab("role");
  };

  const handleNext = () => {
    if (!formData.name.trim()) {
      toast.error("Role name is required.");
      return;
    }
    setActiveTab("permissions");
  };

  const isRoleDetailsComplete = formData.name.trim().length > 0;
  const isFormValid = isRoleDetailsComplete && selectedPermissionIds.size > 0;

  return (
    <div className=" mx-auto p-6 bg-white rounded-lg border">
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Roles and Permissions</h2>
          <p className="text-gray-600 mt-1">Create and assign roles</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6"> <div></div>
          <TabsList className="flex relative">
            <div className="absolute left-0">
              <TabsTrigger
                value="role"
                className="relative px-4 py-3 bg-transparent border-0 rounded-none shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-gray-900 text-gray-600 font-medium data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:w-full data-[state=active]:after:h-0.5 data-[state=active]:after:bg-[#EC9F01]"
              >
                Role
              </TabsTrigger>
              <TabsTrigger
                value="permissions"
                className="relative px-4 py-3 bg-transparent border-0 rounded-none shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-gray-900 text-gray-600 font-medium data-[state=active]:after:content-[''] data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:w-full data-[state=active]:after:h-0.5 data-[state=active]:after:bg-[#EC9F01]"
              >
                Permissions
              </TabsTrigger>
            </div>

          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Details Tab */}
            <TabsContent value="role" className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Basic Details</h3>
                <p className="text-gray-600 mb-6">Add information about the role you're creating</p>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="role-name" className="block text-sm font-medium text-gray-700 mb-2">
                      Role name <span className="text-[#EC9F01]">*</span>
                    </label>
                    <Input
                      id="role-name"
                      type="text"
                      placeholder="Role name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      required
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label htmlFor="role-description" className="block text-sm font-medium text-gray-700 mb-2">
                      Role Description
                    </label>
                    <Textarea
                      id="role-description"
                      placeholder="Describe the role you're creating"
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      className="w-[163px] h-[56px] p-4"
                    >
                      Cancel
                    </Button>
                  </div>
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={!formData.name.trim()}
                    className="bg-[#EC9F01] text-white w-[163px] h-[56px] p-4"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Permissions Tab */}
            <TabsContent value="permissions" className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Set Permissions</h3>
                <p className="text-gray-600 mb-6">Modify what users on this role can do</p>

                <PermissionsSection
                  groupedPermissions={groupedPermissions}
                  selectedPermissionIds={selectedPermissionIds}
                  onPermissionChange={handlePermissionChange}
                  isLoading={isPermissionsLoading}
                  disabled={!isRoleDetailsComplete}
                />




                <div className="relative mt-20">
                  <div className="absolute right-0 flex space-x-3 bottom-1 ">
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-[163px] h-[56px] p-4"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </div>
                    <Button
                      type="submit"
                      disabled={isCreating || !isFormValid}
                      className="bg-[#EC9F01] text-white w-[163px] h-[56px] p-4"
                    >
                      {isCreating ? "Creating..." : "Create Role"}
                    </Button>
                  </div>
                </div>

              </div>
            </TabsContent>
          </form>
        </Tabs>

        {/* Status Indicator */}
        {/* <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
          <div className={`flex items-center space-x-2 ${formData.name.trim() ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-2 h-2 rounded-full ${formData.name.trim() ? 'bg-green-600' : 'bg-gray-300'}`} />
            <span>Role Details</span>
          </div>
          <div className="w-8 h-px bg-gray-300" />
          <div className={`flex items-center space-x-2 ${selectedPermissionIds.size > 0 ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-2 h-2 rounded-full ${selectedPermissionIds.size > 0 ? 'bg-green-600' : 'bg-gray-300'}`} />
            <span>Permissions ({selectedPermissionIds.size})</span>
          </div>
        </div> */}
      </div>
    </div>
  );
}