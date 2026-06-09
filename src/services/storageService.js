import { supabase } from "../app/supabase";

/**
 * Get the public URL of a file in a storage bucket
 */
export function getPublicUrl(bucket, filePath) {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Upload an image file to a specified bucket and return its public URL
 */
async function uploadImage(file, bucket) {
  const fileExt = file.name.split(".").pop();
  const randomStr = Math.random().toString(36).substring(2, 9);
  const fileName = `${Date.now()}-${randomStr}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);

  if (error) throw error;
  
  // Return the complete public URL of the uploaded image
  return getPublicUrl(bucket, data.path);
}

/**
 * Upload an image to the 'products' bucket
 */
export async function uploadProductImage(file) {
  return await uploadImage(file, "products");
}

/**
 * Upload an image to the 'categories' bucket
 */
export async function uploadCategoryImage(file) {
  return await uploadImage(file, "categories");
}

/**
 * Upload an image to the 'sliders' bucket
 */
export async function uploadSliderImage(file) {
  return await uploadImage(file, "sliders");
}

/**
 * Upload an image to the 'logos' bucket
 */
export async function uploadLogoImage(file) {
  return await uploadImage(file, "logos");
}

/**
 * Upload an image to the 'heroes' bucket
 */
export async function uploadHeroImage(file) {
  return await uploadImage(file, "heroes");
}

/**
 * Delete a file from a specified bucket
 * filePath can be the full public URL or the relative file path.
 * If a full public URL is passed, we parse the relative path from it.
 */
export async function deleteImage(bucket, filePath) {
  let relativePath = filePath;

  // If the path is a full URL, extract the relative path
  // Supabase URL format: https://[project-ref].supabase.co/storage/v1/object/public/[bucket]/[file-name]
  if (filePath.startsWith("http")) {
    const parts = filePath.split(`/public/${bucket}/`);
    if (parts.length > 1) {
      relativePath = parts[1];
    }
  }

  const { error } = await supabase.storage
    .from(bucket)
    .remove([relativePath]);

  if (error) throw error;
  return true;
}
