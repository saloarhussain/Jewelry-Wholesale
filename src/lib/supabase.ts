import { createClient } from "@supabase/supabase-js";
import { Product, ProductTier } from "@/data/products";
import { WholesaleOrder } from "@/data/orders";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://nrulsswncuxpybfyibgg.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = (): boolean => {
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseAnonKey.length > 20);
};

// Client-side Supabase instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey || "placeholder-anon-key");

// DB row to Product model converter
export function mapRowToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    sku: row.sku,
    category: row.category,
    badge: row.badge || undefined,
    purity: row.purity || "Solid 925 Sterling Silver",
    gramWeight: row.gram_weight || "",
    finish: row.finish || "",
    dimensions: row.dimensions || "",
    hallmarked: Boolean(row.hallmarked),
    priceGBP: Number(row.price_gbp),
    priceUSD: Number(row.price_usd),
    suggestedRetailGBP: Number(row.suggested_retail_gbp),
    suggestedRetailUSD: Number(row.suggested_retail_usd),
    moq: Number(row.moq || 1),
    stockCount: Number(row.stock_count || 0),
    images: Array.isArray(row.images) ? row.images : typeof row.images === "string" ? JSON.parse(row.images) : [],
    shortDescription: row.short_description || "",
    description: row.description || "",
    rating: Number(row.rating || 5.0),
    reviewsCount: Number(row.reviews_count || 0),
    tierPricing: Array.isArray(row.tier_pricing)
      ? row.tier_pricing
      : typeof row.tier_pricing === "string"
      ? JSON.parse(row.tier_pricing)
      : [],
    seoKeywords: Array.isArray(row.seo_keywords) ? row.seo_keywords : [],
  };
}

// Product model to DB row converter
export function mapProductToRow(product: Product): Record<string, any> {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    category: product.category,
    badge: product.badge || null,
    purity: product.purity,
    gram_weight: product.gramWeight,
    finish: product.finish,
    dimensions: product.dimensions,
    hallmarked: product.hallmarked,
    price_gbp: product.priceGBP,
    price_usd: product.priceUSD,
    suggested_retail_gbp: product.suggestedRetailGBP,
    suggested_retail_usd: product.suggestedRetailUSD,
    moq: product.moq,
    stock_count: product.stockCount,
    images: product.images,
    short_description: product.shortDescription,
    description: product.description,
    rating: product.rating,
    reviews_count: product.reviewsCount,
    tier_pricing: product.tierPricing,
    seo_keywords: product.seoKeywords,
    updated_at: new Date().toISOString(),
  };
}

// Order model to DB row converter
export function mapOrderToRow(order: WholesaleOrder): Record<string, any> {
  return {
    id: order.id,
    order_number: order.orderNumber,
    created_at: order.createdAt || new Date().toISOString(),
    company_name: order.companyName,
    buyer_name: order.buyerName,
    buyer_email: order.buyerEmail,
    buyer_phone: order.buyerPhone,
    vat_tax_id: order.vatTaxId,
    country: order.country,
    shipping_address: order.shippingAddress,
    items: order.items,
    currency: order.currency,
    subtotal: order.subtotal,
    volume_discount: order.volumeDiscount,
    shipping_fee: order.shippingFee,
    tax_amount: order.taxAmount,
    total: order.total,
    status: order.status,
    tracking_carrier: order.trackingCarrier || null,
    tracking_number: order.trackingNumber || null,
    payment_method: order.paymentMethod,
    payment_status: order.paymentStatus,
    notes: order.notes || null,
  };
}

// DB row to Order model converter
export function mapRowToOrder(row: any): WholesaleOrder {
  return {
    id: row.id,
    orderNumber: row.order_number,
    createdAt: row.created_at,
    companyName: row.company_name,
    buyerName: row.buyer_name,
    buyerEmail: row.buyer_email,
    buyerPhone: row.buyer_phone,
    vatTaxId: row.vat_tax_id,
    country: row.country,
    shippingAddress: typeof row.shipping_address === "string" ? JSON.parse(row.shipping_address) : row.shipping_address,
    items: typeof row.items === "string" ? JSON.parse(row.items) : row.items || [],
    currency: row.currency,
    subtotal: Number(row.subtotal),
    volumeDiscount: Number(row.volume_discount || 0),
    shippingFee: Number(row.shipping_fee || 0),
    taxAmount: Number(row.tax_amount || 0),
    total: Number(row.total),
    status: row.status,
    trackingCarrier: row.tracking_carrier || undefined,
    trackingNumber: row.tracking_number || undefined,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    notes: row.notes || undefined,
  };
}
