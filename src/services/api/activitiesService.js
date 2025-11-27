import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

class ActivitiesService {
  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    try {
      await this.delay();
      const apperClient = getApperClient();
      
      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "Owner"}}
        ],
        orderBy: [{
          "fieldName": "CreatedOn",
          "sorttype": "DESC"
        }]
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
      return response.data.map(activity => ({
        Id: activity.Id,
        type: activity.type_c || "Call",
        description: activity.description_c || activity.Name,
        contactId: activity.contact_id_c?.Id || activity.contact_id_c,
        dealId: activity.deal_id_c?.Id || activity.deal_id_c,
        timestamp: activity.CreatedOn,
        userId: activity.Owner?.Id || activity.Owner || "user1",
        createdAt: activity.CreatedOn,
        updatedAt: activity.ModifiedOn
      }));
    } catch (error) {
      console.error("Error fetching activities:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      await this.delay();
      const apperClient = getApperClient();
      
      const response = await apperClient.getRecordById('activity_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "Owner"}}
        ]
      });

      if (!response?.data) {
        return null;
      }

      const activity = response.data;
      return {
        Id: activity.Id,
        type: activity.type_c || "Call",
        description: activity.description_c || activity.Name,
        contactId: activity.contact_id_c?.Id || activity.contact_id_c,
        dealId: activity.deal_id_c?.Id || activity.deal_id_c,
        timestamp: activity.CreatedOn,
        userId: activity.Owner?.Id || activity.Owner || "user1",
        createdAt: activity.CreatedOn,
        updatedAt: activity.ModifiedOn
      };
    } catch (error) {
      console.error(`Error fetching activity ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(activityData) {
    try {
      await this.delay();
      const apperClient = getApperClient();
      
      const params = {
        records: [{
          Name: activityData.description || `${activityData.type} Activity`,
          description_c: activityData.description || "",
          type_c: activityData.type || "Call",
          contact_id_c: activityData.contactId ? parseInt(activityData.contactId) : null,
          deal_id_c: activityData.dealId ? parseInt(activityData.dealId) : null
        }]
      };

      const response = await apperClient.createRecord('activity_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} activities:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const createdActivity = successful[0].data;
          return {
            Id: createdActivity.Id,
            type: createdActivity.type_c || "Call",
            description: createdActivity.description_c || createdActivity.Name,
            contactId: createdActivity.contact_id_c?.Id || createdActivity.contact_id_c,
            dealId: createdActivity.deal_id_c?.Id || createdActivity.deal_id_c,
            timestamp: createdActivity.CreatedOn,
            userId: createdActivity.Owner?.Id || createdActivity.Owner || "user1"
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating activity:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, activityData) {
    try {
      await this.delay();
      const apperClient = getApperClient();
      
      const updateFields = {};
      if (activityData.description !== undefined) {
        updateFields.Name = activityData.description || `${activityData.type || 'Call'} Activity`;
        updateFields.description_c = activityData.description;
      }
      if (activityData.type !== undefined) {
        updateFields.type_c = activityData.type;
      }
      if (activityData.contactId !== undefined) {
        updateFields.contact_id_c = activityData.contactId ? parseInt(activityData.contactId) : null;
      }
      if (activityData.dealId !== undefined) {
        updateFields.deal_id_c = activityData.dealId ? parseInt(activityData.dealId) : null;
      }

      const params = {
        records: [{
          Id: parseInt(id),
          ...updateFields
        }]
      };

      const response = await apperClient.updateRecord('activity_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} activities:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updatedActivity = successful[0].data;
          return {
            Id: updatedActivity.Id,
            type: updatedActivity.type_c || "Call",
            description: updatedActivity.description_c || updatedActivity.Name,
            contactId: updatedActivity.contact_id_c?.Id || updatedActivity.contact_id_c,
            dealId: updatedActivity.deal_id_c?.Id || updatedActivity.deal_id_c,
            timestamp: updatedActivity.CreatedOn,
            userId: updatedActivity.Owner?.Id || updatedActivity.Owner || "user1"
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating activity:", error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord('activity_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} activities:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
      return false;
    } catch (error) {
      console.error("Error deleting activity:", error?.response?.data?.message || error);
      return false;
    }
  }

  async getByContactId(contactId) {
    try {
      await this.delay();
      const apperClient = getApperClient();
      
      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "Owner"}}
        ],
        where: [{
          "FieldName": "contact_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(contactId)]
        }],
        orderBy: [{
          "fieldName": "CreatedOn",
          "sorttype": "DESC"
        }]
      });

      if (!response.success || !response?.data?.length) {
        return [];
      }

      return response.data.map(activity => ({
        Id: activity.Id,
        type: activity.type_c || "Call",
        description: activity.description_c || activity.Name,
        contactId: activity.contact_id_c?.Id || activity.contact_id_c,
        timestamp: activity.CreatedOn,
        userId: activity.Owner?.Id || activity.Owner || "user1"
      }));
    } catch (error) {
      console.error("Error fetching activities by contact:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByDealId(dealId) {
    try {
      await this.delay();
      const apperClient = getApperClient();
      
      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "Owner"}}
        ],
        where: [{
          "FieldName": "deal_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(dealId)]
        }],
        orderBy: [{
          "fieldName": "CreatedOn",
          "sorttype": "DESC"
        }]
      });

      if (!response.success || !response?.data?.length) {
        return [];
      }

      return response.data.map(activity => ({
        Id: activity.Id,
        type: activity.type_c || "Call",
        description: activity.description_c || activity.Name,
        dealId: activity.deal_id_c?.Id || activity.deal_id_c,
        timestamp: activity.CreatedOn,
        userId: activity.Owner?.Id || activity.Owner || "user1"
      }));
    } catch (error) {
      console.error("Error fetching activities by deal:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getRecent(limit = 10) {
    try {
      await this.delay();
      const apperClient = getApperClient();
      
      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "Owner"}}
        ],
        orderBy: [{
          "fieldName": "CreatedOn", 
          "sorttype": "DESC"
        }],
        pagingInfo: {
          "limit": limit,
          "offset": 0
        }
      });

      if (!response.success || !response?.data?.length) {
        return [];
      }

      return response.data.map(activity => ({
        Id: activity.Id,
        type: activity.type_c || "Call",
        description: activity.description_c || activity.Name,
        contactId: activity.contact_id_c?.Id || activity.contact_id_c,
        dealId: activity.deal_id_c?.Id || activity.deal_id_c,
        timestamp: activity.CreatedOn,
        userId: activity.Owner?.Id || activity.Owner || "user1"
      }));
    } catch (error) {
      console.error("Error fetching recent activities:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export default new ActivitiesService();