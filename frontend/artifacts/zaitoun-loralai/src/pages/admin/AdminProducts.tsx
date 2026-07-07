/**
 * Admin Products Management Page
 * Full CRUD for products with table view, add/edit modal, and delete confirmation
 */

import { useEffect, useState } from 'react';
import { productsApi, Product } from '@/lib/api';
import { toast } from 'sonner';
import { ProductForm } from '@/components/admin/ProductForm';
import { formatPrice } from '@/utils/currency';

interface Modal {
  type: 'add' | 'edit' | 'delete' | null;
  product?: Product;
}

interface SortConfig {
  key: keyof Product | null;
  direction: 'asc' | 'desc';
}

const CATEGORIES = ['', 'oils', 'skincare', 'makeup', 'hair', 'fragrance'];

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState<Modal>({ type: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await productsApi.getProducts();
      setProducts(data);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load products';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort products
  const filteredAndSortedProducts = (() => {
    let filtered = products;

    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.slug.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        // Handle null/undefined
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        // Compare
        if (typeof aValue === 'string') {
          const comparison = aValue.localeCompare(String(bValue));
          return sortConfig.direction === 'asc' ? comparison : -comparison;
        } else if (typeof aValue === 'number') {
          const comparison = aValue - Number(bValue);
          return sortConfig.direction === 'asc' ? comparison : -comparison;
        }

        return 0;
      });
    }

    return filtered;
  })();

  const handleSort = (key: keyof Product) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIndicator = (key: keyof Product) => {
    if (sortConfig.key !== key) return ' ↕';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  const handleAddClick = () => {
    setModal({ type: 'add' });
  };

  const handleEditClick = (product: Product) => {
    setModal({ type: 'edit', product });
  };

  const handleDeleteClick = (product: Product) => {
    setModal({ type: 'delete', product });
  };

  const handleFormSubmit = async (formData: Partial<Product>) => {
    try {
      setIsSubmitting(true);

      if (modal.type === 'add') {
        await productsApi.createProduct(formData);
        toast.success('Product created successfully');
      } else if (modal.type === 'edit' && modal.product) {
        await productsApi.updateProduct(modal.product.slug, formData);
        toast.success('Product updated successfully');
      }

      setModal({ type: null });
      await fetchProducts();
    } catch (err: any) {
      const errorMessage = err.message || 'Operation failed';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!modal.product) return;

    try {
      setIsSubmitting(true);
      await productsApi.deleteProduct(modal.product.slug);
      toast.success('Product deleted successfully');
      setModal({ type: null });
      await fetchProducts();
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete product';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Products</h1>
          <p className="text-gray-600 text-sm mt-1">
            Total products: <span className="font-medium">{products.length}</span>
            {categoryFilter || searchQuery ? ` • Filtered: ${filteredAndSortedProducts.length}` : ''}
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
        >
          + Add Product
        </button>
      </div>

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="text-red-800 font-medium mb-1">Error Loading Products</h3>
          <p className="text-red-700 text-sm">{error}</p>
          <button
            onClick={fetchProducts}
            className="mt-3 text-red-600 hover:text-red-700 font-medium text-sm underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      )}

      {/* Filters */}
      {!loading && products.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Search by Name or SKU</label>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Filter by Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === '' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Products Table */}
      {!loading && products.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    onClick={() => handleSort('name')}
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition"
                  >
                    Name{getSortIndicator('name')}
                  </th>
                  <th
                    onClick={() => handleSort('category')}
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition"
                  >
                    Category{getSortIndicator('category')}
                  </th>
                  <th
                    onClick={() => handleSort('price')}
                    className="px-6 py-3 text-right text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition"
                  >
                    Price{getSortIndicator('price')}
                  </th>
                  <th
                    onClick={() => handleSort('stock')}
                    className="px-6 py-3 text-right text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition"
                  >
                    Stock{getSortIndicator('stock')}
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Image</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAndSortedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.category || '—'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right">
                      <span className="font-medium">{formatPrice(product.price)}</span>
                      {product.discount_price && (
                        <span className="text-red-600 text-xs ml-2">
                          {formatPrice(product.discount_price)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          product.stock > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">No image</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="text-red-600 hover:text-red-700 font-medium text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 mb-4">No products found.</p>
          <button
            onClick={handleAddClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            Create First Product
          </button>
        </div>
      )}

      {/* No results after filtering */}
      {!loading && products.length > 0 && filteredAndSortedProducts.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 mb-4">No products match your filters.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('');
            }}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm underline"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {(modal.type === 'add' || modal.type === 'edit') && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-900">
                {modal.type === 'add' ? 'Add New Product' : 'Edit Product'}
              </h2>
            </div>
            <div className="p-6">
              <ProductForm
                product={modal.type === 'edit' ? modal.product : undefined}
                onSubmit={handleFormSubmit}
                onCancel={() => setModal({ type: null })}
                isLoading={isSubmitting}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modal.type === 'delete' && modal.product && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Delete Product?</h2>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete <span className="font-medium">"{modal.product.name}"</span>? This action
                cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setModal({ type: null })}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
