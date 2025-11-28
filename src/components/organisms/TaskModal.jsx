import React, { useState, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import Select from '@/components/atoms/Select';
import Textarea from '@/components/atoms/Textarea';
import ApperIcon from '@/components/ApperIcon';
import { useContacts } from '@/hooks/useContacts';
import { useActivities } from '@/hooks/useActivities';
import { useDeals } from '@/hooks/useDeals';

const TaskModal = ({ task, onSave, onClose }) => {
  const { contacts } = useContacts();
  const { activities } = useActivities();
  const { deals } = useDeals();

  const [formData, setFormData] = useState({
    Name: '',
    title_c: '',
    description_c: '',
    status_c: 'Open',
    priority_c: 'Medium',
    due_date_c: '',
    assigned_to_id_c: '',
    activity_id_c: '',
    deal_id_c: ''
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        Name: task.Name || '',
        title_c: task.title_c || '',
        description_c: task.description_c || '',
        status_c: task.status_c || 'Open',
        priority_c: task.priority_c || 'Medium',
        due_date_c: task.due_date_c ? task.due_date_c.split('T')[0] : '',
        assigned_to_id_c: task.assigned_to_id_c?.Id || '',
        activity_id_c: task.activity_id_c?.Id || '',
        deal_id_c: task.deal_id_c?.Id || ''
      });
    }
  }, [task]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.Name.trim() || !formData.title_c.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="md:col-span-2">
              <Label htmlFor="Name">Task Name *</Label>
              <Input
                id="Name"
                name="Name"
                value={formData.Name}
                onChange={handleInputChange}
                placeholder="Enter task name"
                required
              />
            </div>

            {/* Title */}
            <div className="md:col-span-2">
              <Label htmlFor="title_c">Title *</Label>
              <Input
                id="title_c"
                name="title_c"
                value={formData.title_c}
                onChange={handleInputChange}
                placeholder="Enter task title"
                required
              />
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="status_c">Status</Label>
              <Select
                id="status_c"
                name="status_c"
                value={formData.status_c}
                onChange={handleInputChange}
              >
                <option value="Open">Open</option>
                <option value="InProgress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Blocked">Blocked</option>
              </Select>
            </div>

            {/* Priority */}
            <div>
              <Label htmlFor="priority_c">Priority</Label>
              <Select
                id="priority_c"
                name="priority_c"
                value={formData.priority_c}
                onChange={handleInputChange}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Select>
            </div>

            {/* Due Date */}
            <div>
              <Label htmlFor="due_date_c">Due Date</Label>
              <Input
                id="due_date_c"
                name="due_date_c"
                type="date"
                value={formData.due_date_c}
                onChange={handleInputChange}
              />
            </div>

            {/* Assigned To */}
            <div>
              <Label htmlFor="assigned_to_id_c">Assigned To</Label>
              <Select
                id="assigned_to_id_c"
                name="assigned_to_id_c"
                value={formData.assigned_to_id_c}
                onChange={handleInputChange}
              >
                <option value="">Select Contact</option>
                {contacts.map(contact => (
                  <option key={contact.Id} value={contact.Id}>
                    {contact.Name}
                  </option>
                ))}
              </Select>
            </div>

            {/* Activity */}
            <div>
              <Label htmlFor="activity_id_c">Related Activity</Label>
              <Select
                id="activity_id_c"
                name="activity_id_c"
                value={formData.activity_id_c}
                onChange={handleInputChange}
              >
                <option value="">Select Activity</option>
                {activities.map(activity => (
                  <option key={activity.Id} value={activity.Id}>
                    {activity.Name}
                  </option>
                ))}
              </Select>
            </div>

            {/* Deal */}
            <div>
              <Label htmlFor="deal_id_c">Related Deal</Label>
              <Select
                id="deal_id_c"
                name="deal_id_c"
                value={formData.deal_id_c}
                onChange={handleInputChange}
              >
                <option value="">Select Deal</option>
                {deals.map(deal => (
                  <option key={deal.Id} value={deal.Id}>
                    {deal.Name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description_c">Description</Label>
            <Textarea
              id="description_c"
              name="description_c"
              value={formData.description_c}
              onChange={handleInputChange}
              placeholder="Enter task description"
              rows={4}
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;