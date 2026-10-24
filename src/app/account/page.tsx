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
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center max-w-md w-full mx-4">
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
    <div className="bg-[#FAF9F6] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between sm:items-end gap-4 pb-6 border-b border-slate-200">
          <div>
            <nav className="text-xs text-slate-500 mb-1 flex items-center gap-1.5 font-medium">
              <Link href="/" className="hover:text-slate-900 transition">Trade Home</Link>
              <span>/</span>
              <span className="text-slate-900 font-semibold">Retailer Portal</span>
            </nav>
            <h1 className="font-serif-luxury text-3xl font-bold text-slate-950">
              {user.companyName}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Authorized Representative: <strong className="text-slate-800">{user.name}</strong> • {user.city}, {user.country === "UK" ? "United Kingdom 🇬🇧" : "United States 🇺🇸"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/catalog"
              className="bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg shadow-sm transition"
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

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Wholesale Partner Tier
            </span>
            <div className="text-lg font-bold text-slate-950 flex items-center gap-2">
              <span>💎</span> {user.tier}
            </div>
            <span className="text-xs text-emerald-700 font-medium block mt-1">
              Verified Wholesale Reseller • Active
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Tax Exemption Status
            </span>
            <div className="text-lg font-bold text-slate-950 flex items-center gap-2">
              <span>📜</span> {user.country === "UK" ? "UK VAT Standard" : "US Resale Exempt"}
            </div>
            <span className="text-xs font-mono text-slate-500 block mt-1">
              ID: {user.vatOrTaxId}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Credit Terms &amp; Settlement
            </span>
            <div className="text-lg font-bold text-slate-950 flex items-center gap-2">
              <span>💳</span> {user.creditTermsEligible ? "Net 30 Approved" : "Wire / Card Settlement"}
            </div>
            <span className="text-xs text-slate-500 block mt-1">
              Assay certificates automatically included
            </span>
          </div>
        </div>

        {/* Orders History Section */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden mb-12">
          <div className="p-5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <div>
              <h2 className="font-serif-luxury text-lg font-bold text-slate-950">
                Wholesale Order History &amp; Consignments
              </h2>
              <p className="text-xs text-slate-500">Track shipments, download invoices, and inspect assay numbers.</p>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-white border border-slate-300 px-3 py-1 rounded-full">
              {orders.length} Dispatches Recorded
            </span>
          </div>

          <div className="overflow-x-auto">
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
                        className="inline-block bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 font-bold px-3 py-1.5 rounded transition text-[11px]"
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

        {/* Quick Help & Assay Verification Notice */}
        <div className="bg-slate-900 text-slate-300 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="font-serif-luxury text-xl font-bold text-white mb-1">
              Need Custom OEM Silversmithing or Larger Batches?
            </h3>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              For custom jewelry casting (CAD files), bespoke logo hallmarking with your sponsor mark, or orders over 500 units, contact our Hatton Garden master bench team.
            </p>
          </div>
          <Link
            href="/margin-calculator"
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg transition whitespace-nowrap shadow-md"
          >
            Open Margin Calculator
          </Link>
        </div>
      </div>
    </div>
  );
}
