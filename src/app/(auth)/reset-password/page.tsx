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
import { Input } from "@/components/ui/input";
import { useHandlePush } from "@/hooks/use-handle-push";
import { showSuccessAlert, Storage } from "@/lib/utils";
import { useResetPassword } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z
  .object({
    password: z.string().min(8, "Password should be at least 8 characters"),
    code: z.string().length(6, "Code must be exactly 6"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormSchemaType = z.infer<typeof formSchema>;

export default function UpdatePasswordPage() {
  const { handlePush } = useHandlePush();
  const { resetPasswordIsLoading, resetPasswordPayload } = useResetPassword(
    (res) => {
      showSuccessAlert("Password reset successful!");
      handlePush("/login");
    }
  );

  const email = Storage.get("email");
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      code: "",
    },
  });

  async function onSubmit(values: FormSchemaType) {
    const payload = {
      password: values.password,
      confirmPassword: values.confirmPassword,
      email,
      code: values.code,
    };
    resetPasswordPayload(payload);
  }

  return (
    <section className="flex justify-center">
      <div className="flex flex-col pb-6 max-w-[470px] pt-[2rem]">
        <div className="flex items-center h-full justify-center">
          <div>
            <div className="flex justify-center">
              <Image
                height={138.47}
                width={218}
                alt="Auth login image"
                src="/images/logo.png"
                quality={100}
                priority
                className="object-cover"
              />
            </div>

            <div>
              <h2 className="font-bold text-[2rem] text-[#3A3A3A] leading-[40px] mb-4 text-center">
                Update your password
              </h2>
              <p className="font-bold text-base leading-[1.5rem] text-[#111827] text-center mb-8">
                Set your new password with minimum 8 characters with a
                combination of letters and numbers
              </p>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="mb-10 space-y-5"
                >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#111827] font-medium text-base leading-[1.5rem]">
                          New Password{" "}
                          <span className="text-sm font-mediul text-[#E03137]">
                            *
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Input new password"
                            {...field}
                            className="h-14"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#111827] font-medium text-base leading-[1.5rem]">
                          Confirm New Password{" "}
                          <span className="text-sm font-mediul text-[#E03137]">
                            *
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Re-type your new password"
                            {...field}
                            className="h-14"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#111827] font-medium text-base leading-[1.5rem]">
                          Confirm Code
                          <span className="text-sm font-mediul text-[#E03137]">
                            *
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter code sent to your email"
                            {...field}
                            className="h-14"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    variant={"warning"}
                    size={"md"}
                    className="font-bold text-base leading-[1.5rem]"
                    disabled={resetPasswordIsLoading}
                  >
                    Submit
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
