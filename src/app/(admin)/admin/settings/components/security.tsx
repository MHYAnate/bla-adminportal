"use client";

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
    formState: { errors },
  } = useForm<FormValues>();

  const resetPassword = async (data: FormValues) => {
    const payload = {
      currentPassword: data.currentpassword,
      newPassword: data.newpassword,
      confirmPassword: data.confirmpassword,
    };

    try {
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
    <form onSubmit={handleSubmit(resetPassword)} className="space-y-4">
      <Input
        type="password"
        placeholder="Current Password"
        {...register("currentpassword", { required: true })}
      />
      {errors.currentpassword && (
        <p className="text-sm text-red-500">Current password is required</p>
      )}

      <Input
        type="password"
        placeholder="New Password"
        {...register("newpassword", { required: true })}
      />
      {errors.newpassword && (
        <p className="text-sm text-red-500">New password is required</p>
      )}

      <Input
        type="password"
        placeholder="Confirm Password"
        {...register("confirmpassword", { required: true })}
      />
      {errors.confirmpassword && (
        <p className="text-sm text-red-500">Confirm password is required</p>
      )}

      <Button type="submit">Reset Password</Button>
    </form>
  );
}
