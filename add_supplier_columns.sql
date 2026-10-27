-- =============================================================================
-- Migration: Add Private Supplier Details to Products Table
-- Run in Supabase SQL Editor if you have an existing products table
-- =============================================================================

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS supplier_name TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS supplier_product_code TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS supplier_product_link TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS supplier_price NUMERIC(10, 2);
