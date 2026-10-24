"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/data/products";
import { useCurrency } from "@/components/CurrencyContext";
import { useCart } from "@/components/CartContext";
import { useProducts } from "@/components/ProductContext";
import ProductCard from "@/components/ProductCard";

interface ProductDetailClientProps {
  product?: Product | null;
  fallbackId?: string;
  relatedProducts?: Product[];
}

export default function ProductDetailClient({
  product: initialProduct,
  fallbackId,
  relatedProducts = [],
}: ProductDetailClientProps) {
  const { currency, formatPrice, minimumOrderFormatted } = useCurrency();
  const { addToCart } = useCart();
  const { getProductById, products } = useProducts();

  const product = initialProduct || (fallbackId ? getProductById(fallbackId) : null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(product?.moq || 1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!product) {
    return (
      <div className="bg-[#FAF9F6] min-h-screen py-16 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center max-w-md w-full mx-4 shadow-sm">
          <div className="text-3xl mb-3">🔍</div>
          <h2 className="font-serif-luxury text-xl font-bold text-slate-900 mb-2">
            Wholesale Listing Not Found
          </h2>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            This piece may have been retired or updated. Browse our full live 925 solid silver catalog for active factory lines.
          </p>
          <Link
            href="/catalog"
            className="bg-slate-950 text-white text-xs font-bold px-6 py-3 rounded-lg inline-block uppercase tracking-wider hover:bg-slate-800 transition"
          >
            Browse Wholesale Catalog
          </Link>
        </div>
      </div>
    );
  }

  const computedRelated =
    relatedProducts && relatedProducts.length > 0
      ? relatedProducts
      : products
          .filter((p) => p.category === product.category && p.id !== product.id)
          .slice(0, 3);

  const wholesaleUnitPrice = currency === "USD" ? product.priceUSD : product.priceGBP;
  const suggestedMSRP = currency === "USD" ? product.suggestedRetailUSD : product.suggestedRetailGBP;
  const profitPerUnit = suggestedMSRP - wholesaleUnitPrice;
  const markupPercentage = Math.round((profitPerUnit / wholesaleUnitPrice) * 100);

  // Calculate volume discount based on selected quantity
  const sortedTiers = [...(product.tierPricing || [])].sort((a, b) => b.minQuantity - a.minQuantity);
  const applicableTier = sortedTiers.find((t) => quantity >= t.minQuantity);
  const currentDiscountRate = applicableTier ? applicableTier.discountPercentage : 0;
  const effectiveUnitPrice = wholesaleUnitPrice * (1 - currentDiscountRate / 100);
  const lineSubtotal = effectiveUnitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="text-xs text-slate-500 mb-6 flex items-center gap-1.5 font-medium">
          <Link href="/" className="hover:text-slate-900 transition">Trade Home</Link>
          <span>/</span>
          <Link href="/catalog" className="hover:text-slate-900 transition">Wholesale Catalog</Link>
          <span>/</span>
          <Link href={`/catalog?cat=${product.category}`} className="hover:text-slate-900 transition">{product.category}</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main Product Showcase Grid */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 lg:p-10 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Gallery Column */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 550px"
                  className="object-cover object-center"
                />
                {product.badge && (
                  <span className="absolute top-4 left-4 bg-slate-950 text-white text-xs font-bold px-2.5 py-1 rounded tracking-wide shadow-sm">
                    {product.badge}
                  </span>
                )}
                <span className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-md text-white text-xs px-3 py-1 rounded font-mono">
                  ⚖️ {product.gramWeight} • 925 Hallmarked
                </span>
              </div>

              {/* Thumbnail strip */}
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                        selectedImage === idx ? "border-slate-950 shadow-sm" : "border-slate-200 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} view ${idx + 1}`}
                        fill
                        className="object-cover object-center"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Hallmarking Proof Box */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span>🏛️</span> Certified UK Assay Hallmarking &amp; US FTC Compliant
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Struck with full UK Hallmarks (Sponsor Mark &apos;ARG&apos;, Fineness Mark &apos;925&apos;, and London Leopard / Birmingham Anchor Assay Mark). Meets California Prop 65 lead &amp; nickel standards.
                </p>
              </div>
            </div>

            {/* Buying & Specs Column */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-mono text-slate-400">SKU: {product.sku}</span>
                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    In Stock ({product.stockCount} units available)
                  </span>
                </div>

                <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-slate-950 leading-tight">
                  {product.name}
                </h1>

                <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Wholesale Pricing vs Retail Margin Breakdown */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <span className="text-xs uppercase font-bold text-slate-500 block">
                      Wholesale Cost / Unit
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-2xl font-extrabold text-slate-950">
                        {currency === "USD" ? `$${effectiveUnitPrice.toFixed(2)}` : `£${effectiveUnitPrice.toFixed(2)}`}
                      </span>
                      {currentDiscountRate > 0 && (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                          -{currentDiscountRate}% Off
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">Base: {formatPrice(product.priceGBP)}</span>
                  </div>

                  <div className="border-l border-slate-200 pl-4">
                    <span className="text-xs uppercase font-bold text-slate-500 block">
                      Suggested Boutique MSRP
                    </span>
                    <span className="text-xl font-bold text-slate-700 mt-0.5 block">
                      {currency === "USD" ? `$${suggestedMSRP.toFixed(2)}` : `£${suggestedMSRP.toFixed(2)}`}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700">
                      +{markupPercentage}% Gross Margin ({currency === "USD" ? `$${profitPerUnit.toFixed(2)}` : `£${profitPerUnit.toFixed(2)}`} profit/pc)
                    </span>
                  </div>
                </div>

                {/* Tier Quantity Table */}
                <div>
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                    Wholesale Volume Tier Discounts:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {product.tierPricing.map((tier, idx) => {
                      const tierPrice = wholesaleUnitPrice * (1 - tier.discountPercentage / 100);
                      const isSelected = quantity >= tier.minQuantity && (!product.tierPricing[idx + 1] || quantity < product.tierPricing[idx + 1].minQuantity);

                      return (
                        <div
                          key={tier.minQuantity}
                          onClick={() => setQuantity(tier.minQuantity)}
                          className={`p-2.5 rounded-lg border text-center cursor-pointer transition ${
                            isSelected
                              ? "bg-slate-950 text-white border-slate-950 shadow-sm"
                              : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                          }`}
                        >
                          <div className="font-bold text-[11px]">{tier.minQuantity}+ pcs</div>
                          <div className="font-extrabold text-xs mt-0.5">
                            {currency === "USD" ? `$${tierPrice.toFixed(2)}` : `£${tierPrice.toFixed(2)}`}
                          </div>
                          <div className={`text-[10px] mt-0.5 ${isSelected ? "text-amber-300 font-semibold" : "text-emerald-700"}`}>
                            {tier.discountPercentage === 0 ? "Standard" : `Save ${tier.discountPercentage}%`}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Order Quantity & Add to Cart Controls */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div className="flex items-center justify-between sm:flex-col sm:items-start">
                    <span className="text-xs text-slate-500 font-medium mb-0 sm:mb-1">
                      Pack MOQ: {product.moq} pcs
                    </span>
                    <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => setQuantity((q) => Math.max(product.moq, q - 1))}
                        className="px-3 py-2 text-slate-700 hover:bg-slate-100 font-bold text-sm"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={product.moq}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(product.moq, parseInt(e.target.value) || product.moq))}
                        className="w-16 text-center text-sm font-bold text-slate-950 focus:outline-none"
                      />
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="px-3 py-2 text-slate-700 hover:bg-slate-100 font-bold text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-end">
                    <div className="flex justify-between items-center sm:block text-xs text-slate-500 font-medium mb-1.5 sm:text-right">
                      <span>Subtotal:</span>
                      <strong className="text-slate-950 font-bold text-sm ml-1">
                        {currency === "USD" ? `$${lineSubtotal.toFixed(2)}` : `£${lineSubtotal.toFixed(2)}`}
                      </strong>
                    </div>
                    <button
                      onClick={handleAddToCart}
                      className={`w-full py-3.5 px-6 rounded-lg text-xs uppercase font-bold tracking-wider transition-all duration-200 flex items-center justify-center gap-2 ${
                        addedSuccess
                          ? "bg-emerald-700 text-white"
                          : "bg-slate-950 hover:bg-slate-800 text-white shadow-md"
                      }`}
                    >
                      {addedSuccess ? (
                        <>
                          <span>✓</span>
                          <span>Added {quantity} Pieces to Bag</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          <span>Add Pack to Wholesale Bag</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Minimum total order value: <strong className="text-slate-800">{minimumOrderFormatted}</strong></span>
                  <Link href="/cart" className="text-amber-800 hover:underline font-semibold">
                    View Cart &amp; Checkout →
                  </Link>
                </div>
              </div>

              {/* Technical Specifications Table */}
              <div className="pt-4 border-t border-slate-200">
                <h3 className="font-serif-luxury text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">
                  Technical Specifications
                </h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div className="border-b border-slate-100 pb-1.5">
                    <dt className="text-slate-400">Metal Purity</dt>
                    <dd className="font-semibold text-slate-800">{product.purity}</dd>
                  </div>
                  <div className="border-b border-slate-100 pb-1.5">
                    <dt className="text-slate-400">Gram Weight</dt>
                    <dd className="font-semibold text-slate-800">{product.gramWeight}</dd>
                  </div>
                  <div className="border-b border-slate-100 pb-1.5">
                    <dt className="text-slate-400">Protective Coating</dt>
                    <dd className="font-semibold text-slate-800">{product.finish}</dd>
                  </div>
                  <div className="border-b border-slate-100 pb-1.5">
                    <dt className="text-slate-400">Dimensions</dt>
                    <dd className="font-semibold text-slate-800">{product.dimensions}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Related Wholesale Recommendations */}
        {computedRelated.length > 0 && (
          <div className="mt-16">
            <h2 className="font-serif-luxury text-2xl font-bold text-slate-950 mb-6">
              Frequently Ordered Together in {product.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {computedRelated.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
