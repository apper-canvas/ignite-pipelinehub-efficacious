import React from "react"
import Badge from "@/components/atoms/Badge"

const PriorityBadge = ({ priority }) => {
  const getVariant = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "error"
      case "medium":
        return "warning"
      case "low":
        return "success"
      default:
        return "default"
    }
  }

  return (
    <Badge variant={getVariant(priority)}>
      {priority || "Normal"}
    </Badge>
  )
}

export default PriorityBadge