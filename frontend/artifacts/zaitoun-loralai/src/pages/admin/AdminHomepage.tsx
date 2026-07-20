/**
 * Admin Homepage Editor Page
 * Single-item editor for homepage hero content with live preview
 */

import { Helmet } from "react-helmet-async";
import { useEffect, useState, useRef } from "react";
import { adminApi, type HomepageData } from "@/lib/api";
import { toast } from "sonner";
import { Eye } from "lucide-react";

const emptyForm = {
  hero_image_url: '',
  hero_brand_name: '',
  hero_headline: '',
  hero_description: '',
  hero_primary_cta_text: '',
  hero_secondary_cta_text: '',
  is_active: true,
};

export default function AdminHomepage() {
  const [content, setContent] = useState<HomepageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchHomepage();
  }, []);

  const fetchHomepage = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminApi.getHomepage();
      setContent(data);
      if (data) {
        setForm({
          hero_image_url: data.hero_image_url || '',
          hero_brand_name: data.hero_brand_name || '',
          hero_headline: data.hero_headline || '',
          hero_description: data.hero_description || '',
          hero_primary_cta_text: data.hero_primary_cta_text || '',
          hero_secondary_cta_text: data.hero_secondary_cta_text || '',
          is_active: data.is_active,
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load homepage content');
      toast.error(err.message || 'Failed to load homepage content');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      const url = await adminApi.uploadHomepageImage(file);
      setForm((prev) => ({ ...prev, hero_image_url: url }));
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
        hero_image_url: form.hero_image_url || null,
        hero_description: form.hero_description || null,
      };
      const saved = await adminApi.updateHomepage(payload);
      setContent(saved);
      toast.success('Homepage content saved successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save homepage content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Helmet>
          <title>Admin Homepage — Zaitoun Loralai</title>
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
        <title>Admin Homepage — Zaitoun Loralai</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Homepage Editor</h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage the homepage hero section content
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
          <button onClick={fetchHomepage} className="mt-2 text-red-600 hover:text-red-700 font-medium text-sm underline">
            Try Again
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-900">Content</h2>

          {/* Hero Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image</label>
            {form.hero_image_url && (
              <div className="mb-2">
                <img src={form.hero_image_url} alt="Preview" className="w-full h-40 object-cover rounded-lg border" />
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
                value={form.hero_image_url}
                onChange={(e) => setForm({ ...form, hero_image_url: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Or paste image URL"
              />
            </div>
          </div>

          {/* Brand Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
            <input
              type="text"
              value={form.hero_brand_name}
              onChange={(e) => setForm({ ...form, hero_brand_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="ZAITOUN LORALAI"
            />
          </div>

          {/* Headline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
            <input
              type="text"
              value={form.hero_headline}
              onChange={(e) => setForm({ ...form, hero_headline: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="The Real Taste Of Pakistan"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.hero_description}
              onChange={(e) => setForm({ ...form, hero_description: e.target.value })}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-vertical"
              placeholder="Cold-pressed and award-winning..."
            />
          </div>

          {/* Primary CTA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary CTA Text</label>
            <input
              type="text"
              value={form.hero_primary_cta_text}
              onChange={(e) => setForm({ ...form, hero_primary_cta_text: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Shop Now"
            />
          </div>

          {/* Secondary CTA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Secondary CTA Text</label>
            <input
              type="text"
              value={form.hero_secondary_cta_text}
              onChange={(e) => setForm({ ...form, hero_secondary_cta_text: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Learn More"
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

          <div className="relative min-h-[300px] rounded-lg overflow-hidden border">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200">
              {form.hero_image_url && (
                <img
                  src={form.hero_image_url}
                  alt=""
                  className="w-full h-full object-cover opacity-60"
                />
              )}
            </div>

            {/* Content card */}
            <div className="relative z-10 flex items-center justify-center min-h-[300px] p-6">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 w-full max-w-sm text-center">
                <p className="text-amber-700 uppercase tracking-[0.2em] text-xs mb-3">
                  {form.hero_brand_name || 'BRAND NAME'}
                </p>
                <h3 className="text-lg font-serif text-gray-900 mb-2 leading-tight">
                  {form.hero_headline || 'Headline'}
                </h3>
                <p className="text-xs text-gray-600 mb-4 leading-relaxed line-clamp-3">
                  {form.hero_description || 'Description text will appear here...'}
                </p>
                <div className="flex justify-center gap-3">
                  <span className="px-4 py-2 bg-gray-900 text-white text-xs font-medium rounded">
                    {form.hero_primary_cta_text || 'Primary CTA'}
                  </span>
                  <span className="px-4 py-2 border border-gray-300 text-gray-700 text-xs font-medium rounded">
                    {form.hero_secondary_cta_text || 'Secondary CTA'}
                  </span>
                </div>
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
