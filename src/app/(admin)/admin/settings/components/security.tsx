"use client";

import { FormEvent } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { routes } from "@/services/api-routes";
import httpService from "@/services/httpService";
import { showErrorAlert, showSuccessAlert } from "@/lib/utils";

interface FormValues {
  currentpassword: string;
  newpassword: string;
  confirmpassword: string;
}

export default function Security() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    const payload = {
      currentPassword: data.currentpassword,
      newPassword: data.newpassword,
      confirmPassword: data.confirmpassword,
    };

    try {
      // Replace this with your actual postDataWithToken implementation if needed
      const response = await httpService.postData(payload, routes.resetPassword());
      showSuccessAlert(response?.data?.message || "Password changed successfully");
      reset();
    } catch (error: any) {
      const message = error?.response?.data?.error || "Password change failed";
      showErrorAlert(message);
      console.error("Reset password error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        type="password"
        placeholder="Current Password"
        required
        {...register("currentpassword", { required: true })}
      />
      <Input
        type="password"
        placeholder="New Password"
        required
        {...register("newpassword", { required: true })}
      />
      <Input
        type="password"
        placeholder="Confirm Password"
        required
        {...register("confirmpassword", { required: true })}
      />
      <Button type="submit">Reset Password</Button>
    </form>
  );
}
