-- =============================================================================
-- Migration: Add Flipkart / Amazon Style Jewelry Specifications & SEO Columns
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/nrulsswncuxpybfyibgg/sql
-- =============================================================================

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS jewelry_type TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sub_type TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS gemstone_type TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stone_cut TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stone_color TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stone_count INTEGER;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS carat_weight TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS setting_type TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS clasp_type TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS chain_type TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS chain_length TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS ring_size TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS bangle_size TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS closure_type TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS bail_opening TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS earring_backing TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS metal_color TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS bullet_points JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS meta_description TEXT;
