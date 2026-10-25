"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { INITIAL_ORDERS, WholesaleOrder } from "@/data/orders";
import { Product, CATEGORIES } from "@/data/products";
import { useAuth } from "@/components/AuthContext";
import { useProducts } from "@/components/ProductContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

function AdminPortalContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "catalog" ? "catalog" : "orders";
  const initialStatus = searchParams.get("status");

  const {
    products,
    updateStock,
    setStockDirect,
    deleteProduct,
    resetToDefaults,
  } = useProducts();

  const [orders, setOrders] = useState<WholesaleOrder[]>([]);
  const [filterCountry, setFilterCountry] = useState<"All" | "UK" | "USA">("All");
  const [activeTab, setActiveTab] = useState<"orders" | "catalog">(initialTab);
  const [editSuccessMsg, setEditSuccessMsg] = useState("");
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Check if redirected after saving product
  useEffect(() => {
    if (initialStatus === "saved") {
      setEditSuccessMsg("Wholesale product listing successfully saved & updated in catalog!");
      setTimeout(() => setEditSuccessMsg(""), 4000);
    }
  }, [initialStatus]);

  // ==================== INVENTORY FILTER & SORT STATE ====================
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [filterStockStatus, setFilterStockStatus] = useState<"All" | "In Stock" | "Low Stock" | "Out of Stock">("All");
  const [filterFinish, setFilterFinish] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"stock-asc" | "stock-desc" | "price-asc" | "price-desc" | "weight" | "name">("name");

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

    // Fetch live orders from Supabase database via API
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.orders) && data.orders.length > 0) {
          setOrders(data.orders);
        }
      })
      .catch((err) => console.warn("Failed to fetch orders from Supabase API:", err));
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
    if (isSupabaseConfigured()) {
      supabase.from("orders").update({ status: newStatus }).eq("id", orderId).then();
    }
    setEditSuccessMsg(`Order ${orderId} updated to ${newStatus}`);
    setTimeout(() => setEditSuccessMsg(""), 3000);
  };

  const handleUpdateTracking = (orderId: string, newTracking: string) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, trackingNumber: newTracking } : o));
    saveOrders(updated);
    if (isSupabaseConfigured()) {
      supabase.from("orders").update({ tracking_number: newTracking }).eq("id", orderId).then();
    }
    setEditSuccessMsg(`Tracking updated for ${orderId}`);
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

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      setEditSuccessMsg(`SKU "${productToDelete.sku}" removed from catalog.`);
      setProductToDelete(null);
      setTimeout(() => setEditSuccessMsg(""), 3000);
    }
  };

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search query
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchSku = p.sku.toLowerCase().includes(q);
          const matchCategory = p.category.toLowerCase().includes(q);
          const matchFinish = p.finish.toLowerCase().includes(q);
          if (!matchName && !matchSku && !matchCategory && !matchFinish) return false;
        }

        // Category filter
        if (filterCategory !== "All" && p.category !== filterCategory) return false;

        // Stock status filter
        if (filterStockStatus === "In Stock" && p.stockCount < 20) return false;
        if (filterStockStatus === "Low Stock" && (p.stockCount < 1 || p.stockCount >= 20)) return false;
        if (filterStockStatus === "Out of Stock" && p.stockCount > 0) return false;

        // Finish filter
        if (filterFinish !== "All") {
          if (!p.finish.toLowerCase().includes(filterFinish.toLowerCase())) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "stock-asc") return a.stockCount - b.stockCount;
        if (sortBy === "stock-desc") return b.stockCount - a.stockCount;
        if (sortBy === "price-asc") return a.priceGBP - b.priceGBP;
        if (sortBy === "price-desc") return b.priceGBP - a.priceGBP;
        if (sortBy === "weight") {
          const wA = parseFloat(a.gramWeight) || 0;
          const wB = parseFloat(b.gramWeight) || 0;
          return wB - wA;
        }
        return a.name.localeCompare(b.name);
      });
  }, [products, searchQuery, filterCategory, filterStockStatus, filterFinish, sortBy]);

  // Overall Financial & Stock Metrics
  const filteredOrders = filterCountry === "All" ? orders : orders.filter((o) => o.country === filterCountry);

  const totalWholesaleRevenueGBP = orders
    .filter((o) => o.currency === "GBP")
    .reduce((sum, o) => sum + o.total, 0);

  const totalWholesaleRevenueUSD = orders
    .filter((o) => o.currency === "USD")
    .reduce((sum, o) => sum + o.total, 0);

  const totalWarehousePieces = products.reduce((sum, p) => sum + p.stockCount, 0);
  const totalInventoryValueGBP = products.reduce((sum, p) => sum + p.priceGBP * p.stockCount, 0);
  const totalInventoryValueUSD = products.reduce((sum, p) => sum + p.priceUSD * p.stockCount, 0);
  const lowStockCount = products.filter((p) => p.stockCount < 20).length;

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-6 mb-6 sm:mb-8 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                Merchant Operations Portal
              </span>
              <span className="text-xs text-slate-500">London &amp; New York Dispatch Control</span>
            </div>
            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-slate-950 mt-1">
              Wholesale Business Command Center
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Opens dedicated standalone webpage */}
            <Link
              href="/admin/products/new"
              className="bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition flex items-center gap-1.5"
            >
              <span className="text-amber-400 font-extrabold text-sm">+</span> Add New Product
            </Link>
            <button
              onClick={handleExportCSV}
              className="bg-white border border-slate-300 hover:border-slate-950 text-slate-800 text-xs font-bold px-3.5 py-2.5 rounded-lg shadow-sm transition flex items-center gap-1.5"
            >
              <span>📥</span> Export CSV
            </button>
            <Link
              href="/catalog"
              className="bg-white border border-slate-300 hover:border-slate-950 text-slate-800 text-xs font-bold px-3.5 py-2.5 rounded-lg shadow-sm transition"
            >
              Live Catalog →
            </Link>
          </div>
        </div>

        {/* Success / Alert Toast Notification */}
        {editSuccessMsg && (
          <div className="mb-6 p-3.5 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm animate-fade-in">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px]">✓</span>
            <span>{editSuccessMsg}</span>
          </div>
        )}

        {/* Operational Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-8">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              UK Wholesale Revenue
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-950">
              £{totalWholesaleRevenueGBP.toFixed(2)}
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">
              {orders.filter((o) => o.country === "UK").length} UK Boutique Invoices
            </span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              US Wholesale Revenue
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-950">
              ${totalWholesaleRevenueUSD.toFixed(2)}
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">
              {orders.filter((o) => o.country === "USA").length} Transatlantic Dispatches
            </span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Warehouse Stock Units
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-950">
              {totalWarehousePieces.toLocaleString()} pcs
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
              Across {products.length} Silver SKUs
            </span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Inventory Valuation
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-950">
              £{totalInventoryValueGBP.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">
              ${totalInventoryValueUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })} USD wholesale worth
            </span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 mb-6 gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("orders")}
            className={`py-2.5 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition whitespace-nowrap ${
              activeTab === "orders"
                ? "border-slate-950 text-slate-950"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            All Trade Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("catalog")}
            className={`py-2.5 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "catalog"
                ? "border-slate-950 text-slate-950"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            <span>Solid 925 Inventory &amp; Catalog</span>
            <span className="bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded text-[10px] font-mono">
              {products.length} SKUs
            </span>
            {lowStockCount > 0 && (
              <span className="bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded text-[10px] font-bold">
                {lowStockCount} Low
              </span>
            )}
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: ORDERS MANAGEMENT                                                  */}
        {/* ========================================================================= */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Filter Region:</span>
                <div className="flex gap-1.5">
                  {(["All", "UK", "USA"] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => setFilterCountry(c)}
                      className={`text-xs px-2.5 py-1 rounded transition font-semibold ${
                        filterCountry === c
                          ? "bg-slate-950 text-white font-bold"
                          : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {c === "UK" ? "🇬🇧 UK" : c === "USA" ? "🇺🇸 USA" : "All Regions"}
                    </button>
                  ))}
                </div>
              </div>
              <span className="text-[11px] text-slate-500">
                Update status or consignments to sync with retailer tracking
              </span>
            </div>

            {/* MOBILE VIEW (< md): Card List for Phones & Small Tablets */}
            <div className="block md:hidden divide-y divide-slate-100">
              {filteredOrders.map((ord) => (
                <div key={ord.id} className="p-4 space-y-3.5 hover:bg-slate-50/50 transition">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="font-mono font-extrabold text-sm text-slate-950 block">
                        {ord.orderNumber}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {new Date(ord.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">
                        {ord.country === "UK" ? "🇬🇧 UK" : "🇺🇸 USA"}
                      </span>
                      <span className="text-xs font-black text-slate-950 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                        {ord.currency === "USD" ? `$${ord.total.toFixed(2)}` : `£${ord.total.toFixed(2)}`}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs space-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Retailer / Buyer</span>
                        <span className="font-bold text-slate-900 block">{ord.companyName}</span>
                        <span className="text-slate-500 text-[11px]">{ord.buyerName} • Tax ID: {ord.vatTaxId}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {ord.items.reduce((s, it) => s + it.quantity, 0)} units
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 pt-1">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Dispatch Progression Status
                      </label>
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value as any)}
                        className={`w-full text-xs font-bold px-3 py-2 rounded-lg border focus:outline-none transition ${
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
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Courier Consignment ({ord.trackingCarrier})
                      </label>
                      <input
                        type="text"
                        defaultValue={ord.trackingNumber || ""}
                        placeholder="Assign tracking number..."
                        onBlur={(e) => handleUpdateTracking(ord.id, e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-slate-950"
                      />
                    </div>
                  </div>

                  <Link
                    href={`/orders/${ord.id}`}
                    className="w-full bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 font-bold text-xs uppercase tracking-wider py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition shadow-xs text-center"
                  >
                    <span>View Commercial Invoice</span>
                    <span>→</span>
                  </Link>
                </div>
              ))}
            </div>

            {/* DESKTOP VIEW (>= md): Full Detailed Tabular View */}
            <div className="hidden md:block overflow-x-auto">
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

        {/* ========================================================================= */}
        {/* TAB 2: INVENTORY & CATALOG CONTROLS WITH FILTERS & ADD NEW PRODUCT        */}
        {/* ========================================================================= */}
        {activeTab === "catalog" && (
          <div className="space-y-6">
            {/* Top Inventory Toolbar */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="font-serif-luxury text-xl font-bold text-slate-950 flex items-center gap-2">
                    <span>Solid 925 Jewelry Inventory Management</span>
                    <span className="text-xs bg-slate-100 text-slate-800 font-mono px-2.5 py-0.5 rounded-full font-bold">
                      {filteredProducts.length} of {products.length} Styles
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live stock balances, wholesale prices, retailer margin keystoning, and instant listing controls.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                  {/* Dedicated Webpage Link for Add New Product */}
                  <Link
                    href="/admin/products/new"
                    className="flex-1 sm:flex-initial bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black px-4 py-2.5 rounded-lg shadow-sm transition flex items-center justify-center gap-1.5 uppercase tracking-wider"
                  >
                    <span>➕</span> Add New Product Listing
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm("Reset wholesale catalog back to initial factory SKUs?")) {
                        resetToDefaults();
                        setEditSuccessMsg("Catalog restored to factory defaults.");
                        setTimeout(() => setEditSuccessMsg(""), 3000);
                      }
                    }}
                    className="bg-white border border-slate-300 hover:border-slate-800 text-slate-600 text-xs font-semibold px-3 py-2.5 rounded-lg transition"
                    title="Restore default factory collection"
                  >
                    Restore Defaults
                  </button>
                </div>
              </div>

              {/* SEARCH & FILTERS BAR */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {/* 1. Live Search */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Search Inventory
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search title, SKU, or finish..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-2 text-slate-900 focus:outline-none focus:border-slate-950 font-medium"
                    />
                    <span className="absolute left-2.5 top-2.5 text-slate-400 text-xs">🔍</span>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-700"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Stock Level Filter */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Stock Balance Status
                  </label>
                  <select
                    value={filterStockStatus}
                    onChange={(e) => setFilterStockStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-950 font-medium"
                  >
                    <option value="All">All Stock Levels</option>
                    <option value="In Stock">In Stock (≥ 20 units)</option>
                    <option value="Low Stock">⚠️ Low Stock (&lt; 20 units)</option>
                    <option value="Out of Stock">🚫 Out of Stock (0 units)</option>
                  </select>
                </div>

                {/* 3. Protective Finish Filter */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Protective Coating / Finish
                  </label>
                  <select
                    value={filterFinish}
                    onChange={(e) => setFilterFinish(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-950 font-medium"
                  >
                    <option value="All">All Metal Finishes</option>
                    <option value="Rhodium">Rhodium Barrier (Anti-Tarnish)</option>
                    <option value="Vermeil">18k Gold Vermeil</option>
                    <option value="Diamond-Cut">Diamond-Cut</option>
                    <option value="Platinum">Platinum Dip</option>
                    <option value="Oxidized">Oxidized Vintage</option>
                  </select>
                </div>

                {/* 4. Sort By */}
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Sort Order
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-slate-950 font-medium"
                  >
                    <option value="name">Product Name (A - Z)</option>
                    <option value="stock-asc">Stock: Lowest First (Urgent Restock)</option>
                    <option value="stock-desc">Stock: Highest First</option>
                    <option value="price-asc">Wholesale Price: Low to High</option>
                    <option value="price-desc">Wholesale Price: High to Low</option>
                    <option value="weight">Gram Weight (Heaviest First)</option>
                  </select>
                </div>
              </div>

              {/* Category Pills Bar */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex-shrink-0">
                  Category:
                </span>
                {["All", ...CATEGORIES].map((cat) => {
                  const count = cat === "All" ? products.length : products.filter((p) => p.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      className={`text-xs px-3 py-1.5 rounded-full font-semibold transition whitespace-nowrap flex items-center gap-1.5 flex-shrink-0 ${
                        filterCategory === cat
                          ? "bg-slate-950 text-white"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      <span>{cat}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${filterCategory === cat ? "bg-white/20 text-white" : "bg-white text-slate-500"}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* INVENTORY LISTING (DESKTOP + MOBILE) */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
                <div className="text-3xl mb-3">🔍</div>
                <h3 className="font-serif-luxury text-lg font-bold text-slate-900 mb-1">
                  No jewelry styles matched your filter
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Try clearing your search query or switching categories.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterCategory("All");
                    setFilterStockStatus("All");
                    setFilterFinish("All");
                  }}
                  className="bg-slate-950 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* MOBILE VIEW (< md): Card List */}
                <div className="block md:hidden divide-y divide-slate-100">
                  {filteredProducts.map((p) => {
                    const profitGBP = Number((p.suggestedRetailGBP - p.priceGBP).toFixed(2));
                    const markupPct = Math.round((profitGBP / p.priceGBP) * 100);

                    return (
                      <div key={p.id} className="p-4 space-y-3 hover:bg-slate-50/50 transition">
                        <div className="flex gap-3">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                            <Image
                              src={p.images[0]}
                              alt={p.name}
                              fill
                              className="object-cover object-center"
                            />
                            {p.badge && (
                              <span className="absolute top-1 left-1 bg-amber-400 text-slate-950 text-[9px] font-extrabold px-1 rounded uppercase">
                                {p.badge}
                              </span>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-1">
                              <span className="font-bold text-xs text-slate-950 truncate block">
                                {p.name}
                              </span>
                            </div>
                            <span className="text-[11px] font-mono text-slate-400 block">
                              {p.sku} • {p.category}
                            </span>
                            <div className="flex items-center gap-2 text-[11px] text-slate-600 mt-0.5">
                              <span>{p.gramWeight} (925)</span>
                              <span>•</span>
                              <span className="font-bold text-slate-900">£{p.priceGBP.toFixed(2)}</span>
                              <span className="text-slate-400">(${p.priceUSD.toFixed(2)})</span>
                            </div>
                          </div>
                        </div>

                        {/* Stock and Margin row */}
                        <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">
                              Warehouse Stock
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span
                                className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  p.stockCount === 0
                                    ? "bg-red-100 text-red-900"
                                    : p.stockCount < 20
                                    ? "bg-amber-100 text-amber-900"
                                    : "bg-emerald-100 text-emerald-900"
                                }`}
                              >
                                {p.stockCount === 0 ? "Out of Stock" : `${p.stockCount} in stock`}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">
                              Retail Margin
                            </span>
                            <span className="font-bold text-slate-900 text-[11px] block mt-0.5">
                              MSRP £{p.suggestedRetailGBP.toFixed(2)} (+{markupPct}%)
                            </span>
                          </div>
                        </div>

                        {/* Fast Restock & Action Buttons */}
                        <div className="flex items-center justify-between pt-1 gap-2">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateStock(p.id, -10)}
                              className="bg-white border border-slate-200 text-slate-700 text-[11px] font-bold px-2 py-1 rounded hover:bg-slate-100"
                              title="Decrease 10 units"
                            >
                              -10
                            </button>
                            <button
                              onClick={() => updateStock(p.id, 10)}
                              className="bg-white border border-slate-200 text-slate-700 text-[11px] font-bold px-2 py-1 rounded hover:bg-slate-100"
                              title="Add 10 units"
                            >
                              +10
                            </button>
                            <button
                              onClick={() => updateStock(p.id, 50)}
                              className="bg-slate-950 text-white text-[11px] font-bold px-2.5 py-1 rounded hover:bg-slate-800"
                              title="Restock 50 units"
                            >
                              +50
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <Link
                              href={`/product/${p.id}`}
                              target="_blank"
                              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded transition"
                            >
                              Preview
                            </Link>
                            <Link
                              href={`/admin/products/new?edit=${p.id}`}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded transition"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => setProductToDelete(p)}
                              className="text-red-500 hover:text-red-700 text-[11px] font-bold px-1.5 py-1 transition"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* DESKTOP VIEW (>= md): High-End Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-3.5 px-4">Style &amp; SKU</th>
                        <th className="py-3.5 px-4">Category &amp; Weight</th>
                        <th className="py-3.5 px-4">Wholesale Price</th>
                        <th className="py-3.5 px-4">Suggested Retail (MSRP)</th>
                        <th className="py-3.5 px-4">Warehouse Stock</th>
                        <th className="py-3.5 px-4">Fast Restock</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProducts.map((p) => {
                        const profitGBP = Number((p.suggestedRetailGBP - p.priceGBP).toFixed(2));
                        const markupPct = Math.round((profitGBP / p.priceGBP) * 100);
                        const keystone = (p.suggestedRetailGBP / p.priceGBP).toFixed(1);

                        return (
                          <tr key={p.id} className="hover:bg-slate-50/70 transition">
                            {/* 1. Style & SKU */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                                  <Image
                                    src={p.images[0]}
                                    alt={p.name}
                                    fill
                                    className="object-cover object-center"
                                  />
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                    <span className="truncate max-w-[200px]">{p.name}</span>
                                    {p.badge && (
                                      <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                                        {p.badge}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[11px] font-mono text-slate-400 block">
                                    {p.sku} • MOQ {p.moq} pcs
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* 2. Category & Weight */}
                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-slate-900 block">{p.category}</span>
                              <span className="text-[11px] font-mono text-slate-500">
                                {p.gramWeight} • Solid 925
                              </span>
                            </td>

                            {/* 3. Wholesale Price */}
                            <td className="py-3.5 px-4">
                              <div className="font-extrabold text-sm text-slate-950">
                                £{p.priceGBP.toFixed(2)}
                              </div>
                              <span className="text-[11px] text-slate-500 font-mono">
                                ${p.priceUSD.toFixed(2)} USD
                              </span>
                            </td>

                            {/* 4. Retail MSRP & Margin */}
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-slate-900">
                                £{p.suggestedRetailGBP.toFixed(2)} / ${p.suggestedRetailUSD.toFixed(2)}
                              </div>
                              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded inline-block mt-0.5">
                                {keystone}x ({markupPct}% markup)
                              </span>
                            </td>

                            {/* 5. Warehouse Stock & Direct Edit */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  defaultValue={p.stockCount}
                                  key={`${p.id}-${p.stockCount}`}
                                  onBlur={(e) => {
                                    const val = parseInt(e.target.value, 10);
                                    if (!isNaN(val)) setStockDirect(p.id, val);
                                  }}
                                  className="w-16 bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs font-bold text-slate-900 text-center focus:outline-none focus:border-slate-950"
                                />
                                <span
                                  className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    p.stockCount === 0
                                      ? "bg-red-100 text-red-900"
                                      : p.stockCount < 20
                                      ? "bg-amber-100 text-amber-900"
                                      : "bg-emerald-100 text-emerald-900"
                                  }`}
                                >
                                  {p.stockCount === 0 ? "Out" : p.stockCount < 20 ? "Low" : "OK"}
                                </span>
                              </div>
                            </td>

                            {/* 6. Fast Restock Buttons */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => updateStock(p.id, -10)}
                                  className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-[11px] font-bold px-2 py-1 rounded transition"
                                  title="Decrease 10 units"
                                >
                                  -10
                                </button>
                                <button
                                  onClick={() => updateStock(p.id, 10)}
                                  className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-[11px] font-bold px-2 py-1 rounded transition"
                                  title="Add 10 units"
                                >
                                  +10
                                </button>
                                <button
                                  onClick={() => updateStock(p.id, 50)}
                                  className="bg-slate-950 hover:bg-slate-800 text-white text-[11px] font-bold px-2.5 py-1 rounded transition shadow-xs"
                                  title="Add 50 units"
                                >
                                  +50
                                </button>
                              </div>
                            </td>

                            {/* 7. Actions */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Link
                                  href={`/product/${p.id}`}
                                  target="_blank"
                                  className="bg-slate-100 hover:bg-slate-200 text-slate-900 px-2.5 py-1.5 rounded text-[11px] font-bold border border-slate-200 transition"
                                  title="Preview live product page"
                                >
                                  👁️ Preview
                                </Link>
                                <Link
                                  href={`/admin/products/new?edit=${p.id}`}
                                  className="bg-white hover:bg-slate-100 text-slate-900 px-2.5 py-1.5 rounded text-[11px] font-bold border border-slate-300 transition"
                                  title="Edit product details in dedicated page"
                                >
                                  ✏️ Edit
                                </Link>
                                <button
                                  onClick={() => setProductToDelete(p)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition"
                                  title="Delete product"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* DELETE CONFIRMATION MODAL                                                 */}
        {/* ========================================================================= */}
        {productToDelete && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 text-center space-y-4 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-xl font-bold">
                🗑️
              </div>
              <div>
                <h3 className="font-serif-luxury text-lg font-bold text-slate-950">
                  Delete SKU {productToDelete.sku}?
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Are you sure you want to permanently remove <strong>{productToDelete.name}</strong> from your wholesale catalog? This cannot be undone.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setProductToDelete(null)}
                  className="flex-1 bg-white border border-slate-300 text-slate-700 font-bold text-xs py-2.5 rounded-lg hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 rounded-lg shadow-sm transition uppercase tracking-wider"
                >
                  Delete SKU
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPortalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF9F6] p-8 text-xs text-slate-500">Loading Merchant Portal...</div>}>
      <AdminPortalContent />
    </Suspense>
  );
}
