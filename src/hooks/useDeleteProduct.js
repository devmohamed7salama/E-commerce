import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "../services/productService";
import { QUERY_KEYS } from "../constants/queryKeys";

/**
 * Hook to delete a product
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
    },
  });
}
