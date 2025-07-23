// // "use client"

// // import type React from "react"

// // import { useState } from "react"
// // import { Button } from "@/components/ui/button"
// // import { Input } from "@/components/ui/input"
// // import { Textarea } from "@/components/ui/textarea"

// // interface CreateRoleFormProps {
// //   onCancel?: () => void
// //   onSubmit?: (data: { name: string; description: string }) => void
// // }

// // export default function CreateRoleForm({ onCancel, onSubmit }: CreateRoleFormProps) {
// //   const [formData, setFormData] = useState({
// //     name: "",
// //     description: "",
// //   })
// //   const [isSubmitting, setIsSubmitting] = useState(false)

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault()

// //     if (!formData.name.trim()) {
// //       return
// //     }

// //     setIsSubmitting(true)

// //     try {
// //       // Simulate API call
// //       await new Promise((resolve) => setTimeout(resolve, 1000))

// //       if (onSubmit) {
// //         onSubmit(formData)
// //       }

// //       // Reset form after successful submission
// //       setFormData({ name: "", description: "" })
// //     } catch (error) {
// //       console.error("Error creating role:", error)
// //     } finally {
// //       setIsSubmitting(false)
// //     }
// //   }

// //   const handleCancel = () => {
// //     setFormData({ name: "", description: "" })
// //     if (onCancel) {
// //       onCancel()
// //     }
// //   }

// //   return (
// //     <div className="max-w-2xl mx-auto p-6 bg-white">
// //       <div className="space-y-6">
// //         {/* Header */}
// //         <div>
// //           <h2 className="text-lg text-gray-600 font-normal">Add information about the role you're creating</h2>
// //         </div>

// //         {/* Form */}
// //         <form onSubmit={handleSubmit} className="space-y-6">
// //           {/* Role Name Field */}
// //           <div className="space-y-2">
// //             <label htmlFor="role-name" className="block text-sm font-medium text-gray-700">
// //               Role name <span className="text-red-500">*</span>
// //             </label>
// //             <Input
// //               id="role-name"
// //               type="text"
// //               placeholder="Role name"
// //               value={formData.name}
// //               onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
// //               required
// //               className="w-full"
// //             />
// //           </div>

// //           {/* Role Description Field */}
// //           <div className="space-y-2">
// //             <label htmlFor="role-description" className="block text-sm font-medium text-gray-700">
// //               Role Description
// //             </label>
// //             <Textarea
// //               id="role-description"
// //               placeholder="Describe the role you're creating"
// //               value={formData.description}
// //               onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
// //               rows={4}
// //               className="w-full resize-none"
// //             />
// //           </div>

// //           {/* Action Buttons */}
// //           <div className="flex justify-end space-x-3 pt-4">
// //             <Button
// //               type="button"
// //               variant="outline"
// //               onClick={handleCancel}
// //               disabled={isSubmitting}
// //               className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
// //             >
// //               Cancel
// //             </Button>
// //             <Button
// //               type="submit"
// //               disabled={!formData.name.trim() || isSubmitting}
// //               className="px-6 py-2 bg-orange-400 hover:bg-orange-500 text-white font-medium"
// //             >
// //               {isSubmitting ? "Creating..." : "Create"}
// //             </Button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   )
// // }

// "use client";

// import React, { useState, useEffect } from "react";
// import { useCreateAdminRole, useGetAdminPermissions } from "@/services/admin"; // Import your hooks
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
// import { toast } from "sonner";
// import { Separator } from "@/components/ui/separator";

// interface CreateRoleFormProps {
//   onCancel?: () => void;
//   onSuccess?: (newRole: any) => void; // Callback on successful creation
// }

// interface Permission {
//   id: number;
//   name: string;
//   description: string;
//   category: string;
// }

// export default function CreateRoleForm({ onCancel, onSuccess }: CreateRoleFormProps) {
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//   });
//   const [selectedPermissionIds, setSelectedPermissionIds] = useState<Set<number>>(new Set());
//   const [groupedPermissions, setGroupedPermissions] = useState<Record<string, Permission[]>>({});

//   // --- 1. Fetch all available permissions ---
//   const {  permissionsData: data, isPermissionsLoading: isLoading, isPermissionsLoading } = useGetAdminPermissions({ enabled: true });

//   // --- 2. Instantiate the creation hook ---
//   const { createRolePayload, createRoleIsLoading } = useCreateAdminRole(
//     (response: { message: any; data: any; }) => {
//       toast.success(response.message || "Role created successfully!");
//       if (onSuccess) {
//         onSuccess(response.data);
//       }
//       handleCancel(); // Reset form on success
//     }
//   );

//   // --- 3. Group permissions by category once they are fetched ---
//   useEffect(() => {
//     if (data) {
//       const grouped = data.reduce((acc: Record<string, Permission[]>, permission: Permission) => {
//         const category = permission.category || "General";
//         if (!acc[category]) {
//           acc[category] = [];
//         }
//         acc[category].push(permission);
//         return acc;
//       }, {});
//       setGroupedPermissions(grouped);
//     }
//   }, [data]);

//   // --- 4. Handle form submission ---
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData.name.trim()) {
//       toast.error("Role name is required.");
//       return;
//     }
//     if (selectedPermissionIds.size === 0) {
//       toast.error("At least one permission must be selected.");
//       return;
//     }

//     try {
//       await createRolePayload({
//         ...formData,
//         permissionIds: Array.from(selectedPermissionIds), // Convert Set to Array
//       });
//     } catch (error: any) {
//       toast.error(error.message || "Failed to create role. Please try again.");
//       console.error("Error creating role:", error);
//     }
//   };
  
//   // --- 5. Handle checkbox changes ---
//   const handlePermissionChange = (permissionId: number) => {
//     setSelectedPermissionIds((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(permissionId)) {
//         newSet.delete(permissionId);
//       } else {
//         newSet.add(permissionId);
//       }
//       return newSet;
//     });
//   };

//   const handleCancel = () => {
//     setFormData({ name: "", description: "" });
//     setSelectedPermissionIds(new Set());
//     if (onCancel) {
//       onCancel();
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg border">
//       <div className="space-y-8">
//         <div>
//           <h2 className="text-xl font-semibold text-gray-800">Create New Admin Role</h2>
//           <p className="text-gray-600 mt-1">Define a new role and assign the appropriate permissions.</p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* --- Role Details Section --- */}
//           <div className="p-6 border rounded-lg">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">Role Details</h3>
//             <div className="space-y-4">
//               <div>
//                 <label htmlFor="role-name" className="block text-sm font-medium text-gray-700">
//                   Role Name <span className="text-red-500">*</span>
//                 </label>
//                 <Input
//                   id="role-name"
//                   type="text"
//                   placeholder="e.g., Content Manager"
//                   value={formData.name}
//                   onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
//                   required
//                   className="w-full mt-1"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="role-description" className="block text-sm font-medium text-gray-700">
//                   Role Description
//                 </label>
//                 <Textarea
//                   id="role-description"
//                   placeholder="Briefly describe what this role is for."
//                   value={formData.description}
//                   onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
//                   rows={3}
//                   className="w-full mt-1 resize-none"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* --- Permissions Section --- */}
//           <div className="p-6 border rounded-lg">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">Assign Permissions</h3>
//             {isPermissionsLoading ? (
//               <p>Loading permissions...</p>
//             ) : (
//               <div className="space-y-6">
//                 {Object.entries(groupedPermissions).map(([category, permissions]) => (
//                   <div key={category}>
//                     <h4 className="text-md font-semibold text-gray-800 mb-3">{category}</h4>
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                       {permissions.map((permission) => (
//                         <div key={permission.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md">
//                           <Checkbox
//                             id={`perm-${permission.id}`}
//                             checked={selectedPermissionIds.has(permission.id)}
//                             onCheckedChange={() => handlePermissionChange(permission.id)}
//                             className="mt-1"
//                           />
//                           <div className="grid gap-1.5 leading-none">
//                             <label htmlFor={`perm-${permission.id}`} className="text-sm font-medium text-gray-700 cursor-pointer">
//                               {permission.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
//                             </label>
//                             {permission.description && (
//                               <p className="text-xs text-gray-500">{permission.description}</p>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                     <Separator className="mt-6" />
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* --- Action Buttons --- */}
//           <div className="flex justify-end space-x-3 pt-4">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={handleCancel}
//               disabled={createRoleIsLoading}
//               className="px-6 py-2"
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               disabled={!formData.name.trim() || createRoleIsLoading}
//               variant="warning"
//               className="px-6 py-2"
//             >
//               {createRoleIsLoading ? "Creating Role..." : "Create Role"}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// "use client";

// import React, { useState, useEffect } from "react";
// import { useCreateAdminRole, useGetAdminPermissions } from "@/services/admin"; // Import your hooks
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
// import { toast } from "sonner";
// import { Separator } from "@/components/ui/separator";

// interface CreateRoleFormProps {
//   onCancel?: () => void;
//   onSuccess?: (newRole: any) => void; // Callback on successful creation
// }

// interface Permission {
//   id: number;
//   name: string;
//   description: string;
//   category: string;
// }

// export default function CreateRoleForm({ onCancel, onSuccess }: CreateRoleFormProps) {
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//   });
//   const [selectedPermissionIds, setSelectedPermissionIds] = useState<Set<number>>(new Set());
//   const [groupedPermissions, setGroupedPermissions] = useState<Record<string, Permission[]>>({});

//   // --- 1. Fetch all available permissions ---
//   const { permissionsData, isPermissionsLoading } = useGetAdminPermissions({ enabled: true });

//   // --- 2. Instantiate the creation hook ---
//   const { createRolePayload, createRoleIsLoading } = useCreateAdminRole(
//     (response: { message: any; data: any; }) => {
//       toast.success(response.message || "Role created successfully!");
//       if (onSuccess) {
//         onSuccess(response.data);
//       }
//       handleCancel(); // Reset form on success
//     }
//   );

//   // --- 3. Group permissions by category once they are fetched ---
//   useEffect(() => {
//     if (permissionsData) {
//       const grouped = permissionsData.reduce((acc: Record<string, Permission[]>, permission: Permission) => {
//         const category = permission.category || "General";
//         if (!acc[category]) {
//           acc[category] = [];
//         }
//         acc[category].push(permission);
//         return acc;
//       }, {});
//       setGroupedPermissions(grouped);
//     }
//   }, [permissionsData]);

//   // --- 4. Handle form submission ---
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!formData.name.trim()) {
//       toast.error("Role name is required.");
//       return;
//     }
//     if (selectedPermissionIds.size === 0) {
//       toast.error("At least one permission must be selected.");
//       return;
//     }

//     try {
//       await createRolePayload({
//         ...formData,
//         permissionIds: Array.from(selectedPermissionIds), // Convert Set to Array
//       });
//     } catch (error: any) {
//       toast.error(error.message || "Failed to create role. Please try again.");
//       console.error("Error creating role:", error);
//     }
//   };
  
//   // --- 5. Handle checkbox changes ---
//   const handlePermissionChange = (permissionId: number) => {
//     setSelectedPermissionIds((prev) => {
//       const newSet = new Set(prev);
//       if (newSet.has(permissionId)) {
//         newSet.delete(permissionId);
//       } else {
//         newSet.add(permissionId);
//       }
//       return newSet;
//     });
//   };

//   const handleCancel = () => {
//     setFormData({ name: "", description: "" });
//     setSelectedPermissionIds(new Set());
//     if (onCancel) {
//       onCancel();
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg border">
//       <div className="space-y-8">
//         <div>
//           <h2 className="text-xl font-semibold text-gray-800">Create New Admin Role</h2>
//           <p className="text-gray-600 mt-1">Define a new role and assign the appropriate permissions.</p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* --- Role Details Section --- */}
//           <div className="p-6 border rounded-lg">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">Role Details</h3>
//             <div className="space-y-4">
//               <div>
//                 <label htmlFor="role-name" className="block text-sm font-medium text-gray-700">
//                   Role Name <span className="text-red-500">*</span>
//                 </label>
//                 <Input
//                   id="role-name"
//                   type="text"
//                   placeholder="e.g., Content Manager"
//                   value={formData.name}
//                   onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
//                   required
//                   className="w-full mt-1"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="role-description" className="block text-sm font-medium text-gray-700">
//                   Role Description
//                 </label>
//                 <Textarea
//                   id="role-description"
//                   placeholder="Briefly describe what this role is for."
//                   value={formData.description}
//                   onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
//                   rows={3}
//                   className="w-full mt-1 resize-none"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* --- Permissions Section --- */}
//           <div className="p-6 border rounded-lg">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">Assign Permissions</h3>
//             {isPermissionsLoading ? (
//               <p>Loading permissions...</p>
//             ) : (
//               <div className="space-y-6">
//                 {Object.entries(groupedPermissions).map(([category, permissions]) => (
//                   <div key={category}>
//                     <h4 className="text-md font-semibold text-gray-800 mb-3">{category}</h4>
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                       {permissions.map((permission) => (
//                         <div key={permission.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md">
//                           <Checkbox
//                             id={`perm-${permission.id}`}
//                             checked={selectedPermissionIds.has(permission.id)}
//                             onCheckedChange={() => handlePermissionChange(permission.id)}
//                             className="mt-1"
//                           />
//                           <div className="grid gap-1.5 leading-none">
//                             <label htmlFor={`perm-${permission.id}`} className="text-sm font-medium text-gray-700 cursor-pointer">
//                               {permission.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
//                             </label>
//                             {permission.description && (
//                               <p className="text-xs text-gray-500">{permission.description}</p>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                     <Separator className="mt-6" />
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* --- Action Buttons --- */}
//           <div className="flex justify-end space-x-3 pt-4">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={handleCancel}
//               disabled={createRoleIsLoading}
//               className="px-6 py-2"
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               disabled={!formData.name.trim() || createRoleIsLoading}
//               variant="warning"
//               className="px-6 py-2"
//             >
//               {createRoleIsLoading ? "Creating Role..." : "Create Role"}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import { useCreateAdminRole, useGetAdminPermissions } from "@/services/admin"; // Import your hooks
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";



interface Permission {
  id: number;
  name: string;
  description: string;
  category: string;
}

export default function CreateRoleForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<Set<number>>(new Set());
  const [groupedPermissions, setGroupedPermissions] = useState<Record<string, Permission[]>>({});

  // --- 1. Fetch all available permissions ---
  const { permissionsData, isPermissionsLoading } = useGetAdminPermissions({ enabled: true });

  // --- 2. Instantiate the creation hook ---
  const { createRolePayload, createRoleIsLoading } = useCreateAdminRole(
    (response: { message: any; data: any; }) => {
      toast.success(response.message || "Role created successfully!");
      // if (onSuccess) {
      //   // onSuccess(response.data);
      // }
      handleCancel(); // Reset form on success
    }
  );

  // --- 3. Group permissions by category once they are fetched (FIXED LOGIC) ---
  useEffect(() => {
    // The error suggests `permissionsData` might not be an array directly.
    // It could be the parent object like { data: [...], pagination: {...} }.
    // This code now safely finds the array.
    const permissionsArray = Array.isArray(permissionsData)
      ? permissionsData
      : permissionsData?.data;

    // We must verify we have an array before calling .reduce()
    if (Array.isArray(permissionsArray)) {
      const grouped = permissionsArray.reduce((acc: Record<string, Permission[]>, permission: Permission) => {
        const category = permission.category || "General";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(permission);
        return acc;
      }, {});
      setGroupedPermissions(grouped);
    } else if (permissionsData && !isPermissionsLoading) {
        // If data has loaded but we still couldn't find an array, log it for debugging.
        console.error("Debug: `permissionsData` is not an array and does not contain a `data` property with an array. Value received:", permissionsData);
    }
  }, [permissionsData, isPermissionsLoading]);


  // --- 4. Handle form submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Role name is required.");
      return;
    }
    if (selectedPermissionIds.size === 0) {
      toast.error("At least one permission must be selected.");
      return;
    }

    try {
      await createRolePayload({
        ...formData,
        permissionIds: Array.from(selectedPermissionIds), // Convert Set to Array
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to create role. Please try again.");
      console.error("Error creating role:", error);
    }
  };
  
  // --- 5. Handle checkbox changes ---
  const handlePermissionChange = (permissionId: number) => {
    setSelectedPermissionIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(permissionId)) {
        newSet.delete(permissionId);
      } else {
        newSet.add(permissionId);
      }
      return newSet;
    });
  };

  const handleCancel = () => {
    setFormData({ name: "", description: "" });
    setSelectedPermissionIds(new Set());
    // if (onCancel) {
    //   onCancel();
    // }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg border">
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Create New Admin Role</h2>
          <p className="text-gray-600 mt-1">Define a new role and assign the appropriate permissions.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* --- Role Details Section --- */}
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Role Details</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="role-name" className="block text-sm font-medium text-gray-700">
                  Role Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="role-name"
                  type="text"
                  placeholder="e.g., Content Manager"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full mt-1"
                />
              </div>
              <div>
                <label htmlFor="role-description" className="block text-sm font-medium text-gray-700">
                  Role Description
                </label>
                <Textarea
                  id="role-description"
                  placeholder="Briefly describe what this role is for."
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full mt-1 resize-none"
                />
              </div>
            </div>
          </div>

          {/* --- Permissions Section --- */}
          <div className="p-6 border rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Assign Permissions</h3>
            {isPermissionsLoading ? (
              <p>Loading permissions...</p>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedPermissions).map(([category, permissions]) => (
                  <div key={category}>
                    <h4 className="text-md font-semibold text-gray-800 mb-3">{category}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md">
                          <Checkbox
                            id={`perm-${permission.id}`}
                            checked={selectedPermissionIds.has(permission.id)}
                            onCheckedChange={() => handlePermissionChange(permission.id)}
                            className="mt-1"
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label htmlFor={`perm-${permission.id}`} className="text-sm font-medium text-gray-700 cursor-pointer">
                              {permission.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </label>
                            {permission.description && (
                              <p className="text-xs text-gray-500">{permission.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <Separator className="mt-6" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* --- Action Buttons --- */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={createRoleIsLoading}
              className="px-6 py-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.name.trim() || createRoleIsLoading}
              variant="warning"
              className="px-6 py-2"
            >
              {createRoleIsLoading ? "Creating Role..." : "Create Role"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}