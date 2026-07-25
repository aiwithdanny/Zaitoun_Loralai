/**
 * Admin Tasting Notes Management Page
 * Full CRUD table with add/edit modal and delete confirmation
 */

import { Helmet } from "react-helmet-async";
import { useEffect, useState } from 'react';
import { adminApi, type TastingNoteData } from '@/lib/api';
import { toast } from 'sonner';

interface ModalState {
  type: 'add' | 'edit' | 'delete' | null;
  note?: TastingNoteData;
}

const emptyForm = {
  label: '',
  value: '',
  sort_order: 0,
  is_active: true,
};

export default function AdminTastingNotes() {
  const [notes, setNotes] = useState<TastingNoteData[]>([]);
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
      const data = await adminApi.getTastingNotes();
      setNotes(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load tasting notes');
      toast.error(err.message || 'Failed to load tasting notes');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setForm(emptyForm);
    setModal({ type: 'add' });
  };

  const handleEditClick = (note: TastingNoteData) => {
    setForm({
      label: note.label,
      value: note.value,
      sort_order: note.sort_order,
      is_active: note.is_active ?? true,
    });
    setModal({ type: 'edit', note });
  };

  const handleDeleteClick = (note: TastingNoteData) => {
    setModal({ type: 'delete', note });
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      if (modal.type === 'add') {
        await adminApi.createTastingNote(form);
        toast.success('Tasting note created successfully');
      } else if (modal.type === 'edit' && modal.note) {
        await adminApi.updateTastingNote(modal.note.id, form);
        toast.success('Tasting note updated successfully');
      }

      setModal({ type: null });
      const data = await adminApi.getTastingNotes();
      setNotes(data);
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!modal.note) return;
    try {
      setIsSubmitting(true);
      await adminApi.deleteTastingNote(modal.note.id);
      toast.success('Tasting note deleted successfully');
      setModal({ type: null });
      const data = await adminApi.getTastingNotes();
      setNotes(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete tasting note');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Helmet>
          <title>Admin Tasting Notes — Zaitoun Loralai</title>
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
        <title>Admin Tasting Notes — Zaitoun Loralai</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasting Notes</h1>
          <p className="text-gray-600 text-sm mt-1">
            Total notes: <span className="font-medium">{notes.length}</span>
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition"
        >
          + Add Note
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

      {/* Notes Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Tasting Notes</h2>
        </div>

        {notes.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="mb-2">No tasting notes yet</p>
            <button onClick={handleAddClick} className="text-blue-600 hover:underline text-sm font-medium">
              Add your first note
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Label</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {notes.map((n) => (
                  <tr key={n.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{n.label}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">{n.value}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{n.sort_order}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        n.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {n.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleEditClick(n)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(n)}
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
                {modal.type === 'add' ? 'Add Tasting Note' : 'Edit Tasting Note'}
              </h2>
            </div>
            <div className="overflow-y-auto p-6 space-y-4">
              {/* Label */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label *</label>
                <input
                  type="text"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Profile"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Examples: Profile, Aroma, Acidity, Perfect For
                </p>
              </div>

              {/* Value */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value *</label>
                <textarea
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                  placeholder="Medium-robust"
                  required
                />
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
                disabled={isSubmitting || !form.label || !form.value}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : modal.type === 'add' ? 'Create' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {modal.type === 'delete' && modal.note && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Delete Tasting Note</h2>
            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to delete <strong>{modal.note.label}</strong>? This action cannot be undone.
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
