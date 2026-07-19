import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewsApi, type ReviewsResponse } from "@/lib/api";

export const reviewKeys = {
  all: ["reviews"] as const,
  lists: () => [...reviewKeys.all, "list"] as const,
  list: (productGroupId: string) => [...reviewKeys.lists(), productGroupId] as const,
};

export function useReviews(productGroupId: string) {
  return useQuery({
    queryKey: reviewKeys.list(productGroupId),
    queryFn: () => reviewsApi.getReviews(productGroupId),
    enabled: !!productGroupId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useRefreshReviews() {
  const queryClient = useQueryClient();
  return (productGroupId: string) => {
    queryClient.invalidateQueries({ queryKey: reviewKeys.list(productGroupId) });
  };
}
