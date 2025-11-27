import React from "react"
import { Card, CardContent } from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"

const StatCard = ({ title, value, change, changeType = "positive", icon, color = "primary" }) => {
  const colorClasses = {
    primary: "text-primary-600",
    success: "text-success-600",
    warning: "text-warning-600",
    error: "text-error-600",
  }

  const bgColorClasses = {
    primary: "bg-primary-100",
    success: "bg-success-100",
    warning: "bg-warning-100",
    error: "bg-error-100",
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
            {change && (
              <div className="flex items-center mt-2">
                <ApperIcon
                  name={changeType === "positive" ? "TrendingUp" : "TrendingDown"}
                  className={`h-4 w-4 mr-1 ${
                    changeType === "positive" ? "text-success-600" : "text-error-600"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    changeType === "positive" ? "text-success-600" : "text-error-600"
                  }`}
                >
                  {change}
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${bgColorClasses[color]}`}>
            <ApperIcon name={icon} className={`h-6 w-6 ${colorClasses[color]}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default StatCard