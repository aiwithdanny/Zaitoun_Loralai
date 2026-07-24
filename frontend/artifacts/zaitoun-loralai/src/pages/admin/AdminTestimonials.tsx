/**
 * Admin Testimonials Management Page
 * Full CRUD table with add/edit modal and delete confirmation
 */

import { Helmet } from "react-helmet-async";
import { useEffect, useState, useRef } from 'react';
import { adminApi, type TestimonialData } from '@/lib/api';
import { toast } from 'sonner';
import { Star } from 'lucide-react';

interface ModalState {
  type: 'add' | 'edit' | 'delete' | null;
  testimonial?: TestimonialData;
}

const emptyForm = {
  name: '',
  location: '',
  quote: '',
  rating: 5,
  image_url: '',
  sort_order: 0,
  is_active: true,
};

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState<ModalState>({ type: null });
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminApi.getTestimonials();
      setTestimonials(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load testimonials');
      toast.error(err.message || 'Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      const url = await adminApi.uploadTestimonialImage(file);
      setForm((prev) => ({ ...prev, image_url: url }));
      toast.success('Image uploaded');
    } catch (err: any) {
      toast.error(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleAddClick = () => {
    setForm(emptyForm);
    setModal({ type: 'add' });
  };

  const handleEditClick = (testimonial: TestimonialData) => {
    setForm({
      name: testimonial.name,
      location: testimonial.location || '',
      quote: testimonial.quote,
      rating: testimonial.rating,
      image_url: testimonial.image_url || '',
      sort_order: testimonial.sort_order || 0,
      is_active: testimonial.is_active ?? true,
    });
    setModal({ type: 'edit', testimonial });
  };

  const handleDeleteClick = (testimonial: TestimonialData) => {
    setModal({ type: 'delete', testimonial });
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const payload = {
        ...form,
        image_url: form.image_url || null,
        location: form.location || null,
      };

      if (modal.type === 'add') {
        await adminApi.createTestimonial(payload);
        toast.success('Testimonial created successfully');
      } else if (modal.type === 'edit' && modal.testimonial) {
        await adminApi.updateTestimonial(modal.testimonial.id, payload);
        toast.success('Testimonial updated successfully');
      }

      setModal({ type: null });
      const data = await adminApi.getTestimonials();
      setTestimonials(data);
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!modal.testimonial) return;
    try {
      setIsSubmitting(true);
      await adminApi.deleteTestimonial(modal.testimonial.id);
      toast.success('Testimonial deleted successfully');
      setModal({ type: null });
      const data = await adminApi.getTestimonials();
      setTestimonials(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete testimonial');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Helmet>
          <title>Admin Testimonials — Zaitoun Loralai</title>
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
        <title>Admin Testimonials — Zaitoun Loralai</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-gray-600 text-sm mt-1">
            Total testimonials: <span className="font-medium">{testimonials.length}</span>
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition"
        >
          + Add Testimonial
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

      {/* Testimonials Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Testimonials</h2>
        </div>

        {testimonials.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="mb-2">No testimonials yet</p>
            <button onClick={handleAddClick} className="text-blue-600 hover:underline text-sm font-medium">
              Add your first testimonial
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {testimonials.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      {t.image_url ? (
                        <img src={t.image_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">N/A</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{t.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{t.location || '—'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{t.sort_order}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        t.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {t.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleEditClick(t)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(t)}
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
                {modal.type === 'add' ? 'Add Testimonial' : 'Edit Testimonial'}
              </h2>
            </div>
            <div className="overflow-y-auto p-6 space-y-4">
              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                {form.image_url && (
                  <div className="mb-2">
                    <img src={form.image_url} alt="Preview" className="w-20 h-20 rounded-full object-cover border" />
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    {uploading ? 'Uploading...' : 'Upload Photo'}
                  </button>
                  {form.image_url && (
                    <button
                      onClick={() => setForm({ ...form, image_url: '' })}
                      className="px-4 py-2 border border-red-300 rounded-lg text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Fatima Ansari"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Karachi"
                />
              </div>

              {/* Quote */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quote *</label>
                <textarea
                  value={form.quote}
                  onChange={(e) => setForm({ ...form, quote: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                  placeholder="Customer testimonial text..."
                  required
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setForm({ ...form, rating: r })}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          r <= form.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm text-gray-500 ml-2">{form.rating}/5</span>
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
                disabled={isSubmitting || !form.name || !form.quote}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : modal.type === 'add' ? 'Create' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {modal.type === 'delete' && modal.testimonial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Delete Testimonial</h2>
            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to delete <strong>{modal.testimonial.name}</strong>'s testimonial? This action cannot be undone.
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
