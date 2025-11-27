import React, { useState } from "react"
import { Card, CardContent } from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import Button from "@/components/atoms/Button"
import PriorityBadge from "@/components/molecules/PriorityBadge"
import ApperIcon from "@/components/ApperIcon"
import { format } from "date-fns"

const DealCard = ({ deal, contact, onEdit, onDelete, isDragging = false }) => {
  const [showActions, setShowActions] = useState(false)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getProbabilityColor = (probability) => {
    if (probability >= 80) return "text-success-600"
    if (probability >= 50) return "text-warning-600"
    return "text-slate-500"
  }

  return (
    <Card 
      className={`transition-all duration-200 cursor-move hover:shadow-md ${
        isDragging ? "opacity-50 rotate-2 scale-105" : ""
      } ${deal.stage === "Won" ? "border-l-4 border-l-success-500" : ""} ${
        deal.stage === "Lost" ? "border-l-4 border-l-error-500" : ""
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header with actions */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 truncate">{deal.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold text-primary-600">
                  {formatCurrency(deal.value)}
                </span>
                <span className={`text-sm ${getProbabilityColor(deal.probability)}`}>
                  {deal.probability}%
                </span>
              </div>
            </div>
            
            {showActions && (
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="ghost" onClick={() => onEdit(deal)}>
                  <ApperIcon name="Edit" className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => onDelete(deal.Id)}
                  className="text-error-600 hover:text-error-700 hover:bg-error-50"
                >
                  <ApperIcon name="Trash2" className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Contact info */}
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-slate-200 rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="h-3 w-3 text-slate-500" />
            </div>
            <span className="text-sm text-slate-600 truncate">
              {contact?.name || "No contact"}
            </span>
          </div>

          {/* Priority and close date */}
          <div className="flex items-center justify-between">
            <PriorityBadge priority={deal.priority} />
            {deal.expectedCloseDate && (
              <span className="text-xs text-slate-500">
                Due {format(new Date(deal.expectedCloseDate), "MMM dd")}
              </span>
            )}
          </div>

          {/* Notes preview */}
          {deal.notes && (
            <p className="text-sm text-slate-600 line-clamp-2">
              {deal.notes}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default DealCard