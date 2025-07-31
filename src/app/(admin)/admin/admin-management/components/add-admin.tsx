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

interface InviteResponse {
  success: boolean;
  message: string;
  data: {
    userId: number;
    email: string;
    type: string;
    inviteUrl: string;
    expiresAt?: string | null;
    expiryHours?: number | null;
    debug?: {
      tokenGenerated: boolean;
      urlContainsToken: boolean;
      totalParams: number;
    };
  };
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
    .min(1, "Please select a role")
    .refine((role) => role === "admin", "Only admin role is currently supported"),
});

type FormSchemaType = z.infer<typeof formSchema>;

const CreateAdmin: React.FC<IProps> = ({ setClose, setUrl, roles = [] }) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // ✅ Updated to use the new hook API without callback parameter
  const { inviteAdmin, isLoading: inviteAdminIsLoading, error: inviteAdminError } = useInviteAdmin();

  // Helper function to handle successful invitation
  const handleInviteSuccess = (data: InviteResponse) => {
    console.log("✅ SUCCESS: Admin invitation successful:", data);

    if (data?.success && data?.data?.inviteUrl) {
      console.log("✅ Generated URL:", data.data.inviteUrl);

      // ✅ PARSE AND CHECK THE URL
      try {
        const url = new URL(data.data.inviteUrl);
        const params = Object.fromEntries(url.searchParams);
        console.log("📋 URL Parameters:", params);

        const required = ['email', 'userId', 'token', 'signature', 'timestamp'];
        const missing = required.filter(param => !params[param]);

        if (missing.length > 0) {
          console.error('❌ Generated URL missing:', missing);
          toast.error(`Generated URL is missing: ${missing.join(', ')}`);
        } else {
          console.log('✅ All required parameters present in URL');
          toast.success("Admin invitation sent successfully");
          setUrl(data.data.inviteUrl);
          setClose();
        }
      } catch (urlError) {
        console.error("❌ Invalid URL:", urlError);
        toast.error("Generated URL is invalid");
      }
    } else {
      console.warn("⚠️ Invitation response missing URL or success flag");
      toast.error("Invitation sent but URL generation failed");
    }
  };

  // Filter to only show admin roles
  const adminRoles = roles.filter((role: RoleData) =>
    role.name === "admin" || role.name === "super_admin"
  );

  console.log("Available roles:", roles);
  console.log("Filtered admin roles:", adminRoles);

  // Initialize form
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: "admin",
    },
  });

  // Handle form submission with enhanced error handling
  async function onSubmit(values: FormSchemaType): Promise<void> {
    console.log("Form submitted with values:", values);

    if (isSubmitting || inviteAdminIsLoading) {
      console.log("Already submitting, preventing duplicate submission");
      return;
    }

    setIsSubmitting(true);

    try {
      // Enhanced payload with proper validation
      const payload = {
        email: values.email.trim().toLowerCase(),
        roleNames: [values.role], // Backend expects array
        expiryHours: 24, // Default 24 hours
        noExpiry: false
      };

      console.log("Sending payload:", payload);

      // ✅ Updated to use the new hook method
      const response = await inviteAdmin(payload);
      console.log("API Response:", response);

      // ✅ Handle success manually since no callback
      if (response) {
        // Try to extract the response data based on possible structures
        let responseData = response;

        // Handle nested response structures
        if (response?.data?.data) {
          responseData = {
            success: true,
            message: response.data.message || "Invitation sent successfully",
            data: response.data.data
          };
        } else if (response?.data) {
          responseData = {
            success: true,
            message: response.message || "Invitation sent successfully",
            data: response.data
          };
        }

        console.log("✅ Processing success response:", responseData);
        handleInviteSuccess(responseData as InviteResponse);
      }

    } catch (error: any) {
      console.error("Form submission error:", error);

      // Handle different types of errors with better messaging
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

      // Show user-friendly error messages
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