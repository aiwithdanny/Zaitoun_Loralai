/**
 * Admin Product Accordion Sections Page
 * Full CRUD table with add/edit modal and delete confirmation
 */

import { Helmet } from "react-helmet-async";
import { useEffect, useState } from 'react';
import { adminApi, type ProductAccordionData } from '@/lib/api';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

interface ModalState {
  type: 'add' | 'edit' | 'delete' | null;
  section?: ProductAccordionData;
}

const emptyForm = {
  title: '',
  content: '',
  sort_order: 0,
  is_active: true,
};

export default function AdminProductAccordion() {
  const [sections, setSections] = useState<ProductAccordionData[]>([]);
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
      const data = await adminApi.getProductAccordions();
      setSections(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load accordion sections');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setForm(emptyForm);
    setModal({ type: 'add' });
  };

  const handleEditClick = (section: ProductAccordionData) => {
    setForm({
      title: section.title,
      content: section.content,
      sort_order: section.sort_order,
      is_active: section.is_active,
    });
    setModal({ type: 'edit', section });
  };

  const handleDeleteClick = (section: ProductAccordionData) => {
    setModal({ type: 'delete', section });
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!form.content.trim()) {
      toast.error('Content is required');
      return;
    }
    try {
      setIsSubmitting(true);
      if (modal.type === 'add') {
        await adminApi.createProductAccordion(form);
        toast.success('Accordion section created');
      } else if (modal.type === 'edit' && modal.section) {
        await adminApi.updateProductAccordion(modal.section.id, form);
        toast.success('Accordion section updated');
      }
      setModal({ type: null });
      await fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!modal.section) return;
    try {
      setIsSubmitting(true);
      await adminApi.deleteProductAccordion(modal.section.id);
      toast.success('Accordion section deleted');
      setModal({ type: null });
      await fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Delete failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Helmet><title>Admin Product Info — Zaitoun Loralai</title><meta name="robots" content="noindex" /></Helmet>
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Helmet><title>Admin Product Info — Zaitoun Loralai</title><meta name="robots" content="noindex" /></Helmet>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Info Accordions</h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage accordion sections shown on product detail pages
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition"
        >
          <Plus className="w-4 h-4" />
          Add Section
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 text-sm">{error}</p>
          <button onClick={fetchData} className="mt-2 text-red-600 hover:text-red-700 font-medium text-sm underline">
            Try Again
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
          Total sections: {sections.length}
        </div>

        {sections.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 text-sm mb-2">No accordion sections yet</p>
            <button onClick={handleAddClick} className="text-blue-600 hover:text-blue-700 font-medium text-sm underline">
              Add your first section
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-4">Title</div>
              <div className="col-span-5">Content Preview</div>
              <div className="col-span-1 text-center">Order</div>
              <div className="col-span-1 text-center">Active</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
            {sections.map((section) => (
              <div key={section.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 items-center hover:bg-gray-50 transition">
                <div className="col-span-4">
                  <p className="text-sm font-medium text-gray-900">{section.title}</p>
                </div>
                <div className="col-span-5">
                  <p className="text-sm text-gray-500 truncate">{section.content.replace(/<[^>]+>/g, '').substring(0, 120)}</p>
                </div>
                <div className="col-span-1 text-center">
                  <span className="text-sm text-gray-600">{section.sort_order}</span>
                </div>
                <div className="col-span-1 text-center">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${section.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                    {section.is_active ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="col-span-1 text-right flex items-center justify-end gap-2">
                  <button onClick={() => handleEditClick(section)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition" title="Edit">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteClick(section)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modal.type === 'add' || modal.type === 'edit' ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {modal.type === 'add' ? 'Add Accordion Section' : 'Edit Accordion Section'}
              </h2>
            </div>
            <div className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="e.g. Quality & Health Benefits"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                <p className="text-xs text-gray-400 mb-2">HTML is supported for tables, lists, and formatting.</p>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono resize-vertical"
                  placeholder="<p>Content here...</p>"
                />
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="0"
                />
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
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setModal({ type: null })}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !form.title.trim() || !form.content.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : modal.type === 'add' ? 'Create' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Delete Confirmation */}
      {modal.type === 'delete' && modal.section ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Delete Section</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600">
                Are you sure you want to delete <strong>"{modal.section.title}"</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setModal({ type: null })}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
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
      ) : null}
    </div>
  );
}
