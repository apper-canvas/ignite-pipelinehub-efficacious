import { useState, useEffect } from "react"
import activitiesService from "@/services/api/activitiesService"

export const useActivities = () => {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadActivities = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await activitiesService.getAll()
      setActivities(data)
    } catch (err) {
      setError(err.message || "Failed to load activities")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadActivities()
  }, [])

  const createActivity = async (activityData) => {
    try {
      setError("")
      const newActivity = await activitiesService.create(activityData)
      setActivities(prev => [newActivity, ...prev])
      return newActivity
    } catch (err) {
      setError(err.message || "Failed to create activity")
      throw err
    }
  }

  const updateActivity = async (id, activityData) => {
    try {
      setError("")
      const updatedActivity = await activitiesService.update(id, activityData)
      setActivities(prev => prev.map(a => a.Id === id ? updatedActivity : a))
      return updatedActivity
    } catch (err) {
      setError(err.message || "Failed to update activity")
      throw err
    }
  }

  const deleteActivity = async (id) => {
    try {
      setError("")
      await activitiesService.delete(id)
      setActivities(prev => prev.filter(a => a.Id !== id))
    } catch (err) {
      setError(err.message || "Failed to delete activity")
      throw err
    }
  }

  const getRecentActivities = async (limit = 10) => {
    try {
      setError("")
      const data = await activitiesService.getRecent(limit)
      return data
    } catch (err) {
      setError(err.message || "Failed to load recent activities")
      return []
    }
  }

  return {
    activities,
    loading,
    error,
    loadActivities,
    createActivity,
    updateActivity,
    deleteActivity,
    getRecentActivities
  }
}