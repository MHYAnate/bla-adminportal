"use client";
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { AdminsData, RoleData } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarIcon,
  DeleteIcon,
  EditIcon,
  PersonIcon,
  RepIcon,
  ViewIcon,
} from "../../../../../../public/icons";
import { TableComponent } from "@/components/custom-table";
import { SelectFilter } from "@/app/(admin)/components/select-filter";
import { InputFilter } from "@/app/(admin)/components/input-filter";
import Link from "next/link";
import { ROUTES } from "@/constant/routes";
import { toast } from "sonner";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@radix-ui/react-dialog";

import { useDeleteAdmin, useGetAdmins } from "@/services/admin";
import { AdminData } from "@/types";
import { Button } from "@/components/ui/button";

interface DataTableProps {
  adminData: RoleData[];
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
  const [adminToDelete, setAdminToDelete] = useState<null | AdminsData>(null);

  const [email, setEmail] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmail =
        localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");
      if (storedEmail) {
        setEmail(storedEmail);
      }
    }
  }, []);

  const { adminsData } = useGetAdmins({ enabled: true });
  const loggedInAdmin = adminsData?.find(
    (admin: { email: string }) => admin.email === email
  );

  // ✅ Updated to use the new hook API without callback parameter
  const { deleteAdmin, isLoading: deleteAdminIsLoading } = useDeleteAdmin();

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredData =
    adminData?.filter((admin) => {
      // Name filter (search in username)
      const matchesName =
        !nameFilter ||
        admin?.adminProfile?.username
          ?.toLowerCase()
          .includes(nameFilter.toLowerCase()) ||
        admin?.email?.toLowerCase().includes(nameFilter.toLowerCase());

      // Role filter (match exact role name)
      const matchesRole =
        !roleFilter ||
        roleFilter === "select" ||
        admin?.roles?.[0]?.role?.name?.toLowerCase() === roleFilter.toLowerCase();

      // Status filter (case insensitive match)
      const matchesStatus =
        !statusFilter ||
        statusFilter === "select" ||
        String(admin?.status || "")
          .toLowerCase()
          .trim() === statusFilter.toLowerCase();

      return matchesName && matchesRole && matchesStatus;
    }) || [];

  // ✅ Updated handleDeleteAdmin to use the new hook method
  const handleDeleteAdmin = async () => {
    if (!adminToDelete) {
      toast.error("No admin selected for deletion");
      return;
    }

    try {
      console.log("🗑️ Deleting admin:", adminToDelete);

      // ✅ Use the new hook method
      await deleteAdmin(adminToDelete.id);

      // ✅ Handle success manually since no callback
      console.log("✅ Admin deleted successfully");
      toast.success("Admin deleted successfully");
      setDeleteDialogOpen(false);
      setAdminToDelete(null);

      // Refresh the data
      refetch();

    } catch (error: any) {
      console.error("❌ Delete admin error:", error);

      // Enhanced error handling
      let errorMessage = "Failed to delete admin";

      if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      // Show user-friendly error messages
      if (errorMessage.includes('permission') || errorMessage.includes('Permission')) {
        toast.error("You don't have permission to delete this admin");
      } else if (errorMessage.includes('not found')) {
        toast.error("Admin not found or already deleted");
      } else if (errorMessage.includes('cannot delete yourself')) {
        toast.error("You cannot delete your own account");
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const openDeleteDialog = (admin: AdminsData) => {
    console.log("🗑️ Opening delete dialog for admin:", admin);
    setAdminToDelete(admin);
    setDeleteDialogOpen(true);
  };

  // ✅ UPDATED: Transform roles data with proper type safety
  const tableData: any[] =
    filteredData?.map((admin) => {
      // Safely extract role information
      const roleData = admin?.roles?.[0]?.role;
      let roleName = "N/A";
      let roleDescription = "N/A";

      if (roleData) {
        if (roleData.name === "super_admin") {
          roleName = "Super Admin";
        } else if (typeof roleData.name === 'string') {
          roleName = roleData.name.replace(/_/g, " ");
        }

        if (typeof roleData.description === 'string') {
          roleDescription = roleData.description;
        }
      }

      // Safely format date
      let formattedDate = "N/A";
      try {
        if (admin.createdAt) {
          formattedDate = new Date(admin.createdAt).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
        }
      } catch (dateError) {
        console.warn("Invalid date format:", admin.createdAt);
      }

      return {
        id: admin.id,
        name: admin?.adminProfile?.username || admin?.name || "N/A",
        email: admin.email || "N/A",
        role: roleName,
        description: roleDescription,
        date: formattedDate,
        status: admin.status || "Unknown",
      };
    }) || [];

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
    name: (item: any) => {
      // ✅ Safely handle name and email
      const displayName = typeof item.name === 'string' ? item.name : String(item.name || 'N/A');
      const displayEmail = typeof item.email === 'string' ? item.email : String(item.email || '');

      return (
        <div className="flex flex-col gap-1 text-left">
          <div className="font-medium text-slate-800">{displayName}</div>
          <div className="text-sm text-slate-500">{displayEmail}</div>
        </div>
      );
    },
    role: (item: any) => {
      // ✅ Safely handle role which might be an object or string
      let roleName = "Unknown Role";

      if (typeof item.role === 'string') {
        roleName = item.role;
      } else if (item.role && typeof item.role === 'object') {
        // If role is an object, try to extract the name
        roleName = item.role.name || item.role.title || String(item.role);
      } else if (item.role) {
        roleName = String(item.role);
      }

      return (
        <div className="font-medium flex items-center gap-3 capitalize">
          {roleName?.toLowerCase().includes("admin") ? (
            <PersonIcon />
          ) : (
            <RepIcon />
          )}
          {roleName}
        </div>
      );
    },
    description: (item: any) => {
      // ✅ Safely handle description which might be an object or string
      let descriptionText = "N/A";

      if (typeof item.description === 'string') {
        descriptionText = item.description;
      } else if (item.description && typeof item.description === 'object') {
        // If description is an object, try to extract a meaningful string
        descriptionText = item.description.name || item.description.title || JSON.stringify(item.description);
      } else if (item.description) {
        descriptionText = String(item.description);
      }

      return (
        <span className="font-medium">{descriptionText}</span>
      );
    },
    date: (item: any) => {
      // ✅ Safely handle date
      const dateText = typeof item.date === 'string' ? item.date : String(item.date || 'N/A');

      return (
        <div className="font-medium flex items-center gap-3">
          <CalendarIcon />
          {dateText}
        </div>
      );
    },
    status: (item: any) => {
      const statusText = typeof item.status === 'string' ? item.status : String(item.status || 'Unknown');
      const statusLower = statusText.toLowerCase();

      return (
        <Badge
          variant={
            statusLower === "active"
              ? "success"
              : statusLower === "pending"
                ? "tertiary"
                : "warning"
          }
          className="py-1 px-[26px] font-medium"
        >
          {statusText.toUpperCase()}
        </Badge>
      );
    },


    action: (item: any) => (
      <div className="flex gap-2.5">
        <Link
          href={`${ROUTES.ADMIN.SIDEBAR.ADMINS}/${item?.id}?tab=general`}
          className="bg-[#27A376] p-2.5 rounded-lg"
        >
          <ViewIcon />
        </Link>
        {/* <Link
          href={`${ROUTES.ADMIN.SIDEBAR.ADMINS}/${item?.id}?tab=general`}
          className="bg-[#2F78EE] p-2.5 rounded-lg cursor-pointer"
        >
          <EditIcon />
        </Link> */}
        <div
          onClick={() => openDeleteDialog(item)}
          className="bg-[#E03137] p-2.5 rounded-lg cursor-pointer"
        >
          <DeleteIcon />
        </div>
      </div>
    ),
  };

  const columnOrder: (keyof AdminsData)[] = [
    "name",
    "role",
    "description",
    "date",
    "status",
    "action",
  ];

  const columnLabels = {
    status: "Role Status",
    name: "Name & Email",
    role: "Role",
    description: "Description",
    action: "",
    date: "Created Date",
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
          <InputFilter setQuery={setNameFilter} placeholder="Search by name or email" />
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
        <TableComponent<AdminData>
          tableData={tableData}
          currentPage={currentPage}
          onPageChange={onPageChange}
          totalPages={Math.ceil(tableData.length / pageSize)}
          cellRenderers={cellRenderers}
          columnOrder={columnOrder}
          columnLabels={columnLabels}
          isLoading={loading}
        />
      </CardContent>

      {/* ✅ Fixed Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="fixed inset-0 flex items-center justify-center z-50">
          <div className="sm:max-w-[425px] w-full bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-slate-900">
                Confirm deletion
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-600 mt-1">
                Are you sure you want to delete{" "}
                <span className="font-medium">
                  {String(adminToDelete?.name || adminToDelete?.email || "this admin")}
                </span>
                ? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6 flex justify-end space-x-3">
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
                disabled={
                  deleteAdminIsLoading ||
                  // ✅ Optional: Uncomment to prevent non-super-admins from deleting
                  // loggedInAdmin?.roles[0]?.role?.name !== "super_admin" ||
                  // Prevent self-deletion
                  adminToDelete?.email === email
                }
              >
                {deleteAdminIsLoading ? "Deleting..." : "Delete Admin"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DataTable;