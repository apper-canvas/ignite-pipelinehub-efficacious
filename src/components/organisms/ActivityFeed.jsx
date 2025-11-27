import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { format, isToday, isYesterday } from "date-fns"

const ActivityFeed = ({ activities = [], contacts = [], deals = [] }) => {
  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.Id === contactId)
    return contact?.name || "Unknown Contact"
  }

  const getDealTitle = (dealId) => {
    const deal = deals.find(d => d.Id === dealId)
    return deal?.title || "Unknown Deal"
  }

  const getActivityIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "call":
        return "Phone"
      case "email":
        return "Mail"
      case "meeting":
        return "Calendar"
      case "note":
        return "FileText"
      case "task":
        return "CheckSquare"
      default:
        return "Activity"
    }
  }

  const getActivityColor = (type) => {
    switch (type?.toLowerCase()) {
      case "call":
        return "text-primary-600 bg-primary-100"
      case "email":
        return "text-success-600 bg-success-100"
      case "meeting":
        return "text-warning-600 bg-warning-100"
      case "note":
        return "text-slate-600 bg-slate-100"
      case "task":
        return "text-purple-600 bg-purple-100"
      default:
        return "text-slate-600 bg-slate-100"
    }
  }

  const formatActivityDate = (date) => {
    const activityDate = new Date(date)
    if (isToday(activityDate)) {
      return `Today at ${format(activityDate, "h:mm a")}`
    }
    if (isYesterday(activityDate)) {
      return `Yesterday at ${format(activityDate, "h:mm a")}`
    }
    return format(activityDate, "MMM dd 'at' h:mm a")
  }

  const groupActivitiesByDate = (activities) => {
    const groups = {}
    activities.forEach(activity => {
      const date = format(new Date(activity.timestamp), "yyyy-MM-dd")
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(activity)
    })
    return groups
  }

  const activityGroups = groupActivitiesByDate(activities)
  const sortedDates = Object.keys(activityGroups).sort().reverse()

  if (!activities.length) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <ApperIcon name="Activity" className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No activities yet</h3>
          <p className="text-slate-600">
            Activities like calls, emails, and meetings will appear here.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {sortedDates.map(date => (
        <Card key={date}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wide">
              {format(new Date(date), "EEEE, MMMM dd, yyyy")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {activityGroups[date].map((activity, index) => (
                <div key={activity.Id} className="flex gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                    <ApperIcon 
                      name={getActivityIcon(activity.type)} 
                      className="h-5 w-5"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {activity.type}
                      </Badge>
                      <span className="text-sm text-slate-500">
                        {formatActivityDate(activity.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-slate-900 font-medium mb-1">
                      {activity.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      {activity.contactId && (
                        <span className="flex items-center gap-1">
                          <ApperIcon name="User" className="h-4 w-4" />
                          {getContactName(activity.contactId)}
                        </span>
                      )}
                      {activity.dealId && (
                        <span className="flex items-center gap-1">
                          <ApperIcon name="Briefcase" className="h-4 w-4" />
                          {getDealTitle(activity.dealId)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default ActivityFeed