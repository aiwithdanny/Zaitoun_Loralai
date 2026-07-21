/**
 * React Query hooks for wishlist API
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistApi, Product } from '@/lib/api';
import { toast } from 'sonner';

// Query keys
export const wishlistKeys = {
  all: ['wishlist'] as const,
};

// ==================== QUERIES ====================

/**
 * Fetch the customer's wishlist — returns grouped product data.
 */
export function useWishlistList(enabled?: boolean) {
  return useQuery({
    queryKey: wishlistKeys.all,
    queryFn: () => wishlistApi.list(),
    staleTime: 1000 * 60, // 1 minute — wishlist changes should reflect reasonably fast
    enabled,
  });
}

// ==================== MUTATIONS ====================

/**
 * Add a product group to the wishlist.
 */
export function useWishlistAdd() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productGroupId: string) => wishlistApi.add(productGroupId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
      if (data.message !== 'Already in wishlist') {
        toast.success('Added to wishlist');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add to wishlist');
    },
  });
}

/**
 * Remove a product group from the wishlist.
 */
export function useWishlistRemove() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productGroupId: string) => wishlistApi.remove(productGroupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
      toast.success('Removed from wishlist');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove from wishlist');
    },
  });
}
