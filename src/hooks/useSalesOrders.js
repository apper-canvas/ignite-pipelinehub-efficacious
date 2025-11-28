import { useState, useEffect } from 'react';
import { salesOrdersService } from '@/services/api/salesOrdersService';

export function useSalesOrders() {
  const [salesOrders, setSalesOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSalesOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await salesOrdersService.getAll();
      setSalesOrders(data);
    } catch (err) {
      setError(err.message);
      setSalesOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const createSalesOrder = async (orderData) => {
    try {
      const newOrder = await salesOrdersService.create(orderData);
      if (newOrder) {
        setSalesOrders(prev => [newOrder, ...prev]);
        return newOrder;
      }
      return null;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const updateSalesOrder = async (id, orderData) => {
    try {
      const updatedOrder = await salesOrdersService.update(id, orderData);
      if (updatedOrder) {
        setSalesOrders(prev => 
          prev.map(order => order.Id === parseInt(id) ? updatedOrder : order)
        );
        return updatedOrder;
      }
      return null;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const deleteSalesOrder = async (id) => {
    try {
      const success = await salesOrdersService.delete(id);
      if (success) {
        setSalesOrders(prev => prev.filter(order => order.Id !== parseInt(id)));
        return true;
      }
      return false;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const getSalesOrderById = async (id) => {
    try {
      const order = await salesOrdersService.getById(id);
      return order;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  useEffect(() => {
    loadSalesOrders();
  }, []);

  return {
    salesOrders,
    loading,
    error,
    createSalesOrder,
    updateSalesOrder,
    deleteSalesOrder,
    getSalesOrderById,
    refetch: loadSalesOrders
  };
}
import { useState, useEffect } from 'react';
import { salesOrdersService } from '@/services/api/salesOrdersService';

export function useSalesOrders() {
  const [salesOrders, setSalesOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSalesOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await salesOrdersService.getAll();
      setSalesOrders(data);
    } catch (err) {
      setError(err.message);
      setSalesOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const createSalesOrder = async (orderData) => {
    try {
      const newOrder = await salesOrdersService.create(orderData);
      if (newOrder) {
        setSalesOrders(prev => [newOrder, ...prev]);
        return newOrder;
      }
      return null;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const updateSalesOrder = async (id, orderData) => {
    try {
      const updatedOrder = await salesOrdersService.update(id, orderData);
      if (updatedOrder) {
        setSalesOrders(prev => 
          prev.map(order => order.Id === parseInt(id) ? updatedOrder : order)
        );
        return updatedOrder;
      }
      return null;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const deleteSalesOrder = async (id) => {
    try {
      const success = await salesOrdersService.delete(id);
      if (success) {
        setSalesOrders(prev => prev.filter(order => order.Id !== parseInt(id)));
        return true;
      }
      return false;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const getSalesOrderById = async (id) => {
    try {
      const order = await salesOrdersService.getById(id);
      return order;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  useEffect(() => {
    loadSalesOrders();
  }, []);

  return {
    salesOrders,
    loading,
    error,
    createSalesOrder,
    updateSalesOrder,
    deleteSalesOrder,
    getSalesOrderById,
    refetch: loadSalesOrders
  };
}