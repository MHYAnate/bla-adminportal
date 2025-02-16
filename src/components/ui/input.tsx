"use client";

import { cn } from "@/lib/utils";

import * as React from "react";
import { Label } from "./label";
import { EyeOutlineIcon, SearchIcon } from "../../../public/icons";

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & { label?: string; pos?: boolean }
>(({ className, type, name, label, pos, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  return (
    <div className="relative space-y-2 w-full">
      {label && <Label htmlFor={name}>{label}</Label>}
      <input
        name={name}
        type={showPassword ? "text" : type}
        className={cn(
          "flex h-14 w-full rounded-md border border-[#E5E7EB] bg-[#F8F8F9] px-3 py-2 text-base font-medium file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:font-medium placeholder:text-[#6B7280] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />

      {type === "password" ? (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-[40%] -translate-y-1/2 transform"
        >
          {showPassword ? <EyeOutlineIcon /> : <EyeOutlineIcon />}
        </button>
      ) : type === "search" ? (
        <button
          className={`absolute ${
            pos ? "right-4" : "left-4"
          } top-[30%] transform -translate-y-1/2`}
        >
          <SearchIcon />
        </button>
      ) : null}
    </div>
  );
});
Input.displayName = "Input";

export { Input };
