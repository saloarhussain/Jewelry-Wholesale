"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { useCurrency } from "@/components/CurrencyContext";

const BUSINESS_TYPES = [
  "Jewelry Boutique & Storefront",
  "Online E-Commerce & DTC Brand",
  "Department Store & High Street Retailer",
  "Piercing Studio & Fine Jewelry Lounge",
  "Wholesale Distributor / Showroom",
  "Independent Designer & Consignment Shop",
];

const COUNTRIES = [
  "United Kingdom",
  "United States",
  "Canada",
  "Australia",
  "Ireland",
  "Germany",
  "France",
  "Italy",
  "Spain",
  "Netherlands",
  "Switzerland",
  "International / Other",
];

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { minimumOrderFormatted } = useCurrency();

  // Form State
  const [companyName, setCompanyName] = useState("");
  const [businessType, setBusinessType] = useState(BUSINESS_TYPES[0]);
  const [website, setWebsite] = useState("");
  const [vatOrTaxId, setVatOrTaxId] = useState("");

  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateOrCounty, setStateOrCounty] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("United Kingdom");

  const [agreeMoq, setAgreeMoq] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validations
    if (!companyName.trim() || !ownerName.trim() || !email.trim() || !phoneNumber.trim()) {
      setError("Please fill in all required company and contact information fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    if (!address.trim() || !city.trim() || !postalCode.trim()) {
      setError("Please provide your complete business registered address and postal/zip code.");
      return;
    }

    if (!agreeMoq) {
      setError("Please confirm compliance with our minimum wholesale trade order policy.");
      return;
    }

    setLoading(true);

    try {
      const res = await register({
        name: ownerName,
        email,
        password,
        companyName,
        website: website.trim() ? (website.startsWith("http") ? website : `https://${website}`) : undefined,
        phoneNumber,
        vatOrTaxId: vatOrTaxId.trim() || "PENDING-VERIFICATION",
        address,
        city,
        stateOrCounty,
        postalCode,
        country,
        businessType,
      });

      if (res.success) {
        router.push("/account");
      } else {
        setError(res.error || "Failed to register account.");
      }
    } catch {
      setError("An unexpected registration error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-12 sm:py-16 px-4">
      <div className="max-w-2xl w-full mx-auto">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-3">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-widest text-slate-950 block">
              ARGENT &amp; CO.
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase font-medium text-slate-500 block">
              Fine 925 Sterling Silver Wholesale
            </span>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            Apply for Wholesale Trade Account
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Direct-from-manufacturer bulk wholesale jewelry pricing with low {minimumOrderFormatted} minimum order value.
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
          {error && (
            <div className="bg-rose-50 text-rose-800 text-xs p-4 rounded-xl border border-rose-200 flex items-start gap-2">
              <span className="text-rose-500 font-bold">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8 text-xs">
            {/* Section 1: Company & Business Identity */}
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-mono">1</span>
                  <span>Company &amp; Business Information</span>
                </h2>
                <span className="text-[11px] text-slate-400 font-medium">B2B Trade Verification</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Company / Store Name *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Mayfair Fine Jewelry Ltd"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-slate-950 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Business Type *</label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-slate-950 focus:bg-white transition"
                  >
                    {BUSINESS_TYPES.map((bt) => (
                      <option key={bt} value={bt}>
                        {bt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Business Website / Storefront URL
                  </label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="www.yourboutique.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-slate-950 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Tax Identity / VAT / EIN Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={vatOrTaxId}
                    onChange={(e) => setVatOrTaxId(e.target.value)}
                    placeholder="e.g. GB 928 411 902 / EIN 13-9827101"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-slate-950 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Owner / Authorized Contact & Credentials */}
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-mono">2</span>
                  <span>Primary Contact &amp; Login Credentials</span>
                </h2>
                <span className="text-[11px] text-slate-400 font-medium">Account Access</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Owner / Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. Charlotte Hayes"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-slate-950 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Business Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="buyer@yourboutique.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-slate-950 focus:bg-white transition"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Contact Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. +44 20 7946 0912 or +1 (212) 555-0188"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-slate-950 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Create Password *</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-slate-950 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Confirm Password *</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-slate-950 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Registered Trading Address */}
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-mono">3</span>
                  <span>Registered Business Address</span>
                </h2>
                <span className="text-[11px] text-slate-400 font-medium">Commercial Shipping</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 42 Bond Street, Suite 3B"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-slate-950 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. London / New York"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-slate-950 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">State / Province / County</label>
                  <input
                    type="text"
                    value={stateOrCounty}
                    onChange={(e) => setStateOrCounty(e.target.value)}
                    placeholder="e.g. Greater London / NY"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-slate-950 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">ZIP / Postal Code *</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g. W1S 2AA / 10012"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-slate-950 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Country *</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-slate-950 focus:bg-white transition"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 4: Wholesale Agreement */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreeMoq}
                  onChange={(e) => setAgreeMoq(e.target.checked)}
                  className="w-4 h-4 rounded text-slate-950 focus:ring-slate-950 mt-0.5"
                />
                <span className="text-[11px] text-slate-600 leading-relaxed">
                  I certify that I am purchasing on behalf of a verified commercial entity for retail resale and acknowledge the minimum wholesale order threshold of <strong className="text-slate-900">{minimumOrderFormatted}</strong>.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-950 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-wider transition shadow-sm"
            >
              {loading ? "Registering Verified Trade Account..." : "Create Verified Trade Account"}
            </button>
          </form>

          {/* Login Link */}
          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Already have a registered wholesale account?{" "}
            <Link href="/account/login" className="font-bold text-slate-950 hover:underline">
              Sign In Here &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
