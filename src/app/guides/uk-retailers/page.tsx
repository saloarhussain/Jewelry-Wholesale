import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "UK Wholesale Silver Jewelry Sourcing & VAT Guide | London B2B",
  description:
    "Complete B2B sourcing guide for British jewelry retailers. Learn how to source 925 sterling silver with £100 minimum order, UK Assay Hallmarking compliance, and VAT invoice management.",
  keywords: [
    "wholesale silver jewelry UK",
    "sterling silver suppliers London",
    "UK hallmarked silver wholesale",
    "minimum order 100 pounds silver jewelry",
    "Hatton Garden wholesale silver"
  ]
};

export default function UkRetailersGuidePage() {
  return (
    <div className="bg-[#FAF9F6] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <nav className="text-xs text-slate-500 mb-2 flex items-center gap-1.5 font-medium">
            <Link href="/" className="hover:text-slate-900 transition">Trade Home</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">UK Sourcing Guide</span>
          </nav>

          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-1">
            British Retail Trade Guide
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-slate-950">
            Wholesale Sterling Silver Jewelry Sourcing for UK Retailers
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            How independent UK boutiques, gift shops, and jewelers maintain 70%+ gross margins with £100 minimum orders and certified Assay Office compliance.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8 sm:p-12 space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif-luxury text-xl font-bold text-slate-950">
              The British Jewelry Landscape in 2026: Sourcing Smarter
            </h2>
            <p>
              Operating a high-street jewelry store or boutique in London, Manchester, Edinburgh, or regional market towns requires agile cash management. With rising business rates and store utility overheads, tying up £2,000+ in massive minimum opening orders from traditional trade fairs like Spring Fair or Autumn Fair is no longer viable for modern independent retailers.
            </p>
            <p>
              Argent &amp; Co. pioneered the <strong>accessible £100 minimum order</strong> model for British jewelers. This allows store owners to rotate collections every two weeks, reacting immediately to trending viral silver chains, bold dome rings, and baroque pearl pendants without surplus dead-stock risk.
            </p>
          </section>

          <section className="space-y-3 bg-slate-50 border border-slate-200 p-6 rounded-xl">
            <h2 className="font-serif-luxury text-lg font-bold text-slate-950">
              UK Value-Added Tax (VAT) &amp; Commercial Invoicing
            </h2>
            <p>
              Every wholesale order placed through our B2B portal generates a full HMRC-compliant Commercial VAT Invoice detailing:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
              <li>Our registered UK VAT number: <strong>GB 882 104 221</strong></li>
              <li>Your boutique&apos;s registered VAT number (if registered) for seamless input tax reclamation on your quarterly VAT return</li>
              <li>Complete line-item breakdown showing net wholesale cost, applicable VAT, and carriage</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-luxury text-xl font-bold text-slate-950">
              Fast Royal Mail Special Delivery Guaranteed by 1pm
            </h2>
            <p>
              All mainland UK wholesale orders are packed inside our Hatton Garden facility and dispatched via <strong>Royal Mail Special Delivery Guaranteed by 1pm</strong> or DPD Next Day Courier. Every parcel is fully insured up to £2,500 with real-time GPS tracking and signature required upon delivery to your retail counter.
            </p>
          </section>

          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <span className="font-bold text-slate-900 block text-xs">Open your wholesale trade account today</span>
              <span className="text-slate-500 text-xs">Minimum opening basket: £100 • 24h Next-Day Dispatch</span>
            </div>
            <Link
              href="/catalog"
              className="bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg transition shadow-md whitespace-nowrap"
            >
              Browse UK Wholesale Stock →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
