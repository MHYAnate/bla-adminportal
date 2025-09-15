
// "use client";

// import React, { useState } from "react";
// import Header from "@/app/(admin)/components/header";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { ChevronLeft } from "lucide-react";

// import CreateAdmin from "./add-admin";
// import RoleCard from "./role-card";
// import DataTable from "./data-table";
// import InviteLinkDisplay from "./invite-link-display";
// import PendingInvitations from "./PendingInvitations";

// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// // ✅ FIX: Update imports to use unified hooks
// import { useGetAdminRoles, useGetAdmins } from "@/services/admin";

// // ✅ FIX: Extended Role interface to match RoleData requirements
// interface Role {
//   id: number;
//   name: string;
//   description?: string;
//   type?: string;
//   permissions?: any[];
//   // ✅ ADD: Additional properties that RoleCard expects
//   _count?: {
//     users: number;
//   };
//   createdAt?: string;
//   updatedAt?: string;
//   // ✅ ADD: These might be required by RoleData type
//   toLowerCase?: () => string;
//   email?: string;
//   data?: any;
// }

// // ✅ ALTERNATIVE: Define a complete RoleData interface that matches what RoleCard expects
// interface RoleData {
//   id: number;
//   name: string;
//   description?: string;
//   type?: string;
//   permissions: any[];
//   _count: {
//     users: number;
//   };
//   createdAt?: string;
//   updatedAt?: string;
//   // Add any other properties that the RoleCard component expects
//   toLowerCase?: () => string;
//   email?: string;
//   data?: any;
// }

// export default function Admins() {
//   const [url, setUrl] = useState<string>("");
//   const [isOpen, setIsOpen] = useState<boolean>(false);
//   const [showInviteLink, setShowInviteLink] = useState<boolean>(false);

//   // ✅ FIX: Use unified hooks
//   const { rolesData, isRolesLoading } = useGetAdminRoles({ enabled: true });
//   const { adminsData, isAdminsLoading, refetchAdmins } = useGetAdmins({ enabled: true });

//   // ✅ FIX: Transform rolesData to match RoleData interface requirements
//   const safeRolesData: RoleData[] = Array.isArray(rolesData)
//     ? rolesData.map((role: any) => ({
//       id: role.id || 0,
//       name: role.name || '',
//       description: role.description || '',
//       type: role.type || 'ADMIN',
//       permissions: role.permissions || [],
//       _count: role._count || { users: 0 },
//       createdAt: role.createdAt,
//       updatedAt: role.updatedAt,
//       // ✅ ADD: Provide fallbacks for any missing properties
//       toLowerCase: role.toLowerCase,
//       email: role.email,
//       data: role.data,
//     }))
//     : [];

//   const safeAdminData = Array.isArray(adminsData) ? adminsData : [];

//   const handleAdminCreated = (inviteUrl: string) => {
//     setUrl(inviteUrl);
//     setIsOpen(false);
//     setShowInviteLink(true);
//     refetchAdmins();
//   };

//   const handleCloseLinkDisplay = () => {
//     setShowInviteLink(false);
//     setUrl("");
//   };

//   return (
//     <section>
//       <Card className="bg-white mb-8">
//         <CardContent className="p-4 flex justify-between items-center">
//           <Header
//             title="Admin Management"
//             subtext="Manage administrator accounts and assign roles with appropriate permissions."
//           />
//           <Button
//             variant="warning"
//             className="font-bold text-base w-auto py-4 px-6"
//             size="xl"
//             onClick={() => setIsOpen(true)}
//           >
//             + Add new admin
//           </Button>
//         </CardContent>
//       </Card>

//       {showInviteLink && url && (
//         <div className="mb-8">
//           <InviteLinkDisplay url={url} onClose={handleCloseLinkDisplay} />
//         </div>
//       )}

//       <Tabs defaultValue="admins" className="space-y-8">
//         <TabsList>
//           <TabsTrigger value="admins">Admins</TabsTrigger>
//           <TabsTrigger value="pending">Pending Invitations</TabsTrigger>
//         </TabsList>

//         <TabsContent value="admins">
//           {/* Role Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
//             {safeRolesData.map((role: RoleData) => (
//               <RoleCard key={role.id} role={role as any} />
//             ))}
//           </div>

//           {/* Admin Data Table */}
//           <DataTable
//             adminData={safeAdminData}
//             loading={isAdminsLoading}
//             refetch={refetchAdmins}
//           />
//         </TabsContent>

//         <TabsContent value="pending">
//           <PendingInvitations />
//         </TabsContent>
//       </Tabs>

//       <Dialog open={isOpen} onOpenChange={setIsOpen}>
//         <DialogContent className="right-0 h-full w-1/2">
//           <DialogHeader>
//             <DialogTitle className="mb-6 text-2xl font-bold text-[#111827] flex gap-4.5 items-center">
//               <div onClick={() => setIsOpen(false)} className="cursor-pointer">
//                 <ChevronLeft size={24} />
//               </div>
//               Create new admin
//             </DialogTitle>
//           </DialogHeader>
//           <CreateAdmin
//             setUrl={handleAdminCreated}
//             setClose={() => setIsOpen(false)}
//           />
//         </DialogContent>
//       </Dialog>
//     </section>
//   );
// }
"use client";

import React, { useState, useEffect } from "react";
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
import { useGetAdminRoles, useGetAdmins } from "@/services/admin";
import { useSearchParams, useRouter } from "next/navigation";
import AdminRolesDashboard from "./card";

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
  
  // ✅ NEW: URL state management for table filters
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // ✅ NEW: Initialize state from URL parameters
  const [currentPage, setCurrentPage] = useState(() => {
    const page = searchParams.get('page');
    return page ? parseInt(page) : 1;
  });
  
  const [filters, setFilters] = useState(() => ({
    roleFilter: searchParams.get('roleFilter') || "",
    statusFilter: searchParams.get('statusFilter') || "",
    nameFilter: searchParams.get('nameFilter') || "",
  }));

  // ✅ FIX: Use unified hooks
  const { rolesData, isRolesLoading } = useGetAdminRoles({ enabled: true });
  const { adminsData, isAdminsLoading, refetchAdmins } = useGetAdmins({ enabled: true });

  // ✅ NEW: Handle URL parameter changes
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (currentPage > 1) {
      params.set('page', currentPage.toString());
    }
    
    if (filters.roleFilter && filters.roleFilter !== "select") {
      params.set('roleFilter', filters.roleFilter);
    }
    
    if (filters.statusFilter && filters.statusFilter !== "select") {
      params.set('statusFilter', filters.statusFilter);
    }
    
    if (filters.nameFilter) {
      params.set('nameFilter', filters.nameFilter);
    }

    const newUrl = params.toString() 
      ? `/admin/admin-management?${params.toString()}`
      : '/admin/admin-management';
      
    // Only update URL if it's different from current
    if (window.location.pathname + (window.location.search || '') !== newUrl) {
      router.replace(newUrl);
    }
  }, [currentPage, filters, router]);

  // ✅ NEW: Restore state from sessionStorage on component mount
  useEffect(() => {
    const savedState = sessionStorage.getItem('adminTableState');
    if (savedState) {
      const state = JSON.parse(savedState);
      if (state.currentPage) setCurrentPage(state.currentPage);
      if (state.roleFilter || state.statusFilter || state.nameFilter) {
        setFilters({
          roleFilter: state.roleFilter || "",
          statusFilter: state.statusFilter || "",
          nameFilter: state.nameFilter || "",
        });
      }
    }
  }, []);

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

  // ✅ NEW: Handle page changes from table
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
            {safeRolesData.map((role: RoleData) => (
              <RoleCard key={role.id} role={role as any} />
            ))}
          </div> */}

          <AdminRolesDashboard/>

          {/* Admin Data Table with enhanced state management */}
          <DataTable
            adminData={safeAdminData}
            loading={isAdminsLoading}
            refetch={refetchAdmins}
            currentPage={currentPage}
            onPageChange={handlePageChange}
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