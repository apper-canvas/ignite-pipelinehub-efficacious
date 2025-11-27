import { useState, useEffect } from "react"
import contactsService from "@/services/api/contactsService"

export const useContacts = () => {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadContacts = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await contactsService.getAll()
      setContacts(data)
    } catch (err) {
      setError(err.message || "Failed to load contacts")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContacts()
  }, [])

  const createContact = async (contactData) => {
    try {
      setError("")
      const newContact = await contactsService.create(contactData)
      setContacts(prev => [...prev, newContact])
      return newContact
    } catch (err) {
      setError(err.message || "Failed to create contact")
      throw err
    }
  }

  const updateContact = async (id, contactData) => {
    try {
      setError("")
      const updatedContact = await contactsService.update(id, contactData)
      setContacts(prev => prev.map(c => c.Id === id ? updatedContact : c))
      return updatedContact
    } catch (err) {
      setError(err.message || "Failed to update contact")
      throw err
    }
  }

  const deleteContact = async (id) => {
    try {
      setError("")
      await contactsService.delete(id)
      setContacts(prev => prev.filter(c => c.Id !== id))
    } catch (err) {
      setError(err.message || "Failed to delete contact")
      throw err
    }
  }

  const searchContacts = async (query) => {
    try {
      setError("")
      const results = await contactsService.search(query)
      return results
    } catch (err) {
      setError(err.message || "Failed to search contacts")
      return []
    }
  }

  return {
    contacts,
    loading,
    error,
    loadContacts,
    createContact,
    updateContact,
    deleteContact,
    searchContacts
  }
}