import React, { useEffect, useState } from "react";
import { useContacts } from "@/hooks/useContacts";
import ApperIcon from "@/components/ApperIcon";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import Label from "@/components/atoms/Label";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const statusOptions = [
  { value: 'Draft', label: 'Draft' },
  { value: 'Open', label: 'Open' },
  { value: 'Closed', label: 'Closed' },
  { value: 'Cancelled', label: 'Cancelled' }
];

function SalesOrderModal({ isOpen, onClose, onSave, salesOrder, loading }) {
  const { contacts } = useContacts();
  const [formData, setFormData] = useState({
    Name: '',
    order_date_c: '',
    customer_id_c: '',
    total_amount_c: '',
    status_c: 'Draft',
    shipping_address_c: '',
    billing_address_c: '',
    notes_c: '',
    Tags: ''
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (salesOrder) {
      setFormData({
        Name: salesOrder.Name || '',
        order_date_c: salesOrder.order_date_c ? 
          new Date(salesOrder.order_date_c).toISOString().split('T')[0] : '',
        customer_id_c: salesOrder.customer_id_c?.Id?.toString() || '',
        total_amount_c: salesOrder.total_amount_c?.toString() || '',
        status_c: salesOrder.status_c || 'Draft',
        shipping_address_c: salesOrder.shipping_address_c || '',
        billing_address_c: salesOrder.billing_address_c || '',
        notes_c: salesOrder.notes_c || '',
        Tags: salesOrder.Tags || ''
      });
    } else {
      setFormData({
        Name: '',
        order_date_c: new Date().toISOString().split('T')[0],
        customer_id_c: '',
        total_amount_c: '',
        status_c: 'Draft',
        shipping_address_c: '',
        billing_address_c: '',
        notes_c: '',
        Tags: ''
      });
    }
    setErrors({});
  }, [salesOrder, isOpen]);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.Name.trim()) {
      newErrors.Name = 'Order name is required';
    }

    if (!formData.order_date_c) {
      newErrors.order_date_c = 'Order date is required';
    }

    if (!formData.customer_id_c) {
      newErrors.customer_id_c = 'Customer is required';
    }

    if (!formData.total_amount_c) {
      newErrors.total_amount_c = 'Total amount is required';
    } else if (isNaN(parseFloat(formData.total_amount_c))) {
      newErrors.total_amount_c = 'Total amount must be a valid number';
    } else if (parseFloat(formData.total_amount_c) < 0) {
      newErrors.total_amount_c = 'Total amount cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const orderData = {
        ...formData,
        order_date_c: new Date(formData.order_date_c).toISOString()
      };
      
      await onSave(orderData);
      onClose();
    } catch (error) {
      console.error('Error saving sales order:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Create customer options from contacts
  const customerOptions = contacts.map(contact => ({
    value: contact.Id?.toString(),
    label: contact.Name || `${contact.first_name_c || ''} ${contact.last_name_c || ''}`.trim() || 'Unnamed Contact'
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">
            {salesOrder ? 'Edit Sales Order' : 'Create Sales Order'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={saving}
            className="text-slate-400 hover:text-slate-600"
          >
            <ApperIcon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="Name">Order Name *</Label>
              <Input
                id="Name"
                value={formData.Name}
                onChange={(e) => handleInputChange('Name', e.target.value)}
                placeholder="Enter order name"
                disabled={saving}
                className={errors.Name ? 'border-red-500' : ''}
              />
              {errors.Name && (
                <p className="text-red-500 text-sm mt-1">{errors.Name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="order_date_c">Order Date *</Label>
              <Input
                id="order_date_c"
                type="date"
                value={formData.order_date_c}
                onChange={(e) => handleInputChange('order_date_c', e.target.value)}
                disabled={saving}
                className={errors.order_date_c ? 'border-red-500' : ''}
              />
              {errors.order_date_c && (
                <p className="text-red-500 text-sm mt-1">{errors.order_date_c}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customer_id_c">Customer *</Label>
              <Select
                id="customer_id_c"
                value={formData.customer_id_c}
                onChange={(value) => handleInputChange('customer_id_c', value)}
                options={[
                  { value: '', label: 'Select a customer' },
                  ...customerOptions
                ]}
                disabled={saving}
                className={errors.customer_id_c ? 'border-red-500' : ''}
              />
              {errors.customer_id_c && (
                <p className="text-red-500 text-sm mt-1">{errors.customer_id_c}</p>
              )}
            </div>

            <div>
              <Label htmlFor="total_amount_c">Total Amount *</Label>
              <Input
                id="total_amount_c"
                type="number"
                step="0.01"
                min="0"
                value={formData.total_amount_c}
                onChange={(e) => handleInputChange('total_amount_c', e.target.value)}
                placeholder="0.00"
                disabled={saving}
                className={errors.total_amount_c ? 'border-red-500' : ''}
              />
              {errors.total_amount_c && (
                <p className="text-red-500 text-sm mt-1">{errors.total_amount_c}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="status_c">Status</Label>
            <Select
              id="status_c"
              value={formData.status_c}
              onChange={(value) => handleInputChange('status_c', value)}
              options={statusOptions}
              disabled={saving}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="shipping_address_c">Shipping Address</Label>
              <Textarea
                id="shipping_address_c"
                value={formData.shipping_address_c}
                onChange={(e) => handleInputChange('shipping_address_c', e.target.value)}
                placeholder="Enter shipping address"
                disabled={saving}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="billing_address_c">Billing Address</Label>
              <Textarea
                id="billing_address_c"
                value={formData.billing_address_c}
                onChange={(e) => handleInputChange('billing_address_c', e.target.value)}
                placeholder="Enter billing address"
                disabled={saving}
                rows={3}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes_c">Notes</Label>
            <Textarea
              id="notes_c"
              value={formData.notes_c}
              onChange={(e) => handleInputChange('notes_c', e.target.value)}
              placeholder="Enter any additional notes"
              disabled={saving}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="Tags">Tags</Label>
            <Input
              id="Tags"
              value={formData.Tags}
              onChange={(e) => handleInputChange('Tags', e.target.value)}
              placeholder="Enter tags separated by commas"
              disabled={saving}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="min-w-[100px]"
            >
              {saving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                salesOrder ? 'Update' : 'Create'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SalesOrderModal;