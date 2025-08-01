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
import { useDeleteAdmin } from "@/services/admin";
import { Button } from "@/components/ui/button";
import { AdminData } from "@/types/index";
import { Admin } from "@/types/admin";


// Extend AdminData to include our formatted fields
interface TableRowData extends AdminData {
  formattedRole?: string;
  formattedDate?: string;
  originalAdmin?: Admin;
}

interface DataTableProps {
  adminData: Admin[];
  loading: boolean;
  refetch: () => void;
}

const DataTable: React.FC<DataTableProps> = ({
  adminData,
  loading,
  refetch,
}) => {
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [nameFilter, setNameFilter] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");
      if (storedEmail) setEmail(storedEmail);
    }
  }, []);

  const { deleteAdminPayload: deleteAdmin, deleteAdminIsLoading } = useDeleteAdmin();

  // Ensure adminData is an array and filter it properly
  const safeAdminData = Array.isArray(adminData) ? adminData : [];

  const filteredData: Admin[] = safeAdminData.filter((admin) => {
    if (!admin || typeof admin !== 'object') return false;

    const username = admin.username || admin.adminProfile?.username || "";
    const adminEmail = admin.email || "";

    const nameMatch = nameFilter
      ? username.toLowerCase().includes(nameFilter.toLowerCase()) ||
      adminEmail.toLowerCase().includes(nameFilter.toLowerCase())
      : true;

    const roleName = admin.role || admin.roles?.[0]?.role?.name || admin.roles?.[0]?.name || "";
    const roleMatch = roleFilter && roleFilter !== "select"
      ? roleName.toLowerCase() === roleFilter.toLowerCase()
      : true;

    const status = admin.adminStatus || admin.status || "";
    const statusMatch = statusFilter && statusFilter !== "select"
      ? status.toLowerCase() === statusFilter.toLowerCase()
      : true;

    return nameMatch && roleMatch && statusMatch;
  });

  // Transform Admin data to match AdminData structure
  const tableData: TableRowData[] = filteredData.map((admin: Admin) => {
    const roleName = admin.role || admin.roles?.[0]?.role?.name || admin.roles?.[0]?.name || "";
    const roleDescription = admin.roles?.[0]?.role?.description || admin.roles?.[0]?.description || "";

    // The roles property expects a single object with a 'role' property
    const transformedRoles = {
      role: {
        id: admin.roles?.[0]?.role?.id || 0,
        name: admin.roles?.[0]?.role?.name || admin.roles?.[0]?.name || "",
        discription: admin.roles?.[0]?.role?.description || admin.roles?.[0]?.description || "",
      }
    };

    const adminData: TableRowData = {
      id: admin.id,
      email: admin.email,
      name: admin.fullName || admin.username || admin.adminProfile?.username || "",
      profile: {
        username: admin.username || admin.adminProfile?.username || "",
        fullName: admin.fullName || admin.adminProfile?.fullName || "",
        phone: admin.phone || admin.adminProfile?.phone || "",
        gender: admin.gender || admin.adminProfile?.gender || "",
      },
      role: roleName,
      description: roleDescription,
      date: admin.createdAt,
      status: admin.adminStatus || admin.status || "",
      createdAt: admin.createdAt,
      roles: transformedRoles,
      rolecount: String(admin.roles?.length || 0),
      action: "",

      // Add our custom formatted fields
      formattedRole: roleName === "super_admin"
        ? "Super Admin"
        : roleName.replace(/_/g, " ") || "N/A",
      formattedDate: admin.createdAt
        ? new Date(admin.createdAt).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        : "N/A",
      originalAdmin: admin,
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

  const statusList = [
    { text: "All Status", value: "select" },
    { text: "Active", value: "active" },
    { text: "Pending", value: "pending" },
    { text: "Inactive", value: "inactive" },
  ];

  const roleList = [
    { text: "All Roles", value: "select" },
    { text: "Super Admin", value: "super_admin" },
    { text: "Admin", value: "admin" },
    { text: "Business Owner", value: "business_owner" },
    { text: "Customer", value: "customer" },
  ];

  const cellRenderers = {
    name: (item: TableRowData) => (
      <div className="flex flex-col gap-1 text-left">
        <div className="font-medium text-slate-800">
          {item.profile?.fullName || item.profile?.username || item.name || "N/A"}
        </div>
        <div className="text-sm text-slate-500">{item.email || "N/A"}</div>
      </div>
    ),
    role: (item: TableRowData) => (
      <div className="font-medium flex items-center gap-3 capitalize">
        {item.formattedRole?.toLowerCase().includes("admin") ? (
          <PersonIcon />
        ) : (
          <RepIcon />
        )}
        {item.formattedRole}
      </div>
    ),
    description: (item: TableRowData) => (
      <span className="font-medium">
        {item.description || "N/A"}
      </span>
    ),
    date: (item: TableRowData) => (
      <div className="font-medium flex items-center gap-3">
        <CalendarIcon />
        {item.formattedDate}
      </div>
    ),
    status: (item: TableRowData) => (
      <Badge
        variant={
          item.status?.toLowerCase() === "active"
            ? "success"
            : item.status?.toLowerCase() === "pending"
              ? "tertiary"
              : "warning"
        }
        className="py-1 px-[26px] font-medium"
      >
        {item.status?.toUpperCase() || "UNKNOWN"}
      </Badge>
    ),
    action: (item: TableRowData) => (
      <div className="flex gap-2.5">
        <Link
          href={`${ROUTES.ADMIN.SIDEBAR.ADMINS}/${item.id}?tab=general`}
          className="bg-[#27A376] p-2.5 rounded-lg"
        >
          <ViewIcon />
        </Link>
        <button
          onClick={() => item.originalAdmin && openDeleteDialog(item.originalAdmin)}
          className="bg-[#E03137] p-2.5 rounded-lg cursor-pointer"
          aria-label="Delete admin"
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
    role: "Role",
    description: "Description",
    date: "Created Date",
    status: "Status",
    action: "",
  };

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <h6 className="font-semibold text-lg text-[#111827] mb-1">
          All Admin Roles
        </h6>
        <p className="text-[#687588] font-medium text-sm mb-6">
          Manage administrator roles and their associated permissions.
        </p>
        <div className="flex items-center gap-4 mb-6">
          <InputFilter
            setQuery={setNameFilter}
            placeholder="Search by name or email"
          />
          <SelectFilter
            setFilter={setRoleFilter}
            placeholder="Select Role"
            list={roleList}
          />
          <SelectFilter
            setFilter={setStatusFilter}
            placeholder="Status"
            list={statusList}
          />
        </div>
        <TableComponent<TableRowData>
          tableData={tableData}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalPages={Math.ceil(tableData.length / pageSize)}
          cellRenderers={cellRenderers}
          columnOrder={columnOrder}
          columnLabels={columnLabels}
          isLoading={loading}
        />
      </CardContent>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium">
                {adminToDelete?.fullName ||
                  adminToDelete?.username ||
                  adminToDelete?.adminProfile?.username ||
                  adminToDelete?.email ||
                  "this admin"}
              </span>
              ? This action cannot be undone.
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