import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

class DealsService {
  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    try {
      await this.delay();
      const apperClient = getApperClient();
      
      const response = await apperClient.fetchRecords('deal_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "contact_id_c"}},
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
      return response.data.map(deal => ({
        Id: deal.Id,
        title: deal.title_c || deal.Name,
        value: deal.value_c || 0,
        stage: deal.stage_c || "New",
        priority: deal.priority_c || "Medium", 
        probability: deal.probability_c || 50,
        expectedCloseDate: deal.expected_close_date_c,
        notes: deal.notes_c || "",
        contactId: deal.contact_id_c?.Id || deal.contact_id_c,
        createdAt: deal.CreatedOn,
        updatedAt: deal.ModifiedOn
      }));
    } catch (error) {
      console.error("Error fetching deals:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      await this.delay();
      const apperClient = getApperClient();
      
      const response = await apperClient.getRecordById('deal_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      });

      if (!response?.data) {
        return null;
      }

      const deal = response.data;
      return {
        Id: deal.Id,
        title: deal.title_c || deal.Name,
        value: deal.value_c || 0,
        stage: deal.stage_c || "New",
        priority: deal.priority_c || "Medium",
        probability: deal.probability_c || 50,
        expectedCloseDate: deal.expected_close_date_c,
        notes: deal.notes_c || "",
        contactId: deal.contact_id_c?.Id || deal.contact_id_c,
        createdAt: deal.CreatedOn,
        updatedAt: deal.ModifiedOn
      };
    } catch (error) {
      console.error(`Error fetching deal ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(dealData) {
    try {
      await this.delay();
      const apperClient = getApperClient();
      
      const params = {
        records: [{
          Name: dealData.title,
          title_c: dealData.title,
          value_c: parseFloat(dealData.value) || 0,
          stage_c: dealData.stage || "New",
          priority_c: dealData.priority || "Medium",
          probability_c: parseInt(dealData.probability) || 50,
          expected_close_date_c: dealData.expectedCloseDate || null,
          notes_c: dealData.notes || "",
          contact_id_c: dealData.contactId ? parseInt(dealData.contactId) : null
        }]
      };

      const response = await apperClient.createRecord('deal_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} deals:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const createdDeal = successful[0].data;
          return {
            Id: createdDeal.Id,
            title: createdDeal.title_c || createdDeal.Name,
            value: createdDeal.value_c || 0,
            stage: createdDeal.stage_c || "New",
            priority: createdDeal.priority_c || "Medium",
            probability: createdDeal.probability_c || 50,
            expectedCloseDate: createdDeal.expected_close_date_c,
            notes: createdDeal.notes_c || "",
            contactId: createdDeal.contact_id_c?.Id || createdDeal.contact_id_c,
            createdAt: createdDeal.CreatedOn,
            updatedAt: createdDeal.ModifiedOn
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating deal:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, dealData) {
    try {
      await this.delay();
      const apperClient = getApperClient();
      
      const updateFields = {};
      if (dealData.title !== undefined) {
        updateFields.Name = dealData.title;
        updateFields.title_c = dealData.title;
      }
      if (dealData.value !== undefined) {
        updateFields.value_c = parseFloat(dealData.value) || 0;
      }
      if (dealData.stage !== undefined) {
        updateFields.stage_c = dealData.stage;
      }
      if (dealData.priority !== undefined) {
        updateFields.priority_c = dealData.priority;
      }
      if (dealData.probability !== undefined) {
        updateFields.probability_c = parseInt(dealData.probability) || 50;
      }
      if (dealData.expectedCloseDate !== undefined) {
        updateFields.expected_close_date_c = dealData.expectedCloseDate;
      }
      if (dealData.notes !== undefined) {
        updateFields.notes_c = dealData.notes;
      }
      if (dealData.contactId !== undefined) {
        updateFields.contact_id_c = dealData.contactId ? parseInt(dealData.contactId) : null;
      }

      const params = {
        records: [{
          Id: parseInt(id),
          ...updateFields
        }]
      };

      const response = await apperClient.updateRecord('deal_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} deals:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updatedDeal = successful[0].data;
          return {
            Id: updatedDeal.Id,
            title: updatedDeal.title_c || updatedDeal.Name,
            value: updatedDeal.value_c || 0,
            stage: updatedDeal.stage_c || "New",
            priority: updatedDeal.priority_c || "Medium",
            probability: updatedDeal.probability_c || 50,
            expectedCloseDate: updatedDeal.expected_close_date_c,
            notes: updatedDeal.notes_c || "",
            contactId: updatedDeal.contact_id_c?.Id || updatedDeal.contact_id_c,
            createdAt: updatedDeal.CreatedOn,
            updatedAt: updatedDeal.ModifiedOn
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating deal:", error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord('deal_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} deals:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
      return false;
    } catch (error) {
      console.error("Error deleting deal:", error?.response?.data?.message || error);
      return false;
    }
  }

  async getByContactId(contactId) {
    try {
      await this.delay();
      const apperClient = getApperClient();
      
      const response = await apperClient.fetchRecords('deal_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "contact_id_c"}}
        ],
        where: [{
          "FieldName": "contact_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(contactId)]
        }]
      });

      if (!response.success || !response?.data?.length) {
        return [];
      }

      return response.data.map(deal => ({
        Id: deal.Id,
        title: deal.title_c || deal.Name,
        value: deal.value_c || 0,
        stage: deal.stage_c || "New",
        priority: deal.priority_c || "Medium",
        contactId: deal.contact_id_c?.Id || deal.contact_id_c
      }));
    } catch (error) {
      console.error("Error fetching deals by contact:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByStage(stage) {
    try {
      await this.delay();
      const apperClient = getApperClient();
      
      const response = await apperClient.fetchRecords('deal_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "contact_id_c"}}
        ],
        where: [{
          "FieldName": "stage_c",
          "Operator": "EqualTo",
          "Values": [stage]
        }]
      });

      if (!response.success || !response?.data?.length) {
        return [];
      }

      return response.data.map(deal => ({
        Id: deal.Id,
        title: deal.title_c || deal.Name,
        value: deal.value_c || 0,
        stage: deal.stage_c || "New",
        contactId: deal.contact_id_c?.Id || deal.contact_id_c
      }));
    } catch (error) {
      console.error("Error fetching deals by stage:", error?.response?.data?.message || error);
      return [];
    }
  }

  async updateStage(id, newStage) {
    return this.update(id, { stage: newStage });
  }
}

export default new DealsService();

export default new DealsService()