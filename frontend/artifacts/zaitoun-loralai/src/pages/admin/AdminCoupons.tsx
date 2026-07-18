/**
 * Admin Coupons Management Page
 * Full CRUD for coupon codes with table view, add/edit modal, and delete confirmation
 */

import { Helmet } from "react-helmet-async";
import { useEffect, useState } from 'react';
import { adminApi, Coupon } from '@/lib/api';
import { toast } from 'sonner';
import { formatPrice } from '@/utils/currency';

interface ModalState {
  type: 'add' | 'edit' | 'delete' | null;
  coupon?: Coupon;
}

const emptyForm = {
  code: '',
  discount_type: 'percentage',
  discount_value: 0,
  min_order_amount: null as number | null,
  max_discount_amount: null as number | null,
  expiry_date: '',
  usage_limit: null as number | null,
  is_active: true,
};

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState<ModalState>({ type: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminApi.getCoupons();
      setCoupons(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load coupons');
      toast.error(err.message || 'Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setForm(emptyForm);
    setModal({ type: 'add' });
  };

  const handleEditClick = (coupon: Coupon) => {
    setForm({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_order_amount: coupon.min_order_amount,
      max_discount_amount: coupon.max_discount_amount,
      expiry_date: coupon.expiry_date ? coupon.expiry_date.slice(0, 16) : '',
      usage_limit: coupon.usage_limit,
      is_active: coupon.is_active,
    });
    setModal({ type: 'edit', coupon });
  };

  const handleDeleteClick = (coupon: Coupon) => {
    setModal({ type: 'delete', coupon });
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const payload = {
        ...form,
        expiry_date: form.expiry_date ? new Date(form.expiry_date).toISOString() : null,
        discount_value: Number(form.discount_value),
        min_order_amount: form.min_order_amount ? Number(form.min_order_amount) : null,
        max_discount_amount: form.max_discount_amount ? Number(form.max_discount_amount) : null,
        usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
      };

      if (modal.type === 'add') {
        await adminApi.createCoupon(payload);
        toast.success('Coupon created successfully');
      } else if (modal.type === 'edit' && modal.coupon) {
        await adminApi.updateCoupon(modal.coupon.id, payload);
        toast.success('Coupon updated successfully');
      }

      setModal({ type: null });
      await fetchCoupons();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!modal.coupon) return;
    try {
      setIsSubmitting(true);
      await adminApi.deleteCoupon(modal.coupon.id);
      toast.success('Coupon deleted successfully');
      setModal({ type: null });
      await fetchCoupons();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete coupon');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <Helmet>
        <title>Admin Coupons — Zaitoun Loralai</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupon Codes</h1>
          <p className="text-gray-600 text-sm mt-1">
            Total coupons: <span className="font-medium">{coupons.length}</span>
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
        >
          + Add Coupon
        </button>
      </div>

      {/* Error */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 text-sm">{error}</p>
          <button onClick={fetchCoupons} className="mt-2 text-red-600 hover:text-red-700 font-medium text-sm underline">
            Try Again
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {coupons.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="mb-2">No coupons yet</p>
              <button onClick={handleAddClick} className="text-blue-600 hover:underline text-sm font-medium">
                Create your first coupon
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {coupons.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <span className="font-mono font-medium text-gray-900">{coupon.code}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 capitalize">{coupon.discount_type}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {coupon.discount_type === 'percentage'
                          ? `${coupon.discount_value}%`
                          : formatPrice(coupon.discount_value)}
                        {coupon.max_discount_amount && coupon.discount_type === 'percentage'
                          ? <> (up to {formatPrice(coupon.max_discount_amount)})</>
                          : null}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {coupon.min_order_amount ? formatPrice(coupon.min_order_amount) : '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {coupon.expiry_date
                          ? new Date(coupon.expiry_date).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })
                          : '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {coupon.times_used}{coupon.usage_limit ? ` / ${coupon.usage_limit}` : ''}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          coupon.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {coupon.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleEditClick(coupon)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(coupon)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {(modal.type === 'add' || modal.type === 'edit') && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] flex flex-col">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
              <h2 className="text-lg font-bold text-gray-900">
                {modal.type === 'add' ? 'Add Coupon' : 'Edit Coupon'}
              </h2>
            </div>
            <div className="overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="SAVE20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                  <select
                    value={form.discount_type}
                    onChange={(e) => setForm({ ...form, discount_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {form.discount_type === 'percentage' ? 'Percentage (%)' : 'Amount (Rs.)'}
                  </label>
                  <input
                    type="number"
                    value={form.discount_value}
                    onChange={(e) => setForm({ ...form, discount_value: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Amount (Rs.)</label>
                  <input
                    type="number"
                    value={form.min_order_amount ?? ''}
                    onChange={(e) => setForm({ ...form, min_order_amount: e.target.value ? Number(e.target.value) : null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Optional"
                    min="0"
                  />
                </div>
                {form.discount_type === 'percentage' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Discount (Rs.)</label>
                    <input
                      type="number"
                      value={form.max_discount_amount ?? ''}
                      onChange={(e) => setForm({ ...form, max_discount_amount: e.target.value ? Number(e.target.value) : null })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Optional cap"
                      min="0"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input
                    type="datetime-local"
                    value={form.expiry_date}
                    onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
                  <input
                    type="number"
                    value={form.usage_limit ?? ''}
                    onChange={(e) => setForm({ ...form, usage_limit: e.target.value ? Number(e.target.value) : null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Unlimited"
                    min="1"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active</label>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-lg flex justify-end gap-3">
              <button
                onClick={() => setModal({ type: null })}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !form.code.trim() || !form.discount_value}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : modal.type === 'add' ? 'Create' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modal.type === 'delete' && modal.coupon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Delete Coupon</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-mono font-medium">{modal.coupon.code}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModal({ type: null })}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isSubmitting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
              >
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
