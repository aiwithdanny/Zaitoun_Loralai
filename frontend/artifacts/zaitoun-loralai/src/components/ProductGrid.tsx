import { motion } from "framer-motion";
import { ShoppingBag, Loader2 } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/store/cart";
import { toast } from "sonner";
import { formatPrice } from "@/utils/currency";
import bottle250ml from "@assets/250_ml_Bottle_1782790472883.png";
import bottle500ml from "@assets/500_ml_Bottle_1782790552258.png";
import can300ml from "@assets/Can_300_ml_1782790980890.png";
import can500ml from "@assets/500_ml_can_1782791441460.png";
import threeL from "@assets/3L.png";
import fiveL from "@assets/5L.png";

// Fallback images keyed by product slug (stable across re-seeds).
const productImages: Record<string, string> = {
  "extra-virgin-250ml": bottle250ml,
  "extra-virgin-500ml": bottle500ml,
  "extra-virgin-300ml-can": can300ml,
  "extra-virgin-500ml-can": can500ml,
  "extra-virgin-3l": threeL,
  "extra-virgin-5l": fiveL,
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const card = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function ProductGrid() {
  // Fetch products from backend API
  const { data: products, isLoading, error } = useProducts();
  const addItem = useCart((state) => state.addItem);

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.discount_price || product.price,
      image_url: product.image_url || productImages[product.slug],
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <section id="products" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-accent uppercase tracking-[0.2em] text-xs mb-4">Our Collection</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground">
            Every Size, One Standard
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-sm leading-relaxed">
            Whether for the everyday kitchen or a thoughtful gift, Zaitoun Loralai is available in multiple sizes — all sharing the same uncompromising quality.
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading products...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">Failed to load products. Please try again later.</p>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !error && products && (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                variants={card}
                className="group bg-card border border-border rounded-sm overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-500"
              >
                {/* Image area */}
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
                  {productImages[product.slug] || product.image_url ? (
                    <img
                      src={product.image_url || productImages[product.slug]}
                      alt={product.name}
                      className="w-[60%] h-[80%] object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        // Fallback to local image if URL fails
                        if (product.image_url && productImages[product.slug]) {
                          e.currentTarget.src = productImages[product.slug];
                        }
                      }}
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
                    {product.category || 'Loralai, Pakistan'}
                  </p>
                  <h3 className="font-serif text-lg text-foreground leading-snug mb-1">
                    {product.name}
                  </h3>
                  {product.short_description && (
                    <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                      {product.short_description}
                    </p>
                  )}

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
                      onClick={() => handleAddToCart(product)}
                      className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary border border-primary px-3 py-2 hover:bg-primary hover:text-primary-foreground transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={product.stock === 0}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      {product.stock === 0 ? 'Out of Stock' : 'Add'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* No Products State */}
        {!isLoading && !error && products && products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No products available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
