// // components/admin/PermissionsTab.tsx
// "use client";

// import { Switch } from '@/components/ui/switch';
// import { Button } from '@/components/ui/button';
// import { useEffect, useState } from 'react';
// import { toast } from 'sonner';
// import { useToggleAdminPermission } from '@/services/admin/permissions';
// import { useGetAdminRoles, useGetAdminPermissions } from '@/services/admin';

// interface Permission {
//   id: number;
//   name: string;
//   description?: string;
// }

// interface Role {
//   id: number;
//   name: string;
//   description?: string;
//   permissions?: Permission[];
// }

// interface UserRole {
//   id: number;
//   role?: Role;
// }

// interface AdminData {
//   id: number | string;
//   email?: string;
//   fullName?: string;
//   roles?: UserRole[];
//   status?: string;
// }

// export const PermissionsTab = ({ adminData }: { adminData: AdminData }) => {
//   console.log('=== PERMISSIONS TAB DEBUG ===');
//   console.log('adminData:', adminData);

//   const [isEditing, setIsEditing] = useState(false);
//   const [adminPermissions, setAdminPermissions] = useState<Set<number>>(new Set());

//   const { mutate: togglePermission, isPending } = useToggleAdminPermission(adminData.id);

//   const {
//     rolesData,
//     isRolesLoading: rolesLoading
//   } = useGetAdminRoles({ enabled: true });

//   const {
//     permissionsData,
//     isPermissionsLoading: permissionsLoading
//   } = useGetAdminPermissions({ enabled: true });

//   // Debug the data we're receiving
//   console.log('rolesData:', rolesData);
//   console.log('permissionsData:', permissionsData);
//   console.log('isRolesLoading:', rolesLoading);
//   console.log('isPermissionsLoading:', permissionsLoading);

//   const isLoading = rolesLoading || permissionsLoading || isPending;

//   // Fix: Properly extract the arrays from the API response
//   const rolesArray = rolesData?.data || [];
//   const permissionsArray = permissionsData?.data || [];

//   console.log('rolesArray after processing:', rolesArray);
//   console.log('permissionsArray after processing:', permissionsArray);
//   console.log('permissionsArray.length:', permissionsArray.length);
//   console.log('================================');

//   // Get current admin permissions from their roles
//   useEffect(() => {
//     console.log('useEffect triggered');
//     console.log('adminData?.roles:', adminData?.roles);
//     console.log('rolesArray:', rolesArray);

//     if (adminData?.roles && rolesArray && Array.isArray(rolesArray)) {
//       const currentPermissions = new Set<number>();

//       adminData.roles.forEach((userRole: UserRole) => {
//         console.log('Processing userRole:', userRole);

//         // Find the full role data
//         const fullRole = rolesArray.find((role: Role) =>
//           role.id === (userRole.role?.id || userRole.id)
//         );

//         console.log('Found fullRole:', fullRole);

//         if (fullRole?.permissions && Array.isArray(fullRole.permissions)) {
//           fullRole.permissions.forEach((perm: Permission) => {
//             currentPermissions.add(perm.id);
//             console.log('Added permission:', perm.name, perm.id);
//           });
//         }
//       });

//       console.log('Final currentPermissions:', Array.from(currentPermissions));
//       setAdminPermissions(currentPermissions);
//     }
//   }, [adminData, rolesArray]);

//   const handlePermissionToggle = async (permissionId: number) => {
//     if (!isEditing) return;

//     try {
//       await togglePermission(permissionId);

//       // Update local state optimistically
//       const newPermissions = new Set(adminPermissions);
//       if (newPermissions.has(permissionId)) {
//         newPermissions.delete(permissionId);
//       } else {
//         newPermissions.add(permissionId);
//       }
//       setAdminPermissions(newPermissions);
//     } catch (error) {
//       console.error('Failed to toggle permission:', error);
//     }
//   };

//   const hasPermission = (permissionId: number) => {
//     return adminPermissions.has(permissionId);
//   };

//   if (rolesLoading || permissionsLoading) {
//     return <div>Loading permissions...</div>;
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex justify-between items-center">
//         <h2 className="text-xl font-semibold">Permissions Management</h2>
//         <Button
//           onClick={() => setIsEditing(!isEditing)}
//           disabled={isLoading}
//           variant={isEditing ? "outline" : "default"}
//         >
//           {isEditing ? 'Done' : 'Edit Permissions'}
//         </Button>
//       </div>

//       {/* Debug info */}
//       <div className="p-4 bg-gray-100 rounded text-sm">
//         <p><strong>Debug Info:</strong></p>
//         <p>Permissions Array Length: {permissionsArray.length}</p>
//         <p>Is Loading: {isLoading.toString()}</p>
//         <p>Roles Loading: {rolesLoading.toString()}</p>
//         <p>Permissions Loading: {permissionsLoading.toString()}</p>
//         <p>Admin Permissions Count: {adminPermissions.size}</p>
//         <p>Admin Roles Count: {adminData?.roles?.length || 0}</p>
//       </div>

//       <div className="space-y-2">
//         {Array.isArray(permissionsArray) && permissionsArray.length > 0 ? (
//           permissionsArray.map((permission: Permission) => (
//             <div
//               key={permission.id}
//               className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               <div className="flex-1">
//                 <h3 className="font-medium">{permission.name}</h3>
//                 {permission.description && (
//                   <p className="text-sm text-gray-500">{permission.description}</p>
//                 )}
//               </div>
//               <Switch
//                 checked={hasPermission(permission.id)}
//                 onCheckedChange={() => handlePermissionToggle(permission.id)}
//                 disabled={!isEditing || isLoading}
//               />
//             </div>
//           ))
//         ) : (
//           <div className="text-center py-8 text-gray-500">
//             <p>No permissions available</p>
//             <p className="text-xs mt-2">
//               Raw permissions data: {JSON.stringify(permissionsData)}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

"use client";

import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useToggleAdminPermission } from '@/services/admin/permissions';
import { useGetAdminRoles, useGetAdminPermissions } from '@/services/admin';

interface Permission {
  id: number;
  name: string;
  description?: string;
  roles?: any[]; // For permissions that have role associations
}

interface Role {
  id: number;
  name: string;
  description?: string;
  permissions?: Permission[];
}

interface UserRole {
  id?: number;
  roleId?: number;
  role?: {
    id: number;
    name?: string;
  };
}

interface AdminData {
  id: number | string;
  email?: string;
  fullName?: string;
  roles?: UserRole[];
  status?: string;
}

export const PermissionsTab = ({ adminData }: { adminData: AdminData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [adminPermissions, setAdminPermissions] = useState<Set<number>>(new Set());

  const { mutate: togglePermission, isPending } = useToggleAdminPermission(adminData.id);

  const {
    rolesData,
    isRolesLoading: rolesLoading
  } = useGetAdminRoles({ enabled: true });

  const {
    permissionsData,
    isPermissionsLoading: permissionsLoading
  } = useGetAdminPermissions({ enabled: true });

  console.log('=== PERMISSIONS MATCHING DEBUG ===');
  console.log('adminData:', adminData);
  console.log('adminData.roles:', adminData?.roles);
  console.log('Raw rolesData:', rolesData);
  console.log('Raw permissionsData:', permissionsData);

  // Extract arrays from API responses
  let rolesArray: Role[] = [];
  let permissionsArray: Permission[] = [];

  if (rolesData) {
    if (Array.isArray(rolesData)) {
      rolesArray = rolesData;
    } else if (rolesData.data && Array.isArray(rolesData.data)) {
      rolesArray = rolesData.data;
    }
  }

  if (permissionsData) {
    if (Array.isArray(permissionsData)) {
      permissionsArray = permissionsData;
    } else if (permissionsData.data && Array.isArray(permissionsData.data)) {
      permissionsArray = permissionsData.data;
    } else if (permissionsData.success && permissionsData.data && Array.isArray(permissionsData.data)) {
      permissionsArray = permissionsData.data;
    }
  }

  console.log('Processed rolesArray:', rolesArray);
  console.log('Processed permissionsArray length:', permissionsArray.length);

  // Get permissions that belong to the admin's roles
  useEffect(() => {
    if (adminData?.roles && rolesArray.length > 0 && permissionsArray.length > 0) {
      const currentPermissions = new Set<number>();

      console.log('Processing admin roles...');

      adminData.roles.forEach((userRole: UserRole) => {
        console.log('Processing userRole:', userRole);

        // Get the role ID - handle different structures with proper typing
        let roleId: number | undefined;

        if (userRole.role?.id) {
          roleId = userRole.role.id;
        } else if (userRole.roleId) {
          roleId = userRole.roleId;
        } else if (userRole.id) {
          roleId = userRole.id;
        }

        console.log('Looking for role with ID:', roleId);

        if (roleId) {
          // Find the full role data from rolesArray
          const fullRole = rolesArray.find((role: Role) => role.id === roleId);
          console.log('Found full role:', fullRole);

          if (fullRole?.permissions && Array.isArray(fullRole.permissions)) {
            console.log('Role has permissions:', fullRole.permissions.length);
            fullRole.permissions.forEach((perm: Permission) => {
              currentPermissions.add(perm.id);
              console.log('Added permission from role:', perm.name, perm.id);
            });
          } else {
            // If role doesn't have permissions directly, check if we can match by role name
            console.log('Role has no direct permissions, checking permissionsArray for role matches...');

            // Check if permissions have role associations
            permissionsArray.forEach((perm: Permission) => {
              if (perm.roles && Array.isArray(perm.roles)) {
                const hasRole = perm.roles.some((permRole: any) => {
                  return permRole.id === roleId ||
                    permRole.name === fullRole?.name ||
                    permRole.role?.id === roleId;
                });

                if (hasRole) {
                  currentPermissions.add(perm.id);
                  console.log('Added permission by role association:', perm.name, perm.id);
                }
              }
            });
          }
        }
      });

      console.log('Final admin permissions:', Array.from(currentPermissions));
      setAdminPermissions(currentPermissions);
    }
  }, [adminData, rolesArray, permissionsArray]);

  const isLoading = rolesLoading || permissionsLoading || isPending;

  // Filter permissions to show only those the admin has access to
  const adminAccessiblePermissions = permissionsArray.filter((permission: Permission) =>
    adminPermissions.has(permission.id)
  );

  console.log('Admin accessible permissions:', adminAccessiblePermissions.length);
  console.log('================================');

  const handlePermissionToggle = async (permissionId: number) => {
    if (!isEditing) return;

    console.log('Toggling permission:', permissionId);

    try {
      await togglePermission(permissionId);

      // Update local state optimistically
      const newPermissions = new Set(adminPermissions);
      if (newPermissions.has(permissionId)) {
        newPermissions.delete(permissionId);
      } else {
        newPermissions.add(permissionId);
      }
      setAdminPermissions(newPermissions);

      toast.success('Permission updated successfully');
    } catch (error) {
      console.error('Failed to toggle permission:', error);
      toast.error('Failed to update permission');
    }
  };

  const hasPermission = (permissionId: number) => {
    return adminPermissions.has(permissionId);
  };

  if (rolesLoading || permissionsLoading) {
    return (
      <div className="p-4">
        <p>Loading permissions...</p>
        <p>Roles loading: {rolesLoading.toString()}</p>
        <p>Permissions loading: {permissionsLoading.toString()}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Permissions Management</h2>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          disabled={isLoading}
          variant={isEditing ? "outline" : "default"}
        >
          {isEditing ? 'Done' : 'Edit Permissions'}
        </Button>
      </div>

      {/* Debug info - Remove this later */}
      <div className="p-4 bg-yellow-100 rounded text-sm border">
        <p><strong>Debug Info:</strong></p>
        <p>Admin roles count: {adminData?.roles?.length || 0}</p>
        <p>Total permissions available: {permissionsArray.length}</p>
        <p>Admin accessible permissions: {adminAccessiblePermissions.length}</p>
        <p>Admin permission IDs: {Array.from(adminPermissions).join(', ')}</p>
        <p>Is editing: {isEditing.toString()}</p>
        <p>Is loading: {isLoading.toString()}</p>
      </div>

      {/* Show permissions based on admin's roles */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="font-medium">
            Role-based Permissions ({adminAccessiblePermissions.length})
          </p>
          {adminAccessiblePermissions.length > 0 && (
            <p className="text-sm text-gray-500">
              Based on assigned roles
            </p>
          )}
        </div>

        {adminAccessiblePermissions.length > 0 ? (
          adminAccessiblePermissions.map((permission: Permission) => (
            <div
              key={permission.id}
              className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{permission.name}</h3>
                {permission.description && (
                  <p className="text-sm text-gray-500">{permission.description}</p>
                )}
              </div>
              <div className="ml-4">
                <Switch
                  checked={hasPermission(permission.id)}
                  onCheckedChange={() => handlePermissionToggle(permission.id)}
                  disabled={!isEditing || isLoading}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 border border-dashed rounded-lg">
            <p>No permissions found for assigned roles</p>
            <p className="text-xs mt-2">
              Make sure the admin has roles assigned with permissions
            </p>
          </div>
        )}
      </div>

      {/* Option to show all permissions for comparison - Remove this later */}
      <details className="border rounded p-4">
        <summary className="cursor-pointer font-medium text-gray-700">
          Show All Available Permissions ({permissionsArray.length}) - Debug Only
        </summary>
        <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
          {permissionsArray.map((permission: Permission) => (
            <div key={permission.id} className="flex items-center gap-2 text-sm">
              <span className={`w-3 h-3 rounded-full ${hasPermission(permission.id) ? 'bg-green-500' : 'bg-gray-200'}`}></span>
              <span>{permission.name}</span>
              <span className="text-gray-500">({permission.id})</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
};