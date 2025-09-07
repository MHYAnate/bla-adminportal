// "use client";

// import { useEffect, useState } from "react";
// import Header from "@/app/(admin)/components/header";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";
// import Image from "next/image";
// import {
// 	CallIcon,
// 	LocationIcon,
// 	MailIcon,
// } from "../../../../../../../public/icons";

// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import GeneralInfo from "./general-info";
// import { useSearchParams } from "next/navigation";
// import { useHandlePush } from "@/hooks/use-handle-push";
// import { ROUTES } from "@/constant/routes";
// import { PermissionsTab } from "./permissions-tab";
// import { useGetAdmins } from "@/services/admin";
// import RolesTab from "./roleTab";
// import { useRouter } from "next/navigation";

// interface AdminUserDetailProps {
// 	adminId: string;
// 	roles: any;
// }

// const AdminUserDetail: React.FC<AdminUserDetailProps> = ({
// 	adminId,
// 	roles,
// }) => {
// 	const params = useSearchParams();
// 	const tabParam = params.get("tab");
// 	const { handlePush } = useHandlePush();
// 	const [page, setPage] = useState(1);
// 		const [limit, setLimit] = useState(10000);
// 		const [filters, setFilters] = useState({});

// 	// const { adminsData, isAdminsLoading, refetchAdmins } = useGetAdmins({
// 	// 	enabled: true,
// 	// });

// 		const { 
// 			adminsData, 
// 			isAdminsLoading, 
// 			refetchAdmins, 
// 			totalAdmins, 
// 			totalPages,
// 			currentPage,
// 			itemsPerPage 
// 		} = useGetAdmins({ 
// 			enabled: true, 
// 			filter: { page, limit, ...filters } 
// 		})

// 	// ✅ FIXED: Find admin with proper type checking
// 	const admin = adminsData.find(
// 		(admin: any) => admin.id.toString() === adminId.toString()
// 	);

// 	if (admin && admin.role && (!admin.roles || admin.roles.length === 0)) {
// 		// Find the role object from rolesData
// 		const roleObject = roles?.data?.find(
// 			(r: any) => r.name.toLowerCase() === admin.role.toLowerCase()
// 		);
// 		if (roleObject) {
// 			admin.roles = [{ role: roleObject }];
// 		}
// 	}

// 	const tabs = [
// 		{
// 			value: "general",
// 			text: "General",
// 		},
// 		{
// 			value: "role",
// 			text: "Role",
// 		},
// 		{
// 			value: "permissions",
// 			text: "Permissions",
// 		},
// 	];
// 	const router = useRouter();

// 	if (isAdminsLoading) {
// 		return (
// 			<div>
// 				<button
// 					onClick={() => router.push("/admin/admin-management")}
// 					className="flex items-center justify-center w-24 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md transition-colors duration-200"
// 				>
// 					← Back
// 				</button>
// 				<div className="mt-5">
// 					<Card>
// 						<CardContent className="p-6">
// 							<div className="flex justify-center items-center h-60">
// 								<p className="text-muted-foreground">
// 									Loading admin information...
// 								</p>
// 							</div>
// 						</CardContent>
// 					</Card>
// 				</div>
// 			</div>
// 		);
// 	}

// 	if (!admin) {
// 		return (
// 			<div>
// 					<button
// 					onClick={() => router.push("/admin/admin-management")}
// 					className="flex items-center justify-center w-24 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md transition-colors duration-200"
// 				>
// 					← Back
// 				</button>
// 				<div className="mt-5">
// 					<Card>
// 						<CardContent className="p-6">
// 							<div className="flex justify-center items-center h-60">
// 								<p className="text-muted-foreground">Admin not found</p>
// 							</div>
// 						</CardContent>
// 					</Card>
// 				</div>
// 			</div>
// 		);
// 	}

// 	// ✅ FIXED: Proper data extraction
// 	const status = admin?.adminStatus || admin?.status || "INACTIVE";
// 	const adminRoles = admin?.roles || [];
// 	const adminName =
// 		admin?.fullName || admin?.adminProfile?.fullName || "Administrator";
// 	const adminPhone =
// 		admin?.phone || admin?.adminProfile?.phone || "Not provided";
// 	const adminEmail = admin?.email || "admin@example.com";

// 	return (
// 		<div>
// 			<button
// 					onClick={() => router.push("/admin/admin-management")}
// 					className="flex items-center justify-center w-24 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md transition-colors duration-200"
// 				>
// 					← Back
// 				</button>
// 			<div className="flex flex-col md:flex-row gap-6 mt-5">
// 				<Card className="w-full md:w-[300px]">
// 					<CardContent className="p-6">
// 						<div>
// 							<div className="mb-6 pb-6 border-b border-[#F1F2F4] ">
// 								<div className="flex items-center justify-center mt-6">
// 									<Image
// 										height={100}
// 										width={100}
// 										alt="Admin avatar"
// 										src="/images/user-avatar.jpg"
// 										className="w-[100px] h-[100px] rounded-full object-cover"
// 									/>
// 								</div>
// 								<h6 className="text-center text-[#111827] text-xl mb-2.5">
// 									{adminName}
// 								</h6>
// 								<p className="text-[#687588] text-sm mb-2.5 text-center">
// 									{admin?.role ||
// 										adminRoles[0]?.role?.name ||
// 										adminRoles[0]?.name ||
// 										"Admin"}
// 								</p>
// 								<p className="text-[#687588] text-sm mb-6 text-center">
// 									@
// 									{admin?.username ||
// 										adminName?.toLowerCase().replace(/\s+/g, "_")}
// 								</p>
// 								<div className="flex justify-center">
// 									<Badge
// 										variant={
// 											status?.toLowerCase() === "active"
// 												? "success"
// 												: status?.toLowerCase() === "pending"
// 												? "tertiary"
// 												: "warning"
// 										}
// 										className="py-1 px-[26px] font-medium"
// 									>
// 										{status?.toUpperCase()}
// 									</Badge>
// 								</div>
// 							</div>
// 							<div className="mb-6 pb-6 border-b border-[#F1F2F4] px-auto">
// 								<div className="flex gap-3 items-start mb-4">
// 									<div className="flex-shrink-0 mt-0.5">
// 										<MailIcon />
// 									</div>
// 									<p className="font-semibold text-sm text-[#111827] break-words flex-1 min-w-0 whitespace-normal">
// 										{adminEmail}
// 									</p>
// 								</div>

// 								<div className="flex gap-3 items-center mb-4">
// 									<div className="flex-shrink-0">
// 										<CallIcon />
// 									</div>
// 									<p className="font-semibold text-sm text-[#111827]">
// 										{adminPhone}
// 									</p>
// 								</div>
// 								<div className="flex gap-3 items-center mb-4">
// 									<div className="flex-shrink-0">
// 										<LocationIcon />
// 									</div>
// 									<p className="font-semibold text-sm text-[#111827]">
// 										{admin?.location || "Not specified"}
// 									</p>
// 								</div>
// 							</div>
// 						</div>
// 					</CardContent>
// 				</Card>
// 				<Card className="flex-1">
// 					<CardContent className="p-6">
// 						<Tabs defaultValue={tabParam || "general"}>
// 							<TabsList className="justify-start border-b w-full mb-6">
// 								{tabs.map((tab, index) => (
// 									<TabsTrigger
// 										value={tab.value}
// 										key={index}
// 										className={`w-2/12 flex-col pb-0`}
// 										onClick={() =>
// 											handlePush(
// 												`${ROUTES.ADMIN.SIDEBAR.ADMINS}/${adminId}?tab=${tab.value}`
// 											)
// 										}
// 									>
// 										<p
// 											className={`w-full text-center pb-[9px] ${
// 												(tabParam || "general") === tab.value
// 													? "border-b-2 border-[#EC9F01] text-[#030C0A]"
// 													: "border-b-2 border-transparent text-[#111827]"
// 											}`}
// 										>
// 											{tab.text}
// 										</p>
// 									</TabsTrigger>
// 								))}
// 							</TabsList>

// 							<TabsContent value="general">
// 								<GeneralInfo adminData={admin} roles={roles} />
// 							</TabsContent>
// 							<TabsContent value="role">
// 								<RolesTab adminData={admin} roles={roles} />
// 							</TabsContent>
// 							<TabsContent value="permissions">
// 								<PermissionsTab adminData={admin} />
// 							</TabsContent>
// 						</Tabs>
// 					</CardContent>
// 				</Card>
// 			</div>
// 		</div>
// 	);
// };

// export default AdminUserDetail;

"use client";

import { useEffect, useState } from "react";
import Header from "@/app/(admin)/components/header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
	CallIcon,
	LocationIcon,
	MailIcon,
} from "../../../../../../../public/icons";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeneralInfo from "./general-info";
import { useSearchParams } from "next/navigation";
import { useHandlePush } from "@/hooks/use-handle-push";
import { ROUTES } from "@/constant/routes";
import { PermissionsTab } from "./permissions-tab";
import { useGetAdmins } from "@/services/admin";
import RolesTab from "./roleTab";
import { useRouter } from "next/navigation";

interface AdminUserDetailProps {
	adminId: string;
	roles: any;
}

const AdminUserDetail: React.FC<AdminUserDetailProps> = ({
	adminId,
	roles,
}) => {
	const params = useSearchParams();
	const tabParam = params.get("tab");
	const { handlePush } = useHandlePush();
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10000);
	const [filters, setFilters] = useState({});

	// ✅ NEW: Get navigation parameters for back button
	const fromTable = params.get("from");
	const savedPage = params.get("page");
	const savedRoleFilter = params.get("roleFilter");
	const savedStatusFilter = params.get("statusFilter");
	const savedNameFilter = params.get("nameFilter");

	const { 
		adminsData, 
		isAdminsLoading, 
		refetchAdmins, 
		totalAdmins, 
		totalPages,
		currentPage,
		itemsPerPage 
	} = useGetAdmins({ 
		enabled: true, 
		filter: { page, limit, ...filters } 
	})

	// ✅ FIXED: Find admin with proper type checking
	const admin = adminsData.find(
		(admin: any) => admin.id.toString() === adminId.toString()
	);

	if (admin && admin.role && (!admin.roles || admin.roles.length === 0)) {
		// Find the role object from rolesData
		const roleObject = roles?.data?.find(
			(r: any) => r.name.toLowerCase() === admin.role.toLowerCase()
		);
		if (roleObject) {
			admin.roles = [{ role: roleObject }];
		}
	}

	const tabs = [
		{
			value: "general",
			text: "General",
		},
		{
			value: "role",
			text: "Role",
		},
		{
			value: "permissions",
			text: "Permissions",
		},
	];
	const router = useRouter();

	// ✅ NEW: Enhanced back navigation with state preservation
	const handleBack = () => {
		if (fromTable === "table" && savedPage) {
			// Store navigation state in sessionStorage for the table to restore
			const navigationState = {
				currentPage: parseInt(savedPage),
				roleFilter: savedRoleFilter || "",
				statusFilter: savedStatusFilter || "",
				nameFilter: savedNameFilter || "",
			};
			sessionStorage.setItem('adminTableState', JSON.stringify(navigationState));
			
			// Navigate back with URL parameters to maintain state
			const searchParams = new URLSearchParams();
			if (savedPage && savedPage !== "1") searchParams.set('page', savedPage);
			if (savedRoleFilter && savedRoleFilter !== "select") searchParams.set('roleFilter', savedRoleFilter);
			if (savedStatusFilter && savedStatusFilter !== "select") searchParams.set('statusFilter', savedStatusFilter);
			if (savedNameFilter) searchParams.set('nameFilter', savedNameFilter);
			
			const queryString = searchParams.toString();
			const url = queryString 
				? `/admin/admin-management?${queryString}`
				: '/admin/admin-management';
			
			router.push(url);
		} else {
			// Default back navigation
			router.push("/admin/admin-management");
		}
	};

	if (isAdminsLoading) {
		return (
			<div>
				<button
					onClick={handleBack}
					className="flex items-center justify-center w-24 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md transition-colors duration-200"
				>
					← Back
				</button>
				<div className="mt-5">
					<Card>
						<CardContent className="p-6">
							<div className="flex justify-center items-center h-60">
								<p className="text-muted-foreground">
									Loading admin information...
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	if (!admin) {
		return (
			<div>
				<button
					onClick={handleBack}
					className="flex items-center justify-center w-24 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md transition-colors duration-200"
				>
					← Back
				</button>
				<div className="mt-5">
					<Card>
						<CardContent className="p-6">
							<div className="flex justify-center items-center h-60">
								<p className="text-muted-foreground">Admin not found</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	// ✅ FIXED: Proper data extraction
	const status = admin?.adminStatus || admin?.status || "INACTIVE";
	const adminRoles = admin?.roles || [];
	const adminName =
		admin?.fullName || admin?.adminProfile?.fullName || "Administrator";
	const adminPhone =
		admin?.phone || admin?.adminProfile?.phone || "Not provided";
	const adminEmail = admin?.email || "admin@example.com";

	return (
		<div>
			<div className="flex items-center gap-3 mb-5">
				<button
					onClick={handleBack}
					className="flex items-center justify-center w-24 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md transition-colors duration-200"
				>
					← Back
				</button>
				{fromTable === "table" && savedPage && (
					<span className="text-sm text-gray-500">
						Return to page {savedPage}
						{savedRoleFilter && savedRoleFilter !== "select" && (
							<span> • Role: {savedRoleFilter.replace(/_/g, " ")}</span>
						)}
						{savedStatusFilter && savedStatusFilter !== "select" && (
							<span> • Status: {savedStatusFilter}</span>
						)}
						{savedNameFilter && (
							<span> • Search: "{savedNameFilter}"</span>
						)}
					</span>
				)}
			</div>
			
			<div className="flex flex-col md:flex-row gap-6">
				<Card className="w-full md:w-[300px]">
					<CardContent className="p-6">
						<div>
							<div className="mb-6 pb-6 border-b border-[#F1F2F4] ">
								<div className="flex items-center justify-center mt-6">
									<Image
										height={100}
										width={100}
										alt="Admin avatar"
										src="/images/user-avatar.jpg"
										className="w-[100px] h-[100px] rounded-full object-cover"
									/>
								</div>
								<h6 className="text-center text-[#111827] text-xl mb-2.5">
									{adminName}
								</h6>
								<p className="text-[#687588] text-sm mb-2.5 text-center">
									{admin?.role ||
										adminRoles[0]?.role?.name ||
										adminRoles[0]?.name ||
										"Admin"}
								</p>
								<p className="text-[#687588] text-sm mb-6 text-center">
									@
									{admin?.username ||
										adminName?.toLowerCase().replace(/\s+/g, "_")}
								</p>
								<div className="flex justify-center">
									<Badge
										variant={
											status?.toLowerCase() === "active"
												? "success"
												: status?.toLowerCase() === "pending"
												? "tertiary"
												: "warning"
										}
										className="py-1 px-[26px] font-medium"
									>
										{status?.toUpperCase()}
									</Badge>
								</div>
							</div>
							<div className="mb-6 pb-6 border-b border-[#F1F2F4] px-auto">
								<div className="flex gap-3 items-start mb-4">
									<div className="flex-shrink-0 mt-0.5">
										<MailIcon />
									</div>
									<p className="font-semibold text-sm text-[#111827] break-words flex-1 min-w-0 whitespace-normal">
										{adminEmail}
									</p>
								</div>

								<div className="flex gap-3 items-center mb-4">
									<div className="flex-shrink-0">
										<CallIcon />
									</div>
									<p className="font-semibold text-sm text-[#111827]">
										{adminPhone}
									</p>
								</div>
								<div className="flex gap-3 items-center mb-4">
									<div className="flex-shrink-0">
										<LocationIcon />
									</div>
									<p className="font-semibold text-sm text-[#111827]">
										{admin?.location || "Not specified"}
									</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className="flex-1">
					<CardContent className="p-6">
						<Tabs defaultValue={tabParam || "general"}>
							<TabsList className="justify-start border-b w-full mb-6">
								{tabs.map((tab, index) => (
									<TabsTrigger
										value={tab.value}
										key={index}
										className={`w-2/12 flex-col pb-0`}
										onClick={() => {
											// ✅ NEW: Preserve navigation state in tab navigation
											const currentParams = new URLSearchParams();
											currentParams.set('tab', tab.value);
											if (fromTable) currentParams.set('from', fromTable);
											if (savedPage) currentParams.set('page', savedPage);
											if (savedRoleFilter) currentParams.set('roleFilter', savedRoleFilter);
											if (savedStatusFilter) currentParams.set('statusFilter', savedStatusFilter);
											if (savedNameFilter) currentParams.set('nameFilter', savedNameFilter);

											handlePush(
												`${ROUTES.ADMIN.SIDEBAR.ADMINS}/${adminId}?${currentParams.toString()}`
											);
										}}
									>
										<p
											className={`w-full text-center pb-[9px] ${
												(tabParam || "general") === tab.value
													? "border-b-2 border-[#EC9F01] text-[#030C0A]"
													: "border-b-2 border-transparent text-[#111827]"
											}`}
										>
											{tab.text}
										</p>
									</TabsTrigger>
								))}
							</TabsList>

							<TabsContent value="general">
								<GeneralInfo adminData={admin} roles={roles} />
							</TabsContent>
							<TabsContent value="role">
								<RolesTab adminData={admin} roles={roles} />
							</TabsContent>
							<TabsContent value="permissions">
								<PermissionsTab adminData={admin} />
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default AdminUserDetail;