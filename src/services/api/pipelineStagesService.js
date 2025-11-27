import stagesData from "@/services/mockData/pipelineStages.json"

class PipelineStagesService {
  constructor() {
    this.stages = [...stagesData]
    this.loadFromStorage()
  }

  loadFromStorage() {
    const stored = localStorage.getItem("pipelinehub_stages")
    if (stored) {
      this.stages = JSON.parse(stored)
    }
  }

  saveToStorage() {
    localStorage.setItem("pipelinehub_stages", JSON.stringify(this.stages))
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }

  async getAll() {
    await this.delay()
    return [...this.stages].sort((a, b) => a.order - b.order)
  }

  async getById(id) {
    await this.delay()
    const stage = this.stages.find(s => s.Id === parseInt(id))
    return stage ? { ...stage } : null
  }

  async create(stageData) {
    await this.delay()
    
    const maxId = this.stages.reduce((max, stage) => Math.max(max, stage.Id), 0)
    const maxOrder = this.stages.reduce((max, stage) => Math.max(max, stage.order), 0)
    
    const newStage = {
      ...stageData,
      Id: maxId + 1,
      order: maxOrder + 1
    }
    
    this.stages.push(newStage)
    this.saveToStorage()
    return { ...newStage }
  }

  async update(id, stageData) {
    await this.delay()
    
    const index = this.stages.findIndex(s => s.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Stage not found")
    }
    
    this.stages[index] = {
      ...this.stages[index],
      ...stageData,
      Id: parseInt(id)
    }
    
    this.saveToStorage()
    return { ...this.stages[index] }
  }

  async delete(id) {
    await this.delay()
    
    const index = this.stages.findIndex(s => s.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Stage not found")
    }
    
    const deleted = this.stages.splice(index, 1)[0]
    this.saveToStorage()
    return { ...deleted }
  }
}

export default new PipelineStagesService()