"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/data/products";
import { useCurrency } from "./CurrencyContext";
import { useCart } from "./CartContext";

export default function ProductCard({ product }: { product: Product }) {
  const { currency, formatPrice, convertPrice } = useCurrency();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(product.moq);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const wholesaleUnitPrice = currency === "USD" ? product.priceUSD : product.priceGBP;
  const suggestedRetailPrice = currency === "USD" ? product.suggestedRetailUSD : product.suggestedRetailGBP;
  const markupPercentage = Math.round(((suggestedRetailPrice - wholesaleUnitPrice) / wholesaleUnitPrice) * 100);

  const handleAdd = () => {
    addToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  return (
    <div className="group bg-white rounded-xl border border-slate-200/90 hover:border-slate-400 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Image Container with Badges */}
        <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
          <Link href={`/product/${product.id}`} className="block w-full h-full">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.badge && (
              <span className="bg-slate-950 text-white text-[11px] font-bold px-2 py-0.5 rounded tracking-wide shadow-sm">
                {product.badge}
              </span>
            )}
            <span className="bg-white/95 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200 shadow-sm backdrop-blur-sm">
              MOQ: {product.moq} pcs
            </span>
          </div>

          <div className="absolute top-3 right-3 z-10">
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
              +{markupPercentage}% Retail Markup
            </span>
          </div>

          {/* Hallmarking indicator watermark */}
          <div className="absolute bottom-2 left-2 z-10">
            <span className="text-[10px] bg-slate-900/80 backdrop-blur-md text-slate-200 px-2 py-0.5 rounded font-mono font-medium flex items-center gap-1">
              <span>⚖️</span> {product.gramWeight} • 925
            </span>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-mono text-[11px] tracking-wide text-slate-400">{product.sku}</span>
            <span className="font-medium text-slate-600">{product.category}</span>
          </div>

          <h3 className="font-serif-luxury text-base font-bold text-slate-900 line-clamp-2 hover:text-slate-700 transition leading-snug mb-2">
            <Link href={`/product/${product.id}`}>{product.name}</Link>
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Pricing Grid */}
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 mb-4">
            <div className="flex justify-between items-baseline mb-1">
              <div>
                <span className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider">
                  Wholesale Unit
                </span>
                <span className="text-lg font-bold text-slate-950">
                  {formatPrice(product.priceGBP)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] uppercase font-medium text-slate-400 block">
                  Suggested MSRP
                </span>
                <span className="text-xs font-semibold text-slate-500 line-through">
                  {currency === "USD" ? `$${product.suggestedRetailUSD.toFixed(2)}` : `£${product.suggestedRetailGBP.toFixed(2)}`}
                </span>
              </div>
            </div>

            {/* Micro Tier discounts summary */}
            <div className="text-[11px] text-amber-800 font-medium pt-1.5 border-t border-slate-200/60 flex items-center justify-between">
              <span>Bulk tier:</span>
              <span>
                {product.tierPricing[1]?.minQuantity}+ pcs (
                {product.tierPricing[1]?.discountPercentage}% off)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action / Add to Cart Section */}
      <div className="px-4 sm:px-5 pb-5 pt-0">
        <div className="flex items-center gap-2">
          {/* Quantity Selector */}
          <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
            <button
              onClick={() => setQuantity((q) => Math.max(product.moq, q - 1))}
              className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-100 text-xs font-bold transition"
              title="Decrease quantity"
            >
              -
            </button>
            <span className="px-2 py-1.5 text-xs font-semibold text-slate-900 min-w-[28px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="px-2.5 py-1.5 text-slate-600 hover:bg-slate-100 text-xs font-bold transition"
              title="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Quick Add Button */}
          <button
            onClick={handleAdd}
            className={`flex-1 text-xs font-bold py-2 px-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 ${
              addedAnimation
                ? "bg-emerald-700 text-white"
                : "bg-slate-950 hover:bg-slate-800 text-white shadow-sm"
            }`}
          >
            {addedAnimation ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span>Added ({quantity} pcs)</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Add {quantity} to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
