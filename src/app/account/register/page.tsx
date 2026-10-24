"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { useCurrency } from "@/components/CurrencyContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { minimumOrderFormatted } = useCurrency();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [businessType, setBusinessType] = useState<"Jewelry Boutique" | "Online E-Commerce" | "Department Store" | "Piercing Studio" | "Chain Retailer">("Jewelry Boutique");
  const [vatOrTaxId, setVatOrTaxId] = useState("");
  const [country, setCountry] = useState<"UK" | "USA">("UK");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [agreedMoq, setAgreedMoq] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedMoq) {
      setError("Please acknowledge our minimum trade order policy to continue.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      await register({
        name,
        email,
        companyName,
        businessType,
        vatOrTaxId: vatOrTaxId || "PENDING-TAX-VERIF",
        country,
        city: city || (country === "UK" ? "London" : "New York"),
      });
      router.push("/account");
    } catch {
      setError("Failed to create wholesale account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-16 flex items-center justify-center">
      <div className="max-w-xl w-full mx-4">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-3">
            <span className="font-serif-luxury text-3xl font-black tracking-widest text-slate-950">
              ARGENT &amp; CO.
            </span>
          </Link>
          <h1 className="font-serif-luxury text-2xl font-bold text-slate-900">
            Apply for Wholesale Trade Account
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Direct-from-manufacturer pricing for independent jewelry retailers and online boutiques in the UK and USA.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Company / Store Name *</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Mayfair Silver Atelier"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-slate-950"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Authorized Buyer Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Charlotte Hayes"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-slate-950"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Business Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="buyer@mayfairatelier.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-slate-950"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Account Password *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-slate-950"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Country *</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value as "UK" | "USA")}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-slate-950"
                >
                  <option value="UK">🇬🇧 United Kingdom</option>
                  <option value="USA">🇺🇸 United States</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">City / Region *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Manchester / Austin"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-slate-950"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Business Operation Type *</label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-slate-950"
                >
                  <option value="Jewelry Boutique">Physical Jewelry Boutique</option>
                  <option value="Online E-Commerce">Online E-Commerce Store</option>
                  <option value="Department Store">Department / Multi-brand Store</option>
                  <option value="Piercing Studio">Piercing / Earring Studio</option>
                  <option value="Chain Retailer">Retail Chain (5+ stores)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {country === "UK" ? "UK VAT / Co. Reg Number" : "US EIN / Resale Certificate"}
                </label>
                <input
                  type="text"
                  value={vatOrTaxId}
                  onChange={(e) => setVatOrTaxId(e.target.value)}
                  placeholder={country === "UK" ? "e.g. GB 889 120 411" : "e.g. EIN 82-1928411"}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-slate-950 font-mono"
                />
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  required
                  checked={agreedMoq}
                  onChange={(e) => setAgreedMoq(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300"
                />
                <span className="leading-snug">
                  I understand that this is a trade-only wholesale supplier with a <strong>{minimumOrderFormatted} minimum order value</strong> per transaction, and that products are intended for retail resale or professional mounting.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-3.5 rounded-lg text-xs uppercase tracking-wider transition shadow-sm"
            >
              {loading ? "Submitting Application..." : "Submit Application & Open Trade Account"}
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-slate-500">
            Already have a registered account?{" "}
            <Link href="/account/login" className="font-bold text-slate-900 hover:underline">
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
