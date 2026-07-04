import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { formatPrice } from "@/utils/currency";

export function Cart() {
  const [_, navigate] = useLocation();
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setIsCheckingOut(true);
    navigate("/checkout");
  };

  if (items.length === 0 && !isCheckingOut) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 md:px-8 py-24">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </button>

          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h1 className="font-serif text-2xl md:text-3xl text-foreground mb-3">
              Your cart is empty
            </h1>
            <p className="text-muted-foreground mb-8">
              Explore our collection of premium olive oil.
            </p>
            <Button onClick={() => navigate("/")} className="gap-2">
              <ShoppingBag className="w-4 h-4" />
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-8 py-24">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </button>

        <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-12">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {items.map((item: any) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex gap-4 bg-card border border-border p-4 rounded-sm"
                >
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-24 h-32 object-contain flex-shrink-0"
                    />
                  )}

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-lg text-foreground mb-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.price)} each
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 border border-border rounded-sm">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 hover:bg-muted transition-colors"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 hover:bg-muted transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          removeItem(item.id);
                          toast.success("Item removed from cart");
                        }}
                        className="text-red-500 hover:text-red-600 transition-colors p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border p-6 rounded-sm sticky top-24">
              <h3 className="font-serif text-lg text-foreground mb-4">Order Summary</h3>

              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="font-serif text-foreground">Total</span>
                <span className="font-serif text-lg text-foreground">
                  {formatPrice(getTotalPrice())}
                </span>
              </div>

              <Button onClick={handleCheckout} className="w-full mb-2 gap-2">
                <ShoppingBag className="w-4 h-4" />
                Proceed to Checkout
              </Button>

              <button
                onClick={() => {
                  clearCart();
                  navigate("/");
                  toast.success("Cart cleared");
                }}
                className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
