import React, { Suspense, useState } from "react";
import SalesOrderTable from "@/components/organisms/SalesOrderTable";
import SalesOrderModal from "@/components/organisms/SalesOrderModal";
import SalesOrderDetailModal from "@/components/organisms/SalesOrderDetailModal";
import { useSalesOrders } from "@/hooks/useSalesOrders";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";

function SalesOrders() {
  const { salesOrders, loading, error, createSalesOrder, updateSalesOrder, deleteSalesOrder } = useSalesOrders();
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSalesOrder, setSelectedSalesOrder] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Filter and sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('ModifiedOn');
  const [sortOrder, setSortOrder] = useState('desc');

  // Filter functions
  const getAllStatuses = () => {
    const statuses = [...new Set(salesOrders.map(order => order.status_c).filter(Boolean))];
    return statuses.map(status => ({ value: status, label: status }));
  };

  const filteredAndSortedOrders = () => {
    let filtered = salesOrders.filter(order => {
      const matchesSearch = !searchTerm || 
        (order.Name && order.Name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.customer_id_c?.Name && order.customer_id_c.Name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.Tags && order.Tags.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = !statusFilter || order.status_c === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      // Handle lookup fields
      if (sortBy === 'customer_id_c') {
        aVal = a.customer_id_c?.Name || '';
        bVal = b.customer_id_c?.Name || '';
      }
      
      if (sortBy === 'total_amount_c') {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
      }
      
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  };

  // Event handlers
  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const handleAddSalesOrder = () => {
    setSelectedSalesOrder(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditSalesOrder = (order) => {
    setSelectedSalesOrder(order);
    setIsEditing(true);
    setIsDetailModalOpen(false);
    setIsModalOpen(true);
  };

  const handleViewDetails = async (order) => {
    setSelectedSalesOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleSaveSalesOrder = async (orderData) => {
    if (isEditing && selectedSalesOrder) {
      await updateSalesOrder(selectedSalesOrder.Id, orderData);
    } else {
      await createSalesOrder(orderData);
    }
  };

  const handleDeleteSalesOrder = async (order) => {
    if (window.confirm(`Are you sure you want to delete the sales order "${order.Name}"? This action cannot be undone.`)) {
      const success = await deleteSalesOrder(order.Id);
      if (success) {
        setIsDetailModalOpen(false);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSalesOrder(null);
    setIsEditing(false);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedSalesOrder(null);
  };

  if (error) {
    return (
      <ErrorView 
        title="Error Loading Sales Orders"
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const filteredOrders = filteredAndSortedOrders();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Sales Orders</h1>
          <p className="text-slate-600">Manage your sales orders and track their progress</p>
        </div>
        <Button onClick={handleAddSalesOrder} className="mt-4 sm:mt-0">
          <ApperIcon name="Plus" size={20} className="mr-2" />
          New Sales Order
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search sales orders..."
              className="w-full"
            />
          </div>
          <div>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: '', label: 'All Statuses' },
                ...getAllStatuses()
              ]}
              placeholder="Filter by status"
            />
          </div>
          <div className="flex items-center justify-end">
            <span className="text-sm text-slate-600 mr-3">
              {filteredOrders.length} of {salesOrders.length} orders
            </span>
          </div>
        </div>
      </div>

      {/* Sales Orders Table */}
      <Suspense fallback={<Loading />}>
        <SalesOrderTable
          salesOrders={filteredOrders}
          loading={loading}
          onEdit={handleEditSalesOrder}
          onView={handleViewDetails}
          onDelete={handleDeleteSalesOrder}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
      </Suspense>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <SalesOrderModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveSalesOrder}
          salesOrder={selectedSalesOrder}
          loading={loading}
        />
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && (
        <SalesOrderDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          salesOrder={selectedSalesOrder}
          onEdit={handleEditSalesOrder}
          onDelete={handleDeleteSalesOrder}
        />
      )}
    </div>
  );
}

export default SalesOrders;