/**
 * Admin Reviews Moderation Page
 * View, approve, and reject customer reviews
 */

import { Helmet } from "react-helmet-async";
import { useEffect, useState } from 'react';
import { adminApi, type ReviewData } from '@/lib/api';
import { toast } from 'sonner';
import { Star, MessageSquare, BadgeCheck, Check, X, ExternalLink, Loader2, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

const STATUS_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

const ITEMS_PER_PAGE = 10;

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function formatGroupId(id: string): string {
  return id
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [page, setPage] = useState(1);
  const [pendingCount, setPendingCount] = useState(0);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<ReviewData | null>(null);

  const totalPages = Math.ceil(reviews.length / ITEMS_PER_PAGE);
  const paginatedReviews = reviews.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const fetchReviews = async (status?: string) => {
    try {
      setLoading(true);
      setError('');

      const response = await adminApi.getReviews(status || statusFilter);
      setReviews(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load reviews');
      toast.error(err.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingCount = async () => {
    try {
      const res = await adminApi.getReviews('pending');
      setPendingCount(res.count);
    } catch {
      // non-critical
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchPendingCount();
  }, [statusFilter]);

  const handleFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setPage(1);
  };

  const handleApprove = async (reviewId: number) => {
    setActionLoading(reviewId);
    try {
      await adminApi.approveReview(reviewId);
      toast.success('Review approved');
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      setPendingCount((prev) => Math.max(0, prev - 1));
    } catch (err: any) {
      toast.error(err.message || 'Failed to approve review');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (reviewId: number) => {
    setActionLoading(reviewId);
    try {
      await adminApi.rejectReview(reviewId);
      toast.success('Review rejected');
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      setPendingCount((prev) => Math.max(0, prev - 1));
    } catch (err: any) {
      toast.error(err.message || 'Failed to reject review');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!reviewToDelete) return;
    setActionLoading(reviewToDelete.id);
    try {
      await adminApi.deleteReview(reviewToDelete.id);
      toast.success('Review permanently deleted');
      setReviews((prev) => prev.filter((r) => r.id !== reviewToDelete.id));
      setPendingCount((prev) => Math.max(0, prev - 1));
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete review');
    } finally {
      setActionLoading(null);
      setReviewToDelete(null);
    }
  };

  return (
    <div className="p-6">
      <Helmet>
        <title>Admin Reviews — Zaitoun Loralai</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Reviews</h1>
        {!loading && (
          <span className="text-sm text-muted-foreground">
            {reviews.length} review{reviews.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-6 border-b border-border">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => handleFilterChange(f.value)}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              statusFilter === f.value
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {f.label}
            {f.value === 'pending' && pendingCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full bg-primary text-primary-foreground">
                {pendingCount}
              </span>
            )}
            {statusFilter === f.value && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
            )}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground/50" />
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
          <p className="text-destructive text-sm mb-3">{error}</p>
          <button
            onClick={() => fetchReviews()}
            className="text-sm text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && reviews.length === 0 && (
        <div className="text-center py-20">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-6 h-6 text-muted-foreground/50" />
          </div>
          <h3 className="font-serif text-lg text-foreground mb-1">No reviews found</h3>
          <p className="text-sm text-muted-foreground">
            {statusFilter === 'pending'
              ? 'No pending reviews to moderate.'
              : `No ${statusFilter} reviews.`}
          </p>
        </div>
      )}

      {/* Review Cards */}
      {!loading && !error && reviews.length > 0 && (
        <div className="space-y-4">
          {paginatedReviews.map((review) => (
            <div
              key={review.id}
              className="border border-border rounded-lg p-5 bg-white shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left: review content */}
                <div className="flex-1 min-w-0 space-y-2">
                  {/* Name + Badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-foreground">
                      {review.customer_name || 'Anonymous'}
                    </span>
                    {review.verified_buyer && (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                        <BadgeCheck className="w-3 h-3" />
                        Verified Buyer
                      </span>
                    )}
                  </div>

                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= review.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-muted-foreground/20'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Review text */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {review.review_text}
                  </p>

                  {/* Photo thumbnail */}
                  {review.photo_url && (
                    <a
                      href={review.photo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block group"
                    >
                      <div className="relative h-14 w-14 rounded-md overflow-hidden border border-border">
                        <img
                          src={review.photo_url}
                          alt="Review photo"
                          className="h-full w-full object-cover group-hover:opacity-80 transition-opacity"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                          <ExternalLink className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </a>
                  )}

                  {/* Product group + date */}
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span>{formatGroupId(review.product_group_id)}</span>
                    <span>·</span>
                    <span>{formatDate(review.created_at)}</span>
                  </div>
                </div>

                {/* Right: status + actions */}
                <div className="shrink-0 flex flex-col items-end gap-2">
                  {/* Status badge */}
                  <span
                    className={`text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded ${
                      review.is_approved
                        ? 'bg-green-100 text-green-700'
                        : review.review_text === '__rejected__'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {review.is_approved ? 'Approved' : review.review_text === '__rejected__' ? 'Rejected' : 'Pending'}
                  </span>

                  {/* Actions — approve/reject for pending only; delete always visible */}
                  <div className="flex gap-2">
                    {!review.is_approved && review.review_text !== '__rejected__' && (
                      <>
                        <button
                          onClick={() => handleApprove(review.id)}
                          disabled={actionLoading === review.id}
                          className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 hover:bg-green-100 disabled:opacity-50 px-2.5 py-1.5 rounded transition-colors"
                        >
                          {actionLoading === review.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Check className="w-3 h-3" />
                          )}
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(review.id)}
                          disabled={actionLoading === review.id}
                          className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-50 px-2.5 py-1.5 rounded transition-colors"
                        >
                          {actionLoading === review.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <X className="w-3 h-3" />
                          )}
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setReviewToDelete(review)}
                      disabled={actionLoading === review.id}
                      className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-red-600 disabled:opacity-50 px-2.5 py-1.5 rounded transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 text-sm rounded transition-colors ${
                    p === page
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!reviewToDelete} onOpenChange={(open) => !open && setReviewToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this review from the database.
              {reviewToDelete && (
                <span className="block mt-2 text-xs text-muted-foreground">
                  &ldquo;{reviewToDelete.review_text.slice(0, 100)}
                  {reviewToDelete.review_text.length > 100 ? '...' : ''}&rdquo;
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={actionLoading === reviewToDelete?.id}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {actionLoading === reviewToDelete?.id ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
