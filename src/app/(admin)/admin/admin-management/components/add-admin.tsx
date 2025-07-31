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
import { Loader2, CheckCircle, AlertCircle, Shield, Clock, Users } from "lucide-react";

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
  expiryHours: z
    .number()
    .min(1, "Expiry must be at least 1 hour")
    .max(168, "Expiry cannot exceed 1 week (168 hours)")
    .optional(),
  noExpiry: z.boolean().optional(),
});

type FormSchemaType = z.infer<typeof formSchema>;

const CreateAdmin: React.FC<IProps> = ({ setClose, setUrl, roles = [] }) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [advancedOptions, setAdvancedOptions] = useState<boolean>(false);

  const { inviteAdmin, isLoading: inviteAdminIsLoading, error: inviteAdminError } = useInviteAdmin();

  // ✅ SECURE: Handle invitation success with proper validation
  const handleInviteSuccess = (data: any) => {
    console.log("✅ SECURE: Admin invitation successful:", data);

    if (data?.inviteUrl) {
      console.log("✅ Generated secure URL:", data.inviteUrl);

      try {
        const url = new URL(data.inviteUrl);
        const params = Object.fromEntries(url.searchParams);
        console.log("📋 URL Security Parameters:", Object.keys(params));

        // ✅ Validate all required security parameters
        const requiredParams = ['email', 'userId', 'token', 'signature', 'timestamp'];
        const missing = requiredParams.filter(param => !params[param]);

        if (missing.length === 0) {
          console.log('✅ Secure invitation URL generated with all security parameters');
          toast.success("Secure admin invitation sent successfully!");
          setUrl(data.inviteUrl);
          setClose();
        } else {
          console.error('❌ Generated URL missing security parameters:', missing);
          toast.error(`Generated URL missing security parameters: ${missing.join(', ')}`);
        }
      } catch (urlError) {
        console.error("❌ Invalid secure URL:", urlError);
        toast.error("Generated invitation URL is invalid");
      }
    } else {
      console.warn("⚠️ Invitation response missing URL");
      toast.error("Invitation processed but URL generation failed");
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

  // Initialize form with secure defaults
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: "",
      expiryHours: 24, // Default 24 hours
      noExpiry: false,
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

  // ✅ SECURE: Handle form submission with enhanced security
  async function onSubmit(values: FormSchemaType): Promise<void> {
    console.log("🔐 Secure form submitted with values:", values);

    if (isSubmitting || inviteAdminIsLoading) {
      console.log("Already submitting, preventing duplicate submission");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        email: values.email.trim().toLowerCase(),
        roleNames: [values.role],
        expiryHours: values.noExpiry ? undefined : (values.expiryHours || 24),
        noExpiry: values.noExpiry || false
      };

      console.log("🔐 Sending secure payload:", { ...payload, email: payload.email });

      const response = await inviteAdmin(payload);
      console.log("📡 Secure API Response:", response);

      if (response) {
        console.log("✅ Processing secure success response");
        handleInviteSuccess(response);
      }

    } catch (error: any) {
      console.error("❌ Secure form submission error:", error);

      let errorMessage = "Failed to send secure admin invitation";

      if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      // ✅ Handle specific secure invitation errors
      if (errorMessage.includes('INVITE_SECRET')) {
        toast.error("Server security configuration error. Please contact administrator.");
      } else if (errorMessage.includes('FRONTEND_URL')) {
        toast.error("Server URL configuration error. Please contact administrator.");
      } else if (errorMessage.includes('already exists')) {
        toast.error("An admin with this email already exists");
      } else if (errorMessage.includes('configuration')) {
        toast.error("Server configuration error. Please contact administrator.");
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
          {/* Security Notice */}
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-5 w-5 text-green-600" />
              <h3 className="text-sm font-semibold text-green-800">Secure Invitation System</h3>
            </div>
            <p className="text-xs text-green-700">
              Invitations are cryptographically signed and time-limited for maximum security.
              Recipients will receive a tamper-proof link that expires automatically.
            </p>
          </div>

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
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4" />
                              <span>
                                {role.name.replace(/_/g, " ").toUpperCase()}
                                {role.description && (
                                  <span className="text-sm text-gray-500 ml-2">
                                    - {role.description}
                                  </span>
                                )}
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="admin">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4" />
                            <span>Admin (Default)</span>
                          </div>
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Advanced Security Options */}
            <div className="border-t pt-4">
              <button
                type="button"
                onClick={() => setAdvancedOptions(!advancedOptions)}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Shield className="h-4 w-4" />
                <span>Security Options</span>
                <span className="text-xs">
                  {advancedOptions ? '(Hide)' : '(Show)'}
                </span>
              </button>

              {advancedOptions && (
                <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
                  <FormField
                    control={form.control}
                    name="noExpiry"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            disabled={isSubmitting || inviteAdminIsLoading}
                            className="rounded border-gray-300"
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-medium text-gray-700 cursor-pointer">
                          No Expiry (Permanent invitation link)
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  {!form.watch('noExpiry') && (
                    <FormField
                      control={form.control}
                      name="expiryHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>Invitation Expiry (hours)</span>
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(value) => field.onChange(parseInt(value))}
                              value={field.value?.toString()}
                              disabled={isSubmitting || inviteAdminIsLoading}
                            >
                              <SelectTrigger className="h-10">
                                <SelectValue placeholder="Select expiry time" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1 hour</SelectItem>
                                <SelectItem value="6">6 hours</SelectItem>
                                <SelectItem value="12">12 hours</SelectItem>
                                <SelectItem value="24">24 hours (default)</SelectItem>
                                <SelectItem value="48">48 hours</SelectItem>
                                <SelectItem value="72">72 hours</SelectItem>
                                <SelectItem value="168">1 week</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <p className="text-xs text-gray-500">
                            The invitation link will expire after this duration for security
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded border border-blue-200">
                    <div className="font-medium text-blue-800 mb-1">Security Features:</div>
                    <ul className="space-y-1 text-blue-700">
                      <li>• Cryptographic signatures prevent link tampering</li>
                      <li>• Time-based tokens prevent replay attacks</li>
                      <li>• HMAC verification ensures authenticity</li>
                      <li>• Automatic cleanup of expired invitations</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Show any invite errors */}
          {inviteAdminError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
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
                  Generating Secure Invitation...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Send Secure Invitation
                </>
              )}
            </Button>
          </div>

          {/* Security Footer */}
          <div className="mt-4 text-xs text-gray-500 text-center">
            <div className="flex items-center justify-center space-x-1">
              <Shield className="h-3 w-3" />
              <span>
                Secure invitation system with cryptographic verification
              </span>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateAdmin;