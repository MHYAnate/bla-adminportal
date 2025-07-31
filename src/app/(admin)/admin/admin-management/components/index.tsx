"use client";
import React, { useState } from "react";
import Header from "@/app/(admin)/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DataTable from "./data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CreateAdmin from "./add-admin";
import { ChevronLeft } from "lucide-react";
import RoleCard from "./role-card";
import { useGetAdminRoles, useGetAdmins } from "@/services/admin/index";
import InviteLinkDisplay from "./invite-link-display";

export default function Admins() {
  const [url, setUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showInviteLink, setShowInviteLink] = useState(false);

  const { rolesData, isRolesLoading } = useGetAdminRoles({ enabled: true });
  const { adminsData, isAdminsLoading, refetchAdmins } = useGetAdmins({ enabled: true });

  console.log("rolesData:", rolesData);
  console.log("adminData:", adminsData);

  // ✅ FIXED: Remove .data property access since your hook returns array directly
  const safeRolesData = Array.isArray(rolesData) ? rolesData : [];
  const safeAdminData = Array.isArray(adminsData) ? adminsData : [];

  console.log("saferoledata", safeRolesData, "data", rolesData);
  console.log("saferAdmindata", safeAdminData, "data", adminsData);
  console.log("About to pass roles to CreateAdmin:", safeRolesData); // ✅ Added debug log

  // Handle successful admin creation
  const handleAdminCreated = (inviteUrl: any) => {
    setUrl(inviteUrl);
    setIsOpen(false);
    setShowInviteLink(true);
    refetchAdmins(); // ✅ Added: Refresh admin list after creation
  };

  // Handle closing the invite link display
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
            variant={"warning"}
            className="font-bold text-base w-auto py-4 px-6"
            size={"xl"}
            onClick={() => setIsOpen(true)}
          >
            + Add new admin
          </Button>
        </CardContent>
      </Card>

      {/* Enhanced Invite Link Display */}
      {showInviteLink && url && (
        <div className="mb-8">
          <InviteLinkDisplay
            url={url}
            onClose={handleCloseLinkDisplay}
          />
        </div>
      )}

      {/* Role cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
        {safeRolesData.map((role: any) => (
          <RoleCard key={role.id} role={role} />
        ))}
      </div>

      {/* Admin table */}
      <DataTable
        adminData={safeAdminData}
        loading={isAdminsLoading}
        refetch={refetchAdmins}
      />

      {/* Dialog modal */}
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
            roles={safeRolesData} // ✅ Now correctly passes the roles array
          />
        </DialogContent>
      </Dialog>
    </section>
  );
}