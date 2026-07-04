/**
 * Product Form Component
 * Reusable form for creating and editing products
 * Used in modals by AdminProducts page
 */

import { useEffect, useState } from 'react';
import { Product, productsApi } from '@/lib/api';
import { toast } from 'sonner';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: Partial<Product>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProductForm({ product, onSubmit, onCancel, isLoading = false }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    short_description: '',
    price: '',
    discount_price: '',
    stock: '',
    category: '',
    image_url: '',
    is_featured: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-fill form if editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        short_description: product.short_description || '',
        price: String(product.price || ''),
        discount_price: product.discount_price ? String(product.discount_price) : '',
        stock: String(product.stock || ''),
        category: product.category || '',
        image_url: product.image_url || '',
        is_featured: product.is_featured || false,
      });
    }
  }, [product]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    const priceNum = parseFloat(formData.price);
    if (!formData.price || isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = 'Price must be a positive number';
    }

    if (formData.discount_price) {
      const discountNum = parseFloat(formData.discount_price);
      if (isNaN(discountNum) || discountNum <= 0) {
        newErrors.discount_price = 'Discount price must be a positive number';
      } else if (discountNum >= priceNum) {
        newErrors.discount_price = 'Discount price must be less than regular price';
      }
    }

    const stockNum = parseInt(formData.stock, 10);
    if (!formData.stock || isNaN(stockNum) || stockNum < 0) {
      newErrors.stock = 'Stock must be a non-negative number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    const submitData: Partial<Product> = {
      name: formData.name,
      description: formData.description,
      short_description: formData.short_description || null,
      price: parseFloat(formData.price),
      discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
      stock: parseInt(formData.stock, 10),
      category: formData.category || null,
      image_url: formData.image_url || null,
      is_featured: formData.is_featured,
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Product Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g., Premium Olive Oil"
          disabled={isLoading}
        />
        {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Detailed product description (min 10 characters)"
          disabled={isLoading}
        />
        {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
      </div>

      {/* Short Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
        <input
          type="text"
          name="short_description"
          value={formData.short_description}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Brief one-liner for listings"
          disabled={isLoading}
        />
      </div>

      {/* Price and Discount Price */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.price ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.00"
            disabled={isLoading}
          />
          {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price</label>
          <input
            type="number"
            name="discount_price"
            value={formData.discount_price}
            onChange={handleChange}
            step="0.01"
            min="0"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.discount_price ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Leave blank if no discount"
            disabled={isLoading}
          />
          {errors.discount_price && <p className="text-red-600 text-xs mt-1">{errors.discount_price}</p>}
        </div>
      </div>

      {/* Stock */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          min="0"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.stock ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="0"
          disabled={isLoading}
        />
        {errors.stock && <p className="text-red-600 text-xs mt-1">{errors.stock}</p>}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Oils, Spices"
          disabled={isLoading}
        />
      </div>

      {/* Image URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
        <input
          type="url"
          name="image_url"
          value={formData.image_url}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com/image.jpg"
          disabled={isLoading}
        />
      </div>

      {/* Featured Checkbox */}
      <div className="flex items-center">
        <input
          type="checkbox"
          name="is_featured"
          checked={formData.is_featured}
          onChange={handleChange}
          id="is_featured"
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          disabled={isLoading}
        />
        <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
          Mark as Featured Product
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  );
}
