import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  updateProduct, 
  clearProductRelations,
  addProductColors, 
  addProductSizes, 
  addProductImages 
} from "../services/productService";
import { QUERY_KEYS } from "../constants/queryKeys";

/**
 * Hook to update a product and its associated options
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, product, colors, sizes, images }) => {
      // 1. Update the base product
      const updatedProduct = await updateProduct(id, product);

      // 2. Clear existing relations
      await clearProductRelations(id);

      // 3. Insert new relations in parallel
      const relationsPromise = [];
      
      if (colors && colors.length > 0) {
        relationsPromise.push(addProductColors(id, colors));
      }
      
      if (sizes && sizes.length > 0) {
        relationsPromise.push(addProductSizes(id, sizes));
      }
      
      if (images && images.length > 0) {
        relationsPromise.push(addProductImages(id, images));
      }

      await Promise.all(relationsPromise);
      return updatedProduct;
    },
    onSuccess: (data) => {
      // Invalidate specific product details cache and lists cache
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCT, data.slug] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCT, "id", data.id] });
    },
  });
}
