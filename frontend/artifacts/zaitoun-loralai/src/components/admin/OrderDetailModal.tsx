/**
 * Order Detail Modal Component
 * Shows full order details with customer info, items, and status/payment controls
 */

import { useEffect, useState } from 'react';
import { Order, OrderItem, ordersApi } from '@/lib/api';
import { toast } from 'sonner';
import { formatPrice } from '@/utils/currency';

interface OrderDetailModalProps {
  orderNumber: string;
  onClose: () => void;
  onOrderUpdated?: (updatedOrder: Order) => void;
}

const STATUS_OPTIONS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_OPTIONS = ['unpaid', 'paid', 'refunded'];

export function OrderDetailModal({ orderNumber, onClose, onOrderUpdated }: OrderDetailModalProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);
  const [editingPayment, setEditingPayment] = useState(false);

  // Fetch order details on mount
  useEffect(() => {
    fetchOrderDetails();
  }, [orderNumber]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await ordersApi.getOrder(orderNumber);
      setOrder(data);
      // Note: backend order doesn't include items array in the GET response
      // In a full implementation, we'd parse items from the order or fetch separately
      // For now, we'll just display the order summary
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load order details';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;

    try {
      setIsUpdating(true);
      const updated = await ordersApi.updateOrderStatus(order.order_number, newStatus);
      setOrder(updated);
      setEditingStatus(false);
      toast.success('Order status updated');
      onOrderUpdated?.(updated);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update status';
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePaymentChange = async (newPaymentStatus: string) => {
    if (!order) return;

    try {
      setIsUpdating(true);
      const updated = await ordersApi.updatePaymentStatus(order.order_number, newPaymentStatus);
      setOrder(updated);
      setEditingPayment(false);
      toast.success('Payment status updated');
      onOrderUpdated?.(updated);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update payment status';
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600 text-sm">Loading order...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-700 text-sm">{error}</p>
              <button
                onClick={fetchOrderDetails}
                className="mt-2 text-red-600 hover:text-red-700 font-medium text-sm underline"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Order Details */}
          {!loading && order && (
            <div className="space-y-6">
              {/* Order Header */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-600 uppercase">Order Number</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">{order.order_number}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 uppercase">Order Date</p>
                    <p className="text-sm text-gray-900 mt-1">
                      {new Date(order.created_at).toLocaleDateString()} at{' '}
                      {new Date(order.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Name</p>
                    <p className="text-sm font-medium text-gray-900">{order.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Email</p>
                    <p className="text-sm font-medium text-gray-900">{order.customer_email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{order.customer_phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Payment Method</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">{order.payment_method}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase mb-3">Shipping Address</h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{order.customer_address}</p>
              </div>

              {/* Order Amount */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-xs font-medium text-gray-600 uppercase">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatPrice(order.total_amount)}</p>
              </div>

              {/* Status Controls */}
              <div className="grid grid-cols-2 gap-4">
                {/* Order Status */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase mb-2">Order Status</h3>
                  {editingStatus ? (
                    <div className="space-y-2">
                      <select
                        defaultValue={order.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        disabled={isUpdating}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt.charAt(0).toUpperCase() + opt.slice(1)}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => setEditingStatus(false)}
                        className="text-xs text-gray-600 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <button
                        onClick={() => setEditingStatus(true)}
                        disabled={isUpdating}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-2 disabled:opacity-50"
                      >
                        Change Status
                      </button>
                    </>
                  )}
                </div>

                {/* Payment Status */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase mb-2">Payment Status</h3>
                  {editingPayment ? (
                    <div className="space-y-2">
                      <select
                        defaultValue={order.payment_status}
                        onChange={(e) => handlePaymentChange(e.target.value)}
                        disabled={isUpdating}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {PAYMENT_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt.charAt(0).toUpperCase() + opt.slice(1)}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => setEditingPayment(false)}
                        className="text-xs text-gray-600 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPaymentColor(order.payment_status)}`}>
                        {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                      </span>
                      <button
                        onClick={() => setEditingPayment(true)}
                        disabled={isUpdating}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-2 disabled:opacity-50"
                      >
                        Change Payment
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Timestamps */}
              <div className="border-t border-gray-200 pt-4">
                <p className="text-xs text-gray-600">
                  Last updated: {new Date(order.updated_at).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
