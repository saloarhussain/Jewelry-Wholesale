-- =============================================================================
-- PART 1: TABLES & ROW LEVEL SECURITY (RLS)
-- Run this first in Supabase SQL Editor
-- =============================================================================

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sku TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  badge TEXT,
  purity TEXT NOT NULL DEFAULT 'Solid 925 Sterling Silver',
  gram_weight TEXT,
  finish TEXT,
  dimensions TEXT,
  hallmarked BOOLEAN DEFAULT true,
  price_gbp NUMERIC(10, 2) NOT NULL,
  price_usd NUMERIC(10, 2) NOT NULL,
  suggested_retail_gbp NUMERIC(10, 2) NOT NULL,
  suggested_retail_usd NUMERIC(10, 2) NOT NULL,
  moq INTEGER NOT NULL DEFAULT 1,
  stock_count INTEGER NOT NULL DEFAULT 0,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  short_description TEXT,
  description TEXT,
  rating NUMERIC(3, 2) DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  tier_pricing JSONB DEFAULT '[]'::jsonb,
  seo_keywords TEXT[] DEFAULT '{}'::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read-access for products" ON public.products;
CREATE POLICY "Allow public read-access for products"
  ON public.products FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow full access for authenticated/anon" ON public.products;
CREATE POLICY "Allow full access for authenticated/anon"
  ON public.products FOR ALL
  USING (true)
  WITH CHECK (true);

-- 2. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  user_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  company_name TEXT NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_phone TEXT,
  vat_tax_id TEXT,
  country TEXT NOT NULL,
  shipping_address JSONB NOT NULL,
  items JSONB NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GBP',
  subtotal NUMERIC(10, 2) NOT NULL,
  volume_discount NUMERIC(10, 2) DEFAULT 0,
  shipping_fee NUMERIC(10, 2) DEFAULT 0,
  tax_amount NUMERIC(10, 2) DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending Review',
  tracking_carrier TEXT,
  tracking_number TEXT,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'Paid',
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read-access for orders" ON public.orders;
CREATE POLICY "Allow public read-access for orders"
  ON public.orders FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow order creation and update" ON public.orders;
CREATE POLICY "Allow order creation and update"
  ON public.orders FOR ALL
  USING (true)
  WITH CHECK (true);

-- 3. PROFILES TABLE (Retailers & Admins)
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  company_name TEXT,
  business_type TEXT,
  vat_or_tax_id TEXT,
  country TEXT,
  city TEXT,
  role TEXT NOT NULL DEFAULT 'retailer',
  tier TEXT NOT NULL DEFAULT 'Silver Partner',
  is_approved BOOLEAN DEFAULT true,
  credit_terms_eligible BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public access for profiles" ON public.profiles;
CREATE POLICY "Allow public access for profiles"
  ON public.profiles FOR ALL
  USING (true)
  WITH CHECK (true);
