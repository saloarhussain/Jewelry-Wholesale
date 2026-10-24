"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { INITIAL_ORDERS, WholesaleOrder } from "@/data/orders";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [order, setOrder] = useState<WholesaleOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("argent_wholesale_orders");
      const localOrders: WholesaleOrder[] = stored ? JSON.parse(stored) : [];
      const found = localOrders.find((o) => o.id === id) || INITIAL_ORDERS.find((o) => o.id === id);

      if (found) {
        setOrder(found);
      } else if (localOrders.length > 0) {
        setOrder(localOrders[0]);
      } else {
        setOrder(INITIAL_ORDERS[0]);
      }
    } catch {
      setOrder(INITIAL_ORDERS[0]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  if (loading || !order) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-8">
        <div className="text-center text-xs text-slate-500">Loading Commercial Order Details...</div>
      </div>
    );
  }

  const steps = [
    { title: "Order Placed", desc: "Submitted to factory queue", active: true },
    { title: "Payment Cleared", desc: order.paymentMethod, active: true },
    { title: "Assay Hallmarking", desc: "London/Birmingham Assay Office", active: order.status === "Assay Hallmarking" || order.status === "Dispatched" || order.status === "Delivered" },
    { title: "Courier Dispatch", desc: `${order.trackingCarrier || "Express Courier"}`, active: order.status === "Dispatched" || order.status === "Delivered" },
    { title: "Delivered", desc: "Storefront arrival", active: order.status === "Delivered" },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-10 print:bg-white print:py-0">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation & Print Actions */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
          <div>
            <nav className="text-xs text-slate-500 mb-1 flex items-center gap-1.5 font-medium">
              <Link href="/" className="hover:text-slate-900 transition">Trade Home</Link>
              <span>/</span>
              <Link href="/account" className="hover:text-slate-900 transition">Order Management</Link>
              <span>/</span>
              <span className="text-slate-900 font-semibold">{order.orderNumber}</span>
            </nav>
            <h1 className="font-serif-luxury text-3xl font-bold text-slate-950">
              Commercial Order Confirmation
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="bg-white border border-slate-300 hover:border-slate-950 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm transition flex items-center gap-2"
            >
              <span>🖨️</span> Print Commercial Invoice &amp; Packing Slip
            </button>
            <Link
              href="/catalog"
              className="bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm transition"
            >
              Back to Catalog
            </Link>
          </div>
        </div>

        {/* Status Tracker Bar (Hidden in print) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm mb-8 print:hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 mb-6 border-b border-slate-100 gap-2">
            <div>
              <span className="text-xs font-mono text-slate-400 block">ORDER ID</span>
              <span className="font-serif-luxury text-xl font-bold text-slate-950">{order.orderNumber}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                ● Status: {order.status}
              </span>
              <span className="text-xs text-slate-500">
                Placed on {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {steps.map((st, i) => (
              <div key={i} className="flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      st.active ? "bg-slate-950 text-white" : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    {st.active ? "✓" : i + 1}
                  </div>
                  <div className={`h-1 flex-1 rounded ${st.active ? "bg-slate-950" : "bg-slate-200"}`} />
                </div>
                <div className="font-bold text-xs text-slate-900">{st.title}</div>
                <div className="text-[11px] text-slate-500 line-clamp-1">{st.desc}</div>
              </div>
            ))}
          </div>

          {/* Tracking Number Box if Available */}
          {order.trackingNumber && (
            <div className="mt-6 pt-4 border-t border-slate-100 bg-slate-50 p-3.5 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-lg">📦</span>
                <div>
                  <span className="font-bold text-slate-900">{order.trackingCarrier}</span>
                  <span className="text-slate-500 block font-mono">Consignment Ref: {order.trackingNumber}</span>
                </div>
              </div>
              <span className="text-emerald-700 font-bold bg-emerald-100/70 px-2.5 py-1 rounded self-start sm:self-auto">
                Transatlantic DDP Customs Cleared
              </span>
            </div>
          )}
        </div>

        {/* Official Printable Commercial Tax Invoice */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8 print:border-none print:shadow-none print:p-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b-2 border-slate-900">
            <div>
              <span className="font-serif-luxury text-3xl font-black tracking-widest text-slate-950 block">
                ARGENT &amp; CO.
              </span>
              <span className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold block mt-0.5">
                Fine 925 Sterling Silver Wholesale Limited
              </span>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                34 Hatton Garden, London EC1N 8DH, UK<br />
                580 5th Avenue, Suite 1200, New York, NY 10036, USA<br />
                VAT No: GB 882 104 221 | US EIN: 84-2910399
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="bg-slate-950 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded inline-block mb-2">
                Commercial Invoice
              </span>
              <div className="text-xs text-slate-600 space-y-1">
                <div><strong>Invoice Ref:</strong> {order.orderNumber}</div>
                <div><strong>Date:</strong> {new Date(order.createdAt).toISOString().split("T")[0]}</div>
                <div><strong>Currency:</strong> {order.currency}</div>
                <div><strong>Payment Terms:</strong> {order.paymentMethod} ({order.paymentStatus})</div>
              </div>
            </div>
          </div>

          {/* Bill To & Ship To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Billed To (Retailer)
              </span>
              <div className="font-bold text-slate-900 text-sm">{order.companyName}</div>
              <div className="text-slate-600 mt-1">Attn: {order.buyerName}</div>
              <div className="text-slate-600 font-mono">Tax / VAT ID: {order.vatTaxId}</div>
              <div className="text-slate-600">{order.buyerEmail} | {order.buyerPhone}</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <span className="font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Ship-To Commercial Address
              </span>
              <div className="font-bold text-slate-900 text-sm">{order.shippingAddress.line1}</div>
              <div className="text-slate-600 mt-1">
                {order.shippingAddress.city}, {order.shippingAddress.stateOrCounty} {order.shippingAddress.postalCode}
              </div>
              <div className="text-slate-900 font-semibold mt-1">{order.shippingAddress.countryName}</div>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-3">Item / Description</th>
                  <th className="py-3 px-3">SKU</th>
                  <th className="py-3 px-3 text-center">Fineness</th>
                  <th className="py-3 px-3 text-center">Qty</th>
                  <th className="py-3 px-3 text-right">Unit Price</th>
                  <th className="py-3 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((it, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{it.name}</div>
                      <div className="text-[11px] text-slate-400">Assay Office Hallmarked Stamped</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500">{it.sku}</td>
                    <td className="py-3 px-3 text-center font-mono font-semibold text-slate-800">Solid 925</td>
                    <td className="py-3 px-3 text-center font-bold text-slate-900">{it.quantity}</td>
                    <td className="py-3 px-3 text-right text-slate-700">
                      {order.currency === "USD" ? `$${it.unitPrice.toFixed(2)}` : `£${it.unitPrice.toFixed(2)}`}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-950">
                      {order.currency === "USD" ? `$${it.lineTotal.toFixed(2)}` : `£${it.lineTotal.toFixed(2)}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Totals */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t border-slate-200 text-xs">
            <div className="space-y-2 max-w-sm">
              <div className="font-bold text-slate-900 uppercase tracking-wider">
                Certification &amp; Hallmarking Declaration
              </div>
              <p className="text-slate-500 leading-relaxed text-[11px]">
                We certify that this shipment contains virgin 925/1000 millesimal fineness solid sterling silver compliant with the UK Hallmarking Act 1973 and USA Title 15 USC § 294. Hypoallergenic, nickel-free, lead-free.
              </p>
              {order.notes && (
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-[11px] text-slate-700">
                  <strong>Notes:</strong> {order.notes}
                </div>
              )}
            </div>

            <div className="w-full sm:w-72 space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Wholesale Subtotal:</span>
                <span className="font-semibold text-slate-900">
                  {order.currency === "USD" ? `$${order.subtotal.toFixed(2)}` : `£${order.subtotal.toFixed(2)}`}
                </span>
              </div>

              {order.volumeDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Volume Bulk Discount:</span>
                  <span>-{order.currency === "USD" ? `$${order.volumeDiscount.toFixed(2)}` : `£${order.volumeDiscount.toFixed(2)}`}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Prepaid Courier Dispatch:</span>
                <span>{order.shippingFee === 0 ? "FREE" : (order.currency === "USD" ? `$${order.shippingFee.toFixed(2)}` : `£${order.shippingFee.toFixed(2)}`)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>{order.country === "UK" ? "UK VAT (20%):" : "US Export Duty (0%):"}</span>
                <span className="font-semibold text-slate-900">
                  {order.taxAmount === 0 ? "Exempt / Export" : `£${order.taxAmount.toFixed(2)}`}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-300 flex justify-between items-baseline font-bold text-sm text-slate-950">
                <span>Total Due / Paid:</span>
                <span className="text-base text-slate-950 font-black">
                  {order.currency === "USD" ? `$${order.total.toFixed(2)}` : `£${order.total.toFixed(2)}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
