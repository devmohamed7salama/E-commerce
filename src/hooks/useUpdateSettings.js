import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSettings } from "../services/settingsService";
import { QUERY_KEYS } from "../constants/queryKeys";

/**
 * Hook to update site settings
 */
export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SETTINGS] });
    },
  });
}
