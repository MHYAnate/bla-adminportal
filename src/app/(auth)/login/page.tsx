"use client";

import React from "react";
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
import { showErrorAlert } from "@/lib/utils";
import { useLogin } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from '@/context/auth';
import debugAPI from '@/utils/api-debug';
import { toast } from 'sonner';

const formSchema = z.object({
  email: z.string().email("Invalid email provided"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().default(false).optional(),
});

type FormSchemaType = z.infer<typeof formSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  // Debug API configuration
  React.useEffect(() => {
    debugAPI();
  }, []);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && !authLoading) {
      console.log('🔄 User already authenticated, redirecting to admin...');
      router.replace('/admin');
    }
  }, [isAuthenticated, authLoading, router]);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  // FIXED: Enhanced success callback
  const handleLoginSuccess = async (loginResponse: any) => {
    console.log('🎯 Login success callback received:', loginResponse);

    try {
      // Extract token from various possible locations
      const token = loginResponse?.token ||
        loginResponse?.data?.token ||
        loginResponse?.accessToken ||
        loginResponse?.data?.accessToken;

      if (!token) {
        console.error('❌ No token found in login response:', loginResponse);
        const errorMsg = "Login failed. No authentication token received.";
        showErrorAlert(errorMsg);
        toast.error(errorMsg);
        return;
      }

      const rememberMe = form.getValues('remember');
      console.log('🔐 Calling auth.login with:', {
        hasToken: !!token,
        tokenLength: token.length,
        remember: rememberMe,
        hasLoginResponse: !!loginResponse
      });

      // Pass the full login response as the third parameter
      await login(token, rememberMe, loginResponse);

      console.log('✅ Login process completed successfully');
      toast.success("Login successful!");
    } catch (error: unknown) {
      console.error('❌ Login process failed:', error);
      const errorMsg = (error as any)?.message || "Login failed. Please try again.";
      showErrorAlert(errorMsg);
      toast.error(errorMsg);
    }
  };

  // FIXED: Better error handling for login hook
  const handleLoginError = (error: any) => {
    console.error('❌ Login API error:', error);
    const errorMsg = error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      "Login failed. Please check your credentials.";
    showErrorAlert(errorMsg);
    toast.error(errorMsg);
  };

  const { loginData, loginIsLoading, loginPayload } = useLogin(handleLoginSuccess, handleLoginError);

  async function onSubmit(values: FormSchemaType) {
    try {
      console.log('📝 Submitting login form:', {
        email: values.email,
        remember: values.remember
      });

      // Clear any previous errors
      form.clearErrors();

      await loginPayload(values);
    } catch (error) {
      console.error('❌ Login submission error:', error);
      // Error handling is done in the useLogin hook's onError callback
    }
  }

  // Show loading state if auth is still loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
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
                              disabled={loginIsLoading}
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
                              autoComplete="current-password"
                              disabled={loginIsLoading}
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
                              disabled={loginIsLoading}
                              className="w-5 h-5 border-[#CBD5E0]"
                            />
                          </FormControl>
                          <div className="flex justify-between flex-1">
                            <FormLabel className="font-medium text-base text-[#687588]">
                              Remember Me
                            </FormLabel>
                            <Link
                              href={"/forgot-password"}
                              className="font-bold text-base leading-[1.5rem] text-[#687588] hover:text-[#0F3D30] transition-colors"
                            >
                              Forgot Password
                            </Link>
                          </div>
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      variant={"warning"}
                      size={"md"}
                      className="font-bold text-base leading-[1.5rem] w-full"
                      disabled={loginIsLoading}
                    >
                      {loginIsLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Logging in...
                        </div>
                      ) : (
                        "Submit"
                      )}
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