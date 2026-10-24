"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PRODUCTS, CATEGORIES, Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { useCurrency } from "@/components/CurrencyContext";

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("cat") || "All";
  const { currency, minimumOrderFormatted } = useCurrency();

  const [category, setCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "weight">("featured");
  const [selectedFinish, setSelectedFinish] = useState<string>("All");

  const finishes = ["All", "Rhodium", "Diamond-Cut", "Satin"];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item: Product) => {
      // Category filter
      if (category !== "All" && item.category !== category) return false;

      // Finish filter
      if (selectedFinish !== "All") {
        if (!item.finish.toLowerCase().includes(selectedFinish.toLowerCase())) return false;
      }

      // Search query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesSku = item.sku.toLowerCase().includes(query);
        const matchesKeywords = item.seoKeywords.some((k) => k.toLowerCase().includes(query));
        if (!matchesName && !matchesSku && !matchesKeywords) return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = currency === "USD" ? a.priceUSD : a.priceGBP;
      const priceB = currency === "USD" ? b.priceUSD : b.priceGBP;

      if (sortBy === "price-asc") return priceA - priceB;
      if (sortBy === "price-desc") return priceB - priceA;
      if (sortBy === "weight") {
        const weightA = parseFloat(a.gramWeight);
        const weightB = parseFloat(b.gramWeight);
        return weightB - weightA;
      }
      return b.rating - a.rating;
    });
  }, [category, selectedFinish, searchQuery, sortBy, currency]);

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs & Header */}
        <div className="mb-8">
          <nav className="text-xs text-slate-500 mb-2 flex items-center gap-1.5 font-medium">
            <a href="/" className="hover:text-slate-900 transition">Trade Home</a>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Wholesale Catalog</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
            <div>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-slate-950">
                Wholesale Sterling Silver Catalog
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Direct trade pricing. Mix and match any product SKUs to fulfill the {minimumOrderFormatted} minimum order.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-lg text-xs font-semibold self-start sm:self-auto">
              <span>⚡</span> Fast UK (24h) &amp; USA (2-3 Days) DDP Dispatch
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 mb-8 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <input
                type="text"
                placeholder="Search by name, SKU (e.g. AG-NECK), or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-950"
              />
              <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Finish Filter */}
            <div className="md:col-span-4 flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 whitespace-nowrap">Finish:</span>
              <div className="flex gap-1 overflow-x-auto">
                {finishes.map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFinish(f)}
                    className={`text-xs px-2.5 py-1 rounded transition whitespace-nowrap ${
                      selectedFinish === f
                        ? "bg-slate-900 text-white font-medium"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-3 flex items-center justify-end gap-2">
              <span className="text-xs font-medium text-slate-500">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "featured" | "price-asc" | "price-desc" | "weight")}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-slate-950 font-medium"
              >
                <option value="featured">Best Sellers</option>
                <option value="price-asc">Wholesale Price: Low to High</option>
                <option value="price-desc">Wholesale Price: High to Low</option>
                <option value="weight">Heaviest Gram Weight</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`text-xs px-3.5 py-1.5 rounded-lg transition font-medium ${
                  category === cat
                    ? "bg-slate-950 text-white shadow-sm font-semibold"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex justify-between items-center mb-6 text-xs text-slate-500">
          <span>Showing <strong className="text-slate-900 font-semibold">{filteredProducts.length}</strong> wholesale silver styles</span>
          <span className="italic">All items cast in certified 925 sterling silver</span>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12">
            <p className="text-slate-500 text-sm mb-4">No wholesale items matched your current filter criteria.</p>
            <button
              onClick={() => {
                setCategory("All");
                setSearchQuery("");
                setSelectedFinish("All");
              }}
              className="bg-slate-950 text-white text-xs font-semibold px-4 py-2 rounded-lg"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* SEO Technical Context for Crawlers at Bottom */}
        <div className="mt-20 border-t border-slate-200 pt-10 text-xs text-slate-500 space-y-4">
          <h2 className="font-serif-luxury text-base font-bold text-slate-900">
            Wholesale 925 Sterling Silver Jewelry Manufacturer Specifications
          </h2>
          <p className="leading-relaxed">
            Our trade catalog features solid 925 sterling silver articles tailored for jewelers in the United Kingdom, United States, and international boutique partners. Each piece conforms to British Hallmarking Council guidelines and the US National Stamping Act. Whether stocking Italian curb chains, solid silver signet rings, pavé zircon huggies, or heavy torque bangles, our low £100 ($130) minimum opening order supports independent merchants with factory-direct margins without surplus inventory bloat.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-500">Loading Wholesale Catalog...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
