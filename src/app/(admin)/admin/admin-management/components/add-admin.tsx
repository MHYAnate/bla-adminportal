"use client";

import React, { useState, useEffect } from "react";
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
import { useInviteAdmin } from "@/services/admin/index";
import { toast } from "sonner";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

// Types
interface RoleData {
  id: number;
  name: string;
  description?: string;
  permissions?: any[];
}

interface IProps {
  setClose: () => void;
  roles?: RoleData[];
  setUrl: (data: string) => void;
}

// Enhanced form validation schema
const formSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  role: z
    .string({
      required_error: "Please select a role.",
    })
    .min(1, "Please select a role"),
});

type FormSchemaType = z.infer<typeof formSchema>;

const CreateAdmin: React.FC<IProps> = ({ setClose, setUrl, roles = [] }) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { inviteAdmin, isLoading: inviteAdminIsLoading, error: inviteAdminError } = useInviteAdmin();

  // ✅ FIXED: Simple success handler - backend auth completely bypassed
  const handleInviteSuccess = (data: any) => {
    console.log("✅ SUCCESS: Admin invitation successful:", data);

    if (data?.inviteUrl) {
      console.log("✅ Generated URL:", data.inviteUrl);

      try {
        const url = new URL(data.inviteUrl);
        const params = Object.fromEntries(url.searchParams);
        console.log("📋 URL Parameters:", params);

        // ✅ Since backend auth is bypassed, just check for basic parameters
        if (params.email && params.userId) {
          console.log('✅ Valid invitation URL generated (backend auth bypassed)');
          toast.success("Admin invitation sent successfully");
          setUrl(data.inviteUrl);
          setClose();
        } else {
          console.error('❌ Generated URL missing essential parameters');
          toast.error("Generated URL is missing essential parameters");
        }
      } catch (urlError) {
        console.error("❌ Invalid URL:", urlError);
        toast.error("Generated URL is invalid");
      }
    } else {
      console.warn("⚠️ Invitation response missing URL");
      toast.error("Invitation sent but URL generation failed");
    }
  };

  // Filter to only show admin roles
  const adminRoles = roles.filter((role: RoleData) =>
    role.name === "admin" ||
    role.name === "super_admin" ||
    role.name.toLowerCase().includes("admin")
  );

  console.log("Available roles:", roles);
  console.log("Filtered admin roles:", adminRoles);

  // Initialize form
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: "",
    },
  });

  // ✅ Auto-select admin role when available
  useEffect(() => {
    if (adminRoles.length > 0 && !form.getValues().role) {
      const defaultRole = adminRoles.find(role => role.name === "admin") || adminRoles[0];
      form.setValue("role", defaultRole.name);
      console.log("Auto-selected role:", defaultRole.name);
    }
  }, [adminRoles, form]);

  // ✅ FIXED: Handle form submission with corrected response processing
  async function onSubmit(values: FormSchemaType): Promise<void> {
    console.log("Form submitted with values:", values);

    if (isSubmitting || inviteAdminIsLoading) {
      console.log("Already submitting, preventing duplicate submission");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        email: values.email.trim().toLowerCase(),
        roleNames: [values.role],
        expiryHours: 24,
        noExpiry: false
      };

      console.log("Sending payload:", payload);

      const response = await inviteAdmin(payload);
      console.log("API Response:", response);

      // ✅ FIXED: The hook already extracts the data, so use it directly
      if (response) {
        console.log("✅ Processing success response:", response);
        handleInviteSuccess(response);
      }

    } catch (error: any) {
      console.error("Form submission error:", error);

      let errorMessage = "Failed to send admin invitation";

      if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      if (errorMessage.includes('already exists')) {
        toast.error("An admin with this email already exists");
      } else if (errorMessage.includes('configuration')) {
        toast.error("Server configuration error. Please contact administrator.");
      } else if (errorMessage.includes('token')) {
        toast.error("Failed to generate secure invitation link");
      } else if (errorMessage.includes('Invalid email')) {
        toast.error("Please enter a valid email address");
      } else if (errorMessage.includes('Role not found')) {
        toast.error("Selected role is not available");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  // Show loading state if roles are still loading
  if (!roles || roles.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading roles...</span>
      </div>
    );
  }

  return (
    <div>
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
                      onChange={(e) => {
                        field.onChange(e);
                        console.log("Email changed:", e.target.value);
                      }}
                      disabled={isSubmitting || inviteAdminIsLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-[#111827] font-medium text-base">
                    Role <span className="text-[#E03137]">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(value: string) => {
                      field.onChange(value);
                      console.log("Role changed:", value);
                    }}
                    value={field.value}
                    disabled={isSubmitting || inviteAdminIsLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="h-14">
                        <SelectValue placeholder="Select admin role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {adminRoles.length > 0 ? (
                        adminRoles.map((role: RoleData) => (
                          <SelectItem key={role.id} value={role.name}>
                            {role.name.replace(/_/g, " ").toUpperCase()}
                            {role.description && (
                              <span className="text-sm text-gray-500 ml-2">
                                - {role.description}
                              </span>
                            )}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="admin">
                          Admin (Default)
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Show any invite errors */}
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
                console.log("Cancel clicked");
                setClose();
              }}
              disabled={isSubmitting || inviteAdminIsLoading}
            >
              Cancel
            </Button>
            <Button
              disabled={isSubmitting || inviteAdminIsLoading}
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
                  Send Invitation
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