import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const statusColors = {
  Draft: 'bg-slate-100 text-slate-700',
  Open: 'bg-blue-100 text-blue-700',
  Closed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700'
};

function SalesOrderTable({ 
  salesOrders, 
  loading, 
  onEdit, 
  onView, 
  onDelete,
  sortBy,
  sortOrder,
  onSort 
}) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'N/A';
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) {
      return <ApperIcon name="ArrowUpDown" size={14} className="text-slate-400" />;
    }
    return sortOrder === 'asc' 
      ? <ApperIcon name="ArrowUp" size={14} className="text-slate-600" />
      : <ApperIcon name="ArrowDown" size={14} className="text-slate-600" />;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin h-6 w-6 border-2 border-primary-600 border-t-transparent rounded-full"></div>
            <span className="ml-2 text-slate-600">Loading sales orders...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!salesOrders?.length) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <ApperIcon name="FileText" size={48} className="text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No sales orders found</h3>
            <p className="text-slate-600 mb-4">Get started by creating your first sales order.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ApperIcon name="FileText" size={20} />
          Sales Orders ({salesOrders.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => onSort('Name')}
                    className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider hover:text-slate-700"
                  >
                    Order Name
                    {getSortIcon('Name')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => onSort('customer_id_c')}
                    className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider hover:text-slate-700"
                  >
                    Customer
                    {getSortIcon('customer_id_c')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => onSort('order_date_c')}
                    className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider hover:text-slate-700"
                  >
                    Order Date
                    {getSortIcon('order_date_c')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => onSort('total_amount_c')}
                    className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider hover:text-slate-700"
                  >
                    Total Amount
                    {getSortIcon('total_amount_c')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => onSort('status_c')}
                    className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider hover:text-slate-700"
                  >
                    Status
                    {getSortIcon('status_c')}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {salesOrders.map((order) => (
                <tr key={order.Id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-slate-900">
                        {order.Name || 'Untitled Order'}
                      </div>
                      {order.Tags && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {order.Tags.split(',').filter(Boolean).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag.trim()}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">
                      {order.customer_id_c?.Name || 'No Customer'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">
                      {formatDate(order.order_date_c)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">
                      {formatCurrency(order.total_amount_c)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge 
                      className={`${statusColors[order.status_c] || statusColors.Draft}`}
                    >
                      {order.status_c || 'Draft'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(order)}
                        className="text-slate-600 hover:text-primary-600"
                      >
                        <ApperIcon name="Eye" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(order)}
                        className="text-slate-600 hover:text-primary-600"
                      >
                        <ApperIcon name="Edit" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(order)}
                        className="text-slate-600 hover:text-red-600"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default SalesOrderTable;