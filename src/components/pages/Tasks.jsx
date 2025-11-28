import React, { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import ErrorView from '@/components/ui/ErrorView';
import TaskModal from '@/components/organisms/TaskModal';
import TaskStatusBadge from '@/components/molecules/TaskStatusBadge';
import TaskPriorityBadge from '@/components/molecules/TaskPriorityBadge';
import { useTasks } from '@/hooks/useTasks';
import { format } from 'date-fns';

const Tasks = () => {
  const { tasks, loading, error, createTask, updateTask, deleteTask, refetch } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = !searchTerm || 
        task.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.title_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description_c?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || task.status_c === statusFilter;
      const matchesPriority = !priorityFilter || task.priority_c === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

  const handleAddTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.Id, taskData);
        toast.success('Task updated successfully');
      } else {
        await createTask(taskData);
        toast.success('Task created successfully');
      }
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      toast.error(error.message || 'Failed to save task');
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        toast.success('Task deleted successfully');
      } catch (error) {
        toast.error(error.message || 'Failed to delete task');
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorView error={error} onRetry={refetch} />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
          <p className="text-slate-600 mt-1">Manage your tasks and to-do items</p>
        </div>
        <Button onClick={handleAddTask} className="flex items-center gap-2">
          <ApperIcon name="Plus" size={16} />
          Add Task
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-32"
              >
                <option value="">All Status</option>
                <option value="Open">Open</option>
                <option value="InProgress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Blocked">Blocked</option>
              </Select>
              <Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-32"
              >
                <option value="">All Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Tasks ({filteredTasks.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="text-left p-4 font-medium text-slate-900">Task</th>
                  <th className="text-left p-4 font-medium text-slate-900">Status</th>
                  <th className="text-left p-4 font-medium text-slate-900">Priority</th>
                  <th className="text-left p-4 font-medium text-slate-900">Assigned To</th>
                  <th className="text-left p-4 font-medium text-slate-900">Due Date</th>
                  <th className="text-left p-4 font-medium text-slate-900">Modified</th>
                  <th className="text-center p-4 font-medium text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center p-8 text-slate-500">
                      {searchTerm || statusFilter || priorityFilter 
                        ? 'No tasks match your filters' 
                        : 'No tasks found. Create your first task to get started.'}
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr key={task.Id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="font-medium text-slate-900">
                            {task.title_c || task.Name}
                          </div>
                          {task.description_c && (
                            <div className="text-sm text-slate-600 truncate max-w-xs">
                              {task.description_c}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <TaskStatusBadge status={task.status_c} />
                      </td>
                      <td className="p-4">
                        <TaskPriorityBadge priority={task.priority_c} />
                      </td>
                      <td className="p-4 text-slate-600">
                        {task.assigned_to_id_c?.Name || 'Unassigned'}
                      </td>
                      <td className="p-4 text-slate-600">
                        {task.due_date_c ? format(new Date(task.due_date_c), 'MMM dd, yyyy') : '-'}
                      </td>
                      <td className="p-4 text-slate-600">
                        {task.ModifiedOn ? format(new Date(task.ModifiedOn), 'MMM dd, yyyy') : '-'}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditTask(task)}
                            className="p-2"
                          >
                            <ApperIcon name="Edit" size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTask(task.Id)}
                            className="p-2 text-error-600 hover:text-error-700"
                          >
                            <ApperIcon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Task Modal */}
      {isModalOpen && (
        <TaskModal
          task={editingTask}
          onSave={handleSaveTask}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};

export default Tasks;