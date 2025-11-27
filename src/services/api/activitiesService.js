import activitiesData from "@/services/mockData/activities.json"

class ActivitiesService {
  constructor() {
    this.activities = [...activitiesData]
    this.loadFromStorage()
  }

  loadFromStorage() {
    const stored = localStorage.getItem("pipelinehub_activities")
    if (stored) {
      this.activities = JSON.parse(stored)
    }
  }

  saveToStorage() {
    localStorage.setItem("pipelinehub_activities", JSON.stringify(this.activities))
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }

  async getAll() {
    await this.delay()
    return [...this.activities].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  async getById(id) {
    await this.delay()
    const activity = this.activities.find(a => a.Id === parseInt(id))
    return activity ? { ...activity } : null
  }

  async create(activityData) {
    await this.delay()
    
    const maxId = this.activities.reduce((max, activity) => Math.max(max, activity.Id), 0)
    const newActivity = {
      ...activityData,
      Id: maxId + 1,
      timestamp: new Date().toISOString(),
      userId: "user1"
    }
    
    this.activities.push(newActivity)
    this.saveToStorage()
    return { ...newActivity }
  }

  async update(id, activityData) {
    await this.delay()
    
    const index = this.activities.findIndex(a => a.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Activity not found")
    }
    
    this.activities[index] = {
      ...this.activities[index],
      ...activityData,
      Id: parseInt(id)
    }
    
    this.saveToStorage()
    return { ...this.activities[index] }
  }

  async delete(id) {
    await this.delay()
    
    const index = this.activities.findIndex(a => a.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Activity not found")
    }
    
    const deleted = this.activities.splice(index, 1)[0]
    this.saveToStorage()
    return { ...deleted }
  }

  async getByContactId(contactId) {
    await this.delay()
    return this.activities
      .filter(activity => activity.contactId === parseInt(contactId))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  async getByDealId(dealId) {
    await this.delay()
    return this.activities
      .filter(activity => activity.dealId === parseInt(dealId))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  async getRecent(limit = 10) {
    await this.delay()
    return [...this.activities]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit)
  }
}

export default new ActivitiesService()