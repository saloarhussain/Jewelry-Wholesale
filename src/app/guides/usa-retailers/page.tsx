import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "USA Wholesale Silver Jewelry Importing & Tariff Guide | B2B",
  description:
    "Guide for American boutique owners and jewelry stores importing solid 925 sterling silver from certified manufacturers. DDP shipping, US FTC compliance, and $130 MOQ.",
  keywords: [
    "wholesale sterling silver jewelry USA",
    "925 silver jewelry bulk suppliers USA",
    "importing silver jewelry to USA DDP",
    "wholesale jewelry minimum order 100",
    "sterling silver jewelry distributor New York"
  ]
};

export default function UsaRetailersGuidePage() {
  return (
    <div className="bg-[#FAF9F6] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <nav className="text-xs text-slate-500 mb-2 flex items-center gap-1.5 font-medium">
            <Link href="/" className="hover:text-slate-900 transition">Trade Home</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">USA Importing Guide</span>
          </nav>

          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-1">
            North American Trade Guide
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-slate-950">
            Wholesale Silver Jewelry Importing for US Boutiques
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            How US jewelry retailers, online brands, and piercing salons import solid 925 sterling silver with zero tariff surprises and a low $130 USD minimum order.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8 sm:p-12 space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif-luxury text-xl font-bold text-slate-950">
              Why US Boutiques Source Direct Across the Atlantic
            </h2>
            <p>
              American independent fashion boutiques and jewelry curators in New York, Los Angeles, Miami, Austin, and Chicago frequently struggle with domestic US wholesalers who mark up items 50% to 80% without offering authentic European craftsmanship or Assay-certified silver purity.
            </p>
            <p>
              By ordering directly through Argent &amp; Co., US retailers receive virgin solid 925 sterling silver articles produced to stringent European environmental and metallurgical standards, while capturing the full manufacturer-direct margin (averaging a 3.5x to 4x retail markup).
            </p>
          </section>

          <section className="space-y-3 bg-slate-50 border border-slate-200 p-6 rounded-xl">
            <h2 className="font-serif-luxury text-lg font-bold text-slate-950">
              Delivered Duty Paid (DDP) Express Shipping via FedEx
            </h2>
            <p>
              One of the biggest concerns for US store owners importing precious metals is unexpected customs tariffs, border brokerage fees, and freight delays.
            </p>
            <p>
              Argent &amp; Co. operates strictly on a <strong>DDP (Delivered Duty Paid)</strong> basis. When you complete your wholesale checkout in USD ($), all US Customs entry fees, formal broker clearances, and HTS Code 7113 classifications are prepaid. Your parcel arrives directly at your store door via FedEx International Priority in <strong>2 to 4 business days</strong> with zero surprise invoices.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-luxury text-xl font-bold text-slate-950">
              State Sales Tax Exemption &amp; Resale Certificates
            </h2>
            <p>
              Because your order is for resale purposes, US retailers holding a state sales tax resale license (or valid federal EIN) are exempt from sales tax. All export shipments from our facilities are zero-rated for UK VAT, providing clean, tax-efficient commercial inventory acquisitions.
            </p>
          </section>

          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <span className="font-bold text-slate-900 block text-xs">Start with our accessible $130 USD minimum order</span>
              <span className="text-slate-500 text-xs">Prepaid DDP Customs • FedEx 2-4 Day Delivery</span>
            </div>
            <Link
              href="/catalog"
              className="bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg transition shadow-md whitespace-nowrap"
            >
              Explore Wholesale Inventory in USD →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
