import React from 'react';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { format } from 'date-fns';

function QuoteTable({ 
  quotes, 
  onEdit, 
  onDelete, 
  onViewDetails, 
  onSort, 
  sortField, 
  sortDirection 
}) {
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return '-';
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'draft':
        return 'secondary';
      case 'sent':
        return 'info';
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      case 'expired':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const SortButton = ({ field, children }) => (
    <button
      onClick={() => onSort(field)}
      className="flex items-center gap-1 hover:text-primary-600 transition-colors"
    >
      {children}
      <ApperIcon
        name={
          sortField === field
            ? sortDirection === 'asc'
              ? 'ChevronUp'
              : 'ChevronDown'
            : 'ChevronsUpDown'
        }
        size={14}
        className={sortField === field ? 'text-primary-600' : 'text-slate-400'}
      />
    </button>
  );

  const handleDelete = (quote) => {
    if (window.confirm(`Are you sure you want to delete the quote "${quote.title_c || quote.Name}"?`)) {
      onDelete(quote.Id);
    }
  };

  if (quotes.length === 0) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="FileText" size={48} className="mx-auto text-slate-400 mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">No quotes found</h3>
        <p className="text-slate-600">Create your first quote to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              <SortButton field="title_c">Quote</SortButton>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              <SortButton field="company_id_c">Company</SortButton>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              <SortButton field="contact_id_c">Contact</SortButton>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              <SortButton field="status_c">Status</SortButton>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              <SortButton field="total_amount_c">Amount</SortButton>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              <SortButton field="quote_date_c">Quote Date</SortButton>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              <SortButton field="expires_on_c">Expires</SortButton>
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {quotes.map((quote) => (
            <tr
              key={quote.Id}
              className="hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => onViewDetails(quote)}
            >
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-900">
                    {quote.title_c || quote.Name || '-'}
                  </span>
                  {quote.deal_id_c?.Name && (
                    <span className="text-xs text-slate-500">
                      Deal: {quote.deal_id_c.Name}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-slate-900">
                  {quote.company_id_c?.Name || '-'}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-slate-900">
                  {quote.contact_id_c?.Name || '-'}
                </span>
              </td>
              <td className="px-6 py-4">
                <Badge variant={getStatusBadgeVariant(quote.status_c)}>
                  {quote.status_c || 'Draft'}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm font-medium text-slate-900">
                  {formatCurrency(quote.total_amount_c)}
                </span>
                {quote.discount_c > 0 && (
                  <div className="text-xs text-success-600">
                    -{formatCurrency(quote.discount_c)} discount
                  </div>
                )}
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-slate-900">
                  {formatDate(quote.quote_date_c)}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`text-sm ${
                  new Date(quote.expires_on_c) < new Date() 
                    ? 'text-error-600 font-medium' 
                    : 'text-slate-900'
                }`}>
                  {formatDate(quote.expires_on_c)}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(quote);
                    }}
                    className="flex items-center gap-1"
                  >
                    <ApperIcon name="Edit2" size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(quote);
                    }}
                    className="flex items-center gap-1 text-error-600 hover:text-error-700"
                  >
                    <ApperIcon name="Trash2" size={14} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default QuoteTable;