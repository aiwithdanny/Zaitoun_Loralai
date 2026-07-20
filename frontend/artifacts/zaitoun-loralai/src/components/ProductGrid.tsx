import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Loader2, Search, X } from "lucide-react";
import { useProducts, type ProductFilters } from "@/hooks/useProducts";
import { useCart } from "@/store/cart";
import { toast } from "sonner";
import { formatPrice } from "@/utils/currency";
import { productImages } from "@/lib/productImages";
import { ProductGroupCard } from "./ProductGroupCard";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const card = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const sortOptions = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low–High' },
  { value: 'price-desc', label: 'Price: High–Low' },
  { value: 'name-asc', label: 'Name: A–Z' },
  { value: 'name-desc', label: 'Name: Z–A' },
  { value: 'newest', label: 'Newest' },
] as const;

export function ProductGrid() {
  const addItem = useCart((state) => state.addItem);

  // Filter state
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortValue, setSortValue] = useState('default');

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Derive sort params from the sort dropdown value
  const sortParams = useMemo((): { sort_by?: ProductFilters['sort_by']; sort_dir?: ProductFilters['sort_dir'] } => {
    switch (sortValue) {
      case 'price-asc': return { sort_by: 'price', sort_dir: 'asc' };
      case 'price-desc': return { sort_by: 'price', sort_dir: 'desc' };
      case 'name-asc': return { sort_by: 'name', sort_dir: 'asc' };
      case 'name-desc': return { sort_by: 'name', sort_dir: 'desc' };
      case 'newest': return { sort_by: 'created_at', sort_dir: 'desc' };
      default: return {};
    }
  }, [sortValue]);

  // Build filters — only include non-empty values so the query key stays clean
  const filters = useMemo((): ProductFilters | undefined => {
    const f: ProductFilters = {};
    if (search) f.search = search;
    if (category) f.category = category;
    if (sortParams.sort_by) {
      f.sort_by = sortParams.sort_by;
      f.sort_dir = sortParams.sort_dir;
    }
    return Object.keys(f).length > 0 ? f : undefined;
  }, [search, category, sortParams]);

  const { data: products, isPending, isFetching, error } = useProducts(filters);

  const hasActiveFilters = Boolean(search || category || sortValue !== 'default');

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.discount_price || product.price,
      image_url: product.image_url || productImages[product.slug],
    });
    toast.success(`${product.name} added to cart`);
  };

  // Group products by product_group_id, then split each group by category
  // so Bottles, Cans, and Bulk each get their own card.
  const grouped = useMemo(() => {
    if (!products) return null;
    const map = new Map<string, typeof products>();
    const ungrouped: typeof products = [];
    for (const p of products) {
      if (p.product_group_id) {
        const existing = map.get(p.product_group_id) || [];
        existing.push(p);
        map.set(p.product_group_id, existing);
      } else {
        ungrouped.push(p);
      }
    }
    const groups: Array<{ groupId: string; category: string; variants: typeof products }> = [];
    for (const [groupId, variants] of map.entries()) {
      // Split variants by category (e.g. Bottles, Cans, Bulk)
      const byCategory = new Map<string, typeof products>();
      for (const v of variants) {
        const cat = v.category || "Other";
        const existing = byCategory.get(cat) || [];
        existing.push(v);
        byCategory.set(cat, existing);
      }
      for (const [cat, catVariants] of byCategory.entries()) {
        groups.push({ groupId, category: cat, variants: catVariants });
      }
    }
    return { groups, ungrouped };
  }, [products]);

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
          <p className="text-accent uppercase tracking-[0.2em] text-xs mb-4">Our Family Of Olive Oils</p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground">
            Choose Your Bottle
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-sm leading-relaxed">
            From everyday kitchen essentials to premium gifts — find the perfect size for every need, all sharing the same uncompromising quality.
          </p>
        </motion.div>

        {/* Filter Bar — always rendered regardless of loading state */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-sm bg-card border border-border rounded-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
            />
            {searchInput && (
              <button
                onClick={() => { setSearchInput(''); setSearch(''); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 text-sm bg-card border border-border rounded-sm text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer min-w-[140px]"
          >
            <option value="">All Categories</option>
            {(products ? [...new Set(products.map(p => p.category).filter((c): c is string => !!c))] : []).sort().map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortValue}
            onChange={(e) => setSortValue(e.target.value)}
            className="px-3 py-2 text-sm bg-card border border-border rounded-sm text-foreground focus:outline-none focus:border-primary transition-colors cursor-pointer min-w-[160px]"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Initial Loading State (only on very first load — no data yet) */}
        {isPending && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading products...</span>
          </div>
        )}

        {/* Error State (only show if we have nothing to display) */}
        {error && !products && (
          <div className="text-center py-20">
            <p className="text-red-500 mb-4">Failed to load products. Please try again later.</p>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
        )}

        {/* Products Grid */}
        {products && (
          <>
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-opacity duration-300 ${isFetching ? 'opacity-50' : 'opacity-100'}`}
            >
            {/* Grouped product lines — one card per category per group */}
            {grouped?.groups.map((g) => (
              <motion.div key={`${g.groupId}-${g.category}`} variants={card}>
                <ProductGroupCard
                  variants={g.variants}
                  category={g.category}
                  productImages={productImages}
                />
              </motion.div>
            ))}

            {/* Ungrouped products — individual cards (backward compatible) */}
            {grouped?.ungrouped.map((product) => (
              <motion.div
                key={product.id}
                variants={card}
                className="group bg-card border border-border rounded-sm overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-500"
              >
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
                      loading="lazy"
                      className="w-[60%] h-[80%] object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
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

                <div className="p-5 flex flex-col flex-1">
                  <p className="text-muted-foreground uppercase tracking-widest text-[10px] mb-1">
                    {product.category || 'Loralai, Pakistan'}
                  </p>
                  <h3 className="font-serif text-sm md:text-lg text-foreground leading-snug mb-1">
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
                      className="flex items-center gap-2 text-xs uppercase tracking-widest bg-primary text-primary-foreground px-3 py-2 hover:bg-primary/90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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

            {/* Empty state inside the fragment so it coexists with the filter bar */}
            {products.length === 0 && !isFetching && (
              <div className="text-center py-20">
                <p className="text-muted-foreground">
                  {hasActiveFilters
                    ? 'No products match your filters. Try adjusting your search or clearing filters.'
                    : 'No products available at the moment.'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
