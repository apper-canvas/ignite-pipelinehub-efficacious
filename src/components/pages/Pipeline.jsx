import React, { useState, Suspense } from "react"
import PipelineBoard from "@/components/organisms/PipelineBoard"
import DealModal from "@/components/organisms/DealModal"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { useContacts } from "@/hooks/useContacts"
import { useDeals } from "@/hooks/useDeals"
import { usePipelineStages } from "@/hooks/usePipelineStages"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import { toast } from "react-toastify"

const Pipeline = () => {
  const [editingDeal, setEditingDeal] = useState(null)
  const [isDealModalOpen, setIsDealModalOpen] = useState(false)
  
  const { contacts, loading: contactsLoading, error: contactsError } = useContacts()
  const { deals, updateDealStage, updateDeal, deleteDeal, loading: dealsLoading, error: dealsError } = useDeals()
  const { stages, loading: stagesLoading, error: stagesError } = usePipelineStages()

  const loading = contactsLoading || dealsLoading || stagesLoading
  const error = contactsError || dealsError || stagesError

  if (loading) return <Loading />
  if (error) return <ErrorView error={error} />

  const handleDragStart = (deal) => {
    // Visual feedback is handled by the DealCard component
  }

  const handleDrop = async (dealId, newStage) => {
    try {
      await updateDealStage(dealId, newStage)
      toast.success(`Deal moved to ${newStage}`)
    } catch (error) {
      toast.error("Failed to update deal stage")
    }
  }

  const handleEditDeal = (deal) => {
    setEditingDeal(deal)
    setIsDealModalOpen(true)
  }

  const handleDeleteDeal = async (dealId) => {
    if (window.confirm("Are you sure you want to delete this deal?")) {
      try {
        await deleteDeal(dealId)
        toast.success("Deal deleted successfully")
      } catch (error) {
        toast.error("Failed to delete deal")
      }
    }
  }

  const handleSaveDeal = async (dealData) => {
    try {
      if (editingDeal) {
        await updateDeal(editingDeal.Id, dealData)
        toast.success("Deal updated successfully")
      }
      setIsDealModalOpen(false)
      setEditingDeal(null)
    } catch (error) {
      toast.error("Failed to save deal")
    }
  }

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

  const activeDeals = deals.filter(deal => !["Won", "Lost"].includes(deal.stage)).length

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Sales Pipeline</h1>
          <div className="flex items-center gap-6 mt-2">
            <p className="text-slate-600">
              <span className="font-semibold text-primary-600">{formatCurrency(totalPipelineValue)}</span> in pipeline
            </p>
            <p className="text-slate-600">
              <span className="font-semibold text-slate-900">{activeDeals}</span> active deals
            </p>
          </div>
        </div>
        
        <Button onClick={() => setIsDealModalOpen(true)}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Deal
        </Button>
      </div>

      <PipelineBoard
        deals={deals}
        contacts={contacts}
        stages={stages}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
        onEditDeal={handleEditDeal}
        onDeleteDeal={handleDeleteDeal}
      />

      <DealModal
        deal={editingDeal}
        contacts={contacts}
        stages={stages}
        isOpen={isDealModalOpen}
        onClose={() => {
          setIsDealModalOpen(false)
          setEditingDeal(null)
        }}
        onSave={handleSaveDeal}
      />
    </div>
  )
}

export default Pipeline