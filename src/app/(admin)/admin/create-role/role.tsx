"use client";

import React, { useState, useEffect } from "react";
import { useCreateRole, useGetAdminPermissions, useGetAdminRoles } from "@/services/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import RoleDataTable from "./role-data-table";
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

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // Fetch permissions
  const { permissionsData, isPermissionsLoading } = useGetAdminPermissions({ enabled: true });

  // Fetch existing roles for the table
  // const { rolesData, isRolesLoading, refetchRoles } = useGetAdminRoles({ enabled: true });

    // 2. Pass pagination state to the data fetching hook
    const { rolesData, isRolesLoading, refetchRoles } = useGetAdminRoles({
      enabled: true,
      page: currentPage,
      limit: pageSize,
    });

    console.log(rolesData, "rolecheck")

  // Handle the data structure - the API returns {data: Array(10), pagination: {...}}
  // const processedRolesData = React.useMemo(() => {
  //   if (!rolesData) {
  //     return [];
  //   }

  //   // Check different possible data structures
  //   let roles = [];
  //   if (Array.isArray(rolesData)) {
  //     roles = rolesData;
  //   } else if (rolesData.data && Array.isArray(rolesData.data)) {
  //     roles = rolesData.data;
  //   } else if (rolesData.roles && Array.isArray(rolesData.roles)) {
  //     roles = rolesData.roles;
  //   }

  //   return roles;
  // }, [rolesData]);

  // const paginationData = rolesData?.pagination;

  // // Create role hook
  // const {
  //   createRole,
  //   isCreating,
  // } = useCreateRole();

  // // Process permissions data
  // useEffect(() => {
  //   console.log('Permissions data received:', permissionsData);

  //   let permissionsArray: Permission[] = [];

  //   // Handle different possible data structures
  //   if (Array.isArray(permissionsData)) {
  //     permissionsArray = permissionsData;
  //   } else if (permissionsData?.data && Array.isArray(permissionsData.data)) {
  //     permissionsArray = permissionsData.data;
  //   } else if (permissionsData?.permissions && Array.isArray(permissionsData.permissions)) {
  //     permissionsArray = permissionsData.permissions;
  //   } else if (permissionsData && !isPermissionsLoading) {
  //     console.warn("Unexpected permissionsData structure:", permissionsData);
  //     const possibleArrays = Object.values(permissionsData).filter(Array.isArray);
  //     if (possibleArrays.length > 0) {
  //       permissionsArray = possibleArrays[0] as Permission[];
  //     }
  //   }

  //   console.log('Processed permissions array:', permissionsArray);

  //   if (permissionsArray.length > 0) {
  //     const grouped = permissionsArray.reduce((acc: Record<string, Permission[]>, permission: Permission) => {
  //       const category = permission.category || "general";
  //       if (!acc[category]) {
  //         acc[category] = [];
  //       }
  //       acc[category].push(permission);
  //       return acc;
  //     }, {});

  //     console.log('Grouped permissions:', grouped);
  //     setGroupedPermissions(grouped);
  //   }
  // }, [permissionsData, isPermissionsLoading]);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!formData.name.trim()) {
  //     toast.error("Role name is required.");
  //     return;
  //   }

  //   if (selectedPermissionIds.size === 0) {
  //     toast.error("At least one permission must be selected.");
  //     setActiveTab("permissions"); // Switch to permissions tab
  //     return;
  //   }

  //   try {
  //     const response = await createRole({
  //       ...formData,
  //       permissionIds: Array.from(selectedPermissionIds),
  //     }) as any;

  //     console.log("Role created successfully:", response);
  //     toast.success(response?.message || "Role created successfully!");
  //     handleCancel();
  //     refetchRoles(); // Refresh the roles table
  //   } catch (error: any) {
  //     console.error("Error creating role:", error);
  //     toast.error(error.message || "Failed to create role. Please try again.");
  //   }
  // };

  // const handlePermissionChange = (permissionId: number) => {
  //   setSelectedPermissionIds((prev) => {
  //     const newSet = new Set(prev);
  //     if (newSet.has(permissionId)) {
  //       newSet.delete(permissionId);
  //     } else {
  //       newSet.add(permissionId);
  //     }
  //     return newSet;
  //   });
  // };

  // const handleCancel = () => {
  //   setFormData({ name: "", description: "" });
  //   setSelectedPermissionIds(new Set());
  //   setActiveTab("role");
  // };

  // const handleNext = () => {
  //   if (!formData.name.trim()) {
  //     toast.error("Role name is required.");
  //     return;
  //   }
  //   setActiveTab("permissions");
  // };

  // const isRoleDetailsComplete = formData.name.trim().length > 0;
  // const isFormValid = isRoleDetailsComplete && selectedPermissionIds.size > 0;

   // Extract the array of roles and the pagination object from the API response
   const processedRolesData = React.useMemo(() => {
    if (!rolesData) return [];
    if (rolesData.data && Array.isArray(rolesData.data)) return rolesData.data;
    if (Array.isArray(rolesData)) return rolesData;
    if (rolesData.roles && Array.isArray(rolesData.roles)) return rolesData.roles;
    return [];
  }, [rolesData]);
  
  const paginationData = rolesData?.pagination;

  // Create role hook
  const {
    createRole,
    isCreating,
  } = useCreateRole();

  // Process permissions data (no changes needed here)
  useEffect(() => {
    let permissionsArray: Permission[] = [];
    if (Array.isArray(permissionsData)) {
      permissionsArray = permissionsData;
    } else if (permissionsData?.data && Array.isArray(permissionsData.data)) {
      permissionsArray = permissionsData.data;
    } else if (permissionsData?.permissions && Array.isArray(permissionsData.permissions)) {
      permissionsArray = permissionsData.permissions;
    }
    if (permissionsArray.length > 0) {
      const grouped = permissionsArray.reduce((acc: Record<string, Permission[]>, permission: Permission) => {
        const category = permission.category || "general";
        if (!acc[category]) acc[category] = [];
        acc[category].push(permission);
        return acc;
      }, {});
      setGroupedPermissions(grouped);
    }
  }, [permissionsData, isPermissionsLoading]);

  // handleSubmit and other handlers (no changes needed)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Role name is required.");
      return;
    }
    if (selectedPermissionIds.size === 0) {
      toast.error("At least one permission must be selected.");
      setActiveTab("permissions");
      return;
    }
    try {
      const response = await createRole({
        ...formData,
        permissionIds: Array.from(selectedPermissionIds),
      }) as any;
      toast.success(response?.message || "Role created successfully!");
      handleCancel();
      refetchRoles();
    } catch (error: any) {
      console.error("Error creating role:", error);
      toast.error(error.message || "Failed to create role. Please try again.");
    }
  };

  const handlePermissionChange = (permissionId: number) => {
    setSelectedPermissionIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(permissionId) ? newSet.delete(permissionId) : newSet.add(permissionId);
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

  // Debug render
  console.log('Component render state:', {
    isPermissionsLoading,
    permissionsDataType: typeof permissionsData,
    permissionsDataKeys: permissionsData ? Object.keys(permissionsData) : 'null',
    groupedPermissionsKeys: Object.keys(groupedPermissions),
    selectedPermissionsCount: selectedPermissionIds.size
  });

  return (
    <div className="space-y-8">
      {/* Create Role Form Section */}
      <div className="mx-auto p-6 bg-white rounded-lg border">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Roles and Permissions</h2>
            <p className="text-gray-600 mt-1">Create and assign roles</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
                    <div className="absolute right-0 flex space-x-3 bottom-1">
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
        </div>
      </div>

      {/* Roles Table Section - Below the form */}
      {/* <RoleDataTable
        rolesData={processedRolesData}
        loading={isRolesLoading}
        refetch={refetchRoles} currentPage={0} totalPages={0} onPageChange={function (page: number): void {
          throw new Error("Function not implemented.");
        } } onPageSizeChange={function (size: string): void {
          throw new Error("Function not implemented.");
        } }      /> */}
           <RoleDataTable
        rolesData={processedRolesData}
        loading={isRolesLoading}
        refetch={refetchRoles}
        currentPage={paginationData?.currentPage || 1}
        totalPages={paginationData?.totalPages || 1}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(Number(size));
          setCurrentPage(1); // Reset to page 1 when size changes
        }}
      />
    </div>
  );
}