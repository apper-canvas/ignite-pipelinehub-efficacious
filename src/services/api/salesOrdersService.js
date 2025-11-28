import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

class SalesOrdersService {
  constructor() {
    this.tableName = 'sales_order_c';
  }

  async getAll() {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "order_date_c"}},
          {"field": {"Name": "customer_id_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "shipping_address_c"}},
          {"field": {"Name": "billing_address_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "ModifiedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error('Sales orders fetch error:', response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching sales orders:', error?.response?.data?.message || error);
      toast.error('Failed to load sales orders');
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "order_date_c"}},
          {"field": {"Name": "customer_id_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "shipping_address_c"}},
          {"field": {"Name": "billing_address_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, id, params);

      if (!response.success) {
        console.error('Sales order fetch error:', response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching sales order ${id}:`, error?.response?.data?.message || error);
      toast.error('Failed to load sales order');
      return null;
    }
  }

  async create(orderData) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        records: [{
          Name: orderData.Name || '',
          order_date_c: orderData.order_date_c || new Date().toISOString(),
          customer_id_c: parseInt(orderData.customer_id_c) || null,
          total_amount_c: parseFloat(orderData.total_amount_c) || 0,
          status_c: orderData.status_c || 'Draft',
          shipping_address_c: orderData.shipping_address_c || '',
          billing_address_c: orderData.billing_address_c || '',
          notes_c: orderData.notes_c || '',
          Tags: orderData.Tags || ''
        }]
      };

      const response = await apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error('Sales order creation error:', response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} sales order records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Sales order created successfully');
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error('Error creating sales order:', error?.response?.data?.message || error);
      toast.error('Failed to create sales order');
      return null;
    }
  }

  async update(id, orderData) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        records: [{
          Id: parseInt(id),
          Name: orderData.Name || '',
          order_date_c: orderData.order_date_c || '',
          customer_id_c: parseInt(orderData.customer_id_c) || null,
          total_amount_c: parseFloat(orderData.total_amount_c) || 0,
          status_c: orderData.status_c || 'Draft',
          shipping_address_c: orderData.shipping_address_c || '',
          billing_address_c: orderData.billing_address_c || '',
          notes_c: orderData.notes_c || '',
          Tags: orderData.Tags || ''
        }]
      };

      const response = await apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error('Sales order update error:', response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} sales order records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Sales order updated successfully');
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error('Error updating sales order:', error?.response?.data?.message || error);
      toast.error('Failed to update sales order');
      return null;
    }
  }

  async delete(id) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error('Sales order deletion error:', response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} sales order records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Sales order deleted successfully');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error deleting sales order:', error?.response?.data?.message || error);
      toast.error('Failed to delete sales order');
      return false;
    }
  }
}

export const salesOrdersService = new SalesOrdersService();
import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

class SalesOrdersService {
  constructor() {
    this.tableName = 'sales_order_c';
  }

  async getAll() {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "order_date_c"}},
          {"field": {"Name": "customer_id_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "shipping_address_c"}},
          {"field": {"Name": "billing_address_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "ModifiedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error('Sales orders fetch error:', response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching sales orders:', error?.response?.data?.message || error);
      toast.error('Failed to load sales orders');
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "order_date_c"}},
          {"field": {"Name": "customer_id_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "shipping_address_c"}},
          {"field": {"Name": "billing_address_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, id, params);

      if (!response.success) {
        console.error('Sales order fetch error:', response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching sales order ${id}:`, error?.response?.data?.message || error);
      toast.error('Failed to load sales order');
      return null;
    }
  }

  async create(orderData) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        records: [{
          Name: orderData.Name || '',
          order_date_c: orderData.order_date_c || new Date().toISOString(),
          customer_id_c: parseInt(orderData.customer_id_c) || null,
          total_amount_c: parseFloat(orderData.total_amount_c) || 0,
          status_c: orderData.status_c || 'Draft',
          shipping_address_c: orderData.shipping_address_c || '',
          billing_address_c: orderData.billing_address_c || '',
          notes_c: orderData.notes_c || '',
          Tags: orderData.Tags || ''
        }]
      };

      const response = await apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error('Sales order creation error:', response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} sales order records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Sales order created successfully');
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error('Error creating sales order:', error?.response?.data?.message || error);
      toast.error('Failed to create sales order');
      return null;
    }
  }

  async update(id, orderData) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        records: [{
          Id: parseInt(id),
          Name: orderData.Name || '',
          order_date_c: orderData.order_date_c || '',
          customer_id_c: parseInt(orderData.customer_id_c) || null,
          total_amount_c: parseFloat(orderData.total_amount_c) || 0,
          status_c: orderData.status_c || 'Draft',
          shipping_address_c: orderData.shipping_address_c || '',
          billing_address_c: orderData.billing_address_c || '',
          notes_c: orderData.notes_c || '',
          Tags: orderData.Tags || ''
        }]
      };

      const response = await apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error('Sales order update error:', response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} sales order records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Sales order updated successfully');
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error('Error updating sales order:', error?.response?.data?.message || error);
      toast.error('Failed to update sales order');
      return null;
    }
  }

  async delete(id) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error('Sales order deletion error:', response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} sales order records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Sales order deleted successfully');
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error deleting sales order:', error?.response?.data?.message || error);
      toast.error('Failed to delete sales order');
      return false;
    }
  }
}

export const salesOrdersService = new SalesOrdersService();