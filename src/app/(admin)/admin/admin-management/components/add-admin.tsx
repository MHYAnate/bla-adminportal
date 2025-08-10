"use client";

import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useInviteAdmin, useGetInvitableRoles } from "@/services/admin";
import { toast } from "sonner";
import { Loader2, CheckCircle, AlertCircle, Users, ShieldCheck } from "lucide-react";

// Types
interface RoleData {
  id: number;
  name: string;
  description?: string;
  type: string;
  permissions?: any[];
}

interface IProps {
  setClose: () => void;
  setUrl: (data: string) => void;
}

// Enhanced form validation schema with role ID validation
const formSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  roleId: z
    .string({
      required_error: "Please select a role.",
    })
    .min(1, "Please select a role")
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, "Please select a valid role"),
});

type FormSchemaType = z.infer<typeof formSchema>;

const CreateAdmin: React.FC<IProps> = ({ setClose, setUrl }) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // ✅ Updated to use unified hooks
  const { rolesData: invitableRoles, isRolesLoading, rolesError } = useGetInvitableRoles({ enabled: true });

  // ✅ Enhanced success callback with better error handling
  const { inviteAdminPayload, inviteAdminIsLoading, inviteAdminError } = useInviteAdmin(
    (data: { success: boolean; message: any; }) => {
      console.log("✅ SUCCESS: Admin invitation sent:", data);

      // ✅ Improved success handling with unified response extraction
      if (data?.success !== false) {
        toast.success("Admin invitation sent successfully");
        setClose();
      } else {
        toast.error(data?.message || "Failed to send invitation");
      }
    }
  );

  // Process and filter invitable roles with better error handling
  const availableRoles = React.useMemo(() => {
    if (!invitableRoles || !Array.isArray(invitableRoles)) return [];

    return invitableRoles.filter((role: RoleData) => {
      // Only show admin type roles, exclude restricted ones
      return role.type === 'ADMIN' &&
        !['SUPER_ADMIN', 'INDIVIDUAL', 'BUSINESS'].includes(role.name);
    });
  }, [invitableRoles]);

  console.log("Available invitable roles:", availableRoles);

  // Initialize form
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      roleId: undefined,
    },
  });

  // ✅ Enhanced form submission with unified error handling
  async function onSubmit(values: FormSchemaType): Promise<void> {
    console.log("Form submitted with values:", values);

    if (isSubmitting || inviteAdminIsLoading) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Find selected role details for validation
      const selectedRole = availableRoles.find(role => role.id === values.roleId);

      if (!selectedRole) {
        toast.error("Selected role is no longer available");
        return;
      }

      const payload = {
        email: values.email.trim().toLowerCase(),
        roleId: values.roleId, // Send role ID as required by backend
      };

      console.log("Sending invitation payload:", payload);

      // ✅ The unified hook now handles response extraction automatically
      const response = await inviteAdminPayload(payload);

      // ✅ If we get here, the invitation was successful
      console.log("Invitation sent successfully:", response);

    } catch (error: any) {
      console.error("Form submission error:", error);

      // ✅ Error handling is now done in the hook, but we can add specific UI feedback
      // The hook already shows toast.error, so we just log here
    } finally {
      setIsSubmitting(false);
    }
  }

  // ✅ Enhanced loading state with error handling
  if (isRolesLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading available roles...</span>
      </div>
    );
  }

  // ✅ Show error state if roles failed to load
  if (rolesError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Failed to Load Roles</h3>
        <p className="text-sm text-gray-600 mb-4">
          Unable to load available admin roles.
        </p>
        <p className="text-xs text-red-500">{rolesError}</p>
      </div>
    );
  }

  // No roles available
  if (!availableRoles || availableRoles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Invitable Roles Available</h3>
        <p className="text-sm text-gray-600 mb-4">
          There are no admin roles available for invitation at this time.
        </p>
        <p className="text-xs text-gray-500">
          Please ensure admin roles are properly configured before sending invitations.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <ShieldCheck className="h-5 w-5 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold">Invite New Administrator</h2>
        </div>
        <p className="text-sm text-gray-600">
          Select a specific role to determine the new admin's permissions and access levels.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mb-8 flex flex-col h-full"
        >
          <div className="mb-6 space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-[#111827] font-medium text-base">
                    Email Address <span className="text-[#E03137]">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter admin email address"
                      className="h-14"
                      {...field}
                      disabled={isSubmitting || inviteAdminIsLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roleId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-[#111827] font-medium text-base">
                    Admin Role <span className="text-[#E03137]">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(value: string) => {
                      field.onChange(value);
                      console.log("Role selected:", value);
                    }}
                    value={field.value?.toString()}
                    disabled={isSubmitting || inviteAdminIsLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="h-14">
                        <SelectValue placeholder="Select admin role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableRoles.map((role: RoleData) => (
                        <SelectItem key={role.id} value={role.id.toString()}>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-blue-600" />
                            <div>
                              <span className="font-medium">
                                {role.name.replace(/_/g, " ").toUpperCase()}
                              </span>
                              {role.description && (
                                <span className="text-sm text-gray-500 ml-2">
                                  - {role.description}
                                </span>
                              )}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  {field.value && (
                    <div className="text-xs text-blue-600 mt-1">
                      ✓ Role-based permissions will be automatically applied
                    </div>
                  )}
                </FormItem>
              )}
            />
          </div>

          {/* Role-based invitation info */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <ShieldCheck className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
              <div className="text-xs text-blue-800">
                <p className="font-medium">Role-Based Access Control</p>
                <p>The invited admin will inherit all permissions assigned to the selected role.</p>
              </div>
            </div>
          </div>

          {/* ✅ Show any invite errors from unified hook */}
          {inviteAdminError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
              <span className="text-red-700 text-sm">{inviteAdminError}</span>
            </div>
          )}

          <div className="gap-5 justify-end flex mt-auto">
            <Button
              variant="outline"
              className="w-auto py-4 px-[3rem] font-bold text-base"
              size="xl"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setClose();
              }}
              disabled={isSubmitting || inviteAdminIsLoading}
            >
              Cancel
            </Button>
            <Button
              disabled={isSubmitting || inviteAdminIsLoading || !availableRoles.length}
              variant="warning"
              className="w-auto px-[3rem] py-4 font-bold text-base"
              size="xl"
              type="submit"
            >
              {isSubmitting || inviteAdminIsLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Invitation...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Send Role-Based Invitation
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateAdmin;