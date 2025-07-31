import { HorizontalDots } from "../../../../../../../public/icons";
import { Button } from "@/components/ui/button";
import { useState, useMemo, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft } from "lucide-react";
import { useUpdateAdminRoles, useGetCurrentAdmin, useGetAdminRoles } from "@/services/admin";
import { toast } from "sonner";
import { Admin, AdminRole, Role, Permission } from "@/types/admin";

interface GeneralInfoProps {
  adminData: Admin;
  roles: Role[] | any; // Allow any type to handle API response objects
}

interface EditRolesDialogProps {
  adminData: Admin;
  roles: Role[];
  onClose: () => void;
  canEditRoles: boolean;
}

// Helper function to normalize role data structure
const normalizeRole = (roleItem: AdminRole): Role => {
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

// Improved function to normalize roles from API responses
const normalizeRoles = (rolesInput: any): Role[] => {
  console.log("🔍 normalizeRoles input:", rolesInput);

  // Handle null/undefined
  if (!rolesInput) {
    console.log("❌ No roles input provided");
    return [];
  }

  let rolesArray: any[] = [];

  // Extract array from various API response patterns
  if (Array.isArray(rolesInput)) {
    rolesArray = rolesInput;
  } else if (rolesInput && typeof rolesInput === 'object') {
    // Try common API response patterns
    if (Array.isArray(rolesInput.data)) {
      rolesArray = rolesInput.data;
    } else if (Array.isArray(rolesInput.roles)) {
      rolesArray = rolesInput.roles;
    } else if (Array.isArray(rolesInput.result)) {
      rolesArray = rolesInput.result;
    } else if (Array.isArray(rolesInput.items)) {
      rolesArray = rolesInput.items;
    }
  }

  console.log("🔍 Extracted roles array:", rolesArray);

  // Normalize each role object
  const normalized = rolesArray.map((role: any) => {
    // Handle nested role structure (role.role.name)
    const roleData = role.role || role;

    return {
      id: roleData.id || role.id || 0,
      name: roleData.name || role.name || '',
      description: roleData.description || role.description || '',
      permissions: roleData.permissions || role.permissions || []
    };
  }).filter(role => role.name); // Only keep roles with names

  console.log("✅ Normalized roles:", normalized);
  return normalized;
};

const EditRolesDialog: React.FC<EditRolesDialogProps> = ({
  adminData,
  roles,
  onClose,
  canEditRoles
}) => {
  const adminId = adminData.id;

  // Get current roles safely
  const currentRoles = useMemo(() => {
    if (!adminData.roles || !Array.isArray(adminData.roles)) {
      return [];
    }

    return adminData.roles
      .map((userRole: AdminRole) => normalizeRole(userRole).name)
      .filter(Boolean) as string[];
  }, [adminData.roles]);

  const [selectedRoles, setSelectedRoles] = useState<string[]>(currentRoles);

  // Update selected roles when current roles change
  useEffect(() => {
    setSelectedRoles(currentRoles);
  }, [currentRoles]);

  const { updateRoles, isLoading: updateRolesIsLoading } = useUpdateAdminRoles();

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

    const changes = {
      added: selectedRoles.filter(role => !currentRoles.includes(role)),
      removed: currentRoles.filter(role => !selectedRoles.includes(role))
    };

    // Don't make API call if no changes
    if (changes.added.length === 0 && changes.removed.length === 0) {
      toast.info("No changes to save");
      onClose();
      return;
    }

    console.log("🔍 Starting role update:", {
      adminId,
      selectedRoles,
      originalRoles: currentRoles,
      changes
    });

    try {
      console.log("📡 Calling updateRoles with:", { adminId, selectedRoles });

      const result = await updateRoles(adminId, selectedRoles);
      console.log("✅ Update successful:", result);

      toast.success("Admin roles updated successfully");
      onClose();

    } catch (error: any) {
      console.error("❌ Update roles error:", error);

      // Enhanced error handling
      if (error?.response) {
        const { status, statusText, data } = error.response;
        console.error("Error response:", { status, statusText, data });

        switch (status) {
          case 403:
            toast.error("Permission denied: You don't have permission to edit admin roles.");
            break;
          case 404:
            toast.error("Admin not found");
            break;
          case 400:
            toast.error(`Invalid request: ${data?.message || data?.error || 'Bad request'}`);
            break;
          case 500:
            toast.error("Server error. Please try again later.");
            break;
          default:
            toast.error(`Update failed: ${data?.error || data?.message || statusText}`);
        }
      } else if (error?.message) {
        toast.error(`Update failed: ${error.message}`);
      } else if (typeof error === 'string') {
        toast.error(`Update failed: ${error}`);
      } else {
        toast.error("Failed to update roles - unknown error");
      }
    }
  };

  // Permission check dialog
  if (!canEditRoles) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Permission Denied</DialogTitle>
          </DialogHeader>
          <p>You don't have permission to edit admin roles.</p>
          <div className="flex justify-end mt-4">
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Loading state
  if (!roles || roles.length === 0) {
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
          <div className="flex justify-center py-8">
            <p>Loading roles...</p>
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
            Select roles for {adminData.fullName || adminData?.adminProfile?.fullName || "this administrator"}
          </h3>

          <div className="space-y-4">
            {roles.map((role) => (
              <div key={role.id} className="flex items-center space-x-3 p-3 border rounded-md hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  id={`role-${role.id}`}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={selectedRoles.includes(role.name)}
                  onChange={() => handleRoleToggle(role.name)}
                />
                <div className="flex-1">
                  <label htmlFor={`role-${role.id}`} className="font-medium text-sm text-gray-900 cursor-pointer">
                    {role.name.replace(/_/g, " ")}
                  </label>
                  {role.description && (
                    <p className="text-sm text-gray-500 mt-1">{role.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Show current vs new selection */}
          {selectedRoles.length !== currentRoles.length ||
            !selectedRoles.every(role => currentRoles.includes(role)) ? (
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm font-medium text-blue-900">Changes:</p>
              {selectedRoles.filter(role => !currentRoles.includes(role)).length > 0 && (
                <p className="text-xs text-green-700">
                  ➕ Adding: {selectedRoles.filter(role => !currentRoles.includes(role)).join(", ")}
                </p>
              )}
              {currentRoles.filter(role => !selectedRoles.includes(role)).length > 0 && (
                <p className="text-xs text-red-700">
                  ➖ Removing: {currentRoles.filter(role => !selectedRoles.includes(role)).join(", ")}
                </p>
              )}
            </div>
          ) : null}
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button
            variant="outline"
            className="px-6"
            onClick={onClose}
            disabled={updateRolesIsLoading}
          >
            Cancel
          </Button>
          <Button
            variant="warning"
            className="px-6"
            onClick={handleSubmit}
            disabled={updateRolesIsLoading || (
              selectedRoles.length === currentRoles.length &&
              selectedRoles.every(role => currentRoles.includes(role))
            )}
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
  const { rolesData, isRolesLoading } = useGetAdminRoles({
    enabled: !roles || normalizeRoles(roles).length === 0
  });

  // ✅ Improved roles normalization with memoization
  const availableRoles = useMemo(() => {
    // First try provided roles prop
    const propRoles = normalizeRoles(roles);
    if (propRoles.length > 0) {
      console.log("📋 Using provided roles:", propRoles);
      return propRoles;
    }

    // Fallback to fetched roles
    const fetchedRoles = normalizeRoles(rolesData);
    console.log("📋 Using fetched roles:", fetchedRoles);
    return fetchedRoles;
  }, [roles, rolesData]);

  // Debug logging
  useEffect(() => {
    console.log("🔍 GeneralInfo Debug:", {
      originalRoles: roles,
      originalRolesType: typeof roles,
      fetchedRoles: rolesData,
      availableRoles: availableRoles,
      availableRolesLength: availableRoles?.length,
      isRolesLoading: isRolesLoading,
      currentAdmin: currentAdmin as Admin | null,
      isCurrentAdminLoading: isCurrentAdminLoading,
    });
  }, [roles, rolesData, availableRoles, isRolesLoading, currentAdmin, isCurrentAdminLoading]);

  // Cast currentAdmin to Admin type
  const typedCurrentAdmin = currentAdmin as Admin | null;

  // Permission check - temporarily forced to true, restore commented logic when backend is ready
  const canEditRoles = true;

  // TODO: Restore this after backend route is working
  // const canEditRoles = useMemo(() => {
  //   if (isCurrentAdminLoading || !typedCurrentAdmin) {
  //     return false;
  //   }
  //   
  //   // Check if current admin has permission to edit roles
  //   const hasEditPermission = typedCurrentAdmin.roles?.some((roleItem: AdminRole) => {
  //     const role = normalizeRole(roleItem);
  //     return role.permissions?.some((permission: Permission) => 
  //       permission.name === 'manage_admin_roles' || 
  //       permission.name === 'edit_admin_roles' ||
  //       permission.name === 'admin_management'
  //     );
  //   });
  //   
  //   return hasEditPermission || false;
  // }, [typedCurrentAdmin, isCurrentAdminLoading]);

  // Safely extract roles for display
  const displayRoles = useMemo(() => {
    if (!adminData.roles || !Array.isArray(adminData.roles)) {
      return [];
    }

    return adminData.roles
      .map((roleItem: AdminRole) => normalizeRole(roleItem))
      .filter(role => role.name);
  }, [adminData.roles]);

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
                disabled={isCurrentAdminLoading || isRolesLoading}
              >
                {isCurrentAdminLoading || isRolesLoading ? "Loading..." : "Edit Roles"}
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

        {/* Debug info - remove this in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
            <p><strong>Debug:</strong> Available roles: {availableRoles.length}</p>
            <p><strong>Loading:</strong> {isRolesLoading ? 'Yes' : 'No'}</p>
          </div>
        )}
      </div>

      {isEditDialogOpen && (
        <EditRolesDialog
          adminData={adminData}
          roles={availableRoles}
          onClose={() => setIsEditDialogOpen(false)}
          canEditRoles={canEditRoles}
        />
      )}
    </>
  );
};

export default GeneralInfo;