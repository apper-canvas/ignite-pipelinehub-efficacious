import React from 'react';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { format } from 'date-fns';

function QuoteDetailModal({ quote, onClose, onEdit }) {
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

  const getTags = (tagsString) => {
    if (!tagsString) return [];
    return tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {quote.title_c || quote.Name || 'Quote Details'}
            </h2>
            <p className="text-slate-600 mt-1">
              Quote ID: {quote.Id}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onEdit} className="flex items-center gap-2">
              <ApperIcon name="Edit2" size={16} />
              Edit
            </Button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-slate-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-slate-700">Status</label>
                <div className="mt-1">
                  <Badge variant={getStatusBadgeVariant(quote.status_c)}>
                    {quote.status_c || 'Draft'}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Delivery Method</label>
                <p className="mt-1 text-sm text-slate-900">
                  {quote.delivery_method_c || '-'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Company</label>
                <p className="mt-1 text-sm text-slate-900">
                  {quote.company_id_c?.Name || '-'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Contact</label>
                <p className="mt-1 text-sm text-slate-900">
                  {quote.contact_id_c?.Name || '-'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Related Deal</label>
                <p className="mt-1 text-sm text-slate-900">
                  {quote.deal_id_c?.Name || '-'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Owner</label>
                <p className="mt-1 text-sm text-slate-900">
                  {quote.Owner?.Name || '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div>
            <h3 className="text-lg font-medium text-slate-900 mb-4">Important Dates</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-slate-700">Quote Date</label>
                <p className="mt-1 text-sm text-slate-900">
                  {formatDate(quote.quote_date_c)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Expires On</label>
                <p className={`mt-1 text-sm ${
                  new Date(quote.expires_on_c) < new Date() 
                    ? 'text-error-600 font-medium' 
                    : 'text-slate-900'
                }`}>
                  {formatDate(quote.expires_on_c)}
                  {new Date(quote.expires_on_c) < new Date() && ' (Expired)'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Created On</label>
                <p className="mt-1 text-sm text-slate-900">
                  {formatDate(quote.CreatedOn)}
                </p>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div>
            <h3 className="text-lg font-medium text-slate-900 mb-4">Financial Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-slate-700">Total Amount</label>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {formatCurrency(quote.total_amount_c)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Discount</label>
                <p className="mt-1 text-lg font-medium text-success-600">
                  -{formatCurrency(quote.discount_c)}
                </p>
              </div>

              {(quote.total_amount_c && quote.discount_c) && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Net Amount</label>
                  <p className="mt-1 text-xl font-bold text-primary-600">
                    {formatCurrency((quote.total_amount_c || 0) - (quote.discount_c || 0))}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Billing Address */}
          {(quote.bill_to_name_c || quote.bill_to_street_c || quote.bill_to_city_c) && (
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4">Billing Address</h3>
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="space-y-1">
                  {quote.bill_to_name_c && (
                    <p className="font-medium text-slate-900">{quote.bill_to_name_c}</p>
                  )}
                  {quote.bill_to_street_c && (
                    <p className="text-slate-700">{quote.bill_to_street_c}</p>
                  )}
                  <div className="flex gap-2">
                    {quote.bill_to_city_c && (
                      <span className="text-slate-700">{quote.bill_to_city_c}</span>
                    )}
                    {quote.bill_to_state_c && (
                      <span className="text-slate-700">{quote.bill_to_state_c}</span>
                    )}
                    {quote.bill_to_pincode_c && (
                      <span className="text-slate-700">{quote.bill_to_pincode_c}</span>
                    )}
                  </div>
                  {quote.bill_to_country_c && (
                    <p className="text-slate-700">{quote.bill_to_country_c}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Shipping Address */}
          {(quote.ship_to_name_c || quote.ship_to_street_c || quote.ship_to_city_c) && (
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4">Shipping Address</h3>
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="space-y-1">
                  {quote.ship_to_name_c && (
                    <p className="font-medium text-slate-900">{quote.ship_to_name_c}</p>
                  )}
                  {quote.ship_to_street_c && (
                    <p className="text-slate-700">{quote.ship_to_street_c}</p>
                  )}
                  <div className="flex gap-2">
                    {quote.ship_to_city_c && (
                      <span className="text-slate-700">{quote.ship_to_city_c}</span>
                    )}
                    {quote.ship_to_state_c && (
                      <span className="text-slate-700">{quote.ship_to_state_c}</span>
                    )}
                    {quote.ship_to_pincode_c && (
                      <span className="text-slate-700">{quote.ship_to_pincode_c}</span>
                    )}
                  </div>
                  {quote.ship_to_country_c && (
                    <p className="text-slate-700">{quote.ship_to_country_c}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {quote.notes_c && (
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4">Notes</h3>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-slate-700 whitespace-pre-wrap">{quote.notes_c}</p>
              </div>
            </div>
          )}

          {/* Tags */}
          {quote.Tags && (
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {getTags(quote.Tags).map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div>
            <h3 className="text-lg font-medium text-slate-900 mb-4">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <label className="text-slate-700 font-medium">Created By</label>
                <p className="text-slate-900 mt-1">
                  {quote.CreatedBy?.Name || '-'}
                </p>
              </div>

              <div>
                <label className="text-slate-700 font-medium">Last Modified</label>
                <p className="text-slate-900 mt-1">
                  {formatDate(quote.ModifiedOn)}
                  {quote.ModifiedBy?.Name && (
                    <span className="text-slate-600"> by {quote.ModifiedBy.Name}</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-slate-200">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onEdit} className="flex items-center gap-2">
            <ApperIcon name="Edit2" size={16} />
            Edit Quote
          </Button>
        </div>
      </div>
    </div>
  );
}

export default QuoteDetailModal;