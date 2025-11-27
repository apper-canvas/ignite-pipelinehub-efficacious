import contactsData from "@/services/mockData/contacts.json"

class ContactsService {
  constructor() {
    this.contacts = [...contactsData]
    this.loadFromStorage()
  }

  loadFromStorage() {
    const stored = localStorage.getItem("pipelinehub_contacts")
    if (stored) {
      this.contacts = JSON.parse(stored)
    }
  }

  saveToStorage() {
    localStorage.setItem("pipelinehub_contacts", JSON.stringify(this.contacts))
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }

  async getAll() {
    await this.delay()
    return [...this.contacts]
  }

  async getById(id) {
    await this.delay()
    const contact = this.contacts.find(c => c.Id === parseInt(id))
    return contact ? { ...contact } : null
  }

  async create(contactData) {
    await this.delay()
    
    const maxId = this.contacts.reduce((max, contact) => Math.max(max, contact.Id), 0)
    const newContact = {
      ...contactData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    this.contacts.push(newContact)
    this.saveToStorage()
    return { ...newContact }
  }

  async update(id, contactData) {
    await this.delay()
    
    const index = this.contacts.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Contact not found")
    }
    
    this.contacts[index] = {
      ...this.contacts[index],
      ...contactData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    }
    
    this.saveToStorage()
    return { ...this.contacts[index] }
  }

  async delete(id) {
    await this.delay()
    
    const index = this.contacts.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Contact not found")
    }
    
    const deleted = this.contacts.splice(index, 1)[0]
    this.saveToStorage()
    return { ...deleted }
  }

  async search(query) {
    await this.delay()
    
    const searchTerm = query.toLowerCase()
    return this.contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm) ||
      contact.email.toLowerCase().includes(searchTerm) ||
      contact.company?.toLowerCase().includes(searchTerm) ||
      contact.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }
}

export default new ContactsService()