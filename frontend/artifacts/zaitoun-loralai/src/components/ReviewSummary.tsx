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
    <div className="border border-border rounded-lg p-6">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Big average */}
        <div className="text-center shrink-0">
          <span className="text-4xl font-serif text-foreground">
            {average_rating.toFixed(1)}
          </span>
          <div className="flex gap-0.5 justify-center mt-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-4 h-4 ${
                  s <= Math.round(average_rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/20"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {total_count} review{total_count !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Distribution bars */}
        <div className="flex-1 w-full space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = distribution[star] || 0;
            const pct = total_count > 0 ? (count / total_count) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="w-8 text-right text-muted-foreground shrink-0">
                  {star}★
                </span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-6 text-muted-foreground shrink-0 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
