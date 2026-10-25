import { NextResponse } from "next/server";
import { PRODUCTS, Product } from "@/data/products";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { mapProductToRow, mapRowToProduct, isSupabaseConfigured } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServerClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .or(`id.eq.${id},slug.eq.${id}`)
        .single();

      if (!error && data) {
        return NextResponse.json({
          success: true,
          source: "supabase",
          product: mapRowToProduct(data),
        });
      }
    } catch (err) {
      console.warn("Supabase single product fetch error:", err);
    }
  }

  const found = PRODUCTS.find((p) => p.id === id || p.slug === id);
  if (found) {
    return NextResponse.json({
      success: true,
      source: "local_catalog",
      product: found,
    });
  }

  return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body: Partial<Product> = await request.json();

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServerClient();
      const updateData: Record<string, any> = { updated_at: new Date().toISOString() };

      if (body.name !== undefined) updateData.name = body.name;
      if (body.sku !== undefined) updateData.sku = body.sku;
      if (body.category !== undefined) updateData.category = body.category;
      if (body.badge !== undefined) updateData.badge = body.badge;
      if (body.purity !== undefined) updateData.purity = body.purity;
      if (body.gramWeight !== undefined) updateData.gram_weight = body.gramWeight;
      if (body.finish !== undefined) updateData.finish = body.finish;
      if (body.dimensions !== undefined) updateData.dimensions = body.dimensions;
      if (body.hallmarked !== undefined) updateData.hallmarked = body.hallmarked;
      if (body.priceGBP !== undefined) updateData.price_gbp = body.priceGBP;
      if (body.priceUSD !== undefined) updateData.price_usd = body.priceUSD;
      if (body.suggestedRetailGBP !== undefined) updateData.suggested_retail_gbp = body.suggestedRetailGBP;
      if (body.suggestedRetailUSD !== undefined) updateData.suggested_retail_usd = body.suggestedRetailUSD;
      if (body.moq !== undefined) updateData.moq = body.moq;
      if (body.stockCount !== undefined) updateData.stock_count = body.stockCount;
      if (body.images !== undefined) updateData.images = body.images;
      if (body.shortDescription !== undefined) updateData.short_description = body.shortDescription;
      if (body.description !== undefined) updateData.description = body.description;
      if (body.tierPricing !== undefined) updateData.tier_pricing = body.tierPricing;
      if (body.seoKeywords !== undefined) updateData.seo_keywords = body.seoKeywords;

      const { data, error } = await supabase
        .from("products")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        source: "supabase",
        product: mapRowToProduct(data),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Product updated in session",
      product: { id, ...body },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid update payload" }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServerClient();
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
      return NextResponse.json({ success: true, message: "Product deleted from Supabase" });
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true, message: "Product removed from local session" });
}
