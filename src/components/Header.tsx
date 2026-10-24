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
      {/* Top Trade Notification Strip - Ultra Responsive */}
      <div className="bg-slate-950 text-slate-200 text-xs py-2 px-3 sm:px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2 text-center md:text-left">
          {/* Trade Message */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2.5 font-medium tracking-wide text-[11px] sm:text-xs">
            <span className="inline-flex items-center bg-amber-950/90 text-amber-300 border border-amber-800/80 px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
              B2B Trade Only
            </span>
            <span className="text-slate-300">
              Min Order <strong className="text-white font-bold">{minimumOrderFormatted}</strong>
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="hidden sm:inline text-slate-300">100% Solid 925 Silver</span>
            <span className="hidden lg:inline text-slate-600">•</span>
            <span className="hidden lg:inline text-slate-300">UK Assay Hallmarked • US FTC Verified</span>
          </div>

          {/* Currency & Demo Buttons */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs w-full sm:w-auto justify-between sm:justify-end pt-1 md:pt-0 border-t border-slate-800/80 md:border-t-0">
            {/* Currency Selector */}
            <div className="inline-flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5">
              <button
                onClick={() => setCurrency("GBP")}
                className={`px-2 py-0.5 rounded text-[11px] sm:text-xs transition font-semibold flex items-center gap-1 ${
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
                className={`px-2 py-0.5 rounded text-[11px] sm:text-xs transition font-semibold flex items-center gap-1 ${
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
              className="text-[11px] sm:text-xs text-amber-400 hover:text-amber-300 transition underline underline-offset-2 font-medium truncate max-w-[170px] sm:max-w-none"
            >
              {user ? `Account: ${user.companyName}` : "Demo Logins"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Luxury Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
            {/* Left: Mobile hamburger menu trigger */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 sm:p-2 text-slate-700 hover:text-slate-950 focus:outline-none rounded-lg hover:bg-slate-100 transition"
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

            {/* Brand Logo - Responsive & Non-overflowing */}
            <div className="flex-1 lg:flex-initial min-w-0 pr-2">
              <Link href="/" className="group flex flex-col">
                <span className="font-serif-luxury text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-wider sm:tracking-widest text-slate-950 group-hover:text-slate-700 transition truncate">
                  ARGENT &amp; CO.
                </span>
                <span className="text-[8px] sm:text-[10px] tracking-[0.15em] sm:tracking-[0.25em] text-slate-500 uppercase font-medium truncate">
                  Fine 925 Silver Wholesale • UK &amp; USA
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-7 text-xs xl:text-sm font-medium text-slate-700 whitespace-nowrap">
              <Link
                href="/catalog"
                className={`transition hover:text-slate-950 ${
                  pathname === "/catalog" ? "text-slate-950 font-bold border-b-2 border-slate-950 pb-0.5" : ""
                }`}
              >
                Wholesale Catalog
              </Link>
              <Link
                href="/hallmarking"
                className={`transition hover:text-slate-950 ${
                  pathname === "/hallmarking" ? "text-slate-950 font-bold border-b-2 border-slate-950 pb-0.5" : ""
                }`}
              >
                Assay Hallmarking
              </Link>
              <Link
                href="/margin-calculator"
                className={`transition hover:text-slate-950 ${
                  pathname === "/margin-calculator" ? "text-slate-950 font-bold border-b-2 border-slate-950 pb-0.5" : ""
                }`}
              >
                Profit Calculator
              </Link>
              <Link
                href="/guides/uk-retailers"
                className={`transition hover:text-slate-950 flex items-center gap-1 ${
                  pathname === "/guides/uk-retailers" ? "text-slate-950 font-bold" : ""
                }`}
              >
                <span>🇬🇧</span> UK Sourcing
              </Link>
              <Link
                href="/guides/usa-retailers"
                className={`transition hover:text-slate-950 flex items-center gap-1 ${
                  pathname === "/guides/usa-retailers" ? "text-slate-950 font-bold" : ""
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

            {/* Right Side Actions - Always visible and aligned on mobile */}
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              {/* Account State (Desktop) */}
              {user ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    href="/account"
                    className="flex flex-col text-right text-xs hover:opacity-80 transition"
                  >
                    <span className="font-semibold text-slate-900 truncate max-w-[120px] lg:max-w-[150px]">{user.companyName}</span>
                    <span className="text-amber-700 font-medium text-[10px]">{user.tier}</span>
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

              {/* Cart Button - Sized for mobile and desktop */}
              <Link
                href="/cart"
                className="relative inline-flex items-center gap-1.5 sm:gap-2 bg-slate-950 text-white hover:bg-slate-800 p-2 sm:px-4 sm:py-2.5 rounded-lg shadow-sm transition group"
                aria-label="View Wholesale Bag"
              >
                <svg className="w-5 h-5 text-slate-300 group-hover:text-white transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 leading-none">Bag</span>
                  <span className="text-xs font-bold leading-tight">
                    {currency === "GBP" ? `£${currentSubtotal.toFixed(2)}` : `$${currentSubtotal.toFixed(2)}`}
                  </span>
                </div>
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
                    {totalItemsCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Live Minimum Order Progress Bar - Mobile Optimized */}
        <div className="bg-slate-100 border-t border-slate-200/80 px-3 sm:px-6 py-2 text-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5 sm:gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
              <span className="font-bold text-slate-800 whitespace-nowrap text-[11px] sm:text-xs">MOQ Check:</span>
              {isMinimumMet ? (
                <span className="text-emerald-700 font-bold text-[11px] sm:text-xs flex items-center gap-1 truncate">
                  <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="truncate">Wholesale minimum threshold unlocked!</span>
                </span>
              ) : (
                <span className="text-amber-900 font-medium text-[11px] sm:text-xs truncate">
                  Add <strong className="font-bold underline">{currency === "GBP" ? `£${remainingForMinimum.toFixed(2)}` : `$${remainingForMinimum.toFixed(2)}`}</strong> more to meet {minimumOrderFormatted} MOQ.
                </span>
              )}
            </div>

            {/* Micro Progress Meter */}
            <div className="w-full sm:w-44 bg-slate-200/90 h-2 rounded-full overflow-hidden flex-shrink-0">
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
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <Link
              href="/catalog"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-900 py-2 border-b border-slate-100"
            >
              Wholesale Catalog
            </Link>
            <Link
              href="/hallmarking"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-700 py-2 border-b border-slate-100"
            >
              Assay Hallmarking Guide
            </Link>
            <Link
              href="/margin-calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-700 py-2 border-b border-slate-100"
            >
              Retail Profit Margin Calculator
            </Link>
            <Link
              href="/guides/uk-retailers"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-700 py-2 border-b border-slate-100"
            >
              🇬🇧 UK Sourcing Guide
            </Link>
            <Link
              href="/guides/usa-retailers"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-700 py-2 border-b border-slate-100"
            >
              🇺🇸 USA Boutiques Guide
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold text-amber-900 py-2 border-b border-slate-100"
            >
              👑 Merchant Admin Portal
            </Link>

            <div className="pt-3 flex flex-col gap-2">
              {user ? (
                <div className="space-y-2">
                  <div className="text-xs text-slate-500">
                    Signed in as <strong>{user.companyName}</strong> ({user.tier})
                  </div>
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 bg-slate-950 text-white rounded-lg font-bold text-xs uppercase tracking-wider block"
                  >
                    Wholesale Account &amp; Orders
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-center py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/account/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 bg-slate-950 text-white rounded-lg font-bold text-xs uppercase tracking-wider block"
                  >
                    Trade Login
                  </Link>
                  <Link
                    href="/account/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 bg-slate-100 text-slate-900 border border-slate-300 rounded-lg font-semibold text-xs block"
                  >
                    Apply for Wholesale Account (MOQ {minimumOrderFormatted})
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Demo Account Modal for Fast Review & Testing */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 sm:p-6 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-slate-950">
                Switch Wholesale Test Account
              </h3>
              <button
                onClick={() => setShowDemoModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 mt-3 mb-4 leading-relaxed">
              Test the platform from different business perspectives without typing credentials:
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => {
                  demoLogin("uk_retailer");
                  setCurrency("GBP");
                  setShowDemoModal(false);
                }}
                className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-slate-900 hover:bg-slate-50 transition flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                    <span>🇬🇧</span> Kensington Fine Jewels Ltd (London)
                  </div>
                  <div className="text-[11px] text-slate-500">UK Retailer • VAT Registered • Gold Tier</div>
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
                  <div className="font-semibold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                    <span>🇺🇸</span> SoHo Mineral &amp; Silver Co. (New York)
                  </div>
                  <div className="text-[11px] text-slate-500">US Boutique • EIN Exemption • Diamond Tier</div>
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
                  <div className="font-semibold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                    <span>👑</span> Merchant &amp; Factory Admin Portal
                  </div>
                  <div className="text-[11px] text-slate-600">Full order management, product editor, status controls</div>
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
