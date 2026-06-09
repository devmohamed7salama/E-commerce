import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../services/categoryService";
import { QUERY_KEYS } from "../constants/queryKeys";

/**
 * Hook to fetch all categories
 */
export function useCategories() {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: getCategories,
  });
}
