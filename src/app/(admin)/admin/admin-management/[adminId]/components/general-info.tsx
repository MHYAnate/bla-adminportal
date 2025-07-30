import { HorizontalDots } from "../../../../../../../public/icons";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft } from "lucide-react";
import { useUpdateAdminRoles, useGetCurrentAdmin, useGetAdminRoles } from "@/services/admin";
import { toast } from "sonner";
import { Admin, AdminRole, Role, UpdateRolesResponse, Permission } from "@/types/admin";

interface GeneralInfoProps {
  adminData: Admin;
  roles: Role[] | any; // Allow any type to handle API response objects
}

interface EditRolesDialogProps {
  adminData: Admin;
  roles: Role[] | any; // Allow any type to handle API response objects
  onClose: () => void;
  canEditRoles: boolean;
}

// Helper function to normalize role data structure
const normalizeRole = (roleItem: AdminRole) => {
  if (roleItem.role) {
    return {
      id: roleItem.role.id,
      name: roleItem.role.name,
      description: roleItem.role.description,
      permissions: roleItem.role.permissions || []
    };
  }

  return {
    id: roleItem.id || 0,
    name: roleItem.name || '',
    description: roleItem.description || '',
    permissions: roleItem.permissions || []
  };
};

const EditRolesDialog: React.FC<EditRolesDialogProps> = ({
  adminData,
  roles,
  onClose,
  canEditRoles
}) => {
  const adminId = adminData.id;

  // Fix the null check for roles mapping
  const currentRoles = adminData.roles && Array.isArray(adminData.roles)
    ? adminData.roles.map((userRole: AdminRole) => {
      return normalizeRole(userRole).name;
    }).filter(Boolean) as string[]
    : [];

  const [selectedRoles, setSelectedRoles] = useState<string[]>(currentRoles);

  const { updateRolesPayload, updateRolesIsLoading } = useUpdateAdminRoles(
    (response: UpdateRolesResponse) => {
      toast.success("Admin roles updated successfully");
      onClose();
    }
  );

  const handleRoleToggle = (roleName: string) => {
    setSelectedRoles(prev =>
      prev.includes(roleName)
        ? prev.filter(r => r !== roleName)
        : [...prev, roleName]
    );
  };

  const handleSubmit = async () => {
    if (!adminId) {
      console.error("❌ No admin ID provided");
      toast.error("Admin ID is missing");
      return;
    }

    console.log("🔍 Starting role update:", {
      adminId,
      selectedRoles,
      originalRoles: currentRoles,
      changes: {
        added: selectedRoles.filter(role => !currentRoles.includes(role)),
        removed: currentRoles.filter(role => !selectedRoles.includes(role))
      }
    });

    try {
      console.log("📡 Calling updateRolesPayload with:", { adminId, selectedRoles });
      console.log("🔍 Request details that will be sent:");
      console.log("- URL:", `admin/manage/${adminId}/roles`);
      console.log("- Method: PUT");
      console.log("- Body:", JSON.stringify({ roleNames: selectedRoles }));
      console.log("- Headers: Authorization: Bearer [token], Content-Type: application/json");

      const result = await updateRolesPayload(adminId, selectedRoles);
      console.log("✅ Update successful:", result);

      // Success handling is in the hook's onSuccess callback
    } catch (error: any) {
      console.error("❌ Update roles error:", error);

      // More detailed error logging
      if (error && typeof error === 'object' && error.response) {
        console.error("Error response:", {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });

        if (error.response.status === 403) {
          toast.error("Permission denied: Backend restricts editing other admin accounts. Contact system administrator.");
        } else if (error.response.status === 404) {
          toast.error("Admin not found");
        } else {
          toast.error(`Update failed: ${error.response.data?.error || error.response.statusText}`);
        }
      } else if (error && typeof error === 'object' && error.message) {
        toast.error(`Update failed: ${error.message}`);
      } else if (typeof error === 'string') {
        toast.error(`Update failed: ${error}`);
      } else {
        toast.error("Failed to update roles - unknown error");
      }
    }
  };

  if (!canEditRoles) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Permission Denied</DialogTitle>
          </DialogHeader>
          <p>You don't have permission to edit admin roles.</p>
          <div className="flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="right-[30px] p-8 max-w-[35.56rem]">
        <DialogHeader>
          <DialogTitle className="mb-6 text-2xl font-bold text-[#111827] flex gap-4.5 items-center">
            <div onClick={onClose} className="cursor-pointer">
              <ChevronLeft size={24} />
            </div>
            Edit Admin Roles
          </DialogTitle>
        </DialogHeader>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">
            Select roles for {adminData.fullName || "this administrator"}
          </h3>

          {Array.isArray(roles) && roles.length > 0 ? (
            <div className="space-y-4">
              {roles.map((role) => (
                <div key={role.id} className="flex items-center space-x-3 p-3 border rounded-md">
                  <input
                    type="checkbox"
                    id={`role-${role.id}`}
                    className="h-5 w-5 rounded border-gray-300"
                    checked={selectedRoles.includes(role.name)}
                    onChange={() => handleRoleToggle(role.name)}
                  />
                  <div>
                    <label htmlFor={`role-${role.id}`} className="font-medium text-sm text-gray-900">
                      {role.name.replace(/_/g, " ")}
                    </label>
                    <p className="text-sm text-gray-500">{role.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <p className="text-sm text-red-500">Failed to load roles</p>
              <p className="text-xs text-gray-500">
                No roles available for selection
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" className="px-6" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="warning"
            className="px-6"
            onClick={handleSubmit}
            disabled={updateRolesIsLoading}
          >
            {updateRolesIsLoading ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const GeneralInfo: React.FC<GeneralInfoProps> = ({ adminData, roles }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { currentAdmin, isLoading: isCurrentAdminLoading } = useGetCurrentAdmin();

  // Fetch roles if not provided via props
  const { rolesData, isRolesLoading } = useGetAdminRoles({ enabled: !roles || roles.length === 0 });

  // Normalize roles - handle both array and object with data property
  const normalizeRoles = (rolesInput: any) => {
    if (Array.isArray(rolesInput)) {
      return rolesInput;
    }
    if (rolesInput && typeof rolesInput === 'object') {
      // Check if it has a data property that's an array
      if (Array.isArray(rolesInput.data)) {
        return rolesInput.data;
      }
      // Check if it has other common API response patterns
      if (Array.isArray(rolesInput.roles)) {
        return rolesInput.roles;
      }
      if (Array.isArray(rolesInput.result)) {
        return rolesInput.result;
      }
    }
    return [];
  };

  // Use provided roles or fetched roles
  const normalizedPropRoles = normalizeRoles(roles);
  const normalizedFetchedRoles = normalizeRoles(rolesData);
  const availableRoles = normalizedPropRoles.length > 0 ? normalizedPropRoles : normalizedFetchedRoles;

  // Cast currentAdmin to Admin type to fix TypeScript issues
  const typedCurrentAdmin = currentAdmin as Admin | null;

  // Add debugging for roles prop
  console.log("🔍 GeneralInfo Debug:", {
    originalRoles: roles,
    originalRolesType: typeof roles,
    normalizedPropRoles: normalizedPropRoles,
    fetchedRoles: rolesData,
    normalizedFetchedRoles: normalizedFetchedRoles,
    availableRoles: availableRoles,
    availableRolesLength: availableRoles?.length,
    isRolesLoading: isRolesLoading,
    currentAdmin: typedCurrentAdmin,
    currentAdminRoles: typedCurrentAdmin?.roles,
    isCurrentAdminLoading: isCurrentAdminLoading,
  });

  // TEMPORARY: Force true while backend route is being fixed
  const canEditRoles = true;

  // TODO: Restore this after backend route is working
  // const canEditRoles = useMemo(() => {
  //   // ... permission check logic
  // }, [typedCurrentAdmin, isCurrentAdminLoading]);

  // Safely extract roles for display
  const displayRoles = adminData.roles?.map((roleItem: AdminRole) => {
    return normalizeRole(roleItem);
  }).filter(role => role.name) || [];

  const colors = [
    { bg: "#E7F7EF", color: "#0CAF60" },
    { bg: "#FFF6D3", color: "#E6BB20" },
    { bg: "#FFEDEC", color: "#E03137" },
    { bg: "#E6F0FF", color: "#2F78EE" },
  ];

  return (
    <>
      <div className="border border-[#F1F2F4] rounded-[1rem] p-6 mb-6">
        <h5 className="pb-4 mb-4 border-b border-[#F1F2F4] text-[#111827] font-semibold">
          Personal Info
        </h5>
        <div className="flex justify-between gap-[2rem] flex-col md:flex-row">
          <div className="w-full">
            <div className="flex justify-between mb-4">
              <p className="text-sm text-[#687588]">Full Name</p>
              <p className="text-sm text-[#111827] font-semibold">
                {adminData?.fullName || adminData?.adminProfile?.fullName || "Not specified"}
              </p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-sm text-[#687588]">Email Address</p>
              <p className="text-sm text-[#111827] font-semibold">
                {adminData?.email || "Not specified"}
              </p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-sm text-[#687588]">Created On</p>
              <p className="text-sm text-[#111827] font-semibold">
                {adminData?.createdAt
                  ? new Date(adminData.createdAt).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                  : "Not specified"}
              </p>
            </div>
          </div>
          <div className="w-full">
            <div className="flex justify-between mb-4">
              <p className="text-sm text-[#687588]">Status</p>
              <p className="text-sm text-[#111827] font-semibold">
                {adminData?.adminStatus || adminData?.status || "Active"}
              </p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-sm text-[#687588]">Last Login</p>
              <p className="text-sm text-[#111827] font-semibold">
                {adminData?.lastLogin
                  ? new Date(adminData.lastLogin).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                  : "Not available"}
              </p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-sm text-[#687588]">Phone Number</p>
              <p className="text-sm text-[#111827] font-semibold">
                {adminData?.phone || adminData?.adminProfile?.phone || "Not provided"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="border border-[#F1F2F4] rounded-[1rem] p-6">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#F1F2F4]">
          <h5 className="text-[#111827] font-semibold">Role</h5>
          <div className="flex gap-2">
            {canEditRoles && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditDialogOpen(true)}
                className="px-4"
                disabled={isCurrentAdminLoading}
              >
                {isCurrentAdminLoading ? "Loading..." : "Edit Roles"}
              </Button>
            )}
            <Button variant="ghost" size="icon">
              <HorizontalDots />
            </Button>
          </div>
        </div>
        <div className="flex gap-[4rem] items-center flex-col md:flex-row">
          <div>
            <p className="text-sm text-[#687588]">Current Role(s)</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {displayRoles.length > 0 ? (
              displayRoles.map((role, index: number) => {
                const colorIndex = index % colors.length;
                const { bg, color } = colors[colorIndex];

                return (
                  <p
                    key={role.id || index}
                    className="text-xs font-medium py-2 px-2.5 rounded-[10px]"
                    style={{ backgroundColor: bg, color: color }}
                  >
                    {role.name?.replace(/_/g, " ") || "Unknown Role"}
                  </p>
                );
              })
            ) : (
              <p className="text-xs font-medium py-2 px-2.5 rounded-[10px] bg-gray-100 text-gray-500">
                No roles assigned
              </p>
            )}
          </div>
        </div>
      </div>

      {isEditDialogOpen && (
        <EditRolesDialog
          adminData={adminData}
          roles={availableRoles || []}
          onClose={() => setIsEditDialogOpen(false)}
          canEditRoles={canEditRoles}
        />
      )}
    </>
  );
};

export default GeneralInfo;