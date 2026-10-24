import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "UK Assay Office Hallmarking & US FTC Purity Guide | Wholesale Silver",
  description:
    "Comprehensive guide for jewelry retailers on the UK Hallmarking Act 1973, 925 millesimal fineness standards, Assay Office marks, and US FTC precious metals compliance.",
};

export default function HallmarkingPage() {
  return (
    <div className="bg-[#FAF9F6] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-1">
            Precious Metals Compliance &amp; Standards
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-slate-950">
            The Retailer&apos;s Guide to UK Hallmarking &amp; 925 Silver Purity
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl mx-auto leading-relaxed">
            Understanding the legal requirements for selling precious metals in the United Kingdom and United States.
          </p>
        </div>

        {/* 4 Compulsory UK Assay Marks Visual Showcase */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-10 mb-12 space-y-8">
          <div>
            <h2 className="font-serif-luxury text-xl font-bold text-slate-950 mb-2">
              The Anatomy of an Authentic UK Hallmark
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Under the UK Hallmarking Act 1973, it is an offense to describe any article as sterling silver if it weighs over 7.78 grams unless it has been assayed by an independent UK Assay Office and bears the official hallmarks:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            {/* Mark 1 */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-slate-900 text-amber-400 font-mono font-bold flex items-center justify-center mx-auto text-sm border border-amber-500/30">
                ARG
              </div>
              <h3 className="font-bold text-slate-900 uppercase">1. Sponsor&apos;s Mark</h3>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Unique initials inside a shield indicating the registered silversmith or manufacturer (Argent &amp; Co.).
              </p>
            </div>

            {/* Mark 2 */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-slate-900 text-amber-400 font-mono font-bold flex items-center justify-center mx-auto text-sm border border-amber-500/30">
                925
              </div>
              <h3 className="font-bold text-slate-900 uppercase">2. Standard Fineness</h3>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Denotes guaranteed 925 parts pure silver per 1,000 (sterling silver alloyed with 7.5% copper for structural tensile strength).
              </p>
            </div>

            {/* Mark 3 */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-slate-900 text-amber-400 font-mono font-bold flex items-center justify-center mx-auto text-sm border border-amber-500/30">
                ⚓ / 🐆
              </div>
              <h3 className="font-bold text-slate-900 uppercase">3. Assay Town Mark</h3>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                The London Leopard&apos;s Head or Birmingham Anchor certifying independent metallurgical assay verification.
              </p>
            </div>
          </div>

          {/* Legal Notice Callout */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-xs text-amber-950 space-y-2">
            <h4 className="font-bold uppercase tracking-wide flex items-center gap-2">
              <span>⚖️</span> The 7.78-Gram Weight Exemption Rule Explained
            </h4>
            <p className="leading-relaxed">
              In the United Kingdom, articles of silver that weigh <strong>less than 7.78 grams</strong> are legally exempt from mandatory assay office hallmarking, though they still must be of genuine 925 purity and carry a &ldquo;925&rdquo; stamp. Any heavy chain, solid bangle, or chunky cuff exceeding 7.78 grams <em>must</em> bear full UK hallmarks before being displayed for retail sale. At Argent &amp; Co., all eligible items are assayed prior to dispatch.
            </p>
          </div>
        </div>

        {/* USA FTC Standards Section */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-10 mb-12 space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🇺🇸</span>
            <div>
              <h2 className="font-serif-luxury text-xl font-bold text-slate-950">
                United States Federal Trade Commission (FTC) Standards
              </h2>
              <p className="text-xs text-slate-500">Commercial compliance for US boutiques and department stores</p>
            </div>
          </div>

          <div className="text-xs text-slate-600 leading-relaxed space-y-4">
            <p>
              In the United States, precious metal jewelry is regulated by Title 16 of the Code of Federal Regulations (Part 23 — Guides for the Jewelry, Precious Metals, and Pewter Industries). To be labeled as &ldquo;Solid Sterling Silver&rdquo;, articles must contain at least 92.5% pure silver with zero deceptive plating.
            </p>
            <p>
              Furthermore, all Argent &amp; Co. items shipped to the US are rigorously tested for <strong>California Proposition 65</strong> lead content (less than 0.05% lead by weight) and European/US nickel release limits, guaranteeing they are completely safe for sensitive skin and piercing studios.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-xs font-semibold text-slate-800">
              Ready to stock fully certified sterling silver with £100 / $130 MOQ?
            </span>
            <Link
              href="/catalog"
              className="bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg transition shadow-sm whitespace-nowrap"
            >
              Explore Hallmarked Catalog →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
