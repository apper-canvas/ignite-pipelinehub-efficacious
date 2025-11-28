import React, { useState, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Textarea from '@/components/atoms/Textarea';
import Label from '@/components/atoms/Label';
import ApperIcon from '@/components/ApperIcon';
import FormField from '@/components/molecules/FormField';
import TagInput from '@/components/molecules/TagInput';
import { useCompanies } from '@/hooks/useCompanies';
import { useContacts } from '@/hooks/useContacts';
import { useDeals } from '@/hooks/useDeals';

function QuoteModal({ quote, onSave, onClose }) {
  const [formData, setFormData] = useState({
    Name: '',
    title_c: '',
    company_id_c: '',
    contact_id_c: '',
    deal_id_c: '',
    quote_date_c: '',
    status_c: 'Draft',
    delivery_method_c: 'Email',
    expires_on_c: '',
    bill_to_name_c: '',
    bill_to_street_c: '',
    bill_to_city_c: '',
    bill_to_state_c: '',
    bill_to_country_c: '',
    bill_to_pincode_c: '',
    ship_to_name_c: '',
    ship_to_street_c: '',
    ship_to_city_c: '',
    ship_to_state_c: '',
    ship_to_country_c: '',
    ship_to_pincode_c: '',
    notes_c: '',
    total_amount_c: '',
    discount_c: '',
    Tags: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { companies } = useCompanies();
  const { contacts } = useContacts();
  const { deals } = useDeals();

  useEffect(() => {
    if (quote) {
      setFormData({
        Name: quote.Name || '',
        title_c: quote.title_c || '',
        company_id_c: quote.company_id_c?.Id || '',
        contact_id_c: quote.contact_id_c?.Id || '',
        deal_id_c: quote.deal_id_c?.Id || '',
        quote_date_c: quote.quote_date_c || '',
        status_c: quote.status_c || 'Draft',
        delivery_method_c: quote.delivery_method_c || 'Email',
        expires_on_c: quote.expires_on_c || '',
        bill_to_name_c: quote.bill_to_name_c || '',
        bill_to_street_c: quote.bill_to_street_c || '',
        bill_to_city_c: quote.bill_to_city_c || '',
        bill_to_state_c: quote.bill_to_state_c || '',
        bill_to_country_c: quote.bill_to_country_c || '',
        bill_to_pincode_c: quote.bill_to_pincode_c || '',
        ship_to_name_c: quote.ship_to_name_c || '',
        ship_to_street_c: quote.ship_to_street_c || '',
        ship_to_city_c: quote.ship_to_city_c || '',
        ship_to_state_c: quote.ship_to_state_c || '',
        ship_to_country_c: quote.ship_to_country_c || '',
        ship_to_pincode_c: quote.ship_to_pincode_c || '',
        notes_c: quote.notes_c || '',
        total_amount_c: quote.total_amount_c || '',
        discount_c: quote.discount_c || '',
        Tags: quote.Tags || ''
      });
    } else {
      // Set default quote date to today
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        quote_date_c: today
      }));
    }
  }, [quote]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title_c.trim()) {
      newErrors.title_c = 'Title is required';
    }

    if (!formData.quote_date_c) {
      newErrors.quote_date_c = 'Quote date is required';
    }

    if (!formData.total_amount_c || parseFloat(formData.total_amount_c) <= 0) {
      newErrors.total_amount_c = 'Valid total amount is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Generate Name from title if not provided
      const submitData = {
        ...formData,
        Name: formData.Name || formData.title_c
      };
      await onSave(submitData);
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: 'Draft', label: 'Draft' },
    { value: 'Sent', label: 'Sent' },
    { value: 'Accepted', label: 'Accepted' },
    { value: 'Rejected', label: 'Rejected' },
    { value: 'Expired', label: 'Expired' }
  ];

  const deliveryMethodOptions = [
    { value: 'Email', label: 'Email' },
    { value: 'Post', label: 'Post' },
    { value: 'Courier', label: 'Courier' },
    { value: 'In Person', label: 'In Person' }
  ];

  const companyOptions = companies.map(company => ({
    value: company.Id,
    label: company.Name || company.name_c || 'Unnamed Company'
  }));

  const contactOptions = contacts.map(contact => ({
    value: contact.Id,
    label: `${contact.first_name_c || ''} ${contact.last_name_c || ''}`.trim() || contact.Name || 'Unnamed Contact'
  }));

  const dealOptions = deals.map(deal => ({
    value: deal.Id,
    label: deal.Name || deal.name_c || 'Unnamed Deal'
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">
            {quote ? 'Edit Quote' : 'New Quote'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Title"
              required
              error={errors.title_c}
            >
              <Input
                value={formData.title_c}
                onChange={(e) => handleChange('title_c', e.target.value)}
                placeholder="Enter quote title"
              />
            </FormField>

            <FormField label="Internal Name">
              <Input
                value={formData.Name}
                onChange={(e) => handleChange('Name', e.target.value)}
                placeholder="Auto-generated from title"
              />
            </FormField>

            <FormField label="Company">
              <Select
                value={formData.company_id_c}
                onChange={(value) => handleChange('company_id_c', value)}
                options={[
                  { value: '', label: 'Select Company' },
                  ...companyOptions
                ]}
                placeholder="Select company"
              />
            </FormField>

            <FormField label="Contact">
              <Select
                value={formData.contact_id_c}
                onChange={(value) => handleChange('contact_id_c', value)}
                options={[
                  { value: '', label: 'Select Contact' },
                  ...contactOptions
                ]}
                placeholder="Select contact"
              />
            </FormField>

            <FormField label="Related Deal">
              <Select
                value={formData.deal_id_c}
                onChange={(value) => handleChange('deal_id_c', value)}
                options={[
                  { value: '', label: 'Select Deal' },
                  ...dealOptions
                ]}
                placeholder="Select deal"
              />
            </FormField>

            <FormField label="Status">
              <Select
                value={formData.status_c}
                onChange={(value) => handleChange('status_c', value)}
                options={statusOptions}
              />
            </FormField>
          </div>

          {/* Dates and Delivery */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              label="Quote Date"
              required
              error={errors.quote_date_c}
            >
              <Input
                type="date"
                value={formData.quote_date_c}
                onChange={(e) => handleChange('quote_date_c', e.target.value)}
              />
            </FormField>

            <FormField label="Expires On">
              <Input
                type="date"
                value={formData.expires_on_c}
                onChange={(e) => handleChange('expires_on_c', e.target.value)}
              />
            </FormField>

            <FormField label="Delivery Method">
              <Select
                value={formData.delivery_method_c}
                onChange={(value) => handleChange('delivery_method_c', value)}
                options={deliveryMethodOptions}
              />
            </FormField>
          </div>

          {/* Financial Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Total Amount"
              required
              error={errors.total_amount_c}
            >
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.total_amount_c}
                onChange={(e) => handleChange('total_amount_c', e.target.value)}
                placeholder="0.00"
              />
            </FormField>

            <FormField label="Discount">
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.discount_c}
                onChange={(e) => handleChange('discount_c', e.target.value)}
                placeholder="0.00"
              />
            </FormField>
          </div>

          {/* Billing Address */}
          <div>
            <h3 className="text-lg font-medium text-slate-900 mb-4">Billing Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Bill To Name">
                <Input
                  value={formData.bill_to_name_c}
                  onChange={(e) => handleChange('bill_to_name_c', e.target.value)}
                  placeholder="Billing name"
                />
              </FormField>

              <FormField label="Street Address">
                <Input
                  value={formData.bill_to_street_c}
                  onChange={(e) => handleChange('bill_to_street_c', e.target.value)}
                  placeholder="Street address"
                />
              </FormField>

              <FormField label="City">
                <Input
                  value={formData.bill_to_city_c}
                  onChange={(e) => handleChange('bill_to_city_c', e.target.value)}
                  placeholder="City"
                />
              </FormField>

              <FormField label="State">
                <Input
                  value={formData.bill_to_state_c}
                  onChange={(e) => handleChange('bill_to_state_c', e.target.value)}
                  placeholder="State"
                />
              </FormField>

              <FormField label="Country">
                <Input
                  value={formData.bill_to_country_c}
                  onChange={(e) => handleChange('bill_to_country_c', e.target.value)}
                  placeholder="Country"
                />
              </FormField>

              <FormField label="PIN Code">
                <Input
                  value={formData.bill_to_pincode_c}
                  onChange={(e) => handleChange('bill_to_pincode_c', e.target.value)}
                  placeholder="PIN code"
                />
              </FormField>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="text-lg font-medium text-slate-900 mb-4">Shipping Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Ship To Name">
                <Input
                  value={formData.ship_to_name_c}
                  onChange={(e) => handleChange('ship_to_name_c', e.target.value)}
                  placeholder="Shipping name"
                />
              </FormField>

              <FormField label="Street Address">
                <Input
                  value={formData.ship_to_street_c}
                  onChange={(e) => handleChange('ship_to_street_c', e.target.value)}
                  placeholder="Street address"
                />
              </FormField>

              <FormField label="City">
                <Input
                  value={formData.ship_to_city_c}
                  onChange={(e) => handleChange('ship_to_city_c', e.target.value)}
                  placeholder="City"
                />
              </FormField>

              <FormField label="State">
                <Input
                  value={formData.ship_to_state_c}
                  onChange={(e) => handleChange('ship_to_state_c', e.target.value)}
                  placeholder="State"
                />
              </FormField>

              <FormField label="Country">
                <Input
                  value={formData.ship_to_country_c}
                  onChange={(e) => handleChange('ship_to_country_c', e.target.value)}
                  placeholder="Country"
                />
              </FormField>

              <FormField label="PIN Code">
                <Input
                  value={formData.ship_to_pincode_c}
                  onChange={(e) => handleChange('ship_to_pincode_c', e.target.value)}
                  placeholder="PIN code"
                />
              </FormField>
            </div>
          </div>

          {/* Notes and Tags */}
          <div className="space-y-6">
            <FormField label="Notes">
              <Textarea
                value={formData.notes_c}
                onChange={(e) => handleChange('notes_c', e.target.value)}
                rows={4}
                placeholder="Add notes or special instructions..."
              />
            </FormField>

            <FormField label="Tags">
              <TagInput
                value={formData.Tags}
                onChange={(value) => handleChange('Tags', value)}
                placeholder="Add tags to categorize this quote..."
              />
            </FormField>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : quote ? 'Update Quote' : 'Create Quote'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuoteModal;