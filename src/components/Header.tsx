"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrency } from "./CurrencyContext";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";

export default function Header() {
  const pathname = usePathname();
  const { currency, setCurrency, minimumOrderFormatted } = useCurrency();
  const { totalItemsCount, currentSubtotal, isMinimumMet, remainingForMinimum } = useCart();
  const { user, logout, demoLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  return (
    <>
      {/* Top Trade Notification Strip */}
      <div className="bg-slate-950 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-3 font-medium tracking-wide">
            <span className="inline-flex items-center gap-1.5 bg-amber-950/80 text-amber-300 border border-amber-800/60 px-2 py-0.5 rounded text-[11px] font-semibold">
              B2B TRADE ONLY
            </span>
            <span>
              Minimum Order {minimumOrderFormatted} • 100% Solid 925 Silver • UK Assay Hallmarked • US FTC Verified
            </span>
          </div>

          <div className="flex items-center gap-4 text-[12px]">
            {/* Currency Selector */}
            <div className="flex items-center bg-slate-900 border border-slate-750 rounded p-0.5">
              <button
                onClick={() => setCurrency("GBP")}
                className={`px-2 py-0.5 rounded transition font-medium flex items-center gap-1 ${
                  currency === "GBP"
                    ? "bg-slate-700 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="United Kingdom Pound Sterling"
              >
                <span>🇬🇧</span>
                <span>GBP (£)</span>
              </button>
              <button
                onClick={() => setCurrency("USD")}
                className={`px-2 py-0.5 rounded transition font-medium flex items-center gap-1 ${
                  currency === "USD"
                    ? "bg-slate-700 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="United States Dollar"
              >
                <span>🇺🇸</span>
                <span>USD ($)</span>
              </button>
            </div>

            {/* Quick Demo Switcher Pill */}
            <button
              onClick={() => setShowDemoModal(true)}
              className="text-amber-400 hover:text-amber-300 transition underline underline-offset-2 font-medium"
            >
              {user ? `Signed in: ${user.companyName}` : "Switch Account / Demo Logins"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Luxury Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex-shrink-0 flex flex-col">
              <Link href="/" className="group flex flex-col">
                <span className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-widest text-slate-950 group-hover:text-slate-700 transition">
                  ARGENT &amp; CO.
                </span>
                <span className="text-[10px] tracking-[0.25em] text-slate-500 uppercase font-medium">
                  Fine 925 Silver Wholesale • London &amp; New York
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7 text-sm font-medium text-slate-700">
              <Link
                href="/catalog"
                className={`transition hover:text-slate-950 ${
                  pathname === "/catalog" ? "text-slate-950 font-semibold border-b-2 border-slate-950 pb-0.5" : ""
                }`}
              >
                Wholesale Catalog
              </Link>
              <Link
                href="/hallmarking"
                className={`transition hover:text-slate-950 ${
                  pathname === "/hallmarking" ? "text-slate-950 font-semibold border-b-2 border-slate-950 pb-0.5" : ""
                }`}
              >
                Assay Hallmarking
              </Link>
              <Link
                href="/margin-calculator"
                className={`transition hover:text-slate-950 ${
                  pathname === "/margin-calculator" ? "text-slate-950 font-semibold border-b-2 border-slate-950 pb-0.5" : ""
                }`}
              >
                Profit Calculator
              </Link>
              <Link
                href="/guides/uk-retailers"
                className={`transition hover:text-slate-950 flex items-center gap-1 ${
                  pathname === "/guides/uk-retailers" ? "text-slate-950 font-semibold" : ""
                }`}
              >
                <span>🇬🇧</span> UK Sourcing
              </Link>
              <Link
                href="/guides/usa-retailers"
                className={`transition hover:text-slate-950 flex items-center gap-1 ${
                  pathname === "/guides/usa-retailers" ? "text-slate-950 font-semibold" : ""
                }`}
              >
                <span>🇺🇸</span> USA Boutiques
              </Link>
              <Link
                href="/admin"
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-2.5 py-1 rounded border border-slate-300 transition"
              >
                Merchant Admin
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Account State */}
              {user ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    href="/account"
                    className="flex flex-col text-right text-xs hover:opacity-80 transition"
                  >
                    <span className="font-semibold text-slate-900 truncate max-w-[140px]">{user.companyName}</span>
                    <span className="text-amber-700 font-medium text-[11px]">{user.tier}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="text-slate-400 hover:text-slate-700 text-xs border border-slate-200 rounded px-2 py-1"
                    title="Sign Out"
                  >
                    Exit
                  </button>
                </div>
              ) : (
                <Link
                  href="/account/login"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-900 border border-slate-300 hover:border-slate-900 px-3 py-2 rounded transition"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Trade Login</span>
                </Link>
              )}

              {/* Cart Drawer Trigger */}
              <Link
                href="/cart"
                className="relative inline-flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 px-4 py-2.5 rounded-lg shadow-sm transition group"
              >
                <svg className="w-5 h-5 text-slate-300 group-hover:text-white transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <div className="flex flex-col text-left">
                  <span className="text-[11px] uppercase tracking-wider text-slate-300 leading-none">Bag</span>
                  <span className="text-xs font-bold leading-tight">
                    {currency === "GBP" ? `£${currentSubtotal.toFixed(2)}` : `$${currentSubtotal.toFixed(2)}`}
                  </span>
                </div>
                {totalItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-slate-950 font-extrabold text-[11px] w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
                    {totalItemsCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Live Minimum Order Progress Bar */}
        <div className="bg-slate-100 border-t border-slate-200/60 px-4 py-1.5 text-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800">Wholesale MOQ Check:</span>
              {isMinimumMet ? (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Minimum order threshold unlocked! You are eligible for wholesale dispatch.
                </span>
              ) : (
                <span className="text-amber-800 font-medium">
                  Add <strong className="font-bold underline">{currency === "GBP" ? `£${remainingForMinimum.toFixed(2)}` : `$${remainingForMinimum.toFixed(2)}`}</strong> more to reach the {minimumOrderFormatted} wholesale minimum requirement.
                </span>
              )}
            </div>

            {/* Quick Micro Progress Meter */}
            <div className="w-full sm:w-48 bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  isMinimumMet ? "bg-emerald-600" : "bg-amber-600"
                }`}
                style={{
                  width: `${Math.min(100, (currentSubtotal / (currency === "GBP" ? 100 : 130)) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
            <Link
              href="/catalog"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-slate-800 py-1"
            >
              Wholesale Catalog
            </Link>
            <Link
              href="/hallmarking"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-slate-800 py-1"
            >
              Assay Hallmarking Guide
            </Link>
            <Link
              href="/margin-calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-slate-800 py-1"
            >
              Retail Profit Margin Calculator
            </Link>
            <Link
              href="/guides/uk-retailers"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-slate-800 py-1"
            >
              🇬🇧 UK Sourcing Guide
            </Link>
            <Link
              href="/guides/usa-retailers"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-slate-800 py-1"
            >
              🇺🇸 USA Boutiques Guide
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-semibold text-slate-900 py-1"
            >
              Merchant Admin Portal
            </Link>
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 bg-slate-900 text-white rounded font-medium text-sm"
              >
                Wholesale Account &amp; Orders
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Demo Account Modal for Fast Review & Testing */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="font-serif-luxury text-xl font-bold text-slate-950">
                Switch Wholesale Test Account
              </h3>
              <button
                onClick={() => setShowDemoModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 mt-3 mb-4 leading-relaxed">
              Test the platform from different business perspectives without typing credentials:
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  demoLogin("uk_retailer");
                  setCurrency("GBP");
                  setShowDemoModal(false);
                }}
                className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-slate-900 hover:bg-slate-50 transition flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                    <span>🇬🇧</span> Kensington Fine Jewels Ltd (London)
                  </div>
                  <div className="text-xs text-slate-500">UK Retailer • VAT Registered • Gold Tier</div>
                </div>
                <span className="text-xs font-semibold text-slate-900">Switch →</span>
              </button>

              <button
                onClick={() => {
                  demoLogin("us_boutique");
                  setCurrency("USD");
                  setShowDemoModal(false);
                }}
                className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-slate-900 hover:bg-slate-50 transition flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                    <span>🇺🇸</span> SoHo Mineral &amp; Silver Co. (New York)
                  </div>
                  <div className="text-xs text-slate-500">US Boutique • EIN Exemption • Diamond Tier</div>
                </div>
                <span className="text-xs font-semibold text-slate-900">Switch →</span>
              </button>

              <button
                onClick={() => {
                  demoLogin("admin");
                  setShowDemoModal(false);
                }}
                className="w-full text-left p-3 rounded-lg border border-amber-300 bg-amber-50/50 hover:bg-amber-100/60 transition flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                    <span>👑</span> Merchant &amp; Factory Admin Portal
                  </div>
                  <div className="text-xs text-slate-600">Full order management, product editor, status controls</div>
                </div>
                <span className="text-xs font-bold text-amber-900">Admin View →</span>
              </button>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowDemoModal(false)}
                className="text-xs text-slate-600 hover:text-slate-900 px-4 py-2 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
