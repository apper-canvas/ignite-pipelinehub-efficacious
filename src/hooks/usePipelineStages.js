import { useState, useEffect } from "react"
import pipelineStagesService from "@/services/api/pipelineStagesService"

export const usePipelineStages = () => {
  const [stages, setStages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadStages = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await pipelineStagesService.getAll()
      setStages(data)
    } catch (err) {
      setError(err.message || "Failed to load pipeline stages")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStages()
  }, [])

  const createStage = async (stageData) => {
    try {
      setError("")
      const newStage = await pipelineStagesService.create(stageData)
      setStages(prev => [...prev, newStage].sort((a, b) => a.order - b.order))
      return newStage
    } catch (err) {
      setError(err.message || "Failed to create stage")
      throw err
    }
  }

  const updateStage = async (id, stageData) => {
    try {
      setError("")
      const updatedStage = await pipelineStagesService.update(id, stageData)
      setStages(prev => prev.map(s => s.Id === id ? updatedStage : s).sort((a, b) => a.order - b.order))
      return updatedStage
    } catch (err) {
      setError(err.message || "Failed to update stage")
      throw err
    }
  }

  const deleteStage = async (id) => {
    try {
      setError("")
      await pipelineStagesService.delete(id)
      setStages(prev => prev.filter(s => s.Id !== id))
    } catch (err) {
      setError(err.message || "Failed to delete stage")
      throw err
    }
  }

  return {
    stages,
    loading,
    error,
    loadStages,
    createStage,
    updateStage,
    deleteStage
  }
}