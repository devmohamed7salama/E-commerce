import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSlider } from "../services/sliderService";
import { QUERY_KEYS } from "../constants/queryKeys";

/**
 * Hook to update a slider banner
 */
export function useUpdateSlider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, slider }) => updateSlider(id, slider),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SLIDERS] });
    },
  });
}
