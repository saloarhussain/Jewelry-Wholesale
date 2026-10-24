"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/CartContext";
import { useCurrency } from "@/components/CurrencyContext";
import { PRODUCTS } from "@/data/products";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    currentSubtotal,
    isMinimumMet,
    remainingForMinimum,
    volumeDiscountRate,
    volumeDiscountAmount,
    estimatedShippingFee,
    finalTotal,
    minimumOrderTarget,
  } = useCart();
  const { currency, formatPrice, minimumOrderFormatted } = useCurrency();

  // Progress percentage toward £100 / $130
  const progressPercent = Math.min(100, Math.round((currentSubtotal / minimumOrderTarget) * 100));

  // Find a product to recommend if below minimum
  const addOnProduct = PRODUCTS.find((p) => p.id === "slv-003") || PRODUCTS[0];

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <nav className="text-xs text-slate-500 mb-2 flex items-center gap-1.5 font-medium">
            <Link href="/" className="hover:text-slate-900 transition">Trade Home</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Wholesale Bag &amp; Checkout Review</span>
          </nav>
          <h1 className="font-serif-luxury text-3xl font-bold text-slate-950">
            Wholesale Trade Bag
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Minimum trade order requirement: <strong className="text-slate-800">{minimumOrderFormatted}</strong>. Combine any articles across our 925 collections.
          </p>
        </div>

        {/* Prominent Minimum Order Status Banner */}
        <div
          className={`p-5 rounded-xl border mb-8 transition-all ${
            isMinimumMet
              ? "bg-emerald-50/90 border-emerald-300 text-emerald-950"
              : "bg-amber-50/90 border-amber-300 text-amber-950"
          }`}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                  isMinimumMet
                    ? "bg-emerald-600 text-white"
                    : "bg-amber-600 text-white"
                }`}
              >
                {isMinimumMet ? "✓" : "!"}
              </div>
              <div>
                <h3 className="font-bold text-sm">
                  {isMinimumMet
                    ? "Wholesale Minimum Order Unlocked (£100 / $130 Met)"
                    : `Wholesale Minimum Order: Add ${currency === "GBP" ? `£${remainingForMinimum.toFixed(2)}` : `$${remainingForMinimum.toFixed(2)}`} to Checkout`}
                </h3>
                <p className="text-xs opacity-90 mt-0.5">
                  {isMinimumMet
                    ? "Your order satisfies our factory-direct wholesale threshold. You are eligible for trade fulfillment."
                    : `To maintain factory-direct wholesale pricing, our system enforces a minimum opening order of ${minimumOrderFormatted}.`}
                </p>
              </div>
            </div>

            <div className="w-full sm:w-56 text-right">
              <span className="text-[11px] font-semibold block mb-1">
                {progressPercent}% towards minimum
              </span>
              <div className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    isMinimumMet ? "bg-emerald-600" : "bg-amber-600"
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-2xl text-slate-400 mb-4">
              🛍️
            </div>
            <h3 className="font-serif-luxury text-xl font-bold text-slate-900 mb-2">
              Your wholesale trade bag is empty
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Explore our certified solid 925 sterling silver collections. Build your opening order with only {minimumOrderFormatted} minimum value.
            </p>
            <Link
              href="/catalog"
              className="bg-slate-950 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg hover:bg-slate-800 transition inline-block"
            >
              Browse Wholesale Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Items List */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs font-bold text-slate-600 uppercase tracking-wider">
                  <span>Product Lines ({items.length})</span>
                  <button
                    onClick={clearCart}
                    className="text-slate-400 hover:text-red-600 transition lowercase font-normal"
                  >
                    Clear all items
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {items.map((item) => {
                    const wholesalePrice = currency === "USD" ? item.product.priceUSD : item.product.priceGBP;
                    const lineTotal = wholesalePrice * item.quantity;

                    return (
                      <div key={item.product.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="flex gap-4 items-center">
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-slate-50 border border-slate-200 flex-shrink-0">
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              fill
                              className="object-cover object-center"
                            />
                          </div>

                          <div>
                            <span className="text-[10px] font-mono text-slate-400 block">{item.product.sku}</span>
                            <h4 className="font-serif-luxury text-sm font-bold text-slate-900 hover:text-slate-700">
                              <Link href={`/product/${item.product.id}`}>{item.product.name}</Link>
                            </h4>
                            <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                              <span>{item.product.gramWeight}</span>
                              <span>•</span>
                              <span>925 Hallmarked</span>
                              <span>•</span>
                              <span className="font-semibold text-slate-800">
                                {currency === "USD" ? `$${wholesalePrice.toFixed(2)}` : `£${wholesalePrice.toFixed(2)}`} / unit
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                          <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 font-bold text-xs"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 text-xs font-bold text-slate-900 min-w-[32px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 font-bold text-xs"
                            >
                              +
                            </button>
                          </div>

                          <div className="text-right min-w-[80px]">
                            <span className="font-extrabold text-sm text-slate-950 block">
                              {currency === "USD" ? `$${lineTotal.toFixed(2)}` : `£${lineTotal.toFixed(2)}`}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-[11px] text-slate-400 hover:text-red-600 transition"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Threshold Boost Recommendation */}
              {!isMinimumMet && (
                <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">💡</span>
                    <div>
                      <h4 className="text-xs font-bold text-amber-950">
                        Need an easy item to cross the {minimumOrderFormatted} threshold?
                      </h4>
                      <p className="text-[11px] text-amber-800">
                        Add a 5-pack of our best-selling Pavé Huggie Hoops for just {formatPrice(7.80 * 5)}.
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/product/${addOnProduct.id}`}
                    className="bg-amber-900 text-white text-xs font-bold px-3 py-1.5 rounded hover:bg-amber-800 transition whitespace-nowrap"
                  >
                    View Item →
                  </Link>
                </div>
              )}
            </div>

            {/* Order Summary & B2B Checkout Gate */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm sticky top-28 space-y-5">
                <h3 className="font-serif-luxury text-lg font-bold text-slate-950 pb-3 border-b border-slate-100">
                  Wholesale Order Summary
                </h3>

                <dl className="space-y-3 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Wholesale Subtotal</span>
                    <span className="font-bold text-slate-900">
                      {currency === "USD" ? `$${currentSubtotal.toFixed(2)}` : `£${currentSubtotal.toFixed(2)}`}
                    </span>
                  </div>

                  {volumeDiscountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold bg-emerald-50 p-2 rounded">
                      <span>Volume Bulk Tier Discount ({(volumeDiscountRate * 100).toFixed(0)}%)</span>
                      <span>
                        -{currency === "USD" ? `$${volumeDiscountAmount.toFixed(2)}` : `£${volumeDiscountAmount.toFixed(2)}`}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600">
                    <span>Transatlantic Express Dispatch</span>
                    <span>
                      {estimatedShippingFee === 0 ? (
                        <strong className="text-emerald-700 font-semibold">FREE (Over Tier MOQ)</strong>
                      ) : (
                        <span className="font-medium text-slate-800">
                          {currency === "USD" ? `$${estimatedShippingFee.toFixed(2)} (FedEx DDP)` : `£${estimatedShippingFee.toFixed(2)} (Royal Mail 24)`}
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Import Customs &amp; Duty Handling</span>
                    <span className="text-emerald-700 font-semibold">Prepaid DDP Included</span>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                    <span className="font-serif-luxury text-base font-bold text-slate-950">
                      Estimated Total ({currency})
                    </span>
                    <span className="text-2xl font-black text-slate-950">
                      {currency === "USD" ? `$${finalTotal.toFixed(2)}` : `£${finalTotal.toFixed(2)}`}
                    </span>
                  </div>
                </dl>

                {/* Checkout Trigger with Minimum Order Block */}
                <div>
                  {isMinimumMet ? (
                    <Link
                      href="/checkout"
                      className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider py-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                    >
                      <span>Proceed to Wholesale Checkout</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-slate-200 text-slate-400 font-bold text-xs uppercase tracking-wider py-4 rounded-xl cursor-not-allowed flex flex-col items-center justify-center gap-1"
                    >
                      <span>Checkout Locked ({minimumOrderFormatted} Minimum)</span>
                      <span className="text-[10px] lowercase font-normal text-amber-800">
                        Add {currency === "GBP" ? `£${remainingForMinimum.toFixed(2)}` : `$${remainingForMinimum.toFixed(2)}`} more to proceed
                      </span>
                    </button>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <span>🔒</span> 256-bit SSL encrypted wholesale checkout
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>📜</span> Full UK Assay Hallmarking compliance verified
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>🧾</span> Commercial VAT invoice provided upon payment
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
