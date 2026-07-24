import { Helmet } from "react-helmet-async";
import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Trash2, ShoppingBag, ArrowLeft, ShoppingCart, Check, Loader2 } from "lucide-react";
import { useCart } from "@/store/cart";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatPrice } from "@/utils/currency";
import { productImages } from "@/lib/productImages";

export function Cart() {
  const [_, navigate] = useLocation();
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart, addItem } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [justAdded, setJustAdded] = useState<Set<number>>(new Set());

  const { data: allProducts, isPending } = useProducts();

  // Products not already in cart, limit to 4
  const suggested = useMemo(() => {
    if (!allProducts) return [];
    const cartIds = new Set(items.map((i) => i.id));
    return allProducts.filter((p) => !cartIds.has(p.id)).slice(0, 4);
  }, [allProducts, items]);

  const handleAddSuggested = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.discount_price || product.price,
      image_url: product.image_url || productImages[product.slug],
    });
    setJustAdded((prev) => new Set(prev).add(product.id));
    toast.success(`${product.name} added to cart`);
    setTimeout(() => {
      setJustAdded((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 1500);
  };

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
        <Helmet>
          <title>Your Cart — Zaitoun Loralai</title>
          <meta name="description" content="Review your Zaitoun Loralai olive oil selections before checkout." />
        </Helmet>
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
      <Helmet>
        <title>Your Cart — Zaitoun Loralai</title>
        <meta name="description" content="Review your Zaitoun Loralai olive oil selections before checkout." />
      </Helmet>
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
                      loading="lazy"
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

        {/* You May Also Like */}
        {suggested.length > 0 && (
          <section className="mt-16">
            <h2 className="font-serif text-2xl text-foreground mb-8">
              You may also like
            </h2>
            {isPending ? (
              <div className="flex items-center gap-2 text-muted-foreground py-8">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading suggestions...</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {suggested.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-card border border-border rounded-sm overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-500"
                  >
                    {/* Image */}
                    <div className="relative aspect-[3/4] bg-muted/40 flex items-center justify-center overflow-hidden">
                      {product.is_featured && (
                        <span className="absolute top-3 left-3 z-10 text-[10px] uppercase tracking-widest bg-primary text-primary-foreground px-2 py-1">
                          Featured
                        </span>
                      )}
                      {product.discount_price && (
                        <span className="absolute top-3 right-3 z-10 text-[10px] uppercase tracking-widest bg-accent text-accent-foreground px-2 py-1">
                          Sale
                        </span>
                      )}
                      {(product.image_url || productImages[product.slug]) ? (
                        <img
                          src={product.image_url || productImages[product.slug]}
                          alt={product.name}
                          loading="lazy"
                          className="w-[80%] sm:w-[60%] h-[80%] object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground/40">
                          <div className="w-16 h-32 rounded-sm border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                            <span className="text-[10px] uppercase tracking-widest rotate-90 whitespace-nowrap text-muted-foreground/30">
                              Image
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="p-5 flex flex-col flex-1">
                      <p className="text-muted-foreground uppercase tracking-widest text-[10px] mb-1">
                        {product.category || "Loralai, Pakistan"}
                      </p>
                      <h3 className="font-serif text-sm md:text-lg text-foreground leading-snug mb-1">
                        {product.name}
                      </h3>

                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex flex-col">
                          {product.discount_price ? (
                            <>
                              <span className="font-medium text-foreground text-base">
                                {formatPrice(product.discount_price)}
                              </span>
                              <span className="text-xs text-muted-foreground line-through">
                                {formatPrice(product.price)}
                              </span>
                            </>
                          ) : (
                            <span className="font-medium text-foreground text-base">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleAddSuggested(product)}
                          className="flex items-center gap-2 text-xs uppercase tracking-widest bg-primary text-primary-foreground px-3 py-2 min-h-[44px] hover:bg-primary/90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={product.stock === 0}
                        >
                          {justAdded.has(product.id) ? (
                            <><Check className="w-4 h-4" /> Added</>
                          ) : (
                            <><ShoppingCart className="w-4 h-4" /> {product.stock === 0 ? "Out of Stock" : "Add"}</>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
