import React, { useState, Suspense } from "react"
import ContactTable from "@/components/organisms/ContactTable"
import ContactModal from "@/components/organisms/ContactModal"
import ContactDetailModal from "@/components/organisms/ContactDetailModal"
import SearchBar from "@/components/molecules/SearchBar"
import Button from "@/components/atoms/Button"
import Select from "@/components/atoms/Select"
import ApperIcon from "@/components/ApperIcon"
import { useContacts } from "@/hooks/useContacts"
import { useDeals } from "@/hooks/useDeals"
import { useActivities } from "@/hooks/useActivities"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import { toast } from "react-toastify"

const Contacts = () => {
  const [editingContact, setEditingContact] = useState(null)
  const [viewingContact, setViewingContact] = useState(null)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [tagFilter, setTagFilter] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: "updatedAt", direction: "desc" })
  
const { contacts, createContact, updateContact, deleteContact, loading: contactsLoading, error: contactsError } = useContacts()
  const { deals, updateDeal, loading: dealsLoading, error: dealsError } = useDeals()
  const { activities, loading: activitiesLoading, error: activitiesError } = useActivities()

  const loading = contactsLoading || dealsLoading || activitiesLoading
  const error = contactsError || dealsError || activitiesError

  if (loading) return <Loading />
  if (error) return <ErrorView error={error} />

  const getAllTags = () => {
    const tags = new Set()
    contacts.forEach(contact => {
      contact.tags?.forEach(tag => tags.add(tag))
    })
    return Array.from(tags).sort()
  }

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = !searchQuery || 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTag = !tagFilter || contact.tags?.includes(tagFilter)
    
    return matchesSearch && matchesTag
  })

  const sortedContacts = [...filteredContacts].sort((a, b) => {
    const { key, direction } = sortConfig
    let aVal = a[key]
    let bVal = b[key]

    if (key === "value") {
      const aDeals = deals.filter(deal => deal.contactId === a.Id)
      const bDeals = deals.filter(deal => deal.contactId === b.Id)
      aVal = aDeals.reduce((total, deal) => total + (deal.value || 0), 0)
      bVal = bDeals.reduce((total, deal) => total + (deal.value || 0), 0)
    }

    if (key === "updatedAt" || key === "createdAt") {
      aVal = new Date(aVal)
      bVal = new Date(bVal)
    }

    if (typeof aVal === "string") {
      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()
    }

    if (aVal < bVal) return direction === "asc" ? -1 : 1
    if (aVal > bVal) return direction === "asc" ? 1 : -1
    return 0
  })

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }))
  }

  const handleEditContact = (contact) => {
    setEditingContact(contact)
    setIsContactModalOpen(true)
  }

  const handleViewDetails = (contact) => {
    setViewingContact(contact)
    setIsDetailModalOpen(true)
  }

  const handleDeleteContact = async (contactId) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await deleteContact(contactId)
        toast.success("Contact deleted successfully")
      } catch (error) {
        toast.error("Failed to delete contact")
      }
    }
  }

const handleSaveContact = async (contactData) => {
    try {
      if (editingContact) {
        await updateContact(editingContact.Id, contactData)
        toast.success("Contact updated successfully")
      } else {
        await createContact(contactData)
        toast.success("Contact created successfully")
      }
      setIsContactModalOpen(false)
      setEditingContact(null)
    } catch (error) {
      toast.error("Failed to save contact")
    }
  }

  const handleEditDeal = (deal) => {
    // This would open a deal modal - for now just show a toast
    toast.info("Deal editing from contact view coming soon")
  }

  const allTags = getAllTags()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Contacts</h1>
          <p className="text-slate-600 mt-1">
            Manage your customer relationships and track interactions
          </p>
        </div>
        
        <Button onClick={() => setIsContactModalOpen(true)}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <SearchBar
          placeholder="Search contacts..."
          onSearch={setSearchQuery}
          className="flex-1 max-w-md"
        />
        
        <Select
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          className="w-48"
        >
          <option value="">All Tags</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </Select>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>Showing {sortedContacts.length} of {contacts.length} contacts</span>
        </div>
      </div>

      {/* Contacts Table */}
      <ContactTable
        contacts={sortedContacts}
        deals={deals}
        onEdit={handleEditContact}
        onDelete={handleDeleteContact}
        onViewDetails={handleViewDetails}
        sortConfig={sortConfig}
        onSort={handleSort}
      />

      {/* Contact Modal */}
      <ContactModal
        contact={editingContact}
        isOpen={isContactModalOpen}
        onClose={() => {
          setIsContactModalOpen(false)
          setEditingContact(null)
        }}
        onSave={handleSaveContact}
      />

      {/* Contact Detail Modal */}
      <ContactDetailModal
        contact={viewingContact}
        deals={deals.filter(deal => deal.contactId === viewingContact?.Id)}
        activities={activities.filter(activity => activity.contactId === viewingContact?.Id)}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setViewingContact(null)
        }}
        onEdit={handleEditContact}
        onEditDeal={handleEditDeal}
      />
    </div>
  )
}

export default Contacts