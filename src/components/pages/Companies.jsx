import React, { useState, Suspense } from 'react';
import CompanyTable from '@/components/organisms/CompanyTable';
import CompanyModal from '@/components/organisms/CompanyModal';
import CompanyDetailModal from '@/components/organisms/CompanyDetailModal';
import SearchBar from '@/components/molecules/SearchBar';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';
import { useCompanies } from '@/hooks/useCompanies';
import Loading from '@/components/ui/Loading';
import ErrorView from '@/components/ui/ErrorView';

function Companies() {
  const { companies, loading, error, createCompany, updateCompany, getCompanyById } = useCompanies();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [sortField, setSortField] = useState('ModifiedOn');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  // Industry options from database schema
  const industryOptions = [
    'Manufacturing',
    'Technology', 
    'Finance',
    'Healthcare',
    'Education',
    'Retail',
    'Other'
  ];

  // Get all unique tags for filtering
  function getAllTags() {
    const allTags = companies
      .map(company => company.Tags)
      .filter(tags => tags && tags.trim())
      .flatMap(tags => tags.split(',').map(tag => tag.trim()))
      .filter(tag => tag);
    return [...new Set(allTags)];
  }

  // Filter companies based on search and industry
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = !searchTerm || 
      company.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.city_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.Tags?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesIndustry = !selectedIndustry || company.industry_c === selectedIndustry;

    return matchesSearch && matchesIndustry;
  });

  // Sort companies
  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle null/undefined values
    if (!aValue) aValue = '';
    if (!bValue) bValue = '';

    // Convert to strings for comparison
    aValue = aValue.toString().toLowerCase();
    bValue = bValue.toString().toLowerCase();

    if (sortDirection === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  function handleSort(key) {
    if (sortField === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(key);
      setSortDirection('asc');
    }
  }

  function handleAddCompany() {
    setEditingCompany(null);
    setSelectedCompany(null);
    setShowCompanyModal(true);
  }

  function handleEditCompany(company) {
    setEditingCompany(company);
    setSelectedCompany(company);
    setShowCompanyModal(true);
  }

  async function handleViewDetails(company) {
    const fullCompany = await getCompanyById(company.Id);
    if (fullCompany) {
      setSelectedCompany(fullCompany);
      setShowDetailModal(true);
    }
  }

  async function handleSaveCompany(companyData) {
    try {
      if (editingCompany) {
        await updateCompany(editingCompany.Id, companyData);
      } else {
        await createCompany(companyData);
      }
      setShowCompanyModal(false);
      setEditingCompany(null);
      setSelectedCompany(null);
    } catch (error) {
      console.error('Error saving company:', error);
    }
  }

  function handleCloseModal() {
    setShowCompanyModal(false);
    setEditingCompany(null);
    setSelectedCompany(null);
  }

  function handleCloseDetailModal() {
    setShowDetailModal(false);
    setSelectedCompany(null);
  }

  if (loading) {
    return (
      <Suspense fallback={<Loading />}>
        <Loading />
      </Suspense>
    );
  }

  if (error) {
    return (
      <Suspense fallback={<Loading />}>
        <ErrorView 
          error={error} 
          onRetry={() => window.location.reload()} 
        />
      </Suspense>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Companies</h1>
          <p className="text-slate-600 mt-1">
            Manage your company database and relationships
          </p>
        </div>
        <Button
          onClick={handleAddCompany}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <ApperIcon name="Plus" size={20} />
          Add Company
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8">
          <SearchBar
            placeholder="Search companies by name, industry, location, or tags..."
            onSearch={setSearchTerm}
            className="w-full"
          />
        </div>
        <div className="lg:col-span-4">
          <Select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="w-full"
          >
            <option value="">All Industries</option>
            {industryOptions.map(industry => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <div className="text-sm text-slate-600">Total Companies</div>
          <div className="text-2xl font-semibold text-slate-900">{companies.length}</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <div className="text-sm text-slate-600">Filtered Results</div>
          <div className="text-2xl font-semibold text-slate-900">{filteredCompanies.length}</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <div className="text-sm text-slate-600">Industries</div>
          <div className="text-2xl font-semibold text-slate-900">
            {new Set(companies.map(c => c.industry_c).filter(Boolean)).size}
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <div className="text-sm text-slate-600">With Revenue Data</div>
          <div className="text-2xl font-semibold text-slate-900">
            {companies.filter(c => c.annual_revenue_c).length}
          </div>
        </div>
      </div>

      {/* Companies Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <CompanyTable
          companies={sortedCompanies}
          onSort={handleSort}
          sortField={sortField}
          sortDirection={sortDirection}
          onEdit={handleEditCompany}
          onViewDetails={handleViewDetails}
        />
      </div>

      {/* Company Modal */}
      {showCompanyModal && (
        <CompanyModal
          company={editingCompany}
          onSave={handleSaveCompany}
          onClose={handleCloseModal}
        />
      )}

      {/* Company Detail Modal */}
      {showDetailModal && selectedCompany && (
        <CompanyDetailModal
          company={selectedCompany}
          onClose={handleCloseDetailModal}
          onEdit={() => {
            setShowDetailModal(false);
            handleEditCompany(selectedCompany);
          }}
        />
      )}
    </div>
  );
}

export default Companies;