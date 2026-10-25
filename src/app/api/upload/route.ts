import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { isSupabaseConfigured } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    // Check size limit (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "File exceeds 10MB size limit" }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServerClient();

      // Ensure the 'product-images' bucket exists
      try {
        const { data: buckets } = await supabase.storage.listBuckets();
        const exists = buckets?.some((b) => b.name === "product-images");
        if (!exists) {
          await supabase.storage.createBucket("product-images", {
            public: true,
            fileSizeLimit: 10485760, // 10MB
            allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"],
          });
        }
      } catch (bucketErr) {
        console.warn("Bucket check/creation notice:", bucketErr);
      }

      const fileBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(fileBuffer);
      const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").toLowerCase();
      const filePath = `products/${Date.now()}_${cleanFileName}`;

      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(filePath, buffer, {
          contentType: file.type || `image/${fileExt}`,
          cacheControl: "3600",
          upsert: true,
        });

      if (!error && data) {
        const { data: publicData } = supabase.storage
          .from("product-images")
          .getPublicUrl(data.path);

        return NextResponse.json({
          success: true,
          url: publicData.publicUrl,
          path: data.path,
          source: "supabase-storage",
        });
      } else if (error) {
        console.error("Supabase Storage server upload error:", error);
      }
    }

    // Fallback: Return Base64 data URL
    const fileBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(fileBuffer).toString("base64");
    const mimeType = file.type || "image/jpeg";
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({
      success: true,
      url: dataUrl,
      source: "data-url-fallback",
    });
  } catch (err: any) {
    console.error("Upload route exception:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process image upload" },
      { status: 500 }
    );
  }
}
