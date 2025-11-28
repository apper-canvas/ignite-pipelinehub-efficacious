import React, { useState } from "react"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { format } from "date-fns"

const ContactTable = ({ 
  contacts = [], 
  deals = [], 
  onEdit, 
  onDelete, 
  onViewDetails, 
  sortConfig, 
  onSort 
}) => {
  const [selectedContacts, setSelectedContacts] = useState([])

  const getContactDeals = (contactId) => {
    return deals.filter(deal => deal.contactId === contactId)
  }

  const getContactValue = (contactId) => {
    const contactDeals = getContactDeals(contactId)
    return contactDeals.reduce((total, deal) => total + (deal.value || 0), 0)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleSelectAll = (checked) => {
    setSelectedContacts(checked ? contacts.map(c => c.Id) : [])
  }

  const handleSelectContact = (contactId, checked) => {
    if (checked) {
      setSelectedContacts([...selectedContacts, contactId])
    } else {
      setSelectedContacts(selectedContacts.filter(id => id !== contactId))
    }
  }

  const getSortIcon = (column) => {
    if (sortConfig.key !== column) return "ArrowUpDown"
    return sortConfig.direction === "asc" ? "ArrowUp" : "ArrowDown"
  }

const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "company", label: "Company", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "phone", label: "Phone", sortable: false },
    { key: "tags", label: "Tags", sortable: false },
    { key: "owner", label: "Owner", sortable: true },
    { key: "deals", label: "Deals", sortable: false },
    { key: "value", label: "Total Value", sortable: true },
    { key: "createdAt", label: "Created On", sortable: true },
    { key: "createdBy", label: "Created By", sortable: true },
    { key: "updatedAt", label: "Modified On", sortable: true },
    { key: "modifiedBy", label: "Modified By", sortable: true },
    { key: "actions", label: "Actions", sortable: false },
  ]

  if (!contacts.length) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-12">
        <div className="text-center">
          <ApperIcon name="Users" className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No contacts found</h3>
          <p className="text-slate-600">Start building your customer relationships by adding your first contact.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      {/* Bulk Actions */}
      {selectedContacts.length > 0 && (
        <div className="bg-primary-50 border-b border-primary-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-primary-700">
              {selectedContacts.length} contact{selectedContacts.length > 1 ? "s" : ""} selected
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <ApperIcon name="Mail" className="h-4 w-4 mr-1" />
                Email
              </Button>
              <Button size="sm" variant="destructive">
                <ApperIcon name="Trash2" className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="w-8 p-4">
                <input
                  type="checkbox"
                  checked={selectedContacts.length === contacts.length && contacts.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
              </th>
              {columns.map((column) => (
                <th key={column.key} className="text-left p-4">
                  {column.sortable ? (
                    <button
                      onClick={() => onSort(column.key)}
                      className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                    >
                      {column.label}
                      <ApperIcon 
                        name={getSortIcon(column.key)} 
                        className="h-4 w-4 text-slate-400" 
                      />
                    </button>
                  ) : (
                    <span className="text-sm font-medium text-slate-700">
                      {column.label}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact, index) => {
              const contactDeals = getContactDeals(contact.Id)
              const contactValue = getContactValue(contact.Id)
              const isSelected = selectedContacts.includes(contact.Id)
              
              return (
                <tr 
                  key={contact.Id}
                  className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                    isSelected ? "bg-primary-50" : ""
                  }`}
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleSelectContact(contact.Id, e.target.checked)}
                      className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                  
                  <td className="p-4">
                    <button
                      onClick={() => onViewDetails(contact)}
                      className="text-left hover:text-primary-600 transition-colors"
                    >
                      <div className="font-medium text-slate-900">{contact.name}</div>
                    </button>
                  </td>
                  
                  <td className="p-4">
                    <span className="text-slate-600">{contact.company || "-"}</span>
                  </td>
                  
                  <td className="p-4">
                    <a 
                      href={`mailto:${contact.email}`}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      {contact.email}
                    </a>
                  </td>
                  
                  <td className="p-4">
                    <span className="text-slate-600">{contact.phone || "-"}</span>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {contact.tags?.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {contact.tags?.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{contact.tags.length - 2}
                        </Badge>
                      )}
                    </div>
</td>

                  {/* Owner */}
                  <td className="p-4">
                    <span className="text-sm text-slate-600">
                      {contact.owner?.Name || 'Unassigned'}
                    </span>
                  </td>
                  
                  <td className="p-4">
                    <span className="text-sm text-slate-600">
                      {contactDeals.length} deal{contactDeals.length !== 1 ? "s" : ""}
                    </span>
                  </td>
                  
                  <td className="p-4">
                    <span className="font-medium text-slate-900">
                      {formatCurrency(contactValue)}
                    </span>
                  </td>
                  
<td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-success-600">
                        ${contactValue.toLocaleString()}
                      </span>
                    </div>
                  </td>

                  {/* Created On */}
                  <td className="p-4">
                    <span className="text-sm text-slate-500">
                      {contact.createdAt ? format(new Date(contact.createdAt), "MMM dd, yyyy") : 'N/A'}
                    </span>
                  </td>

                  {/* Created By */}
                  <td className="p-4">
                    <span className="text-sm text-slate-600">
                      {contact.createdBy?.Name || 'System'}
                    </span>
                  </td>

                  {/* Modified On */}
                  <td className="p-4">
                    <span className="text-sm text-slate-500">
                      {contact.updatedAt ? format(new Date(contact.updatedAt), "MMM dd, yyyy") : 'N/A'}
                    </span>
                  </td>

                  {/* Modified By */}
                  <td className="p-4">
                    <span className="text-sm text-slate-600">
                      {contact.modifiedBy?.Name || 'System'}
                    </span>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button 
                        size="icon" 
                        variant="ghost"
                        onClick={() => onViewDetails(contact)}
                      >
                        <ApperIcon name="Eye" className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost"
                        onClick={() => onEdit(contact)}
                      >
                        <ApperIcon name="Edit" className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost"
                        onClick={() => onDelete(contact.Id)}
                        className="text-error-600 hover:text-error-700 hover:bg-error-50"
                      >
                        <ApperIcon name="Trash2" className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ContactTable