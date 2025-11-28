import React from 'react';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { format } from 'date-fns';

function CompanyTable({ companies, onSort, sortField, sortDirection, onEdit, onViewDetails }) {
  function formatCurrency(amount) {
    if (!amount) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  function formatDate(dateString) {
    if (!dateString) return '-';
    return format(new Date(dateString), 'MMM d, yyyy');
  }

  function getTags(tagsString) {
    if (!tagsString) return [];
    return tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
  }

  function SortButton({ field, children }) {
    const isActive = sortField === field;
    return (
      <button
        onClick={() => onSort(field)}
        className="flex items-center gap-1 text-left font-medium text-slate-700 hover:text-slate-900"
      >
        {children}
        {isActive && (
          <ApperIcon
            name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'}
            size={16}
            className="text-primary-600"
          />
        )}
      </button>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
          <ApperIcon name="Building" size={32} className="text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">No companies found</h3>
        <p className="text-slate-600">
          Try adjusting your search criteria or add a new company.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
              <SortButton field="Name">Company</SortButton>
            </th>
            <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
              <SortButton field="industry_c">Industry</SortButton>
            </th>
            <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
              <SortButton field="city_c">Location</SortButton>
            </th>
            <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
              <SortButton field="number_of_employees_c">Employees</SortButton>
            </th>
            <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
              <SortButton field="annual_revenue_c">Revenue</SortButton>
            </th>
            <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
              Tags
            </th>
            <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
              <SortButton field="ModifiedOn">Last Updated</SortButton>
            </th>
            <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {companies.map((company) => (
            <tr key={company.Id} className="hover:bg-slate-50">
              <td className="px-6 py-4">
                <div>
                  <div className="font-medium text-slate-900">{company.Name}</div>
                  {company.website_c && (
                    <div className="text-sm text-slate-500">
                      <a
                        href={company.website_c.startsWith('http') ? company.website_c : `https://${company.website_c}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        {company.website_c}
                      </a>
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                {company.industry_c ? (
                  <Badge variant="secondary">{company.industry_c}</Badge>
                ) : (
                  <span className="text-slate-500">-</span>
                )}
              </td>
              <td className="px-6 py-4 text-slate-900">
                {company.city_c && company.state_c ? (
                  `${company.city_c}, ${company.state_c}`
                ) : company.city_c || company.state_c || (
                  <span className="text-slate-500">-</span>
                )}
              </td>
              <td className="px-6 py-4 text-slate-900">
                {company.number_of_employees_c ? (
                  company.number_of_employees_c.toLocaleString()
                ) : (
                  <span className="text-slate-500">-</span>
                )}
              </td>
              <td className="px-6 py-4 text-slate-900">
                {formatCurrency(company.annual_revenue_c)}
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1 max-w-48">
                  {getTags(company.Tags).slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {getTags(company.Tags).length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{getTags(company.Tags).length - 2}
                    </Badge>
                  )}
                  {!company.Tags && <span className="text-slate-500">-</span>}
                </div>
              </td>
              <td className="px-6 py-4 text-slate-900">
                {formatDate(company.ModifiedOn)}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center gap-2 justify-end">
                  <Button
                    onClick={() => onViewDetails(company)}
                    variant="ghost"
                    size="sm"
                    className="p-2"
                    title="View Details"
                  >
                    <ApperIcon name="Eye" size={16} />
                  </Button>
                  <Button
                    onClick={() => onEdit(company)}
                    variant="ghost"
                    size="sm"
                    className="p-2"
                    title="Edit Company"
                  >
                    <ApperIcon name="Edit" size={16} />
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

export default CompanyTable;