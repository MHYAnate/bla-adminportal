"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChangePassword } from "@/services/auth"; // Import the new hook
import { showErrorAlert, showSuccessAlert } from "@/lib/utils"; // Add this import

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
    formState: { errors },
  } = useForm<FormValues>();

  const newPassword = watch("newpassword");

  const { changePasswordPayload, changePasswordIsLoading } = useChangePassword(
    (resData) => {
      console.log("Password changed successfully:", resData);
      reset(); // Clear form on success
    }
  );

  const onSubmit = async (data: FormValues) => {
    // Client-side validation
    if (data.newpassword !== data.confirmpassword) {
      showErrorAlert("New password and confirm password don't match");
      return;
    }

    const payload = {
      currentPassword: data.currentpassword,
      newPassword: data.newpassword,
      confirmPassword: data.confirmpassword,
    };

    await changePasswordPayload(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        type="password"
        placeholder="Current Password"
        {...register("currentpassword", {
          required: "Current password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters"
          }
        })}
      />
      {errors.currentpassword && (
        <p className="text-sm text-red-500">{errors.currentpassword.message}</p>
      )}

      <Input
        type="password"
        placeholder="New Password"
        {...register("newpassword", {
          required: "New password is required",
          minLength: {
            value: 8,
            message: "New password must be at least 8 characters"
          }
        })}
      />
      {errors.newpassword && (
        <p className="text-sm text-red-500">{errors.newpassword.message}</p>
      )}

      <Input
        type="password"
        placeholder="Confirm Password"
        {...register("confirmpassword", {
          required: "Please confirm your password",
          validate: (value) =>
            value === newPassword || "Passwords don't match"
        })}
      />
      {errors.confirmpassword && (
        <p className="text-sm text-red-500">{errors.confirmpassword.message}</p>
      )}

      <Button
        type="submit"
        disabled={changePasswordIsLoading}
        className="w-full"
      >
        {changePasswordIsLoading ? "Changing Password..." : "Change Password"}
      </Button>
    </form>
  );
}