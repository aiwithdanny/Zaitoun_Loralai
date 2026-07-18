import { Helmet } from "react-helmet-async";
import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { customerApi, type Order } from '@/lib/api';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { formatPrice } from '@/utils/currency';

export default function AccountOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await customerApi.getMyOrders();
        setOrders(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <Helmet>
        <title>My Orders — Zaitoun Loralai</title>
        <meta name="description" content="View your Zaitoun Loralai order history." />
      </Helmet>
      <Header />
      <main className="min-h-screen pt-28 pb-16 px-4 md:px-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-2">My Orders</h1>
        <p className="text-muted-foreground text-sm mb-8">View your order history</p>

        {loading && (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-16 border border-dashed border-border rounded-xl">
            <p className="text-muted-foreground mb-4">No orders yet</p>
            <Link
              href="/"
              className="inline-block bg-accent text-accent-foreground px-6 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
            >
              Start Shopping
            </Link>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.order_number}
                className="border border-border rounded-xl p-5 bg-white shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-sm text-muted-foreground">{order.order_number}</p>
                    <p className="text-lg font-semibold text-foreground mt-1">
                      {formatPrice(order.total_amount)}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${
                      order.status === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : order.status === 'confirmed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  <p>{order.customer_name} &middot; {order.payment_method}</p>
                  <p className="text-xs mt-1">
                    {new Date(order.created_at).toLocaleDateString('en-PK', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
