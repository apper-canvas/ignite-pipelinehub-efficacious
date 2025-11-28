import React, { useState, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import Select from '@/components/atoms/Select';
import Textarea from '@/components/atoms/Textarea';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

function CompanyModal({ company, onSave, onClose }) {
  const [formData, setFormData] = useState({
    Name: '',
    Tags: '',
    industry_c: '',
    address_c: '',
    city_c: '',
    state_c: '',
    zip_code_c: '',
    phone_c: '',
    website_c: '',
    number_of_employees_c: '',
    annual_revenue_c: '',
    description_c: ''
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const industryOptions = [
    'Manufacturing',
    'Technology',
    'Finance', 
    'Healthcare',
    'Education',
    'Retail',
    'Other'
  ];

  useEffect(() => {
    if (company) {
      setFormData({
        Name: company.Name || '',
        Tags: company.Tags || '',
        industry_c: company.industry_c || '',
        address_c: company.address_c || '',
        city_c: company.city_c || '',
        state_c: company.state_c || '',
        zip_code_c: company.zip_code_c || '',
        phone_c: company.phone_c || '',
        website_c: company.website_c || '',
        number_of_employees_c: company.number_of_employees_c || '',
        annual_revenue_c: company.annual_revenue_c || '',
        description_c: company.description_c || ''
      });
    }
  }, [company]);

  function validateForm() {
    const newErrors = {};

    if (!formData.Name.trim()) {
      newErrors.Name = 'Company name is required';
    }

    if (formData.website_c && !isValidUrl(formData.website_c)) {
      newErrors.website_c = 'Please enter a valid website URL';
    }

    if (formData.number_of_employees_c && (
      isNaN(formData.number_of_employees_c) || 
      parseInt(formData.number_of_employees_c) < 0
    )) {
      newErrors.number_of_employees_c = 'Please enter a valid number';
    }

    if (formData.annual_revenue_c && (
      isNaN(formData.annual_revenue_c) || 
      parseFloat(formData.annual_revenue_c) < 0
    )) {
      newErrors.annual_revenue_c = 'Please enter a valid revenue amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function isValidUrl(string) {
    try {
      new URL(string.startsWith('http') ? string : `https://${string}`);
      return true;
    } catch (_) {
      return false;
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving company:', error);
    } finally {
      setSaving(false);
    }
  }

  function handleClose() {
    if (!saving) {
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">
            {company ? 'Edit Company' : 'Add New Company'}
          </h2>
          <Button
            onClick={handleClose}
            variant="ghost"
            size="sm"
            disabled={saving}
            className="p-2 hover:bg-slate-100 rounded-full"
          >
            <ApperIcon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="Name" className="block text-sm font-medium text-slate-700">
                  Company Name *
                </Label>
                <Input
                  id="Name"
                  name="Name"
                  type="text"
                  value={formData.Name}
                  onChange={handleInputChange}
                  disabled={saving}
                  className={cn(
                    "mt-1",
                    errors.Name && "border-error-500 focus:border-error-500 focus:ring-error-500"
                  )}
                  placeholder="Enter company name"
                />
                {errors.Name && (
                  <p className="mt-1 text-sm text-error-600">{errors.Name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="industry_c" className="block text-sm font-medium text-slate-700">
                  Industry
                </Label>
                <Select
                  id="industry_c"
                  name="industry_c"
                  value={formData.industry_c}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="mt-1"
                >
                  <option value="">Select industry</option>
                  {industryOptions.map(industry => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="Tags" className="block text-sm font-medium text-slate-700">
                Tags
              </Label>
              <Input
                id="Tags"
                name="Tags"
                type="text"
                value={formData.Tags}
                onChange={handleInputChange}
                disabled={saving}
                className="mt-1"
                placeholder="Enter tags separated by commas"
              />
              <p className="mt-1 text-sm text-slate-500">
                Separate multiple tags with commas
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone_c" className="block text-sm font-medium text-slate-700">
                  Phone
                </Label>
                <Input
                  id="phone_c"
                  name="phone_c"
                  type="tel"
                  value={formData.phone_c}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="mt-1"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <Label htmlFor="website_c" className="block text-sm font-medium text-slate-700">
                  Website
                </Label>
                <Input
                  id="website_c"
                  name="website_c"
                  type="url"
                  value={formData.website_c}
                  onChange={handleInputChange}
                  disabled={saving}
                  className={cn(
                    "mt-1",
                    errors.website_c && "border-error-500 focus:border-error-500 focus:ring-error-500"
                  )}
                  placeholder="https://company.com"
                />
                {errors.website_c && (
                  <p className="mt-1 text-sm text-error-600">{errors.website_c}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900">Address</h3>
            
            <div>
              <Label htmlFor="address_c" className="block text-sm font-medium text-slate-700">
                Street Address
              </Label>
              <Textarea
                id="address_c"
                name="address_c"
                value={formData.address_c}
                onChange={handleInputChange}
                disabled={saving}
                className="mt-1"
                rows={2}
                placeholder="Enter street address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city_c" className="block text-sm font-medium text-slate-700">
                  City
                </Label>
                <Input
                  id="city_c"
                  name="city_c"
                  type="text"
                  value={formData.city_c}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="mt-1"
                  placeholder="Enter city"
                />
              </div>

              <div>
                <Label htmlFor="state_c" className="block text-sm font-medium text-slate-700">
                  State
                </Label>
                <Input
                  id="state_c"
                  name="state_c"
                  type="text"
                  value={formData.state_c}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="mt-1"
                  placeholder="Enter state"
                />
              </div>

              <div>
                <Label htmlFor="zip_code_c" className="block text-sm font-medium text-slate-700">
                  Zip Code
                </Label>
                <Input
                  id="zip_code_c"
                  name="zip_code_c"
                  type="text"
                  value={formData.zip_code_c}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="mt-1"
                  placeholder="12345"
                />
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900">Business Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="number_of_employees_c" className="block text-sm font-medium text-slate-700">
                  Number of Employees
                </Label>
                <Input
                  id="number_of_employees_c"
                  name="number_of_employees_c"
                  type="number"
                  min="0"
                  value={formData.number_of_employees_c}
                  onChange={handleInputChange}
                  disabled={saving}
                  className={cn(
                    "mt-1",
                    errors.number_of_employees_c && "border-error-500 focus:border-error-500 focus:ring-error-500"
                  )}
                  placeholder="100"
                />
                {errors.number_of_employees_c && (
                  <p className="mt-1 text-sm text-error-600">{errors.number_of_employees_c}</p>
                )}
              </div>

              <div>
                <Label htmlFor="annual_revenue_c" className="block text-sm font-medium text-slate-700">
                  Annual Revenue
                </Label>
                <Input
                  id="annual_revenue_c"
                  name="annual_revenue_c"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.annual_revenue_c}
                  onChange={handleInputChange}
                  disabled={saving}
                  className={cn(
                    "mt-1",
                    errors.annual_revenue_c && "border-error-500 focus:border-error-500 focus:ring-error-500"
                  )}
                  placeholder="1000000.00"
                />
                {errors.annual_revenue_c && (
                  <p className="mt-1 text-sm text-error-600">{errors.annual_revenue_c}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="description_c" className="block text-sm font-medium text-slate-700">
                Description
              </Label>
              <Textarea
                id="description_c"
                name="description_c"
                value={formData.description_c}
                onChange={handleInputChange}
                disabled={saving}
                className="mt-1"
                rows={3}
                placeholder="Enter company description"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-primary-600 hover:bg-primary-700 text-white"
            >
              {saving ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                company ? 'Update Company' : 'Create Company'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CompanyModal;