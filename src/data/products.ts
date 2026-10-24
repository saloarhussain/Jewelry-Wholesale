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
}

export const PRODUCTS: Product[] = [
  {
    id: "slv-001",
    name: "Solid 925 Sterling Silver Liquid Herringbone Snake Chain (3.5mm)",
    slug: "solid-925-sterling-silver-liquid-herringbone-chain",
    sku: "AG-NECK-001",
    category: "Chains",
    shortDescription: "Ultra-fluid liquid silk drape. Crafted in solid 925 silver with mirror rhodium anti-tarnish protective plating.",
    description: "A top-performing wholesale bestseller across UK and US retail boutiques. Meticulously engineered from certified solid 925 sterling silver, each flat link is diamond-cut and micro-polished for a liquid-metal shine that sits flat against the collarbone. Features a reinforced lobster claw clasp stamped with the authentic '925' purity hallmark. Completely nickel-free, hypoallergenic, and coated with our proprietary micro-rhodium barrier for 10x tarnish resistance.",
    priceGBP: 14.50,
    priceUSD: 18.85,
    suggestedRetailGBP: 48.00,
    suggestedRetailUSD: 62.00,
    moq: 3,
    gramWeight: "11.4g",
    purity: "Solid 925 Sterling Silver",
    finish: "Diamond-Cut Mirror Polish & Rhodium Barrier",
    dimensions: "Length: 45cm (18 in) + 5cm extension | Width: 3.5mm",
    hallmarked: true,
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1611591475155-42e5232d3925?auto=format&fit=crop&w=900&q=80"
    ],
    stockCount: 640,
    badge: "Bestseller",
    rating: 4.95,
    reviewsCount: 88,
    tierPricing: [
      { minQuantity: 3, discountPercentage: 0 },
      { minQuantity: 15, discountPercentage: 8 },
      { minQuantity: 50, discountPercentage: 15 },
      { minQuantity: 100, discountPercentage: 22 }
    ],
    seoKeywords: [
      "wholesale silver herringbone chain",
      "925 sterling silver flat snake necklace bulk",
      "wholesale silver chains UK",
      "sterling silver chain supplier USA"
    ]
  },
  {
    id: "slv-002",
    name: "Sculptural Bold Dome Statement Ring (Solid 925 Silver)",
    slug: "sculptural-bold-dome-statement-ring-solid-925",
    sku: "AG-RING-002",
    category: "Rings",
    shortDescription: "Ergonomically contoured solid silver dome with a heavy luxury hand feel and seamless comfort-fit interior.",
    description: "Designed for independent fashion retailers and high-end jewelry stores seeking high margin contemporary staples. Cast in solid 925 sterling silver with a substantial weight that customers feel instantly upon unboxing. Available in wholesale assorted size bundles (US sizes 6, 7, 8 / UK sizes L, N, P). Hallmarked according to UK Assay regulations and fully compliant with US FTC precious metals standards.",
    priceGBP: 11.20,
    priceUSD: 14.50,
    suggestedRetailGBP: 39.00,
    suggestedRetailUSD: 49.00,
    moq: 5,
    gramWeight: "8.6g",
    purity: "Solid 925 Sterling Silver",
    finish: "High-Gloss Platinum Dip (Anti-Tarnish)",
    dimensions: "Band Width: 12mm tapering to 4mm base",
    hallmarked: true,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80"
    ],
    stockCount: 420,
    badge: "High Margin",
    rating: 4.9,
    reviewsCount: 64,
    tierPricing: [
      { minQuantity: 5, discountPercentage: 0 },
      { minQuantity: 20, discountPercentage: 10 },
      { minQuantity: 50, discountPercentage: 18 }
    ],
    seoKeywords: [
      "wholesale chunky silver dome ring",
      "solid 925 statement rings bulk",
      "silver rings wholesale UK minimum order",
      "boutique silver jewelry suppliers USA"
    ]
  },
  {
    id: "slv-003",
    name: "Classic Pavé Huggie Hoops with AAA Zirconia (Solid 925)",
    slug: "classic-pave-huggie-hoops-aaa-zirconia-925",
    sku: "AG-EAR-003",
    category: "Earrings",
    shortDescription: "Everyday staple huggie earrings with brilliant cut micropavé cubic zirconia and secure snap-lock closure.",
    description: "The ultimate repeat-purchase essential for jewelry boutiques and piercing bars. Crafted with precision snap-hinge clickers tested for over 5,000 cycles. Set with 24 pavé faceted AAA hand-selected cubic zirconia stones that match natural VS diamonds in fire and dispersion. Solid sterling silver posts protect sensitive ears.",
    priceGBP: 7.80,
    priceUSD: 10.15,
    suggestedRetailGBP: 28.00,
    suggestedRetailUSD: 36.00,
    moq: 5,
    gramWeight: "3.2g pair",
    purity: "Solid 925 Sterling Silver",
    finish: "Bright White Rhodium Electroplate",
    dimensions: "Outer Diameter: 13mm | Inner Diameter: 9.5mm | Width: 2mm",
    hallmarked: true,
    images: [
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80"
    ],
    stockCount: 890,
    badge: "Essential",
    rating: 4.98,
    reviewsCount: 112,
    tierPricing: [
      { minQuantity: 5, discountPercentage: 0 },
      { minQuantity: 25, discountPercentage: 12 },
      { minQuantity: 100, discountPercentage: 20 }
    ],
    seoKeywords: [
      "wholesale sterling silver huggie earrings",
      "925 silver pave hoop earrings bulk",
      "wholesale jewelry suppliers UK",
      "earrings wholesale USA minimum 100"
    ]
  },
  {
    id: "slv-004",
    name: "Baroque Freshwater Pearl Pendant on Figaro Chain (925 Silver)",
    slug: "baroque-freshwater-pearl-pendant-figaro-chain-925",
    sku: "AG-NECK-004",
    category: "Necklaces",
    shortDescription: "Genuine Grade-AA organic baroque freshwater pearl suspended on an Italian 925 silver figaro chain.",
    description: "Capturing the modern luxury organic pearl trend. Each genuine cultured freshwater baroque pearl displays unique natural orient and luster, hand-mounted on a cast 925 sterling silver bail. Paired with a delicate 1.8mm Italian Figaro link chain with spring ring lock. High perceived retail value with proven 3.5x to 4x markup in UK and US boutiques.",
    priceGBP: 16.90,
    priceUSD: 21.90,
    suggestedRetailGBP: 58.00,
    suggestedRetailUSD: 75.00,
    moq: 3,
    gramWeight: "7.8g",
    purity: "Solid 925 Sterling Silver & Genuine Pearl",
    finish: "Mirror Polish with Protective E-Coat",
    dimensions: "Pearl Size: 12-14mm natural irregular | Chain: 42cm + 5cm",
    hallmarked: true,
    images: [
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80"
    ],
    stockCount: 310,
    badge: "Luxury Line",
    rating: 4.92,
    reviewsCount: 47,
    tierPricing: [
      { minQuantity: 3, discountPercentage: 0 },
      { minQuantity: 15, discountPercentage: 7 },
      { minQuantity: 40, discountPercentage: 15 }
    ],
    seoKeywords: [
      "wholesale pearl necklace silver 925",
      "baroque pearl pendant bulk supplier",
      "wholesale jewelry UK London",
      "fine silver jewelry wholesale USA"
    ]
  },
  {
    id: "slv-005",
    name: "Heavy Heavyweight Ribbed Torque Cuff Bangle (26g Solid 925)",
    slug: "heavy-ribbed-torque-cuff-bangle-solid-925",
    sku: "AG-BRAC-005",
    category: "Bracelets",
    shortDescription: "Substantial 26-gram architectural torque cuff with ribbed linear fluting and open adjustable fit.",
    description: "A prestigious statement item that anchors retail display cases. Hand-finished in heavyweight 925 sterling silver, this cuff features precision linear ridges inspired by neoclassical art. Slightly flexible open cuff design fits wrist sizes from 15cm to 19cm comfortably. Verified full UK Assay Office Hallmarked hallmark on inner band (Sponsor Mark, 925, Millesimal fineness mark).",
    priceGBP: 36.50,
    priceUSD: 47.45,
    suggestedRetailGBP: 125.00,
    suggestedRetailUSD: 160.00,
    moq: 2,
    gramWeight: "26.2g",
    purity: "Solid 925 Sterling Silver",
    finish: "Fine Satin and High Polish Contrasting Ribs",
    dimensions: "Width: 10mm | Inner Diameter: 62mm (Adjustable)",
    hallmarked: true,
    images: [
      "https://images.unsplash.com/photo-1611591475155-42e5232d3925?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80"
    ],
    stockCount: 195,
    badge: "Assay Hallmarked",
    rating: 4.97,
    reviewsCount: 39,
    tierPricing: [
      { minQuantity: 2, discountPercentage: 0 },
      { minQuantity: 10, discountPercentage: 10 },
      { minQuantity: 25, discountPercentage: 18 }
    ],
    seoKeywords: [
      "wholesale silver cuff bangle heavy 925",
      "solid silver torque bracelet bulk UK",
      "luxury silver bracelets wholesale",
      "hallmarked 925 silver jewelry distributor"
    ]
  },
  {
    id: "slv-006",
    name: "Emerald-Cut Green Agate Signet Ring (Solid 925 Silver)",
    slug: "emerald-cut-green-agate-signet-ring-solid-925",
    sku: "AG-RING-006",
    category: "Rings",
    shortDescription: "Deep forest-green emerald cut natural agate stone bezel-set in a tapered heavy solid silver signet.",
    description: "Unisex contemporary signet ring engineered for modern boutique clientele. Set with bezel-encased natural green agate polished to an unblemished glassy cabochon table. Solid underside with comfort beveling. Perfect cross-gender appeal for both men's and women's jewelry collections.",
    priceGBP: 13.80,
    priceUSD: 17.90,
    suggestedRetailGBP: 48.00,
    suggestedRetailUSD: 60.00,
    moq: 4,
    gramWeight: "9.2g",
    purity: "Solid 925 Sterling Silver & Natural Agate",
    finish: "Heavy Rhodium Anti-Scratch Treatment",
    dimensions: "Face: 12mm x 10mm | Band: 5mm tapered",
    hallmarked: true,
    images: [
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80"
    ],
    stockCount: 280,
    badge: "Trending",
    rating: 4.88,
    reviewsCount: 31,
    tierPricing: [
      { minQuantity: 4, discountPercentage: 0 },
      { minQuantity: 16, discountPercentage: 8 },
      { minQuantity: 40, discountPercentage: 16 }
    ],
    seoKeywords: [
      "wholesale silver gemstone signet rings",
      "green agate ring 925 silver bulk",
      "mens silver jewelry wholesale UK",
      "unisex silver rings wholesale USA"
    ]
  },
  {
    id: "slv-007",
    name: "Shimmering Tennis Bracelet (3mm AAA Zirconia, Solid 925)",
    slug: "shimmering-tennis-bracelet-3mm-aaa-zirconia-925",
    sku: "AG-BRAC-007",
    category: "Bracelets",
    shortDescription: "Four-prong hand-set tennis bracelet with double safety latch box clasp and fluid articulated links.",
    description: "Consistently in the top 3 best-selling SKUs for holiday, bridal, and everyday luxury gift assortments. Individually prong-set with 48 round brilliant cut stones. Articulated flexibility guarantees no catching or kinking on clothing. Features a heavy-duty concealed box clasp with dual side figure-eight safety clasps.",
    priceGBP: 18.50,
    priceUSD: 23.95,
    suggestedRetailGBP: 65.00,
    suggestedRetailUSD: 85.00,
    moq: 3,
    gramWeight: "10.5g",
    purity: "Solid 925 Sterling Silver",
    finish: "Triple Platinum/Rhodium Immersion",
    dimensions: "Length: 17.5cm (7 in) standard | Width: 3mm",
    hallmarked: true,
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1611591475155-42e5232d3925?auto=format&fit=crop&w=900&q=80"
    ],
    stockCount: 520,
    badge: "Top Seller",
    rating: 4.96,
    reviewsCount: 94,
    tierPricing: [
      { minQuantity: 3, discountPercentage: 0 },
      { minQuantity: 15, discountPercentage: 10 },
      { minQuantity: 50, discountPercentage: 20 }
    ],
    seoKeywords: [
      "wholesale silver tennis bracelet",
      "925 sterling silver tennis bracelets bulk",
      "cheap wholesale silver jewelry UK",
      "high quality silver jewelry wholesale USA"
    ]
  },
  {
    id: "slv-008",
    name: "Diamond-Cut Italian Curb Chain (5mm Solid 925 Silver)",
    slug: "diamond-cut-italian-curb-chain-5mm-925",
    sku: "AG-NECK-008",
    category: "Chains",
    shortDescription: "Heavy-duty bevelled diamond-cut curb links made on vintage Italian looms with solid lobster clasp.",
    description: "A fundamental chain that sells year-round across both men's and women's collections. Each curb link features four diamond-cut beveled facets that catch light at every movement. Made from virgin 925 sterling silver grain, never scrap or reclaimed alloy, ensuring uniform tensile strength and zero brittleness.",
    priceGBP: 22.00,
    priceUSD: 28.60,
    suggestedRetailGBP: 75.00,
    suggestedRetailUSD: 98.00,
    moq: 3,
    gramWeight: "16.8g",
    purity: "Solid 925 Sterling Silver",
    finish: "Mirror Diamond-Cut Polish",
    dimensions: "Length: 50cm (20 in) | Width: 5mm",
    hallmarked: true,
    images: [
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1611591475155-42e5232d3925?auto=format&fit=crop&w=900&q=80"
    ],
    stockCount: 380,
    badge: "Classic",
    rating: 4.94,
    reviewsCount: 73,
    tierPricing: [
      { minQuantity: 3, discountPercentage: 0 },
      { minQuantity: 12, discountPercentage: 8 },
      { minQuantity: 30, discountPercentage: 15 }
    ],
    seoKeywords: [
      "wholesale italian silver curb chain",
      "solid 925 curb necklace bulk supplier",
      "mens curb chain wholesale UK",
      "sterling silver chain wholesale factory"
    ]
  }
];

export const CATEGORIES = ["All", "Chains", "Rings", "Earrings", "Necklaces", "Bracelets"] as const;
