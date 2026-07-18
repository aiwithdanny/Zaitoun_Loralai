import { Helmet } from "react-helmet-async";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { useParams, useLocation } from "wouter";
import { ArrowLeft, Minus, Plus, ShoppingBag, Zap, Star, MessageSquare, Loader2 } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/store/cart";
import { SizeSelector } from "@/components/SizeSelector";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { productImages } from "@/lib/productImages";
import { formatPrice } from "@/utils/currency";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

import { ReviewForm } from "@/components/ReviewForm";
import { ReviewList } from "@/components/ReviewList";
import { ReviewSummary } from "@/components/ReviewSummary";
import { ProductGroupCard } from "@/components/ProductGroupCard";
import { reviewsApi, type ReviewData, type ReviewAggregate } from "@/lib/api";
import type { Product } from "@/lib/api";

/** Strip a trailing " — size" or " - size" suffix from a product name. */
function stripSizeSuffix(name: string): string {
  return name.replace(/\s*[—–-]\s*[^—–-]+$/, "");
}

export function ProductDetail() {
  const { group_id } = useParams<{ group_id: string }>();
  const [location, navigate] = useLocation();
  const addItem = useCart((state) => state.addItem);
  const { customer } = useCustomerAuth();

  // Fetch all variants in this product group
  const { data: products, isPending, error } = useProducts(
    group_id ? { product_group_id: group_id } : undefined,
  );

  // Sort variants and pick the first as default
  const sorted = useMemo(
    () =>
      products
        ? [...products].sort((a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99))
        : [],
    [products],
  );

  // Fetch all active products for the "You May Also Like" section
  const { data: allProducts } = useProducts();

  // Group related products by product_group_id, excluding current group
  const relatedGroups = useMemo(() => {
    if (!allProducts || !group_id) return [];
    const groups = new Map<string, Product[]>();
    for (const p of allProducts) {
      if (!p.product_group_id || p.product_group_id === group_id) continue;
      const existing = groups.get(p.product_group_id);
      if (existing) existing.push(p);
      else groups.set(p.product_group_id, [p]);
    }
    return Array.from(groups.values());
  }, [allProducts, group_id]);

  const [selectedVariant, setSelectedVariant] = useState<Product | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);

  // Reset to first variant when grouped data loads or changes
  // Prefer a variant matching ?category= query param if present
  useEffect(() => {
    if (sorted.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const targetCategory = params.get("category");
      const defaultVariant = targetCategory
        ? sorted.find((v) => v.category === targetCategory) ?? sorted[0]
        : sorted[0];
      setSelectedVariant(defaultVariant);
      setQuantity(1);
    }
  }, [sorted, location]);

  // ==================== Reviews ====================
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [aggregate, setAggregate] = useState<ReviewAggregate>({
    average_rating: 0,
    total_count: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    if (!group_id) return;
    setReviewsLoading(true);
    try {
      const res = await reviewsApi.getReviews(group_id);
      setReviews(res.data);
      setAggregate(res.aggregate);
    } catch {
      // Silently fail — reviews are non-critical
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  }, [group_id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const groupName = sorted.length > 0 ? stripSizeSuffix(sorted[0].name) : "";
  const category = sorted.length > 0 ? (sorted[0].category || "Loralai, Pakistan") : "";

  const currentVariant = selectedVariant ?? sorted[0];
  const currentPrice = currentVariant?.discount_price ?? currentVariant?.price ?? 0;
  const hasDiscount = currentVariant?.discount_price != null;
  const inStock = (currentVariant?.stock ?? 0) > 0;

  const imgSrc = currentVariant?.image_url || (currentVariant?.slug ? productImages[currentVariant.slug] : undefined);

  const handleVariantChange = (variant: Product) => {
    setSelectedVariant(variant);
    setQuantity(1);
  };

  const getCartPayload = () => ({
    id: currentVariant!.id,
    name: currentVariant!.name,
    price: currentVariant!.discount_price || currentVariant!.price,
    image_url: currentVariant!.image_url || productImages[currentVariant!.slug],
  });

  const handleAddToCart = () => {
    if (!currentVariant || !inStock) return;
    addItem(getCartPayload(), quantity);
    toast.success(`${quantity} × ${currentVariant.name} added to cart`);
  };

  const handleBuyNow = () => {
    if (!currentVariant || !inStock) return;
    addItem(getCartPayload(), quantity);
    navigate("/checkout");
  };

  // Loading state
  if (isPending) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Loading Product — Zaitoun Loralai</title>
        </Helmet>
        <Header />
        <div className="flex justify-center items-center py-40">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="ml-3 text-muted-foreground">Loading product...</span>
        </div>
        <Footer />
      </div>
    );
  }

  // Error / not found
  if (error || sorted.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Product Not Found — Zaitoun Loralai</title>
          <meta name="description" content="The requested product could not be found." />
        </Helmet>
        <Header />
        <div className="container mx-auto px-4 md:px-8 py-24 text-center">
          <h1 className="font-serif text-2xl text-foreground mb-4">Product not found</h1>
          <p className="text-muted-foreground mb-8">
            {error ? "Failed to load product information." : "This product group doesn't exist or has no variants."}
          </p>
          <Button onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{groupName} — Zaitoun Loralai</title>
        <meta name="description" content={`Shop ${groupName} — premium cold-pressed extra virgin olive oil from Zaitoun Loralai, sourced from Loralai, Pakistan.`} />
        <meta property="og:title" content={`${groupName} — Zaitoun Loralai`} />
        <meta property="og:description" content={`Shop ${groupName} — premium cold-pressed extra virgin olive oil from Zaitoun Loralai.`} />
      </Helmet>
      <Header />

      <main className="container mx-auto px-4 md:px-8 py-8">
        {/* Back link */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Left — Image */}
          <div className="relative aspect-[3/4] bg-muted/30 rounded-sm flex items-center justify-center overflow-hidden">
            {hasDiscount && (
              <span className="absolute top-4 right-4 z-10 text-[10px] uppercase tracking-widest bg-accent text-accent-foreground px-2 py-1 rounded-sm">
                Sale
              </span>
            )}
            {imgSrc ? (
              <img
                src={imgSrc}
                alt={groupName}
                className="w-[70%] h-[85%] object-contain drop-shadow-2xl"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground/40">
                <div className="w-20 h-40 rounded-sm border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                  <span className="text-[10px] uppercase tracking-widest rotate-90 whitespace-nowrap text-muted-foreground/30">
                    Image
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right — Info */}
          <div className="flex flex-col justify-center">
            <p className="text-accent uppercase tracking-[0.2em] text-xs mb-3">
              {category}
            </p>

            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-4">
              {groupName}
            </h1>

            {/* Star rating — dynamic from reviews */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${star <= Math.round(aggregate.average_rating) ? "text-amber-400 fill-amber-400" : "text-gray-300 fill-gray-300"}`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({aggregate.total_count} {aggregate.total_count === 1 ? "review" : "reviews"})
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              {hasDiscount ? (
                <div className="flex items-center gap-3">
                  <span className="font-serif text-3xl text-foreground">
                    {formatPrice(currentPrice)}
                  </span>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(currentVariant!.price)}
                  </span>
                </div>
              ) : (
                <span className="font-serif text-3xl text-foreground">
                  {formatPrice(currentPrice)}
                </span>
              )}
            </div>

            {/* Size Selector */}
            <div className="mb-6">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Select Size
              </p>
              <SizeSelector
                variants={sorted}
                selectedId={currentVariant!.id}
                onSelect={handleVariantChange}
              />
            </div>

            {/* Stock status */}
            <div className="mb-6">
              {inStock ? (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                  In Stock ({currentVariant!.stock} available)
                </p>
              ) : (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-destructive rounded-full" />
                  Out of Stock
                </p>
              )}
            </div>

            {/* Quantity + Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
              {/* Quantity selector */}
              <div className="flex items-center border border-border rounded-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="px-3 py-2 hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={!inStock}
                  className="px-3 py-2 hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 w-full sm:w-auto">
                <Button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className="flex-1 sm:flex-none gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleBuyNow}
                  disabled={!inStock}
                  variant="secondary"
                  className="flex-1 sm:flex-none gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Buy Now
                </Button>
              </div>
            </div>

            {/* Product Info Accordion */}
            <div className="border-t border-border pt-6">
              <Accordion type="multiple" defaultValue={["description"]}>
                <AccordionItem value="description">
                  <AccordionTrigger className="font-serif text-lg text-foreground">
                    Description
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    {currentVariant?.description || "No description available."}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="quality">
                  <AccordionTrigger className="font-serif text-lg text-foreground">
                    Quality &amp; Health Benefits
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed space-y-3">
                    <p>
                      Zaitoun Extra Virgin Olive Oil is rich in heart-healthy monounsaturated fats and natural antioxidants. Our cold-pressed oil retains high levels of polyphenols (557 mg/kg) that help reduce inflammation and protect against chronic diseases.
                    </p>
                    <div>
                      <p className="font-medium text-foreground mb-1">Key benefits:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Supports cardiovascular health by maintaining healthy cholesterol levels</li>
                        <li>Rich in Vitamin E and natural antioxidants</li>
                        <li>Anti-inflammatory properties</li>
                        <li>Promotes digestive health</li>
                        <li>May help regulate blood sugar levels</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="usage">
                  <AccordionTrigger className="font-serif text-lg text-foreground">
                    How To Use / Best For
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed space-y-3">
                    <p>
                      Perfect for everyday cooking and direct consumption. With a medium-high smoke point (210°C), it's ideal for:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Salad dressings and vinaigrettes</li>
                      <li>Drizzling over grilled vegetables, pasta, and bread</li>
                      <li>Sautéing and light frying</li>
                      <li>Pakistani dishes (daal, sabzi, karahi)</li>
                      <li>Finishing dishes for extra flavor</li>
                    </ul>
                    <p>
                      Store in a cool, dark place away from direct sunlight. Best used within 6 months of opening.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="flavour">
                  <AccordionTrigger className="font-serif text-lg text-foreground">
                    Flavour Profile
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed space-y-3">
                    <p>Zaitoun Extra Virgin Olive Oil offers a balanced, harmonious flavor profile:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Medium fruitiness with fresh, grassy notes</li>
                      <li>Pleasant peppery finish (indicates high polyphenol content)</li>
                      <li>Subtle hints of green almond and fresh herbs</li>
                      <li>Smooth, clean, and well-rounded taste</li>
                      <li>Distinctive without being overpowering</li>
                    </ul>
                    <p>Perfect for those who appreciate authentic, premium olive oil.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="ingredients">
                  <AccordionTrigger className="font-serif text-lg text-foreground">
                    Ingredients
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed space-y-3">
                    <p className="font-medium text-foreground">100% Pure Extra Virgin Olive Oil</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Cold-pressed from premium olives</li>
                      <li>No additives</li>
                      <li>No preservatives</li>
                      <li>No artificial flavors</li>
                      <li>No blending with other oils</li>
                    </ul>
                    <p>Sourced from carefully selected olives grown in the rich soils of Loralai, Pakistan.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="nutrition">
                  <AccordionTrigger className="font-serif text-lg text-foreground">
                    Nutritional Info
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Per 100ml</p>
                    <div className="w-full text-sm divide-y divide-border/50">
                      {[
                        ["Energy", "884 kcal"],
                        ["Total Fat", "100g"],
                        ["Saturated Fat", "14g"],
                        ["Monounsaturated Fat", "73g"],
                        ["Polyunsaturated Fat", "11g"],
                        ["Cholesterol", "0mg"],
                        ["Sodium", "0mg"],
                        ["Total Carbohydrate", "0g"],
                        ["Protein", "0g"],
                        ["Vitamin E", "12mg (80% RDA)"],
                      ].map(([label, value], i) => (
                        <div key={i} className="flex justify-between py-1.5">
                          <span className={label.includes("Fat") && i >= 2 ? "text-muted-foreground/70 pl-4" : "text-muted-foreground"}>
                            {label}
                          </span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>

        {/* Separator */}
        <Separator className="my-12" />

        {/* Reviews Section */}
        <section className="max-w-5xl mx-auto py-8">
          <h2 className="font-serif text-xl text-foreground mb-6">Customer Reviews</h2>

          {reviewsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground/50" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
              {/* Left column: summary */}
              <aside>
                {aggregate.total_count > 0 && (
                  <div className="md:sticky md:top-24">
                    <ReviewSummary aggregate={aggregate} />
                  </div>
                )}
              </aside>

              {/* Right column: reviews + form */}
              <div className="space-y-6">
                <ReviewList reviews={reviews} />

                {/* Empty state — only when no reviews at all */}
                {aggregate.total_count === 0 && (
                  <div className="text-center py-12">
                    <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-6 h-6 text-muted-foreground/50" />
                    </div>
                    <h3 className="font-serif text-lg text-foreground mb-2">No reviews yet — be the first!</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Share your experience with this product.
                    </p>
                  </div>
                )}

                <ReviewForm
                  productGroupId={group_id!}
                  existingReview={reviews.find((r) => customer && r.customer_id === customer.id)}
                  onSubmitted={fetchReviews}
                />
              </div>
            </div>
          )}
        </section>

        {/* You May Also Like — Related Products */}
        {relatedGroups.length > 0 && (
          <section className="max-w-5xl mx-auto py-8">
            <h2 className="font-serif text-xl text-foreground mb-6">You May Also Like</h2>
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin">
              {relatedGroups.map((group) => (
                <div key={group[0].product_group_id} className="min-w-[260px] max-w-[260px] snap-start flex-shrink-0">
                  <ProductGroupCard
                    variants={group}
                    productImages={productImages}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Find Your Perfect Match — Comparison Section */}
        {(() => {
          const SIZE_MATCH: Record<string, string> = {
            "250ml": "300ml Can",
            "500ml": "3L",
            "300ml Can": "250ml",
            "500ml Can": "500ml",
            "3L": "500ml",
            "5L": "3L",
          };

          const currentSize = currentVariant?.size_label;
          if (!currentSize) return null;
          const matchTarget = SIZE_MATCH[currentSize];
          if (!matchTarget) return null;
          const matchedVariant = sorted.find((v) => v.size_label === matchTarget);
          if (!matchedVariant) return null;

          const COMPARISON_DATA: Record<string, { bestFor: string; perfectFor: string; idealServing: string }> = {
            "250ml": { bestFor: "Drizzling, dressings, finishing dishes", perfectFor: "Individuals, gifts, first-time buyers", idealServing: "1–2 people" },
            "500ml": { bestFor: "Everyday cooking, sautéing, dressings", perfectFor: "Small families, regular everyday use", idealServing: "2–4 people" },
            "300ml Can": { bestFor: "Gifting, travel, portion control", perfectFor: "Gifts, occasional use, picnics", idealServing: "1–2 people" },
            "500ml Can": { bestFor: "Daily cooking, marinades, baking", perfectFor: "Families, value-for-money shoppers", idealServing: "2–4 people" },
            "3L": { bestFor: "Heavy cooking, frying, meal prep", perfectFor: "Large families, serious home cooks", idealServing: "4–6 people" },
            "5L": { bestFor: "Restaurants, catering, bulk use", perfectFor: "Commercial, best price per litre", idealServing: "6+ people" },
          };

          const avgRating = aggregate.average_rating;
          const rounded = Math.round(avgRating);

          return (
            <section className="max-w-5xl mx-auto py-8">
              <h2 className="font-serif text-2xl text-foreground mb-6 text-center">Find Your Perfect Match</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[currentVariant, matchedVariant].map((variant) => {
                  const info = COMPARISON_DATA[variant.size_label ?? ""];
                  return (
                    <div key={variant.id} className="bg-card border border-border rounded-lg p-6 flex flex-col">
                      {/* Product image */}
                      <div className="flex justify-center mb-4">
                        {(variant.image_url || productImages[variant.slug]) ? (
                          <img
                            src={variant.image_url || productImages[variant.slug]}
                            alt={variant.size_label || variant.name}
                            className="h-56 w-full max-w-[200px] object-contain"
                          />
                        ) : (
                          <div className="h-36 w-36 border border-dashed border-border rounded-sm flex items-center justify-center text-muted-foreground/30 text-[10px] uppercase tracking-widest">
                            Image
                          </div>
                        )}
                      </div>

                      {/* Size label */}
                      <p className="font-serif text-lg font-semibold text-foreground mb-1">
                        {variant.size_label}
                      </p>

                      {/* Star rating with review count */}
                      <div className="flex items-center gap-1.5 mb-4">
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg key={star} className={`w-3.5 h-3.5 ${star <= rounded ? "fill-amber-400" : "fill-amber-400/20"}`} viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ({aggregate.total_count} {aggregate.total_count === 1 ? "review" : "reviews"})
                        </span>
                      </div>

                      {/* Specs */}
                      {info && (
                        <div className="space-y-3 mb-6 flex-1">
                          <div>
                            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-0.5">Best For</p>
                            <p className="text-sm text-foreground">{info.bestFor}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-0.5">Perfect For</p>
                            <p className="text-sm text-foreground">{info.perfectFor}</p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-0.5">Ideal Serving</p>
                            <p className="text-sm text-foreground">{info.idealServing}</p>
                          </div>
                        </div>
                      )}

                      <Button
                        onClick={() => {
                          handleVariantChange(variant);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="w-full"
                      >
                        Shop Now
                      </Button>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })()}

      </main>

      <Footer />
    </div>
  );
}
