import React, { useState, useEffect } from "react"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"
import ApperIcon from "@/components/ApperIcon"
import { toast } from "react-toastify"
import { format } from "date-fns"

const DealModal = ({ 
  deal = null, 
  contacts = [], 
  stages = [], 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    title: "",
    value: "",
stage: "New",
    priority: "Medium",
    contactId: "",
    expectedCloseDate: "",
    probability: 50,
    notes: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (deal) {
setFormData({
        title: deal.title || "",
        value: deal.value || "",
        stage: deal.stage || "New",
        priority: deal.priority || "Medium",
        contactId: deal.contactId || "",
        expectedCloseDate: deal.expectedCloseDate ? format(new Date(deal.expectedCloseDate), "yyyy-MM-dd") : "",
        probability: deal.probability || 50,
        notes: deal.notes || ""
      })
    } else {
      setFormData({
        title: "",
        value: "",
        stage: stages[0]?.name || "Lead",
        priority: "Medium",
        contactId: "",
        expectedCloseDate: "",
        probability: 50,
        notes: ""
      })
    }
    setErrors({})
  }, [deal, isOpen, stages])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = "Deal title is required"
    }
    
    if (!formData.value || formData.value <= 0) {
      newErrors.value = "Deal value must be greater than 0"
    }

    if (!formData.contactId) {
      newErrors.contactId = "Please select a contact"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      const dealData = {
        ...formData,
        value: parseFloat(formData.value),
        probability: parseInt(formData.probability),
        expectedCloseDate: formData.expectedCloseDate ? new Date(formData.expectedCloseDate).toISOString() : null
      }
      
      await onSave(dealData)
      toast.success(deal ? "Deal updated successfully" : "Deal created successfully")
      onClose()
    } catch (error) {
      toast.error("Failed to save deal. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto slide-in-right">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">
            {deal ? "Edit Deal" : "Add New Deal"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ApperIcon name="X" className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <FormField
            label="Deal Title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            error={errors.title}
            required
            placeholder="Enter deal title"
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Deal Value"
              type="number"
              value={formData.value}
              onChange={(e) => handleChange("value", e.target.value)}
              error={errors.value}
              required
              placeholder="0"
            />

            <FormField
              label="Probability (%)"
              type="number"
              min="0"
              max="100"
              value={formData.probability}
              onChange={(e) => handleChange("probability", e.target.value)}
              placeholder="50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Stage"
              type="select"
              value={formData.stage}
              onChange={(e) => handleChange("stage", e.target.value)}
              required
            >
{/* Use exact database picklist values */}
              {['New', 'Qualification', 'Proposal', 'Negotiation', 'Won', 'Lost'].map((stageName) => (
                <option key={stageName} value={stageName}>
                  {stageName}
                </option>
              ))}
            </FormField>

            <FormField
              label="Priority"
              type="select"
              value={formData.priority}
              onChange={(e) => handleChange("priority", e.target.value)}
              required
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </FormField>
          </div>

          <FormField
            label="Contact"
            type="select"
            value={formData.contactId}
            onChange={(e) => handleChange("contactId", e.target.value)}
            error={errors.contactId}
            required
          >
            <option value="">Select a contact</option>
            {contacts.map((contact) => (
              <option key={contact.Id} value={contact.Id}>
                {contact.name} - {contact.company}
              </option>
            ))}
          </FormField>

          <FormField
            label="Expected Close Date"
            type="date"
            value={formData.expectedCloseDate}
            onChange={(e) => handleChange("expectedCloseDate", e.target.value)}
          />

          <FormField
            label="Notes"
            type="textarea"
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="Add any additional notes..."
            rows={3}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                  {deal ? "Update Deal" : "Create Deal"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DealModal