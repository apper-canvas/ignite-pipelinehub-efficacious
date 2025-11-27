import React from "react"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding some data.",
  action,
  actionLabel = "Add New",
  icon = "Database"
}) => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="h-12 w-12 text-slate-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      
      <p className="text-slate-600 mb-6 max-w-md mx-auto">
        {description}
      </p>
      
      {action && (
        <Button onClick={action}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default Empty