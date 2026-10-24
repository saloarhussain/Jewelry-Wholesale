import { NextResponse } from "next/server";
import { INITIAL_ORDERS } from "@/data/orders";

export async function GET() {
  return NextResponse.json({
    success: true,
    orders: INITIAL_ORDERS,
    total: INITIAL_ORDERS.length,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: "Wholesale order logged into factory queue.",
      order: body,
    });
  } catch {
    return NextResponse.json({ success: false, error: "Invalid order payload" }, { status: 400 });
  }
}
