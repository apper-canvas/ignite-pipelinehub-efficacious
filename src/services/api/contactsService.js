import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

class ContactsService {
  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    try {
      await this.delay();
      const apperClient = getApperClient();
      
      const response = await apperClient.fetchRecords('contact_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response?.data?.length) {
        return [];
      }

      // Map database fields to expected UI format
      return response.data.map(contact => ({
        Id: contact.Id,
        name: contact.Name || `${contact.first_name_c || ''} ${contact.last_name_c || ''}`.trim(),
        firstName: contact.first_name_c || "",
        lastName: contact.last_name_c || "",
        email: contact.email_c || "",
        phone: contact.phone_c || "",
        company: contact.company_c || "",
        notes: contact.notes_c || "",
        tags: contact.Tags ? contact.Tags.split(',') : [],
        createdAt: contact.CreatedOn,
        updatedAt: contact.ModifiedOn
      }));
    } catch (error) {
      console.error("Error fetching contacts:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      await this.delay();
      const apperClient = getApperClient();
      
      const response = await apperClient.getRecordById('contact_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      });

      if (!response?.data) {
        return null;
      }

      const contact = response.data;
      return {
        Id: contact.Id,
        name: contact.Name || `${contact.first_name_c || ''} ${contact.last_name_c || ''}`.trim(),
        firstName: contact.first_name_c || "",
        lastName: contact.last_name_c || "",
        email: contact.email_c || "",
        phone: contact.phone_c || "",
        company: contact.company_c || "",
        notes: contact.notes_c || "",
        tags: contact.Tags ? contact.Tags.split(',') : [],
        createdAt: contact.CreatedOn,
        updatedAt: contact.ModifiedOn
      };
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(contactData) {
    try {
      await this.delay();
      const apperClient = getApperClient();
      
      const params = {
        records: [{
          Name: contactData.name,
          first_name_c: contactData.firstName || contactData.name?.split(' ')[0] || "",
          last_name_c: contactData.lastName || contactData.name?.split(' ').slice(1).join(' ') || "",
          email_c: contactData.email || "",
          phone_c: contactData.phone || "",
          company_c: contactData.company || "",
          notes_c: contactData.notes || "",
          Tags: Array.isArray(contactData.tags) ? contactData.tags.join(',') : (contactData.tags || "")
        }]
      };

      const response = await apperClient.createRecord('contact_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} contacts:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const createdContact = successful[0].data;
          return {
            Id: createdContact.Id,
            name: createdContact.Name,
            firstName: createdContact.first_name_c || "",
            lastName: createdContact.last_name_c || "",
            email: createdContact.email_c || "",
            phone: createdContact.phone_c || "",
            company: createdContact.company_c || "",
            notes: createdContact.notes_c || "",
            tags: createdContact.Tags ? createdContact.Tags.split(',') : [],
            createdAt: createdContact.CreatedOn,
            updatedAt: createdContact.ModifiedOn
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating contact:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, contactData) {
    try {
      await this.delay();
      const apperClient = getApperClient();
      
      const updateFields = {};
      if (contactData.name !== undefined) {
        updateFields.Name = contactData.name;
      }
      if (contactData.firstName !== undefined) {
        updateFields.first_name_c = contactData.firstName;
      }
      if (contactData.lastName !== undefined) {
        updateFields.last_name_c = contactData.lastName;
      }
      if (contactData.email !== undefined) {
        updateFields.email_c = contactData.email;
      }
      if (contactData.phone !== undefined) {
        updateFields.phone_c = contactData.phone;
      }
      if (contactData.company !== undefined) {
        updateFields.company_c = contactData.company;
      }
      if (contactData.notes !== undefined) {
        updateFields.notes_c = contactData.notes;
      }
      if (contactData.tags !== undefined) {
        updateFields.Tags = Array.isArray(contactData.tags) ? contactData.tags.join(',') : (contactData.tags || "");
      }

      const params = {
        records: [{
          Id: parseInt(id),
          ...updateFields
        }]
      };

      const response = await apperClient.updateRecord('contact_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} contacts:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updatedContact = successful[0].data;
          return {
            Id: updatedContact.Id,
            name: updatedContact.Name,
            firstName: updatedContact.first_name_c || "",
            lastName: updatedContact.last_name_c || "",
            email: updatedContact.email_c || "",
            phone: updatedContact.phone_c || "",
            company: updatedContact.company_c || "",
            notes: updatedContact.notes_c || "",
            tags: updatedContact.Tags ? updatedContact.Tags.split(',') : [],
            createdAt: updatedContact.CreatedOn,
            updatedAt: updatedContact.ModifiedOn
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating contact:", error?.response?.data?.message || error);
      return null;
    }
  }

  async delete(id) {
    try {
      await this.delay();
      const apperClient = getApperClient();
      
      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('contact_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} contacts:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
      return false;
    } catch (error) {
      console.error("Error deleting contact:", error?.response?.data?.message || error);
      return false;
    }
  }

  async search(query) {
    try {
      await this.delay();
      const apperClient = getApperClient();
      
      const response = await apperClient.fetchRecords('contact_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "Tags"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {
                  "fieldName": "Name",
                  "operator": "Contains",
                  "values": [query]
                }
              ],
              "operator": "OR"
            },
            {
              "conditions": [
                {
                  "fieldName": "email_c", 
                  "operator": "Contains",
                  "values": [query]
                }
              ],
              "operator": "OR"
            },
            {
              "conditions": [
                {
                  "fieldName": "company_c",
                  "operator": "Contains", 
                  "values": [query]
                }
              ],
              "operator": "OR"
            },
            {
              "conditions": [
                {
                  "fieldName": "Tags",
                  "operator": "Contains",
                  "values": [query]
                }
              ],
              "operator": "OR"
            }
          ]
        }]
      });

      if (!response.success || !response?.data?.length) {
        return [];
      }

      return response.data.map(contact => ({
        Id: contact.Id,
        name: contact.Name,
        email: contact.email_c || "",
        company: contact.company_c || "",
        tags: contact.Tags ? contact.Tags.split(',') : []
      }));
    } catch (error) {
      console.error("Error searching contacts:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export default new ContactsService();