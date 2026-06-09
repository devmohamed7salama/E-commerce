import { supabase } from "../app/supabase";

/**
 * Fetch the global site settings (always ID = 1)
 */
export async function getSettings() {
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Update the global site settings
 */
export async function updateSettings(settingsData) {
  // Exclude ID to prevent attempts to change primary key
  const { id, updated_at, ...cleanData } = settingsData;
  
  const { data, error } = await supabase
    .from("settings")
    .update(cleanData)
    .eq("id", 1)
    .select()
    .single();

  if (error) throw error;
  return data;
}
