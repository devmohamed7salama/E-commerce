import { useQuery } from "@tanstack/react-query";
import { getSliders, getActiveSliders } from "../services/sliderService";
import { QUERY_KEYS } from "../constants/queryKeys";

/**
 * Hook to fetch all sliders (admin dashboard)
 */
export function useSliders() {
  return useQuery({
    queryKey: [QUERY_KEYS.SLIDERS],
    queryFn: getSliders,
  });
}

/**
 * Hook to fetch only active sliders for homepage display
 */
export function useActiveSliders() {
  return useQuery({
    queryKey: [QUERY_KEYS.SLIDERS, "active"],
    queryFn: getActiveSliders,
  });
}
