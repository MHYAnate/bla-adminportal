"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 4 characters.",
  }),
});
type FormSchemaType = z.infer<typeof formSchema>;

export default function OtpVerificationPage() {
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pin: "",
    },
  });

  async function onSubmit(values: FormSchemaType) {}
  return (
    <section className="flex justify-center">
      <div className="h-screen flex flex-col pb-6 max-w-[480px]">
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
                OTP Verification
              </h2>
              <p className="font-normal text-base leading-[1.5rem] text-[#111827] text-center mb-8">
                We have sent a verification code to email address
                <span className="font-semibold"> buylocal@gmail.com.</span>{" "}
                <Link href="#" className="text-[#27A376]">
                  Wrong Email?
                </Link>
              </p>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mb-10">
                  <FormField
                    control={form.control}
                    name="pin"
                    render={({ field }) => (
                      <FormItem className="mb-8">
                        <FormControl className=" w-full justify-center">
                          <InputOTP maxLength={4} {...field}>
                            <InputOTPGroup className="flex gap-6">
                              <InputOTPSlot
                                index={0}
                                className="rounded-2.5 h-14 w-[102px] border-[#E9EAEC]"
                              />
                              <InputOTPSlot
                                index={1}
                                className="rounded-2.5 h-14 w-[102px] border-[#E9EAEC]"
                              />
                              <InputOTPSlot
                                index={2}
                                className="rounded-2.5 h-14 w-[102px] border-[#E9EAEC]"
                              />
                              <InputOTPSlot
                                index={3}
                                className="rounded-2.5 h-14 w-[102px] border-[#E9EAEC]"
                              />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    variant={"warning"}
                    size={"md"}
                    className="font-bold text-base leading-[1.5rem]"
                  >
                    Submit
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
        <div className="flex gap-2.5">
          <p className="text-sm leading-[1.5rem] text-[#A0AEC0] font-medium">
            © 2025 Buylocal . Alrights reserved.
          </p>
          <Link href="#" className="font-bold text-sm text-[#111827]">
            Terms & Conditions
          </Link>
          <Link href="#" className="font-bold text-sm text-[#111827]">
            Privacy Policy
          </Link>
        </div>
      </div>
    </section>
  );
}
