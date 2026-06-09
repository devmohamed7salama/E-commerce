import { supabase } from "../app/supabase";

/**
 * Log in a user using email and password
 */
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * Log out the currently authenticated user
 */
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return true;
}

/**
 * Get the current active session
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

/**
 * Get the currently authenticated user merged with their database profile/role
 */
export async function getUser() {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return null;

  // Retrieve user's role from the profiles table
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Error fetching user profile:", profileError.message);
  }

  // Return user object enriched with their role info
  return {
    ...user,
    role: profile?.role || "user",
    profile
  };
}

/**
 * Listen for authentication state changes (e.g. login, logout)
 */
export function onAuthStateChange(callback) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });

  return subscription;
}
