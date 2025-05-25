// "use client";

// import React from "react";
// import { useGetAdminRoles, useGetAdmins } from "@/services/admin/index";


// interface Props {
// 	id: any;
// }


// export default function Permit({ id }: Props) {

//     const { rolesData, isRolesLoading } = useGetAdminRoles({ enabled: true });

//       const{adminsData, isAdminsLoading}= useGetAdmins({ enabled: true });

//     const safeRolesData = Array.isArray(rolesData.data) ? rolesData.data : [];

//     const safeAdminData = Array.isArray(adminsData) ? adminsData : [];

//     const targetProfile = safeAdminData.find((profile) => profile.id === id);

//     const permit = targetProfile?.roles[0]?.role?.name;

//     const targetPermitName = safeRolesData.find((role : any) => role.name
//     === permit);

//     console.log(
//       Array.isArray(targetPermitName)
//         ? targetPermitName.map((a: any) => <div key={a.id}>{a.id}</div>)
//         : [],
//       "checker"
//     );


    
//     const targetPermitNumber =  targetPermitName?.permissions?.lenght;

//     console.log(safeRolesData, "T-RD");

//     console.log(safeAdminData, "T-AD");

//     console.log(targetProfile, "profile");

//     console.log(permit, "permit");
  
//     console.log(targetPermitName, "permitName");

  

// console.log(targetPermitNumber, "permitNumber");


// 	return (
// 		<div className="">
//       {isAdminsLoading || isRolesLoading ? 
//       <div> Loading </div>
//       :
//       <div>{targetPermitNumber}</div>}
// 		</div>
// 	);
// }

"use client";

import React from "react";
import { useGetAdminRoles, useGetAdmins } from "@/services/admin/index";

interface Props {
  id: any;
}

export default function Permit({ id }: Props) {
  const { rolesData, isRolesLoading } = useGetAdminRoles({ enabled: true });
  const { adminsData, isAdminsLoading } = useGetAdmins({ enabled: true });

  const safeRolesData = Array.isArray(rolesData.data) ? rolesData.data : [];
  const safeAdminData = Array.isArray(adminsData) ? adminsData : [];

  const targetProfile = safeRolesData.find((profile :any) => profile.id === id);
  const permit = targetProfile?.roles?.[0]?.role?.name;
  const targetPermitName = safeAdminData.find((role: any) => role.name === permit);
  const permissionCount = targetPermitName?.permissions?.length || 0;

  if (isAdminsLoading || isRolesLoading) {
    return <div>-</div>;
  }

  return <div>{permissionCount}</div>;
}
