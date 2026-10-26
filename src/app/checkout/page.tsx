"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { useCurrency } from "@/components/CurrencyContext";
import { useAuth } from "@/components/AuthContext";
import { WholesaleOrder, OrderItem } from "@/data/orders";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    currentSubtotal,
    isMinimumMet,
    volumeDiscountAmount,
    estimatedShippingFee,
    finalTotal,
    clearCart,
  } = useCart();
  const { currency, minimumOrderFormatted } = useCurrency();
  const { user } = useAuth();

  const initialCountry: "UK" | "USA" = (user?.country?.toLowerCase().includes("us") || currency === "USD") ? "USA" : "UK";
  const [country, setCountry] = useState<"UK" | "USA">(initialCountry);
  const [companyName, setCompanyName] = useState(user?.companyName || "");
  const [buyerName, setBuyerName] = useState(user?.name || "");
  const [buyerEmail, setBuyerEmail] = useState(user?.email || "");
  const [buyerPhone, setBuyerPhone] = useState(user?.phoneNumber || "+44 20 7946 0888");
  const [vatTaxId, setVatTaxId] = useState(user?.vatOrTaxId || "");
  const [line1, setLine1] = useState(user?.address || (country === "UK" ? "12 Hatton Garden" : "450 7th Avenue"));
  const [city, setCity] = useState(user?.city || (country === "UK" ? "London" : "New York"));
  const [stateOrCounty, setStateOrCounty] = useState(user?.stateOrCounty || (country === "UK" ? "Greater London" : "NY"));
  const [postalCode, setPostalCode] = useState(user?.postalCode || (country === "UK" ? "EC1N 8DH" : "10123"));
  const [paymentMethod, setPaymentMethod] = useState<"Bank Wire Transfer (BACS/ACH)" | "Credit/Debit Card" | "Net 30 Terms">("Bank Wire Transfer (BACS/ACH)");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Sync state if user changes
  useEffect(() => {
    if (user) {
      setCompanyName(user.companyName);
      setBuyerName(user.name);
      setBuyerEmail(user.email);
      setCountry(user.country.toLowerCase().includes("us") ? "USA" : "UK");
      if (user.phoneNumber) setBuyerPhone(user.phoneNumber);
      if (user.address) setLine1(user.address);
      if (user.city) setCity(user.city);
      if (user.stateOrCounty) setStateOrCounty(user.stateOrCounty);
      if (user.postalCode) setPostalCode(user.postalCode);
      if (user.vatOrTaxId) setVatTaxId(user.vatOrTaxId);
    }
  }, [user]);

  // UK VAT calculation (20% for UK, 0% for USA international export)
  const isUkVat = country === "UK";
  const taxAmount = isUkVat ? Number(((currentSubtotal - volumeDiscountAmount) * 0.20).toFixed(2)) : 0;
  const orderGrandTotal = currentSubtotal - volumeDiscountAmount + estimatedShippingFee + taxAmount;

  if (!isMinimumMet || items.length === 0) {
    return (
      <div className="bg-[#FAF9F6] min-h-screen py-16">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-slate-200 text-center">
          <div className="text-3xl mb-3">⚠️</div>
          <h2 className="font-serif-luxury text-xl font-bold text-slate-900 mb-2">
            Minimum Order Requirement Not Met
          </h2>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            Our wholesale trade portal requires a minimum basket value of {minimumOrderFormatted} to process orders. Please add items to continue.
          </p>
          <Link
            href="/cart"
            className="bg-slate-950 text-white text-xs font-bold px-6 py-3 rounded-lg inline-block uppercase tracking-wider"
          >
            Return to Wholesale Bag
          </Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const newOrderId = `ord-${Date.now().toString().slice(-6)}`;
    const orderNumber = country === "UK" ? `ARG-UK-${Math.floor(1000 + Math.random() * 9000)}` : `ARG-USA-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderItems: OrderItem[] = items.map((item) => {
      const unitPrice = currency === "USD" ? item.product.priceUSD : item.product.priceGBP;
      return {
        productId: item.product.id,
        name: item.product.name,
        sku: item.product.sku,
        quantity: item.quantity,
        unitPrice,
        lineTotal: unitPrice * item.quantity,
        image: item.product.images[0],
      };
    });

    const newOrder: WholesaleOrder = {
      id: newOrderId,
      orderNumber,
      createdAt: new Date().toISOString(),
      companyName,
      buyerName,
      buyerEmail,
      buyerPhone,
      vatTaxId: vatTaxId || "N/A",
      country,
      shippingAddress: {
        line1,
        city,
        stateOrCounty,
        postalCode,
        countryName: country === "UK" ? "United Kingdom" : "United States",
      },
      items: orderItems,
      currency,
      subtotal: currentSubtotal,
      volumeDiscount: volumeDiscountAmount,
      shippingFee: estimatedShippingFee,
      taxAmount,
      total: orderGrandTotal,
      status: "Payment Confirmed",
      trackingCarrier: country === "UK" ? "Royal Mail Special Delivery Guaranteed 1pm" : "FedEx International Priority DDP",
      trackingNumber: country === "UK" ? `RM${Math.floor(100000000 + Math.random() * 900000000)}GB` : `FX-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      paymentMethod,
      paymentStatus: paymentMethod === "Net 30 Terms" ? "Terms Approved" : "Paid",
      notes: notes || "Assay Hallmarking Certificate Enclosed.",
    };

    // Save to localStorage orders list
    try {
      const existingOrdersStr = localStorage.getItem("argent_wholesale_orders");
      const existingOrders: WholesaleOrder[] = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
      const updatedOrders = [newOrder, ...existingOrders];
      localStorage.setItem("argent_wholesale_orders", JSON.stringify(updatedOrders));
    } catch {
      // fallback
    }

    // Save order into Supabase database via API
    try {
      fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      }).catch((err) => console.warn("Could not sync order to database:", err));
    } catch {
      // ignore
    }

    clearCart();

    setTimeout(() => {
      setSubmitting(false);
      router.push(`/orders/${newOrderId}`);
    }, 1200);
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <nav className="text-xs text-slate-500 mb-2 flex items-center gap-1.5 font-medium">
            <Link href="/cart" className="hover:text-slate-900 transition">Wholesale Bag</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">B2B Trade Checkout &amp; Invoicing</span>
          </nav>
          <h1 className="font-serif-luxury text-3xl font-bold text-slate-950">
            Wholesale Trade Checkout
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Dispatching solid 925 sterling silver to UK and USA jewelry retailers.
          </p>
        </div>

        {/* Guest prompt to sign in */}
        {!user && (
          <div className="bg-amber-50 border border-amber-200/90 rounded-xl p-4 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-950 shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">🔒</span>
              <span>
                Already have a verified wholesale account? <strong>Sign in</strong> to auto-fill your registered company details and view approved invoice terms.
              </span>
            </div>
            <Link
              href="/account/login?redirect=/checkout"
              className="bg-slate-950 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-lg text-xs self-start sm:self-auto uppercase tracking-wide flex-shrink-0 transition"
            >
              Trade Sign In
            </Link>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Retailer Company Information */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="font-serif-luxury text-base font-bold text-slate-950 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-mono">1</span>
                  <span>Retailer Business Verification &amp; Invoicing</span>
                </h3>
                <span className="text-xs text-slate-500">Commercial B2B Invoice</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Company / Store Name *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Kensington Fine Jewels Ltd"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-950"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Authorized Buyer Name *</label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="e.g. Victoria Sterling"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-950"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Trade Email (For Invoices &amp; Tracking) *</label>
                  <input
                    type="email"
                    required
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="orders@yourboutique.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-950"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Telephone *</label>
                  <input
                    type="tel"
                    required
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-950"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">
                    {country === "UK" ? "UK VAT Registration Number (Optional for Invoice)" : "US Federal EIN or Resale Exemption Certificate"}
                  </label>
                  <input
                    type="text"
                    value={vatTaxId}
                    onChange={(e) => setVatTaxId(e.target.value)}
                    placeholder={country === "UK" ? "e.g. GB 928 411 902" : "e.g. EIN 13-9827101 / CA Resale Cert"}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-950 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 2. Destination & Shipping Address */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-3 border-b border-slate-100 gap-2.5">
                <h3 className="font-serif-luxury text-sm sm:text-base font-bold text-slate-950 flex items-center gap-2">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-900 text-white text-[11px] sm:text-xs flex items-center justify-center font-mono flex-shrink-0">2</span>
                  <span>Destination &amp; Commercial Delivery</span>
                </h3>

                {/* Country Radio Switcher */}
                <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-100 p-1 rounded-lg text-xs font-semibold self-start sm:self-auto w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setCountry("UK")}
                    className={`flex-1 sm:flex-initial px-2.5 py-1 rounded transition text-center ${
                      country === "UK" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    🇬🇧 UK
                  </button>
                  <button
                    type="button"
                    onClick={() => setCountry("USA")}
                    className={`flex-1 sm:flex-initial px-2.5 py-1 rounded transition text-center ${
                      country === "USA" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    🇺🇸 USA
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={line1}
                    onChange={(e) => setLine1(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-950"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-950"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {country === "UK" ? "County" : "State"} *
                  </label>
                  <input
                    type="text"
                    required
                    value={stateOrCounty}
                    onChange={(e) => setStateOrCounty(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-950"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">
                    {country === "UK" ? "UK Postcode *" : "US ZIP Code *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-slate-950 font-mono uppercase"
                  />
                </div>
              </div>

              {/* Courier Carrier Indicator */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{country === "UK" ? "📦" : "✈️"}</span>
                  <div>
                    <span className="font-bold text-slate-900 block">
                      {country === "UK" ? "Royal Mail Special Delivery (Next Day 1pm)" : "FedEx International Priority DDP (2-3 Business Days)"}
                    </span>
                    <span className="text-slate-500">
                      {country === "UK" ? "Direct from London Hatton Garden facility" : "Transatlantic priority with prepaid import customs clearance"}
                    </span>
                  </div>
                </div>
                <span className="font-semibold text-emerald-700">
                  {estimatedShippingFee === 0 ? "FREE" : (currency === "USD" ? `$${estimatedShippingFee.toFixed(2)}` : `£${estimatedShippingFee.toFixed(2)}`)}
                </span>
              </div>
            </div>

            {/* 3. Trade Payment Method */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="font-serif-luxury text-base font-bold text-slate-950 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-mono">3</span>
                  <span>B2B Settlement &amp; Payment Method</span>
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <label
                  className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                    paymentMethod === "Bank Wire Transfer (BACS/ACH)"
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-white text-slate-800 border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "Bank Wire Transfer (BACS/ACH)"}
                    onChange={() => setPaymentMethod("Bank Wire Transfer (BACS/ACH)")}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-bold text-sm">Wholesale Bank Wire / BACS / ACH (Recommended)</div>
                    <p className={`text-xs mt-1 ${paymentMethod === "Bank Wire Transfer (BACS/ACH)" ? "text-slate-300" : "text-slate-500"}`}>
                      Direct merchant clearing. UK BACS sort code and US Fedwire/ACH routing numbers generated immediately on order invoice. Zero processing fee.
                    </p>
                  </div>
                </label>

                <label
                  className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                    paymentMethod === "Credit/Debit Card"
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-white text-slate-800 border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "Credit/Debit Card"}
                    onChange={() => setPaymentMethod("Credit/Debit Card")}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-bold text-sm">Corporate Credit / Debit Card (Visa, MC, Amex)</div>
                    <p className={`text-xs mt-1 ${paymentMethod === "Credit/Debit Card" ? "text-slate-300" : "text-slate-500"}`}>
                      Instant settlement with 3D Secure business authentication. Dispatched same-day.
                    </p>
                  </div>
                </label>

                <label
                  className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                    paymentMethod === "Net 30 Terms"
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-white text-slate-800 border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "Net 30 Terms"}
                    onChange={() => setPaymentMethod("Net 30 Terms")}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-bold text-sm">Net 30 Trade Credit Terms</div>
                    <p className={`text-xs mt-1 ${paymentMethod === "Net 30 Terms" ? "text-slate-300" : "text-slate-500"}`}>
                      For approved retail partners. 30 days deferred invoicing upon credit check.
                    </p>
                  </div>
                </label>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1 text-xs">Assay Office Notes / Special Instructions</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Include physical UK Hallmarking certificates in box; deliver to retail rear entrance."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-950"
                />
              </div>
            </div>
          </div>

          {/* Right Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm sticky top-28 space-y-4">
              <h3 className="font-serif-luxury text-base font-bold text-slate-950 pb-3 border-b border-slate-100">
                Line Items Summary ({items.length})
              </h3>

              <div className="max-h-60 overflow-y-auto space-y-3 pr-1 text-xs divide-y divide-slate-100">
                {items.map((item) => {
                  const unitPrice = currency === "USD" ? item.product.priceUSD : item.product.priceGBP;
                  return (
                    <div key={item.product.id} className="pt-2 first:pt-0 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-slate-900 truncate max-w-[170px]">{item.product.name}</div>
                        <div className="text-slate-400">{item.quantity} units × {currency === "USD" ? `$${unitPrice.toFixed(2)}` : `£${unitPrice.toFixed(2)}`}</div>
                      </div>
                      <span className="font-bold text-slate-900">
                        {currency === "USD" ? `$${(unitPrice * item.quantity).toFixed(2)}` : `£${(unitPrice * item.quantity).toFixed(2)}`}
                      </span>
                    </div>
                  );
                })}
              </div>

              <dl className="space-y-2 text-xs pt-3 border-t border-slate-200">
                <div className="flex justify-between text-slate-600">
                  <span>Wholesale Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    {currency === "USD" ? `$${currentSubtotal.toFixed(2)}` : `£${currentSubtotal.toFixed(2)}`}
                  </span>
                </div>

                {volumeDiscountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Volume Discount</span>
                    <span>-{currency === "USD" ? `$${volumeDiscountAmount.toFixed(2)}` : `£${volumeDiscountAmount.toFixed(2)}`}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Courier Shipping</span>
                  <span>{estimatedShippingFee === 0 ? "FREE" : (currency === "USD" ? `$${estimatedShippingFee.toFixed(2)}` : `£${estimatedShippingFee.toFixed(2)}`)}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>{isUkVat ? "UK VAT (20%)" : "US Export Duty (0% Tax-Free)"}</span>
                  <span className="font-semibold text-slate-900">
                    {taxAmount === 0 ? "Tax Exempt" : `£${taxAmount.toFixed(2)}`}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="font-serif-luxury text-base font-bold text-slate-950">
                    Total Invoiced ({currency})
                  </span>
                  <span className="text-2xl font-black text-slate-950">
                    {currency === "USD" ? `$${orderGrandTotal.toFixed(2)}` : `£${orderGrandTotal.toFixed(2)}`}
                  </span>
                </div>
              </dl>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider py-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span>Processing Commercial Dispatch...</span>
                ) : (
                  <>
                    <span>Confirm &amp; Generate Trade Order</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </button>

              <div className="text-[11px] text-slate-400 text-center pt-2">
                By submitting, you confirm purchasing for retail resale and certify adherence to UK/US trade guidelines.
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
