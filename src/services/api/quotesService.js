import { toast } from 'react-toastify';
import { getApperClient } from '@/services/apperClient';

class QuotesService {
  constructor() {
    this.tableName = 'quote_c';
    this.lookupFields = ['company_id_c', 'contact_id_c', 'deal_id_c', 'Owner', 'CreatedBy', 'ModifiedBy'];
  }

  async getAll(filters = {}) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "company_id_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "quote_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "delivery_method_c"}},
          {"field": {"Name": "expires_on_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "discount_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "Owner"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };

      if (filters.searchTerm) {
        params.where = [{
          "FieldName": "title_c",
          "Operator": "Contains",
          "Values": [filters.searchTerm],
          "Include": true
        }];
      }

      if (filters.status) {
        const statusFilter = {
          "FieldName": "status_c",
          "Operator": "EqualTo",
          "Values": [filters.status],
          "Include": true
        };
        params.where = params.where ? [...params.where, statusFilter] : [statusFilter];
      }

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching quotes:", error?.response?.data?.message || error);
      toast.error('Failed to fetch quotes');
      return [];
    }
  }

  async getById(quoteId) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "company_id_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "quote_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "delivery_method_c"}},
          {"field": {"Name": "expires_on_c"}},
          {"field": {"Name": "bill_to_name_c"}},
          {"field": {"Name": "bill_to_street_c"}},
          {"field": {"Name": "bill_to_city_c"}},
          {"field": {"Name": "bill_to_state_c"}},
          {"field": {"Name": "bill_to_country_c"}},
          {"field": {"Name": "bill_to_pincode_c"}},
          {"field": {"Name": "ship_to_name_c"}},
          {"field": {"Name": "ship_to_street_c"}},
          {"field": {"Name": "ship_to_city_c"}},
          {"field": {"Name": "ship_to_state_c"}},
          {"field": {"Name": "ship_to_country_c"}},
          {"field": {"Name": "ship_to_pincode_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "discount_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}},
          {"field": {"Name": "Owner"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, quoteId, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching quote ${quoteId}:`, error?.response?.data?.message || error);
      toast.error('Failed to fetch quote details');
      return null;
    }
  }

  async create(quoteData) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const preparedData = this.prepareQuoteForAPI(quoteData);
      const params = {
        records: [preparedData]
      };

      const response = await apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} quotes:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Quote created successfully');
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating quote:", error?.response?.data?.message || error);
      toast.error('Failed to create quote');
      return null;
    }
  }

  async update(quoteId, quoteData) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const preparedData = this.prepareQuoteForAPI(quoteData);
      preparedData.Id = quoteId;

      const params = {
        records: [preparedData]
      };

      const response = await apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} quotes:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Quote updated successfully');
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating quote:", error?.response?.data?.message || error);
      toast.error('Failed to update quote');
      return null;
    }
  }

  async delete(quoteId) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        RecordIds: [quoteId]
      };

      const response = await apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} quotes:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Quote deleted successfully');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting quote:", error?.response?.data?.message || error);
      toast.error('Failed to delete quote');
      return false;
    }
  }

  prepareQuoteForAPI(quoteData) {
    const prepared = {};

    // Only include updateable fields
    if (quoteData.Name !== undefined) prepared.Name = quoteData.Name;
    if (quoteData.title_c !== undefined) prepared.title_c = quoteData.title_c;
    if (quoteData.quote_date_c !== undefined) prepared.quote_date_c = quoteData.quote_date_c;
    if (quoteData.status_c !== undefined) prepared.status_c = quoteData.status_c;
    if (quoteData.delivery_method_c !== undefined) prepared.delivery_method_c = quoteData.delivery_method_c;
    if (quoteData.expires_on_c !== undefined) prepared.expires_on_c = quoteData.expires_on_c;
    if (quoteData.bill_to_name_c !== undefined) prepared.bill_to_name_c = quoteData.bill_to_name_c;
    if (quoteData.bill_to_street_c !== undefined) prepared.bill_to_street_c = quoteData.bill_to_street_c;
    if (quoteData.bill_to_city_c !== undefined) prepared.bill_to_city_c = quoteData.bill_to_city_c;
    if (quoteData.bill_to_state_c !== undefined) prepared.bill_to_state_c = quoteData.bill_to_state_c;
    if (quoteData.bill_to_country_c !== undefined) prepared.bill_to_country_c = quoteData.bill_to_country_c;
    if (quoteData.bill_to_pincode_c !== undefined) prepared.bill_to_pincode_c = quoteData.bill_to_pincode_c;
    if (quoteData.ship_to_name_c !== undefined) prepared.ship_to_name_c = quoteData.ship_to_name_c;
    if (quoteData.ship_to_street_c !== undefined) prepared.ship_to_street_c = quoteData.ship_to_street_c;
    if (quoteData.ship_to_city_c !== undefined) prepared.ship_to_city_c = quoteData.ship_to_city_c;
    if (quoteData.ship_to_state_c !== undefined) prepared.ship_to_state_c = quoteData.ship_to_state_c;
    if (quoteData.ship_to_country_c !== undefined) prepared.ship_to_country_c = quoteData.ship_to_country_c;
    if (quoteData.ship_to_pincode_c !== undefined) prepared.ship_to_pincode_c = quoteData.ship_to_pincode_c;
    if (quoteData.notes_c !== undefined) prepared.notes_c = quoteData.notes_c;
    if (quoteData.total_amount_c !== undefined) prepared.total_amount_c = parseFloat(quoteData.total_amount_c) || 0;
    if (quoteData.discount_c !== undefined) prepared.discount_c = parseFloat(quoteData.discount_c) || 0;
    if (quoteData.Tags !== undefined) prepared.Tags = quoteData.Tags;

    // Handle lookup fields - send only ID values
    if (quoteData.company_id_c !== undefined) {
      prepared.company_id_c = quoteData.company_id_c?.Id || parseInt(quoteData.company_id_c) || null;
    }
    if (quoteData.contact_id_c !== undefined) {
      prepared.contact_id_c = quoteData.contact_id_c?.Id || parseInt(quoteData.contact_id_c) || null;
    }
    if (quoteData.deal_id_c !== undefined) {
      prepared.deal_id_c = quoteData.deal_id_c?.Id || parseInt(quoteData.deal_id_c) || null;
    }

    return prepared;
  }
}

const quotesService = new QuotesService();
export default quotesService;