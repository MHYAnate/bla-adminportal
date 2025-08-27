// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { toast } from "sonner";
// import { RESOLUTION_CHANNELS } from "../constants/support-constants";
// import type { SupportRequest, TrackingUpdateData, Admin } from "../types/support-types";

// const updateTrackingSchema = z.object({
//   assignedAdminId: z.string().optional(),
//   resolutionChannel: z.enum(["CALL", "EMAIL", "CHAT", "IN_PERSON"]).optional(),
//   internalNotes: z.string().min(1, "Internal notes are required"),
// });

// interface TrackingUpdateFormProps {
//   supportRequest: SupportRequest;
//   admins: Admin[];
//   onUpdate: (data: TrackingUpdateData) => Promise<void>;
//   isLoading: boolean;
// }

// const TrackingUpdateForm: React.FC<TrackingUpdateFormProps> = ({
//   supportRequest,
//   admins,
//   onUpdate,
//   isLoading
// }) => {
//   const form = useForm({
//     resolver: zodResolver(updateTrackingSchema),
//     defaultValues: {
//       assignedAdminId: supportRequest.assignedAdminId?.toString() || "",
//       resolutionChannel: supportRequest.resolutionChannel || "",
//       internalNotes: "",
//     },
//   });

//   const onSubmit = async (data: z.infer<typeof updateTrackingSchema>) => {
//     try {
//       await onUpdate({
//         assignedAdminId: data.assignedAdminId && data.assignedAdminId !== "unassigned" 
//           ? parseInt(data.assignedAdminId) 
//           : undefined,
//         resolutionChannel: data.resolutionChannel,
//         internalNotes: data.internalNotes,
//       });

//       toast.success("Support tracking information updated successfully");
      
//       // Reset internal notes field after successful update
//       form.setValue("internalNotes", "");
//     } catch (error: any) {
//       console.error("Error updating support tracking:", error);
//       toast.error(error?.message || "Failed to update support tracking information");
//     }
//   };

//   return (
//     <div className="bg-white border border-gray-200 p-4 rounded-lg">
//       <h3 className="text-lg font-semibold mb-4">Support Tracking Information</h3>

//       {/* Current Tracking Info */}
//       <div className="bg-gray-50 p-3 rounded mb-4">
//         <h4 className="font-medium mb-2">Current Assignment</h4>
//         <div className="grid grid-cols-2 gap-4 text-sm">
//           <div>
//             <span className="font-medium">Assigned Admin:</span>
//             <span className="ml-2">
//               {supportRequest.assignedAdmin?.name || 
//                supportRequest.assignedAdmin?.profile?.fullName || 
//                "Unassigned"}
//             </span>
//           </div>
//           <div>
//             <span className="font-medium">Resolution Channel:</span>
//             <span className="ml-2">
//               {supportRequest.resolutionChannel || "Not set"}
//             </span>
//           </div>
//         </div>
//         {supportRequest.internalNotes && (
//           <div className="mt-2">
//             <span className="font-medium">Current Internal Notes:</span>
//             <p className="text-sm mt-1 p-2 bg-white rounded border">
//               {supportRequest.internalNotes}
//             </p>
//           </div>
//         )}
//       </div>

//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4">
//           <FormField
//             control={form.control}
//             name="assignedAdminId"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Assign to Admin</FormLabel>
//                 <Select onValueChange={field.onChange} defaultValue={field.value}>
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select admin" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     <SelectItem value="unassigned">Unassigned</SelectItem>
//                     {admins.map((admin) => (
//                       <SelectItem key={admin.id} value={admin.id.toString()}>
//                         {admin.fullName} ({admin.role})
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="resolutionChannel"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Resolution Channel</FormLabel>
//                 <Select onValueChange={field.onChange} defaultValue={field.value}>
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select channel" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     {RESOLUTION_CHANNELS.map((channel:any) => (
//                       <SelectItem key={channel.value} value={channel.value}>
//                         {channel.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="internalNotes"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Internal Notes *</FormLabel>
//                 <FormControl>
//                   <Textarea
//                     placeholder="Add internal notes (required for status updates)..."
//                     className="min-h-[120px]"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <Button type="submit" disabled={isLoading} className="w-full">
//             {isLoading ? "Updating..." : "Update Tracking Info"}
//           </Button>
//         </form>
//       </Form>
//     </div>
//   );
// };

// export default TrackingUpdateForm;

// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { toast } from "sonner";
// import { RESOLUTION_CHANNELS } from "../constants/support-constants";
// import type { SupportRequest, TrackingUpdateData, Admin } from "../types/support-types";

// const updateTrackingSchema = z.object({
//   assignedAdminId: z.string().optional(),
//   resolutionChannel: z.enum(["CALL", "EMAIL", "CHAT", "IN_PERSON"]).optional(),
//   internalNotes: z.string().min(1, "Internal notes are required"),
// });

// interface TrackingUpdateFormProps {
//   supportRequest: SupportRequest;
//   admins: Admin[];
//   onUpdate: (data: TrackingUpdateData) => Promise<void>;
//   isLoading: boolean;
// }

// const TrackingUpdateForm: React.FC<TrackingUpdateFormProps> = ({
//   supportRequest,
//   admins,
//   onUpdate,
//   isLoading
// }) => {
//   const form = useForm({
//     resolver: zodResolver(updateTrackingSchema),
//     defaultValues: {
//       assignedAdminId: supportRequest.assignedAdminId?.toString() || "",
//       resolutionChannel: supportRequest.resolutionChannel || "",
//       internalNotes: "",
//     },
//   });

//   const onSubmit = async (data: z.infer<typeof updateTrackingSchema>) => {
//     try {
//       // Prepare the data payload to match backend controller expectations
//       // const payload = {
//       //   assignedAdminId: data.assignedAdminId && data.assignedAdminId !== "unassigned" 
//       //     ? parseInt(data.assignedAdminId) 
//       //     : null, // Send null instead of undefined for unassignment
//       //   resolutionChannel: data.resolutionChannel || null,
//       //   internalNotes: data.internalNotes.trim(),
//       // };

//       const payload: TrackingUpdateData = {
//         assignedAdminId:
//           data.assignedAdminId && data.assignedAdminId !== "unassigned"
//             ? parseInt(data.assignedAdminId)
//             : null, // null is okay here if TrackingUpdateData allows it
      
//         resolutionChannel: data.resolutionChannel || undefined, // ✅ use undefined instead of null
      
//         internalNotes: data.internalNotes.trim(),
//       };
      

//       console.log("Sending tracking update payload:", payload);

//       await onUpdate({
//         ...payload
//       });

//       toast.success("Support tracking information updated successfully");
      
//       // Reset internal notes field after successful update
//       form.setValue("internalNotes", "");
//     } catch (error: any) {
//       console.error("Error updating support tracking:", error);
//       toast.error(error?.message || "Failed to update support tracking information");
//     }
//   };

//   return (
//     <div className="bg-white border border-gray-200 p-4 rounded-lg">
//       <h3 className="text-lg font-semibold mb-4">Support Tracking Information</h3>

//       {/* Current Tracking Info */}
//       <div className="bg-gray-50 p-3 rounded mb-4">
//         <h4 className="font-medium mb-2">Current Assignment</h4>
//         <div className="grid grid-cols-2 gap-4 text-sm">
//           <div>
//             <span className="font-medium">Assigned Admin:</span>
//             <span className="ml-2">
//               {supportRequest.assignedAdmin?.name || 
//                supportRequest.assignedAdmin?.profile?.fullName || 
//                "Unassigned"}
//             </span>
//           </div>
//           <div>
//             <span className="font-medium">Resolution Channel:</span>
//             <span className="ml-2">
//               {supportRequest.resolutionChannel || "Not set"}
//             </span>
//           </div>
//         </div>
//         {supportRequest.internalNotes && (
//           <div className="mt-2">
//             <span className="font-medium">Current Internal Notes:</span>
//             <p className="text-sm mt-1 p-2 bg-white rounded border">
//               {supportRequest.internalNotes}
//             </p>
//           </div>
//         )}
//       </div>

//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4">
//           <FormField
//             control={form.control}
//             name="assignedAdminId"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Assign to Admin</FormLabel>
//                 <Select onValueChange={field.onChange} defaultValue={field.value}>
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select admin" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     <SelectItem value="unassigned">Unassigned</SelectItem>
//                     {admins.map((admin) => (
//                       <SelectItem key={admin.id} value={admin.id.toString()}>
//                         {admin.fullName} ({admin.role})
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="resolutionChannel"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Resolution Channel</FormLabel>
//                 <Select onValueChange={field.onChange} defaultValue={field.value}>
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select channel" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     {RESOLUTION_CHANNELS.map((channel) => (
//                       <SelectItem key={channel.value} value={channel.value}>
//                         {channel.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="internalNotes"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Internal Notes *</FormLabel>
//                 <FormControl>
//                   <Textarea
//                     placeholder="Add internal notes (required for status updates)..."
//                     className="min-h-[120px]"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <Button type="submit" disabled={isLoading} className="w-full">
//             {isLoading ? "Updating..." : "Update Tracking Info"}
//           </Button>
//         </form>
//       </Form>
//     </div>
//   );
// };

// export default TrackingUpdateForm;

"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { RESOLUTION_CHANNELS } from "../constants/support-constants";
import type { SupportRequest, TrackingUpdateData, Admin } from "../types/support-types";

// const updateTrackingSchema = z.object({
//   assignedAdminId: z.string().optional(),
//   resolutionChannel: z.enum(["CALL", "EMAIL", "CHAT", "IN_PERSON"]).optional(),
//   internalNotes: z.string().min(1, "Internal notes are required"),
// });

const updateTrackingSchema = z.object({
  assignedAdminId: z
    .string()
    .transform((val) =>
      val === "unassigned" || val === "" ? undefined : parseInt(val, 10)
    )
    .optional(),
  resolutionChannel: z.enum(["CALL", "EMAIL", "CHAT", "IN_PERSON"]).optional(),
  internalNotes: z.string().min(1, "Internal notes are required"),
});


interface TrackingUpdateFormProps {
  supportRequest: SupportRequest;
  admins: Admin[];
  onUpdate: (data: TrackingUpdateData) => Promise<void>;
  isLoading: boolean;
}

const TrackingUpdateForm: React.FC<TrackingUpdateFormProps> = ({
  supportRequest,
  admins,
  onUpdate,
  isLoading
}) => {
  const form = useForm({
    resolver: zodResolver(updateTrackingSchema),
    defaultValues: {
      assignedAdminId: supportRequest.assignedAdminId?.toString() || "",
      resolutionChannel: supportRequest.resolutionChannel || "",
      internalNotes: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof updateTrackingSchema>) => {
    try {
      const payload: TrackingUpdateData = {
        resolutionChannel: data.resolutionChannel,
        internalNotes: data.internalNotes.trim(),
      };
  
      // Only include assignedAdminId if it's a valid number
      if (typeof data.assignedAdminId === "number") {
        payload.assignedAdminId = data.assignedAdminId;
      }
  
      console.log("Sending tracking update payload:", payload);
  
      await onUpdate(payload);
  
      toast.success("Support tracking information updated successfully");
  
      form.setValue("internalNotes", "");
    } catch (error: any) {
      console.error("Error updating support tracking:", error);
      toast.error(error?.message || "Failed to update support tracking information");
    }
  };
  // const onSubmit = async (data: z.infer<typeof updateTrackingSchema>) => {
  //   try {
  //     // Prepare the data payload to match backend controller expectations
  //     // The controller uses conditional spread, so we need to send actual values or omit them
  //     const payload: any = {};
      
  //     // Only include assignedAdminId if it's a valid number (not "unassigned")
  //     if (data.assignedAdminId && data.assignedAdminId !== "unassigned") {
  //       payload.assignedAdminId = data.assignedAdminId;
  //     }
      
  //     // Only include resolutionChannel if it's selected
  //     if (data.resolutionChannel) {
  //       payload.resolutionChannel = data.resolutionChannel;
  //     }
      
  //     // Always include internalNotes since it's required
  //     if (data.internalNotes && data.internalNotes.trim()) {
  //       payload.internalNotes = data.internalNotes.trim();
  //     }

  //     console.log("Sending tracking update payload:", payload);

  //     await onUpdate(payload);

  //     toast.success("Support tracking information updated successfully");
      
  //     // Reset internal notes field after successful update
  //     form.setValue("internalNotes", "");
  //   } catch (error: any) {
  //     console.error("Error updating support tracking:", error);
  //     toast.error(error?.message || "Failed to update support tracking information");
  //   }
  // };

  return (
    <div className="bg-white border border-gray-200 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Support Tracking Information</h3>

      {/* Current Tracking Info */}
      <div className="bg-gray-50 p-3 rounded mb-4">
        <h4 className="font-medium mb-2">Current Assignment</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Assigned Admin:</span>
            <span className="ml-2">
              {supportRequest.assignedAdmin?.name || 
               supportRequest.assignedAdmin?.profile?.fullName || 
               "Unassigned"}
            </span>
          </div>
          <div>
            <span className="font-medium">Resolution Channel:</span>
            <span className="ml-2">
              {supportRequest.resolutionChannel || "Not set"}
            </span>
          </div>
        </div>
        {supportRequest.internalNotes && (
          <div className="mt-2">
            <span className="font-medium">Current Internal Notes:</span>
            <p className="text-sm mt-1 p-2 bg-white rounded border">
              {supportRequest.internalNotes}
            </p>
          </div>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4">
          <FormField
            control={form.control}
            name="assignedAdminId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assign to Admin</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select admin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {admins.map((admin) => (
                      <SelectItem key={admin.id} value={admin.id.toString()}>
                        {admin.fullName} ({admin.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="resolutionChannel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resolution Channel</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select channel" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {RESOLUTION_CHANNELS.map((channel) => (
                      <SelectItem key={channel.value} value={channel.value}>
                        {channel.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="internalNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Internal Notes *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add internal notes (required for status updates)..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Updating..." : "Update Tracking Info"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default TrackingUpdateForm;