import { supabase } from "../app/supabase";

/**
 * Fetch all sliders sorted by sort_order
 */
export async function getSliders() {
  const { data, error } = await supabase
    .from("sliders")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Fetch active sliders only for public frontend
 * Resolves product slugs for product-linked sliders
 */
export async function getActiveSliders() {
  const { data, error } = await supabase
    .from("sliders")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;

  const productSliders = data.filter((s) => s.link_type === "product" && s.link_id);
  if (productSliders.length > 0) {
    const productIds = productSliders.map((s) => s.link_id);
    const { data: products } = await supabase
      .from("products")
      .select("id, slug")
      .in("id", productIds);

    if (products) {
      const slugMap = Object.fromEntries(products.map((p) => [p.id, p.slug]));
      data.forEach((s) => {
        if (s.link_type === "product") s.product_slug = slugMap[s.link_id] || null;
      });
    }
  }

  return data;
}

/**
 * Create a slider entry
 */
export async function createSlider(sliderData) {
  const { data, error } = await supabase
    .from("sliders")
    .insert([sliderData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update a slider entry
 */
export async function updateSlider(id, sliderData) {
  const { data, error } = await supabase
    .from("sliders")
    .update(sliderData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a slider entry
 */
export async function deleteSlider(id) {
  const { error } = await supabase
    .from("sliders")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}
