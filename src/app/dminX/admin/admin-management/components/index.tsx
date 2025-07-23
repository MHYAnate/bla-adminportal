// "use client";
// import React, { useState } from "react";
// import Header from "@/app/(admin)/components/header";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import DataTable from "./data-table";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import CreateAdmin from "./add-admin";
// import { ChevronLeft } from "lucide-react";
// import RoleCard from "./role-card";
// import { useGetAdminRoles, useGetAdmins } from "@/services/admin/index";
// import { RoleData } from "@/types";

// export default function Admins() {

//    const [url, setUrl]= useState("")
//    console.log(url, "check state invite url")

//   const [isOpen, setIsOpen] = useState<boolean>(false);
//   const { rolesData, isRolesLoading } = useGetAdminRoles({ enabled: true });
  

//  const{adminsData, isAdminsLoading,refetchAdmins }= useGetAdmins({ enabled: true });

//   // Debug: log to see what rolesData contains
//   console.log("rolesData:", rolesData);

//   console.log("adminData:", adminsData);

//   // Ensure rolesData is an array
//   const safeRolesData = Array.isArray(rolesData.data) ? rolesData.data : [];

//   console.log("saferoledata", safeRolesData, "data", rolesData);

//   const safeAdminData = Array.isArray(adminsData) ? adminsData : [];

//   console.log("saferAdmindata", safeAdminData, "data", adminsData);

//   return (
//     <section>
//       <Card className="bg-white mb-8">
//         <CardContent className="p-4 flex justify-between items-center">
//           <Header
//             title="Admin Management"
//             subtext="Manage administrator accounts and assign roles with appropriate permissions."
//           />
//           <Button
//             variant={"warning"}
//             className="font-bold text-base w-auto py-4 px-6"
//             size={"xl"}
//             onClick={() => setIsOpen(true)}
//           >
//             + Add new admin
//           </Button>
//         </CardContent>
//       </Card>
//       {url !== "" && (<div className="p-4 mb-8 bg-white rounded-lg shadow w-full max-w-md">
//   <h2 className="text-lg font-semibold mb-2">Copy Link</h2>
//   <div className="bg-gray-100 text-sm text-gray-700 px-3 py-2 rounded break-words w-full">
//    {url}
//   </div>
// </div>)}

//       {/* Role cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//         {safeRolesData.map((role: RoleData) => (
//           <RoleCard key={role.id} role={role} />
//         ))}
//       </div>

//       {/* Admin table */}
//       <DataTable adminData={safeAdminData} loading={isAdminsLoading} refetch={refetchAdmins}/>

//       {/* Dialog modal */}
//       <Dialog open={isOpen} onOpenChange={setIsOpen}>
//         <DialogContent className="right-[30px] p-8 max-w-[35.56rem]">
//           <DialogHeader>
//             <DialogTitle className="mb-6 text-2xl font-bold text-[#111827] flex gap-4.5 items-center">
//               <div onClick={() => setIsOpen(false)} className="cursor-pointer">
//                 <ChevronLeft size={24} />
//               </div>
//               Create new admin
//             </DialogTitle>
//           </DialogHeader>
//           <CreateAdmin setUrl={setUrl} setClose={() => setIsOpen(false)} roles={safeRolesData} />
//         </DialogContent>
//       </Dialog>
//     </section>
//   );
// }

// "use client";
// import React, { useState } from "react";
// import Header from "@/app/(admin)/components/header";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import DataTable from "./data-table";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import CreateAdmin from "./add-admin";
// import { ChevronLeft } from "lucide-react";
// import RoleCard from "./role-card";
// import { useGetAdminRoles, useGetAdmins } from "@/services/admin/index";
// import { RoleData } from "@/types";

// export default function Admins() {

//    const [url, setUrl]= useState("")
//    console.log(url, "check state invite url")

//   const [isOpen, setIsOpen] = useState<boolean>(false);
//   const { rolesData, isRolesLoading } = useGetAdminRoles({ enabled: true });
  

//  const{adminsData, isAdminsLoading,refetchAdmins }= useGetAdmins({ enabled: true });

//   // Debug: log to see what rolesData contains
//   console.log("rolesData:", rolesData);

//   console.log("adminData:", adminsData);

//   // Ensure rolesData is an array
//   const safeRolesData = Array.isArray(rolesData.data) ? rolesData.data : [];

//   console.log("saferoledata", safeRolesData, "data", rolesData);

//   const safeAdminData = Array.isArray(adminsData) ? adminsData : [];

//   console.log("saferAdmindata", safeAdminData, "data", adminsData);

//   return (
//     <section>
//       <Card className="bg-white mb-8">
//         <CardContent className="p-4 flex justify-between items-center">
//           <Header
//             title="Admin Management"
//             subtext="Manage administrator accounts and assign roles with appropriate permissions."
//           />
//           <Button
//             variant={"warning"}
//             className="font-bold text-base w-auto py-4 px-6"
//             size={"xl"}
//             onClick={() => setIsOpen(true)}
//           >
//             + Add new admin
//           </Button>
//         </CardContent>
//       </Card>
//       {url !== "" && (<div className="p-4 mb-8 bg-white rounded-lg shadow w-full max-w-md">
//   <h2 className="text-lg font-semibold mb-2">Copy Link</h2>
//   <div className="bg-gray-100 text-sm text-gray-700 px-3 py-2 rounded break-words w-full">
//    {url}
//   </div>
// </div>)}

//       {/* Role cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//         {safeRolesData.map((role: RoleData) => (
//           <RoleCard key={role.id} role={role} />
//         ))}
//       </div>

//       {/* Admin table */}
//       <DataTable adminData={safeAdminData} loading={isAdminsLoading} refetch={refetchAdmins}/>

//       {/* Dialog modal */}
//       <Dialog open={isOpen} onOpenChange={setIsOpen}>
//         <DialogContent className="right-[30px] p-8 max-w-[35.56rem]">
//           <DialogHeader>
//             <DialogTitle className="mb-6 text-2xl font-bold text-[#111827] flex gap-4.5 items-center">
//               <div onClick={() => setIsOpen(false)} className="cursor-pointer">
//                 <ChevronLeft size={24} />
//               </div>
//               Create new admin
//             </DialogTitle>
//           </DialogHeader>
//           <CreateAdmin setUrl={setUrl} setClose={() => setIsOpen(false)} roles={safeRolesData} />
//         </DialogContent>
//       </Dialog>
//     </section>
//   );
// }

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
import { RoleData } from "@/types";

export default function Admins() {

   const [url, setUrl]= useState("")
   console.log(url, "check state invite url")

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { rolesData, isRolesLoading } = useGetAdminRoles({ enabled: true });
  

 const{adminsData, isAdminsLoading,refetchAdmins }= useGetAdmins({ enabled: true });

  // Debug: log to see what rolesData contains
  console.log("rolesData:", rolesData);

  console.log("adminData:", adminsData);

  // Ensure rolesData is an array
  const safeRolesData = Array.isArray(rolesData.data) ? rolesData.data : [];

  console.log("saferoledata", safeRolesData, "data", rolesData);

  const safeAdminData = Array.isArray(adminsData) ? adminsData : [];

  console.log("saferAdmindata", safeAdminData, "data", adminsData);

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
      {url !== "" && (<div className="p-4 mb-8 bg-white rounded-lg shadow w-full max-w-md">
  <h2 className="text-lg font-semibold mb-2">Copy Link</h2>
  <div className="bg-gray-100 text-sm text-gray-700 px-3 py-2 rounded break-words w-full">
   {url}
  </div>
</div>)}

      {/* Role cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
        {safeRolesData.map((role: RoleData) => (
          <RoleCard key={role.id} role={role} />
        ))}
      </div>

      {/* Admin table */}
      <DataTable adminData={safeAdminData} loading={isAdminsLoading} refetch={refetchAdmins}/>

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
          <CreateAdmin setUrl={setUrl} setClose={() => setIsOpen(false)} roles={safeRolesData} />
        </DialogContent>
      </Dialog>
    </section>
  );
}