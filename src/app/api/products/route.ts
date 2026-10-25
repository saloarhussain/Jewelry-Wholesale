import { NextResponse } from "next/server";
import { PRODUCTS, Product } from "@/data/products";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { mapProductToRow, mapRowToProduct, isSupabaseConfigured } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  // Attempt to read from Supabase
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServerClient();
      let query = supabase.from("products").select("*").order("created_at", { ascending: false });

      if (category && category !== "All") {
        query = query.ilike("category", category);
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        const mapped = data.map(mapRowToProduct);
        return NextResponse.json({
          success: true,
          source: "supabase",
          count: mapped.length,
          products: mapped,
        });
      }
    } catch (err) {
      console.warn("Supabase API fetch error, using fallback:", err);
    }
  }

  // Fallback to static PRODUCTS
  let list = PRODUCTS;
  if (category && category !== "All") {
    list = PRODUCTS.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  return NextResponse.json({
    success: true,
    source: "local_catalog",
    count: list.length,
    products: list,
  });
}

export async function POST(request: Request) {
  try {
    const body: Product = await request.json();

    if (!body.name || !body.sku) {
      return NextResponse.json(
        { success: false, error: "Product name and SKU are required." },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServerClient();
      const row = mapProductToRow(body);
      const { data, error } = await supabase.from("products").insert([row]).select().single();

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        source: "supabase",
        product: mapRowToProduct(data),
      });
    }

    return NextResponse.json({
      success: true,
      source: "local_catalog",
      message: "Product saved in local session (Supabase credentials not yet provided)",
      product: body,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid product payload" },
      { status: 400 }
    );
  }
}
