"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useResetPassword } from "@/services/auth"; // Adjust the import path as necessary
import { useState } from "react";

// Form validation schema
const formSchema = z
  .object({
    currentpassword: z.string().min(6, "Current password is required"),
    newpassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmpassword: z.string().min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.newpassword === data.confirmpassword, {
    message: "Passwords do not match",
    path: ["confirmpassword"],
  });

type FormSchemaType = z.infer<typeof formSchema>;

const Security: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const { resetPasswordPayload, resetPasswordIsLoading } = useResetPassword(() => {
    form.reset(); // Reset form on success
  });

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentpassword: "",
      newpassword: "",
      confirmpassword: "",
    },
  });

  async function onSubmit(values: FormSchemaType) {
    const payload = {
      currentpassword: values.currentpassword,
      newpassword: values.newpassword,
      confirmpassword: values.confirmpassword,
    };

    try {
      setLoading(true);
      await resetPasswordPayload(payload);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h6 className="text-[#111827] text-xl font-bold mb-6">Change Password</h6>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
          <FormField
            control={form.control}
            name="currentpassword"
            render={({ field }) => (
              <FormItem className="w-full mb-6">
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter current password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newpassword"
            render={({ field }) => (
              <FormItem className="w-full mb-6">
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter new password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmpassword"
            render={({ field }) => (
              <FormItem className="w-full mb-6">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Re-enter new password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="gap-5 justify-end flex">
            <Button
              variant="warning"
              type="submit"
              disabled={loading || resetPasswordIsLoading}
              className="w-auto px-[3rem] py-4 font-bold text-base"
              size="xl"
            >
              {loading || resetPasswordIsLoading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Security;
