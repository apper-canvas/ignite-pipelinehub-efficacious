import dealsData from "@/services/mockData/deals.json";

class DealsService {
  constructor() {
    this.deals = [...dealsData]
    this.loadFromStorage()
  }

  loadFromStorage() {
    const stored = localStorage.getItem("pipelinehub_deals")
    if (stored) {
      this.deals = JSON.parse(stored)
    }
  }

  saveToStorage() {
    localStorage.setItem("pipelinehub_deals", JSON.stringify(this.deals))
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }

  async getAll() {
    await this.delay()
    return [...this.deals]
  }

async getById(id) {
    await this.delay()
    const deal = this.deals.find(d => d.Id === parseInt(id))
    return deal ? { ...deal } : null
  }

async create(dealData) {
    await this.delay()
    
    const maxId = this.deals.reduce((max, deal) => Math.max(max, deal.Id), 0)
    const newDeal = {
      ...dealData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    this.deals.push(newDeal)
    this.saveToStorage()
    return { ...newDeal }
  }

async update(id, dealData) {
    await this.delay()
    
    const index = this.deals.findIndex(d => d.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Deal not found")
    }
    
    this.deals[index] = {
      ...this.deals[index],
      ...dealData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    }
    
    this.saveToStorage()
    return { ...this.deals[index] }
  }

async delete(id) {
    await this.delay()
    
    const index = this.deals.findIndex(d => d.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Deal not found")
    }
    
    const deleted = this.deals.splice(index, 1)[0]
    this.saveToStorage()
    return { ...deleted }
  }

  async getByContactId(contactId) {
    await this.delay()
    return this.deals.filter(deal => deal.contactId === parseInt(contactId))
  }

  async getByStage(stage) {
    await this.delay()
    return this.deals.filter(deal => deal.stage === stage)
  }

  async updateStage(id, newStage) {
    return this.update(id, { stage: newStage })
  }
}

export default new DealsService()