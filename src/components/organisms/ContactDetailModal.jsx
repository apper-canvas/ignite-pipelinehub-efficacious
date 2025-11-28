import React, { useState } from "react"
import Button from "@/components/atoms/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import StageBadge from "@/components/molecules/StageBadge"
import PriorityBadge from "@/components/molecules/PriorityBadge"
import ApperIcon from "@/components/ApperIcon"
import { format } from "date-fns"

const ContactDetailModal = ({ 
  contact, 
  deals = [], 
  activities = [], 
  isOpen, 
  onClose, 
  onEdit,
  onEditDeal 
}) => {
  const [activeTab, setActiveTab] = useState("info")

  if (!isOpen || !contact) return null

  const contactDeals = deals.filter(deal => deal.contactId === contact.Id)
  const contactActivities = activities.filter(activity => activity.contactId === contact.Id)

  const getTotalValue = () => {
    return contactDeals.reduce((total, deal) => total + (deal.value || 0), 0)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const tabs = [
    { id: "info", label: "Contact Info", icon: "User" },
    { id: "deals", label: "Deals", icon: "Briefcase", count: contactDeals.length },
    { id: "activities", label: "Activities", icon: "Activity", count: contactActivities.length }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{contact.name}</h2>
              <p className="text-slate-600">{contact.company}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onEdit(contact)}>
              <ApperIcon name="Edit" className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <ApperIcon name="X" className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200">
          <nav className="flex px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <ApperIcon name={tab.icon} className="h-4 w-4" />
                {tab.label}
                {tab.count !== undefined && (
                  <Badge variant="secondary">{tab.count}</Badge>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === "info" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-500">Email</label>
                    <div className="flex items-center gap-2 mt-1">
                      <ApperIcon name="Mail" className="h-4 w-4 text-slate-400" />
                      <a href={`mailto:${contact.email}`} className="text-primary-600 hover:text-primary-700">
                        {contact.email}
                      </a>
                    </div>
                  </div>
                  
                  {contact.phone && (
                    <div>
                      <label className="text-sm font-medium text-slate-500">Phone</label>
                      <div className="flex items-center gap-2 mt-1">
                        <ApperIcon name="Phone" className="h-4 w-4 text-slate-400" />
                        <a href={`tel:${contact.phone}`} className="text-primary-600 hover:text-primary-700">
                          {contact.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {contact.company && (
                    <div>
                      <label className="text-sm font-medium text-slate-500">Company</label>
                      <div className="flex items-center gap-2 mt-1">
                        <ApperIcon name="Building" className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-900">{contact.company}</span>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="text-sm font-medium text-slate-500">Created</label>
                    <div className="flex items-center gap-2 mt-1">
                      <ApperIcon name="Calendar" className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">
                        {format(new Date(contact.createdAt), "MMM dd, yyyy")}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Additional Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-500">Tags</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {contact.tags?.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      )) || <span className="text-slate-400 text-sm">No tags</span>}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-500">Total Deal Value</label>
                    <div className="text-2xl font-bold text-primary-600 mt-1">
                      {formatCurrency(getTotalValue())}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-500">Active Deals</label>
                    <div className="text-lg font-semibold text-slate-900 mt-1">
                      {contactDeals.filter(deal => !["Won", "Lost"].includes(deal.stage)).length}
                    </div>
                  </div>
                  
                  {contact.notes && (
                    <div>
                      <label className="text-sm font-medium text-slate-500">Notes</label>
                      <p className="text-slate-700 mt-1">{contact.notes}</p>
                    </div>
                  )}
                </CardContent>
</Card>

              {/* System Information Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">System Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-500">Owner</label>
                    <div className="flex items-center gap-2 mt-1">
                      <ApperIcon name="User" className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-900">
                        {contact.Owner?.Name || 'Unassigned'}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-500">Created On</label>
                    <div className="flex items-center gap-2 mt-1">
                      <ApperIcon name="Calendar" className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">
                        {contact.CreatedOn ? format(new Date(contact.CreatedOn), "MMM dd, yyyy 'at' h:mm a") : 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-500">Created By</label>
                    <div className="flex items-center gap-2 mt-1">
                      <ApperIcon name="UserCheck" className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">
                        {contact.CreatedBy?.Name || 'System'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-500">Last Modified</label>
                    <div className="flex items-center gap-2 mt-1">
                      <ApperIcon name="Clock" className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">
                        {contact.ModifiedOn ? format(new Date(contact.ModifiedOn), "MMM dd, yyyy 'at' h:mm a") : 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-500">Modified By</label>
                    <div className="flex items-center gap-2 mt-1">
                      <ApperIcon name="UserCheck" className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">
                        {contact.ModifiedBy?.Name || 'System'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "deals" && (
            <div className="space-y-4">
              {contactDeals.length > 0 ? (
                contactDeals.map((deal) => (
                  <Card key={deal.Id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-slate-900">{deal.title}</h3>
                            <StageBadge stage={deal.stage} />
                            <PriorityBadge priority={deal.priority} />
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-600">
                            <span className="font-medium text-primary-600 text-lg">
                              {formatCurrency(deal.value)}
                            </span>
                            <span>{deal.probability}% probability</span>
                            {deal.expectedCloseDate && (
                              <span>
                                Due {format(new Date(deal.expectedCloseDate), "MMM dd, yyyy")}
                              </span>
                            )}
                          </div>
                          {deal.notes && (
                            <p className="text-sm text-slate-600 mt-2">{deal.notes}</p>
                          )}
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => onEditDeal(deal)}
                        >
                          <ApperIcon name="Edit" className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <ApperIcon name="Briefcase" className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No deals yet</h3>
                  <p className="text-slate-600">Create a deal for this contact to get started.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "activities" && (
            <div className="space-y-4">
              {contactActivities.length > 0 ? (
                contactActivities.map((activity) => (
                  <Card key={activity.Id}>
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <ApperIcon name="Activity" className="h-4 w-4 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">{activity.type}</Badge>
                            <span className="text-sm text-slate-500">
                              {format(new Date(activity.timestamp), "MMM dd, yyyy 'at' h:mm a")}
                            </span>
                          </div>
                          <p className="text-slate-900">{activity.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <ApperIcon name="Activity" className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No activities yet</h3>
                  <p className="text-slate-600">Activities with this contact will appear here.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContactDetailModal