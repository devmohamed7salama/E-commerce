import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "../services/categoryService";
import { QUERY_KEYS } from "../constants/queryKeys";

/**
 * Hook to create a category
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
    },
  });
}
