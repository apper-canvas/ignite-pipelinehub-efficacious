import React, { useState, Suspense } from "react"
import ActivityFeed from "@/components/organisms/ActivityFeed"
import Button from "@/components/atoms/Button"
import Select from "@/components/atoms/Select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"
import { useContacts } from "@/hooks/useContacts"
import { useDeals } from "@/hooks/useDeals"
import { useActivities } from "@/hooks/useActivities"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import { format, startOfWeek, startOfMonth, subWeeks, subMonths } from "date-fns"

const Activities = () => {
  const [timeFilter, setTimeFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  
  const { contacts, loading: contactsLoading, error: contactsError } = useContacts()
  const { deals, loading: dealsLoading, error: dealsError } = useDeals()
  const { activities, loading: activitiesLoading, error: activitiesError } = useActivities()

  const loading = contactsLoading || dealsLoading || activitiesLoading
  const error = contactsError || dealsError || activitiesError

  if (loading) return <Loading />
  if (error) return <ErrorView error={error} />

  const getFilteredActivities = () => {
    let filtered = [...activities]

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter(activity => 
        activity.type.toLowerCase() === typeFilter.toLowerCase()
      )
    }

    // Filter by time
    const now = new Date()
    switch (timeFilter) {
      case "today":
        filtered = filtered.filter(activity => {
          const activityDate = new Date(activity.timestamp)
          return format(activityDate, "yyyy-MM-dd") === format(now, "yyyy-MM-dd")
        })
        break
      case "week":
        const weekStart = startOfWeek(now)
        filtered = filtered.filter(activity => {
          const activityDate = new Date(activity.timestamp)
          return activityDate >= weekStart
        })
        break
      case "month":
        const monthStart = startOfMonth(now)
        filtered = filtered.filter(activity => {
          const activityDate = new Date(activity.timestamp)
          return activityDate >= monthStart
        })
        break
      default:
        // All activities
        break
    }

    return filtered
  }

  const getActivityStats = () => {
    const thisWeek = activities.filter(activity => {
      const activityDate = new Date(activity.timestamp)
      return activityDate >= startOfWeek(new Date())
    })

    const lastWeek = activities.filter(activity => {
      const activityDate = new Date(activity.timestamp)
      const lastWeekStart = startOfWeek(subWeeks(new Date(), 1))
      const lastWeekEnd = startOfWeek(new Date())
      return activityDate >= lastWeekStart && activityDate < lastWeekEnd
    })

    const typeStats = activities.reduce((stats, activity) => {
      const type = activity.type
      stats[type] = (stats[type] || 0) + 1
      return stats
    }, {})

    return {
      thisWeek: thisWeek.length,
      lastWeek: lastWeek.length,
      typeStats
    }
  }

  const filteredActivities = getFilteredActivities()
  const stats = getActivityStats()
  const activityTypes = Array.from(new Set(activities.map(a => a.type))).sort()

  const weekChange = stats.lastWeek === 0 ? 100 : 
    Math.round(((stats.thisWeek - stats.lastWeek) / stats.lastWeek) * 100)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Activities</h1>
          <p className="text-slate-600 mt-1">
            Track all customer interactions and communications
          </p>
        </div>
        
        <Button>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Log Activity
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600">This Week</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.thisWeek}</p>
                <div className="flex items-center mt-2">
                  <ApperIcon
                    name={weekChange >= 0 ? "TrendingUp" : "TrendingDown"}
                    className={`h-4 w-4 mr-1 ${
                      weekChange >= 0 ? "text-success-600" : "text-error-600"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      weekChange >= 0 ? "text-success-600" : "text-error-600"
                    }`}
                  >
                    {weekChange >= 0 ? "+" : ""}{weekChange}%
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-primary-100">
                <ApperIcon name="Activity" className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {Object.entries(stats.typeStats).slice(0, 3).map(([type, count]) => (
          <Card key={type}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-600">{type}s</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{count}</p>
                  <p className="text-sm text-slate-500 mt-2">All time</p>
                </div>
                <div className="p-3 rounded-full bg-slate-100">
                  <ApperIcon 
                    name={
                      type === "Call" ? "Phone" :
                      type === "Email" ? "Mail" :
                      type === "Meeting" ? "Calendar" : "FileText"
                    } 
                    className="h-6 w-6 text-slate-600" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="w-48"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </Select>
        
        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-48"
        >
          <option value="all">All Types</option>
          {activityTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </Select>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>Showing {filteredActivities.length} of {activities.length} activities</span>
        </div>
      </div>

      {/* Activities Feed */}
      <ActivityFeed
        activities={filteredActivities}
        contacts={contacts}
        deals={deals}
      />
    </div>
  )
}

export default Activities