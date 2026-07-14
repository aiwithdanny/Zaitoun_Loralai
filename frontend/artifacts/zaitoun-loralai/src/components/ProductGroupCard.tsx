import { useState, useMemo } from "react";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/api";
import { formatPrice } from "@/utils/currency";
import { SizeSelector } from "./SizeSelector";

interface ProductGroupCardProps {
  variants: Product[];
  productImages: Record<string, string>;
  onAddToCart: (product: Product) => void;
}

/** Strip a trailing " — size" or " - size" suffix from a product name. */
function stripSizeSuffix(name: string): string {
  return name.replace(/\s*[—–-]\s*[^—–-]+$/, "");
}

export function ProductGroupCard({ variants, productImages, onAddToCart }: ProductGroupCardProps) {
  // Sort by sort_order, default to first
  const sorted = useMemo(
    () => [...variants].sort((a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99)),
    [variants],
  );

  const [selectedVariant, setSelectedVariant] = useState<Product>(sorted[0]);

  // Derive shared info from the first variant
  const groupName = stripSizeSuffix(sorted[0].name);
  const category = sorted[0].category || "Loralai, Pakistan";
  const description = sorted[0].short_description;
  const isFeatured = sorted.some((v) => v.is_featured);
  const hasDiscount = selectedVariant.discount_price != null;

  // Image
  const imgSrc = selectedVariant.image_url || productImages[selectedVariant.slug];

  const handleAdd = () => onAddToCart(selectedVariant);

  return (
    <div className="group bg-card border border-border rounded-sm overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-500">
      {/* Image area */}
      <div className="relative aspect-[3/4] bg-muted/40 flex items-center justify-center overflow-hidden">
        {isFeatured && (
          <span className="absolute top-3 left-3 z-10 text-[10px] uppercase tracking-widest bg-primary text-primary-foreground px-2 py-1">
            Featured
          </span>
        )}
        {hasDiscount && (
          <span className="absolute top-3 right-3 z-10 text-[10px] uppercase tracking-widest bg-accent text-accent-foreground px-2 py-1">
            Sale
          </span>
        )}

        {imgSrc ? (
          <img
            src={imgSrc}
            alt={groupName}
            loading="lazy"
            className="w-[60%] h-[80%] object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-700"
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
          {category}
        </p>
        <h3 className="font-serif text-sm md:text-lg text-foreground leading-snug mb-1">
          {groupName}
        </h3>
        {description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {description}
          </p>
        )}

        {/* Size Selector */}
        <div className="mb-4">
          <SizeSelector
            variants={sorted}
            selectedId={selectedVariant.id}
            onSelect={setSelectedVariant}
          />
        </div>

        {/* Price + Add button */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-medium text-foreground text-base">
              {formatPrice(selectedVariant.discount_price || selectedVariant.price)}
            </span>
            {selectedVariant.discount_price ? (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(selectedVariant.price)}
              </span>
            ) : null}
            {selectedVariant.stock > 0 ? (
              <span className="text-[10px] text-muted-foreground mt-0.5">
                In Stock ({selectedVariant.stock})
              </span>
            ) : (
              <span className="text-[10px] text-destructive mt-0.5">Out of Stock</span>
            )}
          </div>

          <button
            onClick={handleAdd}
            className="flex items-center gap-2 text-xs uppercase tracking-widest bg-primary text-primary-foreground px-3 py-2 hover:bg-primary/90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={selectedVariant.stock === 0}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {selectedVariant.stock === 0 ? "Out of Stock" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
