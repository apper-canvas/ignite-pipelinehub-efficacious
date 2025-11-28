import { toast } from 'react-toastify';
import { getApperClient } from '@/services/apperClient';

class CompaniesService {
  constructor() {
    this.tableName = 'company_c';
  }

  async getAll() {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "city_c"}},
          {"field": {"Name": "state_c"}},
          {"field": {"Name": "zip_code_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "number_of_employees_c"}},
          {"field": {"Name": "annual_revenue_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "logo_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "ModifiedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error('Failed to fetch companies:', response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error('Error fetching companies:', error?.response?.data?.message || error);
      toast.error('Failed to fetch companies');
      return [];
    }
  }

  async getById(companyId) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "city_c"}},
          {"field": {"Name": "state_c"}},
          {"field": {"Name": "zip_code_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "number_of_employees_c"}},
          {"field": {"Name": "annual_revenue_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "logo_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, companyId, params);

      if (!response?.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching company ${companyId}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(companyData) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [this.prepareCompanyForAPI(companyData)]
      };

      const response = await apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error('Failed to create company:', response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} companies: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Company created successfully');
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error('Error creating company:', error?.response?.data?.message || error);
      toast.error('Failed to create company');
      return null;
    }
  }

  async update(companyId, companyData) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          Id: companyId,
          ...this.prepareCompanyForAPI(companyData)
        }]
      };

      const response = await apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error('Failed to update company:', response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} companies: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success('Company updated successfully');
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error('Error updating company:', error?.response?.data?.message || error);
      toast.error('Failed to update company');
      return null;
    }
  }

  prepareCompanyForAPI(companyData) {
    const prepared = {};
    
    // Only include updateable fields with values
    if (companyData.Name) prepared.Name = companyData.Name;
    if (companyData.Tags) prepared.Tags = companyData.Tags;
    if (companyData.industry_c) prepared.industry_c = companyData.industry_c;
    if (companyData.address_c) prepared.address_c = companyData.address_c;
    if (companyData.city_c) prepared.city_c = companyData.city_c;
    if (companyData.state_c) prepared.state_c = companyData.state_c;
    if (companyData.zip_code_c) prepared.zip_code_c = companyData.zip_code_c;
    if (companyData.phone_c) prepared.phone_c = companyData.phone_c;
    if (companyData.website_c) prepared.website_c = companyData.website_c;
    if (companyData.number_of_employees_c) prepared.number_of_employees_c = parseInt(companyData.number_of_employees_c);
    if (companyData.annual_revenue_c) prepared.annual_revenue_c = parseFloat(companyData.annual_revenue_c);
    if (companyData.description_c) prepared.description_c = companyData.description_c;
    if (companyData.logo_c) prepared.logo_c = companyData.logo_c;

    return prepared;
  }
}

const companiesService = new CompaniesService();
export default companiesService;