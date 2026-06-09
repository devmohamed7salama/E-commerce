import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSlider } from "../services/sliderService";
import { QUERY_KEYS } from "../constants/queryKeys";

/**
 * Hook to delete a slider banner
 */
export function useDeleteSlider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSlider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SLIDERS] });
    },
  });
}
