"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hallmarking & Compliance Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-bold flex-shrink-0">
              925
            </div>
            <div>
              <h4 className="font-semibold text-white uppercase tracking-wider text-xs mb-1">
                UK Hallmarking Act 1973
              </h4>
              <p className="text-slate-400 leading-relaxed">
                All articles exceeding 7.78 grams are assayed and stamped by the London or Birmingham Assay Office. 100% solid sterling silver guaranteed.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-bold flex-shrink-0">
              FTC
            </div>
            <div>
              <h4 className="font-semibold text-white uppercase tracking-wider text-xs mb-1">
                US FTC Precious Metals Standards
              </h4>
              <p className="text-slate-400 leading-relaxed">
                Fully compliant with US Federal Trade Commission jewelry guides. Hypoallergenic, nickel-free, and lead-free compliant for California Prop 65.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-bold flex-shrink-0">
              DDP
            </div>
            <div>
              <h4 className="font-semibold text-white uppercase tracking-wider text-xs mb-1">
                Prepaid Import Customs (UK &amp; USA)
              </h4>
              <p className="text-slate-400 leading-relaxed">
                All transatlantic orders ship DDP (Delivered Duty Paid). No surprise customs fees or import clearance hold-ups for your boutique.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <span className="font-serif-luxury text-2xl font-bold tracking-widest text-white block">
              ARGENT &amp; CO.
            </span>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Direct-from-manufacturer fine 925 sterling silver wholesale jewelry. Trusted by over 1,200 independent jewelry boutiques, gift stores, and luxury e-commerce brands across the United Kingdom and North America.
            </p>
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">🇬🇧 London Trade Showroom:</span> 34 Hatton Garden, London EC1N 8DH
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">🇺🇸 New York Distribution:</span> 580 5th Avenue, Suite 1200, New York, NY 10036
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">Trade Inquiries:</span> trade@argent-wholesale.com
              </div>
            </div>
          </div>

          {/* Wholesale Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Wholesale Lines
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/catalog?cat=Chains" className="hover:text-white transition">
                  Solid 925 Silver Chains
                </Link>
              </li>
              <li>
                <Link href="/catalog?cat=Rings" className="hover:text-white transition">
                  Wholesale Sterling Rings
                </Link>
              </li>
              <li>
                <Link href="/catalog?cat=Earrings" className="hover:text-white transition">
                  Pavé Huggies &amp; Studs
                </Link>
              </li>
              <li>
                <Link href="/catalog?cat=Bracelets" className="hover:text-white transition">
                  Heavy Silver Cuffs &amp; Bangles
                </Link>
              </li>
              <li>
                <Link href="/catalog?cat=Necklaces" className="hover:text-white transition">
                  Freshwater Pearl Pendants
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="hover:text-white transition font-medium text-amber-400">
                  View Full Catalog (MOQ £100) →
                </Link>
              </li>
            </ul>
          </div>

          {/* B2B Resources & SEO Hubs */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              B2B Retail Resources
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/margin-calculator" className="hover:text-white transition">
                  Retail Profit Margin Calculator
                </Link>
              </li>
              <li>
                <Link href="/hallmarking" className="hover:text-white transition">
                  Assay Hallmarking Guide
                </Link>
              </li>
              <li>
                <Link href="/guides/uk-retailers" className="hover:text-white transition">
                  UK Sourcing &amp; VAT Guide
                </Link>
              </li>
              <li>
                <Link href="/guides/usa-retailers" className="hover:text-white transition">
                  US Importing &amp; Tariffs Guide
                </Link>
              </li>
              <li>
                <Link href="/account/register" className="hover:text-white transition">
                  Apply for Wholesale Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Trade Newsletter & MOQ Info */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Wholesale Drop Alerts
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Receive private line-sheets, upcoming silver cast releases, and spot silver market margin updates.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Thank you. Trade lookbook dispatched to your email."); }} className="space-y-2">
              <input
                type="email"
                placeholder="store@yourboutique.com"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="w-full bg-slate-100 hover:bg-white text-slate-950 font-bold text-xs py-2 rounded transition"
              >
                Subscribe to Lookbooks
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar with Natural SEO Keyword Anchor Tags */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-[11px] text-slate-400 gap-4">
          <div>
            © {new Date().getFullYear()} Argent &amp; Co. Wholesale Ltd. All rights reserved. Registered in England &amp; Wales (Co. 11928401).
          </div>
          <div className="flex flex-wrap gap-4 text-slate-400">
            <span>Wholesale Silver Jewelry UK</span>
            <span>•</span>
            <span>925 Sterling Silver Bulk USA</span>
            <span>•</span>
            <span>Minimum Order £100 ($130)</span>
            <span>•</span>
            <span>B2B Jewelry Manufacturer</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
