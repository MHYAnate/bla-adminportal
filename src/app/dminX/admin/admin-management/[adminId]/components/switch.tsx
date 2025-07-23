"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface PermissionSwitchProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
  id?: string
  "aria-label"?: string
}

const PermissionSwitch = React.forwardRef<React.ElementRef<"button">, PermissionSwitchProps>(
  ({ className, checked = false, onCheckedChange, disabled = false, id, ...props }, ref) => {
    const handleClick = () => {
      if (!disabled && onCheckedChange) {
        onCheckedChange(!checked)
      }
    }

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault()
        handleClick()
      }
    }

    return (
      <button
        ref={ref}
        id={id}
        role="switch"
        type="button"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          // Base styles
          "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
          // Enabled state
          checked ? "bg-green-500 shadow-sm" : "bg-gray-200 shadow-inner",
          // Disabled state
          disabled && "cursor-not-allowed opacity-50",
          // Hover states
          !disabled && (checked ? "hover:bg-green-600" : "hover:bg-gray-300"),
          className,
        )}
        {...props}
      >
        <span
          className={cn(
            // Base thumb styles
            "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out",
            // Position based on checked state
            checked ? "translate-x-5" : "translate-x-0",
            // Shadow for depth
            "drop-shadow-sm",
          )}
        />
      </button>
    )
  },
)

PermissionSwitch.displayName = "PermissionSwitch"

export { PermissionSwitch }
