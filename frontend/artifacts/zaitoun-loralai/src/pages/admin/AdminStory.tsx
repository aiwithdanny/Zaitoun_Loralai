/**
 * Admin Story Editor Page
 * Single-item editor for story content with live preview
 */

import { Helmet } from "react-helmet-async";
import { useEffect, useState, useRef } from "react";
import { adminApi, type StoryData } from "@/lib/api";
import { toast } from "sonner";
import { Eye } from "lucide-react";

const emptyForm = {
  section_tag: '',
  headline: '',
  body: '',
  pull_quote: '',
  image_url: '',
  is_active: true,
};

export default function AdminStory() {
  const [content, setContent] = useState<StoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchStory();
  }, []);

  const fetchStory = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminApi.getStory();
      setContent(data);
      if (data) {
        setForm({
          section_tag: data.section_tag || '',
          headline: data.headline || '',
          body: data.body || '',
          pull_quote: data.pull_quote || '',
          image_url: data.image_url || '',
          is_active: data.is_active,
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load story content');
      toast.error(err.message || 'Failed to load story content');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      const url = await adminApi.uploadStoryImage(file);
      setForm((prev) => ({ ...prev, image_url: url }));
      toast.success('Image uploaded');
    } catch (err: any) {
      toast.error(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        ...form,
        image_url: form.image_url || null,
        body: form.body || null,
        pull_quote: form.pull_quote || null,
      };
      const saved = await adminApi.updateStory(payload);
      setContent(saved);
      toast.success('Story content saved successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save story content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Helmet>
          <title>Admin Story — Zaitoun Loralai</title>
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
        <title>Admin Story — Zaitoun Loralai</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Story Editor</h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage the brand story section content
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 text-sm">{error}</p>
          <button onClick={fetchStory} className="mt-2 text-red-600 hover:text-red-700 font-medium text-sm underline">
            Try Again
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-900">Content</h2>

          {/* Story Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Story Image</label>
            {form.image_url && (
              <div className="mb-2">
                <img src={form.image_url} alt="Preview" className="w-full h-40 object-cover rounded-lg border" />
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

          {/* Section Tag */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section Tag</label>
            <input
              type="text"
              value={form.section_tag}
              onChange={(e) => setForm({ ...form, section_tag: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="OUR HERITAGE"
            />
          </div>

          {/* Headline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
            <input
              type="text"
              value={form.headline}
              onChange={(e) => setForm({ ...form, headline: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Rooted in Loralai."
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-vertical"
              placeholder="In the rugged, sun-drenched hills of Loralai..."
            />
          </div>

          {/* Pull Quote */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pull Quote</label>
            <textarea
              value={form.pull_quote}
              onChange={(e) => setForm({ ...form, pull_quote: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-vertical"
              placeholder="We don't manufacture olive oil. We cultivate it..."
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

        {/* Live Preview */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Live Preview</h2>
          </div>

          <div className="relative min-h-[400px] rounded-lg overflow-hidden border">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200">
              {form.image_url && (
                <img
                  src={form.image_url}
                  alt=""
                  className="w-full h-full object-cover opacity-60"
                />
              )}
            </div>

            {/* Content card */}
            <div className="relative z-10 flex items-center justify-center min-h-[400px] p-6">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 w-full max-w-md text-center">
                <p className="text-amber-700 uppercase tracking-[0.2em] text-xs mb-3">
                  {form.section_tag || 'SECTION TAG'}
                </p>
                <h3 className="text-xl font-serif text-gray-900 mb-3 leading-tight">
                  {form.headline || 'Headline'}
                </h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-4">
                  {form.body || 'Body text will appear here...'}
                </p>
                <blockquote className="border-l-2 border-amber-700 pl-4 py-1 text-left">
                  <p className="text-sm text-gray-700 italic leading-snug">
                    "{form.pull_quote || 'Pull quote will appear here...'}"
                  </p>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom save button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
