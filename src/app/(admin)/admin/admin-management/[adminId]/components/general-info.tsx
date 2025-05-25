import { HorizontalDots } from "../../../../../../../public/icons";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft } from "lucide-react";
import { useUpdateAdminRoles } from "@/services/admin/index";
import { toast } from "sonner";
import { AdminsData, RoleData } from "@/types";
import { useGetAdmins } from "@/services/admin";
import { useSearchParams } from 'next/navigation';

interface GeneralInfoProps {
  adminData: any;
  roles: RoleData[];
}

const GeneralInfo: React.FC<GeneralInfoProps> = ({ adminData, roles }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  
  const adminRoles = adminData?.roles || [];

  console.log("props role", roles, "inrole", adminRoles, "adminData", adminData);

     const[email, setEmail] = useState("");
  
     useEffect(() => {
      if (typeof window !== "undefined") {
        const email = localStorage.getItem("userEmail") || 
                     sessionStorage.getItem("userEmail");
        // Use the email
        setEmail(email? email : "")
      }
    }, []);
  
    const { adminsData, isAdminsLoading } = useGetAdmins({ enabled: true });
    const admin = adminsData?.find((admin: {email : string }) => admin.email === email);
  
    console.log(email, "email", adminsData, "data", admin, "filter" )
  
    //super_admin 
    // admin.roles.role.name !==super_admin
  
  const colors = [
    { bg: "#E7F7EF", color: "#0CAF60" },
    { bg: "#FFF6D3", color: "#E6BB20" },
    { bg: "#FFEDEC", color: "#E03137" },
    { bg: "#E6F0FF", color: "#2F78EE" },
  ];

  return (
    <>
      <div className="border border-[#F1F2F4] rounded-[1rem] p-6 mb-6">
        <h5 className="pb-4 mb-4 border-b border-[#F1F2F4] text-[#111827] font-semibold">
          Personal Info
        </h5>
        <div className="flex justify-between gap-[2rem] flex-col md:flex-row">
          <div className="w-full">
            <div className="flex justify-between mb-4">
              <p className="text-sm text-[#687588]">Full Name</p>
              <p className="text-sm text-[#111827] font-semibold">
                {adminData?.adminProfile?.fullName || "Not specified"}
              </p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-sm text-[#687588]">Email Address</p>
              <p className="text-sm text-[#111827] font-semibold">
                {adminData?.email || "Not specified"}
              </p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-sm text-[#687588]">Created On</p>
              <p className="text-sm text-[#111827] font-semibold">
                {adminData?.createdAt 
                  ? new Date(adminData.createdAt).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "Not specified"}
              </p>
            </div>
          </div>
          <div className="w-full">
            <div className="flex justify-between mb-4">
              <p className="text-sm text-[#687588]">Status</p>
              <p className="text-sm text-[#111827] font-semibold">
                {adminData?.status || "Active"}
              </p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-sm text-[#687588]">Last Login</p>
              <p className="text-sm text-[#111827] font-semibold">
                {adminData?.lastLogin 
                  ? new Date(adminData.lastLogin).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "Not available"}
              </p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-sm text-[#687588]">Phone Number</p>
              <p className="text-sm text-[#111827] font-semibold">
                {adminData?.adminProfile?.phone || "Not provided"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="border border-[#F1F2F4] rounded-[1rem] p-6">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#F1F2F4]">
          <h5 className="text-[#111827] font-semibold">Role</h5>
          <div className="flex gap-2">
            <Button 
            disabled={admin?.roles[0]?.role?.name !=="super_admin"}
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditDialogOpen(true)}
              className="px-4"
            >
              Edit Roles
            </Button>
            <Button variant="ghost" size="icon">
              <HorizontalDots />
            </Button>
          </div>
        </div>
        <div className="flex gap-[4rem] items-center flex-col md:flex-row">
          <div>
            <p className="text-sm text-[#687588]">Current Role(s)</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {adminRoles.length > 0 ? (
              adminRoles.map((role: any, index: number) => {
                const colorIndex = index % colors.length;
                const { bg, color } = colors[colorIndex];

                return (
                  <p
                    key={index}
                    className="text-xs font-medium py-2 px-2.5 rounded-[10px]"
                    style={{ backgroundColor: bg, color: color }}
                  >
                    {role?.name?.replace(/_/g, " ")}
                  </p>
                );
              })
            ) : (
              <p className="text-xs font-medium py-2 px-2.5 rounded-[10px] bg-gray-100 text-gray-500">
                No roles assigned
              </p>
            )}
          </div>
        </div>
      </div>

      {isEditDialogOpen && (
        <EditRolesDialog 
          adminData={adminData} 
          roles={roles} 
          onClose={() => setIsEditDialogOpen(false)} 
        />
      )}
    </>
  );
};

interface EditRolesDialogProps {
  adminData: any;
  roles: RoleData[];
  onClose: () => void;
}

const EditRolesDialog: React.FC<EditRolesDialogProps> = ({ adminData, roles, onClose }) => {
  const adminId = adminData?.id;
  const currentRoles = adminData?.roles?.map((role: any) => role.name) || [];
  const [selectedRoles, setSelectedRoles] = useState<string[]>(currentRoles);

  const { updateRolesPayload, updateRolesIsLoading } = useUpdateAdminRoles(() => {
    toast.success("Admin roles updated successfully");
    onClose();
  });

  const handleRoleToggle = (roleName: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleName)
        ? prev.filter((r) => r !== roleName)
        : [...prev, roleName]
    );
  };

  const handleSubmit = async () => {
    if (!adminId) return;
    try {
      await updateRolesPayload(adminId, selectedRoles);
    } catch (error) {
      toast.error("Failed to update roles");
      console.error("Update roles error:", error);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="right-[30px] p-8 max-w-[35.56rem]">
        <DialogHeader>
          <DialogTitle className="mb-6 text-2xl font-bold text-[#111827] flex gap-4.5 items-center">
            <div onClick={onClose} className="cursor-pointer">
              <ChevronLeft size={24} />
            </div>
            Edit Admin Roles
          </DialogTitle>
        </DialogHeader>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">
            Select roles for {adminData?.name || "this administrator"}
          </h3>

          {roles && roles.length > 0 ? (
            <div className="space-y-4">
              {roles.map((role) => (
                <div key={role.id} className="flex items-center space-x-3 p-3 border rounded-md">
                  <input
                    type="checkbox"
                    id={`role-${role.id}`}
                    className="h-5 w-5 rounded border-gray-300"
                    checked={selectedRoles.includes(role.name)}
                    onChange={() => handleRoleToggle(role.name)}
                  />
                  <div>
                    <label htmlFor={`role-${role.id}`} className="font-medium text-sm text-gray-900">
                      {role.name.replace(/_/g, " ")}
                    </label>
                    <p className="text-sm text-gray-500">{role.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-red-500">Failed to load roles</p>
          )}
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" className="px-6" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="warning"
            className="px-6"
            onClick={handleSubmit}
            disabled={updateRolesIsLoading}
          >
            {updateRolesIsLoading ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GeneralInfo;
