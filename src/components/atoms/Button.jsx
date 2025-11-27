import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Button = forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children,
  disabled,
  ...props 
}, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-primary-600 text-white shadow hover:bg-primary-700 hover:shadow-md active:bg-primary-800": variant === "default",
          "border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-400": variant === "outline",
          "text-primary-600 hover:bg-primary-50 active:bg-primary-100": variant === "ghost",
          "bg-error-500 text-white shadow hover:bg-error-600 hover:shadow-md active:bg-error-700": variant === "destructive",
          "bg-success-500 text-white shadow hover:bg-success-600 hover:shadow-md active:bg-success-700": variant === "success",
        },
        {
          "h-9 px-3": size === "sm",
          "h-10 px-4 py-2": size === "default",
          "h-11 px-8": size === "lg",
          "h-9 w-9": size === "icon",
        },
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button