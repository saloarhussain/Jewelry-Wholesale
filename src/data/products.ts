export interface ProductTier {
  minQuantity: number;
  discountPercentage: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: "Rings" | "Necklaces" | "Earrings" | "Bracelets" | "Chains";
  shortDescription: string;
  description: string;
  priceGBP: number;
  priceUSD: number;
  suggestedRetailGBP: number;
  suggestedRetailUSD: number;
  moq: number; // Minimum order quantity per item
  gramWeight: string;
  purity: string;
  finish: string;
  dimensions: string;
  hallmarked: boolean;
  images: string[];
  stockCount: number;
  badge?: string;
  rating: number;
  reviewsCount: number;
  tierPricing: ProductTier[];
  seoKeywords: string[];
  // Private Admin & Sourcing Details (Strictly internal - never exposed in public catalog, SEO, or JSON-LD)
  supplierName?: string;
  supplierProductCode?: string;
  supplierProductLink?: string;
  supplierPrice?: number;
}

// Initial live catalog starts clean; populated dynamically from Supabase database
export const PRODUCTS: Product[] = [];

export const CATEGORIES = ["All", "Chains", "Rings", "Earrings", "Necklaces", "Bracelets"] as const;
