"use client";

import * as React from "react";
import { Label } from "./label";
import { EyeOutlineIcon, SearchIcon } from "../../../public/icons";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends React.ComponentProps<"input"> {
  label?: string;
  pos?: boolean; // true: icon right, false: icon left
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, name, label, pos = false, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const inputType = type === "password" && showPassword ? "text" : type;

    return (
      <div className="relative space-y-2 w-full">
        {label && <Label htmlFor={name}>{label}</Label>}

        <input
          name={name}
          type={inputType}
          className={cn(
            "flex h-14 w-full rounded-md border border-[#E5E7EB] bg-[#F8F8F9] px-3 py-2 text-base font-medium file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:font-medium placeholder:text-[#6B7280] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          ref={ref}
          {...props}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
          >
            <EyeOutlineIcon />
          </button>
        )}

        {type === "search" && (
          <button
            type="button"
            aria-label="Search"
            className={`absolute ${pos ? "right-4" : "left-4"
              } top-1/2 transform -translate-y-1/2`}
          >
            <SearchIcon />
          </button>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };
