export interface ProductTier {
  minQuantity: number;
  discountPercentage: number;
}

export type JewelryCategory =
  | "Rings"
  | "Pendants"
  | "Bracelets"
  | "Necklaces"
  | "Bangles"
  | "Earrings"
  | "Chains"
  | "Anklets";

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: JewelryCategory;
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
  // Flipkart & Amazon Style Type-Specific Specifications
  jewelryType?: string;
  subType?: string;
  gemstoneType?: string;
  stoneCut?: string;
  stoneColor?: string;
  stoneCount?: number;
  caratWeight?: string;
  settingType?: string;
  claspType?: string;
  chainType?: string;
  chainLength?: string;
  ringSize?: string;
  bangleSize?: string;
  closureType?: string;
  bailOpening?: string;
  earringBacking?: string;
  metalColor?: string;
  bulletPoints?: string[];
  metaTitle?: string;
  metaDescription?: string;
}

// Initial live catalog starts clean; populated dynamically from Supabase database
export const PRODUCTS: Product[] = [];

export const CATEGORIES = [
  "All",
  "Rings",
  "Pendants",
  "Bracelets",
  "Necklaces",
  "Bangles",
  "Earrings",
  "Chains",
  "Anklets",
] as const;
