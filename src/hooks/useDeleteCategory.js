import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory } from "../services/categoryService";
import { QUERY_KEYS } from "../constants/queryKeys";

/**
 * Hook to delete a category
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] }); // Products with deleted category might throw error/need updating
    },
  });
}
