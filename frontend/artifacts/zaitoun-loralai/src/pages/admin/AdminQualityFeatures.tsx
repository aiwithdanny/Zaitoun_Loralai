/**
 * Admin Quality Features Management Page
 * Full CRUD table with add/edit modal and delete confirmation
 */

import { Helmet } from "react-helmet-async";
import { useEffect, useState } from 'react';
import { adminApi, type QualityFeatureData } from '@/lib/api';
import { toast } from 'sonner';
import { Leaf, Clock, MapPin, Package, Award, Droplet, Shield, Sparkles, Heart, TreePine, Sun, Star } from 'lucide-react';

const ICON_OPTIONS = [
  { value: "leaf", label: "Leaf", icon: <Leaf className="w-4 h-4" /> },
  { value: "clock", label: "Clock", icon: <Clock className="w-4 h-4" /> },
  { value: "map-pin", label: "MapPin", icon: <MapPin className="w-4 h-4" /> },
  { value: "package", label: "Package", icon: <Package className="w-4 h-4" /> },
  { value: "award", label: "Award", icon: <Award className="w-4 h-4" /> },
  { value: "droplet", label: "Droplet", icon: <Droplet className="w-4 h-4" /> },
  { value: "shield", label: "Shield", icon: <Shield className="w-4 h-4" /> },
  { value: "sparkles", label: "Sparkles", icon: <Sparkles className="w-4 h-4" /> },
  { value: "heart", label: "Heart", icon: <Heart className="w-4 h-4" /> },
  { value: "tree-pine", label: "TreePine", icon: <TreePine className="w-4 h-4" /> },
  { value: "sun", label: "Sun", icon: <Sun className="w-4 h-4" /> },
  { value: "star", label: "Star", icon: <Star className="w-4 h-4" /> },
];

interface ModalState {
  type: 'add' | 'edit' | 'delete' | null;
  feature?: QualityFeatureData;
}

const emptyForm = {
  title: '',
  description: '',
  icon_name: 'leaf',
  sort_order: 0,
  is_active: true,
};

export default function AdminQualityFeatures() {
  const [features, setFeatures] = useState<QualityFeatureData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState<ModalState>({ type: null });
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminApi.getQualityFeatures();
      setFeatures(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load quality features');
      toast.error(err.message || 'Failed to load quality features');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setForm(emptyForm);
    setModal({ type: 'add' });
  };

  const handleEditClick = (feature: QualityFeatureData) => {
    setForm({
      title: feature.title,
      description: feature.description,
      icon_name: feature.icon_name,
      sort_order: feature.sort_order,
      is_active: feature.is_active ?? true,
    });
    setModal({ type: 'edit', feature });
  };

  const handleDeleteClick = (feature: QualityFeatureData) => {
    setModal({ type: 'delete', feature });
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      if (modal.type === 'add') {
        await adminApi.createQualityFeature(form);
        toast.success('Quality feature created successfully');
      } else if (modal.type === 'edit' && modal.feature) {
        await adminApi.updateQualityFeature(modal.feature.id, form);
        toast.success('Quality feature updated successfully');
      }

      setModal({ type: null });
      const data = await adminApi.getQualityFeatures();
      setFeatures(data);
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!modal.feature) return;
    try {
      setIsSubmitting(true);
      await adminApi.deleteQualityFeature(modal.feature.id);
      toast.success('Quality feature deleted successfully');
      setModal({ type: null });
      const data = await adminApi.getQualityFeatures();
      setFeatures(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete quality feature');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIconComponent = (iconName: string, className?: string) => {
    const option = ICON_OPTIONS.find((o) => o.value === iconName);
    return option ? (
      <div className={className || ''}>{option.icon}</div>
    ) : (
      <Leaf className={className || 'w-4 h-4'} />
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <Helmet>
          <title>Admin Quality Features — Zaitoun Loralai</title>
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
        <title>Admin Quality Features — Zaitoun Loralai</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quality Features</h1>
          <p className="text-gray-600 text-sm mt-1">
            Total features: <span className="font-medium">{features.length}</span>
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition"
        >
          + Add Feature
        </button>
      </div>

      {/* Error */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 text-sm">{error}</p>
          <button onClick={fetchData} className="mt-2 text-red-600 hover:text-red-700 font-medium text-sm underline">
            Try Again
          </button>
        </div>
      )}

      {/* Features Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Quality Features</h2>
        </div>

        {features.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="mb-2">No quality features yet</p>
            <button onClick={handleAddClick} className="text-blue-600 hover:underline text-sm font-medium">
              Add your first feature
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Icon</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {features.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      {getIconComponent(f.icon_name, 'w-6 h-6 text-blue-600')}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{f.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{f.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{f.sort_order}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        f.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {f.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleEditClick(f)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(f)}
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

      {/* Add/Edit Modal */}
      {(modal.type === 'add' || modal.type === 'edit') && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] flex flex-col">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
              <h2 className="text-lg font-bold text-gray-900">
                {modal.type === 'add' ? 'Add Quality Feature' : 'Edit Quality Feature'}
              </h2>
            </div>
            <div className="overflow-y-auto p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Cold-Pressed"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                  placeholder="Feature description..."
                  required
                />
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <div className="grid grid-cols-6 gap-2">
                  {ICON_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setForm({ ...form, icon_name: option.value })}
                      className={`p-2 rounded-lg border text-sm transition flex flex-col items-center gap-1 ${
                        form.icon_name === option.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                      title={option.label}
                    >
                      {option.icon}
                      <span className="text-[10px] truncate w-full text-center">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  min={0}
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
              </div>

              {/* Active */}
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

            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-lg flex justify-end gap-2">
              <button
                onClick={() => setModal({ type: null })}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !form.title || !form.description}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : modal.type === 'add' ? 'Create' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {modal.type === 'delete' && modal.feature && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Delete Quality Feature</h2>
            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to delete <strong>{modal.feature.title}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModal({ type: null })}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
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
