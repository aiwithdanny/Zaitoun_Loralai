import { Star, BadgeCheck, Image as ImageIcon } from "lucide-react";
import type { ReviewData } from "@/lib/api";

interface ReviewListProps {
  reviews: ReviewData[];
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-PK", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="border border-border rounded-lg p-5 space-y-3"
        >
          {/* Header: name + date + badge */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-foreground">
                {review.customer_name || "Anonymous"}
              </span>
              {review.verified_buyer && (
                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                  <BadgeCheck className="w-3 h-3" />
                  Verified Buyer
                </span>
              )}
            </div>
            <span className="text-[10px] text-muted-foreground shrink-0">
              {formatDate(review.created_at)}
            </span>
          </div>

          {/* Stars */}
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-3.5 h-3.5 ${
                  s <= review.rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/20"
                }`}
              />
            ))}
          </div>

          {/* Text */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {review.review_text}
          </p>

          {/* Photo */}
          {review.photo_url && (
            <a
              href={review.photo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <img
                src={review.photo_url}
                alt="Review photo"
                className="h-20 w-20 object-cover rounded-md border border-border hover:opacity-80 transition-opacity"
              />
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
