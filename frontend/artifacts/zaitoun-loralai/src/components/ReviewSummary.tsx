import { Star } from "lucide-react";
import type { ReviewAggregate } from "@/lib/api";

interface ReviewSummaryProps {
  aggregate: ReviewAggregate;
}

export function ReviewSummary({ aggregate }: ReviewSummaryProps) {
  const { average_rating, total_count, distribution } = aggregate;

  if (total_count === 0) {
    return null;
  }

  return (
    <div className="border border-border rounded-lg p-6 space-y-5">
      {/* Big average rating */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2">
          <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          <span className="text-3xl font-bold text-foreground">{average_rating.toFixed(1)}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          {total_count} review{total_count !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Distribution bars */}
      <div className="space-y-1.5">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = distribution[star] || 0;
          const pct = total_count > 0 ? (count / total_count) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-2 text-xs">
              <span className="w-6 text-right text-muted-foreground shrink-0">{star}★</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-4 text-right text-muted-foreground shrink-0">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
