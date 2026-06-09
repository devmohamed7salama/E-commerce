import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategory } from "../services/categoryService";
import { QUERY_KEYS } from "../constants/queryKeys";

/**
 * Hook to update a category
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, category }) => updateCategory(id, category),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
      // If a category changes slug, we might need to invalidate products that use it
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
    },
  });
}
