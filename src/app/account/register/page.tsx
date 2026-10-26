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
  // Email OTP Verification State
  // -------------------------------------------------------------
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpInput, setEmailOtpInput] = useState("");
  const [emailOtpLoading, setEmailOtpLoading] = useState(false);
  const [emailOtpError, setEmailOtpError] = useState("");
  const [emailDevCode, setEmailDevCode] = useState<string | null>(null);
  const [emailResendTimer, setEmailResendTimer] = useState(0);

  // -------------------------------------------------------------
  // WhatsApp OTP Verification State
  // -------------------------------------------------------------
  const [whatsappVerified, setWhatsappVerified] = useState(false);
  const [whatsappOtpSent, setWhatsappOtpSent] = useState(false);
  const [whatsappOtpInput, setWhatsappOtpInput] = useState("");
  const [whatsappOtpLoading, setWhatsappOtpLoading] = useState(false);
  const [whatsappOtpError, setWhatsappOtpError] = useState("");
  const [whatsappDevCode, setWhatsappDevCode] = useState<string | null>(null);
  const [whatsappDirectUrl, setWhatsappDirectUrl] = useState<string | null>(null);
  const [whatsappResendTimer, setWhatsappResendTimer] = useState(0);

  // Timers for OTP resend countdown
  useEffect(() => {
    if (emailResendTimer > 0) {
      const timer = setTimeout(() => setEmailResendTimer((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [emailResendTimer]);

  useEffect(() => {
    if (whatsappResendTimer > 0) {
      const timer = setTimeout(() => setWhatsappResendTimer((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [whatsappResendTimer]);

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
        setEmailOtpError(data.error || "Failed to send email verification code.");
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
  // WhatsApp OTP Handlers
  // -------------------------------------------------------------
  const handleSendWhatsappOtp = async () => {
    if (!phoneNumber || phoneNumber.trim().length < 6) {
      setWhatsappOtpError("Please enter a valid phone number with country code (e.g. +44 7911 123456).");
      return;
    }
    setWhatsappOtpLoading(true);
    setWhatsappOtpError("");
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send-whatsapp", phone: phoneNumber }),
      });
      const data = await res.json();
      if (data.success) {
        setWhatsappOtpSent(true);
        setWhatsappDevCode(data.devCode || null);
        setWhatsappDirectUrl(data.whatsappDirectUrl || null);
        setWhatsappResendTimer(30);
      } else {
        setWhatsappOtpError(data.error || "Failed to dispatch WhatsApp OTP.");
      }
    } catch {
      setWhatsappOtpError("Network error sending WhatsApp OTP.");
    } finally {
      setWhatsappOtpLoading(false);
    }
  };

  const handleVerifyWhatsappOtp = async () => {
    if (!whatsappOtpInput || whatsappOtpInput.trim().length !== 6) {
      setWhatsappOtpError("Please enter the 6-digit WhatsApp code.");
      return;
    }
    setWhatsappOtpLoading(true);
    setWhatsappOtpError("");
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify-whatsapp",
          phone: phoneNumber,
          code: whatsappOtpInput.trim(),
        }),
      });
      const data = await res.json();
      if (data.success && data.verified) {
        setWhatsappVerified(true);
        setWhatsappOtpSent(false);
        setWhatsappDevCode(null);
        setWhatsappOtpError("");
      } else {
        setWhatsappOtpError(data.error || "Invalid WhatsApp code. Please recheck.");
      }
    } catch {
      setWhatsappOtpError("Network error verifying WhatsApp OTP.");
    } finally {
      setWhatsappOtpLoading(false);
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
      setError("Please verify your business email address via OTP before submitting.");
      return;
    }

    if (!whatsappVerified) {
      setError("Please verify your contact phone number on WhatsApp via OTP before submitting.");
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
        whatsappVerified: true,
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

        {/* Section 2: Owner / Contact, Email Verification & WhatsApp Phone Verification */}
        <div className="space-y-5">
          <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-mono">2</span>
              <span>Contact Credentials &amp; Live Verification</span>
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">2-Factor B2B Security</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Owner Name */}
            <div className="sm:col-span-2">
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

            {/* Email Field with Live OTP Verification */}
            <div className="sm:col-span-2">
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <span>Business Email Address *</span>
                  <span className="text-[10px] text-slate-500 font-normal">(Login &amp; Invoicing)</span>
                </label>
                {emailVerified ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    <span>✓</span> Email Verified
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
                    className="px-4 py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap shadow-xs"
                  >
                    {emailOtpLoading ? (
                      "Sending..."
                    ) : (
                      <>
                        <span>✉️</span>
                        <span>{emailOtpSent ? "Resend OTP" : "Verify Email"}</span>
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
                      <span>📨</span> Verification code sent to <strong className="underline">{email}</strong>
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
                    <div className="flex items-center justify-between bg-amber-50/80 border border-amber-200 text-amber-950 px-3 py-1.5 rounded-lg text-[11px]">
                      <span>🔑 <strong>Test Verification Code:</strong> <code className="font-mono font-bold tracking-wider">{emailDevCode}</code></span>
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
                      className="w-36 text-center font-mono font-black text-base tracking-[0.3em] bg-white border border-slate-300 rounded-lg p-2 focus:outline-none focus:border-slate-950"
                    />
                    <button
                      type="button"
                      disabled={emailOtpLoading || emailOtpInput.length !== 6}
                      onClick={handleVerifyEmailOtp}
                      className="flex-1 bg-slate-950 hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition"
                    >
                      {emailOtpLoading ? "Verifying..." : "Confirm Email Code"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* WhatsApp Phone Field with Live WhatsApp OTP Verification */}
            <div className="sm:col-span-2">
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <span>Phone Number (WhatsApp Enabled) *</span>
                  <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded font-semibold flex items-center gap-1">
                    <svg className="w-2.5 h-2.5 fill-emerald-600" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771z" />
                    </svg>
                    WhatsApp OTP
                  </span>
                </label>
                {whatsappVerified ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    <span>✓</span> WhatsApp Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                    <span>⚠️</span> WhatsApp OTP Required
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="tel"
                  required
                  disabled={whatsappVerified}
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    if (whatsappOtpSent) setWhatsappOtpSent(false);
                  }}
                  placeholder="e.g. +44 7911 123456 or +1 (212) 555-0188"
                  className={`flex-1 bg-slate-50 border rounded-lg p-3 text-slate-900 focus:outline-none focus:bg-white transition ${
                    whatsappVerified
                      ? "border-emerald-300 bg-emerald-50/40 text-emerald-950 font-medium"
                      : "border-slate-300 focus:border-slate-950"
                  }`}
                />

                {!whatsappVerified && (
                  <button
                    type="button"
                    disabled={whatsappOtpLoading || phoneNumber.trim().length < 6}
                    onClick={handleSendWhatsappOtp}
                    className="px-4 py-3 bg-[#25D366] hover:bg-[#1EBE5D] disabled:bg-slate-300 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap shadow-xs"
                  >
                    {whatsappOtpLoading ? (
                      "Sending..."
                    ) : (
                      <>
                        <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24">
                          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z" />
                        </svg>
                        <span>{whatsappOtpSent ? "Resend OTP" : "Send WhatsApp OTP"}</span>
                      </>
                    )}
                  </button>
                )}

                {whatsappVerified && (
                  <button
                    type="button"
                    onClick={() => {
                      setWhatsappVerified(false);
                      setWhatsappOtpSent(false);
                      setWhatsappOtpInput("");
                    }}
                    className="px-3 py-3 border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-semibold transition"
                  >
                    Change
                  </button>
                )}
              </div>

              {/* WhatsApp OTP Card */}
              {!whatsappVerified && whatsappOtpSent && (
                <div className="mt-2.5 p-3.5 bg-emerald-50/80 border border-emerald-300 rounded-xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-950 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 fill-emerald-600" viewBox="0 0 24 24">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771z" />
                      </svg>
                      <span>WhatsApp OTP sent to <strong className="font-mono">{phoneNumber}</strong></span>
                    </span>
                    {whatsappResendTimer > 0 ? (
                      <span className="text-[10px] text-emerald-800 font-mono">Resend in {whatsappResendTimer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendWhatsappOtp}
                        className="text-[10px] text-emerald-900 hover:underline font-bold"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>

                  {/* Direct WhatsApp link */}
                  {whatsappDirectUrl && (
                    <div className="flex items-center justify-between bg-white border border-emerald-200 text-emerald-900 px-3 py-2 rounded-lg text-xs shadow-2xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">💬</span>
                        <span className="text-[11px]">Open WhatsApp to view or send your verification code:</span>
                      </div>
                      <a
                        href={whatsappDirectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold bg-[#25D366] hover:bg-[#1EBE5D] text-white px-2.5 py-1 rounded-md transition flex items-center gap-1 shadow-xs"
                      >
                        <span>Open WhatsApp</span>
                        <span>↗</span>
                      </a>
                    </div>
                  )}

                  {whatsappDevCode && (
                    <div className="flex items-center justify-between bg-white/90 border border-emerald-200 text-emerald-950 px-3 py-1.5 rounded-lg text-[11px]">
                      <span>🔑 <strong>Test WhatsApp OTP:</strong> <code className="font-mono font-bold tracking-wider">{whatsappDevCode}</code></span>
                      <button
                        type="button"
                        onClick={() => setWhatsappOtpInput(whatsappDevCode)}
                        className="text-[10px] font-bold bg-emerald-200 hover:bg-emerald-300 text-emerald-950 px-2 py-0.5 rounded transition"
                      >
                        Auto-fill
                      </button>
                    </div>
                  )}

                  {whatsappOtpError && (
                    <p className="text-[11px] text-rose-600 font-semibold">⚠️ {whatsappOtpError}</p>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={whatsappOtpInput}
                      onChange={(e) => setWhatsappOtpInput(e.target.value.replace(/\D/g, ""))}
                      placeholder="••••••"
                      className="w-36 text-center font-mono font-black text-base tracking-[0.3em] bg-white border border-emerald-300 rounded-lg p-2 focus:outline-none focus:border-emerald-600"
                    />
                    <button
                      type="button"
                      disabled={whatsappOtpLoading || whatsappOtpInput.length !== 6}
                      onClick={handleVerifyWhatsappOtp}
                      className="flex-1 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition"
                    >
                      {whatsappOtpLoading ? "Verifying..." : "Verify WhatsApp Number"}
                    </button>
                  </div>
                </div>
              )}
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
        {(!emailVerified || !whatsappVerified) && (
          <div className="bg-amber-50 border border-amber-200/90 rounded-xl p-3.5 text-[11px] text-amber-950 flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-base">🔒</span>
              <span>
                <strong>Verification Required:</strong> Complete Email ({emailVerified ? "✓ Verified" : "Pending"}) &amp; WhatsApp ({whatsappVerified ? "✓ Verified" : "Pending"}) verification to proceed.
              </span>
            </div>
            <span className="font-mono text-[10px] font-bold text-amber-800 whitespace-nowrap bg-amber-100 px-2 py-0.5 rounded">
              2/2 Required
            </span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !emailVerified || !whatsappVerified}
          className={`w-full font-bold py-4 rounded-xl text-xs uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-2 ${
            emailVerified && whatsappVerified
              ? "bg-slate-950 hover:bg-slate-800 text-white shadow-md cursor-pointer"
              : "bg-slate-200 text-slate-500 cursor-not-allowed"
          }`}
        >
          {loading ? (
            "Registering Verified Trade Account..."
          ) : emailVerified && whatsappVerified ? (
            <>
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span>Submit Verified Wholesale Trade Application</span>
            </>
          ) : (
            <>
              <span>🔒</span>
              <span>Verify Email &amp; WhatsApp to Submit Application</span>
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
