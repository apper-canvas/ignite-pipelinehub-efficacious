import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import DealCard from "@/components/organisms/DealCard"
import ApperIcon from "@/components/ApperIcon"

const PipelineBoard = ({ 
  deals = [], 
  contacts = [], 
  stages = [], 
  onDragStart, 
  onDrop, 
  onEditDeal, 
  onDeleteDeal 
}) => {
  const [draggedDeal, setDraggedDeal] = useState(null)
  const [dragOverStage, setDragOverStage] = useState(null)

  const getDealsForStage = (stageName) => {
    return deals.filter(deal => deal.stage === stageName)
  }

  const getContactForDeal = (contactId) => {
    return contacts.find(contact => contact.Id === contactId)
  }

  const getStageTotal = (stageName) => {
    const stageDeals = getDealsForStage(stageName)
    return stageDeals.reduce((total, deal) => total + (deal.value || 0), 0)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleDragStart = (deal) => {
    setDraggedDeal(deal)
    if (onDragStart) onDragStart(deal)
  }

  const handleDragEnd = () => {
    setDraggedDeal(null)
    setDragOverStage(null)
  }

  const handleDragOver = (e, stageName) => {
    e.preventDefault()
    setDragOverStage(stageName)
  }

  const handleDragLeave = () => {
    setDragOverStage(null)
  }

  const handleDrop = (e, stageName) => {
    e.preventDefault()
    if (draggedDeal && onDrop) {
      onDrop(draggedDeal.Id, stageName)
    }
    handleDragEnd()
  }

  const getStageColor = (stageName) => {
    switch (stageName.toLowerCase()) {
      case "won":
        return "border-success-500 bg-success-50"
      case "lost":
        return "border-error-500 bg-error-50"
      case "negotiation":
        return "border-warning-500 bg-warning-50"
      case "proposal":
        return "border-primary-500 bg-primary-50"
      default:
        return "border-slate-300 bg-slate-50"
    }
  }

  if (!stages.length) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="Workflow" className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No pipeline stages found</h3>
        <p className="text-slate-600">Set up your sales pipeline to start tracking deals.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-6 min-w-max pb-6">
        {stages.map((stage) => {
          const stageDeals = getDealsForStage(stage.name)
          const stageTotal = getStageTotal(stage.name)
          const isDragOver = dragOverStage === stage.name
          
          return (
            <div
              key={stage.Id}
              className={`flex-shrink-0 w-80 ${
                isDragOver ? "drop-zone active" : ""
              }`}
              onDragOver={(e) => handleDragOver(e, stage.name)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.name)}
            >
              <Card className={`h-full ${getStageColor(stage.name)}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-slate-900">
                      {stage.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">
                        {stageDeals.length}
                      </span>
                      <Button size="icon" variant="ghost" className="h-6 w-6">
                        <ApperIcon name="Plus" className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-slate-700">
                    {formatCurrency(stageTotal)}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {stageDeals.map((deal) => (
                      <div
                        key={deal.Id}
                        draggable
                        onDragStart={() => handleDragStart(deal)}
                        onDragEnd={handleDragEnd}
                        className="group"
                      >
                        <DealCard
                          deal={deal}
                          contact={getContactForDeal(deal.contactId)}
                          onEdit={onEditDeal}
                          onDelete={onDeleteDeal}
                          isDragging={draggedDeal?.Id === deal.Id}
                        />
                      </div>
                    ))}
                    
                    {stageDeals.length === 0 && (
                      <div className="text-center py-8 text-slate-400">
                        <ApperIcon name="Package" className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">No deals in this stage</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PipelineBoard