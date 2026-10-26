"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");

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

  // -------------------------------------------------------------
  // Email OTP Verification State (Resend API)
  // -------------------------------------------------------------
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpInput, setEmailOtpInput] = useState("");
  const [emailOtpLoading, setEmailOtpLoading] = useState(false);
  const [emailOtpError, setEmailOtpError] = useState("");
  const [emailDevCode, setEmailDevCode] = useState<string | null>(null);
  const [emailResendTimer, setEmailResendTimer] = useState(0);

  // Countdown timer for email OTP resend
  useEffect(() => {
    if (emailResendTimer > 0) {
      const timer = setTimeout(() => setEmailResendTimer((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [emailResendTimer]);

  // -------------------------------------------------------------
  // Email OTP Handlers
  // -------------------------------------------------------------
  const handleSendEmailOtp = async () => {
    if (!email || !email.includes("@")) {
      setEmailOtpError("Please enter a valid business email address.");
      return;
    }
    setEmailOtpLoading(true);
    setEmailOtpError("");
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send-email", email }),
      });
      const data = await res.json();
      if (data.success) {
        setEmailOtpSent(true);
        setEmailDevCode(data.devCode || null);
        setEmailResendTimer(30);
      } else {
        setEmailOtpError(data.error || "Failed to dispatch email verification code.");
      }
    } catch {
      setEmailOtpError("Network error sending email verification code.");
    } finally {
      setEmailOtpLoading(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (!emailOtpInput || emailOtpInput.trim().length !== 6) {
      setEmailOtpError("Please enter the 6-digit code.");
      return;
    }
    setEmailOtpLoading(true);
    setEmailOtpError("");
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify-email",
          email,
          code: emailOtpInput.trim(),
        }),
      });
      const data = await res.json();
      if (data.success && data.verified) {
        setEmailVerified(true);
        setEmailOtpSent(false);
        setEmailDevCode(null);
        setEmailOtpError("");
      } else {
        setEmailOtpError(data.error || "Invalid code. Please recheck.");
      }
    } catch {
      setEmailOtpError("Network error verifying code.");
    } finally {
      setEmailOtpLoading(false);
    }
  };

  // -------------------------------------------------------------
  // Submit Form Handler
  // -------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Required Field Validations
    if (!companyName.trim() || !ownerName.trim() || !email.trim() || !phoneNumber.trim()) {
      setError("Please fill in all required company and contact information fields.");
      return;
    }

    if (!emailVerified) {
      setError("Please verify your business email address via OTP before submitting your trade application.");
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
        emailVerified: true,
      });

      if (res.success) {
        router.push(redirectParam || "/account");
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
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
      {redirectParam && (
        <div className="bg-amber-50 text-amber-900 text-xs p-3.5 rounded-xl border border-amber-200/80 flex items-center gap-2">
          <span>🔒</span>
          <span>Register your trade account below to unlock wholesale factory prices and volume tiers.</span>
        </div>
      )}

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

        {/* Section 2: Owner / Contact & Email Verification */}
        <div className="space-y-5">
          <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-mono">2</span>
              <span>Primary Contact &amp; Login Credentials</span>
            </h2>
            <span className="text-[11px] text-slate-400 font-medium">Account Access</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Owner Name */}
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

            {/* Email Field with Live Resend OTP Verification */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <span>Business Email Address *</span>
                </label>
                {emailVerified ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
                    <span>✓</span> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold">
                    <span>⚠️</span> OTP Required
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  disabled={emailVerified}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailOtpSent) setEmailOtpSent(false);
                  }}
                  placeholder="buyer@yourboutique.com"
                  className={`flex-1 bg-slate-50 border rounded-lg p-3 text-slate-900 focus:outline-none focus:bg-white transition ${
                    emailVerified
                      ? "border-emerald-300 bg-emerald-50/40 text-emerald-950 font-medium"
                      : "border-slate-300 focus:border-slate-950"
                  }`}
                />

                {!emailVerified && (
                  <button
                    type="button"
                    disabled={emailOtpLoading || !email.includes("@")}
                    onClick={handleSendEmailOtp}
                    className="px-3.5 py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap shadow-xs"
                  >
                    {emailOtpLoading ? (
                      "Sending..."
                    ) : (
                      <>
                        <span>✉️</span>
                        <span>{emailOtpSent ? "Resend" : "Verify"}</span>
                      </>
                    )}
                  </button>
                )}

                {emailVerified && (
                  <button
                    type="button"
                    onClick={() => {
                      setEmailVerified(false);
                      setEmailOtpSent(false);
                      setEmailOtpInput("");
                    }}
                    className="px-3 py-3 border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-semibold transition"
                  >
                    Change
                  </button>
                )}
              </div>

              {/* Email OTP Card */}
              {!emailVerified && emailOtpSent && (
                <div className="mt-2.5 p-3.5 bg-slate-50 border border-slate-300 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-900 flex items-center gap-1">
                      <span>📨</span> Code sent to <strong className="underline">{email}</strong>
                    </span>
                    {emailResendTimer > 0 ? (
                      <span className="text-[10px] text-slate-400 font-mono">Resend in {emailResendTimer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendEmailOtp}
                        className="text-[10px] text-amber-800 hover:underline font-bold"
                      >
                        Resend Code
                      </button>
                    )}
                  </div>

                  {emailDevCode && (
                    <div className="flex items-center justify-between bg-amber-50/80 border border-amber-200 text-amber-950 px-2.5 py-1.5 rounded-lg text-[11px]">
                      <span>🔑 <strong>Demo Code:</strong> <code className="font-mono font-bold tracking-wider">{emailDevCode}</code></span>
                      <button
                        type="button"
                        onClick={() => setEmailOtpInput(emailDevCode)}
                        className="text-[10px] font-bold bg-amber-200 hover:bg-amber-300 text-amber-950 px-2 py-0.5 rounded transition"
                      >
                        Auto-fill
                      </button>
                    </div>
                  )}

                  {emailOtpError && (
                    <p className="text-[11px] text-rose-600 font-semibold">⚠️ {emailOtpError}</p>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={emailOtpInput}
                      onChange={(e) => setEmailOtpInput(e.target.value.replace(/\D/g, ""))}
                      placeholder="••••••"
                      className="w-32 text-center font-mono font-black text-base tracking-[0.3em] bg-white border border-slate-300 rounded-lg p-2 focus:outline-none focus:border-slate-950"
                    />
                    <button
                      type="button"
                      disabled={emailOtpLoading || emailOtpInput.length !== 6}
                      onClick={handleVerifyEmailOtp}
                      className="flex-1 bg-slate-950 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition"
                    >
                      {emailOtpLoading ? "Verifying..." : "Confirm"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Standard Default Contact Phone Number Field (No OTP) */}
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

            {/* Passwords */}
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

        {/* Section 3: Registered Invoicing & Delivery Address */}
        <div className="space-y-4">
          <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-mono">3</span>
              <span>Registered Invoicing &amp; Storefront Address</span>
            </h2>
            <span className="text-[11px] text-slate-400 font-medium">VAT &amp; DDP Delivery</span>
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

        {/* Verification Status Banner before submit */}
        {!emailVerified && (
          <div className="bg-amber-50 border border-amber-200/90 rounded-xl p-3.5 text-[11px] text-amber-950 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-base">🔒</span>
              <span>
                <strong>Email Verification Required:</strong> Please verify your business email address with the 6-digit code sent via Resend before submitting.
              </span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !emailVerified}
          className={`w-full font-bold py-4 rounded-xl text-xs uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-2 ${
            emailVerified
              ? "bg-slate-950 hover:bg-slate-800 text-white shadow-md cursor-pointer"
              : "bg-slate-200 text-slate-500 cursor-not-allowed"
          }`}
        >
          {loading ? (
            "Registering Verified Trade Account..."
          ) : emailVerified ? (
            <>
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span>Submit Verified Wholesale Trade Application</span>
            </>
          ) : (
            <>
              <span>🔒</span>
              <span>Verify Email to Submit Application</span>
            </>
          )}
        </button>
      </form>

      {/* Login Link */}
      <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
        Already have a registered wholesale account?{" "}
        <Link
          href={`/account/login${redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ""}`}
          className="font-bold text-slate-950 hover:underline"
        >
          Sign In Here &rarr;
        </Link>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  const { minimumOrderFormatted } = useCurrency();

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

        {/* Suspense Wrapped Form */}
        <Suspense fallback={<div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">Loading trade application form...</div>}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
