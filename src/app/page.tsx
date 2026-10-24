"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PRODUCTS, CATEGORIES } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { useCurrency } from "@/components/CurrencyContext";
import JsonLd, { FAQ_SCHEMA } from "@/components/JsonLd";

export default function HomePage() {
  const { currency, formatPrice, minimumOrderFormatted } = useCurrency();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const filteredProducts =
    selectedCategory === "All"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === selectedCategory);

  const faqs = [
    {
      q: "What is your wholesale minimum order value for UK and USA jewelers?",
      a: "Our minimum order value is strictly £100 GBP for UK buyers and $130 USD for USA retail partners. Unlike legacy jewelry manufacturers that demand £1,000+ opening orders, our low threshold allows independent boutiques, piercing shops, and online brands to test trending designs and restock bestsellers with minimal capital risk.",
    },
    {
      q: "Are your silver jewelry collections certified under the UK Hallmarking Act 1973?",
      a: "Yes, 100%. In compliance with UK law, any silver item weighing over 7.78 grams is legally tested and struck by either the London or Birmingham Assay Office with the complete 925 fineness mark, assay town mark, and official sponsor mark. Each shipment includes an Assay Office verification declaration.",
    },
    {
      q: "How does shipping work to the United States and United Kingdom?",
      a: "For UK orders, we dispatch via Royal Mail Special Delivery Guaranteed by 1pm or DPD Express (1-2 business days). For US orders, we dispatch via FedEx International Priority DDP (Delivered Duty Paid), meaning all US import customs clearance and documentation are handled in advance, arriving within 2 to 4 business days.",
    },
    {
      q: "What profit margins can retail boutique owners expect?",
      a: "Our factory-direct wholesale pricing is structured to give retailers healthy 65% to 75% gross profit margins (a 3x to 4x markup over wholesale cost). For example, our Solid 925 Liquid Herringbone Chain wholesales at £14.50 ($18.85) and commands a recommended retail price of £48.00 ($62.00).",
    },
    {
      q: "Do you offer bulk volume discounts above the £100 minimum order?",
      a: "Yes! In addition to our base wholesale prices, we provide automatic tiered cart discounts: 5% off orders exceeding £250 ($325), 10% off orders exceeding £500 ($650), and 15% off orders exceeding £1,000 ($1,300), plus free express courier shipping.",
    },
    {
      q: "Are the jewelry pieces treated to prevent silver tarnishing?",
      a: "Every piece of solid 925 silver is finished with our advanced galvanic micro-rhodium dip or optical clear e-coating barrier. This shields against moisture, skin oils, and ambient sulfur, providing up to 10x longer display-case shelf-life without dulling.",
    },
  ];

  return (
    <div>
      <JsonLd data={FAQ_SCHEMA} />

      {/* Hero Section */}
      <section className="relative bg-slate-950 text-white overflow-hidden py-20 lg:py-28 border-b border-slate-800">
        {/* Background Ambient Glow & Visual Accent */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-slate-400 rounded-full blur-[140px]" />
          <div className="absolute top-1/2 -right-40 w-96 h-96 bg-amber-400/20 rounded-full blur-[160px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6">
              <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-700/80 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold text-slate-300 max-w-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                <span className="truncate">UK &amp; USA Trade Sourcing • Certified 925 Solid Silver</span>
              </div>

              <h1 className="font-serif-luxury text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
                Direct-From-Manufacturer <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-300 to-amber-200">
                  Solid 925 Silver Wholesale.
                </span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl font-light leading-relaxed">
                Empowering independent UK &amp; US jewelry boutiques, luxury department stores, and online retailers with factory-direct pricing, certified UK Assay Hallmarks, and an accessible <strong className="text-white font-bold underline underline-offset-4 decoration-amber-400">{minimumOrderFormatted} minimum order</strong>.
              </p>

              {/* Key Bullet Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 pt-1 sm:pt-2 text-xs font-medium text-slate-300">
                <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-amber-400 text-sm font-bold flex-shrink-0">✓</span>
                  <span>MOQ: {minimumOrderFormatted} Only</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-amber-400 text-sm font-bold flex-shrink-0">✓</span>
                  <span>UK Assay Hallmarked</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-amber-400 text-sm font-bold flex-shrink-0">✓</span>
                  <span>US DDP Customs Paid</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <Link
                  href="/catalog"
                  className="bg-white hover:bg-slate-100 text-slate-950 font-bold px-6 py-3.5 rounded-lg transition shadow-lg flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-wider"
                >
                  <span>Browse Wholesale Catalog</span>
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>

                <Link
                  href="/margin-calculator"
                  className="bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-semibold px-6 py-3.5 rounded-lg border border-slate-700 transition text-xs sm:text-sm flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span>Calculate Retail Margins</span>
                </Link>
              </div>
            </div>

            {/* Right Hero Product Feature Showcase */}
            <div className="lg:col-span-5">
              <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-6 shadow-2xl overflow-hidden group">
                <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-5">
                  <Image
                    src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80"
                    alt="Solid 925 Sterling Silver Liquid Herringbone Wholesale"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-md text-amber-300 text-xs font-bold px-3 py-1 rounded border border-amber-500/30">
                    Bestseller • 72% Margin
                  </div>
                  <div className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur-md text-white text-xs font-medium px-3 py-1 rounded border border-slate-700">
                    Solid 925 • 11.4g
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-serif-luxury text-lg font-bold text-white">
                      Liquid Herringbone Snake Chain
                    </h3>
                    <span className="text-amber-400 font-bold text-lg">
                      {formatPrice(14.50)} <span className="text-xs font-normal text-slate-400">/ unit</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    Italian-machined solid 925 silver with mirror rhodium finish. Recommended retail price: {formatPrice(48.00)} (+230% markup).
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
                    <span className="text-slate-400">Starting pack: 3 pcs ({formatPrice(43.50)})</span>
                    <Link
                      href="/product/slv-001"
                      className="text-amber-400 hover:text-amber-300 font-bold underline underline-offset-4 flex items-center gap-1"
                    >
                      View Line Specs →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Guarantees Bar */}
      <section className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 font-bold flex-shrink-0">
                £100
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Low Minimum Order
                </h4>
                <p className="text-xs text-slate-500">Only £100 / $130 opening basket</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 font-bold flex-shrink-0">
                925
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  UK Assay Certified
                </h4>
                <p className="text-xs text-slate-500">Hallmarking Act 1973 compliance</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 font-bold flex-shrink-0">
                ✈️
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Fast Transatlantic DDP
                </h4>
                <p className="text-xs text-slate-500">UK 24h &amp; USA 2-3 Days FedEx</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 font-bold flex-shrink-0">
                📊
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  High Retail Margins
                </h4>
                <p className="text-xs text-slate-500">Built-in 65-75% gross boutique profit</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Wholesale Catalog Grid */}
      <section className="py-16 bg-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-1">
                Curated Line-Sheet
              </span>
              <h2 className="font-serif-luxury text-3xl font-bold text-slate-950">
                Trending Wholesale Silver Collections
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                All prices reflect wholesale trade rates. Add any combination to meet the {minimumOrderFormatted} MOQ.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0 sm:flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-3.5 py-1.5 rounded-full transition font-medium whitespace-nowrap ${
                    selectedCategory === cat
                      ? "bg-slate-950 text-white shadow-sm font-semibold"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-lg shadow-sm transition"
            >
              <span>Explore All Wholesale Categories &amp; Bulk Packs</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Dual UK & USA Sourcing Value Pillars */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-2">
              Cross-Border Trade Infrastructure
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-slate-950">
              Engineered Specifically for UK &amp; US Boutiques
            </h2>
            <p className="text-slate-600 text-sm mt-3">
              We eliminate the friction, confusing tariffs, and legal compliance hurdles of sourcing fine sterling silver.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* UK Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">🇬🇧</span>
                <span className="text-xs bg-slate-200 text-slate-800 font-bold px-2.5 py-1 rounded">
                  UK Retail Partners
                </span>
              </div>
              <h3 className="font-serif-luxury text-xl font-bold text-slate-950 mb-3">
                London &amp; Birmingham Assay Office Compliance
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Selling un-hallmarked silver in the UK over 7.78g is illegal under the Hallmarking Act 1973. Every heavy Argent &amp; Co. piece carries verified UK hallmarks stamped by certified assay masters, protecting your boutique from trading standards liability.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-700 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Full UK VAT commercial tax invoices with reverse-charge support</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Royal Mail Special Delivery Guaranteed by 1pm next-day dispatch</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Low £100 minimum order volume to keep boutique cash flow liquid</span>
                </li>
              </ul>
              <Link
                href="/guides/uk-retailers"
                className="text-xs font-bold text-slate-950 hover:text-amber-700 transition underline underline-offset-4"
              >
                Read UK Wholesale Sourcing &amp; VAT Guide →
              </Link>
            </div>

            {/* USA Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">🇺🇸</span>
                <span className="text-xs bg-slate-200 text-slate-800 font-bold px-2.5 py-1 rounded">
                  USA Boutique Partners
                </span>
              </div>
              <h3 className="font-serif-luxury text-xl font-bold text-slate-950 mb-3">
                Prepaid DDP Shipping &amp; US FTC Standards
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Never deal with unexpected customs invoices or freight agent delays. We ship all transatlantic US orders DDP (Delivered Duty Paid) via FedEx Priority. Our solid silver meets strict US FTC guides and is certified nickel-free and lead-free.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-700 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Tax-free international wholesale export with Resale Certificate support</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>2 to 4 business days direct FedEx Priority door-to-door delivery</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Low $130 USD minimum order with tiered volume discounts</span>
                </li>
              </ul>
              <Link
                href="/guides/usa-retailers"
                className="text-xs font-bold text-slate-950 hover:text-amber-700 transition underline underline-offset-4"
              >
                Read USA Boutique Importing Guide →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Deep Article & Trade Authority Section (Crucial For Ranking When Not Running Ads) */}
      <section className="py-20 bg-slate-950 text-slate-300 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-b border-slate-800 pb-8 mb-10 text-center">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
              B2B Industry Insights &amp; Market Standards
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white">
              Why Independent Jewelers Choose Factory-Direct 925 Wholesale
            </h2>
          </div>

          <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 leading-relaxed space-y-6">
            <p>
              In today&apos;s retail environment, independent jewelry stores, high-street boutiques, and e-commerce founders in the UK and United States face severe margin compression from high advertising costs and middlemen markups. Sourcing solid <strong>925 sterling silver jewelry wholesale</strong> directly from a primary manufacturer gives retailers the critical 65% to 75% gross margins needed to run profitable retail operations without being dependent on expensive PPC or social media ads.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8 not-prose">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                <h3 className="font-serif-luxury text-base font-bold text-white mb-2">
                  The Power of a £100 ($130) Minimum Order
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Traditional jewelry distributors hold boutique owners hostage with exorbitant £1,000 to £2,500 minimum orders, forcing retailers to sink cash into unproven inventory. Argent &amp; Co.&apos;s £100 policy allows retailers to curate high-frequency weekly micro-drops, test customer appetite on new styles, and preserve vital operating cash flow.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
                <h3 className="font-serif-luxury text-base font-bold text-white mb-2">
                  Assay Hallmarking: Legal Protection for Retailers
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Under the UK Hallmarking Act 1973, it is a criminal offense to describe an item as &ldquo;sterling silver&rdquo; if it exceeds 7.78 grams unless officially struck by a recognized Assay Office. We take complete legal responsibility for certifying every eligible product, guaranteeing authentic 925 purity and consumer peace of mind.
                </p>
              </div>
            </div>

            <p>
              Furthermore, all our sterling silver articles receive an electrolytic micro-rhodium protective barrier. Because raw sterling silver naturally oxidizes when exposed to sulfur in ambient air, this advanced finish eliminates tarnishing while items sit inside illuminated glass jewelry showcases, drastically cutting down store maintenance time and inventory loss.
            </p>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (Structured FAQ Accordion for Google Snippets) */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-1">
              Clear Trade Answers
            </span>
            <h2 className="font-serif-luxury text-3xl font-bold text-slate-950">
              Frequently Asked Wholesale Questions
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              Everything UK and US boutique buyers need to know about our minimums, terms, and delivery.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-5 bg-white hover:bg-slate-50 flex justify-between items-center gap-4 transition"
                >
                  <span className="font-serif-luxury font-bold text-slate-900 text-base">
                    {faq.q}
                  </span>
                  <span className="text-slate-400 font-mono text-xl flex-shrink-0">
                    {openFaq === idx ? "−" : "+"}
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-0 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    <p className="pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Wholesale Registration CTA */}
          <div className="mt-16 bg-slate-950 text-white rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden">
            <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold mb-3">
              Ready to Expand Your Silver Jewelry Collection?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mb-6">
              Create your trade account today. Open with our accessible {minimumOrderFormatted} minimum order and receive your verified wholesale shipment in 1-3 business days.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/account/register"
                className="bg-white hover:bg-slate-100 text-slate-950 font-bold px-8 py-3.5 rounded-lg text-xs uppercase tracking-wider transition shadow-md"
              >
                Apply for Trade Account
              </Link>
              <Link
                href="/catalog"
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-8 py-3.5 rounded-lg border border-slate-700 text-xs uppercase tracking-wider transition"
              >
                Explore Current Inventory
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
