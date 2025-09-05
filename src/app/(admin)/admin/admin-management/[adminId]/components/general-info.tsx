import React, { useState, useMemo } from "react";
import { HorizontalDots } from "../../../../../../../public/icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ShieldCheck, Users, AlertTriangle, Info } from "lucide-react";
import { useGetCurrentAdmin, useGetAdminRoles } from "@/services/admin";
import enhancedAdminService from "@/services/adminService";
import { useAuth } from "@/context/auth";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// Local type definitions to avoid import issues
interface Permission {
  id: number;
  name: string;
  description?: string;
  category?: string;
}

interface Role {
  id: number;
  name: string;
  description?: string;
  type?: string;
  permissions?: Permission[];
}

interface AdminRole {
  type: string | undefined;
  id?: number;
  roleId?: number;
  name?: string;
  description?: string;
  permissions?: Permission[];
  role?: Role;
}

interface Admin {
  id: number | string;
  email: string;
  username?: string;
  fullName?: string;
  phone?: string;
  status?: string;
  adminStatus?: string;
  roles?: AdminRole[];
  permissions?: Permission[];
  permissionCount?: number;
  adminProfile?: {
    username?: string;
    fullName?: string;
    phone?: string;
    gender?: string;
  };
  createdAt?: string;
  lastLogin?: string;
}

interface UpdateRolesResponse {
  success: boolean;
  message: string;
  data?: any;
}

interface GeneralInfoProps {
  adminData: Admin;
  roles: Role[] | any;
}

interface EditRolesDialogProps {
  adminData: Admin;
  roles: Role[];
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
  const { userData, forceRefreshUserData } = useAuth();

  // Get current roles with enhanced role-based validation
  const currentRoles = adminData.roles && Array.isArray(adminData.roles)
    ? adminData.roles.map((userRole: AdminRole) => {
      return normalizeRole(userRole).name;
    }).filter(Boolean) as string[]
    : [];

  const [selectedRoles, setSelectedRoles] = useState<string[]>(currentRoles);
  const [isUpdating, setIsUpdating] = useState(false);

  // Filter roles to only show admin-appropriate roles with enhanced validation
  const availableRoles = useMemo(() => {
    if (!Array.isArray(roles)) return [];

    return roles.filter((role: Role) => {
      // Handle roles with or without explicit type
      const roleType = role.type || 'ADMIN'; // Default to ADMIN if no type specified
      const roleName = role.name || '';

      // Only show ADMIN type roles or roles that look like admin roles
      const isAdminType = roleType === 'ADMIN' ||
        roleType === 'SUPER_ADMIN' ||
        roleName.toLowerCase().includes('admin') ||
        roleName.toLowerCase().includes('manager');

      // Exclude restricted system roles
      const isRestrictedRole = ['SUPER_ADMIN', 'INDIVIDUAL', 'BUSINESS', 'USER'].includes(roleName);

      return isAdminType && !isRestrictedRole;
    });
  }, [roles]);

  const handleRoleToggle = (roleName: string) => {
    setSelectedRoles(prev => {
      const newRoles = prev.includes(roleName)
        ? prev.filter(r => r !== roleName)
        : [...prev, roleName];

      console.log("Role toggle:", { roleName, newRoles });
      return newRoles;
    });
  };

  // ✅ Enhanced handleSubmit with comprehensive role change handling
  const handleSubmit = async () => {
    if (!adminId) {
      console.error("❌ No admin ID provided");
      toast.error("Admin ID is missing");
      return;
    }

    if (selectedRoles.length === 0) {
      toast.error("At least one role must be assigned to maintain access");
      return;
    }

    console.log("🔍 Starting enhanced role update:", {
      adminId,
      selectedRoles,
      originalRoles: currentRoles,
      changes: {
        added: selectedRoles.filter(role => !currentRoles.includes(role)),
        removed: currentRoles.filter(role => !selectedRoles.includes(role))
      }
    });

    setIsUpdating(true);
    try {
      console.log(`🔄 Calling enhancedAdminService.updateAdminRoles for admin ${adminId}:`, selectedRoles);

      // ✅ CRITICAL: This should automatically emit the role change event
      const result = await enhancedAdminService.updateAdminRoles(adminId, selectedRoles);

      console.log("✅ Role update API call successful:", result);

      // ✅ If current user's roles changed, force immediate auth refresh
      if (userData && String(userData.id) === String(adminId)) {
        console.log("🔄 Current user's roles changed, forcing immediate refresh...");

        // Force auth context refresh with multiple attempts
        await forceRefreshUserData();

        // Additional refresh with delay to ensure sidebar processes the change
        setTimeout(async () => {
          console.log("🔄 Secondary auth refresh for sidebar update...");
          await forceRefreshUserData();
        }, 200);

        // Final refresh to ensure everything is updated
        setTimeout(async () => {
          console.log("🔄 Final auth refresh...");
          await forceRefreshUserData();
        }, 500);
      }

      toast.success("Admin roles updated successfully - sidebar will refresh momentarily");
      onClose();

    } catch (error: any) {
      console.error("❌ Failed to update admin roles:", error);

      if (error && typeof error === 'object' && error.response) {
        if (error.response.status === 403) {
          toast.error("Permission denied: Only Super Admin can modify admin roles");
        } else if (error.response.status === 404) {
          toast.error("Admin not found");
        } else {
          toast.error(`Update failed: ${error.response.data?.error || error.response.statusText}`);
        }
      } else {
        toast.error("Failed to update roles - please try again");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  if (!canEditRoles) {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Permission Required
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>You don't have sufficient permissions to edit admin roles.</p>
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-3">
                <p className="text-sm text-amber-800">
                  Only Super Admins can modify role assignments to maintain security integrity.
                </p>
              </CardContent>
            </Card>
          </div>
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
            <ShieldCheck className="h-6 w-6 text-blue-600" />
            Edit Role-Based Access
          </DialogTitle>
        </DialogHeader>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">
              Assign roles for {adminData.fullName || "this administrator"}
            </h3>
          </div>

          <Card className="border-blue-200 bg-blue-50 mb-4">
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Role-Based Access Control</p>
                  <p>Selected roles will determine this admin's permissions automatically.</p>
                  <p className="text-xs mt-1">✨ Changes will be applied immediately to sidebar and permissions</p>
                </div>
              </div>
            </CardContent>
          </Card>




          {availableRoles.length > 0 ? (
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {availableRoles.map((role: Role) => {
                const isSelected = selectedRoles.includes(role.name);
                return (
                  <div key={role.id} className={`
                    flex items-start space-x-3 p-4 border rounded-md cursor-pointer transition-colors
                    ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
                  `}>
                    <input
                      type="checkbox"
                      id={`role-${role.id}`}
                      className="h-5 w-5 rounded border-gray-300 mt-0.5"
                      checked={isSelected}
                      onChange={() => handleRoleToggle(role.name)}
                      disabled={isUpdating}
                    />
                    <div className="flex-1">
                      <label htmlFor={`role-${role.id}`} className="font-medium text-sm text-gray-900 cursor-pointer">
                        {role.name.replace(/_/g, " ")}
                      </label>
                      {role.description && (
                        <p className="text-sm text-gray-500 mt-1">{role.description}</p>
                      )}
                      {role.type && (
                        <p className="text-xs text-gray-400 mt-1">Type: {role.type}</p>
                      )}
                      {role.permissions && (
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {role.permissions.length} permissions
                          </Badge>
                          {isSelected && (
                            <Badge variant="success" className="text-xs">
                              Selected
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-4">
                <div className="text-center">
                  <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-amber-800">No assignable roles available</p>
                  <p className="text-xs text-amber-700 mt-1">
                    Contact your system administrator to configure admin roles.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Role Summary */}
        {selectedRoles.length > 0 && (
          <Card className="border-green-200 bg-green-50 mb-6">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">
                  {selectedRoles.length} role{selectedRoles.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {selectedRoles.map(roleName => (
                  <Badge key={roleName} variant="success" className="text-xs">
                    {roleName.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" className="px-6" onClick={onClose} disabled={isUpdating}>
            Cancel
          </Button>
          <Button
            variant="warning"
            className="px-6"
            onClick={handleSubmit}
            disabled={isUpdating || selectedRoles.length === 0 || availableRoles.length === 0}
          >
            {isUpdating ? "Updating..." : "Apply Role Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const GeneralInfo: React.FC<GeneralInfoProps> = ({ adminData, roles }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { userData } = useAuth();

  // ✅ Use unified hooks + enhanced role change detection
  const { currentAdmin, isLoading: isCurrentAdminLoading } = useGetCurrentAdmin();
  const { rolesData, isRolesLoading } = useGetAdminRoles({ enabled: !roles || roles.length === 0 });

  // ✅ Enhanced: Listen for role changes affecting this admin
  React.useEffect(() => {
    const handleRoleChange = (event: CustomEvent) => {
      const { adminId, newRoles, timestamp } = event.detail;

      console.log("🔄 GeneralInfo detected role change:", {
        eventAdminId: adminId,
        currentAdminId: adminData.id,
        rolesCount: Array.isArray(newRoles) ? newRoles.length : 0,
        timestamp
      });

      // If this admin's roles changed, you might want to refresh the data
      if (String(adminId) === String(adminData.id)) {
        console.log(`🔄 Detected role change for current admin ${adminId}, component may need refresh`);

      }
    };

    window.addEventListener('admin-role-changed', handleRoleChange as EventListener);

    return () => {
      window.removeEventListener('admin-role-changed', handleRoleChange as EventListener);
    };
  }, [adminData.id]);

  // Normalize roles - handle both array and object with data property
  const normalizeRoles = (rolesInput: any): Role[] => {
    if (Array.isArray(rolesInput)) {
      return rolesInput;
    }
    if (rolesInput && typeof rolesInput === 'object') {
      if (Array.isArray(rolesInput.data)) {
        return rolesInput.data;
      }
      if (Array.isArray(rolesInput.roles)) {
        return rolesInput.roles;
      }
      if (Array.isArray(rolesInput.result)) {
        return rolesInput.result;
      }
    }
    return [];
  };

  const normalizedPropRoles = normalizeRoles(roles);
  const normalizedFetchedRoles = normalizeRoles(rolesData);
  const availableRoles = normalizedPropRoles.length > 0 ? normalizedPropRoles : normalizedFetchedRoles;

  const typedCurrentAdmin = currentAdmin as Admin | null;

  // ✅ Enhanced permission check for role management
  const canEditRoles = useMemo((): boolean => {
    if (!typedCurrentAdmin || isCurrentAdminLoading) return false;

    console.log('🔍 Checking role edit permissions:', {
      currentAdmin: typedCurrentAdmin?.email,
      roles: typedCurrentAdmin?.roles?.map(r => ({
        name: r.role?.name || r.name,
        type: r.role?.type || r.type
      })),
      adminProfile: typedCurrentAdmin?.adminProfile
    });

    // ✅ CRITICAL: Only Super Admin can edit roles based on backend routes
    const isSuperAdmin =
      // Check role name
      typedCurrentAdmin.roles?.some(
        role => (role.role?.name === 'SUPER_ADMIN' || role.name === 'SUPER_ADMIN')
      ) ||
      // Check adminProfile for super admin
      typedCurrentAdmin.adminProfile?.username?.toLowerCase() === 'superadmin' ||
      // Check if explicitly marked as super admin
      (typedCurrentAdmin as any).isSuperAdmin === true;

    console.log('🔍 Super Admin check result:', {
      isSuperAdmin,
      hasRoles: !!typedCurrentAdmin.roles,
      roleCount: typedCurrentAdmin.roles?.length || 0,
      adminProfileUsername: typedCurrentAdmin.adminProfile?.username
    });

    return isSuperAdmin;
  }, [typedCurrentAdmin, isCurrentAdminLoading]);

  // Extract roles for display with enhanced information
  const displayRoles = adminData.roles?.map((roleItem: AdminRole) => {
    return normalizeRole(roleItem);
  }).filter(role => role.name) || [];

  // Calculate total permissions across all roles
  const totalPermissions = displayRoles.reduce((total, role) => {
    return total + (role.permissions?.length || 0);
  }, 0);

  const colors = [
    { bg: "#E7F7EF", color: "#0CAF60" },
    { bg: "#FFF6D3", color: "#E6BB20" },
    { bg: "#FFEDEC", color: "#E03137" },
    { bg: "#E6F0FF", color: "#2F78EE" },
    { bg: "#F3E8FF", color: "#8B5CF6" },
    { bg: "#FEF3C7", color: "#F59E0B" },
  ];

  return (
    <>
      <div className="border border-[#F1F2F4] rounded-[1rem] p-6 mb-6">
        <h5 className="pb-4 mb-4 border-b border-[#F1F2F4] text-[#111827] font-semibold">
          Personal Information
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
              <p className="text-sm text-[#687588]">Account Status</p>
              <div className="flex items-center gap-2">
                <Badge
                  variant={adminData?.adminStatus?.toLowerCase() === 'active' ? 'success' : 'warning'}
                  className="text-xs"
                >
                  {adminData?.adminStatus || adminData?.status || "Active"}
                </Badge>
              </div>
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
            <div className="flex justify-between mb-4">
              <p className="text-sm text-[#687588]">Gender</p>
              <p className="text-sm text-[#111827] font-semibold">
                {adminData?.adminProfile?.gender || "Not Available"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-[#F1F2F4] rounded-[1rem] p-6">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#F1F2F4]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            <h5 className="text-[#111827] font-semibold">Role-Based Access</h5>
          </div>
          <div className="flex gap-2">
            {canEditRoles && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditDialogOpen(true)}
                className="px-4 flex items-center gap-1"
                disabled={isCurrentAdminLoading}
              >
                <Users className="h-4 w-4" />
                {isCurrentAdminLoading ? "Loading..." : "Edit Roles"}
              </Button>
            )}
            <Button variant="ghost" size="icon">
            
            </Button>
          </div>
        </div>

        {/* Enhanced role information summary */}
        <div className="mb-4">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    {displayRoles.length} role{displayRoles.length !== 1 ? 's' : ''} assigned
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {totalPermissions} total permissions
                  </Badge>
                  {userData && String(userData.id) === String(adminData.id) && (
                    <Badge variant="secondary" className="text-xs">
                      Current User
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-[4rem] items-start flex-col md:flex-row">
          <div className="min-w-[120px]">
            <p className="text-sm text-[#687588]">Current Role(s)</p>
          </div>
          <div className="flex flex-wrap gap-3 flex-1">
            {displayRoles.length > 0 ? (
              displayRoles.map((role, index: number) => {
                const colorIndex = index % colors.length;
                const { bg, color } = colors[colorIndex];

                return (
                  <div key={role.id || index} className="flex flex-col gap-1">
                    <div
                      className="text-xs font-medium py-2 px-2.5 rounded-[10px] flex items-center gap-1"
                      style={{ backgroundColor: bg, color: color }}
                    >
                      <ShieldCheck className="h-3 w-3" />
                      {role.name?.replace(/_/g, " ") || "Unknown Role"}
                    </div>
                    {role.permissions && role.permissions.length > 0 && (
                      <div className="text-xs text-gray-500 text-center">
                        {role.permissions.length} permission{role.permissions.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 text-amber-800">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-xs font-medium">No roles assigned</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Role-based access notice */}
        <div className="mt-4 pt-4 border-t border-[#F1F2F4]">
          <div className="text-xs text-[#687588]">
            <p className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              Permissions are automatically inherited from assigned roles
            </p>
            {userData && String(userData.id) === String(adminData.id) && (
              <p className="flex items-center gap-1 mt-1 text-blue-600">
                <Info className="h-3 w-3" />
                Role changes will update your sidebar immediately
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced dialog */}
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