"use client";
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, DeleteIcon, ViewIcon, PersonIcon, RepIcon } from "../../../../../../public/icons";
import { TableComponent } from "@/components/custom-table";
import { SelectFilter } from "@/app/(admin)/components/select-filter";
import { InputFilter } from "@/app/(admin)/components/input-filter";
import Link from "next/link";
import { ROUTES } from "@/constant/routes";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useDeleteAdmin, useGetAdminRoles } from "@/services/admin";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle } from "lucide-react";

// Local type definitions to avoid import conflicts
interface AdminRole {
  id?: number;
  roleId?: number;
  name?: string;
  description?: string;
  role?: {
    id: number;
    name?: string;
    description?: string;
    permissions?: any[];
  };
}

interface AdminProfile {
  username?: string;
  fullName?: string;
  phone?: string;
  gender?: string;
}

interface Admin {
  id: number | string;
  email?: string;
  username?: string;
  fullName?: string;
  phone?: string;
  gender?: string;
  status?: string;
  adminStatus?: string;
  roles?: AdminRole[];
  permissionCount?: number;
  adminProfile?: AdminProfile;
  createdAt?: string;
  lastLogin?: string;
  invitationStatus?: 'COMPLETED' | 'PENDING' | 'EXPIRED' | 'CANCELLED';
}

// ✅ FIX: Match the exact structure expected by TableComponent (with typo)
interface TableRowData {
  id: number | string;
  email: string;
  name: string;
  profile: {
    username: string;
    fullName: string;
    phone: string;
    gender: string;
  };
  role: string;
  description: string;
  date: string;
  status: string;
  createdAt: string;
  roles: {
    role: {
      id: number;
      name: string;
      discription: string;
    };
  };
  rolecount: string;
  action: string;
  formattedRole: string;
  formattedDate: string;
  originalAdmin?: Admin;
  isRoleBased: boolean;
  invitationStatus?: 'COMPLETED' | 'PENDING' | 'EXPIRED' | 'CANCELLED';
  roleCount: number;

  // Add index signature
  [key: string]: any;
}

interface DataTableProps {
  adminData: Admin[];
  loading: boolean;
  refetch: () => void;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  totalPages?: number;
}

const DataTable: React.FC<DataTableProps> = ({
  adminData,
  loading,
  refetch,
  currentPage: externalCurrentPage,
  onPageChange: externalOnPageChange,
  totalPages: externalTotalPages,
}) => {
  const pageSize = 10;
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [nameFilter, setNameFilter] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);
  const [email, setEmail] = useState("");

  // ✅ NEW: Fetch roles data for dynamic filter
  // const { rolesData, isRolesLoading } = useGetAdminRoles({ enabled: true });

      const { rolesData, isRolesLoading, refetchRoles } = useGetAdminRoles({
        enabled: true,
        
        limit: 1000,
      });

  // Use external pagination if provided, otherwise use internal
  const currentPage = externalCurrentPage || internalCurrentPage;
  const onPageChange = externalOnPageChange || setInternalCurrentPage;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");
      if (storedEmail) setEmail(storedEmail);

      // ✅ NEW: Store current page and filters in sessionStorage for back navigation
      const currentState = {
        currentPage,
        roleFilter,
        statusFilter,
        nameFilter,
      };
      sessionStorage.setItem('adminTableState', JSON.stringify(currentState));
    }
  }, [currentPage, roleFilter, statusFilter, nameFilter]);

  // ✅ NEW: Restore state on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedState = sessionStorage.getItem('adminTableState');
      if (savedState) {
        const state = JSON.parse(savedState);
        if (state.currentPage && !externalCurrentPage) {
          setInternalCurrentPage(state.currentPage);
        }
        if (state.roleFilter) setRoleFilter(state.roleFilter);
        if (state.statusFilter) setStatusFilter(state.statusFilter);
        if (state.nameFilter) setNameFilter(state.nameFilter);
      }
    }
  }, []);

  const { deleteAdminPayload: deleteAdmin, deleteAdminIsLoading } = useDeleteAdmin();

  // Ensure adminData is an array and filter it properly
  const safeAdminData = Array.isArray(adminData) ? adminData : [];

  // const safeAdminData = adminData && Array.isArray(adminData) ? adminData : [];

  const filteredData: Admin[] = safeAdminData.filter((admin) => {
    if (!admin || typeof admin !== 'object') return false;

    const username = admin.username || admin.adminProfile?.username || admin.fullName || "";
    const adminEmail = admin.email || "";

    const nameMatch = nameFilter
      ? username.toLowerCase().includes(nameFilter.toLowerCase()) ||
      adminEmail.toLowerCase().includes(nameFilter.toLowerCase())
      : true;

    // Enhanced role matching for role-based system
    const roleNames = admin.roles?.map(ur => ur.role?.name || ur.name).filter(Boolean) || [];

    const roleMatch = roleFilter && roleFilter !== "select"
      ? roleNames.some(roleName => roleName && roleName.toLowerCase() === roleFilter.toLowerCase())
      : true;

    const status = admin.adminStatus || admin.status || "";
    const statusMatch = statusFilter && statusFilter !== "select"
      ? status.toLowerCase() === statusFilter.toLowerCase()
      : true;

    return nameMatch && roleMatch && statusMatch;
  });

  // ✅ FIX: Transform Admin data to match TableComponent requirements (including typo)
  const tableData: TableRowData[] = filteredData.map((admin: Admin) => {
    // Enhanced role processing for role-based system
    const roleNames = admin.roles?.map(ur => ur.role?.name || ur.name).filter(Boolean) || [];
    const primaryRole = roleNames[0] || "No Role";
    const roleDescriptions = admin.roles?.map(ur => ur.role?.description || ur.description).filter(Boolean) || [];
    const primaryDescription = roleDescriptions[0] || "No description available";

    // Determine invitation/account status
    const accountStatus = admin.adminStatus || admin.status || "ACTIVE";

    // ✅ FIX: Use 'discription' (with typo) to match TableComponent expectation
    const transformedRoles = {
      role: {
        id: admin.roles?.[0]?.role?.id || admin.roles?.[0]?.id || 0,
        name: primaryRole,
        discription: primaryDescription, // ✅ FIX: Use typo 'discription' not 'description'
      }
    };

    const adminData: TableRowData = {
      id: admin.id,
      email: admin.email || "N/A",
      name: admin.fullName || admin.username || admin.adminProfile?.username || "N/A",
      profile: {
        username: admin.username || admin.adminProfile?.username || "N/A",
        fullName: admin.fullName || admin.adminProfile?.fullName || "N/A",
        phone: admin.phone || admin.adminProfile?.phone || "N/A",
        gender: admin.gender || admin.adminProfile?.gender || "N/A",
      },
      role: primaryRole,
      description: primaryDescription,
      date: admin.createdAt || new Date().toISOString(),
      status: accountStatus,
      createdAt: admin.createdAt || new Date().toISOString(),
      roles: transformedRoles, // ✅ Now uses 'discription' field
      rolecount: String(roleNames.length),
      action: "",

      // Enhanced fields for role-based system
      formattedRole: roleNames.length > 1
        ? `${primaryRole} (+${roleNames.length - 1} more)`
        : primaryRole === "super_admin"
          ? "Super Admin"
          : primaryRole.replace(/_/g, " "),
      formattedDate: admin.createdAt
        ? new Date(admin.createdAt).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        : "N/A",
      originalAdmin: admin,
      isRoleBased: true,
      invitationStatus: admin.invitationStatus,
      roleCount: roleNames.length,
    };

    return adminData;
  });

  const handleDeleteAdmin = async () => {
    if (!adminToDelete?.id) {
      toast.error("No admin selected for deletion");
      return;
    }

    try {
      await deleteAdmin(adminToDelete.id);
      toast.success("Admin deleted successfully");
      setDeleteDialogOpen(false);
      setAdminToDelete(null);
      refetch();
    } catch (error: any) {
      console.error("Delete admin error:", error);
      const errorMessage = error?.response?.data?.error ||
        error?.message ||
        "Failed to delete admin";
      toast.error(errorMessage);
    }
  };

  const openDeleteDialog = (admin: Admin) => {
    setAdminToDelete(admin);
    setDeleteDialogOpen(true);
  };

  // Enhanced filter lists for role-based system
  const statusList = [
    { text: "All Status", value: "select" },
    { text: "Active", value: "active" },
    { text: "Pending Invitation", value: "pending" },
    { text: "Inactive", value: "inactive" },
    { text: "Suspended", value: "suspended" },
  ];

  // ✅ NEW: Generate dynamic role list from API data
  const generateRoleList = () => {
    const roleList = [{ text: "All Roles", value: "select" }];
    
    if (rolesData && Array.isArray(rolesData)) {
      // If rolesData is directly an array
      const roles = rolesData.map(role => ({
        text: role.name?.replace(/_/g, " ") || "Unknown Role",
        value: role.name?.toLowerCase() || ""
      }));
      roleList.push(...roles);
    } else if (rolesData?.data && Array.isArray(rolesData.data)) {
      // If rolesData has a data property with array
      const roles = rolesData.data.map((role: any) => ({
        text: role.name?.replace(/_/g, " ") || "Unknown Role",
        value: role.name?.toLowerCase() || ""
      }));
      roleList.push(...roles);
    } else if (rolesData?.roles && Array.isArray(rolesData.roles)) {
      // If rolesData has a roles property with array
      const roles = rolesData.roles.map((role: any) => ({
        text: role.name?.replace(/_/g, " ") || "Unknown Role",
        value: role.name?.toLowerCase() || ""
      }));
      roleList.push(...roles);
    }

    // Remove duplicates and sort
    const uniqueRoles = roleList.filter((role, index, self) => 
      index === self.findIndex((r) => r.value === role.value)
    );
    
    return uniqueRoles.sort((a, b) => {
      if (a.value === "select") return -1;
      if (b.value === "select") return 1;
      return a.text.localeCompare(b.text);
    });
  };

  const roleList = generateRoleList();

  const cellRenderers = {
    name: (item: TableRowData) => (
      <div className="flex flex-col gap-1 text-left">
        <div className="font-medium text-slate-800">
          {item.profile.fullName !== "N/A" ? item.profile.fullName :
            item.profile.username !== "N/A" ? item.profile.username :
              item.name !== "N/A" ? item.name : "Unknown"}
        </div>
        <div className="text-sm text-slate-500">{item.email !== "N/A" ? item.email : "No email"}</div>
        {item.roleCount > 1 && (
          <div className="text-xs text-blue-600">
            Multiple roles ({item.roleCount})
          </div>
        )}
      </div>
    ),
    role: (item: TableRowData) => (
      <div className="font-medium flex items-center gap-3 capitalize">
        {item.formattedRole.toLowerCase().includes("admin") ? (
          <PersonIcon />
        ) : (
          <RepIcon />
        )}
        <div className="flex flex-col">
          <span>{item.formattedRole}</span>
          {item.roleCount > 1 && (
            <span className="text-xs text-gray-500">
              {item.roleCount} roles assigned
            </span>
          )}
        </div>
      </div>
    ),
    description: (item: TableRowData) => (
      <div className="flex flex-col">
        <span className="font-medium">
          {item.description !== "No description available" ? item.description : "N/A"}
        </span>
        {item.originalAdmin?.permissionCount && (
          <span className="text-xs text-blue-600">
            {item.originalAdmin.permissionCount} permissions
          </span>
        )}
      </div>
    ),
    date: (item: TableRowData) => (
      <div className="font-medium flex items-center gap-3">
        <CalendarIcon />
        <div className="flex flex-col">
          <span>{item.formattedDate}</span>
          {item.invitationStatus === 'PENDING' && (
            <span className="text-xs text-amber-600 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Invitation pending
            </span>
          )}
        </div>
      </div>
    ),
    status: (item: TableRowData) => {
      const status = item.status?.toLowerCase();
      let variant: "success" | "tertiary" | "warning" | "destructive" = "warning";
      let statusText = item.status?.toUpperCase() || "UNKNOWN";

      // Enhanced status handling for role-based invitations
      if (status === "active") {
        variant = "success";
      } else if (status === "pending" || item.invitationStatus === 'PENDING') {
        variant = "tertiary";
        statusText = "PENDING INVITE";
      } else if (status === "suspended") {
        variant = "destructive";
      } else if (status === "inactive") {
        variant = "warning";
      }

      return (
        <div className="flex flex-col gap-1">
          <Badge
            variant={variant}
            className="py-1 px-[26px] font-medium"
          >
            {statusText}
          </Badge>
          {item.invitationStatus === 'PENDING' && (
            <span className="text-xs text-gray-500">
              Awaiting setup
            </span>
          )}
        </div>
      );
    },
    action: (item: TableRowData) => (
      <div className="flex gap-2.5">
        <Link
          href={`${ROUTES.ADMIN.SIDEBAR.ADMINS}/${item.id}?tab=general&from=table&page=${currentPage}&roleFilter=${roleFilter}&statusFilter=${statusFilter}&nameFilter=${nameFilter}`}
          className="bg-[#27A376] p-2.5 rounded-lg"
        >
          <ViewIcon />
        </Link>
        <button
          onClick={() => item.originalAdmin && openDeleteDialog(item.originalAdmin)}
          className="bg-[#E03137] p-2.5 rounded-lg cursor-pointer"
          aria-label="Delete admin"
          disabled={item.originalAdmin?.email === email}
        >
          <DeleteIcon />
        </button>
      </div>
    ),
  };

  const columnOrder: (keyof TableRowData)[] = [
    "name",
    "role",
    "description",
    "date",
    "status",
    "action",
  ];

  const columnLabels: Partial<Record<keyof TableRowData, string>> = {
    name: "Name & Email",
    role: "Role(s)",
    description: "Description & Permissions",
    date: "Created Date",
    status: "Status",
    action: "",
  };

  const totalPages = externalTotalPages || Math.ceil(tableData.length / pageSize);
  const paginatedData = externalTotalPages ? tableData : tableData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    onPageChange(1);
  }, [nameFilter, roleFilter, statusFilter]);

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h6 className="font-semibold text-lg text-[#111827] mb-1">
              Role-Based Admin Management
            </h6>
            <p className="text-[#687588] font-medium text-sm mb-6">
              Manage administrators with role-based permissions and access control.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Role-based access enabled</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <InputFilter
            setQuery={setNameFilter}
            placeholder="Search by name or email"
          />
          <SelectFilter
            setFilter={setRoleFilter}
            placeholder="Filter by Role"
            list={roleList}
            // disabled={isRolesLoading}
          />
          {/* <SelectFilter
            setFilter={setStatusFilter}
            placeholder="Filter by Status"
            list={statusList}
          /> */}
        </div>

        <TableComponent<TableRowData>
          tableData={paginatedData}
          currentPage={currentPage}
          onPageChange={onPageChange}
          totalPages={totalPages}
          cellRenderers={cellRenderers}
          columnOrder={columnOrder}
          columnLabels={columnLabels}
          isLoading={loading || isRolesLoading}
        />
      </CardContent>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Role-Based Admin Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium">
                {adminToDelete?.fullName ||
                  adminToDelete?.username ||
                  adminToDelete?.adminProfile?.username ||
                  adminToDelete?.email ||
                  "this admin"}
              </span>
              ? This will remove all their role-based permissions and access. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteAdminIsLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAdmin}
              disabled={deleteAdminIsLoading || adminToDelete?.email === email}
            >
              {deleteAdminIsLoading ? "Deleting..." : "Delete Admin"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DataTable;
