/**
 * Admin Orders Management Page
 * View and manage customer orders with pagination, filtering, and detail modal
 */

import { useEffect, useState } from 'react';
import { Order, ordersApi } from '@/lib/api';
import { toast } from 'sonner';
import { OrderDetailModal } from '@/components/admin/OrderDetailModal';
import { formatPrice } from '@/utils/currency';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

const DEFAULT_LIMIT = 20;
const STATUS_FILTERS = ['', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

interface SortConfig {
  key: 'order_number' | 'customer_name' | 'total_amount' | 'created_at' | null;
  direction: 'asc' | 'desc';
}

interface OrdersListState {
  orders: Array<{
    id: number;
    order_number: string;
    customer_name: string;
    total_amount: number;
    status: string;
    payment_status: string;
    created_at: string;
  }>;
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminOrders() {
  const [state, setState] = useState<OrdersListState>({
    orders: [],
    count: 0,
    page: 1,
    limit: DEFAULT_LIMIT,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [deleteOrderId, setDeleteOrderId] = useState<number | null>(null);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });

  // Fetch orders on mount, page change, or filter change
  useEffect(() => {
    fetchOrders();
  }, [state.page, statusFilter]);

  // Refetch when an order was updated in the modal
  useEffect(() => {
    if (shouldRefetch) {
      fetchOrders();
      setShouldRefetch(false);
    }
  }, [shouldRefetch]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await ordersApi.getOrders(state.page, state.limit, statusFilter || undefined);

      // Calculate total pages client-side (no pagination metadata in response)
      const totalPages = Math.ceil(response.count / state.limit);

      setState({
        ...state,
        orders: response.data,
        count: response.count,
        totalPages,
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load orders';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    // Reset to page 1 when filtering
    setState({ ...state, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setState({ ...state, page: newPage });
  };

  const handleOrderClick = (orderNumber: string) => {
    setSelectedOrder(orderNumber);
  };

  const handleDeleteOrder = async () => {
    if (deleteOrderId === null) return;

    try {
      await ordersApi.deleteOrder(deleteOrderId);
      toast.success('Order cancelled successfully');
      setDeleteOrderId(null);
      fetchOrders();
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel order');
      setDeleteOrderId(null);
    }
  };

  const handleSort = (key: SortConfig['key']) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIndicator = (key: SortConfig['key']) => {
    if (sortConfig.key !== key) return ' ↕';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  // Sort orders client-side
  const sortedOrders = (() => {
    if (!sortConfig.key) return state.orders;

    return [...state.orders].sort((a, b) => {
      let aValue: any = a[sortConfig.key!];
      let bValue: any = b[sortConfig.key!];

      // Handle null/undefined
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // Compare
      if (typeof aValue === 'string') {
        const comparison = aValue.localeCompare(String(bValue));
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      } else if (typeof aValue === 'number') {
        const comparison = aValue - Number(bValue);
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }

      return 0;
    });
  })();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'unpaid':
        return 'bg-yellow-100 text-yellow-800';
      case 'refunded':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">View Orders</h1>
          <p className="text-gray-600 text-sm mt-1">
            Total orders: <span className="font-medium">{state.count}</span>
          </p>
        </div>
      </div>

      {/* Filters */}
      {!loading && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <label className="text-sm font-medium text-gray-700">Filter by Status</label>
          <select
            value={statusFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            {STATUS_FILTERS.map((status) => (
              <option key={status} value={status}>
                {status === '' ? 'All Orders' : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="text-red-800 font-medium mb-1">Error Loading Orders</h3>
          <p className="text-red-700 text-sm">{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-3 text-red-600 hover:text-red-700 font-medium text-sm underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      )}

      {/* Orders Table */}
      {!loading && state.orders.length > 0 && (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th
                      onClick={() => handleSort('order_number')}
                      className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition"
                    >
                      Order #{getSortIndicator('order_number')}
                    </th>
                    <th
                      onClick={() => handleSort('customer_name')}
                      className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition"
                    >
                      Customer{getSortIndicator('customer_name')}
                    </th>
                    <th
                      onClick={() => handleSort('created_at')}
                      className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition"
                    >
                      Date{getSortIndicator('created_at')}
                    </th>
                    <th
                      onClick={() => handleSort('total_amount')}
                      className="px-6 py-3 text-right text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition"
                    >
                      Total{getSortIndicator('total_amount')}
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Payment</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-900 font-mono font-medium">{order.order_number}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{order.customer_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">
                        {formatPrice(order.total_amount)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPaymentColor(order.payment_status)}`}>
                          {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOrderClick(order.order_number)}
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                          >
                            View Details
                          </button>
                          {order.status !== 'cancelled' && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <button
                                  onClick={() => setDeleteOrderId(order.id)}
                                  className="text-red-600 hover:text-red-700 font-medium text-sm"
                                >
                                  Delete
                                </button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Cancel Order?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will cancel order <span className="font-mono font-medium">{order.order_number}</span> for <span className="font-medium">{order.customer_name}</span>. This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setDeleteOrderId(null)}>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={handleDeleteOrder}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                  >
                                    Yes, Cancel Order
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {state.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page <span className="font-medium">{state.page}</span> of{' '}
                <span className="font-medium">{state.totalPages}</span> (
                <span className="font-medium">{state.count}</span> total orders)
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(state.page - 1)}
                  disabled={state.page === 1}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(state.page + 1)}
                  disabled={state.page === state.totalPages}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && state.orders.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 mb-4">
            {statusFilter ? `No orders found with status "${statusFilter}".` : 'No orders found.'}
          </p>
          {statusFilter && (
            <button
              onClick={() => handleFilterChange('')}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm underline"
            >
              View All Orders
            </button>
          )}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          orderNumber={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onOrderUpdated={() => {
            setShouldRefetch(true);
          }}
        />
      )}
    </div>
  );
}
