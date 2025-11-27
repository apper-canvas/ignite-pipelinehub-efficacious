import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

class PipelineStagesService {
  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    try {
      await this.delay();
      const apperClient = getApperClient();
      
      const response = await apperClient.fetchRecords('pipeline_stage_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}}, 
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "order_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{
          "fieldName": "order_c",
          "sorttype": "ASC"
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
      return response.data.map(stage => ({
        Id: stage.Id,
        name: stage.Name,
        color: stage.color_c || "#3b82f6",
        order: stage.order_c || 0,
        createdAt: stage.CreatedOn,
        updatedAt: stage.ModifiedOn
      }));
    } catch (error) {
      console.error("Error fetching pipeline stages:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      await this.delay();
      const apperClient = getApperClient();
      
      const response = await apperClient.getRecordById('pipeline_stage_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "order_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      });

      if (!response?.data) {
        return null;
      }

      const stage = response.data;
      return {
        Id: stage.Id,
        name: stage.Name,
        color: stage.color_c || "#3b82f6", 
        order: stage.order_c || 0,
        createdAt: stage.CreatedOn,
        updatedAt: stage.ModifiedOn
      };
    } catch (error) {
      console.error(`Error fetching pipeline stage ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(stageData) {
    try {
      await this.delay();
      const apperClient = getApperClient();
      
      // Get current max order
      const allStages = await this.getAll();
      const maxOrder = allStages.reduce((max, stage) => Math.max(max, stage.order || 0), 0);
      
      const params = {
        records: [{
          Name: stageData.name,
          color_c: stageData.color || "#3b82f6",
          order_c: (maxOrder + 1)
        }]
      };

      const response = await apperClient.createRecord('pipeline_stage_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} pipeline stages:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const createdStage = successful[0].data;
          return {
            Id: createdStage.Id,
            name: createdStage.Name,
            color: createdStage.color_c || "#3b82f6",
            order: createdStage.order_c || 0
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating pipeline stage:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, stageData) {
    try {
      await this.delay();
      const apperClient = getApperClient();
      
      const updateFields = {};
      if (stageData.name !== undefined) {
        updateFields.Name = stageData.name;
      }
      if (stageData.color !== undefined) {
        updateFields.color_c = stageData.color;
      }
      if (stageData.order !== undefined) {
        updateFields.order_c = stageData.order;
      }

      const params = {
        records: [{
          Id: parseInt(id),
          ...updateFields
        }]
      };

      const response = await apperClient.updateRecord('pipeline_stage_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} pipeline stages:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updatedStage = successful[0].data;
          return {
            Id: updatedStage.Id,
            name: updatedStage.Name,
            color: updatedStage.color_c || "#3b82f6",
            order: updatedStage.order_c || 0
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating pipeline stage:", error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord('pipeline_stage_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} pipeline stages:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
      return false;
    } catch (error) {
      console.error("Error deleting pipeline stage:", error?.response?.data?.message || error);
      return false;
    }
  }
}

export default new PipelineStagesService();

export default new PipelineStagesService()