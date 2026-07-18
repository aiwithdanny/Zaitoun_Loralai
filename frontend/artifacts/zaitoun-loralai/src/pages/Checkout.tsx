import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, CheckCircle, Tag, X } from "lucide-react";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { ordersApi, couponsApi, CreateOrderData } from "@/lib/api";
import { toast } from "sonner";
import { formatPrice } from "@/utils/currency";

interface CheckoutFormData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  payment_method: "cash" | "card" | "bank_transfer";
}

export function Checkout() {
  const [_, navigate] = useLocation();
  const { items, getTotalPrice, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [couponCode, setCouponCode] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountType: string;
    discountAmount: number;
  } | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>({
    defaultValues: {
      payment_method: "cash",
    },
  });

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsValidatingCoupon(true);
    try {
      const result = await couponsApi.validate(couponCode.trim(), getTotalPrice());
      if (result.valid) {
        setAppliedCoupon({
          code: couponCode.trim().toUpperCase(),
          discountType: result.discount_type!,
          discountAmount: result.discount_amount!,
        });
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Failed to validate coupon");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Checkout — Zaitoun Loralai</title>
          <meta name="description" content="Complete your purchase of premium Zaitoun Loralai olive oil." />
        </Helmet>
        <div className="container mx-auto px-4 md:px-8 py-24">
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </button>
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Button onClick={() => navigate("/")} className="gap-2">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      setIsLoading(true);

      const orderData: CreateOrderData = {
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone,
        customer_address: data.customer_address,
        payment_method: data.payment_method,
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
        coupon_code: appliedCoupon?.code,
      };

      // Try to place order via API, fallback to local storage if API fails
      try {
        const order = await ordersApi.createOrder(orderData);
        setOrderNumber(order.order_number);
        setIsSuccess(true);
        clearCart();
        toast.success("Order placed successfully!");
      } catch (apiError) {
        // Fallback: Save order locally
        const localOrderNumber = `LOCAL-${Date.now()}`;
        const orders = JSON.parse(localStorage.getItem("orders") || "[]");
        orders.push({
          order_number: localOrderNumber,
          ...orderData,
          total_amount: getTotalPrice(),
          created_at: new Date().toISOString(),
          status: "pending",
        });
        localStorage.setItem("orders", JSON.stringify(orders));
        setOrderNumber(localOrderNumber);
        setIsSuccess(true);
        clearCart();
        toast.success("Order placed locally (API unavailable)");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to place order");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 md:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 max-w-md mx-auto"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="font-serif text-3xl text-foreground mb-3">
              Order Confirmed
            </h1>
            <p className="text-muted-foreground mb-2">
              Thank you for your order!
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Order #: <span className="font-mono text-foreground">{orderNumber}</span>
            </p>
            <p className="text-muted-foreground mb-4">
              We'll send you a confirmation email shortly with tracking information.
            </p>
            <Link
              href="/track-order"
              className="block text-sm text-accent hover:underline mb-4 text-center"
            >
              Track your order
            </Link>
            <Button onClick={() => navigate("/")} className="w-full">
              Back to Home
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Checkout — Zaitoun Loralai</title>
        <meta name="description" content="Complete your purchase of premium Zaitoun Loralai olive oil." />
      </Helmet>
      <div className="container mx-auto px-4 md:px-8 py-24">
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </button>

        <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-12">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="bg-card border border-border p-6 rounded-sm">
                <h2 className="font-serif text-lg text-foreground mb-4">
                  Shipping Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name
                    </label>
                    <Input
                      {...register("customer_name", { required: "Name is required" })}
                      placeholder="John Doe"
                      className="w-full"
                    />
                    {errors.customer_name && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.customer_name.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email
                      </label>
                      <Input
                        {...register("customer_email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          },
                        })}
                        type="email"
                        placeholder="john@example.com"
                      />
                      {errors.customer_email && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.customer_email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone
                      </label>
                      <Input
                        {...register("customer_phone", { required: "Phone is required" })}
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                      />
                      {errors.customer_phone && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.customer_phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Shipping Address
                    </label>
                    <Input
                      {...register("customer_address", { required: "Address is required" })}
                      placeholder="123 Main St, City, State ZIP"
                      className="w-full"
                    />
                    {errors.customer_address && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.customer_address.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border p-6 rounded-sm">
                <h2 className="font-serif text-lg text-foreground mb-4">
                  Payment Method
                </h2>

                <div className="space-y-3">
                  {(["cash", "card", "bank_transfer"] as const).map((method) => (
                    <label key={method} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        value={method}
                        {...register("payment_method")}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-foreground capitalize">
                        {method === "cash" && "Cash on Delivery"}
                        {method === "card" && "Credit Card"}
                        {method === "bank_transfer" && "Bank Transfer"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Place Order"
                )}
              </Button>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-card border border-border p-6 rounded-sm sticky top-24">
              <h3 className="font-serif text-lg text-foreground mb-4">Order Summary</h3>

              <div className="space-y-3 mb-4 pb-4 border-b border-border max-h-96 overflow-y-auto">
                {items.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} <span className="text-xs">x{item.quantity}</span>
                    </span>
                    <span className="text-foreground font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">TBD</span>
                </div>

                {/* Coupon input */}
                {!appliedCoupon ? (
                  <div className="pt-3 border-t border-border">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Coupon code"
                          className="pl-8 text-sm h-9"
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleApplyCoupon())}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleApplyCoupon}
                        disabled={isValidatingCoupon || !couponCode.trim()}
                        className="h-9 whitespace-nowrap"
                      >
                        {isValidatingCoupon ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          "Apply"
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">{appliedCoupon.code}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-green-700">
                          -{formatPrice(appliedCoupon.discountAmount)}
                        </span>
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="p-0.5 rounded hover:bg-green-200 transition-colors"
                        >
                          <X className="h-3.5 w-3.5 text-green-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Discount line */}
                {appliedCoupon && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="text-green-600">-{formatPrice(appliedCoupon.discountAmount)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <span className="font-serif text-foreground">Total</span>
                <span className="font-serif text-lg text-foreground">
                  {formatPrice(getTotalPrice() - (appliedCoupon?.discountAmount ?? 0))}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
