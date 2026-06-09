import { supabase } from "../app/supabase";

/**
 * Fetch all categories.
 * Can optionally join self-referential categories table to get parent category name.
 */
export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select(`
      *,
      parent:categories!parent_id (id, name, slug)
    `)
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Fetch a single category by its slug
 */
export async function getCategoryBySlug(slug) {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Fetch a single category by ID
 */
export async function getCategoryById(id) {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Create a new category
 */
export async function createCategory(categoryData) {
  const { data, error } = await supabase
    .from("categories")
    .insert([categoryData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update a category
 */
export async function updateCategory(id, categoryData) {
  const { data, error } = await supabase
    .from("categories")
    .update(categoryData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a category
 */
export async function deleteCategory(id) {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}
