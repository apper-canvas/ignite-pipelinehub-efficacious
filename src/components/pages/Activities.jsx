import React, { Suspense, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { useContacts } from "@/hooks/useContacts";
import { useDeals } from "@/hooks/useDeals";
import { useActivities } from "@/hooks/useActivities";
import { format, startOfMonth, startOfWeek, subMonths, subWeeks } from "date-fns";
import { toast } from "react-toastify";
import activitiesService from "@/services/api/activitiesService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import Label from "@/components/atoms/Label";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ActivityFeed from "@/components/organisms/ActivityFeed";

const Activities = () => {
  const [timeFilter, setTimeFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    contactId: "",
    dealId: ""
  })
  const [formErrors, setFormErrors] = useState({})
  
const { contacts, loading: contactsLoading, error: contactsError } = useContacts()
  const { deals, loading: dealsLoading, error: dealsError } = useDeals()
const { activities, loading: activitiesLoading, error: activitiesError, createActivity } = useActivities()

  const loading = contactsLoading || dealsLoading || activitiesLoading
  const error = contactsError || dealsError || activitiesError

  if (loading) return <Loading />
  if (error) return <ErrorView error={error} />

  const activityTypes = ["Call", "Email", "Meeting", "Note", "Task", "Follow-up"]

  const validateForm = () => {
    const errors = {}
    
    if (!formData.type.trim()) {
      errors.type = "Activity type is required"
    }
    
    if (!formData.description.trim()) {
      errors.description = "Description is required"
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ""
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
const activityData = {
        type: formData.type,
        description: formData.description,
        contactId: formData.contactId ? parseInt(formData.contactId) : null,
        dealId: formData.dealId ? parseInt(formData.dealId) : null,
        timestamp: new Date().toISOString(),
        userId: 1 // Mock user ID
      }
      
      await createActivity(activityData)
      
      // Reset form and close modal
      setFormData({
        type: "",
        description: "",
        contactId: "",
        dealId: ""
      })
      setFormErrors({})
      setIsModalOpen(false)
      
      toast.success("Activity logged successfully!")
      
    } catch (error) {
      console.error("Error creating activity:", error)
      toast.error("Failed to log activity. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseModal = () => {
    if (!isSubmitting) {
      setIsModalOpen(false)
      setFormData({
        type: "",
        description: "",
        contactId: "",
        dealId: ""
      })
      setFormErrors({})
    }
  }

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
        
<Button onClick={() => setIsModalOpen(true)}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Log Activity
        </Button>
      </div>

      {/* Activity Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Log New Activity</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                >
                  <ApperIcon name="X" className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <Label htmlFor="type" className="text-sm font-medium text-slate-700 mb-1 block">
                  Activity Type *
                </Label>
                <Select
                  id="type"
                  value={formData.type}
                  onChange={(e) => handleFormChange("type", e.target.value)}
                  className="w-full"
                  disabled={isSubmitting}
                >
                  <option value="">Select activity type</option>
                  {activityTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Select>
                {formErrors.type && (
                  <p className="text-sm text-error-600 mt-1">{formErrors.type}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium text-slate-700 mb-1 block">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleFormChange("description", e.target.value)}
                  placeholder="Describe the activity..."
                  rows={3}
                  className="w-full"
                  disabled={isSubmitting}
                />
                {formErrors.description && (
                  <p className="text-sm text-error-600 mt-1">{formErrors.description}</p>
                )}
              </div>

              <div>
                <Label htmlFor="contactId" className="text-sm font-medium text-slate-700 mb-1 block">
                  Related Contact (Optional)
                </Label>
                <Select
                  id="contactId"
                  value={formData.contactId}
                  onChange={(e) => handleFormChange("contactId", e.target.value)}
                  className="w-full"
                  disabled={isSubmitting}
                >
                  <option value="">Select contact</option>
                  {contacts?.map(contact => (
<option key={contact.Id} value={contact.Id}>
                      {contact.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label htmlFor="dealId" className="text-sm font-medium text-slate-700 mb-1 block">
                  Related Deal (Optional)
                </Label>
                <Select
                  id="dealId"
                  value={formData.dealId}
                  onChange={(e) => handleFormChange("dealId", e.target.value)}
                  className="w-full"
                  disabled={isSubmitting}
                >
                  <option value="">Select deal</option>
                  {deals?.map(deal => (
                    <option key={deal.Id} value={deal.Id}>
                      {deal.title}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-24"
                >
                  {isSubmitting ? (
                    <>
                      <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Log Activity"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

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