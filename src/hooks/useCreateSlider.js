import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSlider } from "../services/sliderService";
import { QUERY_KEYS } from "../constants/queryKeys";

/**
 * Hook to create a slider banner
 */
export function useCreateSlider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSlider,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SLIDERS] });
    },
  });
}
