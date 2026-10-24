"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCurrency } from "@/components/CurrencyContext";

export default function MarginCalculatorPage() {
  const { currency, minimumOrderFormatted } = useCurrency();

  const [wholesaleCost, setWholesaleCost] = useState(14.50);
  const [retailPrice, setRetailPrice] = useState(48.00);
  const [monthlyUnits, setMonthlyUnits] = useState(50);

  // Calculations
  const grossProfitPerUnit = Math.max(0, retailPrice - wholesaleCost);
  const profitMarginPercent = retailPrice > 0 ? ((grossProfitPerUnit / retailPrice) * 100) : 0;
  const markupMultiplier = wholesaleCost > 0 ? (retailPrice / wholesaleCost) : 0;
  const monthlyGrossProfit = grossProfitPerUnit * monthlyUnits;
  const annualGrossProfit = monthlyGrossProfit * 12;

  const symbol = currency === "USD" ? "$" : "£";

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-1">
            Free Retailer Business Tool
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-slate-950">
            Jewelry Boutique Retail Margin &amp; Markup Calculator
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl mx-auto leading-relaxed">
            Determine your true gross margins, markup multipliers, and annual cash returns when stocking direct-from-manufacturer 925 sterling silver.
          </p>
        </div>

        {/* Calculator Main Grid */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-10 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Input Controls */}
            <div className="md:col-span-6 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <label className="font-bold text-slate-800">Wholesale Unit Cost ({symbol})</label>
                  <span className="font-bold text-slate-950 font-mono text-sm">{symbol}{wholesaleCost.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="0.5"
                  value={wholesaleCost}
                  onChange={(e) => setWholesaleCost(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-950"
                />
                <span className="text-[11px] text-slate-400">Our wholesale prices range from £5.50 to £38.00</span>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <label className="font-bold text-slate-800">Target Retail Selling Price ({symbol})</label>
                  <span className="font-bold text-slate-950 font-mono text-sm">{symbol}{retailPrice.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="300"
                  step="1"
                  value={retailPrice}
                  onChange={(e) => setRetailPrice(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-950"
                />
                <span className="text-[11px] text-slate-400">Average UK &amp; US boutique markup is 3x to 4x cost</span>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <label className="font-bold text-slate-800">Estimated Monthly Units Sold</label>
                  <span className="font-bold text-slate-950 font-mono text-sm">{monthlyUnits} pcs</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="10"
                  value={monthlyUnits}
                  onChange={(e) => setMonthlyUnits(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-950"
                />
                <span className="text-[11px] text-slate-400">Across your online shop, store display, or pop-up</span>
              </div>
            </div>

            {/* Results Card */}
            <div className="md:col-span-6 bg-slate-950 text-white rounded-xl p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <span className="text-xs uppercase font-bold tracking-wider text-amber-400 block mb-1">
                  Gross Profit Margin
                </span>
                <div className="text-4xl font-black text-white">
                  {profitMarginPercent.toFixed(1)}%
                </div>
                <span className="text-xs text-slate-400 mt-1 block">
                  {markupMultiplier.toFixed(2)}x Retail Markup Factor
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Profit per Sold Piece</span>
                  <span className="text-xl font-bold text-emerald-400 mt-0.5 block">
                    {symbol}{grossProfitPerUnit.toFixed(2)}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block">Monthly Gross Profit</span>
                  <span className="text-xl font-bold text-white mt-0.5 block">
                    {symbol}{monthlyGrossProfit.toFixed(0)}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Annual Store Gross Revenue Contribution:</span>
                <div className="text-2xl font-bold text-amber-300">
                  {symbol}{annualGrossProfit.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ year</span>
                </div>
              </div>

              <Link
                href="/catalog"
                className="w-full bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs uppercase tracking-wider py-3 rounded-lg text-center block transition shadow-md"
              >
                Stock High-Margin Lines (MOQ {minimumOrderFormatted}) →
              </Link>
            </div>
          </div>
        </div>

        {/* SEO Guide on Jewelry Pricing Strategies */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-xs text-slate-600 leading-relaxed space-y-4">
          <h2 className="font-serif-luxury text-lg font-bold text-slate-900">
            How to Price Sterling Silver Jewelry for Maximum Retail Profitability
          </h2>
          <p>
            When operating an independent jewelry boutique or online e-commerce brand without large venture capital or ad budgets, pricing strategy is the single biggest determinant of survival. Many novice retailers make the mistake of keystone pricing (simply doubling their wholesale cost, e.g. 2x markup or 50% margin). In fine 925 sterling silver, because consumer perceived value is exceptionally high due to the precious metal weight and brilliant rhodium luster, experienced retailers consistently price at <strong>3.2x to 4x wholesale cost</strong>.
          </p>
          <p>
            By sourcing directly from primary manufacturers at Argent &amp; Co. with our accessible £100 ($130) minimum opening order, you capture direct factory margins rather than surrendering 30% of your margin to third-party jewelry distributors or trade show middlemen.
          </p>
        </div>
      </div>
    </div>
  );
}
