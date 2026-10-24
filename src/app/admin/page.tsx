"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { INITIAL_ORDERS, WholesaleOrder } from "@/data/orders";
import { PRODUCTS, Product } from "@/data/products";
import { useAuth } from "@/components/AuthContext";

export default function AdminPortalPage() {
  const { user, demoLogin } = useAuth();
  const [orders, setOrders] = useState<WholesaleOrder[]>([]);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [filterCountry, setFilterCountry] = useState<"All" | "UK" | "USA">("All");
  const [activeTab, setActiveTab] = useState<"orders" | "catalog" | "accounts">("orders");
  const [editSuccessMsg, setEditSuccessMsg] = useState("");

  // Load orders
  useEffect(() => {
    try {
      const stored = localStorage.getItem("argent_wholesale_orders");
      const localOrders: WholesaleOrder[] = stored ? JSON.parse(stored) : [];
      const combined = [...localOrders, ...INITIAL_ORDERS];
      const unique = combined.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);
      setOrders(unique);
    } catch {
      setOrders(INITIAL_ORDERS);
    }
  }, []);

  const saveOrders = (updated: WholesaleOrder[]) => {
    setOrders(updated);
    try {
      localStorage.setItem("argent_wholesale_orders", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleUpdateStatus = (orderId: string, newStatus: WholesaleOrder["status"]) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    saveOrders(updated);
    setEditSuccessMsg(`Order ${orderId} updated to ${newStatus}`);
    setTimeout(() => setEditSuccessMsg(""), 3000);
  };

  const handleUpdateTracking = (orderId: string, newTracking: string) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, trackingNumber: newTracking } : o));
    saveOrders(updated);
    setEditSuccessMsg(`Tracking updated for ${orderId}`);
    setTimeout(() => setEditSuccessMsg(""), 3000);
  };

  // Restock inventory inline
  const handleRestock = (productId: string, addAmount: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stockCount: p.stockCount + addAmount } : p))
    );
    setEditSuccessMsg(`Inventory restocked for ${productId}`);
    setTimeout(() => setEditSuccessMsg(""), 3000);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Order Number", "Date", "Company", "Buyer", "Country", "Total", "Currency", "Status", "Tracking Carrier", "Tracking Ref"];
    const rows = orders.map((o) => [
      o.orderNumber,
      o.createdAt.split("T")[0],
      `"${o.companyName}"`,
      `"${o.buyerName}"`,
      o.country,
      o.total.toFixed(2),
      o.currency,
      o.status,
      `"${o.trackingCarrier || ""}"`,
      o.trackingNumber || ""
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `argent_wholesale_orders_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = filterCountry === "All" ? orders : orders.filter((o) => o.country === filterCountry);

  const totalWholesaleRevenueGBP = orders
    .filter((o) => o.currency === "GBP")
    .reduce((sum, o) => sum + o.total, 0);

  const totalWholesaleRevenueUSD = orders
    .filter((o) => o.currency === "USD")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 mb-8 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                Merchant Operations Portal
              </span>
              <span className="text-xs text-slate-500">London &amp; New York Dispatch Control</span>
            </div>
            <h1 className="font-serif-luxury text-3xl font-bold text-slate-950 mt-1">
              Wholesale Order Management
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="bg-white border border-slate-300 hover:border-slate-950 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition flex items-center gap-1.5"
            >
              <span>📥</span> Export Orders (CSV / Excel)
            </button>
            <Link
              href="/catalog"
              className="bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition"
            >
              Live Catalog →
            </Link>
          </div>
        </div>

        {editSuccessMsg && (
          <div className="mb-6 p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-2">
            <span>✓</span> {editSuccessMsg}
          </div>
        )}

        {/* Top Operational Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              UK Wholesale Revenue
            </span>
            <div className="text-2xl font-black text-slate-950">
              £{totalWholesaleRevenueGBP.toFixed(2)}
            </div>
            <span className="text-xs text-slate-500 block mt-1">
              {orders.filter((o) => o.country === "UK").length} UK Boutique Invoices
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              US Wholesale Revenue
            </span>
            <div className="text-2xl font-black text-slate-950">
              ${totalWholesaleRevenueUSD.toFixed(2)}
            </div>
            <span className="text-xs text-slate-500 block mt-1">
              {orders.filter((o) => o.country === "USA").length} Transatlantic Dispatches
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Assay Hallmarking Queue
            </span>
            <div className="text-2xl font-black text-amber-700">
              {orders.filter((o) => o.status === "Assay Hallmarking" || o.status === "Payment Confirmed").length}
            </div>
            <span className="text-xs text-slate-500 block mt-1">
              Assay Office batch certification
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Active Silver SKUs
            </span>
            <div className="text-2xl font-black text-slate-950">
              {products.length}
            </div>
            <span className="text-xs text-emerald-700 font-semibold block mt-1">
              100% Solid 925 Guaranteed
            </span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 mb-6 gap-2">
          <button
            onClick={() => setActiveTab("orders")}
            className={`py-2 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
              activeTab === "orders"
                ? "border-slate-950 text-slate-950"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            All Trade Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("catalog")}
            className={`py-2 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
              activeTab === "catalog"
                ? "border-slate-950 text-slate-950"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            Inventory &amp; Pricing Management
          </button>
        </div>

        {/* Tab 1: Orders Management */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Filter Country:</span>
                <div className="flex gap-1">
                  {(["All", "UK", "USA"] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => setFilterCountry(c)}
                      className={`text-xs px-2.5 py-1 rounded transition ${
                        filterCountry === c
                          ? "bg-slate-950 text-white font-bold"
                          : "bg-white text-slate-600 border border-slate-200"
                      }`}
                    >
                      {c === "UK" ? "🇬🇧 UK" : c === "USA" ? "🇺🇸 USA" : "All"}
                    </button>
                  ))}
                </div>
              </div>
              <span className="text-xs text-slate-500">
                Click any status dropdown to trigger live status progression
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Order ID &amp; Date</th>
                    <th className="py-3.5 px-4">Retailer / Buyer</th>
                    <th className="py-3.5 px-4">Value</th>
                    <th className="py-3.5 px-4">Courier &amp; Tracking</th>
                    <th className="py-3.5 px-4">Live Status</th>
                    <th className="py-3.5 px-4 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-4 px-4">
                        <span className="font-mono font-bold text-slate-950 block">{ord.orderNumber}</span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(ord.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900">{ord.companyName}</div>
                        <div className="text-[11px] text-slate-500">
                          {ord.buyerName} ({ord.country === "UK" ? "🇬🇧 UK" : "🇺🇸 USA"})
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">Tax ID: {ord.vatTaxId}</div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-extrabold text-sm text-slate-950 block">
                          {ord.currency === "USD" ? `$${ord.total.toFixed(2)}` : `£${ord.total.toFixed(2)}`}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {ord.items.reduce((s, it) => s + it.quantity, 0)} units
                        </span>
                      </td>

                      <td className="py-4 px-4 min-w-[200px]">
                        <div className="text-[11px] font-medium text-slate-700 mb-1">{ord.trackingCarrier}</div>
                        <input
                          type="text"
                          defaultValue={ord.trackingNumber || ""}
                          placeholder="Assign consignment ref..."
                          onBlur={(e) => handleUpdateTracking(ord.id, e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[11px] font-mono text-slate-900 focus:outline-none focus:border-slate-950"
                        />
                      </td>

                      <td className="py-4 px-4">
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateStatus(ord.id, e.target.value as any)}
                          className={`text-xs font-bold px-2 py-1.5 rounded-lg border focus:outline-none ${
                            ord.status === "Delivered"
                              ? "bg-slate-950 text-white border-slate-950"
                              : ord.status === "Dispatched"
                              ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                              : "bg-amber-100 text-amber-900 border-amber-300"
                          }`}
                        >
                          <option value="Pending Review">Pending Review</option>
                          <option value="Payment Confirmed">Payment Confirmed</option>
                          <option value="Assay Hallmarking">Assay Hallmarking</option>
                          <option value="Dispatched">Dispatched (In Transit)</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <Link
                          href={`/orders/${ord.id}`}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-900 px-3 py-1.5 rounded text-[11px] font-bold border border-slate-300 inline-block transition"
                        >
                          View Invoice
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Catalog & Stock Inventory */}
        {activeTab === "catalog" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Solid 925 Product Stock &amp; Factory Batch Controls
              </h2>
              <span className="text-xs text-slate-500">{products.length} Active Silver Articles</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Style &amp; SKU</th>
                    <th className="py-3.5 px-4">Gram Weight</th>
                    <th className="py-3.5 px-4">Wholesale Price (GBP)</th>
                    <th className="py-3.5 px-4">Wholesale Price (USD)</th>
                    <th className="py-3.5 px-4">In-Stock Units</th>
                    <th className="py-3.5 px-4 text-right">Fast Restock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900">{p.name}</div>
                        <div className="text-[11px] font-mono text-slate-400">{p.sku} • {p.category}</div>
                      </td>

                      <td className="py-4 px-4 font-mono font-medium text-slate-700">
                        {p.gramWeight} (925)
                      </td>

                      <td className="py-4 px-4 font-bold text-slate-900">
                        £{p.priceGBP.toFixed(2)}
                      </td>

                      <td className="py-4 px-4 font-bold text-slate-900">
                        ${p.priceUSD.toFixed(2)}
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-bold text-slate-950 bg-slate-100 px-2 py-1 rounded">
                          {p.stockCount} units
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleRestock(p.id, 50)}
                          className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-[11px] font-semibold px-2 py-1 rounded transition"
                        >
                          +50
                        </button>
                        <button
                          onClick={() => handleRestock(p.id, 100)}
                          className="bg-slate-950 hover:bg-slate-800 text-white text-[11px] font-bold px-2.5 py-1 rounded transition"
                        >
                          +100
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
