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
        <DialogContent className="right-[30px] p-8 max-w-[35.56rem]">
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