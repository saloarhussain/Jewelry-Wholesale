"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { useCurrency } from "@/components/CurrencyContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, demoLogin } = useAuth();
  const { setCurrency, minimumOrderFormatted } = useCurrency();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await login(email, password);
      if (res.success) {
        router.push("/account");
      } else {
        setError(res.error || "Failed to log in.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-16 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-3">
            <span className="font-serif-luxury text-3xl font-black tracking-widest text-slate-950">
              ARGENT &amp; CO.
            </span>
          </Link>
          <h1 className="font-serif-luxury text-xl font-bold text-slate-900">
            Wholesale Trade Portal Login
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access factory-direct pricing, line-sheets, and track wholesale dispatches.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 text-xs p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Trade Account Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="buyer@yourboutique.com"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-slate-950"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-slate-700">Password *</label>
                <span className="text-[11px] text-slate-400">Default demo: any text</span>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-slate-950"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-3.5 rounded-lg text-xs uppercase tracking-wider transition shadow-sm"
            >
              {loading ? "Authenticating Trade Account..." : "Sign In to Wholesale Account"}
            </button>
          </form>

          {/* Quick Demo Login Shortcuts */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-3 text-center">
              Instant 1-Click Demo Logins
            </span>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  demoLogin("uk_retailer");
                  setCurrency("GBP");
                  router.push("/account");
                }}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-slate-950 bg-slate-50 hover:bg-white transition flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span>🇬🇧</span> Kensington Fine Jewels Ltd (UK)
                  </span>
                  <span className="text-[11px] text-slate-500">London Boutique • VAT Registered</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-700">Enter →</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  demoLogin("us_boutique");
                  setCurrency("USD");
                  router.push("/account");
                }}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-slate-950 bg-slate-50 hover:bg-white transition flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span>🇺🇸</span> SoHo Mineral &amp; Silver Co. (USA)
                  </span>
                  <span className="text-[11px] text-slate-500 block">New York • EIN Resale Exemption</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-700">Enter →</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  demoLogin("admin");
                  router.push("/admin");
                }}
                className="w-full text-left p-2.5 rounded-lg border border-amber-300 bg-amber-50/60 hover:bg-amber-100 transition flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-amber-950 flex items-center gap-1.5">
                    <span>👑</span> Merchant &amp; Factory Admin Portal
                  </span>
                  <span className="text-[11px] text-amber-800">Order management &amp; stock control</span>
                </div>
                <span className="text-[11px] font-bold text-amber-900">Admin →</span>
              </button>
            </div>
          </div>

          <div className="text-center pt-2 text-xs text-slate-500">
            Don&apos;t have a verified wholesale account?{" "}
            <Link href="/account/register" className="font-bold text-slate-900 hover:underline">
              Apply for Trade Account (MOQ {minimumOrderFormatted})
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
