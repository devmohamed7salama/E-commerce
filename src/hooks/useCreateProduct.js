import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  createProduct, 
  addProductColors, 
  addProductSizes, 
  addProductImages 
} from "../services/productService";
import { QUERY_KEYS } from "../constants/queryKeys";

/**
 * Hook to create a product and its associated options
 */
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ product, colors, sizes, images }) => {
      // 1. Create the base product
      const newProduct = await createProduct(product);
      const productId = newProduct.id;

      // 2. Insert relations in parallel
      const relationsPromise = [];
      
      if (colors && colors.length > 0) {
        relationsPromise.push(addProductColors(productId, colors));
      }
      
      if (sizes && sizes.length > 0) {
        relationsPromise.push(addProductSizes(productId, sizes));
      }
      
      if (images && images.length > 0) {
        relationsPromise.push(addProductImages(productId, images));
      }

      await Promise.all(relationsPromise);
      return newProduct;
    },
    onSuccess: () => {
      // Invalidate products query to refresh lists
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
    },
  });
}
