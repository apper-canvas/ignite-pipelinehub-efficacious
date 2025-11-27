import React from "react"
import Label from "@/components/atoms/Label"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import Textarea from "@/components/atoms/Textarea"
import { cn } from "@/utils/cn"

const FormField = ({ 
  label, 
  type = "input", 
  error, 
  required = false, 
  className,
  children,
  ...props 
}) => {
  const renderInput = () => {
    switch (type) {
      case "select":
        return <Select {...props}>{children}</Select>
      case "textarea":
        return <Textarea {...props} />
      default:
        return <Input type={type} {...props} />
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label className={required ? "after:content-['*'] after:text-error-500 after:ml-0.5" : ""}>
        {label}
      </Label>
      {renderInput()}
      {error && <p className="text-sm text-error-500">{error}</p>}
    </div>
  )
}

export default FormField