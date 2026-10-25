-- =============================================================================
-- Argent & Co. Wholesale Jewelry - Complete Supabase Schema & Seed Script
-- Project: Jewelry Wholesale (nrulsswncuxpybfyibgg)
-- Run this script in: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. PRODUCTS TABLE
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 2. ORDERS TABLE
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 3. PROFILES TABLE (Retailers & Admins)
-- -----------------------------------------------------------------------------
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

-- -----------------------------------------------------------------------------
-- 4. SEED PRODUCTS
-- -----------------------------------------------------------------------------
INSERT INTO public.products (
  id, name, slug, sku, category, badge, purity, gram_weight, finish, dimensions, hallmarked,
  price_gbp, price_usd, suggested_retail_gbp, suggested_retail_usd, moq, stock_count,
  images, short_description, description, rating, reviews_count, tier_pricing, seo_keywords
) VALUES (
  'slv-001',
  'Solid 925 Sterling Silver Liquid Herringbone Snake Chain (3.5mm)',
  'solid-925-sterling-silver-liquid-herringbone-chain',
  'AG-NECK-001',
  'Chains',
  'Bestseller',
  'Solid 925 Sterling Silver',
  '11.4g',
  'Diamond-Cut Mirror Polish & Rhodium Barrier',
  'Length: 45cm (18 in) + 5cm extension | Width: 3.5mm',
  true,
  14.5,
  18.85,
  48,
  62,
  3,
  640,
  '["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1611591475155-42e5232d3925?auto=format&fit=crop&w=900&q=80"]'::jsonb,
  'Ultra-fluid liquid silk drape. Crafted in solid 925 silver with mirror rhodium anti-tarnish protective plating.',
  'A top-performing wholesale bestseller across UK and US retail boutiques. Meticulously engineered from certified solid 925 sterling silver, each flat link is diamond-cut and micro-polished for a liquid-metal shine that sits flat against the collarbone. Features a reinforced lobster claw clasp stamped with the authentic ''925'' purity hallmark. Completely nickel-free, hypoallergenic, and coated with our proprietary micro-rhodium barrier for 10x tarnish resistance.',
  4.95,
  88,
  '[{"minQuantity":3,"discountPercentage":0},{"minQuantity":15,"discountPercentage":8},{"minQuantity":50,"discountPercentage":15},{"minQuantity":100,"discountPercentage":22}]'::jsonb,
  ARRAY['wholesale silver herringbone chain','925 sterling silver flat snake necklace bulk','wholesale silver chains UK','sterling silver chain supplier USA']::text[]
) ON CONFLICT (id) DO UPDATE SET
  stock_count = EXCLUDED.stock_count,
  price_gbp = EXCLUDED.price_gbp,
  price_usd = EXCLUDED.price_usd,
  updated_at = NOW();

INSERT INTO public.products (
  id, name, slug, sku, category, badge, purity, gram_weight, finish, dimensions, hallmarked,
  price_gbp, price_usd, suggested_retail_gbp, suggested_retail_usd, moq, stock_count,
  images, short_description, description, rating, reviews_count, tier_pricing, seo_keywords
) VALUES (
  'slv-002',
  'Sculptural Bold Dome Statement Ring (Solid 925 Silver)',
  'sculptural-bold-dome-statement-ring-solid-925',
  'AG-RING-002',
  'Rings',
  'High Margin',
  'Solid 925 Sterling Silver',
  '8.6g',
  'High-Gloss Platinum Dip (Anti-Tarnish)',
  'Band Width: 12mm tapering to 4mm base',
  true,
  11.2,
  14.5,
  39,
  49,
  5,
  420,
  '["https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80"]'::jsonb,
  'Ergonomically contoured solid silver dome with a heavy luxury hand feel and seamless comfort-fit interior.',
  'Designed for independent fashion retailers and high-end jewelry stores seeking high margin contemporary staples. Cast in solid 925 sterling silver with a substantial weight that customers feel instantly upon unboxing. Available in wholesale assorted size bundles (US sizes 6, 7, 8 / UK sizes L, N, P). Hallmarked according to UK Assay regulations and fully compliant with US FTC precious metals standards.',
  4.9,
  64,
  '[{"minQuantity":5,"discountPercentage":0},{"minQuantity":20,"discountPercentage":10},{"minQuantity":50,"discountPercentage":18}]'::jsonb,
  ARRAY['wholesale chunky silver dome ring','solid 925 statement rings bulk','silver rings wholesale UK minimum order','boutique silver jewelry suppliers USA']::text[]
) ON CONFLICT (id) DO UPDATE SET
  stock_count = EXCLUDED.stock_count,
  price_gbp = EXCLUDED.price_gbp,
  price_usd = EXCLUDED.price_usd,
  updated_at = NOW();

INSERT INTO public.products (
  id, name, slug, sku, category, badge, purity, gram_weight, finish, dimensions, hallmarked,
  price_gbp, price_usd, suggested_retail_gbp, suggested_retail_usd, moq, stock_count,
  images, short_description, description, rating, reviews_count, tier_pricing, seo_keywords
) VALUES (
  'slv-003',
  'Classic Pavé Huggie Hoops with AAA Zirconia (Solid 925)',
  'classic-pave-huggie-hoops-aaa-zirconia-925',
  'AG-EAR-003',
  'Earrings',
  'Essential',
  'Solid 925 Sterling Silver',
  '3.2g pair',
  'Bright White Rhodium Electroplate',
  'Outer Diameter: 13mm | Inner Diameter: 9.5mm | Width: 2mm',
  true,
  7.8,
  10.15,
  28,
  36,
  5,
  890,
  '["https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80"]'::jsonb,
  'Everyday staple huggie earrings with brilliant cut micropavé cubic zirconia and secure snap-lock closure.',
  'The ultimate repeat-purchase essential for jewelry boutiques and piercing bars. Crafted with precision snap-hinge clickers tested for over 5,000 cycles. Set with 24 pavé faceted AAA hand-selected cubic zirconia stones that match natural VS diamonds in fire and dispersion. Solid sterling silver posts protect sensitive ears.',
  4.98,
  112,
  '[{"minQuantity":5,"discountPercentage":0},{"minQuantity":25,"discountPercentage":12},{"minQuantity":100,"discountPercentage":20}]'::jsonb,
  ARRAY['wholesale sterling silver huggie earrings','925 silver pave hoop earrings bulk','wholesale jewelry suppliers UK','earrings wholesale USA minimum 100']::text[]
) ON CONFLICT (id) DO UPDATE SET
  stock_count = EXCLUDED.stock_count,
  price_gbp = EXCLUDED.price_gbp,
  price_usd = EXCLUDED.price_usd,
  updated_at = NOW();

INSERT INTO public.products (
  id, name, slug, sku, category, badge, purity, gram_weight, finish, dimensions, hallmarked,
  price_gbp, price_usd, suggested_retail_gbp, suggested_retail_usd, moq, stock_count,
  images, short_description, description, rating, reviews_count, tier_pricing, seo_keywords
) VALUES (
  'slv-004',
  'Baroque Freshwater Pearl Pendant on Figaro Chain (925 Silver)',
  'baroque-freshwater-pearl-pendant-figaro-chain-925',
  'AG-NECK-004',
  'Necklaces',
  'Luxury Line',
  'Solid 925 Sterling Silver & Genuine Pearl',
  '7.8g',
  'Mirror Polish with Protective E-Coat',
  'Pearl Size: 12-14mm natural irregular | Chain: 42cm + 5cm',
  true,
  16.9,
  21.9,
  58,
  75,
  3,
  310,
  '["https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80"]'::jsonb,
  'Genuine Grade-AA organic baroque freshwater pearl suspended on an Italian 925 silver figaro chain.',
  'Capturing the modern luxury organic pearl trend. Each genuine cultured freshwater baroque pearl displays unique natural orient and luster, hand-mounted on a cast 925 sterling silver bail. Paired with a delicate 1.8mm Italian Figaro link chain with spring ring lock. High perceived retail value with proven 3.5x to 4x markup in UK and US boutiques.',
  4.92,
  47,
  '[{"minQuantity":3,"discountPercentage":0},{"minQuantity":15,"discountPercentage":7},{"minQuantity":40,"discountPercentage":15}]'::jsonb,
  ARRAY['wholesale pearl necklace silver 925','baroque pearl pendant bulk supplier','wholesale jewelry UK London','fine silver jewelry wholesale USA']::text[]
) ON CONFLICT (id) DO UPDATE SET
  stock_count = EXCLUDED.stock_count,
  price_gbp = EXCLUDED.price_gbp,
  price_usd = EXCLUDED.price_usd,
  updated_at = NOW();

INSERT INTO public.products (
  id, name, slug, sku, category, badge, purity, gram_weight, finish, dimensions, hallmarked,
  price_gbp, price_usd, suggested_retail_gbp, suggested_retail_usd, moq, stock_count,
  images, short_description, description, rating, reviews_count, tier_pricing, seo_keywords
) VALUES (
  'slv-005',
  'Heavy Heavyweight Ribbed Torque Cuff Bangle (26g Solid 925)',
  'heavy-ribbed-torque-cuff-bangle-solid-925',
  'AG-BRAC-005',
  'Bracelets',
  'Assay Hallmarked',
  'Solid 925 Sterling Silver',
  '26.2g',
  'Fine Satin and High Polish Contrasting Ribs',
  'Width: 10mm | Inner Diameter: 62mm (Adjustable)',
  true,
  36.5,
  47.45,
  125,
  160,
  2,
  195,
  '["https://images.unsplash.com/photo-1611591475155-42e5232d3925?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80"]'::jsonb,
  'Substantial 26-gram architectural torque cuff with ribbed linear fluting and open adjustable fit.',
  'A prestigious statement item that anchors retail display cases. Hand-finished in heavyweight 925 sterling silver, this cuff features precision linear ridges inspired by neoclassical art. Slightly flexible open cuff design fits wrist sizes from 15cm to 19cm comfortably. Verified full UK Assay Office Hallmarked hallmark on inner band (Sponsor Mark, 925, Millesimal fineness mark).',
  4.97,
  39,
  '[{"minQuantity":2,"discountPercentage":0},{"minQuantity":10,"discountPercentage":10},{"minQuantity":25,"discountPercentage":18}]'::jsonb,
  ARRAY['wholesale silver cuff bangle heavy 925','solid silver torque bracelet bulk UK','luxury silver bracelets wholesale','hallmarked 925 silver jewelry distributor']::text[]
) ON CONFLICT (id) DO UPDATE SET
  stock_count = EXCLUDED.stock_count,
  price_gbp = EXCLUDED.price_gbp,
  price_usd = EXCLUDED.price_usd,
  updated_at = NOW();

INSERT INTO public.products (
  id, name, slug, sku, category, badge, purity, gram_weight, finish, dimensions, hallmarked,
  price_gbp, price_usd, suggested_retail_gbp, suggested_retail_usd, moq, stock_count,
  images, short_description, description, rating, reviews_count, tier_pricing, seo_keywords
) VALUES (
  'slv-006',
  'Emerald-Cut Green Agate Signet Ring (Solid 925 Silver)',
  'emerald-cut-green-agate-signet-ring-solid-925',
  'AG-RING-006',
  'Rings',
  'Trending',
  'Solid 925 Sterling Silver & Natural Agate',
  '9.2g',
  'Heavy Rhodium Anti-Scratch Treatment',
  'Face: 12mm x 10mm | Band: 5mm tapered',
  true,
  13.8,
  17.9,
  48,
  60,
  4,
  280,
  '["https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80"]'::jsonb,
  'Deep forest-green emerald cut natural agate stone bezel-set in a tapered heavy solid silver signet.',
  'Unisex contemporary signet ring engineered for modern boutique clientele. Set with bezel-encased natural green agate polished to an unblemished glassy cabochon table. Solid underside with comfort beveling. Perfect cross-gender appeal for both men''s and women''s jewelry collections.',
  4.88,
  31,
  '[{"minQuantity":4,"discountPercentage":0},{"minQuantity":16,"discountPercentage":8},{"minQuantity":40,"discountPercentage":16}]'::jsonb,
  ARRAY['wholesale silver gemstone signet rings','green agate ring 925 silver bulk','mens silver jewelry wholesale UK','unisex silver rings wholesale USA']::text[]
) ON CONFLICT (id) DO UPDATE SET
  stock_count = EXCLUDED.stock_count,
  price_gbp = EXCLUDED.price_gbp,
  price_usd = EXCLUDED.price_usd,
  updated_at = NOW();

INSERT INTO public.products (
  id, name, slug, sku, category, badge, purity, gram_weight, finish, dimensions, hallmarked,
  price_gbp, price_usd, suggested_retail_gbp, suggested_retail_usd, moq, stock_count,
  images, short_description, description, rating, reviews_count, tier_pricing, seo_keywords
) VALUES (
  'slv-007',
  'Shimmering Tennis Bracelet (3mm AAA Zirconia, Solid 925)',
  'shimmering-tennis-bracelet-3mm-aaa-zirconia-925',
  'AG-BRAC-007',
  'Bracelets',
  'Top Seller',
  'Solid 925 Sterling Silver',
  '10.5g',
  'Triple Platinum/Rhodium Immersion',
  'Length: 17.5cm (7 in) standard | Width: 3mm',
  true,
  18.5,
  23.95,
  65,
  85,
  3,
  520,
  '["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1611591475155-42e5232d3925?auto=format&fit=crop&w=900&q=80"]'::jsonb,
  'Four-prong hand-set tennis bracelet with double safety latch box clasp and fluid articulated links.',
  'Consistently in the top 3 best-selling SKUs for holiday, bridal, and everyday luxury gift assortments. Individually prong-set with 48 round brilliant cut stones. Articulated flexibility guarantees no catching or kinking on clothing. Features a heavy-duty concealed box clasp with dual side figure-eight safety clasps.',
  4.96,
  94,
  '[{"minQuantity":3,"discountPercentage":0},{"minQuantity":15,"discountPercentage":10},{"minQuantity":50,"discountPercentage":20}]'::jsonb,
  ARRAY['wholesale silver tennis bracelet','925 sterling silver tennis bracelets bulk','cheap wholesale silver jewelry UK','high quality silver jewelry wholesale USA']::text[]
) ON CONFLICT (id) DO UPDATE SET
  stock_count = EXCLUDED.stock_count,
  price_gbp = EXCLUDED.price_gbp,
  price_usd = EXCLUDED.price_usd,
  updated_at = NOW();

INSERT INTO public.products (
  id, name, slug, sku, category, badge, purity, gram_weight, finish, dimensions, hallmarked,
  price_gbp, price_usd, suggested_retail_gbp, suggested_retail_usd, moq, stock_count,
  images, short_description, description, rating, reviews_count, tier_pricing, seo_keywords
) VALUES (
  'slv-008',
  'Diamond-Cut Italian Curb Chain (5mm Solid 925 Silver)',
  'diamond-cut-italian-curb-chain-5mm-925',
  'AG-NECK-008',
  'Chains',
  'Classic',
  'Solid 925 Sterling Silver',
  '16.8g',
  'Mirror Diamond-Cut Polish',
  'Length: 50cm (20 in) | Width: 5mm',
  true,
  22,
  28.6,
  75,
  98,
  3,
  380,
  '["https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=80","https://images.unsplash.com/photo-1611591475155-42e5232d3925?auto=format&fit=crop&w=900&q=80"]'::jsonb,
  'Heavy-duty bevelled diamond-cut curb links made on vintage Italian looms with solid lobster clasp.',
  'A fundamental chain that sells year-round across both men''s and women''s collections. Each curb link features four diamond-cut beveled facets that catch light at every movement. Made from virgin 925 sterling silver grain, never scrap or reclaimed alloy, ensuring uniform tensile strength and zero brittleness.',
  4.94,
  73,
  '[{"minQuantity":3,"discountPercentage":0},{"minQuantity":12,"discountPercentage":8},{"minQuantity":30,"discountPercentage":15}]'::jsonb,
  ARRAY['wholesale italian silver curb chain','solid 925 curb necklace bulk supplier','mens curb chain wholesale UK','sterling silver chain wholesale factory']::text[]
) ON CONFLICT (id) DO UPDATE SET
  stock_count = EXCLUDED.stock_count,
  price_gbp = EXCLUDED.price_gbp,
  price_usd = EXCLUDED.price_usd,
  updated_at = NOW();

-- -----------------------------------------------------------------------------
-- 5. SEED INITIAL ORDERS
-- -----------------------------------------------------------------------------
INSERT INTO public.orders (
  id, order_number, created_at, company_name, buyer_name, buyer_email, buyer_phone,
  vat_tax_id, country, shipping_address, items, currency, subtotal, volume_discount,
  shipping_fee, tax_amount, total, status, tracking_carrier, tracking_number,
  payment_method, payment_status, notes
) VALUES (
  'ord-901',
  'ARG-UK-8821',
  '2026-10-22T09:30:00Z',
  'Kensington Fine Jewels Ltd',
  'Victoria Sterling',
  'orders@kensingtonjewels.co.uk',
  '+44 20 7946 0912',
  'GB 928 411 902',
  'UK',
  '{"line1":"42 Bond Street, Suite 3B","city":"London","stateOrCounty":"Greater London","postalCode":"W1S 2AA","countryName":"United Kingdom"}'::jsonb,
  '[{"productId":"slv-001","name":"Solid 925 Sterling Silver Liquid Herringbone Snake Chain (3.5mm)","sku":"AG-NECK-001","quantity":20,"unitPrice":13.34,"lineTotal":266.8,"image":"https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80"},{"productId":"slv-002","name":"Sculptural Bold Dome Statement Ring (Solid 925 Silver)","sku":"AG-RING-002","quantity":15,"unitPrice":11.2,"lineTotal":168,"image":"https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=300&q=80"}]'::jsonb,
  'GBP',
  434.8,
  21.74,
  0,
  82.61,
  495.67,
  'Dispatched',
  'Royal Mail Special Delivery Guaranteed by 1pm',
  'RM772910384GB',
  'Bank Wire Transfer (BACS/ACH)',
  'Paid',
  'Assay Office batch certificates enclosed inside package.'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.orders (
  id, order_number, created_at, company_name, buyer_name, buyer_email, buyer_phone,
  vat_tax_id, country, shipping_address, items, currency, subtotal, volume_discount,
  shipping_fee, tax_amount, total, status, tracking_carrier, tracking_number,
  payment_method, payment_status, notes
) VALUES (
  'ord-902',
  'ARG-USA-4190',
  '2026-10-23T15:10:00Z',
  'SoHo Mineral & Silver Co.',
  'Marcus Vance',
  'buyer@sohomineral.com',
  '+1 (212) 555-0188',
  'EIN 13-9827101',
  'USA',
  '{"line1":"548 Broadway, Floor 4","city":"New York","stateOrCounty":"NY","postalCode":"10012","countryName":"United States"}'::jsonb,
  '[{"productId":"slv-005","name":"Heavy Heavyweight Ribbed Torque Cuff Bangle (26g Solid 925)","sku":"AG-BRAC-005","quantity":10,"unitPrice":42.7,"lineTotal":427,"image":"https://images.unsplash.com/photo-1611591475155-42e5232d3925?auto=format&fit=crop&w=300&q=80"},{"productId":"slv-007","name":"Shimmering Tennis Bracelet (3mm AAA Zirconia, Solid 925)","sku":"AG-BRAC-007","quantity":15,"unitPrice":21.55,"lineTotal":323.25,"image":"https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=300&q=80"}]'::jsonb,
  'USD',
  750.25,
  75.03,
  0,
  0,
  675.22,
  'Assay Hallmarking',
  'FedEx International Priority DDP',
  'FX-8840291772',
  'Credit/Debit Card',
  'Paid',
  'Shipped DDP with US Customs clearance prepaid.'
) ON CONFLICT (id) DO NOTHING;

