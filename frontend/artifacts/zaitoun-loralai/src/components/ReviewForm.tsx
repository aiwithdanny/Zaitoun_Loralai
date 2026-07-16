import { useState, useRef } from "react";
import { Star, Upload, X, Loader2 } from "lucide-react";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { reviewsApi, type ReviewData } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface ReviewFormProps {
  productGroupId: string;
  existingReview?: ReviewData;
  onSubmitted: () => void;
}

export function ReviewForm({ productGroupId, existingReview, onSubmitted }: ReviewFormProps) {
  const { isLoggedIn, customer } = useCustomerAuth();
  const [, navigate] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="border border-border rounded-lg p-6 text-center">
        <p className="text-sm text-muted-foreground mb-3">
          Sign in to write a review.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/login?redirect=/product/${productGroupId}`)}
        >
          <Star className="w-4 h-4 mr-2" />
          Sign In to Review
        </Button>
      </div>
    );
  }

  if (existingReview) {
    return (
      <div className="border border-border rounded-lg p-6">
        <p className="text-sm text-muted-foreground">
          You've already reviewed this product.
        </p>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-4 h-4 ${
                  s <= existingReview.rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {!existingReview.is_approved && "(pending approval)"}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {existingReview.review_text}
        </p>
      </div>
    );
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const url = await reviewsApi.uploadImage(file);
      setPhotoUrl(url);
      toast.success("Photo uploaded");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (reviewText.trim().length < 10) {
      toast.error("Review must be at least 10 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewsApi.createReview(productGroupId, {
        rating,
        review_text: reviewText.trim(),
        photo_url: photoUrl || undefined,
      });
      toast.success("Review submitted for approval");
      setRating(0);
      setReviewText("");
      setPhotoUrl(null);
      onSubmitted();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border border-border rounded-lg p-6 space-y-4">
      <h3 className="font-serif text-lg text-foreground">Write a Review</h3>

      {/* Star Rating */}
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
          Your Rating
        </p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setRating(s)}
              onMouseEnter={() => setHoverRating(s)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-colors"
            >
              <Star
                className={`w-6 h-6 ${
                  s <= (hoverRating || rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/30 hover:text-amber-400/50"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Review Text */}
      <div>
        <textarea
          placeholder="Share your thoughts about this product..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows={4}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          maxLength={2000}
        />
        <p className="text-[10px] text-muted-foreground/50 mt-1 text-right">
          {reviewText.length}/2000
        </p>
      </div>

      {/* Photo Upload */}
      <div>
        {photoUrl ? (
          <div className="relative inline-block">
            <img
              src={photoUrl}
              alt="Review photo"
              className="h-20 w-20 object-cover rounded-md border border-border"
            />
            <button
              type="button"
              onClick={() => setPhotoUrl(null)}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            {isUploading ? "Uploading..." : "Add Photo"}
          </Button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || rating === 0 || reviewText.trim().length < 10}
        className="gap-2"
      >
        {isSubmitting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Star className="w-4 h-4" />
        )}
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </div>
  );
}
