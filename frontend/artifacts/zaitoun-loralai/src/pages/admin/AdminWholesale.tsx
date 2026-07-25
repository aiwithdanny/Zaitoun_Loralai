/**
 * Admin Wholesale Management Page
 * Config form (single-row) + sizes table (multi-row CRUD)
 */

import { Helmet } from "react-helmet-async";
import { useEffect, useState } from 'react';
import { adminApi, type WholesaleConfigData, type WholesaleSizeData } from '@/lib/api';
import { toast } from 'sonner';

interface SizeModalState {
  type: 'add' | 'edit' | 'delete' | null;
  size?: WholesaleSizeData;
}

const emptySizeForm = {
  size_liters: 100,
  sort_order: 0,
  is_active: true,
};

export default function AdminWholesale() {
  const [config, setConfig] = useState<WholesaleConfigData | null>(null);
  const [sizes, setSizes] = useState<WholesaleSizeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sizeModal, setSizeModal] = useState<SizeModalState>({ type: null });
  const [sizeForm, setSizeForm] = useState(emptySizeForm);
  const [configForm, setConfigForm] = useState({
    heading: '',
    description: '',
    cta_heading: '',
    cta_description: '',
    whatsapp_number: '',
    whatsapp_message: '',
    is_active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminApi.getWholesale();
      setConfig(data.config);
      setSizes(data.sizes);
      if (data.config) {
        setConfigForm({
          heading: data.config.heading || '',
          description: data.config.description || '',
          cta_heading: data.config.cta_heading || '',
          cta_description: data.config.cta_description || '',
          whatsapp_number: data.config.whatsapp_number || '',
          whatsapp_message: data.config.whatsapp_message || '',
          is_active: data.config.is_active ?? true,
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load wholesale data');
      toast.error(err.message || 'Failed to load wholesale data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    try {
      setSavingConfig(true);
      await adminApi.updateWholesaleConfig(configForm);
      toast.success('Wholesale config saved successfully');
      const data = await adminApi.getWholesale();
      setConfig(data.config);
    } catch (err: any) {
      toast.error(err.message || 'Failed to save config');
    } finally {
      setSavingConfig(false);
    }
  };

  const handleAddSizeClick = () => {
    setSizeForm(emptySizeForm);
    setSizeModal({ type: 'add' });
  };

  const handleEditSizeClick = (size: WholesaleSizeData) => {
    setSizeForm({
      size_liters: size.size_liters,
      sort_order: size.sort_order,
      is_active: size.is_active ?? true,
    });
    setSizeModal({ type: 'edit', size });
  };

  const handleDeleteSizeClick = (size: WholesaleSizeData) => {
    setSizeModal({ type: 'delete', size });
  };

  const handleSizeSubmit = async () => {
    try {
      setIsSubmitting(true);

      if (sizeModal.type === 'add') {
        await adminApi.createWholesaleSize(sizeForm);
        toast.success('Wholesale size created successfully');
      } else if (sizeModal.type === 'edit' && sizeModal.size) {
        await adminApi.updateWholesaleSize(sizeModal.size.id, sizeForm);
        toast.success('Wholesale size updated successfully');
      }

      setSizeModal({ type: null });
      const data = await adminApi.getWholesale();
      setSizes(data.sizes);
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSizeConfirm = async () => {
    if (!sizeModal.size) return;
    try {
      setIsSubmitting(true);
      await adminApi.deleteWholesaleSize(sizeModal.size.id);
      toast.success('Wholesale size deleted successfully');
      setSizeModal({ type: null });
      const data = await adminApi.getWholesale();
      setSizes(data.sizes);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete size');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Helmet>
          <title>Admin Wholesale — Zaitoun Loralai</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Helmet>
        <title>Admin Wholesale — Zaitoun Loralai</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Wholesale Settings</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 text-sm">{error}</p>
          <button onClick={fetchData} className="mt-2 text-red-600 hover:text-red-700 font-medium text-sm underline">
            Try Again
          </button>
        </div>
      )}

      {/* ─── Config Section ─── */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Content & WhatsApp Settings</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
            <input
              type="text"
              value={configForm.heading}
              onChange={(e) => setConfigForm({ ...configForm, heading: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Wholesale & Bulk Orders"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={configForm.description}
              onChange={(e) => setConfigForm({ ...configForm, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
              placeholder="Premium extra virgin olive oil..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CTA Heading</label>
            <input
              type="text"
              value={configForm.cta_heading}
              onChange={(e) => setConfigForm({ ...configForm, cta_heading: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Ready to Place a Bulk Order?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CTA Description</label>
            <textarea
              value={configForm.cta_description}
              onChange={(e) => setConfigForm({ ...configForm, cta_description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
              placeholder="Tell us your requirements..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
              <input
                type="text"
                value={configForm.whatsapp_number}
                onChange={(e) => setConfigForm({ ...configForm, whatsapp_number: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="923492882897"
              />
              <p className="text-xs text-gray-500 mt-1">Without + or spaces</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Message</label>
              <input
                type="text"
                value={configForm.whatsapp_message}
                onChange={(e) => setConfigForm({ ...configForm, whatsapp_message: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Hi, I'm interested in bulk pricing..."
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="config_is_active"
              checked={configForm.is_active}
              onChange={(e) => setConfigForm({ ...configForm, is_active: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="config_is_active" className="text-sm font-medium text-gray-700">Active</label>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveConfig}
              disabled={savingConfig}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition disabled:opacity-50"
            >
              {savingConfig ? 'Saving...' : 'Save Config'}
            </button>
          </div>
        </div>
      </div>

      {/* ─── Sizes Section ─── */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Bulk Sizes
            <span className="text-sm font-normal text-gray-500 ml-2">({sizes.length} total)</span>
          </h2>
          <button
            onClick={handleAddSizeClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition"
          >
            + Add Size
          </button>
        </div>

        {sizes.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="mb-2">No bulk sizes yet</p>
            <button onClick={handleAddSizeClick} className="text-blue-600 hover:underline text-sm font-medium">
              Add your first size
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size (L)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sizes.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{s.size_liters}L</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{s.sort_order}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        s.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {s.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleEditSizeClick(s)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSizeClick(s)}
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

      {/* Add/Edit Size Modal */}
      {(sizeModal.type === 'add' || sizeModal.type === 'edit') && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] flex flex-col">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
              <h2 className="text-lg font-bold text-gray-900">
                {sizeModal.type === 'add' ? 'Add Bulk Size' : 'Edit Bulk Size'}
              </h2>
            </div>
            <div className="overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Size (Liters) *</label>
                <input
                  type="number"
                  value={sizeForm.size_liters}
                  onChange={(e) => setSizeForm({ ...sizeForm, size_liters: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  min={1}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                <input
                  type="number"
                  value={sizeForm.sort_order}
                  onChange={(e) => setSizeForm({ ...sizeForm, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  min={0}
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="size_is_active"
                  checked={sizeForm.is_active}
                  onChange={(e) => setSizeForm({ ...sizeForm, is_active: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="size_is_active" className="text-sm font-medium text-gray-700">Active</label>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-lg flex justify-end gap-2">
              <button
                onClick={() => setSizeModal({ type: null })}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSizeSubmit}
                disabled={isSubmitting || !sizeForm.size_liters}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : sizeModal.type === 'add' ? 'Create' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {sizeModal.type === 'delete' && sizeModal.size && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Delete Bulk Size</h2>
            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to delete <strong>{sizeModal.size.size_liters}L</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSizeModal({ type: null })}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSizeConfirm}
                disabled={isSubmitting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm transition disabled:opacity-50"
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
