import { useQuery } from "@tanstack/react-query";
import { getProductBySlug, getProductById } from "../services/productService";
import { QUERY_KEYS } from "../constants/queryKeys";

/**
 * Hook to fetch a single product by slug
 */
export function useProductBySlug(slug) {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCT, slug],
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug,
  });
}

/**
 * Hook to fetch a single product by ID (typically for admin forms)
 */
export function useProductById(id) {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCT, "id", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
}
