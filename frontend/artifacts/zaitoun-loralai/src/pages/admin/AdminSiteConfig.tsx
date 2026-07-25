/**
 * Admin Site Config Page
 * Single form page for all site-wide settings
 */

import { Helmet } from "react-helmet-async";
import { useEffect, useState, useCallback } from 'react';
import { adminApi, type SiteConfigData } from '@/lib/api';
import { toast } from 'sonner';
import { Plus, X } from 'lucide-react';

const emptyForm = {
  site_name: '',
  tagline: '',
  logo_url: '',
  email: '',
  phone: '',
  address: '',
  facebook_url: '',
  instagram_url: '',
  x_url: '',
  youtube_url: '',
  footer_about_text: '',
  footer_copyright_text: '',
  nav_links: [{ label: '', href: '' }] as { label: string; href: string }[],
  is_active: true,
};

export default function AdminSiteConfig() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const config = await adminApi.getSiteConfig();
      if (config) {
        setForm({
          site_name: config.site_name || '',
          tagline: config.tagline || '',
          logo_url: config.logo_url || '',
          email: config.email || '',
          phone: config.phone || '',
          address: config.address || '',
          facebook_url: config.facebook_url || '',
          instagram_url: config.instagram_url || '',
          x_url: config.x_url || '',
          youtube_url: config.youtube_url || '',
          footer_about_text: config.footer_about_text || '',
          footer_copyright_text: config.footer_copyright_text || '',
          nav_links: config.nav_links && config.nav_links.length > 0
            ? config.nav_links.map(n => ({ label: n.label, href: n.href }))
            : [{ label: '', href: '' }],
          is_active: config.is_active ?? true,
        });
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to load site config');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const cleanNavLinks = form.nav_links.filter(n => n.label.trim() && n.href.trim());
      await adminApi.updateSiteConfig({ ...form, nav_links: cleanNavLinks.length > 0 ? cleanNavLinks : [] });
      toast.success('Site config saved successfully');
      await fetchData();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save site config');
    } finally {
      setSaving(false);
    }
  };

  const addNavLink = () => {
    setForm({ ...form, nav_links: [...form.nav_links, { label: '', href: '' }] });
  };

  const removeNavLink = (index: number) => {
    setForm({ ...form, nav_links: form.nav_links.filter((_, i) => i !== index) });
  };

  const updateNavLink = (index: number, field: 'label' | 'href', value: string) => {
    const updated = [...form.nav_links];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, nav_links: updated });
  };

  if (loading) {
    return (
      <div className="p-6">
        <Helmet>
          <title>Admin Site Settings — Zaitoun Loralai</title>
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
        <title>Admin Site Settings — Zaitoun Loralai</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Site Settings</h1>

      {/* General */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">General</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
              <input
                type="text"
                value={form.site_name}
                onChange={(e) => setForm({ ...form, site_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Zaitoun Loralai"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Crafted from the heart of Pakistan"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
            <input
              type="text"
              value={form.logo_url}
              onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="https://example.com/logo.png"
            />
            <p className="text-xs text-gray-500 mt-1">Leave empty to use default logo from assets</p>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Contact</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="text"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="info@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="03425583198"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Loralai, Balochistan"
            />
          </div>
        </div>
      </div>

      {/* Social */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Social Links</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
              <input
                type="text"
                value={form.facebook_url}
                onChange={(e) => setForm({ ...form, facebook_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
              <input
                type="text"
                value={form.instagram_url}
                onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">X (Twitter) URL</label>
              <input
                type="text"
                value={form.x_url}
                onChange={(e) => setForm({ ...form, x_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="https://x.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
              <input
                type="text"
                value={form.youtube_url}
                onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Footer</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">About Text</label>
            <textarea
              value={form.footer_about_text}
              onChange={(e) => setForm({ ...form, footer_about_text: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
              placeholder="About description shown in footer..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Copyright Text</label>
            <input
              type="text"
              value={form.footer_copyright_text}
              onChange={(e) => setForm({ ...form, footer_copyright_text: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Zaitoun Loralai. All rights reserved."
            />
            <p className="text-xs text-gray-500 mt-1">© and year are prepended automatically</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Navigation Links</h2>
            <p className="text-xs text-gray-500 mt-0.5">These appear in the header and footer</p>
          </div>
          <button
            onClick={addNavLink}
            className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition"
          >
            <Plus className="w-4 h-4" />
            Add Link
          </button>
        </div>
        <div className="p-6 space-y-3">
          {form.nav_links.map((link, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                type="text"
                value={link.label}
                onChange={(e) => updateNavLink(i, 'label', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Label (e.g. Shop)"
              />
              <input
                type="text"
                value={link.href}
                onChange={(e) => updateNavLink(i, 'href', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Href (e.g. #products)"
              />
              <button
                onClick={() => removeNavLink(i)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                title="Remove link"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Active */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active (show on site)</label>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end mb-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>
    </div>
  );
}
