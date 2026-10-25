import { NextResponse } from "next/server";
import { INITIAL_ORDERS, WholesaleOrder } from "@/data/orders";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { mapOrderToRow, mapRowToOrder, isSupabaseConfigured } from "@/lib/supabase";

export async function GET() {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServerClient();
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped = data.map(mapRowToOrder);
        return NextResponse.json({
          success: true,
          source: "supabase",
          orders: mapped,
          total: mapped.length,
        });
      }
    } catch (err) {
      console.warn("Supabase orders fetch error, falling back:", err);
    }
  }

  return NextResponse.json({
    success: true,
    source: "local_queue",
    orders: INITIAL_ORDERS,
    total: INITIAL_ORDERS.length,
  });
}

export async function POST(request: Request) {
  try {
    const body: WholesaleOrder = await request.json();

    if (!body.companyName || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Company name and order items are required." },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServerClient();
      const row = mapOrderToRow(body);
      const { data, error } = await supabase.from("orders").insert([row]).select().single();

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        source: "supabase",
        message: "Wholesale order logged into Supabase factory queue.",
        order: mapRowToOrder(data),
      });
    }

    return NextResponse.json({
      success: true,
      source: "local_queue",
      message: "Wholesale order logged into factory queue.",
      order: body,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid order payload" },
      { status: 400 }
    );
  }
}
