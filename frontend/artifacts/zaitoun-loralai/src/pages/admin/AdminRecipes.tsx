/**
 * Admin Recipes Management Page
 * Top: recipe section content editor (section_tag, headline)
 * Bottom: recipe CRUD table with add/edit modal and delete confirmation
 */

import { Helmet } from "react-helmet-async";
import { useEffect, useState, useRef } from 'react';
import { adminApi, type RecipeContentData, type RecipeData } from '@/lib/api';
import { toast } from 'sonner';

interface ModalState {
  type: 'add' | 'edit' | 'delete' | null;
  recipe?: RecipeData;
}

const emptyContentForm = {
  section_tag: '',
  headline: '',
  is_active: true,
};

const emptyRecipeForm = {
  title: '',
  description: '',
  image_url: '',
  sort_order: 0,
  is_active: true,
};

export default function AdminRecipes() {
  const [content, setContent] = useState<RecipeContentData | null>(null);
  const [recipes, setRecipes] = useState<RecipeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [contentForm, setContentForm] = useState(emptyContentForm);
  const [savingContent, setSavingContent] = useState(false);
  const [modal, setModal] = useState<ModalState>({ type: null });
  const [form, setForm] = useState(emptyRecipeForm);
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
      const [contentData, recipesData] = await Promise.all([
        adminApi.getRecipeContent(),
        adminApi.getRecipes(),
      ]);
      setContent(contentData);
      setRecipes(recipesData);
      if (contentData) {
        setContentForm({
          section_tag: contentData.section_tag || '',
          headline: contentData.headline || '',
          is_active: contentData.is_active,
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load recipe data');
      toast.error(err.message || 'Failed to load recipe data');
    } finally {
      setLoading(false);
    }
  };

  const handleContentSave = async () => {
    try {
      setSavingContent(true);
      const payload = {
        ...contentForm,
        section_tag: contentForm.section_tag || null,
        headline: contentForm.headline || null,
      };
      const saved = await adminApi.updateRecipeContent(payload);
      setContent(saved);
      toast.success('Section content saved');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save section content');
    } finally {
      setSavingContent(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      const url = await adminApi.uploadRecipeImage(file);
      setForm((prev) => ({ ...prev, image_url: url }));
      toast.success('Image uploaded');
    } catch (err: any) {
      toast.error(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleAddClick = () => {
    setForm(emptyRecipeForm);
    setModal({ type: 'add' });
  };

  const handleEditClick = (recipe: RecipeData) => {
    setForm({
      title: recipe.title,
      description: recipe.description || '',
      image_url: recipe.image_url || '',
      sort_order: recipe.sort_order,
      is_active: recipe.is_active,
    });
    setModal({ type: 'edit', recipe });
  };

  const handleDeleteClick = (recipe: RecipeData) => {
    setModal({ type: 'delete', recipe });
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const payload = {
        ...form,
        image_url: form.image_url || null,
        description: form.description || null,
      };

      if (modal.type === 'add') {
        await adminApi.createRecipe(payload);
        toast.success('Recipe created successfully');
      } else if (modal.type === 'edit' && modal.recipe) {
        await adminApi.updateRecipe(modal.recipe.id, payload);
        toast.success('Recipe updated successfully');
      }

      setModal({ type: null });
      const recipesData = await adminApi.getRecipes();
      setRecipes(recipesData);
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!modal.recipe) return;
    try {
      setIsSubmitting(true);
      await adminApi.deleteRecipe(modal.recipe.id);
      toast.success('Recipe deleted successfully');
      setModal({ type: null });
      const recipesData = await adminApi.getRecipes();
      setRecipes(recipesData);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete recipe');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Helmet>
          <title>Admin Recipes — Zaitoun Loralai</title>
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
        <title>Admin Recipes — Zaitoun Loralai</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recipes</h1>
          <p className="text-gray-600 text-sm mt-1">
            Total recipes: <span className="font-medium">{recipes.length}</span>
          </p>
        </div>
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

      {/* Section Content Editor */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Section Content</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Tag</label>
            <input
              type="text"
              value={contentForm.section_tag}
              onChange={(e) => setContentForm({ ...contentForm, section_tag: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="CULINARY INSPIRATION"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
            <input
              type="text"
              value={contentForm.headline}
              onChange={(e) => setContentForm({ ...contentForm, headline: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Serve with Elegance"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            id="content_is_active"
            checked={contentForm.is_active}
            onChange={(e) => setContentForm({ ...contentForm, is_active: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="content_is_active" className="text-sm font-medium text-gray-700">Active</label>
          <button
            onClick={handleContentSave}
            disabled={savingContent}
            className="ml-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition disabled:opacity-50"
          >
            {savingContent ? 'Saving...' : 'Save Section'}
          </button>
        </div>
      </div>

      {/* Recipes Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recipe Cards</h2>
          <button
            onClick={handleAddClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition"
          >
            + Add Recipe
          </button>
        </div>

        {recipes.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="mb-2">No recipes yet</p>
            <button onClick={handleAddClick} className="text-blue-600 hover:underline text-sm font-medium">
              Create your first recipe
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recipes.map((recipe) => (
                  <tr key={recipe.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      {recipe.image_url ? (
                        <img src={recipe.image_url} alt="" className="w-14 h-10 rounded object-cover" />
                      ) : (
                        <div className="w-14 h-10 rounded bg-gray-200 flex items-center justify-center text-gray-400 text-xs">N/A</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{recipe.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{recipe.sort_order}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        recipe.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {recipe.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleEditClick(recipe)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(recipe)}
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
                {modal.type === 'add' ? 'Add Recipe' : 'Edit Recipe'}
              </h2>
            </div>
            <div className="overflow-y-auto p-6 space-y-4">
              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                {form.image_url && (
                  <div className="mb-2">
                    <img src={form.image_url} alt="Preview" className="w-full h-32 object-cover rounded-lg border" />
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
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </button>
                  <input
                    type="text"
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Or paste image URL"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Roasted Root Vegetables"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-vertical"
                  placeholder="Earthy root vegetables..."
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

              {/* Active toggle */}
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
                disabled={isSubmitting || !form.title.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : modal.type === 'add' ? 'Create' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modal.type === 'delete' && modal.recipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Delete Recipe</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-medium">{modal.recipe.title}</span>? This action cannot be undone.
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
