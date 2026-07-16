import { Star, BadgeCheck, X } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
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
    <div className="space-y-5">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-border pb-5 last:border-b-0 last:pb-0">
          {/* Row 1: Name + badge + date */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                {review.customer_name || "Anonymous"}
              </span>
              {review.verified_buyer && (
                <span className="inline-flex items-center gap-0.5 text-[10px] uppercase tracking-wider text-green-600 bg-green-50 px-1.5 py-0.5 rounded font-medium">
                  <BadgeCheck className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>
            <span className="text-[11px] text-muted-foreground shrink-0">
              {formatDate(review.created_at)}
            </span>
          </div>

          {/* Row 2: Stars */}
          <div className="flex gap-0.5 mb-1.5">
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

          {/* Row 3: Review text */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {review.review_text}
          </p>

          {/* Photo */}
          {review.photo_url && (
            <div className="mt-2">
              <Dialog>
                <DialogTrigger asChild>
                  <button type="button" className="block cursor-pointer">
                    <img
                      src={review.photo_url}
                      alt="Review photo"
                      className="h-24 w-24 object-cover rounded-md border border-border hover:opacity-80 transition-opacity"
                    />
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-transparent border-0 shadow-none">
                  <div className="relative flex items-center justify-center">
                    <img
                      src={review.photo_url}
                      alt="Review photo"
                      className="max-w-full max-h-[85vh] object-contain rounded-md"
                    />
                    <DialogClose className="absolute top-2 right-2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70 transition-colors">
                      <X className="w-4 h-4" />
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
