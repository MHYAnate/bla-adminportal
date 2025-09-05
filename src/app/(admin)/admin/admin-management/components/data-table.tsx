// // // // "use client";
// // // // import React, { useState, useEffect } from "react";
// // // // import { Badge } from "@/components/ui/badge";
// // // // import { Card, CardContent } from "@/components/ui/card";
// // // // import { CalendarIcon, DeleteIcon, ViewIcon, PersonIcon, RepIcon } from "../../../../../../public/icons";
// // // // import { TableComponent } from "@/components/custom-table";
// // // // import { SelectFilter } from "@/app/(admin)/components/select-filter";
// // // // import { InputFilter } from "@/app/(admin)/components/input-filter";
// // // // import Link from "next/link";
// // // // import { ROUTES } from "@/constant/routes";
// // // // import { toast } from "sonner";
// // // // import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
// // // // import { useDeleteAdmin } from "@/services/admin";
// // // // import { Button } from "@/components/ui/button";
// // // // import { Clock, CheckCircle } from "lucide-react";

// // // // // Local type definitions to avoid import conflicts
// // // // interface AdminRole {
// // // //   id?: number;
// // // //   roleId?: number;
// // // //   name?: string;
// // // //   description?: string;
// // // //   role?: {
// // // //     id: number;
// // // //     name?: string;
// // // //     description?: string;
// // // //     permissions?: any[];
// // // //   };
// // // // }

// // // // interface AdminProfile {
// // // //   username?: string;
// // // //   fullName?: string;
// // // //   phone?: string;
// // // //   gender?: string;
// // // // }

// // // // interface Admin {
// // // //   id: number | string;
// // // //   email?: string;
// // // //   username?: string;
// // // //   fullName?: string;
// // // //   phone?: string;
// // // //   gender?: string;
// // // //   status?: string;
// // // //   adminStatus?: string;
// // // //   roles?: AdminRole[];
// // // //   permissionCount?: number;
// // // //   adminProfile?: AdminProfile;
// // // //   createdAt?: string;
// // // //   lastLogin?: string;
// // // //   invitationStatus?: 'COMPLETED' | 'PENDING' | 'EXPIRED' | 'CANCELLED';
// // // // }

// // // // // ✅ FIX: Match the exact structure expected by TableComponent (with typo)
// // // // interface TableRowData {
// // // //   id: number | string;
// // // //   email: string;
// // // //   name: string;
// // // //   profile: {
// // // //     username: string;
// // // //     fullName: string;
// // // //     phone: string;
// // // //     gender: string;
// // // //   };
// // // //   role: string;
// // // //   description: string;
// // // //   date: string;
// // // //   status: string;
// // // //   createdAt: string;
// // // //   roles: {
// // // //     role: {
// // // //       id: number;
// // // //       name: string;
// // // //       discription: string;
// // // //     };
// // // //   };
// // // //   rolecount: string;
// // // //   action: string;
// // // //   formattedRole: string;
// // // //   formattedDate: string;
// // // //   originalAdmin?: Admin;
// // // //   isRoleBased: boolean;
// // // //   invitationStatus?: 'COMPLETED' | 'PENDING' | 'EXPIRED' | 'CANCELLED';
// // // //   roleCount: number;

// // // //   // Add index signature
// // // //   [key: string]: any;
// // // // }

// // // // interface DataTableProps {
// // // //   adminData: Admin[];
// // // //   loading: boolean;
// // // //   refetch: () => void;
// // // // }

// // // // const DataTable: React.FC<DataTableProps> = ({
// // // //   adminData,
// // // //   loading,
// // // //   refetch,
// // // // }) => {
// // // //   const pageSize = 10;
// // // //   const [currentPage, setCurrentPage] = useState(1);
// // // //   const [roleFilter, setRoleFilter] = useState<string>("");
// // // //   const [statusFilter, setStatusFilter] = useState<string>("");
// // // //   const [nameFilter, setNameFilter] = useState<string>("");
// // // //   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
// // // //   const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);
// // // //   const [email, setEmail] = useState("");

// // // //   useEffect(() => {
// // // //     if (typeof window !== "undefined") {
// // // //       const storedEmail = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");
// // // //       if (storedEmail) setEmail(storedEmail);
// // // //     }
// // // //   }, []);

// // // //   const { deleteAdminPayload: deleteAdmin, deleteAdminIsLoading } = useDeleteAdmin();

// // // //   // Ensure adminData is an array and filter it properly
// // // //   const safeAdminData = Array.isArray(adminData) ? adminData : [];

// // // //   console.log("Admin data structure for role-based filtering:", safeAdminData[0]);

// // // //   const filteredData: Admin[] = safeAdminData.filter((admin) => {
// // // //     if (!admin || typeof admin !== 'object') return false;

// // // //     const username = admin.username || admin.adminProfile?.username || admin.fullName || "";
// // // //     const adminEmail = admin.email || "";

// // // //     const nameMatch = nameFilter
// // // //       ? username.toLowerCase().includes(nameFilter.toLowerCase()) ||
// // // //       adminEmail.toLowerCase().includes(nameFilter.toLowerCase())
// // // //       : true;

// // // //     // Enhanced role matching for role-based system
// // // //     const roleNames = admin.roles?.map(ur => ur.role?.name || ur.name).filter(Boolean) || [];

// // // //     const roleMatch = roleFilter && roleFilter !== "select"
// // // //       ? roleNames.some(roleName => roleName && roleName.toLowerCase() === roleFilter.toLowerCase())
// // // //       : true;

// // // //     const status = admin.adminStatus || admin.status || "";
// // // //     const statusMatch = statusFilter && statusFilter !== "select"
// // // //       ? status.toLowerCase() === statusFilter.toLowerCase()
// // // //       : true;

// // // //     return nameMatch && roleMatch && statusMatch;
// // // //   });

// // // //   // ✅ FIX: Transform Admin data to match TableComponent requirements (including typo)
// // // //   const tableData: TableRowData[] = filteredData.map((admin: Admin) => {
// // // //     // Enhanced role processing for role-based system
// // // //     const roleNames = admin.roles?.map(ur => ur.role?.name || ur.name).filter(Boolean) || [];
// // // //     const primaryRole = roleNames[0] || "No Role";
// // // //     const roleDescriptions = admin.roles?.map(ur => ur.role?.description || ur.description).filter(Boolean) || [];
// // // //     const primaryDescription = roleDescriptions[0] || "No description available";

// // // //     // Determine invitation/account status
// // // //     const accountStatus = admin.adminStatus || admin.status || "ACTIVE";

// // // //     // ✅ FIX: Use 'discription' (with typo) to match TableComponent expectation
// // // //     const transformedRoles = {
// // // //       role: {
// // // //         id: admin.roles?.[0]?.role?.id || admin.roles?.[0]?.id || 0,
// // // //         name: primaryRole,
// // // //         discription: primaryDescription, // ✅ FIX: Use typo 'discription' not 'description'
// // // //       }
// // // //     };

// // // //     const adminData: TableRowData = {
// // // //       id: admin.id,
// // // //       email: admin.email || "N/A",
// // // //       name: admin.fullName || admin.username || admin.adminProfile?.username || "N/A",
// // // //       profile: {
// // // //         username: admin.username || admin.adminProfile?.username || "N/A",
// // // //         fullName: admin.fullName || admin.adminProfile?.fullName || "N/A",
// // // //         phone: admin.phone || admin.adminProfile?.phone || "N/A",
// // // //         gender: admin.gender || admin.adminProfile?.gender || "N/A",
// // // //       },
// // // //       role: primaryRole,
// // // //       description: primaryDescription,
// // // //       date: admin.createdAt || new Date().toISOString(),
// // // //       status: accountStatus,
// // // //       createdAt: admin.createdAt || new Date().toISOString(),
// // // //       roles: transformedRoles, // ✅ Now uses 'discription' field
// // // //       rolecount: String(roleNames.length),
// // // //       action: "",

// // // //       // Enhanced fields for role-based system
// // // //       formattedRole: roleNames.length > 1
// // // //         ? `${primaryRole} (+${roleNames.length - 1} more)`
// // // //         : primaryRole === "super_admin"
// // // //           ? "Super Admin"
// // // //           : primaryRole.replace(/_/g, " "),
// // // //       formattedDate: admin.createdAt
// // // //         ? new Date(admin.createdAt).toLocaleDateString("en-US", {
// // // //           day: "2-digit",
// // // //           month: "short",
// // // //           year: "numeric",
// // // //         })
// // // //         : "N/A",
// // // //       originalAdmin: admin,
// // // //       isRoleBased: true,
// // // //       invitationStatus: admin.invitationStatus,
// // // //       roleCount: roleNames.length,
// // // //     };

// // // //     return adminData;
// // // //   });

// // // //   const handleDeleteAdmin = async () => {
// // // //     if (!adminToDelete?.id) {
// // // //       toast.error("No admin selected for deletion");
// // // //       return;
// // // //     }

// // // //     try {
// // // //       await deleteAdmin(adminToDelete.id);
// // // //       toast.success("Admin deleted successfully");
// // // //       setDeleteDialogOpen(false);
// // // //       setAdminToDelete(null);
// // // //       refetch();
// // // //     } catch (error: any) {
// // // //       console.error("Delete admin error:", error);
// // // //       const errorMessage = error?.response?.data?.error ||
// // // //         error?.message ||
// // // //         "Failed to delete admin";
// // // //       toast.error(errorMessage);
// // // //     }
// // // //   };

// // // //   const openDeleteDialog = (admin: Admin) => {
// // // //     setAdminToDelete(admin);
// // // //     setDeleteDialogOpen(true);
// // // //   };

// // // //   // Enhanced filter lists for role-based system
// // // //   const statusList = [
// // // //     { text: "All Status", value: "select" },
// // // //     { text: "Active", value: "active" },
// // // //     { text: "Pending Invitation", value: "pending" },
// // // //     { text: "Inactive", value: "inactive" },
// // // //     { text: "Suspended", value: "suspended" },
// // // //   ];

// // // //   const roleList = [
// // // //     { text: "All Roles", value: "select" },
// // // //     { text: "Super Admin", value: "super_admin" },
// // // //     { text: "Admin", value: "admin" },
// // // //     { text: "Product Manager", value: "product_manager" },
// // // //     { text: "Inventory Manager", value: "inventory_manager" },
// // // //     { text: "Order Manager", value: "order_manager" },
// // // //     { text: "Customer Support", value: "customer_support" },
// // // //   ];

// // // //   const cellRenderers = {
// // // //     name: (item: TableRowData) => (
// // // //       <div className="flex flex-col gap-1 text-left">
// // // //         <div className="font-medium text-slate-800">
// // // //           {item.profile.fullName !== "N/A" ? item.profile.fullName :
// // // //             item.profile.username !== "N/A" ? item.profile.username :
// // // //               item.name !== "N/A" ? item.name : "Unknown"}
// // // //         </div>
// // // //         <div className="text-sm text-slate-500">{item.email !== "N/A" ? item.email : "No email"}</div>
// // // //         {item.roleCount > 1 && (
// // // //           <div className="text-xs text-blue-600">
// // // //             Multiple roles ({item.roleCount})
// // // //           </div>
// // // //         )}
// // // //       </div>
// // // //     ),
// // // //     role: (item: TableRowData) => (
// // // //       <div className="font-medium flex items-center gap-3 capitalize">
// // // //         {item.formattedRole.toLowerCase().includes("admin") ? (
// // // //           <PersonIcon />
// // // //         ) : (
// // // //           <RepIcon />
// // // //         )}
// // // //         <div className="flex flex-col">
// // // //           <span>{item.formattedRole}</span>
// // // //           {item.roleCount > 1 && (
// // // //             <span className="text-xs text-gray-500">
// // // //               {item.roleCount} roles assigned
// // // //             </span>
// // // //           )}
// // // //         </div>
// // // //       </div>
// // // //     ),
// // // //     description: (item: TableRowData) => (
// // // //       <div className="flex flex-col">
// // // //         <span className="font-medium">
// // // //           {item.description !== "No description available" ? item.description : "N/A"}
// // // //         </span>
// // // //         {item.originalAdmin?.permissionCount && (
// // // //           <span className="text-xs text-blue-600">
// // // //             {item.originalAdmin.permissionCount} permissions
// // // //           </span>
// // // //         )}
// // // //       </div>
// // // //     ),
// // // //     date: (item: TableRowData) => (
// // // //       <div className="font-medium flex items-center gap-3">
// // // //         <CalendarIcon />
// // // //         <div className="flex flex-col">
// // // //           <span>{item.formattedDate}</span>
// // // //           {item.invitationStatus === 'PENDING' && (
// // // //             <span className="text-xs text-amber-600 flex items-center gap-1">
// // // //               <Clock className="w-3 h-3" />
// // // //               Invitation pending
// // // //             </span>
// // // //           )}
// // // //         </div>
// // // //       </div>
// // // //     ),
// // // //     status: (item: TableRowData) => {
// // // //       const status = item.status?.toLowerCase();
// // // //       let variant: "success" | "tertiary" | "warning" | "destructive" = "warning";
// // // //       let statusText = item.status?.toUpperCase() || "UNKNOWN";

// // // //       // Enhanced status handling for role-based invitations
// // // //       if (status === "active") {
// // // //         variant = "success";
// // // //       } else if (status === "pending" || item.invitationStatus === 'PENDING') {
// // // //         variant = "tertiary";
// // // //         statusText = "PENDING INVITE";
// // // //       } else if (status === "suspended") {
// // // //         variant = "destructive";
// // // //       } else if (status === "inactive") {
// // // //         variant = "warning";
// // // //       }

// // // //       return (
// // // //         <div className="flex flex-col gap-1">
// // // //           <Badge
// // // //             variant={variant}
// // // //             className="py-1 px-[26px] font-medium"
// // // //           >
// // // //             {statusText}
// // // //           </Badge>
// // // //           {item.invitationStatus === 'PENDING' && (
// // // //             <span className="text-xs text-gray-500">
// // // //               Awaiting setup
// // // //             </span>
// // // //           )}
// // // //         </div>
// // // //       );
// // // //     },
// // // //     action: (item: TableRowData) => (
// // // //       <div className="flex gap-2.5">
// // // //         <Link
// // // //           href={`${ROUTES.ADMIN.SIDEBAR.ADMINS}/${item.id}?tab=general`}
// // // //           className="bg-[#27A376] p-2.5 rounded-lg"
// // // //         >
// // // //           <ViewIcon />
// // // //         </Link>
// // // //         <button
// // // //           onClick={() => item.originalAdmin && openDeleteDialog(item.originalAdmin)}
// // // //           className="bg-[#E03137] p-2.5 rounded-lg cursor-pointer"
// // // //           aria-label="Delete admin"
// // // //           disabled={item.originalAdmin?.email === email}
// // // //         >
// // // //           <DeleteIcon />
// // // //         </button>
// // // //       </div>
// // // //     ),
// // // //   };

// // // //   const columnOrder: (keyof TableRowData)[] = [
// // // //     "name",
// // // //     "role",
// // // //     "description",
// // // //     "date",
// // // //     "status",
// // // //     "action",
// // // //   ];

// // // //   const columnLabels: Partial<Record<keyof TableRowData, string>> = {
// // // //     name: "Name & Email",
// // // //     role: "Role(s)",
// // // //     description: "Description & Permissions",
// // // //     date: "Created Date",
// // // //     status: "Status",
// // // //     action: "",
// // // //   };

// // // //   return (
// // // //     <Card className="bg-white">
// // // //       <CardContent className="p-6">
// // // //         <div className="flex items-center justify-between mb-4">
// // // //           <div>
// // // //             <h6 className="font-semibold text-lg text-[#111827] mb-1">
// // // //               Role-Based Admin Management
// // // //             </h6>
// // // //             <p className="text-[#687588] font-medium text-sm mb-6">
// // // //               Manage administrators with role-based permissions and access control.
// // // //             </p>
// // // //           </div>
// // // //           <div className="flex items-center gap-2 text-sm text-gray-600">
// // // //             <CheckCircle className="w-4 h-4 text-green-600" />
// // // //             <span>Role-based access enabled</span>
// // // //           </div>
// // // //         </div>

// // // //         <div className="flex items-center gap-4 mb-6">
// // // //           <InputFilter
// // // //             setQuery={setNameFilter}
// // // //             placeholder="Search by name or email"
// // // //           />
// // // //           <SelectFilter
// // // //             setFilter={setRoleFilter}
// // // //             placeholder="Filter by Role"
// // // //             list={roleList}
// // // //           />
// // // //           <SelectFilter
// // // //             setFilter={setStatusFilter}
// // // //             placeholder="Filter by Status"
// // // //             list={statusList}
// // // //           />
// // // //         </div>

// // // //         <TableComponent<TableRowData>
// // // //           tableData={tableData}
// // // //           currentPage={currentPage}
// // // //           onPageChange={setCurrentPage}
// // // //           totalPages={Math.ceil(tableData.length / pageSize)}
// // // //           cellRenderers={cellRenderers}
// // // //           columnOrder={columnOrder}
// // // //           columnLabels={columnLabels}
// // // //           isLoading={loading}
// // // //         />
// // // //       </CardContent>

// // // //       <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
// // // //         <DialogContent className="sm:max-w-[425px]">
// // // //           <DialogHeader>
// // // //             <DialogTitle>Confirm Role-Based Admin Deletion</DialogTitle>
// // // //             <DialogDescription>
// // // //               Are you sure you want to delete{" "}
// // // //               <span className="font-medium">
// // // //                 {adminToDelete?.fullName ||
// // // //                   adminToDelete?.username ||
// // // //                   adminToDelete?.adminProfile?.username ||
// // // //                   adminToDelete?.email ||
// // // //                   "this admin"}
// // // //               </span>
// // // //               ? This will remove all their role-based permissions and access. This action cannot be undone.
// // // //             </DialogDescription>
// // // //           </DialogHeader>
// // // //           <DialogFooter>
// // // //             <Button
// // // //               variant="outline"
// // // //               onClick={() => setDeleteDialogOpen(false)}
// // // //               disabled={deleteAdminIsLoading}
// // // //             >
// // // //               Cancel
// // // //             </Button>
// // // //             <Button
// // // //               variant="destructive"
// // // //               onClick={handleDeleteAdmin}
// // // //               disabled={deleteAdminIsLoading || adminToDelete?.email === email}
// // // //             >
// // // //               {deleteAdminIsLoading ? "Deleting..." : "Delete Admin"}
// // // //             </Button>
// // // //           </DialogFooter>
// // // //         </DialogContent>
// // // //       </Dialog>
// // // //     </Card>
// // // //   );
// // // // };

// // // // export default DataTable;

// // // // "use client";
// // // // import React, { useState, useEffect } from "react";
// // // // import { Badge } from "@/components/ui/badge";
// // // // import { Card, CardContent } from "@/components/ui/card";
// // // // import { CalendarIcon, DeleteIcon, ViewIcon, PersonIcon, RepIcon } from "../../../../../../public/icons";
// // // // import { TableComponent } from "@/components/custom-table/inde";
// // // // import { SelectFilter } from "@/app/(admin)/components/select-filter";
// // // // import { InputFilter } from "@/app/(admin)/components/input-filter";
// // // // import Link from "next/link";
// // // // import { ROUTES } from "@/constant/routes";
// // // // import { toast } from "sonner";
// // // // import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
// // // // import { useDeleteAdmin } from "@/services/admin";
// // // // import { Button } from "@/components/ui/button";
// // // // import { Clock, CheckCircle } from "lucide-react";

// // // // "use client";
// // // // import React, { useState, useEffect, useCallback, useMemo } from "react";
// // // // import { Badge } from "@/components/ui/badge";
// // // // import { Card, CardContent } from "@/components/ui/card";
// // // // import { CalendarIcon, DeleteIcon, ViewIcon, PersonIcon, RepIcon } from "../../../../../../public/icons";
// // // // import { TableComponent } from "@/components/custom-table";
// // // // import { SelectFilter } from "@/app/(admin)/components/select-filter";
// // // // import { InputFilter } from "@/app/(admin)/components/input-filter";
// // // // import Link from "next/link";
// // // // import { ROUTES } from "@/constant/routes";
// // // // import { toast } from "sonner";
// // // // import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
// // // // import { useDeleteAdmin } from "@/services/admin";
// // // // import { Button } from "@/components/ui/button";
// // // // import { Clock, CheckCircle } from "lucide-react";

// // // // // Local type definitions to avoid import conflicts
// // // // interface AdminRole {
// // // //   id?: number;
// // // //   roleId?: number;
// // // //   name?: string;
// // // //   description?: string;
// // // //   role?: {
// // // //     id: number;
// // // //     name?: string;
// // // //     description?: string;
// // // //     permissions?: any[];
// // // //   };
// // // // }

// // // // interface AdminProfile {
// // // //   username?: string;
// // // //   fullName?: string;
// // // //   phone?: string;
// // // //   gender?: string;
// // // // }

// // // // interface Admin {
// // // //   id: number | string;
// // // //   email?: string;
// // // //   username?: string;
// // // //   fullName?: string;
// // // //   phone?: string;
// // // //   gender?: string;
// // // //   status?: string;
// // // //   adminStatus?: string;
// // // //   roles?: AdminRole[];
// // // //   permissionCount?: number;
// // // //   adminProfile?: AdminProfile;
// // // //   createdAt?: string;
// // // //   lastLogin?: string;
// // // //   invitationStatus?: 'COMPLETED' | 'PENDING' | 'EXPIRED' | 'CANCELLED';
// // // // }

// // // // // ✅ FIX: Match the exact structure expected by TableComponent (with typo)
// // // // interface TableRowData {
// // // //   id: number | string;
// // // //   email: string;
// // // //   name: string;
// // // //   profile: {
// // // //     username: string;
// // // //     fullName: string;
// // // //     phone: string;
// // // //     gender: string;
// // // //   };
// // // //   role: string;
// // // //   description: string;
// // // //   date: string;
// // // //   status: string;
// // // //   createdAt: string;
// // // //   roles: {
// // // //     role: {
// // // //       id: number;
// // // //       name: string;
// // // //       discription: string;
// // // //     };
// // // //   };
// // // //   rolecount: string;
// // // //   action: string;
// // // //   formattedRole: string;
// // // //   formattedDate: string;
// // // //   originalAdmin?: Admin;
// // // //   isRoleBased: boolean;
// // // //   invitationStatus?: 'COMPLETED' | 'PENDING' | 'EXPIRED' | 'CANCELLED';
// // // //   roleCount: number;
// // // //   [key: string]: any;
// // // // }

// // // // interface DataTableProps {
// // // //   adminData: Admin[];
// // // //   loading: boolean;
// // // //   refetch: () => void;
// // // //   totalItems: number;
// // // //   currentPage: number;
// // // //   totalPages: number;
// // // //   onPageChange: (page: number) => void;
// // // //   onLimitChange: (limit: number) => void;
// // // //   onFilterChange: (filters: any) => void;
// // // //   pageSize: number;
// // // // }

// // // // // const DataTable: React.FC<DataTableProps> = ({
// // // // //   adminData,
// // // // //   loading,
// // // // //   refetch,
// // // // //   totalItems,
// // // // //   currentPage,
// // // // //   totalPages,
// // // // //   onPageChange,
// // // // //   onLimitChange,
// // // // //   onFilterChange,
// // // // //   pageSize,
// // // // // }) => {
// // // // //   const [roleFilter, setRoleFilter] = useState<string>("");
// // // // //   const [statusFilter, setStatusFilter] = useState<string>("");
// // // // //   const [nameFilter, setNameFilter] = useState<string>("");
// // // // //   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
// // // // //   const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);
// // // // //   const [email, setEmail] = useState("");

// // // // const DataTable: React.FC<DataTableProps> = ({
// // // //   adminData,
// // // //   loading,
// // // //   refetch,
// // // //   totalItems,
// // // //   currentPage,
// // // //   totalPages,
// // // //   onPageChange,
// // // //   onLimitChange,
// // // //   onFilterChange,
// // // //   pageSize,
// // // // }) => {
// // // //   const [roleFilter, setRoleFilter] = useState<string>("");
// // // //   const [statusFilter, setStatusFilter] = useState<string>("");
// // // //   const [nameFilter, setNameFilter] = useState<string>("");
// // // //   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
// // // //   const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);
// // // //   const [email, setEmail] = useState("");

// // // //   // useEffect(() => {
// // // //   //   if (typeof window !== "undefined") {
// // // //   //     const storedEmail = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");
// // // //   //     if (storedEmail) setEmail(storedEmail);
// // // //   //   }
// // // //   // }, []);

// // // //   // const { deleteAdminPayload: deleteAdmin, deleteAdminIsLoading } = useDeleteAdmin();

// // // //   // // Ensure adminData is an array
// // // //   // const safeAdminData = Array.isArray(adminData) ? adminData : [];

// // // //   // // Apply filters to trigger API calls
// // // //   // useEffect(() => {
// // // //   //   const filters: any = {};
    
// // // //   //   if (nameFilter) {
// // // //   //     filters.search = nameFilter;
// // // //   //   }
    
// // // //   //   if (roleFilter && roleFilter !== "select") {
// // // //   //     filters.role = roleFilter;
// // // //   //   }
    
// // // //   //   if (statusFilter && statusFilter !== "select") {
// // // //   //     filters.status = statusFilter;
// // // //   //   }
    
// // // //   //   onFilterChange(filters);
// // // //   // }, [nameFilter, roleFilter, statusFilter, onFilterChange]);

// // // //    useEffect(() => {
// // // //     if (typeof window !== "undefined") {
// // // //       const storedEmail = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");
// // // //       if (storedEmail) setEmail(storedEmail);
// // // //     }
// // // //   }, []);

// // // //   const { deleteAdminPayload: deleteAdmin, deleteAdminIsLoading } = useDeleteAdmin();

// // // //   // Ensure adminData is an array
// // // //   const safeAdminData = Array.isArray(adminData) ? adminData : [];

// // // //   // ✅ FIX: Use useCallback to prevent infinite loops
// // // //   const handleFilterChange = useCallback((newFilters: any) => {
// // // //     if (onFilterChange) {
// // // //       onFilterChange(newFilters);
// // // //     }
// // // //   }, [onFilterChange]);

// // // //   // ✅ FIX: Use debounce for filter changes to prevent too many API calls
// // // //   useEffect(() => {
// // // //     const timer = setTimeout(() => {
// // // //       const filters: any = {};
      
// // // //       if (nameFilter) {
// // // //         filters.search = nameFilter;
// // // //       }
      
// // // //       if (roleFilter && roleFilter !== "select") {
// // // //         filters.role = roleFilter;
// // // //       }
      
// // // //       if (statusFilter && statusFilter !== "select") {
// // // //         filters.status = statusFilter;
// // // //       }
      
// // // //       handleFilterChange(filters);
// // // //     }, 500); // 500ms debounce

// // // //     return () => clearTimeout(timer);
// // // //   }, [nameFilter, roleFilter, statusFilter, handleFilterChange]);
// // // //   // ✅ FIX: Transform Admin data to match TableComponent requirements (including typo)
// // // //   // const tableData: TableRowData[] = safeAdminData.map((admin: Admin) => {
// // // //   //   // Enhanced role processing for role-based system
// // // //   //   const roleNames = admin.roles?.map(ur => ur.role?.name || ur.name).filter(Boolean) || [];
// // // //   //   const primaryRole = roleNames[0] || "No Role";
// // // //   //   const roleDescriptions = admin.roles?.map(ur => ur.role?.description || ur.description).filter(Boolean) || [];
// // // //   //   const primaryDescription = roleDescriptions[0] || "No description available";

// // // //   //   // Determine invitation/account status
// // // //   //   const accountStatus = admin.adminStatus || admin.status || "ACTIVE";

// // // //   //   // ✅ FIX: Use 'discription' (with typo) to match TableComponent expectation
// // // //   //   const transformedRoles = {
// // // //   //     role: {
// // // //   //       id: admin.roles?.[0]?.role?.id || admin.roles?.[0]?.id || 0,
// // // //   //       name: primaryRole,
// // // //   //       discription: primaryDescription, // ✅ FIX: Use typo 'discription' not 'description'
// // // //   //     }
// // // //   //   };

// // // //   //   const adminData: TableRowData = {
// // // //   //     id: admin.id,
// // // //   //     email: admin.email || "N/A",
// // // //   //     name: admin.fullName || admin.username || admin.adminProfile?.username || "N/A",
// // // //   //     profile: {
// // // //   //       username: admin.username || admin.adminProfile?.username || "N/A",
// // // //   //       fullName: admin.fullName || admin.adminProfile?.fullName || "N/A",
// // // //   //       phone: admin.phone || admin.adminProfile?.phone || "N/A",
// // // //   //       gender: admin.gender || admin.adminProfile?.gender || "N/A",
// // // //   //     },
// // // //   //     role: primaryRole,
// // // //   //     description: primaryDescription,
// // // //   //     date: admin.createdAt || new Date().toISOString(),
// // // //   //     status: accountStatus,
// // // //   //     createdAt: admin.createdAt || new Date().toISOString(),
// // // //   //     roles: transformedRoles, // ✅ Now uses 'discription' field
// // // //   //     rolecount: String(roleNames.length),
// // // //   //     action: "",

// // // //   //     // Enhanced fields for role-based system
// // // //   //     formattedRole: roleNames.length > 1
// // // //   //       ? `${primaryRole} (+${roleNames.length - 1} more)`
// // // //   //       : primaryRole === "super_admin"
// // // //   //         ? "Super Admin"
// // // //   //         : primaryRole.replace(/_/g, " "),
// // // //   //     formattedDate: admin.createdAt
// // // //   //       ? new Date(admin.createdAt).toLocaleDateString("en-US", {
// // // //   //         day: "2-digit",
// // // //   //         month: "short",
// // // //   //         year: "numeric",
// // // //   //       })
// // // //   //       : "N/A",
// // // //   //     originalAdmin: admin,
// // // //   //     isRoleBased: true,
// // // //   //     invitationStatus: admin.invitationStatus,
// // // //   //     roleCount: roleNames.length,
// // // //   //   };

// // // //   //   return adminData;
// // // //   // });

// // // //   const tableData = useMemo(() => {
// // // //     return safeAdminData.map((admin: Admin) => {
// // // //       const primaryRole = admin.roles?.[0]?.name || "N/A";
// // // //       const primaryDescription = admin.roles?.[0]?.description || "N/A";
// // // //       const roleNames = admin.roles?.map(role => role.name) || [];
// // // //       const transformedRoles = admin.roles?.map(role => ({
// // // //         name: role.name,
// // // //         description: role.description,
// // // //       })) || [];
// // // //       const accountStatus = admin.status || "inactive";
  
// // // //       const adminData: any = {
// // // //         id: admin.id,
// // // //         email: admin.email || "N/A",
// // // //         name:
// // // //           admin.fullName ||
// // // //           admin.username ||
// // // //           admin.adminProfile?.username ||
// // // //           "N/A",
// // // //         profile: {
// // // //           username: admin.username || admin.adminProfile?.username || "N/A",
// // // //           fullName: admin.fullName || admin.adminProfile?.fullName || "N/A",
// // // //           phone: admin.phone || admin.adminProfile?.phone || "N/A",
// // // //           gender: admin.gender || admin.adminProfile?.gender || "N/A",
// // // //         },
// // // //         role: primaryRole,
// // // //         description: primaryDescription,
// // // //         date: admin.createdAt || new Date().toISOString(),
// // // //         status: accountStatus,
// // // //         createdAt: admin.createdAt || new Date().toISOString(),
// // // //         roles: transformedRoles,
// // // //         rolecount: String(roleNames.length),
// // // //         action: "",
  
// // // //         // Enhanced fields for role-based system
// // // //         formattedRole:
// // // //           roleNames.length > 1
// // // //             ? `${primaryRole} (+${roleNames.length - 1} more)`
// // // //             : primaryRole === "super_admin"
// // // //             ? "Super Admin"
// // // //             : primaryRole.replace(/_/g, " "),
// // // //         formattedDate: admin.createdAt
// // // //           ? new Date(admin.createdAt).toLocaleDateString("en-US", {
// // // //               day: "2-digit",
// // // //               month: "short",
// // // //               year: "numeric",
// // // //             })
// // // //           : "N/A",
// // // //         originalAdmin: admin,
// // // //         isRoleBased: true,
// // // //         invitationStatus: admin.invitationStatus,
// // // //         roleCount: roleNames.length,
// // // //       };
  
// // // //       return adminData;
// // // //     });
// // // //   }, [safeAdminData]);

// // // //   const handleDeleteAdmin = async () => {
// // // //     if (!adminToDelete?.id) {
// // // //       toast.error("No admin selected for deletion");
// // // //       return;
// // // //     }

// // // //     try {
// // // //       await deleteAdmin(adminToDelete.id);
// // // //       toast.success("Admin deleted successfully");
// // // //       setDeleteDialogOpen(false);
// // // //       setAdminToDelete(null);
// // // //       refetch();
// // // //     } catch (error: any) {
// // // //       console.error("Delete admin error:", error);
// // // //       const errorMessage = error?.response?.data?.error ||
// // // //         error?.message ||
// // // //         "Failed to delete admin";
// // // //       toast.error(errorMessage);
// // // //     }
// // // //   };

// // // //   const openDeleteDialog = (admin: Admin) => {
// // // //     setAdminToDelete(admin);
// // // //     setDeleteDialogOpen(true);
// // // //   };

// // // //   // Enhanced filter lists for role-based system
// // // //   const statusList = [
// // // //     { text: "All Status", value: "select" },
// // // //     { text: "Active", value: "active" },
// // // //     { text: "Pending Invitation", value: "pending" },
// // // //     { text: "Inactive", value: "inactive" },
// // // //     { text: "Suspended", value: "suspended" },
// // // //   ];

// // // //   const roleList = [
// // // //     { text: "All Roles", value: "select" },
// // // //     { text: "Super Admin", value: "super_admin" },
// // // //     { text: "Admin", value: "admin" },
// // // //     { text: "Product Manager", value: "product_manager" },
// // // //     { text: "Inventory Manager", value: "inventory_manager" },
// // // //     { text: "Order Manager", value: "order_manager" },
// // // //     { text: "Customer Support", value: "customer_support" },
// // // //   ];

// // // //   // const cellRenderers = {
// // // //   //   name: (item: TableRowData) => (
// // // //   //     <div className="flex flex-col gap-1 text-left">
// // // //   //       <div className="font-medium text-slate-800">
// // // //   //         {item.profile.fullName !== "N/A" ? item.profile.fullName :
// // // //   //           item.profile.username !== "N/A" ? item.profile.username :
// // // //   //             item.name !== "N/A" ? item.name : "Unknown"}
// // // //   //       </div>
// // // //   //       <div className="text-sm text-slate-500">{item.email !== "N/A" ? item.email : "No email"}</div>
// // // //   //       {item.roleCount > 1 && (
// // // //   //         <div className="text-xs text-blue-600">
// // // //   //           Multiple roles ({item.roleCount})
// // // //   //         </div>
// // // //   //       )}
// // // //   //     </div>
// // // //   //   ),
// // // //   //   role: (item: TableRowData) => (
// // // //   //     <div className="font-medium flex items-center gap-3 capitalize">
// // // //   //       {item.formattedRole.toLowerCase().includes("admin") ? (
// // // //   //         <PersonIcon />
// // // //   //       ) : (
// // // //   //         <RepIcon />
// // // //   //       )}
// // // //   //       <div className="flex flex-col">
// // // //   //         <span>{item.formattedRole}</span>
// // // //   //         {item.roleCount > 1 && (
// // // //   //           <span className="text-xs text-gray-500">
// // // //   //             {item.roleCount} roles assigned
// // // //   //           </span>
// // // //   //         )}
// // // //   //       </div>
// // // //   //     </div>
// // // //   //   ),
// // // //   //   description: (item: TableRowData) => (
// // // //   //     <div className="flex flex-col">
// // // //   //       <span className="font-medium">
// // // //   //         {item.description !== "No description available" ? item.description : "N/A"}
// // // //   //       </span>
// // // //   //       {item.originalAdmin?.permissionCount && (
// // // //   //         <span className="text-xs text-blue-600">
// // // //   //           {item.originalAdmin.permissionCount} permissions
// // // //   //         </span>
// // // //   //       )}
// // // //   //     </div>
// // // //   //   ),
// // // //   //   date: (item: TableRowData) => (
// // // //   //     <div className="font-medium flex items-center gap-3">
// // // //   //       <CalendarIcon />
// // // //   //       <div className="flex flex-col">
// // // //   //         <span>{item.formattedDate}</span>
// // // //   //         {item.invitationStatus === 'PENDING' && (
// // // //   //           <span className="text-xs text-amber-600 flex items-center gap-1">
// // // //   //             <Clock className="w-3 h-3" />
// // // //   //             Invitation pending
// // // //   //           </span>
// // // //   //         )}
// // // //   //       </div>
// // // //   //     </div>
// // // //   //   ),
// // // //   //   status: (item: TableRowData) => {
// // // //   //     const status = item.status?.toLowerCase();
// // // //   //     let variant: "success" | "tertiary" | "warning" | "destructive" = "warning";
// // // //   //     let statusText = item.status?.toUpperCase() || "UNKNOWN";

// // // //   //     // Enhanced status handling for role-based invitations
// // // //   //     if (status === "active") {
// // // //   //       variant = "success";
// // // //   //     } else if (status === "pending" || item.invitationStatus === 'PENDING') {
// // // //   //       variant = "tertiary";
// // // //   //       statusText = "PENDING INVITE";
// // // //   //     } else if (status === "suspended") {
// // // //   //       variant = "destructive";
// // // //   //     } else if (status === "inactive") {
// // // //   //       variant = "warning";
// // // //   //     }

// // // //   //     return (
// // // //   //       <div className="flex flex-col gap-1">
// // // //   //         <Badge
// // // //   //           variant={variant}
// // // //   //           className="py-1 px-[26px] font-medium"
// // // //   //         >
// // // //   //           {statusText}
// // // //   //         </Badge>
// // // //   //         {item.invitationStatus === 'PENDING' && (
// // // //   //           <span className="text-xs text-gray-500">
// // // //   //             Awaiting setup
// // // //   //           </span>
// // // //   //         )}
// // // //   //       </div>
// // // //   //     );
// // // //   //   },
// // // //   //   action: (item: TableRowData) => (
// // // //   //     <div className="flex gap-2.5">
// // // //   //       <Link
// // // //   //         href={`${ROUTES.ADMIN.SIDEBAR.ADMINS}/${item.id}?tab=general`}
// // // //   //         className="bg-[#27A376] p-2.5 rounded-lg"
// // // //   //       >
// // // //   //         <ViewIcon />
// // // //   //       </Link>
// // // //   //       <button
// // // //   //         onClick={() => item.originalAdmin && openDeleteDialog(item.originalAdmin)}
// // // //   //         className="bg-[#E03137] p-2.5 rounded-lg cursor-pointer"
// // // //   //         aria-label="Delete admin"
// // // //   //         disabled={item.originalAdmin?.email === email}
// // // //   //       >
// // // //   //         <DeleteIcon />
// // // //   //       </button>
// // // //   //     </div>
// // // //   //   ),
// // // //   // };


// // // //   const cellRenderers = useMemo(() => ({
// // // //     name: (item: TableRowData) => (
// // // //       <div className="flex flex-col gap-1 text-left">
// // // //         <div className="font-medium text-slate-800">
// // // //           {item.profile.fullName !== "N/A"
// // // //             ? item.profile.fullName
// // // //             : item.profile.username !== "N/A"
// // // //             ? item.profile.username
// // // //             : item.name !== "N/A"
// // // //             ? item.name
// // // //             : "Unknown"}
// // // //         </div>
// // // //         <div className="text-sm text-slate-500">
// // // //           {item.email !== "N/A" ? item.email : "No email"}
// // // //         </div>
// // // //         {item.roleCount > 1 && (
// // // //           <div className="text-xs text-blue-600">
// // // //             Multiple roles ({item.roleCount})
// // // //           </div>
// // // //         )}
// // // //       </div>
// // // //     ),
  
// // // //     role: (item: TableRowData) => (
// // // //       <div className="font-medium flex items-center gap-3 capitalize">
// // // //         {item.formattedRole.toLowerCase().includes("admin") ? (
// // // //           <PersonIcon />
// // // //         ) : (
// // // //           <RepIcon />
// // // //         )}
// // // //         <div className="flex flex-col">
// // // //           <span>{item.formattedRole}</span>
// // // //           {item.roleCount > 1 && (
// // // //             <span className="text-xs text-gray-500">
// // // //               {item.roleCount} roles assigned
// // // //             </span>
// // // //           )}
// // // //         </div>
// // // //       </div>
// // // //     ),
  
// // // //     description: (item: TableRowData) => (
// // // //       <div className="flex flex-col">
// // // //         <span className="font-medium">
// // // //           {item.description !== "No description available"
// // // //             ? item.description
// // // //             : "N/A"}
// // // //         </span>
// // // //         {item.originalAdmin?.permissionCount && (
// // // //           <span className="text-xs text-blue-600">
// // // //             {item.originalAdmin.permissionCount} permissions
// // // //           </span>
// // // //         )}
// // // //       </div>
// // // //     ),
  
// // // //     date: (item: TableRowData) => (
// // // //       <div className="font-medium flex items-center gap-3">
// // // //         <CalendarIcon />
// // // //         <div className="flex flex-col">
// // // //           <span>{item.formattedDate}</span>
// // // //           {item.invitationStatus === "PENDING" && (
// // // //             <span className="text-xs text-amber-600 flex items-center gap-1">
// // // //               <Clock className="w-3 h-3" />
// // // //               Invitation pending
// // // //             </span>
// // // //           )}
// // // //         </div>
// // // //       </div>
// // // //     ),
  
// // // //     status: (item: TableRowData) => {
// // // //       const status = item.status?.toLowerCase();
// // // //       let variant: "success" | "tertiary" | "warning" | "destructive" = "warning";
// // // //       let statusText = item.status?.toUpperCase() || "UNKNOWN";
  
// // // //       if (status === "active") {
// // // //         variant = "success";
// // // //       } else if (status === "pending" || item.invitationStatus === "PENDING") {
// // // //         variant = "tertiary";
// // // //         statusText = "PENDING INVITE";
// // // //       } else if (status === "suspended") {
// // // //         variant = "destructive";
// // // //       } else if (status === "inactive") {
// // // //         variant = "warning";
// // // //       }
  
// // // //       return (
// // // //         <div className="flex flex-col gap-1">
// // // //           <Badge variant={variant} className="py-1 px-[26px] font-medium">
// // // //             {statusText}
// // // //           </Badge>
// // // //           {item.invitationStatus === "PENDING" && (
// // // //             <span className="text-xs text-gray-500">Awaiting setup</span>
// // // //           )}
// // // //         </div>
// // // //       );
// // // //     },
  
// // // //     action: (item: TableRowData) => (
// // // //       <div className="flex gap-2.5">
// // // //         <Link
// // // //           href={`${ROUTES.ADMIN.SIDEBAR.ADMINS}/${item.id}?tab=general`}
// // // //           className="bg-[#27A376] p-2.5 rounded-lg"
// // // //         >
// // // //           <ViewIcon />
// // // //         </Link>
// // // //         <button
// // // //           onClick={() =>
// // // //             item.originalAdmin && openDeleteDialog(item.originalAdmin)
// // // //           }
// // // //           className="bg-[#E03137] p-2.5 rounded-lg cursor-pointer"
// // // //           aria-label="Delete admin"
// // // //           disabled={item.originalAdmin?.email === email}
// // // //         >
// // // //           <DeleteIcon />
// // // //         </button>
// // // //       </div>
// // // //     ),
// // // //   }), []);


// // // //   const columnOrder: (keyof TableRowData)[] = [
// // // //     "name",
// // // //     "role",
// // // //     "description",
// // // //     "date",
// // // //     "status",
// // // //     "action",
// // // //   ];

// // // //   const columnLabels: Partial<Record<keyof TableRowData, string>> = {
// // // //     name: "Name & Email",
// // // //     role: "Role(s)",
// // // //     description: "Description & Permissions",
// // // //     date: "Created Date",
// // // //     status: "Status",
// // // //     action: "",
// // // //   };

// // // //   return (
// // // //     <Card className="bg-white">
// // // //       <CardContent className="p-6">
// // // //         <div className="flex items-center justify-between mb-4">
// // // //           <div>
// // // //             <h6 className="font-semibold text-lg text-[#111827] mb-1">
// // // //               Role-Based Admin Management
// // // //             </h6>
// // // //             <p className="text-[#687588] font-medium text-sm mb-6">
// // // //               Manage administrators with role-based permissions and access control.
// // // //             </p>
// // // //           </div>
// // // //           <div className="flex items-center gap-2 text-sm text-gray-600">
// // // //             <CheckCircle className="w-4 h-4 text-green-600" />
// // // //             <span>Role-based access enabled</span>
// // // //           </div>
// // // //         </div>

// // // //         <div className="flex items-center gap-4 mb-6">
// // // //           <InputFilter
// // // //             setQuery={setNameFilter}
// // // //             placeholder="Search by name or email"
// // // //           />
// // // //           <SelectFilter
// // // //             setFilter={setRoleFilter}
// // // //             placeholder="Filter by Role"
// // // //             list={roleList}
// // // //           />
// // // //           <SelectFilter
// // // //             setFilter={setStatusFilter}
// // // //             placeholder="Filter by Status"
// // // //             list={statusList}
// // // //           />
// // // //         </div>
// // // // {/* 
// // // //         <TableComponent<TableRowData>
// // // //           tableData={tableData}
// // // //           currentPage={currentPage}
// // // //           onPageChange={onPageChange}
// // // //           totalPages={totalPages}
// // // //           cellRenderers={cellRenderers}
// // // //           columnOrder={columnOrder}
// // // //           columnLabels={columnLabels}
// // // //           isLoading={loading}
// // // //           onPageSizeChange={(value) => onLimitChange(Number(value))}
// // // //           totalItems={totalItems}
// // // //         /> */}
// // // //             <TableComponent<TableRowData>
// // // //           tableData={tableData}
// // // //           currentPage={currentPage}
// // // //           onPageChange={onPageChange}
// // // //           totalPages={totalPages}
// // // //           cellRenderers={cellRenderers}
// // // //           columnOrder={columnOrder}
// // // //           columnLabels={columnLabels}
// // // //           isLoading={loading}
// // // //           onPageSizeChange={(value) => onLimitChange && onLimitChange(Number(value))}
// // // //           totalItems={totalItems}
// // // //         />
// // // //       </CardContent>

// // // //       <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
// // // //         <DialogContent className="sm:max-w-[425px]">
// // // //           <DialogHeader>
// // // //             <DialogTitle>Confirm Role-Based Admin Deletion</DialogTitle>
// // // //             <DialogDescription>
// // // //               Are you sure you want to delete{" "}
// // // //               <span className="font-medium">
// // // //                 {adminToDelete?.fullName ||
// // // //                   adminToDelete?.username ||
// // // //                   adminToDelete?.adminProfile?.username ||
// // // //                   adminToDelete?.email ||
// // // //                   "this admin"}
// // // //               </span>
// // // //               ? This will remove all their role-based permissions and access. This action cannot be undone.
// // // //             </DialogDescription>
// // // //           </DialogHeader>
// // // //           <DialogFooter>
// // // //             <Button
// // // //               variant="outline"
// // // //               onClick={() => setDeleteDialogOpen(false)}
// // // //               disabled={deleteAdminIsLoading}
// // // //             >
// // // //               Cancel
// // // //             </Button>
// // // //             <Button
// // // //               variant="destructive"
// // // //               onClick={handleDeleteAdmin}
// // // //               disabled={deleteAdminIsLoading || adminToDelete?.email === email}
// // // //             >
// // // //               {deleteAdminIsLoading ? "Deleting..." : "Delete Admin"}
// // // //             </Button>
// // // //           </DialogFooter>
// // // //         </DialogContent>
// // // //       </Dialog>
// // // //     </Card>
// // // //   );
// // // // };

// // // // export default DataTable;

// // // // "use client";
// // // // import React, { useState, useEffect, useCallback, useMemo } from "react";
// // // // import { Badge } from "@/components/ui/badge";
// // // // import { Card, CardContent } from "@/components/ui/card";
// // // // import { CalendarIcon, DeleteIcon, ViewIcon, PersonIcon, RepIcon } from "../../../../../../public/icons";
// // // // import { TableComponent } from "@/components/custom-table";
// // // // import { SelectFilter } from "@/app/(admin)/components/select-filter";
// // // // import { InputFilter } from "@/app/(admin)/components/input-filter";
// // // // import Link from "next/link";
// // // // import { ROUTES } from "@/constant/routes";
// // // // import { toast } from "sonner";
// // // // import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
// // // // import { useDeleteAdmin } from "@/services/admin";
// // // // import { Button } from "@/components/ui/button";
// // // // import { Clock, CheckCircle } from "lucide-react";

// // // // // Local type definitions
// // // // interface Admin {
// // // //   id: number | string;
// // // //   email?: string;
// // // //   username?: string;
// // // //   fullName?: string;
// // // //   phone?: string;
// // // //   gender?: string;
// // // //   status?: string;
// // // //   adminStatus?: string;
// // // //   role?: string; // This is a string in your data, not an array
// // // //   createdAt?: string;
// // // //   lastLogin?: string;
// // // //   invitationStatus?: 'COMPLETED' | 'PENDING' | 'EXPIRED' | 'CANCELLED';
// // // // }

// // // // interface TableRowData {
// // // //   id: number | string;
// // // //   email: string;
// // // //   name: string;
// // // //   profile: {
// // // //     username: string;
// // // //     fullName: string;
// // // //     phone: string;
// // // //     gender: string;
// // // //   };
// // // //   role: string;
// // // //   description: string;
// // // //   date: string;
// // // //   status: string;
// // // //   createdAt: string;
// // // //   roles: {
// // // //     role: {
// // // //       id: number;
// // // //       name: string;
// // // //       discription: string; // Note the typo to match your interface
// // // //     };
// // // //   };
// // // //   rolecount: string;
// // // //   action: string;
// // // //   formattedRole: string;
// // // //   formattedDate: string;
// // // //   originalAdmin?: Admin;
// // // //   isRoleBased: boolean;
// // // //   invitationStatus?: 'COMPLETED' | 'PENDING' | 'EXPIRED' | 'CANCELLED';
// // // //   roleCount: number;
// // // //   [key: string]: any;
// // // // }

// // // // interface DataTableProps {
// // // //   adminData: Admin[];
// // // //   loading: boolean;
// // // //   refetch: () => void;
// // // //   totalItems: number;
// // // //   currentPage: number;
// // // //   totalPages: number;
// // // //   onPageChange: (page: number) => void;
// // // //   onLimitChange: (limit: number) => void;
// // // //   onFilterChange: (filters: any) => void;
// // // //   pageSize: number;
// // // // }

// // // // const DataTable: React.FC<DataTableProps> = ({
// // // //   adminData,
// // // //   loading,
// // // //   refetch,
// // // //   totalItems,
// // // //   currentPage,
// // // //   totalPages,
// // // //   onPageChange,
// // // //   onLimitChange,
// // // //   onFilterChange,
// // // //   pageSize,
// // // // }) => {
// // // //   const [roleFilter, setRoleFilter] = useState<string>("");
// // // //   const [statusFilter, setStatusFilter] = useState<string>("");
// // // //   const [nameFilter, setNameFilter] = useState<string>("");
// // // //   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
// // // //   const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);
// // // //   const [email, setEmail] = useState("");

// // // //   useEffect(() => {
// // // //     if (typeof window !== "undefined") {
// // // //       const storedEmail = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");
// // // //       if (storedEmail) setEmail(storedEmail);
// // // //     }
// // // //   }, []);

// // // //   const { deleteAdminPayload: deleteAdmin, deleteAdminIsLoading } = useDeleteAdmin();

// // // //   // Ensure adminData is an array
// // // //   const safeAdminData = Array.isArray(adminData) ? adminData : [];

// // // //   // Handle filter changes with debounce
// // // //   const handleFilterChange = useCallback((newFilters: any) => {
// // // //     if (onFilterChange) {
// // // //       onFilterChange(newFilters);
// // // //     }
// // // //   }, [onFilterChange]);

// // // //   useEffect(() => {
// // // //     const timer = setTimeout(() => {
// // // //       const filters: any = {};
      
// // // //       if (nameFilter) {
// // // //         filters.search = nameFilter;
// // // //       }
      
// // // //       if (roleFilter && roleFilter !== "select") {
// // // //         filters.role = roleFilter;
// // // //       }
      
// // // //       if (statusFilter && statusFilter !== "select") {
// // // //         filters.status = statusFilter;
// // // //       }
      
// // // //       handleFilterChange(filters);
// // // //     }, 500);

// // // //     return () => clearTimeout(timer);
// // // //   }, [nameFilter, roleFilter, statusFilter, handleFilterChange]);

// // // //   // Transform Admin data to match TableComponent requirements
// // // //   const tableData = useMemo(() => {
// // // //     return safeAdminData.map((admin: Admin) => {
// // // //       // Get the role name from the admin data
// // // //       const roleName = admin.role || "N/A";
      
// // // //       // Create a description based on the role
// // // //       const roleDescription = roleName === "N/A" 
// // // //         ? "No role assigned" 
// // // //         : `${roleName.replace(/_/g, " ")} role`;

// // // //       const accountStatus = admin.status || "inactive";

// // // //       const adminData: TableRowData = {
// // // //         id: admin.id,
// // // //         email: admin.email || "N/A",
// // // //         name: admin.fullName || admin.username || "N/A",
// // // //         profile: {
// // // //           username: admin.username || "N/A",
// // // //           fullName: admin.fullName || "N/A",
// // // //           phone: admin.phone || "N/A",
// // // //           gender: admin.gender || "N/A",
// // // //         },
// // // //         role: roleName,
// // // //         description: roleDescription,
// // // //         date: admin.createdAt || new Date().toISOString(),
// // // //         status: accountStatus,
// // // //         createdAt: admin.createdAt || new Date().toISOString(),
// // // //         roles: {
// // // //           role: {
// // // //             id: 0, // Placeholder since we don't have role ID
// // // //             name: roleName,
// // // //             discription: roleDescription, // Using the typo to match interface
// // // //           }
// // // //         },
// // // //         rolecount: "1", // Assuming one role per admin based on your data
// // // //         action: "",
// // // //         formattedRole: roleName === "SUPER_ADMIN" 
// // // //           ? "Super Admin" 
// // // //           : roleName.replace(/_/g, " "),
// // // //         formattedDate: admin.createdAt
// // // //           ? new Date(admin.createdAt).toLocaleDateString("en-US", {
// // // //               day: "2-digit",
// // // //               month: "short",
// // // //               year: "numeric",
// // // //             })
// // // //           : "N/A",
// // // //         originalAdmin: admin,
// // // //         isRoleBased: true,
// // // //         invitationStatus: admin.invitationStatus,
// // // //         roleCount: 1, // Assuming one role per admin
// // // //       };

// // // //       return adminData;
// // // //     });
// // // //   }, [safeAdminData]);

// // // //   const handleDeleteAdmin = async () => {
// // // //     if (!adminToDelete?.id) {
// // // //       toast.error("No admin selected for deletion");
// // // //       return;
// // // //     }

// // // //     try {
// // // //       await deleteAdmin(adminToDelete.id);
// // // //       toast.success("Admin deleted successfully");
// // // //       setDeleteDialogOpen(false);
// // // //       setAdminToDelete(null);
// // // //       refetch();
// // // //     } catch (error: any) {
// // // //       console.error("Delete admin error:", error);
// // // //       const errorMessage = error?.response?.data?.error ||
// // // //         error?.message ||
// // // //         "Failed to delete admin";
// // // //       toast.error(errorMessage);
// // // //     }
// // // //   };

// // // //   const openDeleteDialog = (admin: Admin) => {
// // // //     setAdminToDelete(admin);
// // // //     setDeleteDialogOpen(true);
// // // //   };

// // // //   // Filter lists
// // // //   const statusList = [
// // // //     { text: "All Status", value: "select" },
// // // //     { text: "Active", value: "active" },
// // // //     { text: "Pending Invitation", value: "pending" },
// // // //     { text: "Inactive", value: "inactive" },
// // // //     { text: "Suspended", value: "suspended" },
// // // //   ];

// // // //   const roleList = [
// // // //     { text: "All Roles", value: "select" },
// // // //     { text: "Super Admin", value: "SUPER_ADMIN" },
// // // //     { text: "Customer Service", value: "CUSTOMER_SERVICE" },
// // // //     { text: "Order Manager", value: "ORDER_MANAGER" },
// // // //     { text: "Product Manager", value: "PRODUCT_MANAGER" },
// // // //     { text: "Inventory Manager", value: "INVENTORY_MANAGER" },
// // // //     { text: "Analyst", value: "ANALYST" },
// // // //     { text: "Compliance Officer", value: "COMPLIANCE_OFFICER" },
// // // //   ];

// // // //   const cellRenderers = useMemo(() => ({
// // // //     name: (item: TableRowData) => (
// // // //       <div className="flex flex-col gap-1 text-left">
// // // //         <div className="font-medium text-slate-800">
// // // //           {item.profile.fullName !== "N/A" ? item.profile.fullName :
// // // //             item.profile.username !== "N/A" ? item.profile.username :
// // // //               item.name !== "N/A" ? item.name : "Unknown"}
// // // //         </div>
// // // //         <div className="text-sm text-slate-500">
// // // //           {item.email !== "N/A" ? item.email : "No email"}
// // // //         </div>
// // // //       </div>
// // // //     ),
  
// // // //     role: (item: TableRowData) => (
// // // //       <div className="font-medium flex items-center gap-3 capitalize">
// // // //         {item.formattedRole.toLowerCase().includes("admin") ? (
// // // //           <PersonIcon />
// // // //         ) : (
// // // //           <RepIcon />
// // // //         )}
// // // //         <div className="flex flex-col">
// // // //           <span>{item.formattedRole}</span>
// // // //         </div>
// // // //       </div>
// // // //     ),
  
// // // //     description: (item: TableRowData) => (
// // // //       <div className="flex flex-col">
// // // //         <span className="font-medium">
// // // //           {item.description}
// // // //         </span>
// // // //       </div>
// // // //     ),
  
// // // //     date: (item: TableRowData) => (
// // // //       <div className="font-medium flex items-center gap-3">
// // // //         <CalendarIcon />
// // // //         <div className="flex flex-col">
// // // //           <span>{item.formattedDate}</span>
// // // //           {item.invitationStatus === "PENDING" && (
// // // //             <span className="text-xs text-amber-600 flex items-center gap-1">
// // // //               <Clock className="w-3 h-3" />
// // // //               Invitation pending
// // // //             </span>
// // // //           )}
// // // //         </div>
// // // //       </div>
// // // //     ),
  
// // // //     status: (item: TableRowData) => {
// // // //       const status = item.status?.toLowerCase();
// // // //       let variant: "success" | "tertiary" | "warning" | "destructive" = "warning";
// // // //       let statusText = item.status?.toUpperCase() || "UNKNOWN";

// // // //       if (status === "active") {
// // // //         variant = "success";
// // // //       } else if (status === "pending" || item.invitationStatus === "PENDING") {
// // // //         variant = "tertiary";
// // // //         statusText = "PENDING INVITE";
// // // //       } else if (status === "suspended") {
// // // //         variant = "destructive";
// // // //       } else if (status === "inactive") {
// // // //         variant = "warning";
// // // //       }

// // // //       return (
// // // //         <div className="flex flex-col gap-1">
// // // //           <Badge variant={variant} className="py-1 px-[26px] font-medium">
// // // //             {statusText}
// // // //           </Badge>
// // // //           {item.invitationStatus === "PENDING" && (
// // // //             <span className="text-xs text-gray-500">Awaiting setup</span>
// // // //           )}
// // // //         </div>
// // // //       );
// // // //     },
  
// // // //     action: (item: TableRowData) => (
// // // //       <div className="flex gap-2.5">
// // // //         <Link
// // // //           href={`${ROUTES.ADMIN.SIDEBAR.ADMINS}/${item.id}?tab=general`}
// // // //           className="bg-[#27A376] p-2.5 rounded-lg"
// // // //         >
// // // //           <ViewIcon />
// // // //         </Link>
// // // //         <button
// // // //           onClick={() =>
// // // //             item.originalAdmin && openDeleteDialog(item.originalAdmin)
// // // //           }
// // // //           className="bg-[#E03137] p-2.5 rounded-lg cursor-pointer"
// // // //           aria-label="Delete admin"
// // // //           disabled={item.originalAdmin?.email === email}
// // // //         >
// // // //           <DeleteIcon />
// // // //         </button>
// // // //       </div>
// // // //     ),
// // // //   }), [email]);

// // // //   const columnOrder: (keyof TableRowData)[] = [
// // // //     "name",
// // // //     "role",
// // // //     "description",
// // // //     "date",
// // // //     "status",
// // // //     "action",
// // // //   ];

// // // //   const columnLabels: Partial<Record<keyof TableRowData, string>> = {
// // // //     name: "Name & Email",
// // // //     role: "Role",
// // // //     description: "Description",
// // // //     date: "Created Date",
// // // //     status: "Status",
// // // //     action: "",
// // // //   };

// // // //   return (
// // // //     <Card className="bg-white">
// // // //       <CardContent className="p-6">
// // // //         <div className="flex items-center justify-between mb-4">
// // // //           <div>
// // // //             <h6 className="font-semibold text-lg text-[#111827] mb-1">
// // // //               Role-Based Admin Management
// // // //             </h6>
// // // //             <p className="text-[#687588] font-medium text-sm mb-6">
// // // //               Manage administrators with role-based permissions and access control.
// // // //             </p>
// // // //           </div>
// // // //           <div className="flex items-center gap-2 text-sm text-gray-600">
// // // //             <CheckCircle className="w-4 h-4 text-green-600" />
// // // //             <span>Role-based access enabled</span>
// // // //           </div>
// // // //         </div>

// // // //         <div className="flex items-center gap-4 mb-6">
// // // //           <InputFilter
// // // //             setQuery={setNameFilter}
// // // //             placeholder="Search by name or email"
// // // //           />
// // // //           <SelectFilter
// // // //             setFilter={setRoleFilter}
// // // //             placeholder="Filter by Role"
// // // //             list={roleList}
// // // //           />
// // // //           <SelectFilter
// // // //             setFilter={setStatusFilter}
// // // //             placeholder="Filter by Status"
// // // //             list={statusList}
// // // //           />
// // // //         </div>

// // // //         <TableComponent<TableRowData>
// // // //           tableData={tableData}
// // // //           currentPage={currentPage}
// // // //           onPageChange={onPageChange}
// // // //           totalPages={totalPages}
// // // //           cellRenderers={cellRenderers}
// // // //           columnOrder={columnOrder}
// // // //           columnLabels={columnLabels}
// // // //           isLoading={loading}
// // // //           onPageSizeChange={(value) => onLimitChange && onLimitChange(Number(value))}
// // // //           totalItems={totalItems}
// // // //         />
// // // //       </CardContent>

// // // //       <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
// // // //         <DialogContent className="sm:max-w-[425px]">
// // // //           <DialogHeader>
// // // //             <DialogTitle>Confirm Role-Based Admin Deletion</DialogTitle>
// // // //             <DialogDescription>
// // // //               Are you sure you want to delete{" "}
// // // //               <span className="font-medium">
// // // //                 {adminToDelete?.fullName ||
// // // //                   adminToDelete?.username ||
// // // //                   adminToDelete?.email ||
// // // //                   "this admin"}
// // // //               </span>
// // // //               ? This will remove all their role-based permissions and access. This action cannot be undone.
// // // //             </DialogDescription>
// // // //           </DialogHeader>
// // // //           <DialogFooter>
// // // //             <Button
// // // //               variant="outline"
// // // //               onClick={() => setDeleteDialogOpen(false)}
// // // //               disabled={deleteAdminIsLoading}
// // // //             >
// // // //               Cancel
// // // //             </Button>
// // // //             <Button
// // // //               variant="destructive"
// // // //               onClick={handleDeleteAdmin}
// // // //               disabled={deleteAdminIsLoading || adminToDelete?.email === email}
// // // //             >
// // // //               {deleteAdminIsLoading ? "Deleting..." : "Delete Admin"}
// // // //             </Button>
// // // //           </DialogFooter>
// // // //         </DialogContent>
// // // //       </Dialog>
// // // //     </Card>
// // // //   );
// // // // };

// // // // export default DataTable;

// // // // "use client";
// // // // import React, { useState, useEffect, useCallback, useMemo } from "react";
// // // // import { Badge } from "@/components/ui/badge";
// // // // import { Card, CardContent } from "@/components/ui/card";
// // // // import { CalendarIcon, DeleteIcon, ViewIcon, PersonIcon, RepIcon } from "../../../../../../public/icons";
// // // // import { TableComponent } from "@/components/custom-table";
// // // // import { SelectFilter } from "@/app/(admin)/components/select-filter";
// // // // import { InputFilter } from "@/app/(admin)/components/input-filter";
// // // // import Link from "next/link";
// // // // import { ROUTES } from "@/constant/routes";
// // // // import { toast } from "sonner";
// // // // import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
// // // // import { useDeleteAdmin } from "@/services/admin";
// // // // import { Button } from "@/components/ui/button";
// // // // import { Clock, CheckCircle } from "lucide-react";

// // // // // Local type definitions
// // // // interface Admin {
// // // //   id: number | string;
// // // //   email?: string;
// // // //   username?: string;
// // // //   fullName?: string;
// // // //   phone?: string;
// // // //   gender?: string;
// // // //   status?: string;
// // // //   adminStatus?: string;
// // // //   role?: string;
// // // //   createdAt?: string;
// // // //   lastLogin?: string;
// // // //   invitationStatus?: 'COMPLETED' | 'PENDING' | 'EXPIRED' | 'CANCELLED';
// // // // }

// // // // interface TableRowData {
// // // //   id: number | string;
// // // //   email: string;
// // // //   name: string;
// // // //   profile: {
// // // //     username: string;
// // // //     fullName: string;
// // // //     phone: string;
// // // //     gender: string;
// // // //   };
// // // //   role: string;
// // // //   description: string;
// // // //   date: string;
// // // //   status: string;
// // // //   createdAt: string;
// // // //   roles: {
// // // //     role: {
// // // //       id: number;
// // // //       name: string;
// // // //       discription: string;
// // // //     };
// // // //   };
// // // //   rolecount: string;
// // // //   action: string;
// // // //   formattedRole: string;
// // // //   formattedDate: string;
// // // //   originalAdmin?: Admin;
// // // //   isRoleBased: boolean;
// // // //   invitationStatus?: 'COMPLETED' | 'PENDING' | 'EXPIRED' | 'CANCELLED';
// // // //   roleCount: number;
// // // //   [key: string]: any;
// // // // }

// // // // interface DataTableProps {
// // // //   adminData: Admin[];
// // // //   loading: boolean;
// // // //   refetch: () => void;
// // // //   totalItems: number;
// // // //   currentPage: number;
// // // //   totalPages: number;
// // // //   onPageChange: (page: number) => void;
// // // //   onLimitChange: (limit: number) => void;
// // // //   onFilterChange: (filters: any) => void;
// // // //   pageSize: number;
// // // // }

// // // // const DataTable: React.FC<DataTableProps> = ({
// // // //   adminData,
// // // //   loading,
// // // //   refetch,
// // // //   totalItems,
// // // //   currentPage,
// // // //   totalPages,
// // // //   onPageChange,
// // // //   onLimitChange,
// // // //   onFilterChange,
// // // //   pageSize,
// // // // }) => {
// // // //   const [roleFilter, setRoleFilter] = useState<string>("");
// // // //   const [statusFilter, setStatusFilter] = useState<string>("");
// // // //   const [nameFilter, setNameFilter] = useState<string>("");
// // // //   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
// // // //   const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);
// // // //   const [email, setEmail] = useState("");

// // // //   useEffect(() => {
// // // //     if (typeof window !== "undefined") {
// // // //       const storedEmail = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");
// // // //       if (storedEmail) setEmail(storedEmail);
// // // //     }
// // // //   }, []);

// // // //   const { deleteAdminPayload: deleteAdmin, deleteAdminIsLoading } = useDeleteAdmin();

// // // //   const safeAdminData = Array.isArray(adminData) ? adminData : [];

// // // //   const handleFilterChange = useCallback((newFilters: any) => {
// // // //     if (onFilterChange) {
// // // //       onFilterChange(newFilters);
// // // //     }
// // // //   }, [onFilterChange]);

// // // //   useEffect(() => {
// // // //     const timer = setTimeout(() => {
// // // //       const filters: any = {};
      
// // // //       if (nameFilter) {
// // // //         filters.search = nameFilter;
// // // //       }
      
// // // //       if (roleFilter && roleFilter !== "select") {
// // // //         filters.role = roleFilter;
// // // //       }
      
// // // //       if (statusFilter && statusFilter !== "select") {
// // // //         filters.status = statusFilter;
// // // //       }
      
// // // //       handleFilterChange(filters);
// // // //     }, 500);

// // // //     return () => clearTimeout(timer);
// // // //   }, [nameFilter, roleFilter, statusFilter, handleFilterChange]);

// // // //   // Transform Admin data to match TableComponent requirements
// // // //   const tableData = useMemo(() => {
// // // //     return safeAdminData.map((admin: Admin) => {
// // // //       // Get the role name from the admin data
// // // //       const roleName = admin.role || "N/A";
      
// // // //       // Create a description based on the role
// // // //       const roleDescription = roleName === "N/A" 
// // // //         ? "No role assigned" 
// // // //         : `${roleName.replace(/_/g, " ")} role`;

// // // //       // FIX: Properly determine the account status
// // // //       // Prefer adminStatus over status, and handle invitation status
// // // //       let accountStatus = "inactive";
      
// // // //       if (admin.adminStatus) {
// // // //         accountStatus = admin.adminStatus.toLowerCase();
// // // //       } else if (admin.status) {
// // // //         accountStatus = admin.status.toLowerCase();
// // // //       } else if (admin.invitationStatus === 'PENDING') {
// // // //         accountStatus = "pending";
// // // //       } else if (admin.invitationStatus === 'COMPLETED') {
// // // //         accountStatus = "active";
// // // //       }

// // // //       const adminData: TableRowData = {
// // // //         id: admin.id,
// // // //         email: admin.email || "N/A",
// // // //         name: admin.fullName || admin.username || "N/A",
// // // //         profile: {
// // // //           username: admin.username || "N/A",
// // // //           fullName: admin.fullName || "N/A",
// // // //           phone: admin.phone || "N/A",
// // // //           gender: admin.gender || "N/A",
// // // //         },
// // // //         role: roleName,
// // // //         description: roleDescription,
// // // //         date: admin.createdAt || new Date().toISOString(),
// // // //         status: accountStatus, // Use the properly determined status
// // // //         createdAt: admin.createdAt || new Date().toISOString(),
// // // //         roles: {
// // // //           role: {
// // // //             id: 0,
// // // //             name: roleName,
// // // //             discription: roleDescription,
// // // //           }
// // // //         },
// // // //         rolecount: "1",
// // // //         action: "",
// // // //         formattedRole: roleName === "SUPER_ADMIN" 
// // // //           ? "Super Admin" 
// // // //           : roleName.replace(/_/g, " "),
// // // //         formattedDate: admin.createdAt
// // // //           ? new Date(admin.createdAt).toLocaleDateString("en-US", {
// // // //               day: "2-digit",
// // // //               month: "short",
// // // //               year: "numeric",
// // // //             })
// // // //           : "N/A",
// // // //         originalAdmin: admin,
// // // //         isRoleBased: true,
// // // //         invitationStatus: admin.invitationStatus,
// // // //         roleCount: 1,
// // // //       };

// // // //       return adminData;
// // // //     });
// // // //   }, [safeAdminData]);

// // // //   const handleDeleteAdmin = async () => {
// // // //     if (!adminToDelete?.id) {
// // // //       toast.error("No admin selected for deletion");
// // // //       return;
// // // //     }

// // // //     try {
// // // //       await deleteAdmin(adminToDelete.id);
// // // //       toast.success("Admin deleted successfully");
// // // //       setDeleteDialogOpen(false);
// // // //       setAdminToDelete(null);
// // // //       refetch();
// // // //     } catch (error: any) {
// // // //       console.error("Delete admin error:", error);
// // // //       const errorMessage = error?.response?.data?.error ||
// // // //         error?.message ||
// // // //         "Failed to delete admin";
// // // //       toast.error(errorMessage);
// // // //     }
// // // //   };

// // // //   const openDeleteDialog = (admin: Admin) => {
// // // //     setAdminToDelete(admin);
// // // //     setDeleteDialogOpen(true);
// // // //   };

// // // //   // Filter lists
// // // //   const statusList = [
// // // //     { text: "All Status", value: "select" },
// // // //     { text: "Active", value: "active" },
// // // //     { text: "Pending Invitation", value: "pending" },
// // // //     { text: "Inactive", value: "inactive" },
// // // //     { text: "Suspended", value: "suspended" },
// // // //   ];

// // // //   const roleList = [
// // // //     { text: "All Roles", value: "select" },
// // // //     { text: "Super Admin", value: "SUPER_ADMIN" },
// // // //     { text: "Customer Service", value: "CUSTOMER_SERVICE" },
// // // //     { text: "Order Manager", value: "ORDER_MANAGER" },
// // // //     { text: "Product Manager", value: "PRODUCT_MANAGER" },
// // // //     { text: "Inventory Manager", value: "INVENTORY_MANAGER" },
// // // //     { text: "Analyst", value: "ANALYST" },
// // // //     { text: "Compliance Officer", value: "COMPLIANCE_OFFICER" },
// // // //   ];

// // // //   const cellRenderers = useMemo(() => ({
// // // //     name: (item: TableRowData) => (
// // // //       <div className="flex flex-col gap-1 text-left">
// // // //         <div className="font-medium text-slate-800">
// // // //           {item.profile.fullName !== "N/A" ? item.profile.fullName :
// // // //             item.profile.username !== "N/A" ? item.profile.username :
// // // //               item.name !== "N/A" ? item.name : "Unknown"}
// // // //         </div>
// // // //         <div className="text-sm text-slate-500">
// // // //           {item.email !== "N/A" ? item.email : "No email"}
// // // //         </div>
// // // //       </div>
// // // //     ),
  
// // // //     role: (item: TableRowData) => (
// // // //       <div className="font-medium flex items-center gap-3 capitalize">
// // // //         {item.formattedRole.toLowerCase().includes("admin") ? (
// // // //           <PersonIcon />
// // // //         ) : (
// // // //           <RepIcon />
// // // //         )}
// // // //         <div className="flex flex-col">
// // // //           <span>{item.formattedRole}</span>
// // // //         </div>
// // // //       </div>
// // // //     ),
  
// // // //     description: (item: TableRowData) => (
// // // //       <div className="flex flex-col">
// // // //         <span className="font-medium">
// // // //           {item.description}
// // // //         </span>
// // // //       </div>
// // // //     ),
  
// // // //     date: (item: TableRowData) => (
// // // //       <div className="font-medium flex items-center gap-3">
// // // //         <CalendarIcon />
// // // //         <div className="flex flex-col">
// // // //           <span>{item.formattedDate}</span>
// // // //           {item.invitationStatus === "PENDING" && (
// // // //             <span className="text-xs text-amber-600 flex items-center gap-1">
// // // //               <Clock className="w-3 h-3" />
// // // //               Invitation pending
// // // //             </span>
// // // //           )}
// // // //         </div>
// // // //       </div>
// // // //     ),
  
// // // //     status: (item: TableRowData) => {
// // // //       // Use the properly determined status from the transformation
// // // //       const status = item.status?.toLowerCase();
// // // //       let variant: "success" | "tertiary" | "warning" | "destructive" = "warning";
// // // //       let statusText = "UNKNOWN";

// // // //       // Map status to display text
// // // //       if (status === "active") {
// // // //         variant = "success";
// // // //         statusText = "ACTIVE";
// // // //       } else if (status === "pending") {
// // // //         variant = "tertiary";
// // // //         statusText = "PENDING INVITE";
// // // //       } else if (status === "suspended") {
// // // //         variant = "destructive";
// // // //         statusText = "SUSPENDED";
// // // //       } else if (status === "inactive") {
// // // //         variant = "warning";
// // // //         statusText = "INACTIVE";
// // // //       }

// // // //       return (
// // // //         <div className="flex flex-col gap-1">
// // // //           <Badge variant={variant} className="py-1 px-[26px] font-medium">
// // // //             {statusText}
// // // //           </Badge>
// // // //           {item.invitationStatus === "PENDING" && (
// // // //             <span className="text-xs text-gray-500">Awaiting setup</span>
// // // //           )}
// // // //         </div>
// // // //       );
// // // //     },
  
// // // //     action: (item: TableRowData) => (
// // // //       <div className="flex gap-2.5">
// // // //         <Link
// // // //           href={`${ROUTES.ADMIN.SIDEBAR.ADMINS}/${item.id}?tab=general`}
// // // //           className="bg-[#27A376] p-2.5 rounded-lg"
// // // //         >
// // // //           <ViewIcon />
// // // //         </Link>
// // // //         <button
// // // //           onClick={() =>
// // // //             item.originalAdmin && openDeleteDialog(item.originalAdmin)
// // // //           }
// // // //           className="bg-[#E03137] p-2.5 rounded-lg cursor-pointer"
// // // //           aria-label="Delete admin"
// // // //           disabled={item.originalAdmin?.email === email}
// // // //         >
// // // //           <DeleteIcon />
// // // //         </button>
// // // //       </div>
// // // //     ),
// // // //   }), [email]);

// // // //   const columnOrder: (keyof TableRowData)[] = [
// // // //     "name",
// // // //     "role",
// // // //     "description",
// // // //     "date",
// // // //     "status",
// // // //     "action",
// // // //   ];

// // // //   const columnLabels: Partial<Record<keyof TableRowData, string>> = {
// // // //     name: "Name & Email",
// // // //     role: "Role",
// // // //     description: "Description",
// // // //     date: "Created Date",
// // // //     status: "Status",
// // // //     action: "",
// // // //   };

// // // //   return (
// // // //     <Card className="bg-white">
// // // //       <CardContent className="p-6">
// // // //         <div className="flex items-center justify-between mb-4">
// // // //           <div>
// // // //             <h6 className="font-semibold text-lg text-[#111827] mb-1">
// // // //               Role-Based Admin Management
// // // //             </h6>
// // // //             <p className="text-[#687588] font-medium text-sm mb-6">
// // // //               Manage administrators with role-based permissions and access control.
// // // //             </p>
// // // //           </div>
// // // //           <div className="flex items-center gap-2 text-sm text-gray-600">
// // // //             <CheckCircle className="w-4 h-4 text-green-600" />
// // // //             <span>Role-based access enabled</span>
// // // //           </div>
// // // //         </div>

// // // //         <div className="flex items-center gap-4 mb-6">
// // // //           <InputFilter
// // // //             setQuery={setNameFilter}
// // // //             placeholder="Search by name or email"
// // // //           />
// // // //           <SelectFilter
// // // //             setFilter={setRoleFilter}
// // // //             placeholder="Filter by Role"
// // // //             list={roleList}
// // // //           />
// // // //           <SelectFilter
// // // //             setFilter={setStatusFilter}
// // // //             placeholder="Filter by Status"
// // // //             list={statusList}
// // // //           />
// // // //         </div>

// // // //         <TableComponent<TableRowData>
// // // //           tableData={tableData}
// // // //           currentPage={currentPage}
// // // //           onPageChange={onPageChange}
// // // //           totalPages={totalPages}
// // // //           cellRenderers={cellRenderers}
// // // //           columnOrder={columnOrder}
// // // //           columnLabels={columnLabels}
// // // //           isLoading={loading}
// // // //           onPageSizeChange={(value) => onLimitChange && onLimitChange(Number(value))}
// // // //           totalItems={totalItems}
// // // //         />
// // // //       </CardContent>

// // // //       <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
// // // //         <DialogContent className="sm:max-w-[425px]">
// // // //           <DialogHeader>
// // // //             <DialogTitle>Confirm Role-Based Admin Deletion</DialogTitle>
// // // //             <DialogDescription>
// // // //               Are you sure you want to delete{" "}
// // // //               <span className="font-medium">
// // // //                 {adminToDelete?.fullName ||
// // // //                   adminToDelete?.username ||
// // // //                   adminToDelete?.email ||
// // // //                   "this admin"}
// // // //               </span>
// // // //               ? This will remove all their role-based permissions and access. This action cannot be undone.
// // // //             </DialogDescription>
// // // //           </DialogHeader>
// // // //           <DialogFooter>
// // // //             <Button
// // // //               variant="outline"
// // // //               onClick={() => setDeleteDialogOpen(false)}
// // // //               disabled={deleteAdminIsLoading}
// // // //             >
// // // //               Cancel
// // // //             </Button>
// // // //             <Button
// // // //               variant="destructive"
// // // //               onClick={handleDeleteAdmin}
// // // //               disabled={deleteAdminIsLoading || adminToDelete?.email === email}
// // // //             >
// // // //               {deleteAdminIsLoading ? "Deleting..." : "Delete Admin"}
// // // //             </Button>
// // // //           </DialogFooter>
// // // //         </DialogContent>
// // // //       </Dialog>
// // // //     </Card>
// // // //   );
// // // // };

// // // // export default DataTable;

// // "use client";
// // import React, { useState, useEffect, useCallback, useMemo } from "react";
// // import { Badge } from "@/components/ui/badge";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { CalendarIcon, DeleteIcon, ViewIcon, PersonIcon, RepIcon } from "../../../../../../public/icons";
// // import { TableComponent } from "@/components/custom-table";
// // import { SelectFilter } from "@/app/(admin)/components/select-filter";
// // import { InputFilter } from "@/app/(admin)/components/input-filter";
// // import Link from "next/link";
// // import { ROUTES } from "@/constant/routes";
// // import { toast } from "sonner";
// // import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
// // import { useDeleteAdmin } from "@/services/admin";
// // import { Button } from "@/components/ui/button";
// // import { Clock, CheckCircle } from "lucide-react";

// // // Local type definitions
// // interface Admin {
// //   id: number | string;
// //   email?: string;
// //   username?: string;
// //   fullName?: string;
// //   phone?: string;
// //   gender?: string;
// //   status?: string;
// //   adminStatus?: string;
// //   role?: string;
// //   createdAt?: string;
// //   lastLogin?: string;
// //   invitationStatus?: 'COMPLETED' | 'PENDING' | 'EXPIRED' | 'CANCELLED';
// // }

// // interface TableRowData {
// //   id: number | string;
// //   email: string;
// //   name: string;
// //   profile: {
// //     username: string;
// //     fullName: string;
// //     phone: string;
// //     gender: string;
// //   };
// //   role: string;
// //   description: string;
// //   date: string;
// //   status: string;
// //   createdAt: string;
// //   roles: {
// //     role: {
// //       id: number;
// //       name: string;
// //       discription: string;
// //     };
// //   };
// //   rolecount: string;
// //   action: string;
// //   formattedRole: string;
// //   formattedDate: string;
// //   originalAdmin?: Admin;
// //   isRoleBased: boolean;
// //   invitationStatus?: 'COMPLETED' | 'PENDING' | 'EXPIRED' | 'CANCELLED';
// //   roleCount: number;
// //   [key: string]: any;
// // }

// // interface DataTableProps {
// //   adminData: Admin[];
// //   loading: boolean;
// //   refetch: () => void;
// //   totalItems: number;
// //   currentPage: number;
// //   totalPages: number;
// //   onPageChange: (page: number) => void;
// //   onLimitChange: (limit: number) => void;
// //   onFilterChange: (filters: any) => void;
// //   pageSize: number;
// // }

// // const DataTable: React.FC<DataTableProps> = ({
// //   adminData,
// //   loading,
// //   refetch,
// //   totalItems,
// //   currentPage,
// //   totalPages,
// //   onPageChange,
// //   onLimitChange,
// //   onFilterChange,
// //   pageSize,
// // }) => {
// //   const [roleFilter, setRoleFilter] = useState<string>("");
// //   const [statusFilter, setStatusFilter] = useState<string>("");
// //   const [nameFilter, setNameFilter] = useState<string>("");
// //   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
// //   const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);
// //   const [email, setEmail] = useState("");

// //   useEffect(() => {
// //     if (typeof window !== "undefined") {
// //       const storedEmail = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");
// //       if (storedEmail) setEmail(storedEmail);
// //     }
// //   }, []);

// //   const { deleteAdminPayload: deleteAdmin, deleteAdminIsLoading } = useDeleteAdmin();

// //   const safeAdminData = Array.isArray(adminData) ? adminData : [];

// //   const handleFilterChange = useCallback((newFilters: any) => {
// //     if (onFilterChange) {
// //       onFilterChange(newFilters);
// //     }
// //   }, [onFilterChange]);

// //   useEffect(() => {
// //     const timer = setTimeout(() => {
// //       const filters: any = {};
      
// //       if (nameFilter) {
// //         filters.search = nameFilter;
// //       }
      
// //       if (roleFilter && roleFilter !== "select") {
// //         filters.role = roleFilter;
// //       }
      
// //       if (statusFilter && statusFilter !== "select") {
// //         filters.status = statusFilter;
// //       }
      
// //       handleFilterChange(filters);
// //     }, 500);

// //     return () => clearTimeout(timer);
// //   }, [nameFilter, roleFilter, statusFilter, handleFilterChange]);

// //   // Get unique roles from the admin data for the filter
// //   const uniqueRoles = useMemo(() => {
// //     const roles = new Set<string>();
// //     safeAdminData.forEach(admin => {
// //       if (admin.role) {
// //         roles.add(admin.role);
// //       }
// //     });
// //     return Array.from(roles);
// //   }, [safeAdminData]);

// //   // Transform Admin data to match TableComponent requirements
// //   const tableData = useMemo(() => {
// //     return safeAdminData.map((admin: Admin) => {
// //       // Get the role name from the admin data
// //       const roleName = admin.role || "N/A";
      
// //       // Create a description based on the role
// //       const roleDescription = roleName === "N/A" 
// //         ? "No role assigned" 
// //         : `${roleName.replace(/_/g, " ")} role`;

// //       // Determine the account status
// //       let accountStatus = "inactive";
      
// //       if (admin.adminStatus) {
// //         accountStatus = admin.adminStatus.toLowerCase();
// //       } else if (admin.status) {
// //         accountStatus = admin.status.toLowerCase();
// //       } else if (admin.invitationStatus === 'PENDING') {
// //         accountStatus = "pending";
// //       } else if (admin.invitationStatus === 'COMPLETED') {
// //         accountStatus = "active";
// //       }

// //       const adminData: TableRowData = {
// //         id: admin.id,
// //         email: admin.email || "N/A",
// //         name: admin.fullName || admin.username || "N/A",
// //         profile: {
// //           username: admin.username || "N/A",
// //           fullName: admin.fullName || "N/A",
// //           phone: admin.phone || "N/A",
// //           gender: admin.gender || "N/A",
// //         },
// //         role: roleName,
// //         description: roleDescription,
// //         date: admin.createdAt || new Date().toISOString(),
// //         status: accountStatus,
// //         createdAt: admin.createdAt || new Date().toISOString(),
// //         roles: {
// //           role: {
// //             id: 0,
// //             name: roleName,
// //             discription: roleDescription,
// //           }
// //         },
// //         rolecount: "1",
// //         action: "",
// //         formattedRole: roleName === "SUPER_ADMIN" 
// //           ? "Super Admin" 
// //           : roleName.replace(/_/g, " "),
// //         formattedDate: admin.createdAt
// //           ? new Date(admin.createdAt).toLocaleDateString("en-US", {
// //               day: "2-digit",
// //               month: "short",
// //               year: "numeric",
// //             })
// //           : "N/A",
// //         originalAdmin: admin,
// //         isRoleBased: true,
// //         invitationStatus: admin.invitationStatus,
// //         roleCount: 1,
// //       };

// //       return adminData;
// //     });
// //   }, [safeAdminData]);

// //   const handleDeleteAdmin = async () => {
// //     if (!adminToDelete?.id) {
// //       toast.error("No admin selected for deletion");
// //       return;
// //     }

// //     try {
// //       await deleteAdmin(adminToDelete.id);
// //       toast.success("Admin deleted successfully");
// //       setDeleteDialogOpen(false);
// //       setAdminToDelete(null);
// //       refetch();
// //     } catch (error: any) {
// //       console.error("Delete admin error:", error);
// //       const errorMessage = error?.response?.data?.error ||
// //         error?.message ||
// //         "Failed to delete admin";
// //       toast.error(errorMessage);
// //     }
// //   };

// //   const openDeleteDialog = (admin: Admin) => {
// //     setAdminToDelete(admin);
// //     setDeleteDialogOpen(true);
// //   };

// //   // Filter lists
// //   const statusList = [
// //     { text: "All Status", value: "select" },
// //     { text: "Active", value: "active" },
// //     { text: "Pending Invitation", value: "pending" },
// //     { text: "Inactive", value: "inactive" },
// //     { text: "Suspended", value: "suspended" },
// //   ];

// //   // Generate role list from unique roles in the data
// //   const roleList = useMemo(() => {
// //     const roles = [
// //       { text: "All Roles", value: "select" },
// //       ...uniqueRoles.map(role => ({
// //         text: role === "SUPER_ADMIN" 
// //           ? "Super Admin" 
// //           : role.replace(/_/g, " "),
// //         value: role
// //       }))
// //     ];
    
// //     // Sort alphabetically by text, keeping "All Roles" first
// //     return [
// //       roles[0],
// //       ...roles.slice(1).sort((a, b) => a.text.localeCompare(b.text))
// //     ];
// //   }, [uniqueRoles]);

// //   const cellRenderers = useMemo(() => ({
// //     name: (item: TableRowData) => (
// //       <div className="flex flex-col gap-1 text-left">
// //         <div className="font-medium text-slate-800">
// //           {item.profile.fullName !== "N/A" ? item.profile.fullName :
// //             item.profile.username !== "N/A" ? item.profile.username :
// //               item.name !== "N/A" ? item.name : "Unknown"}
// //         </div>
// //         <div className="text-sm text-slate-500">
// //           {item.email !== "N/A" ? item.email : "No email"}
// //         </div>
// //       </div>
// //     ),
  
// //     role: (item: TableRowData) => (
// //       <div className="font-medium flex items-center gap-3 capitalize">
// //         {item.formattedRole.toLowerCase().includes("admin") ? (
// //           <PersonIcon />
// //         ) : (
// //           <RepIcon />
// //         )}
// //         <div className="flex flex-col">
// //           <span>{item.formattedRole}</span>
// //         </div>
// //       </div>
// //     ),
  
// //     description: (item: TableRowData) => (
// //       <div className="flex flex-col">
// //         <span className="font-medium">
// //           {item.description}
// //         </span>
// //       </div>
// //     ),
  
// //     date: (item: TableRowData) => (
// //       <div className="font-medium flex items-center gap-3">
// //         <CalendarIcon />
// //         <div className="flex flex-col">
// //           <span>{item.formattedDate}</span>
// //           {item.invitationStatus === "PENDING" && (
// //             <span className="text-xs text-amber-600 flex items-center gap-1">
// //               <Clock className="w-3 h-3" />
// //               Invitation pending
// //             </span>
// //           )}
// //         </div>
// //       </div>
// //     ),
  
// //     status: (item: TableRowData) => {
// //       const status = item.status?.toLowerCase();
// //       let variant: "success" | "tertiary" | "warning" | "destructive" = "warning";
// //       let statusText = "UNKNOWN";

// //       if (status === "active") {
// //         variant = "success";
// //         statusText = "ACTIVE";
// //       } else if (status === "pending") {
// //         variant = "tertiary";
// //         statusText = "PENDING INVITE";
// //       } else if (status === "suspended") {
// //         variant = "destructive";
// //         statusText = "SUSPENDED";
// //       } else if (status === "inactive") {
// //         variant = "warning";
// //         statusText = "INACTIVE";
// //       }

// //       return (
// //         <div className="flex flex-col gap-1">
// //           <Badge variant={variant} className="py-1 px-[26px] font-medium">
// //             {statusText}
// //           </Badge>
// //           {item.invitationStatus === "PENDING" && (
// //             <span className="text-xs text-gray-500">Awaiting setup</span>
// //           )}
// //         </div>
// //       );
// //     },
  
// //     action: (item: TableRowData) => (
// //       <div className="flex gap-2.5">
// //         <Link
// //           href={`${ROUTES.ADMIN.SIDEBAR.ADMINS}/${item.id}?tab=general`}
// //           className="bg-[#27A376] p-2.5 rounded-lg"
// //         >
// //           <ViewIcon />
// //         </Link>
// //         <button
// //           onClick={() =>
// //             item.originalAdmin && openDeleteDialog(item.originalAdmin)
// //           }
// //           className="bg-[#E03137] p-2.5 rounded-lg cursor-pointer"
// //           aria-label="Delete admin"
// //           disabled={item.originalAdmin?.email === email}
// //         >
// //           <DeleteIcon />
// //         </button>
// //       </div>
// //     ),
// //   }), [email]);

// //   const columnOrder: (keyof TableRowData)[] = [
// //     "name",
// //     "role",
// //     "description",
// //     "date",
// //     "status",
// //     "action",
// //   ];

// //   const columnLabels: Partial<Record<keyof TableRowData, string>> = {
// //     name: "Name & Email",
// //     role: "Role",
// //     description: "Description",
// //     date: "Created Date",
// //     status: "Status",
// //     action: "",
// //   };

// //   return (
// //     <Card className="bg-white">
// //       <CardContent className="p-6">
// //         <div className="flex items-center justify-between mb-4">
// //           <div>
// //             <h6 className="font-semibold text-lg text-[#111827] mb-1">
// //               Role-Based Admin Management
// //             </h6>
// //             <p className="text-[#687588] font-medium text-sm mb-6">
// //               Manage administrators with role-based permissions and access control.
// //             </p>
// //           </div>
// //           <div className="flex items-center gap-2 text-sm text-gray-600">
// //             <CheckCircle className="w-4 h-4 text-green-600" />
// //             <span>Role-based access enabled</span>
// //           </div>
// //         </div>

// //         <div className="flex items-center gap-4 mb-6">
// //           <InputFilter
// //             setQuery={setNameFilter}
// //             placeholder="Search by name or email"
// //           />
// //           <SelectFilter
// //             setFilter={setRoleFilter}
// //             placeholder="Filter by Role"
// //             list={roleList}
// //           />
// //           <SelectFilter
// //             setFilter={setStatusFilter}
// //             placeholder="Filter by Status"
// //             list={statusList}
// //           />
// //         </div>

// //         <TableComponent<TableRowData>
// //           tableData={tableData}
// //           currentPage={currentPage}
// //           onPageChange={onPageChange}
// //           totalPages={totalPages}
// //           cellRenderers={cellRenderers}
// //           columnOrder={columnOrder}
// //           columnLabels={columnLabels}
// //           isLoading={loading}
// //           onPageSizeChange={(value) => onLimitChange && onLimitChange(Number(value))}
// //           totalItems={totalItems}
// //         />
// //       </CardContent>

// //       <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
// //         <DialogContent className="sm:max-w-[425px]">
// //           <DialogHeader>
// //             <DialogTitle>Confirm Role-Based Admin Deletion</DialogTitle>
// //             <DialogDescription>
// //               Are you sure you want to delete{" "}
// //               <span className="font-medium">
// //                 {adminToDelete?.fullName ||
// //                   adminToDelete?.username ||
// //                   adminToDelete?.email ||
// //                   "this admin"}
// //               </span>
// //               ? This will remove all their role-based permissions and access. This action cannot be undone.
// //             </DialogDescription>
// //           </DialogHeader>
// //           <DialogFooter>
// //             <Button
// //               variant="outline"
// //               onClick={() => setDeleteDialogOpen(false)}
// //               disabled={deleteAdminIsLoading}
// //             >
// //               Cancel
// //             </Button>
// //             <Button
// //               variant="destructive"
// //               onClick={handleDeleteAdmin}
// //               disabled={deleteAdminIsLoading || adminToDelete?.email === email}
// //             >
// //               {deleteAdminIsLoading ? "Deleting..." : "Delete Admin"}
// //             </Button>
// //           </DialogFooter>
// //         </DialogContent>
// //       </Dialog>
// //     </Card>
// //   );
// // };

// // export default DataTable;
// // "use client";
// // import React, { useState, useEffect } from "react";
// // import { Badge } from "@/components/ui/badge";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { CalendarIcon, DeleteIcon, ViewIcon, PersonIcon, RepIcon } from "../../../../../../public/icons";
// // import { TableComponent } from "@/components/custom-table";
// // import { SelectFilter } from "@/app/(admin)/components/select-filter";
// // import { InputFilter } from "@/app/(admin)/components/input-filter";
// // import Link from "next/link";
// // import { ROUTES } from "@/constant/routes";
// // import { toast } from "sonner";
// // import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
// // import { useDeleteAdmin } from "@/services/admin";
// // import { Button } from "@/components/ui/button";
// // import { Clock, CheckCircle } from "lucide-react";

// // // Local type definitions to avoid import conflicts
// // interface AdminRole {
// //   id?: number;
// //   roleId?: number;
// //   name?: string;
// //   description?: string;
// //   role?: {
// //     id: number;
// //     name?: string;
// //     description?: string;
// //     permissions?: any[];
// //   };
// // }

// // interface AdminProfile {
// //   username?: string;
// //   fullName?: string;
// //   phone?: string;
// //   gender?: string;
// // }

// // interface Admin {
// //   id: number | string;
// //   email?: string;
// //   username?: string;
// //   fullName?: string;
// //   phone?: string;
// //   gender?: string;
// //   status?: string;
// //   adminStatus?: string;
// //   roles?: AdminRole[];
// //   permissionCount?: number;
// //   adminProfile?: AdminProfile;
// //   createdAt?: string;
// //   lastLogin?: string;
// //   invitationStatus?: 'COMPLETED' | 'PENDING' | 'EXPIRED' | 'CANCELLED';
// // }

// // // ✅ FIX: Match the exact structure expected by TableComponent (with typo)
// // interface TableRowData {
// //   id: number | string;
// //   email: string;
// //   name: string;
// //   profile: {
// //     username: string;
// //     fullName: string;
// //     phone: string;
// //     gender: string;
// //   };
// //   role: string;
// //   description: string;
// //   date: string;
// //   status: string;
// //   createdAt: string;
// //   roles: {
// //     role: {
// //       id: number;
// //       name: string;
// //       discription: string;
// //     };
// //   };
// //   rolecount: string;
// //   action: string;
// //   formattedRole: string;
// //   formattedDate: string;
// //   originalAdmin?: Admin;
// //   isRoleBased: boolean;
// //   invitationStatus?: 'COMPLETED' | 'PENDING' | 'EXPIRED' | 'CANCELLED';
// //   roleCount: number;

// //   // Add index signature
// //   [key: string]: any;
// // }

// // interface DataTableProps {
// //   adminData: Admin[];
// //   loading: boolean;
// //   refetch: () => void;
// // }

// // const DataTable: React.FC<DataTableProps> = ({
// //   adminData,
// //   loading,
// //   refetch,
// // }) => {
// //   const pageSize = 10;
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [roleFilter, setRoleFilter] = useState<string>("");
// //   const [statusFilter, setStatusFilter] = useState<string>("");
// //   const [nameFilter, setNameFilter] = useState<string>("");
// //   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
// //   const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);
// //   const [email, setEmail] = useState("");

// //   useEffect(() => {
// //     if (typeof window !== "undefined") {
// //       const storedEmail = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");
// //       if (storedEmail) setEmail(storedEmail);
// //     }
// //   }, []);

// //   const { deleteAdminPayload: deleteAdmin, deleteAdminIsLoading } = useDeleteAdmin();

// //   // Ensure adminData is an array and filter it properly
// //   const safeAdminData = Array.isArray(adminData) ? adminData : [];

// //   console.log("Admin data structure for role-based filtering:", safeAdminData[0]);

// //   const filteredData: Admin[] = safeAdminData.filter((admin) => {
// //     if (!admin || typeof admin !== 'object') return false;

// //     const username = admin.username || admin.adminProfile?.username || admin.fullName || "";
// //     const adminEmail = admin.email || "";

// //     const nameMatch = nameFilter
// //       ? username.toLowerCase().includes(nameFilter.toLowerCase()) ||
// //       adminEmail.toLowerCase().includes(nameFilter.toLowerCase())
// //       : true;

// //     // Enhanced role matching for role-based system
// //     const roleNames = admin.roles?.map(ur => ur.role?.name || ur.name).filter(Boolean) || [];

// //     const roleMatch = roleFilter && roleFilter !== "select"
// //       ? roleNames.some(roleName => roleName && roleName.toLowerCase() === roleFilter.toLowerCase())
// //       : true;

// //     const status = admin.adminStatus || admin.status || "";
// //     const statusMatch = statusFilter && statusFilter !== "select"
// //       ? status.toLowerCase() === statusFilter.toLowerCase()
// //       : true;

// //     return nameMatch && roleMatch && statusMatch;
// //   });

// //   // ✅ FIX: Transform Admin data to match TableComponent requirements (including typo)
// //   const tableData: TableRowData[] = filteredData.map((admin: Admin) => {
// //     // Enhanced role processing for role-based system
// //     const roleNames = admin.roles?.map(ur => ur.role?.name || ur.name).filter(Boolean) || [];
// //     const primaryRole = roleNames[0] || "No Role";
// //     const roleDescriptions = admin.roles?.map(ur => ur.role?.description || ur.description).filter(Boolean) || [];
// //     const primaryDescription = roleDescriptions[0] || "No description available";

// //     // Determine invitation/account status
// //     const accountStatus = admin.adminStatus || admin.status || "ACTIVE";

// //     // ✅ FIX: Use 'discription' (with typo) to match TableComponent expectation
// //     const transformedRoles = {
// //       role: {
// //         id: admin.roles?.[0]?.role?.id || admin.roles?.[0]?.id || 0,
// //         name: primaryRole,
// //         discription: primaryDescription, // ✅ FIX: Use typo 'discription' not 'description'
// //       }
// //     };

// //     const adminData: TableRowData = {
// //       id: admin.id,
// //       email: admin.email || "N/A",
// //       name: admin.fullName || admin.username || admin.adminProfile?.username || "N/A",
// //       profile: {
// //         username: admin.username || admin.adminProfile?.username || "N/A",
// //         fullName: admin.fullName || admin.adminProfile?.fullName || "N/A",
// //         phone: admin.phone || admin.adminProfile?.phone || "N/A",
// //         gender: admin.gender || admin.adminProfile?.gender || "N/A",
// //       },
// //       role: primaryRole,
// //       description: primaryDescription,
// //       date: admin.createdAt || new Date().toISOString(),
// //       status: accountStatus,
// //       createdAt: admin.createdAt || new Date().toISOString(),
// //       roles: transformedRoles, // ✅ Now uses 'discription' field
// //       rolecount: String(roleNames.length),
// //       action: "",

// //       // Enhanced fields for role-based system
// //       formattedRole: roleNames.length > 1
// //         ? `${primaryRole} (+${roleNames.length - 1} more)`
// //         : primaryRole === "super_admin"
// //           ? "Super Admin"
// //           : primaryRole.replace(/_/g, " "),
// //       formattedDate: admin.createdAt
// //         ? new Date(admin.createdAt).toLocaleDateString("en-US", {
// //           day: "2-digit",
// //           month: "short",
// //           year: "numeric",
// //         })
// //         : "N/A",
// //       originalAdmin: admin,
// //       isRoleBased: true,
// //       invitationStatus: admin.invitationStatus,
// //       roleCount: roleNames.length,
// //     };

// //     return adminData;
// //   });

// //   const handleDeleteAdmin = async () => {
// //     if (!adminToDelete?.id) {
// //       toast.error("No admin selected for deletion");
// //       return;
// //     }

// //     try {
// //       await deleteAdmin(adminToDelete.id);
// //       toast.success("Admin deleted successfully");
// //       setDeleteDialogOpen(false);
// //       setAdminToDelete(null);
// //       refetch();
// //     } catch (error: any) {
// //       console.error("Delete admin error:", error);
// //       const errorMessage = error?.response?.data?.error ||
// //         error?.message ||
// //         "Failed to delete admin";
// //       toast.error(errorMessage);
// //     }
// //   };

// //   const openDeleteDialog = (admin: Admin) => {
// //     setAdminToDelete(admin);
// //     setDeleteDialogOpen(true);
// //   };

// //   // Enhanced filter lists for role-based system
// //   const statusList = [
// //     { text: "All Status", value: "select" },
// //     { text: "Active", value: "active" },
// //     { text: "Pending Invitation", value: "pending" },
// //     { text: "Inactive", value: "inactive" },
// //     { text: "Suspended", value: "suspended" },
// //   ];

// //   const roleList = [
// //     { text: "All Roles", value: "select" },
// //     { text: "Super Admin", value: "super_admin" },
// //     { text: "Admin", value: "admin" },
// //     { text: "Product Manager", value: "product_manager" },
// //     { text: "Inventory Manager", value: "inventory_manager" },
// //     { text: "Order Manager", value: "order_manager" },
// //     { text: "Customer Support", value: "customer_support" },
// //   ];

// //   const cellRenderers = {
// //     name: (item: TableRowData) => (
// //       <div className="flex flex-col gap-1 text-left">
// //         <div className="font-medium text-slate-800">
// //           {item.profile.fullName !== "N/A" ? item.profile.fullName :
// //             item.profile.username !== "N/A" ? item.profile.username :
// //               item.name !== "N/A" ? item.name : "Unknown"}
// //         </div>
// //         <div className="text-sm text-slate-500">{item.email !== "N/A" ? item.email : "No email"}</div>
// //         {item.roleCount > 1 && (
// //           <div className="text-xs text-blue-600">
// //             Multiple roles ({item.roleCount})
// //           </div>
// //         )}
// //       </div>
// //     ),
// //     role: (item: TableRowData) => (
// //       <div className="font-medium flex items-center gap-3 capitalize">
// //         {item.formattedRole.toLowerCase().includes("admin") ? (
// //           <PersonIcon />
// //         ) : (
// //           <RepIcon />
// //         )}
// //         <div className="flex flex-col">
// //           <span>{item.formattedRole}</span>
// //           {item.roleCount > 1 && (
// //             <span className="text-xs text-gray-500">
// //               {item.roleCount} roles assigned
// //             </span>
// //           )}
// //         </div>
// //       </div>
// //     ),
// //     description: (item: TableRowData) => (
// //       <div className="flex flex-col">
// //         <span className="font-medium">
// //           {item.description !== "No description available" ? item.description : "N/A"}
// //         </span>
// //         {item.originalAdmin?.permissionCount && (
// //           <span className="text-xs text-blue-600">
// //             {item.originalAdmin.permissionCount} permissions
// //           </span>
// //         )}
// //       </div>
// //     ),
// //     date: (item: TableRowData) => (
// //       <div className="font-medium flex items-center gap-3">
// //         <CalendarIcon />
// //         <div className="flex flex-col">
// //           <span>{item.formattedDate}</span>
// //           {item.invitationStatus === 'PENDING' && (
// //             <span className="text-xs text-amber-600 flex items-center gap-1">
// //               <Clock className="w-3 h-3" />
// //               Invitation pending
// //             </span>
// //           )}
// //         </div>
// //       </div>
// //     ),
// //     status: (item: TableRowData) => {
// //       const status = item.status?.toLowerCase();
// //       let variant: "success" | "tertiary" | "warning" | "destructive" = "warning";
// //       let statusText = item.status?.toUpperCase() || "UNKNOWN";

// //       // Enhanced status handling for role-based invitations
// //       if (status === "active") {
// //         variant = "success";
// //       } else if (status === "pending" || item.invitationStatus === 'PENDING') {
// //         variant = "tertiary";
// //         statusText = "PENDING INVITE";
// //       } else if (status === "suspended") {
// //         variant = "destructive";
// //       } else if (status === "inactive") {
// //         variant = "warning";
// //       }

// //       return (
// //         <div className="flex flex-col gap-1">
// //           <Badge
// //             variant={variant}
// //             className="py-1 px-[26px] font-medium"
// //           >
// //             {statusText}
// //           </Badge>
// //           {item.invitationStatus === 'PENDING' && (
// //             <span className="text-xs text-gray-500">
// //               Awaiting setup
// //             </span>
// //           )}
// //         </div>
// //       );
// //     },
// //     action: (item: TableRowData) => (
// //       <div className="flex gap-2.5">
// //         <Link
// //           href={`${ROUTES.ADMIN.SIDEBAR.ADMINS}/${item.id}?tab=general`}
// //           className="bg-[#27A376] p-2.5 rounded-lg"
// //         >
// //           <ViewIcon />
// //         </Link>
// //         <button
// //           onClick={() => item.originalAdmin && openDeleteDialog(item.originalAdmin)}
// //           className="bg-[#E03137] p-2.5 rounded-lg cursor-pointer"
// //           aria-label="Delete admin"
// //           disabled={item.originalAdmin?.email === email}
// //         >
// //           <DeleteIcon />
// //         </button>
// //       </div>
// //     ),
// //   };

// //   const columnOrder: (keyof TableRowData)[] = [
// //     "name",
// //     "role",
// //     "description",
// //     "date",
// //     "status",
// //     "action",
// //   ];

// //   const columnLabels: Partial<Record<keyof TableRowData, string>> = {
// //     name: "Name & Email",
// //     role: "Role(s)",
// //     description: "Description & Permissions",
// //     date: "Created Date",
// //     status: "Status",
// //     action: "",
// //   };

// //   return (
// //     <Card className="bg-white">
// //       <CardContent className="p-6">
// //         <div className="flex items-center justify-between mb-4">
// //           <div>
// //             <h6 className="font-semibold text-lg text-[#111827] mb-1">
// //               Role-Based Admin Management
// //             </h6>
// //             <p className="text-[#687588] font-medium text-sm mb-6">
// //               Manage administrators with role-based permissions and access control.
// //             </p>
// //           </div>
// //           <div className="flex items-center gap-2 text-sm text-gray-600">
// //             <CheckCircle className="w-4 h-4 text-green-600" />
// //             <span>Role-based access enabled</span>
// //           </div>
// //         </div>

// //         <div className="flex items-center gap-4 mb-6">
// //           <InputFilter
// //             setQuery={setNameFilter}
// //             placeholder="Search by name or email"
// //           />
// //           <SelectFilter
// //             setFilter={setRoleFilter}
// //             placeholder="Filter by Role"
// //             list={roleList}
// //           />
// //           <SelectFilter
// //             setFilter={setStatusFilter}
// //             placeholder="Filter by Status"
// //             list={statusList}
// //           />
// //         </div>

// //         <TableComponent<TableRowData>
// //           tableData={tableData}
// //           currentPage={currentPage}
// //           onPageChange={setCurrentPage}
// //           totalPages={Math.ceil(tableData.length / pageSize)}
// //           cellRenderers={cellRenderers}
// //           columnOrder={columnOrder}
// //           columnLabels={columnLabels}
// //           isLoading={loading}
// //         />
// //       </CardContent>

// //       <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
// //         <DialogContent className="sm:max-w-[425px]">
// //           <DialogHeader>
// //             <DialogTitle>Confirm Role-Based Admin Deletion</DialogTitle>
// //             <DialogDescription>
// //               Are you sure you want to delete{" "}
// //               <span className="font-medium">
// //                 {adminToDelete?.fullName ||
// //                   adminToDelete?.username ||
// //                   adminToDelete?.adminProfile?.username ||
// //                   adminToDelete?.email ||
// //                   "this admin"}
// //               </span>
// //               ? This will remove all their role-based permissions and access. This action cannot be undone.
// //             </DialogDescription>
// //           </DialogHeader>
// //           <DialogFooter>
// //             <Button
// //               variant="outline"
// //               onClick={() => setDeleteDialogOpen(false)}
// //               disabled={deleteAdminIsLoading}
// //             >
// //               Cancel
// //             </Button>
// //             <Button
// //               variant="destructive"
// //               onClick={handleDeleteAdmin}
// //               disabled={deleteAdminIsLoading || adminToDelete?.email === email}
// //             >
// //               {deleteAdminIsLoading ? "Deleting..." : "Delete Admin"}
// //             </Button>
// //           </DialogFooter>
// //         </DialogContent>
// //       </Dialog>
// //     </Card>
// //   );
// // };

// // export default DataTable;


// // "use client";
// // import React, { useState, useEffect, useMemo } from "react";
// // import { Badge } from "@/components/ui/badge";
// // import { Card, CardContent } from "@/components/ui/card";
// // import {
// //   CalendarIcon,
// //   DeleteIcon,
// //   ViewIcon,
// //   PersonIcon,
// //   RepIcon,
// // } from "../../../../../../public/icons";
// // import { TableComponent } from "@/components/custom-table";
// // import { SelectFilter } from "@/app/(admin)/components/select-filter";
// // import { InputFilter } from "@/app/(admin)/components/input-filter";
// // import Link from "next/link";
// // import { ROUTES } from "@/constant/routes";
// // import { toast } from "sonner";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogHeader,
// //   DialogTitle,
// //   DialogDescription,
// //   DialogFooter,
// // } from "@/components/ui/dialog";
// // import { useDeleteAdmin } from "@/services/admin";
// // import { Button } from "@/components/ui/button";
// // import { Clock, CheckCircle } from "lucide-react";

// // // Types
// // interface Admin {
// //   id: number | string;
// //   email?: string;
// //   username?: string;
// //   fullName?: string;
// //   phone?: string;
// //   gender?: string;
// //   status?: string;
// //   adminStatus?: string;
// //   role?: string;
// //   createdAt?: string;
// //   invitationStatus?: "COMPLETED" | "PENDING" | "EXPIRED" | "CANCELLED";
// // }

// // interface TableRowData {
// //   id: number | string;
// //   email: string;
// //   name: string;
// //   profile: {
// //     username: string;
// //     fullName: string;
// //     phone: string;
// //     gender: string;
// //   };
// //   role: string;
// //   description: string;
// //   date: string;
// //   status: string;
// //   createdAt: string;
// //   formattedRole: string;
// //   formattedDate: string;
// //   originalAdmin?: Admin;
// //   invitationStatus?: "COMPLETED" | "PENDING" | "EXPIRED" | "CANCELLED";
// //   [key: string]: any;
// // }

// // interface DataTableProps {
// //   adminData: Admin[];
// //   loading: boolean;
// //   refetch: () => void;
// //   totalItems: number;
// //   currentPage: number;
// //   totalPages: number;
// //   onPageChange: (page: number) => void;
// //   onLimitChange: (limit: number) => void;
// //   onFilterChange: (filters: Record<string, any>) => void;
// //   pageSize: number;
// // }

// // const DataTable: React.FC<DataTableProps> = ({
// //   adminData,
// //   loading,
// //   refetch,
// //   totalItems,
// //   currentPage,
// //   totalPages,
// //   onPageChange,
// //   onLimitChange,
// //   onFilterChange,
// //   pageSize,
// // }) => {
// //   const [roleFilter, setRoleFilter] = useState("select");
// //   const [statusFilter, setStatusFilter] = useState("select");
// //   const [nameFilter, setNameFilter] = useState("");
// //   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
// //   const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);
// //   const [email, setEmail] = useState("");

// //   useEffect(() => {
// //     if (typeof window !== "undefined") {
// //       const storedEmail =
// //         localStorage.getItem("userEmail") ||
// //         sessionStorage.getItem("userEmail");
// //       if (storedEmail) setEmail(storedEmail);
// //     }
// //   }, []);

// //   const { deleteAdminPayload: deleteAdmin, deleteAdminIsLoading } =
// //     useDeleteAdmin();

// //   const safeAdminData = Array.isArray(adminData) ? adminData : [];

// //   // 🔄 Send filters to parent (hook) whenever they change
// //   useEffect(() => {
// //     const timer = setTimeout(() => {
// //       const filters: Record<string, any> = {};
// //       if (nameFilter) filters.search = nameFilter;
// //       if (roleFilter !== "select") filters.role = roleFilter;
// //       if (statusFilter !== "select") filters.status = statusFilter;
// //       onFilterChange(filters);
// //     }, 400);
// //     return () => clearTimeout(timer);
// //   }, [nameFilter, roleFilter, statusFilter, onFilterChange]);

// //   // Build dropdown role list
// //   const uniqueRoles = useMemo(() => {
// //     const roles = new Set<string>();
// //     safeAdminData.forEach((admin) => {
// //       if (admin.role) roles.add(admin.role);
// //     });
// //     return Array.from(roles);
// //   }, [safeAdminData]);

// //   const roleList = useMemo(() => {
// //     const roles = [
// //       { text: "All Roles", value: "select" },
// //       ...uniqueRoles.map((role) => ({
// //         text: role === "SUPER_ADMIN" ? "Super Admin" : role.replace(/_/g, " "),
// //         value: role,
// //       })),
// //     ];
// //     return [roles[0], ...roles.slice(1).sort((a, b) => a.text.localeCompare(b.text))];
// //   }, [uniqueRoles]);

// //   const statusList = [
// //     { text: "All Status", value: "select" },
// //     { text: "Active", value: "active" },
// //     { text: "Pending Invitation", value: "pending" },
// //     { text: "Inactive", value: "inactive" },
// //     { text: "Suspended", value: "suspended" },
// //   ];

// //   // Transform admin data → Table rows
// //   const tableData = useMemo(() => {
// //     return safeAdminData.map((admin) => {
// //       const roleName = admin.role || "N/A";
// //       const roleDescription =
// //         roleName === "N/A"
// //           ? "No role assigned"
// //           : `${roleName.replace(/_/g, " ")} role`;

// //       let accountStatus = "inactive";
// //       if (admin.adminStatus) {
// //         accountStatus = admin.adminStatus.toLowerCase();
// //       } else if (admin.status) {
// //         accountStatus = admin.status.toLowerCase();
// //       } else if (admin.invitationStatus === "PENDING") {
// //         accountStatus = "pending";
// //       } else if (admin.invitationStatus === "COMPLETED") {
// //         accountStatus = "active";
// //       }

// //       return {
// //         id: admin.id,
// //         email: admin.email || "N/A",
// //         name: admin.fullName || admin.username || "N/A",
// //         profile: {
// //           username: admin.username || "N/A",
// //           fullName: admin.fullName || "N/A",
// //           phone: admin.phone || "N/A",
// //           gender: admin.gender || "N/A",
// //         },
// //         role: roleName,
// //         description: roleDescription,
// //         date: admin.createdAt || new Date().toISOString(),
// //         status: accountStatus,
// //         createdAt: admin.createdAt || new Date().toISOString(),
// //         formattedRole:
// //           roleName === "SUPER_ADMIN"
// //             ? "Super Admin"
// //             : roleName.replace(/_/g, " "),
// //         formattedDate: admin.createdAt
// //           ? new Date(admin.createdAt).toLocaleDateString("en-US", {
// //               day: "2-digit",
// //               month: "short",
// //               year: "numeric",
// //             })
// //           : "N/A",
// //         originalAdmin: admin,
// //         invitationStatus: admin.invitationStatus,
// //       } as TableRowData;
// //     });
// //   }, [safeAdminData]);

// //   const handleDeleteAdmin = async () => {
// //     if (!adminToDelete?.id) {
// //       toast.error("No admin selected for deletion");
// //       return;
// //     }
// //     try {
// //       await deleteAdmin(adminToDelete.id);
// //       toast.success("Admin deleted successfully");
// //       setDeleteDialogOpen(false);
// //       setAdminToDelete(null);
// //       refetch();
// //     } catch (error: any) {
// //       toast.error(
// //         error?.response?.data?.error || error?.message || "Failed to delete admin"
// //       );
// //     }
// //   };

// //   const openDeleteDialog = (admin: Admin) => {
// //     setAdminToDelete(admin);
// //     setDeleteDialogOpen(true);
// //   };

// //   // Column rendering
// //   const cellRenderers = useMemo(
// //     () => ({
// //       name: (item: TableRowData) => (
// //         <div className="flex flex-col gap-1 text-left">
// //           <div className="font-medium text-slate-800">
// //             {item.profile.fullName !== "N/A"
// //               ? item.profile.fullName
// //               : item.profile.username !== "N/A"
// //               ? item.profile.username
// //               : item.name}
// //           </div>
// //           <div className="text-sm text-slate-500">
// //             {item.email !== "N/A" ? item.email : "No email"}
// //           </div>
// //         </div>
// //       ),
// //       role: (item: TableRowData) => (
// //         <div className="font-medium flex items-center gap-3 capitalize">
// //           {item.formattedRole.toLowerCase().includes("admin") ? (
// //             <PersonIcon />
// //           ) : (
// //             <RepIcon />
// //           )}
// //           <span>{item.formattedRole}</span>
// //         </div>
// //       ),
// //       description: (item: TableRowData) => (
// //         <span className="font-medium">{item.description}</span>
// //       ),
// //       date: (item: TableRowData) => (
// //         <div className="font-medium flex items-center gap-3">
// //           <CalendarIcon />
// //           <div>
// //             <span>{item.formattedDate}</span>
// //             {item.invitationStatus === "PENDING" && (
// //               <span className="text-xs text-amber-600 flex items-center gap-1">
// //                 <Clock className="w-3 h-3" />
// //                 Invitation pending
// //               </span>
// //             )}
// //           </div>
// //         </div>
// //       ),
// //       status: (item: TableRowData) => {
// //         const s = item.status?.toLowerCase();
// //         let variant: "success" | "tertiary" | "warning" | "destructive" =
// //           "warning";
// //         let text = "UNKNOWN";
// //         if (s === "active") {
// //           variant = "success";
// //           text = "ACTIVE";
// //         } else if (s === "pending") {
// //           variant = "tertiary";
// //           text = "PENDING INVITE";
// //         } else if (s === "suspended") {
// //           variant = "destructive";
// //           text = "SUSPENDED";
// //         } else if (s === "inactive") {
// //           variant = "warning";
// //           text = "INACTIVE";
// //         }
// //         return (
// //           <Badge variant={variant} className="py-1 px-[26px] font-medium">
// //             {text}
// //           </Badge>
// //         );
// //       },
// //       action: (item: TableRowData) => (
// //         <div className="flex gap-2.5">
// //           <Link
// //             href={`${ROUTES.ADMIN.SIDEBAR.ADMINS}/${item.id}?tab=general`}
// //             className="bg-[#27A376] p-2.5 rounded-lg"
// //           >
// //             <ViewIcon />
// //           </Link>
// //           <button
// //             onClick={() =>
// //               item.originalAdmin && openDeleteDialog(item.originalAdmin)
// //             }
// //             className="bg-[#E03137] p-2.5 rounded-lg cursor-pointer"
// //             aria-label="Delete admin"
// //             disabled={item.originalAdmin?.email === email}
// //           >
// //             <DeleteIcon />
// //           </button>
// //         </div>
// //       ),
// //     }),
// //     [email]
// //   );

// //   const columnOrder: (keyof TableRowData)[] = [
// //     "name",
// //     "role",
// //     "description",
// //     "date",
// //     "status",
// //     "action",
// //   ];

// //   const columnLabels: Partial<Record<keyof TableRowData, string>> = {
// //     name: "Name & Email",
// //     role: "Role",
// //     description: "Description",
// //     date: "Created Date",
// //     status: "Status",
// //     action: "",
// //   };

// //   return (
// //     <Card className="bg-white">
// //       <CardContent className="p-6">
// //         {/* Header */}
// //         <div className="flex items-center justify-between mb-4">
// //           <div>
// //             <h6 className="font-semibold text-lg text-[#111827] mb-1">
// //               Role-Based Admin Management
// //             </h6>
// //             <p className="text-[#687588] font-medium text-sm mb-6">
// //               Manage administrators with role-based permissions and access control.
// //             </p>
// //           </div>
// //           <div className="flex items-center gap-2 text-sm text-gray-600">
// //             <CheckCircle className="w-4 h-4 text-green-600" />
// //             <span>Role-based access enabled</span>
// //           </div>
// //         </div>

// //         {/* Filters */}
// //         <div className="flex items-center gap-4 mb-6">
// //           <InputFilter
// //             setQuery={setNameFilter}
// //             placeholder="Search by name or email"
// //           />
// //           <SelectFilter
// //             setFilter={setRoleFilter}
// //             placeholder="Filter by Role"
// //             list={roleList}
// //           />
// //           <SelectFilter
// //             setFilter={setStatusFilter}
// //             placeholder="Filter by Status"
// //             list={statusList}
// //           />
// //         </div>

// //         {/* Table */}
// //         <TableComponent<any>
// //           tableData={tableData}
// //           currentPage={currentPage}
// //           onPageChange={onPageChange}
// //           totalPages={totalPages}
// //           totalItems={totalItems}
// //           pageSize={pageSize}
// //           onPageSizeChange={(value) => onLimitChange(Number(value))}
// //           cellRenderers={cellRenderers}
// //           columnOrder={columnOrder}
// //           columnLabels={columnLabels}
// //           isLoading={loading}
// //         />
// //       </CardContent>

// //       {/* Delete confirmation */}
// //       <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
// //         <DialogContent className="sm:max-w-[425px]">
// //           <DialogHeader>
// //             <DialogTitle>Confirm Admin Deletion</DialogTitle>
// //             <DialogDescription>
// //               Are you sure you want to delete{" "}
// //               <span className="font-medium">
// //                 {adminToDelete?.fullName ||
// //                   adminToDelete?.username ||
// //                   adminToDelete?.email ||
// //                   "this admin"}
// //               </span>
// //               ? This will remove their role-based permissions and access. This
// //               action cannot be undone.
// //             </DialogDescription>
// //           </DialogHeader>
// //           <DialogFooter>
// //             <Button
// //               variant="outline"
// //               onClick={() => setDeleteDialogOpen(false)}
// //               disabled={deleteAdminIsLoading}
// //             >
// //               Cancel
// //             </Button>
// //             <Button
// //               variant="destructive"
// //               onClick={handleDeleteAdmin}
// //               disabled={deleteAdminIsLoading || adminToDelete?.email === email}
// //             >
// //               {deleteAdminIsLoading ? "Deleting..." : "Delete Admin"}
// //             </Button>
// //           </DialogFooter>
// //         </DialogContent>
// //       </Dialog>
// //     </Card>
// //   );
// // };

// // export default DataTable;


// // "use client";
// // import React, { useState, useEffect, useMemo } from "react";
// // import { Badge } from "@/components/ui/badge";
// // import { Card, CardContent } from "@/components/ui/card";
// // import {
// //   CalendarIcon,
// //   DeleteIcon,
// //   ViewIcon,
// //   PersonIcon,
// //   RepIcon,
// // } from "../../../../../../public/icons";
// // import { TableComponent } from "@/components/custom-table";
// // import { SelectFilter } from "@/app/(admin)/components/select-filter";
// // import { InputFilter } from "@/app/(admin)/components/input-filter";
// // import Link from "next/link";
// // import { ROUTES } from "@/constant/routes";
// // import { toast } from "sonner";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogHeader,
// //   DialogTitle,
// //   DialogDescription,
// //   DialogFooter,
// // } from "@/components/ui/dialog";
// // import { useDeleteAdmin } from "@/services/admin";
// // import { Button } from "@/components/ui/button";
// // import { Clock, CheckCircle } from "lucide-react";

// // // Types
// // interface Admin {
// //   id: number | string;
// //   email?: string;
// //   username?: string;
// //   fullName?: string;
// //   phone?: string;
// //   gender?: string;
// //   status?: string;
// //   adminStatus?: string;
// //   role?: string;
// //   createdAt?: string;
// //   invitationStatus?: "COMPLETED" | "PENDING" | "EXPIRED" | "CANCELLED";
// // }

// // interface TableRowData {
// //   id: number | string;
// //   email: string;
// //   name: string;
// //   profile: {
// //     username: string;
// //     fullName: string;
// //     phone: string;
// //     gender: string;
// //   };
// //   role: string;
// //   description: string;
// //   date: string;
// //   status: string;
// //   createdAt: string;
// //   formattedRole: string;
// //   formattedDate: string;
// //   originalAdmin?: Admin;
// //   invitationStatus?: "COMPLETED" | "PENDING" | "EXPIRED" | "CANCELLED";
// //   [key: string]: any;
// // }

// // interface DataTableProps {
// //   adminData: any; // can be { data, pagination } or array
// //   loading: boolean;
// //   refetch: () => void;
// //   totalItems?: number;
// //   currentPage?: number;
// //   totalPages?: number;
// //   onPageChange: (page: number) => void;
// //   onLimitChange: (limit: number) => void;
// //   onFilterChange: (filters: Record<string, any>) => void;
// //   pageSize?: number;
// // }

// // const DataTable: React.FC<DataTableProps> = ({
// //   adminData,
// //   loading,
// //   refetch,
// //   totalItems,
// //   currentPage,
// //   totalPages,
// //   onPageChange,
// //   onLimitChange,
// //   onFilterChange,
// //   pageSize,
// // }) => {
// //   const [roleFilter, setRoleFilter] = useState("select");
// //   const [statusFilter, setStatusFilter] = useState("select");
// //   const [nameFilter, setNameFilter] = useState("");
// //   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
// //   const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);
// //   const [email, setEmail] = useState("");

// //   useEffect(() => {
// //     if (typeof window !== "undefined") {
// //       const storedEmail =
// //         localStorage.getItem("userEmail") ||
// //         sessionStorage.getItem("userEmail");
// //       if (storedEmail) setEmail(storedEmail);
// //     }
// //   }, []);

// //   const { deleteAdminPayload: deleteAdmin, deleteAdminIsLoading } =
// //     useDeleteAdmin();

// //   // ✅ Safe admin data extraction
// //   const safeAdminData = useMemo(() => {
// //     if (Array.isArray(adminData?.data)) return adminData.data;
// //     if (Array.isArray(adminData)) return adminData;
// //     return [];
// //   }, [adminData]);

// //   // 🔄 Send filters to parent (hook) whenever they change
// //   useEffect(() => {
// //     const timer = setTimeout(() => {
// //       const filters: Record<string, any> = {};
// //       if (nameFilter) filters.search = nameFilter;
// //       if (roleFilter !== "select") filters.role = roleFilter;
// //       if (statusFilter !== "select") filters.status = statusFilter;
// //       onFilterChange(filters);
// //     }, 400);
// //     return () => clearTimeout(timer);
// //   }, [nameFilter, roleFilter, statusFilter, onFilterChange]);

// //   // Build dropdown role list
// //   const uniqueRoles = useMemo(() => {
// //     const roles = new Set<string>();
// //     safeAdminData.forEach((admin:any) => {
// //       if (admin.role) roles.add(admin.role);
// //     });
// //     return Array.from(roles);
// //   }, [safeAdminData]);

// //   const roleList = useMemo(() => {
// //     const roles = [
// //       { text: "All Roles", value: "select" },
// //       ...uniqueRoles.map((role) => ({
// //         text: role === "SUPER_ADMIN" ? "Super Admin" : role.replace(/_/g, " "),
// //         value: role,
// //       })),
// //     ];
// //     return [
// //       roles[0],
// //       ...roles.slice(1).sort((a, b) => a.text.localeCompare(b.text)),
// //     ];
// //   }, [uniqueRoles]);

// //   const statusList = [
// //     { text: "All Status", value: "select" },
// //     { text: "Active", value: "active" },
// //     { text: "Pending Invitation", value: "pending" },
// //     { text: "Inactive", value: "inactive" },
// //     { text: "Suspended", value: "suspended" },
// //   ];

// //   // Transform admin data → Table rows
// //   const tableData = useMemo(() => {
// //     return safeAdminData.map((admin: Admin) => {
// //       const roleName = admin.role || "N/A";
// //       const roleDescription =
// //         roleName === "N/A"
// //           ? "No role assigned"
// //           : `${roleName.replace(/_/g, " ")} role`;

// //       let accountStatus = "inactive";
// //       if (admin.adminStatus) {
// //         accountStatus = admin.adminStatus.toLowerCase();
// //       } else if (admin.status) {
// //         accountStatus = admin.status.toLowerCase();
// //       } else if (admin.invitationStatus === "PENDING") {
// //         accountStatus = "pending";
// //       } else if (admin.invitationStatus === "COMPLETED") {
// //         accountStatus = "active";
// //       }

// //       return {
// //         id: admin.id,
// //         email: admin.email || "N/A",
// //         name: admin.fullName || admin.username || "N/A",
// //         profile: {
// //           username: admin.username || "N/A",
// //           fullName: admin.fullName || "N/A",
// //           phone: admin.phone || "N/A",
// //           gender: admin.gender || "N/A",
// //         },
// //         role: roleName,
// //         description: roleDescription,
// //         date: admin.createdAt || new Date().toISOString(),
// //         status: accountStatus,
// //         createdAt: admin.createdAt || new Date().toISOString(),
// //         formattedRole:
// //           roleName === "SUPER_ADMIN"
// //             ? "Super Admin"
// //             : roleName.replace(/_/g, " "),
// //         formattedDate: admin.createdAt
// //           ? new Date(admin.createdAt).toLocaleDateString("en-US", {
// //               day: "2-digit",
// //               month: "short",
// //               year: "numeric",
// //             })
// //           : "N/A",
// //         originalAdmin: admin,
// //         invitationStatus: admin.invitationStatus,
// //       } as TableRowData;
// //     });
// //   }, [safeAdminData]);

// //   const handleDeleteAdmin = async () => {
// //     if (!adminToDelete?.id) {
// //       toast.error("No admin selected for deletion");
// //       return;
// //     }
// //     try {
// //       await deleteAdmin(adminToDelete.id);
// //       toast.success("Admin deleted successfully");
// //       setDeleteDialogOpen(false);
// //       setAdminToDelete(null);
// //       refetch();
// //     } catch (error: any) {
// //       toast.error(
// //         error?.response?.data?.error ||
// //           error?.message ||
// //           "Failed to delete admin"
// //       );
// //     }
// //   };

// //   const openDeleteDialog = (admin: Admin) => {
// //     setAdminToDelete(admin);
// //     setDeleteDialogOpen(true);
// //   };

// //   // Column rendering
// //   const cellRenderers = useMemo(
// //     () => ({
// //       name: (item: TableRowData) => (
// //         <div className="flex flex-col gap-1 text-left">
// //           <div className="font-medium text-slate-800">
// //             {item.profile.fullName !== "N/A"
// //               ? item.profile.fullName
// //               : item.profile.username !== "N/A"
// //               ? item.profile.username
// //               : item.name}
// //           </div>
// //           <div className="text-sm text-slate-500">
// //             {item.email !== "N/A" ? item.email : "No email"}
// //           </div>
// //         </div>
// //       ),
// //       role: (item: TableRowData) => (
// //         <div className="font-medium flex items-center gap-3 capitalize">
// //           {item.formattedRole.toLowerCase().includes("admin") ? (
// //             <PersonIcon />
// //           ) : (
// //             <RepIcon />
// //           )}
// //           <span>{item.formattedRole}</span>
// //         </div>
// //       ),
// //       description: (item: TableRowData) => (
// //         <span className="font-medium">{item.description}</span>
// //       ),
// //       date: (item: TableRowData) => (
// //         <div className="font-medium flex items-center gap-3">
// //           <CalendarIcon />
// //           <div>
// //             <span>{item.formattedDate}</span>
// //             {item.invitationStatus === "PENDING" && (
// //               <span className="text-xs text-amber-600 flex items-center gap-1">
// //                 <Clock className="w-3 h-3" />
// //                 Invitation pending
// //               </span>
// //             )}
// //           </div>
// //         </div>
// //       ),
// //       status: (item: TableRowData) => {
// //         const s = item.status?.toLowerCase();
// //         let variant: "success" | "tertiary" | "warning" | "destructive" =
// //           "warning";
// //         let text = "UNKNOWN";
// //         if (s === "active") {
// //           variant = "success";
// //           text = "ACTIVE";
// //         } else if (s === "pending") {
// //           variant = "tertiary";
// //           text = "PENDING INVITE";
// //         } else if (s === "suspended") {
// //           variant = "destructive";
// //           text = "SUSPENDED";
// //         } else if (s === "inactive") {
// //           variant = "warning";
// //           text = "INACTIVE";
// //         }
// //         return (
// //           <Badge variant={variant} className="py-1 px-[26px] font-medium">
// //             {text}
// //           </Badge>
// //         );
// //       },
// //       action: (item: TableRowData) => (
// //         <div className="flex gap-2.5">
// //           <Link
// //             href={`${ROUTES.ADMIN.SIDEBAR.ADMINS}/${item.id}?tab=general`}
// //             className="bg-[#27A376] p-2.5 rounded-lg"
// //           >
// //             <ViewIcon />
// //           </Link>
// //           <button
// //             onClick={() =>
// //               item.originalAdmin && openDeleteDialog(item.originalAdmin)
// //             }
// //             className="bg-[#E03137] p-2.5 rounded-lg cursor-pointer"
// //             aria-label="Delete admin"
// //             disabled={item.originalAdmin?.email === email}
// //           >
// //             <DeleteIcon />
// //           </button>
// //         </div>
// //       ),
// //     }),
// //     [email]
// //   );

// //   const columnOrder: (keyof TableRowData)[] = [
// //     "name",
// //     "role",
// //     "description",
// //     "date",
// //     "status",
// //     "action",
// //   ];

// //   const columnLabels: Partial<Record<keyof TableRowData, string>> = {
// //     name: "Name & Email",
// //     role: "Role",
// //     description: "Description",
// //     date: "Created Date",
// //     status: "Status",
// //     action: "",
// //   };

// //   return (
// //     <Card className="bg-white">
// //       <CardContent className="p-6">
// //         {/* Header */}
// //         <div className="flex items-center justify-between mb-4">
// //           <div>
// //             <h6 className="font-semibold text-lg text-[#111827] mb-1">
// //               Role-Based Admin Management
// //             </h6>
// //             <p className="text-[#687588] font-medium text-sm mb-6">
// //               Manage administrators with role-based permissions and access control.
// //             </p>
// //           </div>
// //           <div className="flex items-center gap-2 text-sm text-gray-600">
// //             <CheckCircle className="w-4 h-4 text-green-600" />
// //             <span>Role-based access enabled</span>
// //           </div>
// //         </div>

// //         {/* Filters */}
// //         <div className="flex items-center gap-4 mb-6">
// //           <InputFilter
// //             setQuery={setNameFilter}
// //             placeholder="Search by name or email"
// //           />
// //           <SelectFilter
// //             setFilter={setRoleFilter}
// //             placeholder="Filter by Role"
// //             list={roleList}
// //           />
// //           <SelectFilter
// //             setFilter={setStatusFilter}
// //             placeholder="Filter by Status"
// //             list={statusList}
// //           />
// //         </div>

// //         {/* ✅ Table with safe fallbacks */}
// //         <TableComponent<any>
// //           tableData={tableData}
// //           currentPage={currentPage || 1}
// //           onPageChange={onPageChange}
// //           totalPages={totalPages || 1}
// //           totalItems={totalItems || safeAdminData.length}
// //           pageSize={pageSize || 10}
// //           onPageSizeChange={(value) => onLimitChange(Number(value))}
// //           cellRenderers={cellRenderers}
// //           columnOrder={columnOrder}
// //           columnLabels={columnLabels}
// //           isLoading={loading}
// //         />
// //       </CardContent>

// //       {/* Delete confirmation */}
// //       <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
// //         <DialogContent className="sm:max-w-[425px]">
// //           <DialogHeader>
// //             <DialogTitle>Confirm Admin Deletion</DialogTitle>
// //             <DialogDescription>
// //               Are you sure you want to delete{" "}
// //               <span className="font-medium">
// //                 {adminToDelete?.fullName ||
// //                   adminToDelete?.username ||
// //                   adminToDelete?.email ||
// //                   "this admin"}
// //               </span>
// //               ? This will remove their role-based permissions and access. This
// //               action cannot be undone.
// //             </DialogDescription>
// //           </DialogHeader>
// //           <DialogFooter>
// //             <Button
// //               variant="outline"
// //               onClick={() => setDeleteDialogOpen(false)}
// //               disabled={deleteAdminIsLoading}
// //             >
// //               Cancel
// //             </Button>
// //             <Button
// //               variant="destructive"
// //               onClick={handleDeleteAdmin}
// //               disabled={deleteAdminIsLoading || adminToDelete?.email === email}
// //             >
// //               {deleteAdminIsLoading ? "Deleting..." : "Delete Admin"}
// //             </Button>
// //           </DialogFooter>
// //         </DialogContent>
// //       </Dialog>
// //     </Card>
// //   );
// // };

// // export default DataTable;



// "use client";
// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";
// import { CalendarIcon, DeleteIcon, ViewIcon, PersonIcon, RepIcon } from "../../../../../../public/icons";
// import { TableComponent } from "@/components/custom-table";
// import { SelectFilter } from "@/app/(admin)/components/select-filter";
// import { InputFilter } from "@/app/(admin)/components/input-filter";
// import Link from "next/link";
// import { ROUTES } from "@/constant/routes";
// import { toast } from "sonner";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
// import { useDeleteAdmin } from "@/services/admin";
// import { Button } from "@/components/ui/button";
// import { Clock, CheckCircle } from "lucide-react";

// // Local type definitions
// interface Admin {
//   id: number | string;
//   email?: string;
//   username?: string;
//   fullName?: string;
//   phone?: string;
//   gender?: string;
//   status?: string;
//   adminStatus?: string;
//   role?: string;
//   createdAt?: string;
//   lastLogin?: string;
//   invitationStatus?: 'COMPLETED' | 'PENDING' | 'EXPIRED' | 'CANCELLED';
// }

// interface TableRowData {
//   id: number | string;
//   email: string;
//   name: string;
//   profile: {
//     username: string;
//     fullName: string;
//     phone: string;
//     gender: string;
//   };
//   role: string;
//   description: string;
//   date: string;
//   status: string;
//   createdAt: string;
//   roles: {
//     role: {
//       id: number;
//       name: string;
//       discription: string;
//     };
//   };
//   rolecount: string;
//   action: string;
//   formattedRole: string;
//   formattedDate: string;
//   originalAdmin?: Admin;
//   isRoleBased: boolean;
//   invitationStatus?: 'COMPLETED' | 'PENDING' | 'EXPIRED' | 'CANCELLED';
//   roleCount: number;
//   [key: string]: any;
// }

// interface DataTableProps {
//   adminData: Admin[];
//   loading: boolean;
//   refetch: () => void;
//   totalItems: number;
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
//   onLimitChange: (limit: number) => void;
//   onFilterChange: (filters: any) => void;
//   pageSize: number;
// }

// const DataTable: React.FC<DataTableProps> = ({
//   adminData,
//   loading,
//   refetch,
//   totalItems,
//   currentPage,
//   totalPages,
//   onPageChange,
//   onLimitChange,
//   onFilterChange,
//   pageSize,
// }) => {
//   const [roleFilter, setRoleFilter] = useState<string>("");
//   const [statusFilter, setStatusFilter] = useState<string>("");
//   const [nameFilter, setNameFilter] = useState<string>("");
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);
//   const [email, setEmail] = useState("");

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const storedEmail = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");
//       if (storedEmail) setEmail(storedEmail);
//     }
//   }, []);

//   const { deleteAdminPayload: deleteAdmin, deleteAdminIsLoading } = useDeleteAdmin();

//   const safeAdminData = Array.isArray(adminData) ? adminData : [];

//   const handleFilterChange = useCallback((newFilters: any) => {
//     if (onFilterChange) {
//       onFilterChange(newFilters);
//     }
//   }, [onFilterChange]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       const filters: any = {};
      
//       if (nameFilter) {
//         filters.search = nameFilter;
//       }
      
//       if (roleFilter && roleFilter !== "select") {
//         filters.role = roleFilter;
//       }
      
//       if (statusFilter && statusFilter !== "select") {
//         filters.status = statusFilter;
//       }
      
//       handleFilterChange(filters);
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [nameFilter, roleFilter, statusFilter, handleFilterChange]);

//   // Get unique roles from the admin data for the filter
//   const uniqueRoles = useMemo(() => {
//     const roles = new Set<string>();
//     safeAdminData.forEach(admin => {
//       if (admin.role) {
//         roles.add(admin.role);
//       }
//     });
//     return Array.from(roles);
//   }, [safeAdminData]);

//   // Transform Admin data to match TableComponent requirements
//   const tableData = useMemo(() => {
//     return safeAdminData.map((admin: Admin) => {
//       // Get the role name from the admin data
//       const roleName = admin.role || "N/A";
      
//       // Create a description based on the role
//       const roleDescription = roleName === "N/A" 
//         ? "No role assigned" 
//         : `${roleName.replace(/_/g, " ")} role`;

//       // Determine the account status
//       let accountStatus = "inactive";
      
//       if (admin.adminStatus) {
//         accountStatus = admin.adminStatus.toLowerCase();
//       } else if (admin.status) {
//         accountStatus = admin.status.toLowerCase();
//       } else if (admin.invitationStatus === 'PENDING') {
//         accountStatus = "pending";
//       } else if (admin.invitationStatus === 'COMPLETED') {
//         accountStatus = "active";
//       }

//       const adminData: TableRowData = {
//         id: admin.id,
//         email: admin.email || "N/A",
//         name: admin.fullName || admin.username || "N/A",
//         profile: {
//           username: admin.username || "N/A",
//           fullName: admin.fullName || "N/A",
//           phone: admin.phone || "N/A",
//           gender: admin.gender || "N/A",
//         },
//         role: roleName,
//         description: roleDescription,
//         date: admin.createdAt || new Date().toISOString(),
//         status: accountStatus,
//         createdAt: admin.createdAt || new Date().toISOString(),
//         roles: {
//           role: {
//             id: 0,
//             name: roleName,
//             discription: roleDescription,
//           }
//         },
//         rolecount: "1",
//         action: "",
//         formattedRole: roleName === "SUPER_ADMIN" 
//           ? "Super Admin" 
//           : roleName.replace(/_/g, " "),
//         formattedDate: admin.createdAt
//           ? new Date(admin.createdAt).toLocaleDateString("en-US", {
//               day: "2-digit",
//               month: "short",
//               year: "numeric",
//             })
//           : "N/A",
//         originalAdmin: admin,
//         isRoleBased: true,
//         invitationStatus: admin.invitationStatus,
//         roleCount: 1,
//       };

//       return adminData;
//     });
//   }, [safeAdminData]);

//   const handleDeleteAdmin = async () => {
//     if (!adminToDelete?.id) {
//       toast.error("No admin selected for deletion");
//       return;
//     }

//     try {
//       await deleteAdmin(adminToDelete.id);
//       toast.success("Admin deleted successfully");
//       setDeleteDialogOpen(false);
//       setAdminToDelete(null);
//       refetch();
//     } catch (error: any) {
//       console.error("Delete admin error:", error);
//       const errorMessage = error?.response?.data?.error ||
//         error?.message ||
//         "Failed to delete admin";
//       toast.error(errorMessage);
//     }
//   };

//   const openDeleteDialog = (admin: Admin) => {
//     setAdminToDelete(admin);
//     setDeleteDialogOpen(true);
//   };

//   // Filter lists
//   const statusList = [
//     { text: "All Status", value: "select" },
//     { text: "Active", value: "active" },
//     { text: "Pending Invitation", value: "pending" },
//     { text: "Inactive", value: "inactive" },
//     { text: "Suspended", value: "suspended" },
//   ];

//   // Generate role list from unique roles in the data
//   const roleList = useMemo(() => {
//     const roles = [
//       { text: "All Roles", value: "select" },
//       ...uniqueRoles.map(role => ({
//         text: role === "SUPER_ADMIN" 
//           ? "Super Admin" 
//           : role.replace(/_/g, " "),
//         value: role
//       }))
//     ];
    
//     // Sort alphabetically by text, keeping "All Roles" first
//     return [
//       roles[0],
//       ...roles.slice(1).sort((a, b) => a.text.localeCompare(b.text))
//     ];
//   }, [uniqueRoles]);

//   const cellRenderers = useMemo(() => ({
//     name: (item: TableRowData) => (
//       <div className="flex flex-col gap-1 text-left">
//         <div className="font-medium text-slate-800">
//           {item.profile.fullName !== "N/A" ? item.profile.fullName :
//             item.profile.username !== "N/A" ? item.profile.username :
//               item.name !== "N/A" ? item.name : "Unknown"}
//         </div>
//         <div className="text-sm text-slate-500">
//           {item.email !== "N/A" ? item.email : "No email"}
//         </div>
//       </div>
//     ),
  
//     role: (item: TableRowData) => (
//       <div className="font-medium flex items-center gap-3 capitalize">
//         {item.formattedRole.toLowerCase().includes("admin") ? (
//           <PersonIcon />
//         ) : (
//           <RepIcon />
//         )}
//         <div className="flex flex-col">
//           <span>{item.formattedRole}</span>
//         </div>
//       </div>
//     ),
  
//     description: (item: TableRowData) => (
//       <div className="flex flex-col">
//         <span className="font-medium">
//           {item.description}
//         </span>
//       </div>
//     ),
  
//     date: (item: TableRowData) => (
//       <div className="font-medium flex items-center gap-3">
//         <CalendarIcon />
//         <div className="flex flex-col">
//           <span>{item.formattedDate}</span>
//           {item.invitationStatus === "PENDING" && (
//             <span className="text-xs text-amber-600 flex items-center gap-1">
//               <Clock className="w-3 h-3" />
//               Invitation pending
//             </span>
//           )}
//         </div>
//       </div>
//     ),
  
//     status: (item: TableRowData) => {
//       const status = item.status?.toLowerCase();
//       let variant: "success" | "tertiary" | "warning" | "destructive" = "warning";
//       let statusText = "UNKNOWN";

//       if (status === "active") {
//         variant = "success";
//         statusText = "ACTIVE";
//       } else if (status === "pending") {
//         variant = "tertiary";
//         statusText = "PENDING INVITE";
//       } else if (status === "suspended") {
//         variant = "destructive";
//         statusText = "SUSPENDED";
//       } else if (status === "inactive") {
//         variant = "warning";
//         statusText = "INACTIVE";
//       }

//       return (
//         <div className="flex flex-col gap-1">
//           <Badge variant={variant} className="py-1 px-[26px] font-medium">
//             {statusText}
//           </Badge>
//           {item.invitationStatus === "PENDING" && (
//             <span className="text-xs text-gray-500">Awaiting setup</span>
//           )}
//         </div>
//       );
//     },
  
//     action: (item: TableRowData) => (
//       <div className="flex gap-2.5">
//         <Link
//           href={`${ROUTES.ADMIN.SIDEBAR.ADMINS}/${item.id}?tab=general`}
//           className="bg-[#27A376] p-2.5 rounded-lg"
//         >
//           <ViewIcon />
//         </Link>
//         <button
//           onClick={() =>
//             item.originalAdmin && openDeleteDialog(item.originalAdmin)
//           }
//           className="bg-[#E03137] p-2.5 rounded-lg cursor-pointer"
//           aria-label="Delete admin"
//           disabled={item.originalAdmin?.email === email}
//         >
//           <DeleteIcon />
//         </button>
//       </div>
//     ),
//   }), [email]);

//   const columnOrder: (keyof TableRowData)[] = [
//     "name",
//     "role",
//     "description",
//     "date",
//     "status",
//     "action",
//   ];

//   const columnLabels: Partial<Record<keyof TableRowData, string>> = {
//     name: "Name & Email",
//     role: "Role",
//     description: "Description",
//     date: "Created Date",
//     status: "Status",
//     action: "",
//   };

//   return (
//     <Card className="bg-white">
//       <CardContent className="p-6">
//         <div className="flex items-center justify-between mb-4">
//           <div>
//             <h6 className="font-semibold text-lg text-[#111827] mb-1">
//               Role-Based Admin Management
//             </h6>
//             <p className="text-[#687588] font-medium text-sm mb-6">
//               Manage administrators with role-based permissions and access control.
//             </p>
//           </div>
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <CheckCircle className="w-4 h-4 text-green-600" />
//             <span>Role-based access enabled</span>
//           </div>
//         </div>

//         <div className="flex items-center gap-4 mb-6">
//           <InputFilter
//             setQuery={setNameFilter}
//             placeholder="Search by name or email"
//           />
//           <SelectFilter
//             setFilter={setRoleFilter}
//             placeholder="Filter by Role"
//             list={roleList}
//           />
//           <SelectFilter
//             setFilter={setStatusFilter}
//             placeholder="Filter by Status"
//             list={statusList}
//           />
//         </div>

//         <TableComponent<TableRowData>
//           tableData={tableData}
//           currentPage={currentPage}
//           onPageChange={onPageChange}
//           totalPages={totalPages}
//           cellRenderers={cellRenderers}
//           columnOrder={columnOrder}
//           columnLabels={columnLabels}
//           isLoading={loading}
//           onPageSizeChange={(value) => onLimitChange && onLimitChange(Number(value))}
//           totalItems={totalItems}
//         />
//       </CardContent>

//       <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Confirm Role-Based Admin Deletion</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to delete{" "}
//               <span className="font-medium">
//                 {adminToDelete?.fullName ||
//                   adminToDelete?.username ||
//                   adminToDelete?.email ||
//                   "this admin"}
//               </span>
//               ? This will remove all their role-based permissions and access. This action cannot be undone.
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setDeleteDialogOpen(false)}
//               disabled={deleteAdminIsLoading}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="destructive"
//               onClick={handleDeleteAdmin}
//               disabled={deleteAdminIsLoading || adminToDelete?.email === email}
//             >
//               {deleteAdminIsLoading ? "Deleting..." : "Delete Admin"}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </Card>
//   );
// };

// export default DataTable;

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

  console.log("Admin data structure for role-based filtering:", safeAdminData[0]);

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

  const roleList = [
    { text: "All Roles", value: "select" },
    { text: "Super Admin", value: "super_admin" },
    { text: "Admin", value: "admin" },
    { text: "Product Manager", value: "product_manager" },
    { text: "Inventory Manager", value: "inventory_manager" },
    { text: "Order Manager", value: "order_manager" },
    { text: "Customer Support", value: "customer_support" },
  ];

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
          href={`${ROUTES.ADMIN.SIDEBAR.ADMINS}/${item.id}?tab=general`}
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
          />
          <SelectFilter
            setFilter={setStatusFilter}
            placeholder="Filter by Status"
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