import React from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const statusColors = {
  Draft: 'bg-slate-100 text-slate-700',
  Open: 'bg-blue-100 text-blue-700',
  Closed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700'
};

function SalesOrderDetailModal({ isOpen, onClose, salesOrder, onEdit, onDelete }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'PPP');
    } catch {
      return 'N/A';
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'PPp');
    } catch {
      return 'N/A';
    }
  };

  if (!isOpen || !salesOrder) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <ApperIcon name="FileText" size={24} className="text-primary-600" />
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                {salesOrder.Name || 'Untitled Order'}
              </h2>
              <p className="text-sm text-slate-500">Sales Order Details</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <ApperIcon name="X" size={20} />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Header Info */}
          <div className="flex items-center justify-between">
            <Badge 
              className={`${statusColors[salesOrder.status_c] || statusColors.Draft}`}
            >
              {salesOrder.status_c || 'Draft'}
            </Badge>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900">
                {formatCurrency(salesOrder.total_amount_c)}
              </div>
              <div className="text-sm text-slate-500">Total Amount</div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-900 border-b border-slate-200 pb-2">
                Order Information
              </h3>
              
              <div>
                <label className="text-sm font-medium text-slate-500">Order Name</label>
                <p className="text-slate-900 mt-1">{salesOrder.Name || 'N/A'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-500">Order Date</label>
                <p className="text-slate-900 mt-1">{formatDate(salesOrder.order_date_c)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-500">Customer</label>
                <p className="text-slate-900 mt-1">
                  {salesOrder.customer_id_c?.Name || 'No Customer Assigned'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-500">Status</label>
                <div className="mt-1">
                  <Badge className={`${statusColors[salesOrder.status_c] || statusColors.Draft}`}>
                    {salesOrder.status_c || 'Draft'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-900 border-b border-slate-200 pb-2">
                System Information
              </h3>

              <div>
                <label className="text-sm font-medium text-slate-500">Created On</label>
                <p className="text-slate-900 mt-1">{formatDateTime(salesOrder.CreatedOn)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-500">Modified On</label>
                <p className="text-slate-900 mt-1">{formatDateTime(salesOrder.ModifiedOn)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-500">Total Amount</label>
                <p className="text-slate-900 mt-1 text-lg font-medium">
                  {formatCurrency(salesOrder.total_amount_c)}
                </p>
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-medium text-slate-900 mb-3">Shipping Address</h4>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-slate-700 whitespace-pre-wrap">
                  {salesOrder.shipping_address_c || 'No shipping address provided'}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-md font-medium text-slate-900 mb-3">Billing Address</h4>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-slate-700 whitespace-pre-wrap">
                  {salesOrder.billing_address_c || 'No billing address provided'}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {salesOrder.notes_c && (
            <div>
              <h4 className="text-md font-medium text-slate-900 mb-3">Notes</h4>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-slate-700 whitespace-pre-wrap">{salesOrder.notes_c}</p>
              </div>
            </div>
          )}

          {/* Tags */}
          {salesOrder.Tags && (
            <div>
              <h4 className="text-md font-medium text-slate-900 mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {salesOrder.Tags.split(',').filter(Boolean).map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={() => onDelete(salesOrder)}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <ApperIcon name="Trash2" size={16} className="mr-2" />
              Delete
            </Button>
            <Button
              onClick={() => onEdit(salesOrder)}
              className="bg-primary-600 hover:bg-primary-700"
            >
              <ApperIcon name="Edit" size={16} className="mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalesOrderDetailModal;