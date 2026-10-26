"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/data/products";
import { useCurrency } from "./CurrencyContext";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";

export default function ProductCard({ product }: { product: Product }) {
  const { currency, formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const { user } = useAuth();
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
            {user ? (
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                +{markupPercentage}% Retail Markup
              </span>
            ) : (
              <span className="bg-slate-900/90 text-amber-200 border border-amber-400/30 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm backdrop-blur-sm flex items-center gap-1">
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Trade Only
              </span>
            )}
          </div>

          {/* Hallmarking indicator watermark */}
          <div className="absolute bottom-2 left-2 z-10">
            <span className="text-[10px] bg-slate-900/80 backdrop-blur-md text-slate-200 px-2 py-0.5 rounded font-mono font-medium flex items-center gap-1">
              <span>⚖️</span> {product.gramWeight} • 925
            </span>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-3.5 sm:p-5">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-mono text-[11px] tracking-wide text-slate-400">{product.sku}</span>
            <span className="font-medium text-slate-600 text-[11px] sm:text-xs">{product.category}</span>
          </div>

          <h3 className="font-serif-luxury text-sm sm:text-base font-bold text-slate-950 line-clamp-2 hover:text-slate-700 transition leading-snug mb-2">
            <Link href={`/product/${product.id}`}>{product.name}</Link>
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 mb-3.5 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Pricing Grid */}
          {user ? (
            <div className="bg-slate-50 rounded-lg p-2.5 sm:p-3 border border-slate-100 mb-3 sm:mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <div>
                  <span className="text-[10px] sm:text-[11px] uppercase font-bold text-slate-400 block tracking-wider">
                    Wholesale Unit
                  </span>
                  <span className="text-base sm:text-lg font-bold text-slate-950">
                    {formatPrice(product.priceGBP)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] sm:text-[11px] uppercase font-medium text-slate-400 block">
                    Suggested MSRP
                  </span>
                  <span className="text-xs font-semibold text-slate-500 line-through">
                    {currency === "USD" ? `$${product.suggestedRetailUSD.toFixed(2)}` : `£${product.suggestedRetailGBP.toFixed(2)}`}
                  </span>
                </div>
              </div>

              {/* Micro Tier discounts summary */}
              <div className="text-[10px] sm:text-[11px] text-amber-800 font-medium pt-1 border-t border-slate-200/60 flex items-center justify-between">
                <span>Bulk tier:</span>
                <span>
                  {product.tierPricing[1]?.minQuantity}+ pcs (
                  {product.tierPricing[1]?.discountPercentage}% off)
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-slate-50 to-slate-100/90 rounded-lg p-2.5 sm:p-3 border border-slate-200/80 mb-3 sm:mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <div>
                  <span className="text-[10px] sm:text-[11px] uppercase font-bold text-slate-500 block tracking-wider flex items-center gap-1">
                    <svg className="w-3 h-3 text-amber-600 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Wholesale Price
                  </span>
                  <Link
                    href={`/account/login?redirect=/product/${product.id}`}
                    className="text-xs sm:text-sm font-bold text-amber-900 hover:text-amber-950 hover:underline inline-flex items-center gap-1 mt-0.5"
                  >
                    <span>Sign in to view</span>
                    <span>→</span>
                  </Link>
                </div>
                <div className="text-right">
                  <span className="text-[10px] sm:text-[11px] uppercase font-medium text-slate-400 block">
                    Retail MSRP
                  </span>
                  <span className="text-xs font-semibold text-slate-600">
                    {currency === "USD" ? `$${product.suggestedRetailUSD.toFixed(2)}` : `£${product.suggestedRetailGBP.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="text-[10px] sm:text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-slate-600 font-medium">B2B Trade Accounts Only</span>
                <span className="text-emerald-700 font-semibold">Up to 75% Margin</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action / Add to Cart Section */}
      <div className="px-3.5 sm:px-5 pb-4 sm:pb-5 pt-0">
        {user ? (
          <div className="flex items-center gap-2">
            {/* Quantity Selector */}
            <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white flex-shrink-0">
              <button
                onClick={() => setQuantity((q) => Math.max(product.moq, q - 1))}
                className="px-2 py-1.5 text-slate-600 hover:bg-slate-100 text-xs font-bold transition"
                title="Decrease quantity"
              >
                -
              </button>
              <span className="px-1.5 sm:px-2 py-1.5 text-xs font-semibold text-slate-900 min-w-[24px] sm:min-w-[28px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-2 py-1.5 text-slate-600 hover:bg-slate-100 text-xs font-bold transition"
                title="Increase quantity"
              >
                +
              </button>
            </div>

            {/* Quick Add Button */}
            <button
              onClick={handleAdd}
              className={`flex-1 text-[11px] sm:text-xs font-bold py-2 px-2 sm:px-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-1 sm:gap-1.5 ${
                addedAnimation
                  ? "bg-emerald-700 text-white"
                  : "bg-slate-950 hover:bg-slate-800 text-white shadow-sm"
              }`}
            >
              {addedAnimation ? (
                <>
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="truncate">Added ({quantity})</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span className="truncate">Add {quantity} to Bag</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-1.5">
            <Link
              href={`/account/login?redirect=/product/${product.id}`}
              className="w-full text-[11px] sm:text-xs font-bold py-2.5 px-3 rounded-lg bg-slate-950 hover:bg-slate-800 text-white shadow-sm transition-all duration-200 flex items-center justify-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Trade Sign In to Order</span>
            </Link>
            <div className="text-center">
              <Link
                href="/account/register"
                className="text-[10px] text-slate-500 hover:text-slate-900 transition underline underline-offset-2"
              >
                Apply for Wholesale Trade Account
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
