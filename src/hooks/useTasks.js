import { useState, useEffect } from 'react';
import { tasksService } from '@/services/api/tasksService';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tasksService.getAll();
      setTasks(data);
    } catch (err) {
      setError(err.message);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      const newTask = await tasksService.create(taskData);
      if (newTask) {
        setTasks(prev => [newTask, ...prev]);
        return newTask;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const updatedTask = await tasksService.update(id, taskData);
      if (updatedTask) {
        setTasks(prev => 
          prev.map(task => task.Id === parseInt(id) ? updatedTask : task)
        );
        return updatedTask;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      const success = await tasksService.delete(id);
      if (success) {
        setTasks(prev => prev.filter(task => task.Id !== parseInt(id)));
        return true;
      }
      return false;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks
  };
};