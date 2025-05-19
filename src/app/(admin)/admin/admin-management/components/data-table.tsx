"use client";
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { AdminsData, RoleData } from "@/types";
import Image from "next/image";
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

import {
	useDeleteAdmin,
	useGetAdminRoles,
	useGetAdmins,
	useUpdateAdminRoles,
} from "@/services/admin";
import { AdminData } from "@/types";
import { Button } from "@/components/ui/button"; // assuming you're using a custom/styled button
import Permit from "../[adminId]/components/adminPermitNumber";

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
			const email =
				localStorage.getItem("userEmail") ||
				sessionStorage.getItem("userEmail");
			// Use the email
			setEmail(email ? email : "");
		}
	}, []);

	const { adminsData, isAdminsLoading } = useGetAdmins({ enabled: true });
	const admin = adminsData?.find(
		(admin: { email: string }) => admin.email === email
	);

	console.log(email, "email", adminsData, "data", admin, "filter");

	console.log(adminToDelete, "admintodelet", adminData, "filtersearch");

	const onPageChange = (page: number) => {
		setCurrentPage(page);
	};

	const { rolesData, isRolesLoading } = useGetAdminRoles({ enabled: true });

	const filteredData = adminData.filter((admin) => {
		// Name filter (search in username)
		const matchesName =
			!nameFilter ||
			admin?.adminProfile?.username
				?.toLowerCase()
				.includes(nameFilter.toLowerCase());

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
	});

	console.log(filteredData, "forsearch");

	const { deleteAdminPayload, deleteAdminIsLoading } = useDeleteAdmin(() => {
		toast.success("Admin deleted successfully");
		setDeleteDialogOpen(false);
		refetch();
	});

	const handleDeleteAdmin = async () => {
		if (adminToDelete) {
			try {
				await deleteAdminPayload(adminToDelete.id);
			} catch (error) {
				toast.error("Failed to delete admin");
				console.error(error);
			}
		}
	};

	const openDeleteDialog = (admin: AdminsData) => {
		setAdminToDelete(admin);
		setDeleteDialogOpen(true);
	};

	// Transform roles data into the format expected by the table
	const tableData: any[] =
		filteredData?.map((admin) => ({
			id: admin.id,
			// Directly access adminProfile.username
			name: admin?.adminProfile?.username || "N/A", // Fallback for missing username
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
		{
			text: "All Status",
			value: "select",
		},
		{
			text: "Active",
			value: "active",
		},
		{
			text: "Pending",
			value: "pending",
		},
		{
			text: "Inactive",
			value: "inactive",
		},
	];

	// 4. Ensure roleList matches actual role names in data
	const roleList = [
		{
			text: "All Roles",
			value: "select",
		},
		{
			text: "Super Admin",
			value: "super_admin",
		},
		{
			text: "Admin",
			value: "admin",
		},
		{
			text: "Business Owner",
			value: "business_owner",
		},
		{
			text: "Customer",
			value: "customer",
		},
	];

	const cellRenderers = {
		name: (item: any) => (
			<div className="font-medium flex items-center gap-3">
				{/* Use the pre-mapped name property */}
				{item.name}
			</div>
		),
		role: (item: AdminsData) => (
			<div className="font-medium flex items-center gap-3">
				{item?.role?.toLowerCase().includes("admin") ? (
					<PersonIcon />
				) : (
					<RepIcon />
				)}
				{item?.role}
			</div>
		),
		description: (item: AdminsData) => (
			<span className="font-medium">{item.description}</span>
		),
		date: (item: AdminsData) => (
			<div className="font-medium flex items-center gap-3">
				<CalendarIcon />
				{item.date}
			</div>
		),
		status: (item: AdminsData) => (
			<Badge
				variant={
					item?.status.toLowerCase() === "active"
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
		rolecount: (item: AdminData) => (
			<span className="font-medium">{item?.rolecount}</span>
		),
		action: (item: AdminsData) => (
			<div className="flex gap-2.5">
				<Link
					href={`${ROUTES.ADMIN.SIDEBAR.ADMINS}/${item?.id}?tab=general`}
					className="bg-[#27A376] p-2.5 rounded-lg"
				>
					<ViewIcon />
				</Link>
				<Link
					href={`${ROUTES.ADMIN.SIDEBAR.ADMINS}/${item?.id}?tab=general`}
					className="bg-[#2F78EE] p-2.5 rounded-lg cursor-pointer"
				>
					<EditIcon />
				</Link>
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
		// "rolecount",
		"action",
	];

	const columnLabels = {
		status: "Role Status",
		name: "Name",
		role: "Role",
		description: "Description",
		action: "",
		date: "Created Date",
		// rolecount: "Number of Permissions",
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
					<InputFilter setQuery={setNameFilter} placeholder="Search by name" />
					<SelectFilter
						setFilter={setRoleFilter} // Changed to setRoleFilter
						placeholder="Select Role"
						list={roleList}
					/>
					<SelectFilter
						setFilter={setStatusFilter} // Changed to setStatusFilter
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
								disabled={
									deleteAdminIsLoading ||
									admin?.roles[0]?.role?.name !== "super_admin"
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
