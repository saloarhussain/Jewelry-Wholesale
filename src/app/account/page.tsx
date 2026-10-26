"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { useCurrency } from "@/components/CurrencyContext";
import { INITIAL_ORDERS, WholesaleOrder } from "@/data/orders";

export default function AccountDashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { currency, minimumOrderFormatted } = useCurrency();
  const [orders, setOrders] = useState<WholesaleOrder[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("argent_wholesale_orders");
      const localOrders: WholesaleOrder[] = stored ? JSON.parse(stored) : [];
      // Combine stored orders and initial mock orders
      const combined = [...localOrders, ...INITIAL_ORDERS];
      // Deduplicate by ID
      const unique = combined.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);
      setOrders(unique);
    } catch {
      setOrders(INITIAL_ORDERS);
    }
  }, []);

  if (!user) {
    return (
      <div className="bg-[#FAF9F6] min-h-screen py-16 flex items-center justify-center">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 text-center max-w-md w-full mx-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-xl mb-3">
            🔐
          </div>
          <h2 className="font-serif-luxury text-xl font-bold text-slate-950 mb-2">
            Trade Authentication Required
          </h2>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            Please sign in to view your wholesale orders, download commercial VAT invoices, and track transatlantic dispatches.
          </p>
          <div className="space-y-3">
            <Link
              href="/account/login"
              className="w-full bg-slate-950 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-lg block hover:bg-slate-800 transition"
            >
              Sign In to Trade Account
            </Link>
            <Link
              href="/account/register"
              className="w-full bg-slate-100 text-slate-800 font-semibold text-xs py-3 rounded-lg block hover:bg-slate-200 transition"
            >
              Apply for Trade Account (MOQ {minimumOrderFormatted})
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Admin Operational Access Alert Banner */}
        {user.role === "admin" && (
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-xs">
            <div>
              <span className="text-xs font-bold text-amber-950 flex items-center gap-2">
                <span className="text-base">👑</span> System Administrator Session Active
              </span>
              <p className="text-xs text-amber-900 mt-1">
                You have administrative access to manage product listings, inventory stock levels, and commercial orders.
              </p>
            </div>
            <Link
              href="/admin"
              className="bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-lg shadow-sm transition whitespace-nowrap self-start sm:self-auto"
            >
              Open Admin Command Center &rarr;
            </Link>
          </div>
        )}

        {/* Top Header */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <nav className="text-xs text-slate-500 mb-1 flex items-center gap-1.5 font-medium">
                <Link href="/" className="hover:text-slate-900 transition">Trade Home</Link>
                <span>/</span>
                <span className="text-slate-900 font-semibold">Retailer Portal</span>
              </nav>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-950">
                {user.companyName}
              </h1>
              <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-1.5">
                <span>Authorized Buyer: <strong className="text-slate-800">{user.name}</strong></span>
                <span>•</span>
                <span>{user.city}, {user.country}</span>
              </p>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <Link
                href="/catalog"
                className="flex-1 sm:flex-initial text-center bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg shadow-sm transition whitespace-nowrap"
              >
                New Order ({minimumOrderFormatted} MOQ) →
              </Link>
              <button
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="bg-white border border-slate-300 hover:border-slate-900 text-slate-700 text-xs font-semibold px-3 py-2.5 rounded-lg transition"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>

        {/* Registered Business Profile & Credentials Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>🏢</span>
              <span>Registered Business Profile &amp; Contact Credentials</span>
            </h3>
            <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Verified B2B Account
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Company Name</span>
              <span className="font-semibold text-slate-900 block">{user.companyName}</span>
              <span className="text-[11px] text-slate-500">{user.businessType || "Jewelry Boutique"}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Owner &amp; Email</span>
              <span className="font-semibold text-slate-900 block">{user.name}</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[11px] text-slate-600">{user.email}</span>
                {user.emailVerified && (
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">✓ Verified</span>
                )}
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">WhatsApp &amp; Website</span>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-900 block">{user.phoneNumber || "Not provided"}</span>
                {user.whatsappVerified && (
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                    <span>✓</span> WhatsApp
                  </span>
                )}
              </div>
              {user.website ? (
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-amber-700 hover:underline truncate block mt-0.5"
                >
                  {user.website}
                </a>
              ) : (
                <span className="text-[11px] text-slate-400 mt-0.5 block">No website registered</span>
              )}
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Registered Address</span>
              <span className="font-semibold text-slate-900 block">{user.address || user.city}</span>
              <span className="text-[11px] text-slate-500">
                {[user.city, user.stateOrCounty, user.postalCode, user.country].filter(Boolean).join(", ")}
              </span>
            </div>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-start gap-3 sm:block">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-lg sm:hidden flex-shrink-0">
              💎
            </div>
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5 sm:mb-1">
                Wholesale Partner Tier
              </span>
              <div className="text-base sm:text-lg font-bold text-slate-950 flex items-center gap-2">
                <span className="hidden sm:inline">💎</span> {user.tier}
              </div>
              <span className="text-xs text-emerald-700 font-medium block mt-0.5 sm:mt-1">
                Verified Wholesale Reseller • Active
              </span>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-start gap-3 sm:block">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-lg sm:hidden flex-shrink-0">
              📜
            </div>
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5 sm:mb-1">
                Tax Exemption Status
              </span>
              <div className="text-base sm:text-lg font-bold text-slate-950 flex items-center gap-2">
                <span className="hidden sm:inline">📜</span> {user.country === "UK" ? "UK VAT Standard (20%)" : "US Resale Certificate Exempt"}
              </div>
              <span className="text-xs font-mono text-slate-500 block mt-0.5 sm:mt-1">
                ID: {user.vatOrTaxId}
              </span>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-start gap-3 sm:block">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-lg sm:hidden flex-shrink-0">
              💳
            </div>
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5 sm:mb-1">
                Credit Terms &amp; Settlement
              </span>
              <div className="text-base sm:text-lg font-bold text-slate-950 flex items-center gap-2">
                <span className="hidden sm:inline">💳</span> {user.creditTermsEligible ? "Net 30 Approved" : "Wire / Card Settlement"}
              </div>
              <span className="text-xs text-slate-500 block mt-0.5 sm:mt-1">
                Assay certificates automatically enclosed
              </span>
            </div>
          </div>
        </div>

        {/* Orders History Section */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          {/* Section Header */}
          <div className="p-4 sm:p-6 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-2.5">
            <div>
              <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-slate-950">
                Wholesale Order History &amp; Consignments
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Track shipments, download invoices, and inspect UK Assay batch certificates.
              </p>
            </div>
            <span className="text-[11px] font-bold text-slate-700 bg-white border border-slate-300 px-3 py-1 rounded-full whitespace-nowrap self-start sm:self-auto shadow-xs">
              {orders.length} Dispatches Recorded
            </span>
          </div>

          {/* MOBILE VIEW (< md): High-end organized Card List */}
          <div className="block md:hidden divide-y divide-slate-100">
            {orders.map((ord) => (
              <div key={ord.id} className="p-4 space-y-3.5 hover:bg-slate-50/50 transition">
                {/* Card Top: Order Number & Status Badge */}
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="font-mono font-extrabold text-sm text-slate-950 block">
                      {ord.orderNumber}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Placed on {new Date(ord.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold flex-shrink-0 ${
                      ord.status === "Delivered"
                        ? "bg-slate-900 text-white"
                        : ord.status === "Dispatched"
                        ? "bg-emerald-100 text-emerald-900 border border-emerald-200"
                        : "bg-amber-100 text-amber-900 border border-amber-200"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {ord.status}
                  </span>
                </div>

                {/* Card Middle: Destination, Items & Total Price */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Buyer &amp; Destination
                    </span>
                    <span className="font-semibold text-slate-900 block truncate">
                      {ord.companyName}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {ord.shippingAddress.city}, {ord.country === "UK" ? "UK 🇬🇧" : "USA 🇺🇸"}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Total Invoiced
                    </span>
                    <span className="font-extrabold text-base text-slate-950 block">
                      {ord.currency === "USD" ? `$${ord.total.toFixed(2)}` : `£${ord.total.toFixed(2)}`}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {ord.items.reduce((s, it) => s + it.quantity, 0)} pcs ({ord.items.length} styles)
                    </span>
                  </div>
                </div>

                {/* Tracking if available */}
                {ord.trackingNumber && (
                  <div className="text-xs text-slate-600 flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-1.5">
                    <span className="text-[11px] font-medium text-slate-500">Courier Tracking:</span>
                    <span className="font-mono font-bold text-[11px] text-slate-900 truncate max-w-[170px]">
                      {ord.trackingNumber}
                    </span>
                  </div>
                )}

                {/* Card Action: Full-width Button */}
                <Link
                  href={`/orders/${ord.id}`}
                  className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 transition shadow-sm"
                >
                  <span>View Commercial Invoice &amp; Track</span>
                  <span>→</span>
                </Link>
              </div>
            ))}
          </div>

          {/* DESKTOP VIEW (>= md): Full Detailed Tabular View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Order Ref</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Dest / Buyer</th>
                  <th className="py-3.5 px-4">Articles</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-4">
                      <span className="font-mono font-bold text-slate-900 block">{ord.orderNumber}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{ord.paymentMethod.split(" ")[0]}</span>
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      {new Date(ord.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-slate-900">{ord.companyName}</div>
                      <div className="text-[11px] text-slate-400">{ord.shippingAddress.city}, {ord.country}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-800">
                          {ord.items.reduce((s, it) => s + it.quantity, 0)} pcs
                        </span>
                        <span className="text-slate-400">({ord.items.length} styles)</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.status === "Delivered"
                            ? "bg-slate-900 text-white"
                            : ord.status === "Dispatched"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-900"
                        }`}
                      >
                        ● {ord.status}
                      </span>
                      {ord.trackingNumber && (
                        <span className="block text-[10px] text-slate-400 font-mono mt-0.5 truncate max-w-[120px]">
                          {ord.trackingNumber}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-950">
                      {ord.currency === "USD" ? `$${ord.total.toFixed(2)}` : `£${ord.total.toFixed(2)}`}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link
                        href={`/orders/${ord.id}`}
                        className="inline-block bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 font-bold px-3 py-1.5 rounded transition text-[11px] whitespace-nowrap"
                      >
                        Invoice &amp; Track →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Help & Assay Verification Notice - Scaled for Mobile */}
        <div className="bg-slate-950 text-slate-300 rounded-2xl p-5 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 shadow-sm">
          <div className="space-y-1.5">
            <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-white">
              Need Custom OEM Silversmithing or Larger Batches?
            </h3>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              For custom jewelry casting (CAD files), bespoke logo hallmarking with your sponsor mark, or orders over 500 units, contact our Hatton Garden master bench team.
            </p>
          </div>
          <Link
            href="/margin-calculator"
            className="w-full sm:w-auto text-center bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg transition whitespace-nowrap shadow-md flex-shrink-0"
          >
            Open Margin Calculator
          </Link>
        </div>
      </div>
    </div>
  );
}
