/**
 * Admin Dashboard Page
 * Displays admin statistics and controls
 */

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import { toast } from 'sonner';
import { Link } from 'wouter';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatPrice } from '@/utils/currency';

interface DashboardStats {
  total_products: number;
  total_revenue: number;
  revenue_this_month: number;
  order_status_breakdown: {
    [key: string]: number;
  };
  low_stock_products: Array<{
    id: number;
    name: string;
    stock: number;
    price: number;
  }>;
  pending_orders: number;
  orders_today: number;
  new_customers_this_month: number;
  top_products: Array<{
    id: number;
    name: string;
    slug: string;
    total_sold: number;
    revenue: number;
  }>;
}

// All possible order statuses (show even if count is 0)
const ALL_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch stats on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const statsData = await adminApi.getStats();
        setStats(statsData);
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to load dashboard stats';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Prepare chart data — include ALL statuses, fill zeros for missing
  const chartData = ALL_STATUSES.map((status) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1),
    count: stats?.order_status_breakdown[status] ?? 0,
  }));

  return (
    <div className="p-6">
      {/* Page title */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="text-red-800 font-medium mb-1">Error Loading Dashboard</h3>
          <p className="text-red-700 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 text-red-600 hover:text-red-700 font-medium text-sm underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Stats Grid */}
      {!loading && stats && (
        <>
          {/* KPI Cards - 2 rows of 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total Products Card */}
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
              <p className="text-gray-600 text-sm font-medium">Total Products</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total_products}</p>
              <div className="mt-3 flex items-center justify-center bg-blue-100 rounded-full p-3 w-12 h-12">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>

            {/* Total Revenue Card */}
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
              <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{formatPrice(stats.total_revenue)}</p>
              <div className="mt-3 flex items-center justify-center bg-green-100 rounded-full p-3 w-12 h-12">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            {/* Revenue This Month Card (renamed) */}
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
              <p className="text-gray-600 text-sm font-medium">Revenue This Month</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{formatPrice(stats.revenue_this_month)}</p>
              <div className="mt-3 flex items-center justify-center bg-purple-100 rounded-full p-3 w-12 h-12">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>

            {/* Total Orders Card */}
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
              <p className="text-gray-600 text-sm font-medium">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {Object.values(stats.order_status_breakdown).reduce((a, b) => a + b, 0)}
              </p>
              <div className="mt-3 flex items-center justify-center bg-indigo-100 rounded-full p-3 w-12 h-12">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            {/* Pending Orders Card (NEW - red) */}
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
              <p className="text-gray-600 text-sm font-medium">Pending Orders</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pending_orders}</p>
              <div className="mt-3 flex items-center justify-center bg-red-100 rounded-full p-3 w-12 h-12">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            {/* Orders Today Card (NEW - teal) */}
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-teal-500">
              <p className="text-gray-600 text-sm font-medium">Orders Today</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.orders_today}</p>
              <div className="mt-3 flex items-center justify-center bg-teal-100 rounded-full p-3 w-12 h-12">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>

            {/* New Customers Card (NEW - rose/pink) */}
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-rose-500">
              <p className="text-gray-600 text-sm font-medium">New Customers</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.new_customers_this_month}</p>
              <div className="mt-3 flex items-center justify-center bg-rose-100 rounded-full p-3 w-12 h-12">
                <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
            </div>

            {/* Low Stock Alert Card */}
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
              <p className="text-gray-600 text-sm font-medium">Low Stock Items</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.low_stock_products.length}</p>
              <div className="mt-3 flex items-center justify-center bg-orange-100 rounded-full p-3 w-12 h-12">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 5v2M6.228 6.228a9 9 0 1012.544 0M4.5 12a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Order Status Chart — all statuses shown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Status Breakdown</h2>
              {chartData.some(d => d.count > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="status" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-600 text-center py-8">No order data available</p>
              )}
            </div>

            {/* Top 5 Products (NEW — replaces Quick Actions area) */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Top Products</h2>
                {stats.top_products.length > 0 && (
                  <Link href="/admin/products">
                    <a className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      View all &rarr;
                    </a>
                  </Link>
                )}
              </div>
              {stats.top_products.length > 0 ? (
                <div className="space-y-4">
                  {stats.top_products.map((product, i) => (
                    <div key={product.id} className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-sm font-bold text-muted-foreground w-5 shrink-0">
                          {i + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {product.total_sold} sold
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 shrink-0 ml-4">
                        {formatPrice(product.revenue)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">No sales data yet.</p>
              )}
            </div>
          </div>

          {/* Low Stock Products Table */}
          {stats.low_stock_products.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Low Stock Alert</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Product Name</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Current Stock</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {stats.low_stock_products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{product.name}</td>
                        <td className="px-6 py-4 text-sm text-right">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            {product.stock} units
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-gray-900 font-medium">
                          {formatPrice(product.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
