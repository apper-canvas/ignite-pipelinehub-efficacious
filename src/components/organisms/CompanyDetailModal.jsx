import React from 'react';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { format } from 'date-fns';

function CompanyDetailModal({ company, onClose, onEdit }) {
  if (!company) return null;

  function formatCurrency(amount) {
    if (!amount) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  function formatDate(dateString) {
    if (!dateString) return 'Not available';
    return format(new Date(dateString), 'MMM d, yyyy');
  }

  function formatWebsite(website) {
    if (!website) return null;
    const url = website.startsWith('http') ? website : `https://${website}`;
    return url;
  }

  function getTags() {
    if (!company.Tags) return [];
    return company.Tags.split(',').map(tag => tag.trim()).filter(tag => tag);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <ApperIcon name="Building" size={24} className="text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{company.Name}</h2>
              {company.industry_c && (
                <p className="text-slate-600">{company.industry_c}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={onEdit}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ApperIcon name="Edit" size={16} />
              Edit
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-slate-100 rounded-full"
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Tags */}
          {company.Tags && (
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {getTags().map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                {company.phone_c && (
                  <div className="flex items-center gap-3">
                    <ApperIcon name="Phone" size={16} className="text-slate-400" />
                    <span className="text-slate-700">{company.phone_c}</span>
                  </div>
                )}
                {company.website_c && (
                  <div className="flex items-center gap-3">
                    <ApperIcon name="Globe" size={16} className="text-slate-400" />
                    <a
                      href={formatWebsite(company.website_c)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 underline"
                    >
                      {company.website_c}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4">Address</h3>
              <div className="text-slate-700 space-y-1">
                {company.address_c && (
                  <div>{company.address_c}</div>
                )}
                {(company.city_c || company.state_c || company.zip_code_c) && (
                  <div>
                    {[company.city_c, company.state_c, company.zip_code_c]
                      .filter(Boolean)
                      .join(', ')}
                  </div>
                )}
                {!company.address_c && !company.city_c && !company.state_c && !company.zip_code_c && (
                  <div className="text-slate-500 italic">No address provided</div>
                )}
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div>
            <h3 className="text-lg font-medium text-slate-900 mb-4">Business Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Industry:</span>
                  <span className="text-slate-900 font-medium">
                    {company.industry_c || 'Not specified'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Employees:</span>
                  <span className="text-slate-900 font-medium">
                    {company.number_of_employees_c ? company.number_of_employees_c.toLocaleString() : 'Not specified'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Annual Revenue:</span>
                  <span className="text-slate-900 font-medium">
                    {formatCurrency(company.annual_revenue_c)}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Created:</span>
                  <span className="text-slate-900">
                    {formatDate(company.CreatedOn)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Last Modified:</span>
                  <span className="text-slate-900">
                    {formatDate(company.ModifiedOn)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {company.description_c && (
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">Description</h3>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {company.description_c}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-slate-200">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
          <Button
            onClick={onEdit}
            className="bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2"
          >
            <ApperIcon name="Edit" size={16} />
            Edit Company
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CompanyDetailModal;