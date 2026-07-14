import type { Product } from "@/lib/api";

interface SizeSelectorProps {
  variants: Product[];
  selectedId: number;
  onSelect: (product: Product) => void;
}

export function SizeSelector({ variants, selectedId, onSelect }: SizeSelectorProps) {
  // Sort variants by sort_order for consistent display
  const sorted = [...variants].sort((a, b) => (a.sort_order ?? 99) - (b.sort_order ?? 99));

  return (
    <div className="flex flex-wrap gap-2">
      {sorted.map((variant) => {
        const isSelected = variant.id === selectedId;
        const isOutOfStock = variant.stock === 0;

        return (
          <button
            key={variant.id}
            onClick={() => onSelect(variant)}
            disabled={isOutOfStock}
            className={`
              px-3 py-1.5 text-xs uppercase tracking-wider rounded-sm border transition-all duration-200
              ${isSelected
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:border-primary/50"
              }
              ${isOutOfStock ? "opacity-30 cursor-not-allowed line-through" : "cursor-pointer"}
            `}
          >
            {variant.size_label}
          </button>
        );
      })}
    </div>
  );
}
