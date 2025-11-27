import { toast } from "react-toastify";
import React from "react";
import { getApperClient } from "@/services/apperClient";

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

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Transform each deal to UI-friendly format
      return response.data.map(transformDealData).filter(Boolean);
    } catch (error) {
      console.error("Error fetching deals:", error?.response?.data?.message || error);
      return [];
    }
  }
}

// Helper function to transform database deal data to UI-friendly format
const transformDealData = (deal) => {
  if (!deal) return null;
  
  return {
    Id: deal.Id,
    name: deal.Name || deal.title_c || '',
    title: deal.title_c || deal.Name || '',
    value: typeof deal.value_c === 'number' ? deal.value_c : parseFloat(deal.value_c) || 0,
    stage: deal.stage_c || 'New',
    priority: deal.priority_c || 'Medium',
    probability: typeof deal.probability_c === 'number' ? deal.probability_c : parseInt(deal.probability_c) || 0,
    contactId: deal.contact_id_c?.Id || deal.contact_id_c || null,
    notes: deal.notes_c || '',
    tags: deal.Tags || '',
    createdOn: deal.CreatedOn,
    createdBy: deal.CreatedBy,
    modifiedOn: deal.ModifiedOn,
    modifiedBy: deal.ModifiedBy,
    owner: deal.Owner,
    expectedCloseDate: deal.expected_close_date_c,
  };
};

// Helper function to prepare data for API operations (UI to database field names)
const prepareDealForAPI = (dealData) => {
  const apiData = {};
  
  if (dealData.name !== undefined || dealData.title !== undefined) {
    apiData.title_c = dealData.title || dealData.name || '';
  }
  if (dealData.value !== undefined) {
    apiData.value_c = parseFloat(dealData.value) || 0;
  }
  if (dealData.stage !== undefined) {
    apiData.stage_c = dealData.stage;
  }
  if (dealData.priority !== undefined) {
    apiData.priority_c = dealData.priority;
  }
  if (dealData.probability !== undefined) {
    apiData.probability_c = parseInt(dealData.probability) || 0;
  }
  if (dealData.contactId !== undefined) {
    apiData.contact_id_c = dealData.contactId;
  }
  if (dealData.notes !== undefined) {
    apiData.notes_c = dealData.notes;
  }
  if (dealData.expectedCloseDate !== undefined) {
    apiData.expected_close_date_c = dealData.expectedCloseDate;
  }
  if (dealData.tags !== undefined) {
    apiData.Tags = dealData.tags;
  }
  
  return apiData;
};

export const getAll = async () => {
  try {
    const params = {
      fields: [
        {"field": {"Name": "Name"}},
        {"field": {"Name": "title_c"}},
        {"field": {"Name": "value_c"}},
        {"field": {"Name": "stage_c"}},
        {"field": {"Name": "priority_c"}},
        {"field": {"Name": "probability_c"}},
        {"field": {"Name": "contact_id_c"}},
        {"field": {"Name": "notes_c"}},
        {"field": {"Name": "expected_close_date_c"}},
        {"field": {"Name": "Tags"}},
        {"field": {"Name": "CreatedOn"}},
        {"field": {"Name": "CreatedBy"}},
        {"field": {"Name": "ModifiedOn"}},
        {"field": {"Name": "ModifiedBy"}},
        {"field": {"Name": "Owner"}}
      ],
      orderBy: [{"fieldName": "ModifiedOn", "sorttype": "DESC"}]
    };

    const apperClient = getApperClient();
    const response = await apperClient.fetchRecords('deal_c', params);

    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }

    if (!response.data || response.data.length === 0) {
      return [];
    }

    // Transform each deal to UI-friendly format
    return response.data.map(transformDealData).filter(Boolean);
  } catch (error) {
    console.error("Error fetching deals:", error?.response?.data?.message || error);
    return [];
  }
};

export const getById = async (dealId) => {
  try {
    const params = {
      fields: [
        {"field": {"Name": "Name"}},
        {"field": {"Name": "title_c"}},
        {"field": {"Name": "value_c"}},
        {"field": {"Name": "stage_c"}},
        {"field": {"Name": "priority_c"}},
        {"field": {"Name": "probability_c"}},
        {"field": {"Name": "contact_id_c"}},
        {"field": {"Name": "notes_c"}},
        {"field": {"Name": "expected_close_date_c"}},
        {"field": {"Name": "Tags"}},
        {"field": {"Name": "CreatedOn"}},
        {"field": {"Name": "CreatedBy"}},
        {"field": {"Name": "ModifiedOn"}},
        {"field": {"Name": "ModifiedBy"}},
        {"field": {"Name": "Owner"}}
      ]
    };

    const apperClient = getApperClient();
    const response = await apperClient.getRecordById('deal_c', dealId, params);

    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }

    if (!response.data) {
      return null;
    }

    return transformDealData(response.data);
  } catch (error) {
    console.error(`Error fetching deal ${dealId}:`, error?.response?.data?.message || error);
    return null;
  }
};

export const create = async (dealData) => {
  try {
    // Transform UI data to API format
    const apiData = prepareDealForAPI(dealData);
    
    const params = {
      records: [apiData]
    };

    const apperClient = getApperClient();
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
        toast.success("Deal created successfully");
        // Return the transformed deal data for UI consistency
        return transformDealData(createdDeal);
      }
    }

    return null;
  } catch (error) {
    console.error("Error creating deal:", error?.response?.data?.message || error);
    return null;
  }
};

export const update = async (dealId, dealData) => {
  try {
    // Transform UI data to API format
    const apiData = prepareDealForAPI(dealData);
    
    const params = {
      records: [{
        Id: dealId,
        ...apiData
      }]
    };

    const apperClient = getApperClient();
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
        toast.success("Deal updated successfully");
        // Return the transformed deal data for UI consistency
        return transformDealData(updatedDeal);
      }
    }

    return null;
  } catch (error) {
    console.error("Error updating deal:", error?.response?.data?.message || error);
    return null;
  }
};

// Update deal stage (for drag and drop functionality)
export const updateStage = async (dealId, newStage) => {
  try {
    const params = {
      records: [{
        Id: dealId,
        stage_c: newStage
      }]
    };

    const apperClient = getApperClient();
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
        console.error(`Failed to update ${failed.length} deal stages:`, failed);
        failed.forEach(record => {
          record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
          if (record.message) toast.error(record.message);
        });
      }

      if (successful.length > 0) {
        const updatedDeal = successful[0].data;
        // Return the transformed deal data for UI consistency
        return transformDealData(updatedDeal);
      }
    }

    return null;
  } catch (error) {
    console.error("Error updating deal stage:", error?.response?.data?.message || error);
    return null;
  }
};

export const deleteDeal = async (dealId) => {
  try {
    const params = {
      RecordIds: [dealId]
    };

    const apperClient = getApperClient();
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

      if (successful.length > 0) {
        toast.success("Deal deleted successfully");
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Error deleting deal:", error?.response?.data?.message || error);
    return false;
  }
};

// Service object for export
const dealsService = {
  getAll,
  getById,
  create,
  update,
  updateStage,
  delete: deleteDeal
};

export default dealsService;