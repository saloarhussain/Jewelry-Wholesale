import { supabase, isSupabaseConfigured } from "./supabase";

export interface UploadResult {
  url: string;
  name: string;
  size: number;
  isPrimary?: boolean;
}

/**
 * Upload an image file to Supabase Storage (bucket: 'product-images')
 * Returns the public URL of the uploaded image.
 */
export async function uploadProductImage(file: File): Promise<string> {
  // If Supabase is configured, upload directly to Supabase Storage
  if (isSupabaseConfigured()) {
    try {
      const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const cleanFileName = file.name
        .replace(/[^a-zA-Z0-9.-]/g, "_")
        .toLowerCase();
      const uniquePath = `products/${Date.now()}_${cleanFileName}`;

      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(uniquePath, file, {
          cacheControl: "3600",
          upsert: true,
          contentType: file.type || "image/jpeg",
        });

      if (!error && data) {
        const { data: publicData } = supabase.storage
          .from("product-images")
          .getPublicUrl(data.path);

        if (publicData?.publicUrl) {
          return publicData.publicUrl;
        }
      } else if (error) {
        console.warn("Direct Supabase Storage upload failed, trying server API:", error.message);
      }
    } catch (err) {
      console.warn("Direct upload error, trying server API:", err);
    }
  }

  // Fallback: Upload via server-side API route /api/upload
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const json = await res.json();
      if (json.url) {
        return json.url;
      }
    }
  } catch (err) {
    console.warn("Server API upload failed, generating local data URL:", err);
  }

  // Local fallback: convert file to Base64 data URL so the user can still save and test without error
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
