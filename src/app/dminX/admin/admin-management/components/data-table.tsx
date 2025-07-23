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
        admin?.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchesName && matchesRole && matchesStatus;
    }) || [];

  const { deleteAdminPayload, deleteAdminIsLoading } = useDeleteAdmin(() => {
    toast.success("Admin deleted successfully");
    setDeleteDialogOpen(false);
    refetch();
  });

  const handleDeleteAdmin = async () => {
    if (adminToDelete) {
      try {
        await deleteAdminPayload(adminToDelete.id);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.error || "Failed to delete admin"
        );
        console.error(error);
      }
    }
  };

  const openDeleteDialog = (admin: AdminsData) => {
    setAdminToDelete(admin);
    setDeleteDialogOpen(true);
  };

  // 1. UPDATED: Transform roles data to include email in the top-level object
  const tableData: any[] =
    filteredData?.map((admin) => ({
      id: admin.id,
      name: admin?.adminProfile?.username || "N/A",
      email: admin.email, // <-- EMAIL ADDED HERE
      role:
        admin?.roles[0]?.role?.name === "super_admin"
          ? "Super Admin"
          : admin?.roles[0]?.role?.name?.replace(/_/g, " "),
      description: admin?.roles[0]?.role?.description,
      date: new Date(admin.createdAt).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: admin?.status,
    })) || [];

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
    // 2. UPDATED: Cell renderer for 'name' now displays both name and email
    name: (item: any) => (
      <div className="flex flex-col gap-1 text-left">
        <div className="font-medium text-slate-800">{item.name}</div>
        <div className="text-sm text-slate-500">{item.email}</div>
      </div>
    ),
    role: (item: any) => (
      <div className="font-medium flex items-center gap-3 capitalize">
        {item?.role?.toLowerCase().includes("admin") ? (
          <PersonIcon />
        ) : (
          <RepIcon />
        )}
        {item?.role}
      </div>
    ),
    description: (item: any) => (
      <span className="font-medium">{item.description || "N/A"}</span>
    ),
    date: (item: any) => (
      <div className="font-medium flex items-center gap-3">
        <CalendarIcon />
        {item.date}
      </div>
    ),
    status: (item: any) => (
      <Badge
        variant={
          item?.status?.toLowerCase() === "active"
            ? "success"
            : item?.status?.toLowerCase() === "pending"
            ? "tertiary"
            : "warning"
        }
        className="py-1 px-[26px] font-medium"
      >
        {item?.status?.toUpperCase()}
      </Badge>
    ),
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
 			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
 				<DialogContent className="fixed inset-0 flex items-center justify-center z-50">
 					<div className="sm:max-w-[425px] w-full bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
 						<DialogHeader>
 							<DialogTitle className="text-xl font-semibold text-slate-900">
 								Confirm deletion
 							</DialogTitle>
 							<DialogDescription className="text-sm text-slate-600 mt-1">
 								Are you sure you want to delete {adminToDelete?.name}? This
 								action cannot be undone.
 							</DialogDescription>
 						</DialogHeader>
 						<DialogFooter className="mt-6 flex justify-end space-x-3">
 							<Button
								variant="outline"
								onClick={() => setDeleteDialogOpen(false)}
							>
								Cancel
							</Button>
							<Button
                variant="destructive"
                onClick={handleDeleteAdmin}
                // disabled={
                //   deleteAdminIsLoading ||
                //   loggedInAdmin?.roles[0]?.role?.name !== "super_admin"
                // }
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