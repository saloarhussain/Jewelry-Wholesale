"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { INITIAL_ORDERS, WholesaleOrder } from "@/data/orders";
import { Product, CATEGORIES } from "@/data/products";
import { useAuth } from "@/components/AuthContext";
import { useProducts } from "@/components/ProductContext";

// Curated high-res jewelry photography presets for instant 1-click selection
const IMAGE_PRESETS = [
  {
    name: "Herringbone Chain",
    category: "Chains",
    url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Bold Dome Ring",
    category: "Rings",
    url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Signet Ring",
    category: "Rings",
    url: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Chunky Curb Chain",
    category: "Chains",
    url: "https://images.unsplash.com/photo-1611591475155-42e5232d3925?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Huggie Hoops",
    category: "Earrings",
    url: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Paperclip Necklace",
    category: "Necklaces",
    url: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Bangle Bracelet",
    category: "Bracelets",
    url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Pave Crystal Studs",
    category: "Earrings",
    url: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=900&q=80",
  },
];

export default function AdminPortalPage() {
  const { user } = useAuth();
  const {
    products,
    addProduct,
    updateProduct,
    updateStock,
    setStockDirect,
    deleteProduct,
    resetToDefaults,
  } = useProducts();

  const [orders, setOrders] = useState<WholesaleOrder[]>([]);
  const [filterCountry, setFilterCountry] = useState<"All" | "UK" | "USA">("All");
  const [activeTab, setActiveTab] = useState<"orders" | "catalog">("orders");
  const [editSuccessMsg, setEditSuccessMsg] = useState("");

  // ==================== INVENTORY FILTER & SORT STATE ====================
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [filterStockStatus, setFilterStockStatus] = useState<"All" | "In Stock" | "Low Stock" | "Out of Stock">("All");
  const [filterFinish, setFilterFinish] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"stock-asc" | "stock-desc" | "price-asc" | "price-desc" | "weight" | "name">("name");

  // ==================== MODAL STATE (ADD / EDIT PRODUCT) ====================
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Form Fields State
  const [formName, setFormName] = useState("");
  const [formSku, setFormSku] = useState("");
  const [formCategory, setFormCategory] = useState<Product["category"]>("Chains");
  const [formBadge, setFormBadge] = useState<string>("");
  const [formPurity, setFormPurity] = useState("Solid 925 Sterling Silver");
  const [formGramWeight, setFormGramWeight] = useState("12.5g");
  const [formFinish, setFormFinish] = useState("Diamond-Cut Mirror Polish & Rhodium Barrier");
  const [formDimensions, setFormDimensions] = useState("Length: 45cm (18 in) | Width: 3.5mm");
  const [formHallmarked, setFormHallmarked] = useState(true);
  const [formPriceGBP, setFormPriceGBP] = useState<number>(14.50);
  const [formPriceUSD, setFormPriceUSD] = useState<number>(18.85);
  const [formSuggestedRetailGBP, setFormSuggestedRetailGBP] = useState<number>(48.00);
  const [formSuggestedRetailUSD, setFormSuggestedRetailUSD] = useState<number>(62.00);
  const [formMoq, setFormMoq] = useState<number>(3);
  const [formStockCount, setFormStockCount] = useState<number>(120);
  const [formPrimaryImage, setFormPrimaryImage] = useState(IMAGE_PRESETS[0].url);
  const [formSecondaryImage, setFormSecondaryImage] = useState("");
  const [formShortDescription, setFormShortDescription] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formSeoKeywords, setFormSeoKeywords] = useState("wholesale sterling silver, 925 solid silver bulk");

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

  // Helper to generate a new unique SKU
  const generateNewSku = (category: string) => {
    const prefix = category.slice(0, 3).toUpperCase();
    const randNum = Math.floor(100 + Math.random() * 900);
    return `AG-${prefix}-${randNum}`;
  };

  // Open Modal for New Product
  const handleOpenAddModal = () => {
    setEditingId(null);
    const newSku = generateNewSku("Chains");
    setFormName("");
    setFormSku(newSku);
    setFormCategory("Chains");
    setFormBadge("New In");
    setFormPurity("Solid 925 Sterling Silver");
    setFormGramWeight("12.5g");
    setFormFinish("Diamond-Cut Mirror Polish & Rhodium Barrier");
    setFormDimensions("Length: 45cm (18 in) | Width: 3.5mm");
    setFormHallmarked(true);
    setFormPriceGBP(16.50);
    setFormPriceUSD(21.45);
    setFormSuggestedRetailGBP(52.00);
    setFormSuggestedRetailUSD(68.00);
    setFormMoq(3);
    setFormStockCount(120);
    setFormPrimaryImage(IMAGE_PRESETS[0].url);
    setFormSecondaryImage("");
    setFormShortDescription("Solid 925 sterling silver wholesale jewelry. Anti-tarnish rhodium barrier, nickel-free.");
    setFormDescription("Engineered from certified solid 925 sterling silver with a diamond-cut mirror finish. Stamped with 925 authenticity hallmark compliant with UK Assay Office and US FTC precious metals standards.");
    setFormSeoKeywords("wholesale silver chains, 925 solid sterling silver bulk");
    setIsModalOpen(true);
  };

  // Open Modal for Editing an existing Product
  const handleOpenEditModal = (p: Product) => {
    setEditingId(p.id);
    setFormName(p.name);
    setFormSku(p.sku);
    setFormCategory(p.category);
    setFormBadge(p.badge || "");
    setFormPurity(p.purity);
    setFormGramWeight(p.gramWeight);
    setFormFinish(p.finish);
    setFormDimensions(p.dimensions);
    setFormHallmarked(p.hallmarked);
    setFormPriceGBP(p.priceGBP);
    setFormPriceUSD(p.priceUSD);
    setFormSuggestedRetailGBP(p.suggestedRetailGBP);
    setFormSuggestedRetailUSD(p.suggestedRetailUSD);
    setFormMoq(p.moq);
    setFormStockCount(p.stockCount);
    setFormPrimaryImage(p.images[0] || IMAGE_PRESETS[0].url);
    setFormSecondaryImage(p.images[1] || "");
    setFormShortDescription(p.shortDescription);
    setFormDescription(p.description);
    setFormSeoKeywords(p.seoKeywords ? p.seoKeywords.join(", ") : "");
    setIsModalOpen(true);
  };

  // Handle Price GBP change to auto-calculate recommended USD and retail MSRP
  const handlePriceGBPChange = (val: number) => {
    setFormPriceGBP(val);
    const usd = Number((val * 1.30).toFixed(2));
    setFormPriceUSD(usd);
    const msrpGBP = Number((val * 3.2).toFixed(2));
    setFormSuggestedRetailGBP(msrpGBP);
    const msrpUSD = Number((usd * 3.2).toFixed(2));
    setFormSuggestedRetailUSD(msrpUSD);
  };

  // Save Product (Create or Update)
  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim()) {
      alert("Please provide a product title.");
      return;
    }
    if (!formSku.trim()) {
      alert("Please provide a valid SKU.");
      return;
    }

    const imagesArray = [formPrimaryImage.trim()];
    if (formSecondaryImage.trim()) {
      imagesArray.push(formSecondaryImage.trim());
    }

    const keywordsArray = formSeoKeywords
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    const slug = formName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const tierPricing = [
      { minQuantity: formMoq, discountPercentage: 0 },
      { minQuantity: 15, discountPercentage: 8 },
      { minQuantity: 50, discountPercentage: 15 },
      { minQuantity: 100, discountPercentage: 22 },
    ];

    if (editingId) {
      // Update existing
      updateProduct(editingId, {
        name: formName.trim(),
        sku: formSku.trim(),
        category: formCategory,
        badge: formBadge || undefined,
        purity: formPurity.trim(),
        gramWeight: formGramWeight.trim(),
        finish: formFinish.trim(),
        dimensions: formDimensions.trim(),
        hallmarked: formHallmarked,
        priceGBP: Number(formPriceGBP),
        priceUSD: Number(formPriceUSD),
        suggestedRetailGBP: Number(formSuggestedRetailGBP),
        suggestedRetailUSD: Number(formSuggestedRetailUSD),
        moq: Number(formMoq),
        stockCount: Number(formStockCount),
        images: imagesArray,
        shortDescription: formShortDescription.trim(),
        description: formDescription.trim(),
        seoKeywords: keywordsArray,
      });
      setEditSuccessMsg(`Product "${formName}" updated successfully.`);
    } else {
      // Create new
      const newProduct: Product = {
        id: `slv-${Date.now().toString().slice(-6)}`,
        name: formName.trim(),
        slug,
        sku: formSku.trim(),
        category: formCategory,
        badge: formBadge || undefined,
        purity: formPurity.trim(),
        gramWeight: formGramWeight.trim(),
        finish: formFinish.trim(),
        dimensions: formDimensions.trim(),
        hallmarked: formHallmarked,
        priceGBP: Number(formPriceGBP),
        priceUSD: Number(formPriceUSD),
        suggestedRetailGBP: Number(formSuggestedRetailGBP),
        suggestedRetailUSD: Number(formSuggestedRetailUSD),
        moq: Number(formMoq),
        stockCount: Number(formStockCount),
        images: imagesArray,
        shortDescription: formShortDescription.trim(),
        description: formDescription.trim(),
        rating: 5.0,
        reviewsCount: 1,
        tierPricing,
        seoKeywords: keywordsArray,
      };

      addProduct(newProduct);
      setEditSuccessMsg(`New product "${formName}" published to wholesale catalog!`);
    }

    setIsModalOpen(false);
    setTimeout(() => setEditSuccessMsg(""), 4000);
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

  // Real-time Retail Margin in Add/Edit Modal
  const modalMarginProfitGBP = Number((formSuggestedRetailGBP - formPriceGBP).toFixed(2));
  const modalMarkupPercent = formPriceGBP > 0 ? Math.round((modalMarginProfitGBP / formPriceGBP) * 100) : 0;
  const modalKeystoneMultiple = formPriceGBP > 0 ? (formSuggestedRetailGBP / formPriceGBP).toFixed(1) : "0.0";

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
            <button
              onClick={handleOpenAddModal}
              className="bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition flex items-center gap-1.5"
            >
              <span className="text-amber-400 font-extrabold text-sm">+</span> Add New Product
            </button>
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
                  <button
                    onClick={handleOpenAddModal}
                    className="flex-1 sm:flex-initial bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black px-4 py-2.5 rounded-lg shadow-sm transition flex items-center justify-center gap-1.5 uppercase tracking-wider"
                  >
                    <span>➕</span> Add New Product Listing
                  </button>
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
                            <button
                              onClick={() => handleOpenEditModal(p)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded transition"
                            >
                              Edit
                            </button>
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
                                <button
                                  onClick={() => handleOpenEditModal(p)}
                                  className="bg-white hover:bg-slate-100 text-slate-900 px-2.5 py-1.5 rounded text-[11px] font-bold border border-slate-300 transition"
                                  title="Edit product details"
                                >
                                  ✏️ Edit
                                </button>
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
        {/* ADD / EDIT PRODUCT MODAL (COMPLETE WITH ALL NECESSARY B2B SILVER FIELDS)  */}
        {/* ========================================================================= */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-fade-in">
              {/* Modal Top Header */}
              <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between flex-shrink-0">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
                    {editingId ? "Edit Wholesale Listing" : "New Wholesale Silver Listing"}
                  </span>
                  <h3 className="font-serif-luxury text-xl font-bold text-slate-950 mt-1">
                    {editingId ? `Edit ${formName || "Product"}` : "Create New 925 Jewelry Product"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-sm transition"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body Form */}
              <form onSubmit={handleSubmitProduct} className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs flex-grow">
                {/* 1. Identification & Classification */}
                <div className="space-y-3">
                  <h4 className="font-serif-luxury text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                    <span>1.</span> Product Identification &amp; Category
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="sm:col-span-2">
                      <label className="font-bold text-slate-700 block mb-1">
                        Product Title / Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Diamond-Cut Cuban Curb Chain (5.5mm) Solid 925"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-semibold focus:outline-none focus:border-slate-950"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="font-bold text-slate-700">SKU Code *</label>
                        <button
                          type="button"
                          onClick={() => setFormSku(generateNewSku(formCategory))}
                          className="text-[10px] text-amber-800 hover:underline font-bold"
                        >
                          ⚡ Auto-Generate
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        value={formSku}
                        onChange={(e) => setFormSku(e.target.value)}
                        placeholder="AG-NECK-009"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-mono font-bold focus:outline-none focus:border-slate-950"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Category *</label>
                      <select
                        value={formCategory}
                        onChange={(e) => {
                          const cat = e.target.value as Product["category"];
                          setFormCategory(cat);
                          if (!editingId) setFormSku(generateNewSku(cat));
                        }}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-semibold focus:outline-none focus:border-slate-950"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Merchandising Badge</label>
                      <select
                        value={formBadge}
                        onChange={(e) => setFormBadge(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-950"
                      >
                        <option value="">No Badge</option>
                        <option value="Bestseller">Bestseller</option>
                        <option value="New In">New In</option>
                        <option value="High Margin">High Margin</option>
                        <option value="Limited Run">Limited Run</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Assay Hallmarking Status
                      </label>
                      <label className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-300 rounded-lg cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formHallmarked}
                          onChange={(e) => setFormHallmarked(e.target.checked)}
                          className="rounded text-slate-950 focus:ring-slate-950"
                        />
                        <span className="font-medium text-slate-800">
                          UK Assay Office Laser/Punch Hallmarked
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* 2. Metal Fineness & Specifications */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-serif-luxury text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                    <span>2.</span> Precious Metal &amp; Physical Specifications
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Metal Purity *</label>
                      <input
                        type="text"
                        required
                        value={formPurity}
                        onChange={(e) => setFormPurity(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-950"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Gram Weight (Crucial for Silver Pricing) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formGramWeight}
                        onChange={(e) => setFormGramWeight(e.target.value)}
                        placeholder="e.g. 14.8g"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-mono font-bold focus:outline-none focus:border-slate-950"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Protective Coating &amp; Finish *
                      </label>
                      <input
                        type="text"
                        required
                        value={formFinish}
                        onChange={(e) => setFormFinish(e.target.value)}
                        placeholder="Diamond-Cut Mirror Polish & Rhodium Barrier"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-950"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Dimensions &amp; Sizing Specs *
                      </label>
                      <input
                        type="text"
                        required
                        value={formDimensions}
                        onChange={(e) => setFormDimensions(e.target.value)}
                        placeholder="Length: 50cm (20 in) | Width: 4.5mm"
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-950"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Wholesale Pricing & Retail Keystoning Margins */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-serif-luxury text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                    <span>3.</span> Wholesale Pricing &amp; Boutique Retail Margins
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Wholesale (GBP £) *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        required
                        value={formPriceGBP}
                        onChange={(e) => handlePriceGBPChange(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-bold focus:outline-none focus:border-slate-950"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Wholesale (USD $) *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        required
                        value={formPriceUSD}
                        onChange={(e) => setFormPriceUSD(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-bold focus:outline-none focus:border-slate-950"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Retail MSRP (GBP £)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        required
                        value={formSuggestedRetailGBP}
                        onChange={(e) => setFormSuggestedRetailGBP(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-950"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Retail MSRP (USD $)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        required
                        value={formSuggestedRetailUSD}
                        onChange={(e) => setFormSuggestedRetailUSD(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-950"
                      />
                    </div>
                  </div>

                  {/* Real-Time Margin Callout */}
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between text-xs text-emerald-950">
                    <div className="flex items-center gap-2">
                      <span className="text-base">💎</span>
                      <div>
                        <span className="font-bold">Boutique Retailer Margin Potential:</span>
                        <span className="block text-[11px] opacity-90">
                          Profit: £{modalMarginProfitGBP.toFixed(2)} per unit ({modalMarkupPercent}% markup)
                        </span>
                      </div>
                    </div>
                    <span className="font-black text-sm text-emerald-900 bg-white border border-emerald-300 px-2.5 py-1 rounded-lg">
                      {modalKeystoneMultiple}x Keystoning
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Minimum Order Quantity (MOQ per line) *
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={formMoq}
                        onChange={(e) => setFormMoq(parseInt(e.target.value, 10) || 1)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-bold focus:outline-none focus:border-slate-950"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Initial Warehouse Units Available *
                      </label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={formStockCount}
                        onChange={(e) => setFormStockCount(parseInt(e.target.value, 10) || 0)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-bold focus:outline-none focus:border-slate-950"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Imagery with Instant Presets Library */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-serif-luxury text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                    <span>4.</span> Jewelry Photography &amp; Visual Assets
                  </h4>

                  {/* 1-Click Image Presets */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1.5">
                      ✨ 1-Click Photo Presets (Click to instantly select high-res photography):
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      {IMAGE_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormPrimaryImage(preset.url)}
                          className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition ${
                            formPrimaryImage === preset.url
                              ? "border-amber-500 ring-2 ring-amber-400/40"
                              : "border-slate-200 hover:border-slate-400"
                          }`}
                        >
                          <Image
                            src={preset.url}
                            alt={preset.name}
                            fill
                            className="object-cover"
                          />
                          <span className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-end p-1 text-[8px] text-white font-bold leading-tight truncate">
                            {preset.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
                    <div className="sm:col-span-2 space-y-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Primary Product Image URL *
                        </label>
                        <input
                          type="url"
                          required
                          value={formPrimaryImage}
                          onChange={(e) => setFormPrimaryImage(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-mono text-[11px] focus:outline-none focus:border-slate-950"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Secondary Angle Image URL (Optional)
                        </label>
                        <input
                          type="url"
                          value={formSecondaryImage}
                          onChange={(e) => setFormSecondaryImage(e.target.value)}
                          placeholder="https://..."
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-mono text-[11px] focus:outline-none focus:border-slate-950"
                        />
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Active Thumbnail
                      </span>
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden mx-auto bg-slate-200 border border-slate-300">
                        {formPrimaryImage ? (
                          <Image
                            src={formPrimaryImage}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Descriptions & SEO Keywords */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-serif-luxury text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                    <span>5.</span> Wholesale Descriptions &amp; SEO Metadata
                  </h4>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Short Wholesale Summary (For line-sheets &amp; catalog grid) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formShortDescription}
                      onChange={(e) => setFormShortDescription(e.target.value)}
                      placeholder="Ultra-fluid liquid silk drape. Crafted in solid 925 silver with mirror rhodium plating."
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-950"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Full Commercial Description (Craftsmanship, hallmarking &amp; packaging) *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Provide detailed technical trade copy for boutique buyers..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-950 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      SEO Keywords (Comma-separated for search ranking)
                    </label>
                    <input
                      type="text"
                      value={formSeoKeywords}
                      onChange={(e) => setFormSeoKeywords(e.target.value)}
                      placeholder="wholesale silver chains, 925 solid sterling silver bulk, UK silver jewelry supplier"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-950"
                    />
                  </div>
                </div>

                {/* Modal Footer Controls */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-white border border-slate-300 text-slate-700 font-bold px-5 py-2.5 rounded-lg hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-slate-950 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-lg shadow-sm transition uppercase tracking-wider text-xs"
                  >
                    {editingId ? "Save Changes →" : "Publish Wholesale Listing →"}
                  </button>
                </div>
              </form>
            </div>
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
