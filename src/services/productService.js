import { supabase } from "../app/supabase";

/**
 * Fetch all products with their category details
 */
export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories (id, name, slug)
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Fetch only active featured products
 */
export async function getFeaturedProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories (id, name, slug)
    `)
    .eq("is_featured", true)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Fetch a single product by its slug, including category, images, colors, and sizes
 */
export async function getProductBySlug(slug) {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories (id, name, slug),
      images:product_images (*),
      colors:product_colors (*),
      sizes:product_sizes (*)
    `)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Fetch a single product by ID for admin use (without active filters)
 */
export async function getProductById(id) {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories (id, name, slug),
      images:product_images (*),
      colors:product_colors (*),
      sizes:product_sizes (*)
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Create a new product
 */
export async function createProduct(productData) {
  const { data, error } = await supabase
    .from("products")
    .insert([productData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update a product
 */
export async function updateProduct(id, productData) {
  const { data, error } = await supabase
    .from("products")
    .update(productData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a product
 */
export async function deleteProduct(id) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}

/* --- PRODUCT RELATION HELPERS --- */

/**
 * Add colors to a product
 */
export async function addProductColors(productId, colors) {
  if (!colors || colors.length === 0) return [];
  const rows = colors.map(color => ({
    product_id: productId,
    name: color.name,
    hex_code: color.hex_code
  }));

  const { data, error } = await supabase
    .from("product_colors")
    .insert(rows)
    .select();

  if (error) throw error;
  return data;
}

/**
 * Add sizes to a product
 */
export async function addProductSizes(productId, sizes) {
  if (!sizes || sizes.length === 0) return [];
  const rows = sizes.map(size => ({
    product_id: productId,
    size_name: typeof size === "string" ? size : size.size_name
  }));

  const { data, error } = await supabase
    .from("product_sizes")
    .insert(rows)
    .select();

  if (error) throw error;
  return data;
}

/**
 * Add gallery images to a product
 */
export async function addProductImages(productId, images) {
  if (!images || images.length === 0) return [];
  const rows = images.map((img, idx) => ({
    product_id: productId,
    image_url: typeof img === "string" ? img : img.image_url,
    sort_order: typeof img === "string" ? idx : (img.sort_order || idx)
  }));

  const { data, error } = await supabase
    .from("product_images")
    .insert(rows)
    .select();

  if (error) throw error;
  return data;
}

/**
 * Clear all associated relations (images, colors, sizes) of a product
 * Useful before updating relationships to keep the sync operation simple.
 */
export async function clearProductRelations(productId) {
  const deleteColors = supabase
    .from("product_colors")
    .delete()
    .eq("product_id", productId);

  const deleteSizes = supabase
    .from("product_sizes")
    .delete()
    .eq("product_id", productId);

  const deleteImages = supabase
    .from("product_images")
    .delete()
    .eq("product_id", productId);

  const [colorsRes, sizesRes, imagesRes] = await Promise.all([
    deleteColors,
    deleteSizes,
    deleteImages
  ]);

  if (colorsRes.error) throw colorsRes.error;
  if (sizesRes.error) throw sizesRes.error;
  if (imagesRes.error) throw imagesRes.error;

  return true;
}
