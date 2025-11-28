import React, { useState, Suspense } from 'react';
import QuoteTable from '@/components/organisms/QuoteTable';
import QuoteModal from '@/components/organisms/QuoteModal';
import QuoteDetailModal from '@/components/organisms/QuoteDetailModal';
import SearchBar from '@/components/molecules/SearchBar';
import Button from '@/components/atoms/Button';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';
import { useQuotes } from '@/hooks/useQuotes';
import Loading from '@/components/ui/Loading';
import ErrorView from '@/components/ui/ErrorView';

function Quotes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState('CreatedOn');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);
  const [selectedQuote, setSelectedQuote] = useState(null);

  const { quotes, loading, error, createQuote, updateQuote, deleteQuote } = useQuotes({
    searchTerm,
    status: statusFilter
  });

  // Get all unique statuses for filter dropdown
  const getAllStatuses = () => {
    const statuses = ['Draft', 'Sent', 'Accepted', 'Rejected', 'Expired'];
    return statuses;
  };

  const handleSort = (key) => {
    if (sortField === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(key);
      setSortDirection('asc');
    }
  };

  const handleAddQuote = () => {
    setEditingQuote(null);
    setShowModal(true);
  };

  const handleEditQuote = (quote) => {
    setEditingQuote(quote);
    setShowModal(true);
  };

  const handleViewDetails = async (quote) => {
    setSelectedQuote(quote);
    setShowDetailModal(true);
  };

  const handleSaveQuote = async (quoteData) => {
    if (editingQuote) {
      await updateQuote(editingQuote.Id, quoteData);
    } else {
      await createQuote(quoteData);
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingQuote(null);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedQuote(null);
  };

  // Sort quotes
  const sortedQuotes = React.useMemo(() => {
    const sorted = [...quotes];
    sorted.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle lookup fields
      if (sortField === 'company_id_c' || sortField === 'contact_id_c' || sortField === 'deal_id_c') {
        aValue = a[sortField]?.Name || '';
        bValue = b[sortField]?.Name || '';
      }

      // Handle dates
      if (sortField === 'quote_date_c' || sortField === 'expires_on_c' || sortField === 'CreatedOn') {
        aValue = new Date(aValue || 0);
        bValue = new Date(bValue || 0);
      }

      // Handle numbers
      if (sortField === 'total_amount_c' || sortField === 'discount_c') {
        aValue = parseFloat(aValue || 0);
        bValue = parseFloat(bValue || 0);
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [quotes, sortField, sortDirection]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorView message={error} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quotes</h1>
          <p className="text-slate-600 mt-1">Manage your quotes and proposals</p>
        </div>
        <Button onClick={handleAddQuote} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={16} />
          New Quote
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="flex-1 min-w-0">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search quotes by title..."
              className="w-full"
            />
          </div>
          <div className="flex gap-3">
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: '', label: 'All Statuses' },
                ...getAllStatuses().map(status => ({
                  value: status,
                  label: status
                }))
              ]}
              placeholder="Filter by status"
              className="min-w-[150px]"
            />
          </div>
        </div>
        <div className="text-sm text-slate-600 whitespace-nowrap">
          {quotes.length} quote{quotes.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Quotes Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <Suspense fallback={<Loading />}>
          <QuoteTable
            quotes={sortedQuotes}
            onEdit={handleEditQuote}
            onDelete={deleteQuote}
            onViewDetails={handleViewDetails}
            onSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
          />
        </Suspense>
      </div>

      {/* Quote Modal */}
      {showModal && (
        <QuoteModal
          quote={editingQuote}
          onSave={handleSaveQuote}
          onClose={handleCloseModal}
        />
      )}

      {/* Quote Detail Modal */}
      {showDetailModal && selectedQuote && (
        <QuoteDetailModal
          quote={selectedQuote}
          onClose={handleCloseDetailModal}
          onEdit={() => {
            handleCloseDetailModal();
            handleEditQuote(selectedQuote);
          }}
        />
      )}
    </div>
  );
}

export default Quotes;