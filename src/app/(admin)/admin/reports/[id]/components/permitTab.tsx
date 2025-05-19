"use client";

import { useEffect, useState } from "react";
import { useGetAdminPermissions } from "@/services/admin/index";
import { Separator } from "@/components/ui/separator";

interface PermissionsTabProps {
 Data: any;
}

const PermissionsTab: React.FC<PermissionsTabProps> = ({ Data }) => {
  const { permissionsData, isPermissionsLoading } = useGetAdminPermissions({ enabled: true });
  const [groupedPermissions, setGroupedPermissions] = useState<Record<string, any[]>>({});
  
  useEffect(() => {
    if (permissionsData && permissionsData.length > 0) {
      // Group permissions by category
      const grouped = permissionsData.reduce((acc: Record<string, any[]>, permission: any) => {
        const category = permission.category || "Other";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(permission);
        return acc;
      }, {});
      
      setGroupedPermissions(grouped);
    }
  }, [permissionsData]);

  // Get all user permissions from roles
  const userPermissions = Data?.roles?.flatMap((role: any) => 
    role.permissions?.map((p: any) => p.id) || []
  ) || [];

  if (isPermissionsLoading) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground">Loading permissions...</p>
      </div>
    );
  }

  

  return (
    <div className="space-y-6">
      <div className="border border-[#F1F2F4] rounded-[1rem] p-6">
        <h5 className="pb-4 mb-4 border-b border-[#F1F2F4] text-[#111827] font-semibold">
          Permissions Overview
        </h5>
        <p className="text-sm text-[#687588] mb-4">
          This user has access to the following permissions based on their assigned roles. 
          Permissions are granted through roles and cannot be assigned directly to users.
        </p>
        
        {Object.keys(groupedPermissions).length > 0 ? (
          Object.entries(groupedPermissions).map(([category, permissions]) => (
            <div key={category} className="mb-6">
              <h6 className="text-[#111827] font-medium mb-3">{category}</h6>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {permissions.map((permission) => {
                  const hasPermission = userPermissions.includes(permission.id);
                  
                  return (
                    <div 
                      key={permission.id} 
                      className={`p-3 rounded-md border ${
                        hasPermission ? "border-[#27A376] bg-[#E7F7EF]" : "border-[#E5E7EB] bg-[#F9FAFB]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${hasPermission ? "bg-[#27A376]" : "bg-[#D1D5DB]"}`}></div>
                        <p className={`text-sm font-medium ${hasPermission ? "text-[#111827]" : "text-[#6B7280]"}`}>
                          {permission.name}
                        </p>
                      </div>
                      {permission.description && (
                        <p className="text-xs text-[#687588] mt-1 ml-5">
                          {permission.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
              <Separator className="mt-4" />
            </div>
          ))
        ) : (
          <p className="text-sm text-[#687588]">No permissions found or user has no assigned permissions.</p>
        )}
      </div>
    </div>
  );
};

export default PermissionsTab;

