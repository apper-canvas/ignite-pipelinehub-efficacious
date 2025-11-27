import React from "react"
import { cn } from "@/utils/cn"

const Badge = ({ className, variant = "default", children, ...props }) => {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        {
          "bg-slate-100 text-slate-700": variant === "default",
          "bg-primary-100 text-primary-700": variant === "primary",
          "bg-success-100 text-success-700": variant === "success",
          "bg-warning-100 text-warning-700": variant === "warning",
          "bg-error-100 text-error-700": variant === "error",
          "bg-slate-200 text-slate-600": variant === "secondary",
          "border border-slate-200 bg-white text-slate-700": variant === "outline",
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default Badge