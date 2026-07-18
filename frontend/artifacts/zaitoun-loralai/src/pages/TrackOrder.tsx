import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Search, Loader2, Package } from "lucide-react";
import { ordersApi, type Order } from "@/lib/api";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { formatPrice } from "@/utils/currency";

const STEPS = ["pending", "confirmed", "processing", "shipped", "delivered"] as const;

function getStepIndex(status: string): number {
  const idx = STEPS.indexOf(status as typeof STEPS[number]);
  return idx >= 0 ? idx : -1;
}

function StatusTimeline({ status }: { status: string }) {
  const currentIdx = getStepIndex(status);
  const isCancelled = status === "cancelled";

  if (isCancelled) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-sm font-medium text-red-600 bg-red-50 px-4 py-1.5 rounded-full border border-red-200">
            Cancelled
          </span>
        </div>
        <div className="flex items-center justify-between">
          {STEPS.map((step, i) => (
            <div key={step} className="flex flex-col items-center flex-1">
              <div className="w-full h-1 bg-gray-200 mb-2 last:hidden" />
              <div className="w-4 h-4 rounded-full bg-gray-200" />
              <span className="text-[10px] uppercase tracking-wider text-gray-400 mt-1 line-through">
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {STEPS.map((step, i) => {
          const isCompleted = i < currentIdx;
          const isCurrent = i === currentIdx;
          const isPending = i > currentIdx;

          return (
            <div key={step} className="flex flex-col items-center flex-1 relative">
              {i > 0 && (
                <div
                  className={`absolute top-2 right-1/2 w-full h-0.5 -translate-y-1/2 ${
                    isCompleted ? "bg-green-500" : isCurrent ? "bg-amber-400" : "bg-gray-200"
                  }`}
                  style={{ zIndex: 0 }}
                />
              )}
              <div
                className={`relative z-10 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isCompleted
                    ? "bg-green-500 border-green-500"
                    : isCurrent
                    ? "bg-amber-400 border-amber-400 animate-pulse"
                    : "bg-white border-gray-300"
                }`}
              >
                {isCompleted && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span
                className={`text-[10px] uppercase tracking-wider mt-1.5 text-center ${
                  isCompleted
                    ? "text-green-700 font-medium"
                    : isCurrent
                    ? "text-amber-700 font-medium"
                    : "text-gray-400"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-blue-100 text-blue-800",
    processing: "bg-indigo-100 text-indigo-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${colors[status] || "bg-gray-100 text-gray-800"}`}>
      {status}
    </span>
  );
}

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = orderNumber.trim();
    if (!trimmed) return;

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const data = await ordersApi.getOrder(trimmed);
      setOrder(data);
    } catch (err: any) {
      if (err.status === 404 || err.message?.toLowerCase().includes("not found")) {
        setError("We couldn't find an order with that number. Please check your order confirmation email or contact us at info@Zaitoun.loralai@gmail.com");
      } else {
        setError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Track Your Order — Zaitoun Loralai</title>
        <meta name="description" content="Track your Zaitoun Loralai order status in real time." />
      </Helmet>
      <Header />
      <main className="min-h-screen pt-28 pb-16 px-4 md:px-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-2">Track Your Order</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Enter your order number to see the current status.
        </p>

        {/* Search input */}
        <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. ZL-20260626123456-ABCDEF01"
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg text-sm outline-none focus:border-accent transition-colors bg-background"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !orderNumber.trim()}
            className="px-6 py-3 bg-accent text-accent-foreground rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Track"}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-red-800 text-sm mb-8">
            <p>{error}</p>
          </div>
        )}

        {/* Loading spinner (while searching) */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent" />
          </div>
        )}

        {/* Order result */}
        {!loading && order && (
          <div className="border border-border rounded-xl bg-white shadow-sm">
            {/* Order summary header */}
            <div className="p-5 border-b border-border">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-mono text-xs text-muted-foreground mb-1">Order #</p>
                  <p className="font-mono text-sm text-foreground">{order.order_number}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div>
                  <span className="text-xs text-muted-foreground/60">Total</span>
                  <p className="font-semibold text-foreground">{formatPrice(order.total_amount)}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground/60">Date</span>
                  <p className="text-foreground">
                    {new Date(order.created_at).toLocaleDateString("en-PK", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground/60">Payment</span>
                  <p className="capitalize text-foreground">{order.payment_status}</p>
                </div>
              </div>
            </div>

            {/* Status timeline */}
            <div className="p-5">
              <h3 className="text-sm font-medium text-foreground mb-4">Order Progress</h3>
              <StatusTimeline status={order.status} />
            </div>

            {/* Footer info */}
            <div className="px-5 pb-5 text-xs text-muted-foreground">
              <p>
                Questions about your order?{" "}
                <a href="mailto:info@Zaitoun.loralai@gmail.com" className="text-accent hover:underline">
                  Contact us
                </a>
              </p>
            </div>
          </div>
        )}

        {/* Initial state (no search yet) */}
        {!loading && !order && !error && (
          <div className="text-center py-16 border border-dashed border-border rounded-xl">
            <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground text-sm">
              Enter your order number above to track your delivery.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
