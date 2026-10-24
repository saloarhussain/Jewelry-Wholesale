import { NextResponse } from "next/server";
import { PRODUCTS } from "@/data/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  if (category && category !== "All") {
    const filtered = PRODUCTS.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    return NextResponse.json({ success: true, count: filtered.length, products: filtered });
  }

  return NextResponse.json({
    success: true,
    count: PRODUCTS.length,
    products: PRODUCTS,
  });
}
