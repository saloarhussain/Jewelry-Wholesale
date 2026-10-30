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
    supplierName: row.supplier_name || undefined,
    supplierProductCode: row.supplier_product_code || undefined,
    supplierProductLink: row.supplier_product_link || undefined,
    supplierPrice: row.supplier_price != null ? Number(row.supplier_price) : undefined,
    // Flipkart & Amazon Style Type-Specific Specifications
    jewelryType: row.jewelry_type || undefined,
    subType: row.sub_type || undefined,
    gemstoneType: row.gemstone_type || undefined,
    stoneCut: row.stone_cut || undefined,
    stoneColor: row.stone_color || undefined,
    stoneCount: row.stone_count != null ? Number(row.stone_count) : undefined,
    caratWeight: row.carat_weight || undefined,
    settingType: row.setting_type || undefined,
    claspType: row.clasp_type || undefined,
    chainType: row.chain_type || undefined,
    chainLength: row.chain_length || undefined,
    ringSize: row.ring_size || undefined,
    bangleSize: row.bangle_size || undefined,
    closureType: row.closure_type || undefined,
    bailOpening: row.bail_opening || undefined,
    earringBacking: row.earring_backing || undefined,
    metalColor: row.metal_color || undefined,
    bulletPoints: Array.isArray(row.bullet_points) ? row.bullet_points : [],
    metaTitle: row.meta_title || undefined,
    metaDescription: row.meta_description || undefined,
  };
}

// Product model to DB row converter (with all type-specific & SEO fields)
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
    supplier_name: product.supplierName || null,
    supplier_product_code: product.supplierProductCode || null,
    supplier_product_link: product.supplierProductLink || null,
    supplier_price: product.supplierPrice != null ? product.supplierPrice : null,
    // Flipkart & Amazon Type-Specific & SEO Fields
    jewelry_type: product.jewelryType || null,
    sub_type: product.subType || null,
    gemstone_type: product.gemstoneType || null,
    stone_cut: product.stoneCut || null,
    stone_color: product.stoneColor || null,
    stone_count: product.stoneCount != null ? product.stoneCount : null,
    carat_weight: product.caratWeight || null,
    setting_type: product.settingType || null,
    clasp_type: product.claspType || null,
    chain_type: product.chainType || null,
    chain_length: product.chainLength || null,
    ring_size: product.ringSize || null,
    bangle_size: product.bangleSize || null,
    closure_type: product.closureType || null,
    bail_opening: product.bailOpening || null,
    earring_backing: product.earringBacking || null,
    metal_color: product.metalColor || null,
    bullet_points: product.bulletPoints || [],
    meta_title: product.metaTitle || null,
    meta_description: product.metaDescription || null,
    updated_at: new Date().toISOString(),
  };
}

// Legacy fallback converter in case optional columns have not yet been migrated in Supabase
export function mapProductToLegacyRow(product: Product): Record<string, any> {
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
    supplier_name: product.supplierName || null,
    supplier_product_code: product.supplierProductCode || null,
    supplier_product_link: product.supplierProductLink || null,
    supplier_price: product.supplierPrice != null ? product.supplierPrice : null,
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
