import { useQuery } from "@tanstack/react-query";
import { getProducts, getFeaturedProducts } from "../services/productService";
import { QUERY_KEYS } from "../constants/queryKeys";

/**
 * Hook to fetch all products
 */
export function useProducts() {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS],
    queryFn: getProducts,
  });
}

/**
 * Hook to fetch active featured products for frontend display
 */
export function useFeaturedProducts() {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, "featured"],
    queryFn: getFeaturedProducts,
  });
}
