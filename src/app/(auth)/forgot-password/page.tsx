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
import { Storage } from "@/lib/utils";
import { useForgotPassword } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
const formSchema = z.object({
  email: z.string().email("Invalid email provided"),
});
type FormSchemaType = z.infer<typeof formSchema>;

export default function ForgotPasswordPage() {
  const { handlePush } = useHandlePush();
  const { forgotPasswordIsLoading, forgotPasswordPayload } = useForgotPassword(
    (res: any) => {
      handlePush("/reset-password");
    }
  );
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: FormSchemaType) {
    Storage.set("email", values.email);
    forgotPasswordPayload(values);
  }
  return (
    <section className="flex justify-center">
      <div className="pt-[2rem] flex flex-col pb-6 max-w-[470px]">
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
                Reset your password
              </h2>
              <p className="font-bold text-base leading-[1.5rem] text-[#111827] text-center mb-8">
                Enter your email address and we’ll send you password reset
                instructions.
              </p>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="mb-10 space-y-5"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#111827] font-medium text-base leading-[1.5rem]">
                          Email Address{" "}
                          <span className="text-sm font-mediul text-[#E03137]">
                            *
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Input your registered email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
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
                    className="font-bold text-base leading-[1.5rem] mb-4"
                    disabled={forgotPasswordIsLoading}
                  >
                    Submit
                  </Button>
                  <Button
                    variant={"outline"}
                    size={"md"}
                    className="font-bold text-base leading-[1.5rem]"
                    asChild
                  >
                    <Link href="/login">Back To Login</Link>
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
