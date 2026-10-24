"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Product, CATEGORIES } from "@/data/products";
import { useProducts } from "@/components/ProductContext";

// Curated high-res jewelry photography presets for instant 1-click selection
const IMAGE_PRESETS = [
  {
    name: "Herringbone Chain",
    category: "Chains",
    url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Bold Dome Ring",
    category: "Rings",
    url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Signet Ring",
    category: "Rings",
    url: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Chunky Curb Chain",
    category: "Chains",
    url: "https://images.unsplash.com/photo-1611591475155-42e5232d3925?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Huggie Hoops",
    category: "Earrings",
    url: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Paperclip Necklace",
    category: "Necklaces",
    url: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Bangle Bracelet",
    category: "Bracelets",
    url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Pave Crystal Studs",
    category: "Earrings",
    url: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=900&q=80",
  },
];

function NewProductContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const { products, addProduct, updateProduct, getProductById } = useProducts();

  const isEditing = Boolean(editId);

  // Helper to generate a new unique SKU
  const generateNewSku = (category: string) => {
    const prefix = category.slice(0, 3).toUpperCase();
    const randNum = Math.floor(100 + Math.random() * 900);
    return `AG-${prefix}-${randNum}`;
  };

  // Form Fields State
  const [formName, setFormName] = useState("");
  const [formSku, setFormSku] = useState(generateNewSku("Chains"));
  const [formCategory, setFormCategory] = useState<Product["category"]>("Chains");
  const [formBadge, setFormBadge] = useState<string>("New In");
  const [formPurity, setFormPurity] = useState("Solid 925 Sterling Silver");
  const [formGramWeight, setFormGramWeight] = useState("14.5g");
  const [formFinish, setFormFinish] = useState("Diamond-Cut Mirror Polish & Rhodium Barrier");
  const [formDimensions, setFormDimensions] = useState("Length: 45cm (18 in) | Width: 4.0mm");
  const [formHallmarked, setFormHallmarked] = useState(true);
  const [formPriceGBP, setFormPriceGBP] = useState<number>(18.50);
  const [formPriceUSD, setFormPriceUSD] = useState<number>(24.05);
  const [formSuggestedRetailGBP, setFormSuggestedRetailGBP] = useState<number>(59.00);
  const [formSuggestedRetailUSD, setFormSuggestedRetailUSD] = useState<number>(76.00);
  const [formMoq, setFormMoq] = useState<number>(3);
  const [formStockCount, setFormStockCount] = useState<number>(120);
  const [formPrimaryImage, setFormPrimaryImage] = useState(IMAGE_PRESETS[0].url);
  const [formSecondaryImage, setFormSecondaryImage] = useState("");
  const [formShortDescription, setFormShortDescription] = useState(
    "Ultra-fluid liquid silk drape. Crafted in solid 925 silver with mirror rhodium anti-tarnish protective plating."
  );
  const [formDescription, setFormDescription] = useState(
    "Engineered from certified solid 925 sterling silver with a diamond-cut mirror finish. Stamped with authentic 925 purity hallmark compliant with UK Assay Office regulations and US FTC precious metals standards."
  );
  const [formSeoKeywords, setFormSeoKeywords] = useState("wholesale silver chains, 925 solid sterling silver bulk, UK silver jewelry supplier");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If editing an existing product, populate the fields
  useEffect(() => {
    if (editId) {
      const existing = getProductById(editId);
      if (existing) {
        setFormName(existing.name);
        setFormSku(existing.sku);
        setFormCategory(existing.category);
        setFormBadge(existing.badge || "");
        setFormPurity(existing.purity);
        setFormGramWeight(existing.gramWeight);
        setFormFinish(existing.finish);
        setFormDimensions(existing.dimensions);
        setFormHallmarked(existing.hallmarked);
        setFormPriceGBP(existing.priceGBP);
        setFormPriceUSD(existing.priceUSD);
        setFormSuggestedRetailGBP(existing.suggestedRetailGBP);
        setFormSuggestedRetailUSD(existing.suggestedRetailUSD);
        setFormMoq(existing.moq);
        setFormStockCount(existing.stockCount);
        setFormPrimaryImage(existing.images[0] || IMAGE_PRESETS[0].url);
        setFormSecondaryImage(existing.images[1] || "");
        setFormShortDescription(existing.shortDescription);
        setFormDescription(existing.description);
        setFormSeoKeywords(existing.seoKeywords ? existing.seoKeywords.join(", ") : "");
      }
    }
  }, [editId, getProductById]);

  // Handle Price GBP change to auto-calculate recommended USD and retail MSRP
  const handlePriceGBPChange = (val: number) => {
    setFormPriceGBP(val);
    const usd = Number((val * 1.30).toFixed(2));
    setFormPriceUSD(usd);
    const msrpGBP = Number((val * 3.2).toFixed(2));
    setFormSuggestedRetailGBP(msrpGBP);
    const msrpUSD = Number((usd * 3.2).toFixed(2));
    setFormSuggestedRetailUSD(msrpUSD);
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formName.trim()) {
      alert("Please provide a product title.");
      setIsSubmitting(false);
      return;
    }
    if (!formSku.trim()) {
      alert("Please provide a valid SKU.");
      setIsSubmitting(false);
      return;
    }

    const imagesArray = [formPrimaryImage.trim()];
    if (formSecondaryImage.trim()) {
      imagesArray.push(formSecondaryImage.trim());
    }

    const keywordsArray = formSeoKeywords
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    const slug = formName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const tierPricing = [
      { minQuantity: formMoq, discountPercentage: 0 },
      { minQuantity: 15, discountPercentage: 8 },
      { minQuantity: 50, discountPercentage: 15 },
      { minQuantity: 100, discountPercentage: 22 },
    ];

    if (isEditing && editId) {
      updateProduct(editId, {
        name: formName.trim(),
        sku: formSku.trim(),
        category: formCategory,
        badge: formBadge || undefined,
        purity: formPurity.trim(),
        gramWeight: formGramWeight.trim(),
        finish: formFinish.trim(),
        dimensions: formDimensions.trim(),
        hallmarked: formHallmarked,
        priceGBP: Number(formPriceGBP),
        priceUSD: Number(formPriceUSD),
        suggestedRetailGBP: Number(formSuggestedRetailGBP),
        suggestedRetailUSD: Number(formSuggestedRetailUSD),
        moq: Number(formMoq),
        stockCount: Number(formStockCount),
        images: imagesArray,
        shortDescription: formShortDescription.trim(),
        description: formDescription.trim(),
        seoKeywords: keywordsArray,
      });
    } else {
      const newProduct: Product = {
        id: `slv-${Date.now().toString().slice(-6)}`,
        name: formName.trim(),
        slug,
        sku: formSku.trim(),
        category: formCategory,
        badge: formBadge || undefined,
        purity: formPurity.trim(),
        gramWeight: formGramWeight.trim(),
        finish: formFinish.trim(),
        dimensions: formDimensions.trim(),
        hallmarked: formHallmarked,
        priceGBP: Number(formPriceGBP),
        priceUSD: Number(formPriceUSD),
        suggestedRetailGBP: Number(formSuggestedRetailGBP),
        suggestedRetailUSD: Number(formSuggestedRetailUSD),
        moq: Number(formMoq),
        stockCount: Number(formStockCount),
        images: imagesArray,
        shortDescription: formShortDescription.trim(),
        description: formDescription.trim(),
        rating: 5.0,
        reviewsCount: 1,
        tierPricing,
        seoKeywords: keywordsArray,
      };

      addProduct(newProduct);
    }

    // Navigate back to admin inventory tab with notification parameter
    router.push("/admin?tab=catalog&status=saved");
  };

  // Real-Time Profit Calculation
  const profitGBP = Number((formSuggestedRetailGBP - formPriceGBP).toFixed(2));
  const markupPercent = formPriceGBP > 0 ? Math.round((profitGBP / formPriceGBP) * 100) : 0;
  const keystoneMultiple = formPriceGBP > 0 ? (formSuggestedRetailGBP / formPriceGBP).toFixed(1) : "0.0";

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb & Action Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 mb-8 border-b border-slate-200 gap-4">
          <div>
            <nav className="text-xs text-slate-500 mb-2 flex items-center gap-1.5 font-medium">
              <Link href="/" className="hover:text-slate-900 transition">Trade Home</Link>
              <span>/</span>
              <Link href="/admin?tab=catalog" className="hover:text-slate-900 transition">Merchant Portal</Link>
              <span>/</span>
              <span className="text-slate-900 font-semibold">
                {isEditing ? "Edit Wholesale Listing" : "Add New Product"}
              </span>
            </nav>
            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-slate-950">
              {isEditing ? `Edit Listing: ${formName || "Product"}` : "Add New Wholesale Silver Listing"}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Add new solid 925 sterling silver jewelry lines to your UK &amp; US wholesale line-sheet and live catalog.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/admin?tab=catalog"
              className="bg-white border border-slate-300 hover:border-slate-800 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-lg transition"
            >
              Cancel &amp; Return
            </Link>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-sm transition uppercase tracking-wider flex items-center gap-1.5"
            >
              <span>{isEditing ? "Save Changes" : "Publish Listing"}</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: Main Product Details (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Card 1: Identification & General Info */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h2 className="font-serif-luxury text-base font-bold text-slate-950 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-mono font-bold">1</span>
                  <span>Product Title &amp; Classification</span>
                </h2>
                <span className="text-[11px] text-slate-400 font-medium">B2B Wholesale Catalog</span>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Product Title / Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Solid 925 Silver Liquid Herringbone Snake Chain (3.5mm)"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 font-semibold focus:outline-none focus:border-slate-950 text-sm"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Include metal fineness (Solid 925), style name, and key dimensions (e.g. mm width).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-bold text-slate-800">SKU Code *</label>
                      <button
                        type="button"
                        onClick={() => setFormSku(generateNewSku(formCategory))}
                        className="text-[10px] text-amber-800 hover:underline font-bold"
                      >
                        ⚡ Generate
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={formSku}
                      onChange={(e) => setFormSku(e.target.value)}
                      placeholder="AG-NECK-009"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-mono font-bold focus:outline-none focus:border-slate-950"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Category *</label>
                    <select
                      value={formCategory}
                      onChange={(e) => {
                        const cat = e.target.value as Product["category"];
                        setFormCategory(cat);
                        if (!isEditing) setFormSku(generateNewSku(cat));
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-semibold focus:outline-none focus:border-slate-950"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">Merchandising Badge</label>
                    <select
                      value={formBadge}
                      onChange={(e) => setFormBadge(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-950"
                    >
                      <option value="">No Badge</option>
                      <option value="Bestseller">Bestseller</option>
                      <option value="New In">New In</option>
                      <option value="High Margin">High Margin</option>
                      <option value="Limited Run">Limited Run</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Short B2B Summary (For catalog cards &amp; wholesale line-sheets) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formShortDescription}
                    onChange={(e) => setFormShortDescription(e.target.value)}
                    placeholder="Ultra-fluid liquid silk drape. Crafted in solid 925 silver with mirror rhodium protective plating."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-950"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Full Commercial Description (Craftsmanship, metal alloy, packaging) *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Provide complete trade product copy for retail buyers..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-slate-950 leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Precious Metals & Hallmarking Specs */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h2 className="font-serif-luxury text-base font-bold text-slate-950 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-mono font-bold">2</span>
                  <span>Precious Metal &amp; Physical Specifications</span>
                </h2>
                <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-semibold border border-amber-200">
                  UK Assay &amp; US FTC Compliant
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Metal Purity *</label>
                  <input
                    type="text"
                    required
                    value={formPurity}
                    onChange={(e) => setFormPurity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-950 font-medium"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Virgin 925/1000 millesimal fineness guaranteed.</p>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Gram Weight (Crucial for Silver Wholesale Pricing) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formGramWeight}
                    onChange={(e) => setFormGramWeight(e.target.value)}
                    placeholder="e.g. 14.8g"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-mono font-bold focus:outline-none focus:border-slate-950"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Boutique buyers compare silver weight against spot price.</p>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Protective Coating &amp; Finish *
                  </label>
                  <input
                    type="text"
                    required
                    value={formFinish}
                    onChange={(e) => setFormFinish(e.target.value)}
                    placeholder="Diamond-Cut Mirror Polish & Rhodium Barrier"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-950"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Dimensions &amp; Sizing Specs *
                  </label>
                  <input
                    type="text"
                    required
                    value={formDimensions}
                    onChange={(e) => setFormDimensions(e.target.value)}
                    placeholder="Length: 45cm (18 in) | Width: 3.5mm"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-950"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-300 rounded-xl cursor-pointer hover:bg-slate-100 transition">
                    <input
                      type="checkbox"
                      checked={formHallmarked}
                      onChange={(e) => setFormHallmarked(e.target.checked)}
                      className="w-4 h-4 rounded text-slate-950 focus:ring-slate-950"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block text-xs">
                        UK Assay Office Hallmarking Certified (London / Birmingham)
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        Features official UK hallmark stamp and sponsor mark, legally required for silver items over 7.78g.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Card 3: Jewelry Photography & 1-Click Presets */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h2 className="font-serif-luxury text-base font-bold text-slate-950 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-mono font-bold">3</span>
                  <span>Jewelry Photography &amp; Visual Media</span>
                </h2>
                <span className="text-[11px] text-slate-400 font-medium">High-Res Assets</span>
              </div>

              {/* 1-Click Preset Gallery */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-2">
                  ✨ 1-Click Photo Presets (Click any thumbnail to auto-fill primary photo):
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {IMAGE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormPrimaryImage(preset.url)}
                      className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition ${
                        formPrimaryImage === preset.url
                          ? "border-amber-500 ring-2 ring-amber-400/40"
                          : "border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      <Image
                        src={preset.url}
                        alt={preset.name}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-end p-1 text-[8px] text-white font-bold leading-tight truncate">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start text-xs pt-2">
                <div className="sm:col-span-2 space-y-3">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      Primary Product Image URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={formPrimaryImage}
                      onChange={(e) => setFormPrimaryImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-mono text-[11px] focus:outline-none focus:border-slate-950"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      Secondary Image URL (Alternative Angle / Model Shot)
                    </label>
                    <input
                      type="url"
                      value={formSecondaryImage}
                      onChange={(e) => setFormSecondaryImage(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-mono text-[11px] focus:outline-none focus:border-slate-950"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                    Live Photo Preview
                  </span>
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden mx-auto bg-slate-200 border border-slate-300 shadow-xs">
                    {formPrimaryImage ? (
                      <Image
                        src={formPrimaryImage}
                        alt="Product Preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                        No Image
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Search Engine Optimization (SEO) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h2 className="font-serif-luxury text-base font-bold text-slate-950 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-mono font-bold">4</span>
                  <span>SEO Ranking &amp; Organic Keywords</span>
                </h2>
                <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                  High Organic Visibility
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Organic SEO Search Keywords (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formSeoKeywords}
                    onChange={(e) => setFormSeoKeywords(e.target.value)}
                    placeholder="wholesale silver chains UK, 925 solid sterling silver bulk, boutique jewelry supplier USA"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-950"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    These keywords feed automated Schema.org Product JSON-LD structured data and dynamic meta tags.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Pricing, Margins, Stock & Action Panel (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Card: Commercial Wholesale Pricing & Margin Calculator */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h3 className="font-serif-luxury text-base font-bold text-slate-950 border-b border-slate-100 pb-2">
                Wholesale Pricing &amp; Margins
              </h3>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Wholesale Price (GBP £) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold">£</span>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      required
                      value={formPriceGBP}
                      onChange={(e) => handlePriceGBPChange(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-7 pr-3 py-2 text-slate-900 font-extrabold text-sm focus:outline-none focus:border-slate-950"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Wholesale Price (USD $) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      required
                      value={formPriceUSD}
                      onChange={(e) => setFormPriceUSD(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-7 pr-3 py-2 text-slate-900 font-extrabold text-sm focus:outline-none focus:border-slate-950"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Auto-calculated at 1.30 transatlantic parity</span>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <label className="font-bold text-slate-800 block mb-1">
                    Suggested Retail Price (MSRP GBP £)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold">£</span>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      required
                      value={formSuggestedRetailGBP}
                      onChange={(e) => setFormSuggestedRetailGBP(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-7 pr-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-slate-950"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Suggested Retail Price (MSRP USD $)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      required
                      value={formSuggestedRetailUSD}
                      onChange={(e) => setFormSuggestedRetailUSD(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-7 pr-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-slate-950"
                    />
                  </div>
                </div>

                {/* Real-time Keystoning Margin Box */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 space-y-1 text-emerald-950">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block tracking-wider">
                    Boutique Retailer Margin Potential
                  </span>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xl font-black text-emerald-900">{keystoneMultiple}x</span>
                    <span className="text-xs font-bold text-emerald-800">+{markupPercent}% markup</span>
                  </div>
                  <span className="text-[11px] text-emerald-800 block font-medium">
                    £{profitGBP.toFixed(2)} estimated gross profit per sold unit.
                  </span>
                </div>
              </div>
            </div>

            {/* Card: Warehouse Inventory & MOQ */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h3 className="font-serif-luxury text-base font-bold text-slate-950 border-b border-slate-100 pb-2">
                Inventory Logistics &amp; MOQ
              </h3>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Minimum Order Quantity (MOQ per line) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formMoq}
                    onChange={(e) => setFormMoq(parseInt(e.target.value, 10) || 1)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-bold focus:outline-none focus:border-slate-950"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Retailers must add at least this quantity to their bag.
                  </p>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Initial Warehouse In-Stock Units *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formStockCount}
                    onChange={(e) => setFormStockCount(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-bold focus:outline-none focus:border-slate-950"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Available inventory ready for immediate UK/US courier dispatch.
                  </p>
                </div>
              </div>
            </div>

            {/* Card: Action Panel */}
            <div className="bg-slate-950 text-white rounded-2xl p-6 shadow-md space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                  Ready to Publish
                </span>
                <h4 className="font-serif-luxury text-lg font-bold">
                  {isEditing ? "Update Wholesale Listing" : "Publish to Trade Catalog"}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  The listing will be immediately available across the wholesale store with automated volume pricing tiers.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider py-3 rounded-lg transition shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>{isEditing ? "Save & Update Listing" : "Publish Wholesale Listing"}</span>
                  <span>→</span>
                </button>
                <Link
                  href="/admin?tab=catalog"
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs py-2.5 rounded-lg block text-center transition"
                >
                  Discard Changes
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NewProductPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF9F6] p-8 text-xs text-slate-500">Loading New Listing Form...</div>}>
      <NewProductContent />
    </Suspense>
  );
}
