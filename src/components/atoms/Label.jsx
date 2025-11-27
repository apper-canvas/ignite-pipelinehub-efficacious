import React from "react"
import { cn } from "@/utils/cn"

const Label = ({ className, children, ...props }) => {
  return (
    <label
      className={cn(
        "text-sm font-medium leading-none text-slate-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    >
      {children}
    </label>
  )
}

export default Label