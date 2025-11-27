import React, { useState, useEffect } from "react"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"
import TagInput from "@/components/molecules/TagInput"
import ApperIcon from "@/components/ApperIcon"
import { toast } from "react-toastify"

const ContactModal = ({ 
  contact = null, 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    tags: [],
    notes: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name || "",
        email: contact.email || "",
        phone: contact.phone || "",
        company: contact.company || "",
        tags: contact.tags || [],
        notes: contact.notes || ""
      })
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        tags: [],
        notes: ""
      })
    }
    setErrors({})
  }, [contact, isOpen])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
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
      await onSave(formData)
      toast.success(contact ? "Contact updated successfully" : "Contact created successfully")
      onClose()
    } catch (error) {
      toast.error("Failed to save contact. Please try again.")
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
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto slide-in-right">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">
            {contact ? "Edit Contact" : "Add New Contact"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ApperIcon name="X" className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <FormField
            label="Full Name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            error={errors.name}
            required
            placeholder="Enter full name"
          />

          <FormField
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={errors.email}
            required
            placeholder="Enter email address"
          />

          <FormField
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            error={errors.phone}
            placeholder="Enter phone number"
          />

          <FormField
            label="Company"
            value={formData.company}
            onChange={(e) => handleChange("company", e.target.value)}
            error={errors.company}
            placeholder="Enter company name"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Tags</label>
            <TagInput
              tags={formData.tags}
              onChange={(tags) => handleChange("tags", tags)}
              placeholder="Add tags (press Enter)"
            />
          </div>

          <FormField
            label="Notes"
            type="textarea"
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            error={errors.notes}
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
                  {contact ? "Update Contact" : "Create Contact"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ContactModal