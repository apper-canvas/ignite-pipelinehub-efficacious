import React from "react"
import Badge from "@/components/atoms/Badge"

const StageBadge = ({ stage }) => {
  const getVariant = (stage) => {
    switch (stage?.toLowerCase()) {
      case "won":
        return "success"
      case "lost":
        return "error"
      case "negotiation":
        return "warning"
      case "proposal":
        return "primary"
      default:
        return "default"
    }
  }

  return (
    <Badge variant={getVariant(stage)}>
      {stage}
    </Badge>
  )
}

export default StageBadge