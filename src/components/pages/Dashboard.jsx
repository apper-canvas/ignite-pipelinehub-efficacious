import React, { Suspense } from "react"
import StatCard from "@/components/molecules/StatCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import ActivityFeed from "@/components/organisms/ActivityFeed"
import ApperIcon from "@/components/ApperIcon"
import { useContacts } from "@/hooks/useContacts"
import { useDeals } from "@/hooks/useDeals"
import { useActivities } from "@/hooks/useActivities"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"

const Dashboard = () => {
  const { contacts, loading: contactsLoading, error: contactsError } = useContacts()
  const { deals, loading: dealsLoading, error: dealsError } = useDeals()
  const { activities, loading: activitiesLoading, error: activitiesError } = useActivities()

  const loading = contactsLoading || dealsLoading || activitiesLoading
  const error = contactsError || dealsError || activitiesError

  if (loading) return <Loading />
  if (error) return <ErrorView error={error} />

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const totalPipelineValue = deals
    .filter(deal => !["Won", "Lost"].includes(deal.stage))
    .reduce((total, deal) => total + (deal.value || 0), 0)

  const wonDealsValue = deals
    .filter(deal => deal.stage === "Won")
    .reduce((total, deal) => total + (deal.value || 0), 0)

  const activeDeals = deals.filter(deal => !["Won", "Lost"].includes(deal.stage))
  const highPriorityDeals = deals.filter(deal => deal.priority === "High" && !["Won", "Lost"].includes(deal.stage))

  const recentActivities = activities.slice(0, 8)

  const getUpcomingDeals = () => {
    const today = new Date()
    const nextWeek = new Date(today)
    nextWeek.setDate(today.getDate() + 7)

    return deals.filter(deal => {
      if (!deal.expectedCloseDate || ["Won", "Lost"].includes(deal.stage)) return false
      const closeDate = new Date(deal.expectedCloseDate)
      return closeDate >= today && closeDate <= nextWeek
    })
  }

  const upcomingDeals = getUpcomingDeals()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back! Here's what's happening with your sales pipeline.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Pipeline Value"
          value={formatCurrency(totalPipelineValue)}
          change="+12.5%"
          changeType="positive"
          icon="DollarSign"
          color="primary"
        />
        <StatCard
          title="Active Deals"
          value={activeDeals.length.toString()}
          change="+3 this week"
          changeType="positive"
          icon="Briefcase"
          color="success"
        />
        <StatCard
          title="Total Contacts"
          value={contacts.length.toString()}
          change="+5 new"
          changeType="positive"
          icon="Users"
          color="warning"
        />
        <StatCard
          title="Won This Month"
          value={formatCurrency(wonDealsValue)}
          change="+8.2%"
          changeType="positive"
          icon="TrendingUp"
          color="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ApperIcon name="Activity" className="h-5 w-5" />
                  Recent Activities
                </CardTitle>
                <ApperIcon name="MoreHorizontal" className="h-5 w-5 text-slate-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.slice(0, 5).map((activity) => {
                  const contact = contacts.find(c => c.Id === activity.contactId)
                  const deal = deals.find(d => d.Id === activity.dealId)
                  
                  return (
                    <div key={activity.Id} className="flex gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <ApperIcon 
                          name={activity.type === "Call" ? "Phone" : activity.type === "Email" ? "Mail" : "Calendar"} 
                          className="h-4 w-4 text-primary-600" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-900 font-medium">
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                          <span>{contact?.name}</span>
                          {deal && (
                            <>
                              <span>•</span>
                              <span>{deal.title}</span>
                            </>
                          )}
                          <span>•</span>
                          <span>{new Date(activity.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          {/* High Priority Deals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ApperIcon name="AlertTriangle" className="h-5 w-5 text-warning-600" />
                High Priority Deals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {highPriorityDeals.slice(0, 3).map((deal) => {
                  const contact = contacts.find(c => c.Id === deal.contactId)
                  return (
                    <div key={deal.Id} className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {deal.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>{contact?.name}</span>
                          <span>•</span>
                          <span className="font-medium text-primary-600">
                            {formatCurrency(deal.value)}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-slate-500">
                        {deal.probability}%
                      </div>
                    </div>
                  )
                })}
                {highPriorityDeals.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-4">
                    No high priority deals
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Closes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ApperIcon name="Clock" className="h-5 w-5 text-primary-600" />
                Closing This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingDeals.slice(0, 3).map((deal) => {
                  const contact = contacts.find(c => c.Id === deal.contactId)
                  return (
                    <div key={deal.Id} className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {deal.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>{contact?.name}</span>
                          <span>•</span>
                          <span className="font-medium text-primary-600">
                            {formatCurrency(deal.value)}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(deal.expectedCloseDate).toLocaleDateString()}
                      </div>
                    </div>
                  )
                })}
                {upcomingDeals.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-4">
                    No deals closing this week
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pipeline Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ApperIcon name="BarChart3" className="h-5 w-5 text-success-600" />
                Pipeline Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["Lead", "Qualified", "Proposal", "Negotiation"].map((stage) => {
                  const stageDeals = deals.filter(deal => deal.stage === stage)
                  const stageValue = stageDeals.reduce((total, deal) => total + (deal.value || 0), 0)
                  
                  return (
                    <div key={stage} className="flex items-center justify-between">
                      <div className="text-sm text-slate-600">{stage}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">
                          {stageDeals.length} deals
                        </span>
                        <span className="text-sm font-medium text-slate-900">
                          {formatCurrency(stageValue)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Dashboard