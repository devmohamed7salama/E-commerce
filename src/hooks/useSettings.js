import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../services/settingsService";
import { QUERY_KEYS } from "../constants/queryKeys";

/**
 * Hook to fetch global site settings
 */
export function useSettings() {
  return useQuery({
    queryKey: [QUERY_KEYS.SETTINGS],
    queryFn: getSettings,
  });
}
