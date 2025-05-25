"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Storage } from "@/lib/utils";
import { useLogin } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation"; 
import { useEffect } from "react"; 

const formSchema = z.object({
  email: z.string().email("Invalid email provided"),
  password: z.string(),
  remember: z.boolean().default(false).optional(),
});

type FormSchemaType = z.infer<typeof formSchema>;

// export default function LoginPage() {
//   const router = useRouter();  // Initialize router
  
//   // Modify success callback to use router
//   const { loginData, loginIsLoading, loginPayload } = useLogin((res: any) => {
//     Storage.set("token", res?.data?.token);
//     // Get email from form values
//     const email = form.getValues().email;
//     // Push to admin route with email query param
//     router.push(`/admin?email=${encodeURIComponent(email)}`);
//   });

//   const form = useForm<FormSchemaType>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//       remember: false,
//     },
//   });

//   async function onSubmit(values: FormSchemaType) {
//     loginPayload(values);
//   }

export default function LoginPage() {
  const router = useRouter();

  // Modify success callback to use storage
  const { loginData, loginIsLoading, loginPayload } = useLogin((res: any) => {
    // Store token in localStorage/sessionStorage
    localStorage.setItem("token", res?.data?.token);
    // or sessionStorage.setItem("token", res?.data?.token);
    
    const email = form.getValues().email;
    const remember = form.getValues().remember;
    
    // Store email based on remember me preference
    if (remember) {
      localStorage.setItem("userEmail", email); // Persistent across sessions
    } else {
      sessionStorage.setItem("userEmail", email); // Only for current session
    }
    
    router.push(`/admin`);
  });

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  // Pre-fill email if remembered
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("userEmail") || 
                          sessionStorage.getItem("userEmail");
    if (rememberedEmail) {
      form.setValue("email", rememberedEmail);
      form.setValue("remember", localStorage.getItem("userEmail") !== null);
    }
  }, [form]);

  async function onSubmit(values: FormSchemaType) {
    loginPayload(values);
  }


  return (
    <section className="flex gap-[60px]">
      <div className="bg-[#0F3D30] flex-1">
        <div className="w-full">
          <Image
            height={720}
            width={550}
            alt="Auth login image"
            src="/images/bladmin-login.jpg"
            className="object-cover w-full"
          />
        </div>
        <div className="py-[64.75px] px-[50px]">
          <div className="w-[218px] h-[138.47px]">
            <Image
              height={138.47}
              width={218}
              alt="Auth login image"
              src="/images/logo.png"
              quality={100}
              priority
              className="object-cover w-full h-auto"
            />
          </div>
          <h2 className="my-6 font-bold text-[2rem] text-white leading-[2.5rem]">
            Manage Customer Accounts Seamlessly and Securely
          </h2>
          <p className="font-medium text-base text-white">
            Effortlessly access the admin dashboard to oversee customer
            accounts, track activities, and ensure secure account management
            with ease.
          </p>
        </div>
      </div>
      <div className="flex-1 h-auto flex flex-col my-6">
        <div className="flex items-center h-full">
          <div>
            <div className="w-[100px] h-[61px] mb-[23px]">
              <Image
                height={61}
                width={100}
                alt="Arrow down icon"
                src="/images/auth-down_arrow.png"
                quality={100}
                priority
                className="object-cover w-full h-auto"
              />
            </div>
            <div className="me-[120px] flex flex-col">
              <div className="ms-[60px]">
                <h2 className="font-bold text-[2rem] text-[#3A3A3A] leading-[40px] mb-8">
                  Login to access your account
                </h2>
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

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#111827] font-medium text-base leading-[1.5rem]">
                            Password{" "}
                            <span className="text-sm font-mediul text-[#E03137]">
                              *
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Input your password account"
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
                      name="remember"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 mb-8">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="w-5 h-5 border-[#CBD5E0]"
                            />
                          </FormControl>
                          <div className="flex justify-between flex-1">
                            <FormLabel className="font-medium text-base text-[#687588]">
                              Remember Me
                            </FormLabel>
                            <Link
                              href={"/forgot-password"}
                              className="font-bold text-base leading-[1.5rem] text-[#687588]"
                            >
                              Forgot Password
                            </Link>
                          </div>
                        </FormItem>
                      )}
                    />
                    <Button
                      variant={"warning"}
                      size={"md"}
                      className="font-bold text-base leading-[1.5rem]"
                      disabled={loginIsLoading}
                    >
                      Submit
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
