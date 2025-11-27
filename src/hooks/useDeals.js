import { useState, useEffect } from "react"
import dealsService from "@/services/api/dealsService"

export const useDeals = () => {
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadDeals = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await dealsService.getAll()
      setDeals(data)
    } catch (err) {
      setError(err.message || "Failed to load deals")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDeals()
  }, [])

  const createDeal = async (dealData) => {
    try {
      setError("")
      const newDeal = await dealsService.create(dealData)
      setDeals(prev => [...prev, newDeal])
      return newDeal
    } catch (err) {
      setError(err.message || "Failed to create deal")
      throw err
    }
  }

  const updateDeal = async (id, dealData) => {
    try {
setError("")
      const updatedDeal = await dealsService.update(id, dealData)
      setDeals(prev => prev.map(d => d.Id === parseInt(id) ? updatedDeal : d))
      return updatedDeal
    } catch (err) {
      setError(err.message || "Failed to update deal")
      throw err
    }
  }

  const deleteDeal = async (id) => {
    try {
      setError("")
await dealsService.delete(id)
      setDeals(prev => prev.filter(d => d.Id !== parseInt(id)))
    } catch (err) {
      setError(err.message || "Failed to delete deal")
      throw err
    }
  }

  const updateDealStage = async (id, newStage) => {
    try {
      setError("")
const updatedDeal = await dealsService.updateStage(id, newStage)
      setDeals(prev => prev.map(d => d.Id === parseInt(id) ? updatedDeal : d))
      return updatedDeal
    } catch (err) {
      setError(err.message || "Failed to update deal stage")
      throw err
    }
  }

  return {
    deals,
    loading,
    error,
    loadDeals,
    createDeal,
    updateDeal,
    deleteDeal,
    updateDealStage
  }
}