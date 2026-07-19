/**
 * Admin Dashboard Page
 * Displays admin statistics and controls
 */

import { Helmet } from "react-helmet-async";
import { useEffect, useState } from 'react';
import { adminApi, ordersApi } from '@/lib/api';
import { toast } from 'sonner';
import { Link } from 'wouter';
import { Package, ShoppingCart, CircleDollarSign, TrendingUp, Clock, Calendar, UserPlus, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatPrice } from '@/utils/currency';
import { OrderDetailModal } from '@/components/admin/OrderDetailModal';
import { StatCard } from '@/components/admin/StatCard';

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

  // Recent orders state
  const [recentOrders, setRecentOrders] = useState<Array<{
    id: number;
    order_number: string;
    customer_name: string;
    total_amount: number;
    status: string;
    payment_status: string;
    created_at: string;
  }>>([]);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

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
    fetchRecentOrders();
  }, []);

  const fetchRecentOrders = async () => {
    try {
      const response = await ordersApi.getOrders(1, 5);
      setRecentOrders(response.data);
    } catch {
      // Non-critical — don't block dashboard
    }
  };

  // Prepare chart data — include ALL statuses, fill zeros for missing
  const chartData = ALL_STATUSES.map((status) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1),
    count: stats?.order_status_breakdown[status] ?? 0,
  }));

  return (
    <div className="p-6">
      <Helmet>
        <title>Admin Dashboard — Zaitoun Loralai</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      {/* Page title */}
      <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard</h1>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
          <h3 className="text-destructive font-medium mb-1">Error Loading Dashboard</h3>
          <p className="text-destructive/80 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 text-destructive hover:text-destructive/90 font-medium text-sm underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Stats Grid */}
      {!loading && stats && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Package} label="Total Products" value={stats.total_products} />
            <StatCard icon={CircleDollarSign} label="Total Revenue" value={formatPrice(stats.total_revenue)} />
            <StatCard icon={TrendingUp} label="Revenue This Month" value={formatPrice(stats.revenue_this_month)} />
            <StatCard icon={ShoppingCart} label="Total Orders" value={Object.values(stats.order_status_breakdown).reduce((a, b) => a + b, 0)} />
            <StatCard icon={Clock} label="Pending Orders" value={stats.pending_orders} />
            <StatCard icon={Calendar} label="Orders Today" value={stats.orders_today} />
            <StatCard icon={UserPlus} label="New Customers" value={stats.new_customers_this_month} />
            <StatCard icon={AlertTriangle} label="Low Stock Items" value={stats.low_stock_products.length} />
          </div>

          {/* Order Status Chart — all statuses shown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-card rounded-lg shadow-sm border border-border p-6">
              <h2 className="text-lg font-bold text-foreground mb-4">Order Status Breakdown</h2>
              {chartData.some(d => d.count > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="status" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground text-center py-8">No order data available</p>
              )}
            </div>

            {/* Top 5 Products (NEW — replaces Quick Actions area) */}
            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">Top Products</h2>
                {stats.top_products.length > 0 && (
                  <Link href="/admin/products">
                    <a className="text-sm text-primary hover:text-primary/80 font-medium">
                      View all &rarr;
                    </a>
                  </Link>
                )}
              </div>
              {stats.top_products.length > 0 ? (
                <div className="space-y-4">
                  {stats.top_products.map((product, i) => (
                    <div key={product.id} className="flex items-center justify-between pb-3 border-b border-border last:border-0 last:pb-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-sm font-bold text-muted-foreground w-5 shrink-0">
                          {i + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {product.total_sold} sold
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-foreground shrink-0 ml-4">
                        {formatPrice(product.revenue)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No sales data yet.</p>
              )}
            </div>
          </div>

          {/* Low Stock Products Table */}
          {stats.low_stock_products.length > 0 && (
            <div className="bg-card rounded-lg shadow-sm border border-border p-6 mb-8">
              <h2 className="text-lg font-bold text-foreground mb-4">Low Stock Alert</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Product Name</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Current Stock</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {stats.low_stock_products.map((product) => (
                      <tr key={product.id} className="hover:bg-muted/30 transition">
                        <td className="px-6 py-4 text-sm text-foreground font-medium">{product.name}</td>
                        <td className="px-6 py-4 text-sm text-right">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            {product.stock} units
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-foreground font-medium">
                          {formatPrice(product.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Recent Orders Widget */}
          {recentOrders.length > 0 && (
            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">Recent Orders</h2>
                <Link href="/admin/orders">
                  <a className="text-sm text-primary hover:text-primary/80 font-medium">
                    View all &rarr;
                  </a>
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Order #</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Customer</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Total</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        onClick={() => setSelectedOrder(order.order_number)}
                        className="hover:bg-muted/30 transition cursor-pointer"
                      >
                        <td className="px-6 py-4 text-sm text-foreground font-mono font-medium">{order.order_number}</td>
                        <td className="px-6 py-4 text-sm text-foreground">{order.customer_name}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground text-right font-medium">
                          {formatPrice(order.total_amount)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'processing' ? 'bg-purple-100 text-purple-800' :
                            order.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Order Detail Modal */}
          {selectedOrder && (
            <OrderDetailModal
              orderNumber={selectedOrder}
              onClose={() => setSelectedOrder(null)}
              onOrderUpdated={() => {
                // Refetch recent orders after status change
                fetchRecentOrders();
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
