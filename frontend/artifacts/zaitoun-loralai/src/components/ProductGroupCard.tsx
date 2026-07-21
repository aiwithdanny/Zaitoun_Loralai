import { useMemo } from "react";
import { useLocation } from "wouter";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/api";
import { formatPrice } from "@/utils/currency";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { useWishlistList, useWishlistAdd, useWishlistRemove } from "@/hooks/useWishlist";
import { toast } from "sonner";

interface ProductGroupCardProps {
  variants: Product[];
  category?: string;
  productImages: Record<string, string>;
}

/** Strip a trailing " — size" or " - size" suffix from a product name. */
function stripSizeSuffix(name: string): string {
  return name.replace(/\s*[—–-]\s*[^—–-]+$/, "");
}

export function ProductGroupCard({ variants, category: categoryProp, productImages }: ProductGroupCardProps) {
  const [, navigate] = useLocation();
  const { isLoggedIn } = useCustomerAuth();
  const { data: wishlist } = useWishlistList(isLoggedIn);
  const addMutation = useWishlistAdd();
  const removeMutation = useWishlistRemove();

  const sorted = useMemo(
    () => [...variants].sort((a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99)),
    [variants],
  );

  const first = sorted[0];
  const groupName = stripSizeSuffix(first.name);
  const category = first.category || "Loralai, Pakistan";
  const isFeatured = sorted.some((v) => v.is_featured);
  const groupId = first.product_group_id;

  const isWishlisted = useMemo(() => {
    if (!wishlist || !groupId) return false;
    return wishlist.some((group) => group[0]?.product_group_id === groupId);
  }, [wishlist, groupId]);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!groupId) return;

    if (!isLoggedIn) {
      toast.error("Sign in to save items to your wishlist");
      return;
    }

    if (isWishlisted) {
      removeMutation.mutate(groupId);
    } else {
      addMutation.mutate(groupId);
    }
  };

  // Lowest effective price among all variants
  const lowestPrice = useMemo(() => {
    let min = Infinity;
    for (const v of sorted) {
      const p = v.discount_price ?? v.price;
      if (p < min) min = p;
    }
    return min;
  }, [sorted]);

  const imgSrc = first.image_url || productImages[first.slug];

  const handleNavigate = () => {
    if (groupId) {
      const params = new URLSearchParams();
      if (categoryProp) params.set("category", categoryProp);
      const qs = params.toString();
      navigate(`/product/${groupId}${qs ? `?${qs}` : ""}`);
    }
  };

  return (
    <div
      className="group bg-card border border-border rounded-sm overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-500 cursor-pointer"
      onClick={handleNavigate}
    >
      {/* Image area */}
      <div className="relative aspect-[3/4] bg-muted/40 flex items-center justify-center overflow-hidden">
        {isFeatured && (
          <span className="absolute top-3 left-3 z-10 text-[10px] uppercase tracking-widest bg-primary text-primary-foreground px-2 py-1">
            Featured
          </span>
        )}

        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors"
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`h-5 w-5 ${
              isWishlisted
                ? "fill-red-500 text-red-500"
                : "text-gray-400"
            }`}
          />
        </button>

        {imgSrc ? (
          <img
            src={imgSrc}
            alt={groupName}
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
          {category}
        </p>
        <h3 className="font-serif text-sm md:text-lg text-foreground leading-snug mb-1">
          {groupName}
        </h3>

        <div className="mt-auto flex items-center justify-between">
          <span className="font-medium text-foreground text-base">
            From {formatPrice(lowestPrice)}
          </span>

          <span
            onClick={(e) => {
              e.stopPropagation();
              handleNavigate();
            }}
            className="flex items-center gap-2 text-xs uppercase tracking-widest bg-primary text-primary-foreground px-3 py-2 min-h-[44px] hover:bg-primary/90 transition-colors duration-300"
          >
            Shop Now
          </span>
        </div>
      </div>
    </div>
  );
}
