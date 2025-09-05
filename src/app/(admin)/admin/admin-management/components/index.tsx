// // // "use client";

// // // import React, { useState } from "react";
// // // import Header from "@/app/(admin)/components/header";
// // // import { Button } from "@/components/ui/button";
// // // import { Card, CardContent } from "@/components/ui/card";
// // // import {
// // //   Dialog,
// // //   DialogContent,
// // //   DialogHeader,
// // //   DialogTitle,
// // // } from "@/components/ui/dialog";
// // // import { ChevronLeft } from "lucide-react";

// // // import CreateAdmin from "./add-admin";
// // // import RoleCard from "./role-card";
// // // import DataTable from "./data-table";
// // // import InviteLinkDisplay from "./invite-link-display";
// // // import PendingInvitations from "./PendingInvitations";

// // // import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// // // // ✅ FIX: Update imports to use unified hooks
// // // import { useGetAdminRoles, useGetAdmins } from "@/services/admin";

// // // // ✅ FIX: Extended Role interface to match RoleData requirements
// // // interface Role {
// // //   id: number;
// // //   name: string;
// // //   description?: string;
// // //   type?: string;
// // //   permissions?: any[];
// // //   // ✅ ADD: Additional properties that RoleCard expects
// // //   _count?: {
// // //     users: number;
// // //   };
// // //   createdAt?: string;
// // //   updatedAt?: string;
// // //   // ✅ ADD: These might be required by RoleData type
// // //   toLowerCase?: () => string;
// // //   email?: string;
// // //   data?: any;
// // // }

// // // // ✅ ALTERNATIVE: Define a complete RoleData interface that matches what RoleCard expects
// // // interface RoleData {
// // //   id: number;
// // //   name: string;
// // //   description?: string;
// // //   type?: string;
// // //   permissions: any[];
// // //   _count: {
// // //     users: number;
// // //   };
// // //   createdAt?: string;
// // //   updatedAt?: string;
// // //   // Add any other properties that the RoleCard component expects
// // //   toLowerCase?: () => string;
// // //   email?: string;
// // //   data?: any;
// // // }

// // // export default function Admins() {
// // //   const [url, setUrl] = useState<string>("");
// // //   const [isOpen, setIsOpen] = useState<boolean>(false);
// // //   const [showInviteLink, setShowInviteLink] = useState<boolean>(false);

// // //   // ✅ FIX: Use unified hooks
// // //   const { rolesData, isRolesLoading } = useGetAdminRoles({ enabled: true });
// // //   const { adminsData, isAdminsLoading, refetchAdmins } = useGetAdmins({ enabled: true });

// // //   // ✅ FIX: Transform rolesData to match RoleData interface requirements
// // //   const safeRolesData: RoleData[] = Array.isArray(rolesData)
// // //     ? rolesData.map((role: any) => ({
// // //       id: role.id || 0,
// // //       name: role.name || '',
// // //       description: role.description || '',
// // //       type: role.type || 'ADMIN',
// // //       permissions: role.permissions || [],
// // //       _count: role._count || { users: 0 },
// // //       createdAt: role.createdAt,
// // //       updatedAt: role.updatedAt,
// // //       // ✅ ADD: Provide fallbacks for any missing properties
// // //       toLowerCase: role.toLowerCase,
// // //       email: role.email,
// // //       data: role.data,
// // //     }))
// // //     : [];

// // //   const safeAdminData = Array.isArray(adminsData) ? adminsData : [];

// // //   const handleAdminCreated = (inviteUrl: string) => {
// // //     setUrl(inviteUrl);
// // //     setIsOpen(false);
// // //     setShowInviteLink(true);
// // //     refetchAdmins();
// // //   };

// // //   const handleCloseLinkDisplay = () => {
// // //     setShowInviteLink(false);
// // //     setUrl("");
// // //   };

// // //   return (
// // //     <section>
// // //       <Card className="bg-white mb-8">
// // //         <CardContent className="p-4 flex justify-between items-center">
// // //           <Header
// // //             title="Admin Management"
// // //             subtext="Manage administrator accounts and assign roles with appropriate permissions."
// // //           />
// // //           <Button
// // //             variant="warning"
// // //             className="font-bold text-base w-auto py-4 px-6"
// // //             size="xl"
// // //             onClick={() => setIsOpen(true)}
// // //           >
// // //             + Add new admin
// // //           </Button>
// // //         </CardContent>
// // //       </Card>

// // //       {showInviteLink && url && (
// // //         <div className="mb-8">
// // //           <InviteLinkDisplay url={url} onClose={handleCloseLinkDisplay} />
// // //         </div>
// // //       )}

// // //       <Tabs defaultValue="admins" className="space-y-8">
// // //         <TabsList>
// // //           <TabsTrigger value="admins">Admins</TabsTrigger>
// // //           <TabsTrigger value="pending">Pending Invitations</TabsTrigger>
// // //         </TabsList>

// // //         <TabsContent value="admins">
// // //           {/* Role Cards */}
// // //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
// // //             {safeRolesData.map((role: RoleData) => (
// // //               <RoleCard key={role.id} role={role as any} />
// // //             ))}
// // //           </div>

// // //           {/* Admin Data Table */}
// // //           <DataTable
// // //             adminData={safeAdminData}
// // //             loading={isAdminsLoading}
// // //             refetch={refetchAdmins}
// // //           />
// // //         </TabsContent>

// // //         <TabsContent value="pending">
// // //           <PendingInvitations />
// // //         </TabsContent>
// // //       </Tabs>

// // //       <Dialog open={isOpen} onOpenChange={setIsOpen}>
// // //         <DialogContent className="right-0 h-full w-1/2">
// // //           <DialogHeader>
// // //             <DialogTitle className="mb-6 text-2xl font-bold text-[#111827] flex gap-4.5 items-center">
// // //               <div onClick={() => setIsOpen(false)} className="cursor-pointer">
// // //                 <ChevronLeft size={24} />
// // //               </div>
// // //               Create new admin
// // //             </DialogTitle>
// // //           </DialogHeader>
// // //           <CreateAdmin
// // //             setUrl={handleAdminCreated}
// // //             setClose={() => setIsOpen(false)}
// // //           />
// // //         </DialogContent>
// // //       </Dialog>
// // //     </section>
// // //   );
// // // }

// // // "use client";

// // // import React, { useState } from "react";
// // // import Header from "@/app/(admin)/components/header";
// // // import { Button } from "@/components/ui/button";
// // // import { Card, CardContent } from "@/components/ui/card";
// // // import {
// // //   Dialog,
// // //   DialogContent,
// // //   DialogHeader,
// // //   DialogTitle,
// // // } from "@/components/ui/dialog";
// // // import { ChevronLeft } from "lucide-react";

// // // import CreateAdmin from "./add-admin";
// // // import RoleCard from "./role-card";
// // // import DataTable from "./data-table";
// // // import InviteLinkDisplay from "./invite-link-display";
// // // import PendingInvitations from "./PendingInvitations";

// // // import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// // // import { useGetAdminRoles, useGetAdmins } from "@/services/admin";


// // "use client";

// // import React, { useState, useCallback } from "react";
// // import Header from "@/app/(admin)/components/header";
// // import { Button } from "@/components/ui/button";
// // import { Card, CardContent } from "@/components/ui/card";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogHeader,
// //   DialogTitle,
// // } from "@/components/ui/dialog";
// // import { ChevronLeft } from "lucide-react";

// // import CreateAdmin from "./add-admin";
// // import RoleCard from "./role-card";
// // import DataTable from "./data-table";
// // import InviteLinkDisplay from "./invite-link-display";
// // import PendingInvitations from "./PendingInvitations";

// // import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// // import { useGetAdminRoles, useGetAdmins } from "@/services/admin";

// // // ✅ FIX: Extended Role interface to match RoleData requirements
// // interface Role {
// //   id: number;
// //   name: string;
// //   description?: string;
// //   type?: string;
// //   permissions?: any[];
// //   _count?: {
// //     users: number;
// //   };
// //   createdAt?: string;
// //   updatedAt?: string;
// //   toLowerCase?: () => string;
// //   email?: string;
// //   data?: any;
// // }

// // // ✅ ALTERNATIVE: Define a complete RoleData interface that matches what RoleCard expects
// // interface RoleData {
// //   id: number;
// //   name: string;
// //   description?: string;
// //   type?: string;
// //   permissions: any[];
// //   _count: {
// //     users: number;
// //   };
// //   createdAt?: string;
// //   updatedAt?: string;
// //   toLowerCase?: () => string;
// //   email?: string;
// //   data?: any;
// // }

// // export default function Admins() {
// //   const [url, setUrl] = useState<string>("");
// //   const [isOpen, setIsOpen] = useState<boolean>(false);
// //   const [showInviteLink, setShowInviteLink] = useState<boolean>(false);
// //   const [page, setPage] = useState(1);
// //   const [limit, setLimit] = useState(10);
// //   const [filters, setFilters] = useState({});

// //   // ✅ FIX: Use unified hooks with pagination
// //   const { rolesData, isRolesLoading } = useGetAdminRoles({ enabled: true });
// //   const { 
// //     adminsData, 
// //     isAdminsLoading, 
// //     refetchAdmins, 
// //     totalAdmins, 
// //     totalPages,
// //     currentPage,
// //     itemsPerPage 
// //   } = useGetAdmins({ 
// //     enabled: true, 
// //     filter: { page, limit, ...filters } 
// //   });

// //   // ✅ FIX: Transform rolesData to match RoleData interface requirements
// //   const safeRolesData: RoleData[] = Array.isArray(rolesData)
// //     ? rolesData.map((role: any) => ({
// //       id: role.id || 0,
// //       name: role.name || '',
// //       description: role.description || '',
// //       type: role.type || 'ADMIN',
// //       permissions: role.permissions || [],
// //       _count: role._count || { users: 0 },
// //       createdAt: role.createdAt,
// //       updatedAt: role.updatedAt,
// //       toLowerCase: role.toLowerCase,
// //       email: role.email,
// //       data: role.data,
// //     }))
// //     : [];

// //   const safeAdminData = Array.isArray(adminsData) ? adminsData : [];

// //   const handleAdminCreated = (inviteUrl: string) => {
// //     setUrl(inviteUrl);
// //     setIsOpen(false);
// //     setShowInviteLink(true);
// //     refetchAdmins();
// //   };

// //   const handleCloseLinkDisplay = () => {
// //     setShowInviteLink(false);
// //     setUrl("");
// //   };

// //   const handlePageChange = (newPage: number) => {
// //     setPage(newPage);
// //   };

// //   const handleLimitChange = (newLimit: number) => {
// //     setLimit(newLimit);
// //     setPage(1); // Reset to first page when changing limit
// //   };

// //   const handleFilterChange = (newFilters: any) => {
// //     setFilters(newFilters);
// //     setPage(1); // Reset to first page when changing filters
// //   };

// //   return (
// //     <section>
// //       <Card className="bg-white mb-8">
// //         <CardContent className="p-4 flex justify-between items-center">
// //           <Header
// //             title="Admin Management"
// //             subtext="Manage administrator accounts and assign roles with appropriate permissions."
// //           />
// //           <Button
// //             variant="warning"
// //             className="font-bold text-base w-auto py-4 px-6"
// //             size="xl"
// //             onClick={() => setIsOpen(true)}
// //           >
// //             + Add new admin
// //           </Button>
// //         </CardContent>
// //       </Card>

// //       {showInviteLink && url && (
// //         <div className="mb-8">
// //           <InviteLinkDisplay url={url} onClose={handleCloseLinkDisplay} />
// //         </div>
// //       )}

// //       <Tabs defaultValue="admins" className="space-y-8">
// //         <TabsList>
// //           <TabsTrigger value="admins">Admins</TabsTrigger>
// //           <TabsTrigger value="pending">Pending Invitations</TabsTrigger>
// //         </TabsList>

// //         <TabsContent value="admins">
// //           {/* Role Cards */}
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
// //             {safeRolesData.map((role: RoleData) => (
// //               <RoleCard key={role.id} role={role as any} />
// //             ))}
// //           </div>

// //           {/* Admin Data Table */}
// //           <DataTable
// //             adminData={safeAdminData}
// //             loading={isAdminsLoading}
// //             refetch={refetchAdmins}
// //             totalItems={totalAdmins}
// //             currentPage={currentPage || page}
// //             totalPages={totalPages}
// //             onPageChange={handlePageChange}
// //             onLimitChange={handleLimitChange}
// //             onFilterChange={handleFilterChange}
// //             pageSize={limit}
// //           />
// //         </TabsContent>

// //         <TabsContent value="pending">
// //           <PendingInvitations />
// //         </TabsContent>
// //       </Tabs>

// //       <Dialog open={isOpen} onOpenChange={setIsOpen}>
// //         <DialogContent className="right-0 h-full w-1/2">
// //           <DialogHeader>
// //             <DialogTitle className="mb-6 text-2xl font-bold text-[#111827] flex gap-4.5 items-center">
// //               <div onClick={() => setIsOpen(false)} className="cursor-pointer">
// //                 <ChevronLeft size={24} />
// //               </div>
// //               Create new admin
// //             </DialogTitle>
// //           </DialogHeader>
// //           <CreateAdmin
// //             setUrl={handleAdminCreated}
// //             setClose={() => setIsOpen(false)}
// //           />
// //         </DialogContent>
// //       </Dialog>
// //     </section>
// //   );
// // }

// // "use client";

// // import React, { useState } from "react";
// // import Header from "@/app/(admin)/components/header";
// // import { Button } from "@/components/ui/button";
// // import { Card, CardContent } from "@/components/ui/card";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogHeader,
// //   DialogTitle,
// // } from "@/components/ui/dialog";
// // import { ChevronLeft } from "lucide-react";

// // import CreateAdmin from "./add-admin";
// // import RoleCard from "./role-card";
// // import DataTable from "./data-table";
// // import InviteLinkDisplay from "./invite-link-display";
// // import PendingInvitations from "./PendingInvitations";

// // import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// // // ✅ FIX: Update imports to use unified hooks
// // import { useGetAdminRoles, useGetAdmins } from "@/services/admin";

// // // ✅ FIX: Extended Role interface to match RoleData requirements
// // interface Role {
// //   id: number;
// //   name: string;
// //   description?: string;
// //   type?: string;
// //   permissions?: any[];
// //   // ✅ ADD: Additional properties that RoleCard expects
// //   _count?: {
// //     users: number;
// //   };
// //   createdAt?: string;
// //   updatedAt?: string;
// //   // ✅ ADD: These might be required by RoleData type
// //   toLowerCase?: () => string;
// //   email?: string;
// //   data?: any;
// // }

// // // ✅ ALTERNATIVE: Define a complete RoleData interface that matches what RoleCard expects
// // interface RoleData {
// //   id: number;
// //   name: string;
// //   description?: string;
// //   type?: string;
// //   permissions: any[];
// //   _count: {
// //     users: number;
// //   };
// //   createdAt?: string;
// //   updatedAt?: string;
// //   // Add any other properties that the RoleCard component expects
// //   toLowerCase?: () => string;
// //   email?: string;
// //   data?: any;
// // }

// // export default function Admins() {
// //   const [url, setUrl] = useState<string>("");
// //   const [isOpen, setIsOpen] = useState<boolean>(false);
// //   const [showInviteLink, setShowInviteLink] = useState<boolean>(false);

// //   // ✅ FIX: Use unified hooks
// //   const { rolesData, isRolesLoading } = useGetAdminRoles({ enabled: true });
// //   const { adminsData, isAdminsLoading, refetchAdmins } = useGetAdmins({ enabled: true });

// //   // ✅ FIX: Transform rolesData to match RoleData interface requirements
// //   const safeRolesData: RoleData[] = Array.isArray(rolesData)
// //     ? rolesData.map((role: any) => ({
// //       id: role.id || 0,
// //       name: role.name || '',
// //       description: role.description || '',
// //       type: role.type || 'ADMIN',
// //       permissions: role.permissions || [],
// //       _count: role._count || { users: 0 },
// //       createdAt: role.createdAt,
// //       updatedAt: role.updatedAt,
// //       // ✅ ADD: Provide fallbacks for any missing properties
// //       toLowerCase: role.toLowerCase,
// //       email: role.email,
// //       data: role.data,
// //     }))
// //     : [];

// //   const safeAdminData = Array.isArray(adminsData) ? adminsData : [];

// //   const handleAdminCreated = (inviteUrl: string) => {
// //     setUrl(inviteUrl);
// //     setIsOpen(false);
// //     setShowInviteLink(true);
// //     refetchAdmins();
// //   };

// //   const handleCloseLinkDisplay = () => {
// //     setShowInviteLink(false);
// //     setUrl("");
// //   };

// //   return (
// //     <section>
// //       <Card className="bg-white mb-8">
// //         <CardContent className="p-4 flex justify-between items-center">
// //           <Header
// //             title="Admin Management"
// //             subtext="Manage administrator accounts and assign roles with appropriate permissions."
// //           />
// //           <Button
// //             variant="warning"
// //             className="font-bold text-base w-auto py-4 px-6"
// //             size="xl"
// //             onClick={() => setIsOpen(true)}
// //           >
// //             + Add new admin
// //           </Button>
// //         </CardContent>
// //       </Card>

// //       {showInviteLink && url && (
// //         <div className="mb-8">
// //           <InviteLinkDisplay url={url} onClose={handleCloseLinkDisplay} />
// //         </div>
// //       )}

// //       <Tabs defaultValue="admins" className="space-y-8">
// //         <TabsList>
// //           <TabsTrigger value="admins">Admins</TabsTrigger>
// //           <TabsTrigger value="pending">Pending Invitations</TabsTrigger>
// //         </TabsList>

// //         <TabsContent value="admins">
// //           {/* Role Cards */}
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
// //             {safeRolesData.map((role: RoleData) => (
// //               <RoleCard key={role.id} role={role as any} />
// //             ))}
// //           </div>

// //           {/* Admin Data Table */}
// //           <DataTable
// //             adminData={safeAdminData}
// //             loading={isAdminsLoading}
// //             refetch={refetchAdmins}
// //           />
// //         </TabsContent>

// //         <TabsContent value="pending">
// //           <PendingInvitations />
// //         </TabsContent>
// //       </Tabs>

// //       <Dialog open={isOpen} onOpenChange={setIsOpen}>
// //         <DialogContent className="right-0 h-full w-1/2">
// //           <DialogHeader>
// //             <DialogTitle className="mb-6 text-2xl font-bold text-[#111827] flex gap-4.5 items-center">
// //               <div onClick={() => setIsOpen(false)} className="cursor-pointer">
// //                 <ChevronLeft size={24} />
// //               </div>
// //               Create new admin
// //             </DialogTitle>
// //           </DialogHeader>
// //           <CreateAdmin
// //             setUrl={handleAdminCreated}
// //             setClose={() => setIsOpen(false)}
// //           />
// //         </DialogContent>
// //       </Dialog>
// //     </section>
// //   );
// // }

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
// // import { useDeleteAdmin, useGetAdminRoles } from "@/services/admin";
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
// //   currentPage: number;
// //   totalPages: number;
// //   onPageChange: (page: number) => void;
// //   onPageSizeChange: (size: string) => void;
// // }

// // const DataTable: React.FC<DataTableProps> = ({
// //   adminData,
// //   loading,
// //   refetch,
// //   currentPage,
// //   totalPages,
// //   onPageChange,
// //   onPageSizeChange,
// // }) => {
// //   const pageSize = 10;
// //   const [roleFilter, setRoleFilter] = useState<string>("");
// //   const [statusFilter, setStatusFilter] = useState<string>("");
// //   const [nameFilter, setNameFilter] = useState<string>("");
// //   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
// //   const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);
// //   const [email, setEmail] = useState("");

// //   // Get roles data for filter dropdown
// //   const { rolesData, isRolesLoading } = useGetAdminRoles({ enabled: true });

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

// //   // Generate role list from rolesData
// //   const roleList = React.useMemo(() => {
// //     const baseList = [{ text: "All Roles", value: "select" }];
    
// //     if (!rolesData) return baseList;
    
// //     // Extract roles array from the response
// //     const rolesArray = Array.isArray(rolesData) 
// //       ? rolesData 
// //       : rolesData.data && Array.isArray(rolesData.data) 
// //         ? rolesData.data 
// //         : [];
    
// //     const roleOptions = rolesArray.map((role: any) => ({
// //       text: role.name.replace(/_/g, " ").replace(/\b\w/g, (l:any) => l.toUpperCase()),
// //       value: role.name
// //     }));
    
// //     return [...baseList, ...roleOptions];
// //   }, [rolesData]);

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
// //           onPageChange={onPageChange}
// //           totalPages={totalPages}
// //           cellRenderers={cellRenderers}
// //           columnOrder={columnOrder}
// //           columnLabels={columnLabels}
// //           isLoading={loading}
// //           onPageSizeChange={onPageSizeChange}
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

// "use client";
// import React, { useState, useEffect, useMemo } from "react";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   CalendarIcon,
//   DeleteIcon,
//   ViewIcon,
//   PersonIcon,
//   RepIcon,
// } from "../../../../../../public/icons";
// import { TableComponent } from "@/components/custom-table";
// import { SelectFilter } from "@/app/(admin)/components/select-filter";
// import { InputFilter } from "@/app/(admin)/components/input-filter";
// import Link from "next/link";
// import { ROUTES } from "@/constant/routes";
// import { toast } from "sonner";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { useDeleteAdmin } from "@/services/admin";
// import { Button } from "@/components/ui/button";
// import { Clock, CheckCircle } from "lucide-react";

// // Types
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
//   invitationStatus?: "COMPLETED" | "PENDING" | "EXPIRED" | "CANCELLED";
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
//   formattedRole: string;
//   formattedDate: string;
//   originalAdmin?: Admin;
//   invitationStatus?: "COMPLETED" | "PENDING" | "EXPIRED" | "CANCELLED";
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
//   onFilterChange: (filters: Record<string, any>) => void;
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
//   const [roleFilter, setRoleFilter] = useState("select");
//   const [statusFilter, setStatusFilter] = useState("select");
//   const [nameFilter, setNameFilter] = useState("");
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);
//   const [email, setEmail] = useState("");

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const storedEmail =
//         localStorage.getItem("userEmail") ||
//         sessionStorage.getItem("userEmail");
//       if (storedEmail) setEmail(storedEmail);
//     }
//   }, []);

//   const { deleteAdminPayload: deleteAdmin, deleteAdminIsLoading } =
//     useDeleteAdmin();

//   const safeAdminData = Array.isArray(adminData) ? adminData : [];

//   // 🔄 Send filters to parent (hook) whenever they change
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       const filters: Record<string, any> = {};
//       if (nameFilter) filters.search = nameFilter;
//       if (roleFilter !== "select") filters.role = roleFilter;
//       if (statusFilter !== "select") filters.status = statusFilter;
//       onFilterChange(filters);
//     }, 400);
//     return () => clearTimeout(timer);
//   }, [nameFilter, roleFilter, statusFilter, onFilterChange]);

//   // Build dropdown role list
//   const uniqueRoles = useMemo(() => {
//     const roles = new Set<string>();
//     safeAdminData.forEach((admin) => {
//       if (admin.role) roles.add(admin.role);
//     });
//     return Array.from(roles);
//   }, [safeAdminData]);

//   const roleList = useMemo(() => {
//     const roles = [
//       { text: "All Roles", value: "select" },
//       ...uniqueRoles.map((role) => ({
//         text: role === "SUPER_ADMIN" ? "Super Admin" : role.replace(/_/g, " "),
//         value: role,
//       })),
//     ];
//     return [roles[0], ...roles.slice(1).sort((a, b) => a.text.localeCompare(b.text))];
//   }, [uniqueRoles]);

//   const statusList = [
//     { text: "All Status", value: "select" },
//     { text: "Active", value: "active" },
//     { text: "Pending Invitation", value: "pending" },
//     { text: "Inactive", value: "inactive" },
//     { text: "Suspended", value: "suspended" },
//   ];

//   // Transform admin data → Table rows
//   const tableData = useMemo(() => {
//     return safeAdminData.map((admin) => {
//       const roleName = admin.role || "N/A";
//       const roleDescription =
//         roleName === "N/A"
//           ? "No role assigned"
//           : `${roleName.replace(/_/g, " ")} role`;

//       let accountStatus = "inactive";
//       if (admin.adminStatus) {
//         accountStatus = admin.adminStatus.toLowerCase();
//       } else if (admin.status) {
//         accountStatus = admin.status.toLowerCase();
//       } else if (admin.invitationStatus === "PENDING") {
//         accountStatus = "pending";
//       } else if (admin.invitationStatus === "COMPLETED") {
//         accountStatus = "active";
//       }

//       return {
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
//         formattedRole:
//           roleName === "SUPER_ADMIN"
//             ? "Super Admin"
//             : roleName.replace(/_/g, " "),
//         formattedDate: admin.createdAt
//           ? new Date(admin.createdAt).toLocaleDateString("en-US", {
//               day: "2-digit",
//               month: "short",
//               year: "numeric",
//             })
//           : "N/A",
//         originalAdmin: admin,
//         invitationStatus: admin.invitationStatus,
//       } as TableRowData;
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
//       toast.error(
//         error?.response?.data?.error || error?.message || "Failed to delete admin"
//       );
//     }
//   };

//   const openDeleteDialog = (admin: Admin) => {
//     setAdminToDelete(admin);
//     setDeleteDialogOpen(true);
//   };

//   // Column rendering
//   const cellRenderers = useMemo(
//     () => ({
//       name: (item: TableRowData) => (
//         <div className="flex flex-col gap-1 text-left">
//           <div className="font-medium text-slate-800">
//             {item.profile.fullName !== "N/A"
//               ? item.profile.fullName
//               : item.profile.username !== "N/A"
//               ? item.profile.username
//               : item.name}
//           </div>
//           <div className="text-sm text-slate-500">
//             {item.email !== "N/A" ? item.email : "No email"}
//           </div>
//         </div>
//       ),
//       role: (item: TableRowData) => (
//         <div className="font-medium flex items-center gap-3 capitalize">
//           {item.formattedRole.toLowerCase().includes("admin") ? (
//             <PersonIcon />
//           ) : (
//             <RepIcon />
//           )}
//           <span>{item.formattedRole}</span>
//         </div>
//       ),
//       description: (item: TableRowData) => (
//         <span className="font-medium">{item.description}</span>
//       ),
//       date: (item: TableRowData) => (
//         <div className="font-medium flex items-center gap-3">
//           <CalendarIcon />
//           <div>
//             <span>{item.formattedDate}</span>
//             {item.invitationStatus === "PENDING" && (
//               <span className="text-xs text-amber-600 flex items-center gap-1">
//                 <Clock className="w-3 h-3" />
//                 Invitation pending
//               </span>
//             )}
//           </div>
//         </div>
//       ),
//       status: (item: TableRowData) => {
//         const s = item.status?.toLowerCase();
//         let variant: "success" | "tertiary" | "warning" | "destructive" =
//           "warning";
//         let text = "UNKNOWN";
//         if (s === "active") {
//           variant = "success";
//           text = "ACTIVE";
//         } else if (s === "pending") {
//           variant = "tertiary";
//           text = "PENDING INVITE";
//         } else if (s === "suspended") {
//           variant = "destructive";
//           text = "SUSPENDED";
//         } else if (s === "inactive") {
//           variant = "warning";
//           text = "INACTIVE";
//         }
//         return (
//           <Badge variant={variant} className="py-1 px-[26px] font-medium">
//             {text}
//           </Badge>
//         );
//       },
//       action: (item: TableRowData) => (
//         <div className="flex gap-2.5">
//           <Link
//             href={`${ROUTES.ADMIN.SIDEBAR.ADMINS}/${item.id}?tab=general`}
//             className="bg-[#27A376] p-2.5 rounded-lg"
//           >
//             <ViewIcon />
//           </Link>
//           <button
//             onClick={() =>
//               item.originalAdmin && openDeleteDialog(item.originalAdmin)
//             }
//             className="bg-[#E03137] p-2.5 rounded-lg cursor-pointer"
//             aria-label="Delete admin"
//             disabled={item.originalAdmin?.email === email}
//           >
//             <DeleteIcon />
//           </button>
//         </div>
//       ),
//     }),
//     [email]
//   );

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
//         {/* Header */}
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

//         {/* Filters */}
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

//         {/* Table */}
//         <TableComponent<any>
//           tableData={tableData}
//           currentPage={currentPage}
//           onPageChange={onPageChange}
//           totalPages={totalPages}
//           totalItems={totalItems}
//           pageSize={pageSize}
//           onPageSizeChange={(value) => onLimitChange(Number(value))}
//           cellRenderers={cellRenderers}
//           columnOrder={columnOrder}
//           columnLabels={columnLabels}
//           isLoading={loading}
//         />
//       </CardContent>

//       {/* Delete confirmation */}
//       <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Confirm Admin Deletion</DialogTitle>
//             <DialogDescription>
//               Are you sure you want to delete{" "}
//               <span className="font-medium">
//                 {adminToDelete?.fullName ||
//                   adminToDelete?.username ||
//                   adminToDelete?.email ||
//                   "this admin"}
//               </span>
//               ? This will remove their role-based permissions and access. This
//               action cannot be undone.
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

import React, { useState } from "react";
import Header from "@/app/(admin)/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft } from "lucide-react";

import CreateAdmin from "./add-admin";
import RoleCard from "./role-card";
import DataTable from "./data-table";
import InviteLinkDisplay from "./invite-link-display";
import PendingInvitations from "./PendingInvitations";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// ✅ FIX: Update imports to use unified hooks
import { useGetAdminRoles, useGetAdmins } from "@/services/admin";

// ✅ FIX: Extended Role interface to match RoleData requirements
interface Role {
  id: number;
  name: string;
  description?: string;
  type?: string;
  permissions?: any[];
  // ✅ ADD: Additional properties that RoleCard expects
  _count?: {
    users: number;
  };
  createdAt?: string;
  updatedAt?: string;
  // ✅ ADD: These might be required by RoleData type
  toLowerCase?: () => string;
  email?: string;
  data?: any;
}

// ✅ ALTERNATIVE: Define a complete RoleData interface that matches what RoleCard expects
interface RoleData {
  id: number;
  name: string;
  description?: string;
  type?: string;
  permissions: any[];
  _count: {
    users: number;
  };
  createdAt?: string;
  updatedAt?: string;
  // Add any other properties that the RoleCard component expects
  toLowerCase?: () => string;
  email?: string;
  data?: any;
}

export default function Admins() {
  const [url, setUrl] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showInviteLink, setShowInviteLink] = useState<boolean>(false);

  // ✅ FIX: Use unified hooks
  const { rolesData, isRolesLoading } = useGetAdminRoles({ enabled: true });
  const { adminsData, isAdminsLoading, refetchAdmins } = useGetAdmins({ enabled: true });

  // ✅ FIX: Transform rolesData to match RoleData interface requirements
  const safeRolesData: RoleData[] = Array.isArray(rolesData)
    ? rolesData.map((role: any) => ({
      id: role.id || 0,
      name: role.name || '',
      description: role.description || '',
      type: role.type || 'ADMIN',
      permissions: role.permissions || [],
      _count: role._count || { users: 0 },
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
      // ✅ ADD: Provide fallbacks for any missing properties
      toLowerCase: role.toLowerCase,
      email: role.email,
      data: role.data,
    }))
    : [];

  const safeAdminData = Array.isArray(adminsData) ? adminsData : [];

  const handleAdminCreated = (inviteUrl: string) => {
    setUrl(inviteUrl);
    setIsOpen(false);
    setShowInviteLink(true);
    refetchAdmins();
  };

  const handleCloseLinkDisplay = () => {
    setShowInviteLink(false);
    setUrl("");
  };

  return (
    <section>
      <Card className="bg-white mb-8">
        <CardContent className="p-4 flex justify-between items-center">
          <Header
            title="Admin Management"
            subtext="Manage administrator accounts and assign roles with appropriate permissions."
          />
          <Button
            variant="warning"
            className="font-bold text-base w-auto py-4 px-6"
            size="xl"
            onClick={() => setIsOpen(true)}
          >
            + Add new admin
          </Button>
        </CardContent>
      </Card>

      {showInviteLink && url && (
        <div className="mb-8">
          <InviteLinkDisplay url={url} onClose={handleCloseLinkDisplay} />
        </div>
      )}

      <Tabs defaultValue="admins" className="space-y-8">
        <TabsList>
          <TabsTrigger value="admins">Admins</TabsTrigger>
          <TabsTrigger value="pending">Pending Invitations</TabsTrigger>
        </TabsList>

        <TabsContent value="admins">
          {/* Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
            {safeRolesData.map((role: RoleData) => (
              <RoleCard key={role.id} role={role as any} />
            ))}
          </div>

          {/* Admin Data Table */}
          <DataTable
            adminData={safeAdminData}
            loading={isAdminsLoading}
            refetch={refetchAdmins}
          />
        </TabsContent>

        <TabsContent value="pending">
          <PendingInvitations />
        </TabsContent>
      </Tabs>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="right-0 h-full w-1/2">
          <DialogHeader>
            <DialogTitle className="mb-6 text-2xl font-bold text-[#111827] flex gap-4.5 items-center">
              <div onClick={() => setIsOpen(false)} className="cursor-pointer">
                <ChevronLeft size={24} />
              </div>
              Create new admin
            </DialogTitle>
          </DialogHeader>
          <CreateAdmin
            setUrl={handleAdminCreated}
            setClose={() => setIsOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </section>
  );
}