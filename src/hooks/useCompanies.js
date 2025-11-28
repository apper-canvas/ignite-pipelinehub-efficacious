import { useState, useEffect } from 'react';
import companiesService from '@/services/api/companiesService';

export function useCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await companiesService.getAll();
      setCompanies(data || []);
    } catch (err) {
      setError(err.message);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const createCompany = async (companyData) => {
    const newCompany = await companiesService.create(companyData);
    if (newCompany) {
      await loadCompanies(); // Refresh the list
    }
    return newCompany;
  };

  const updateCompany = async (companyId, companyData) => {
    const updatedCompany = await companiesService.update(companyId, companyData);
    if (updatedCompany) {
      await loadCompanies(); // Refresh the list
    }
    return updatedCompany;
  };

  const getCompanyById = async (companyId) => {
    return await companiesService.getById(companyId);
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  return {
    companies,
    loading,
    error,
    loadCompanies,
    createCompany,
    updateCompany,
    getCompanyById
  };
}