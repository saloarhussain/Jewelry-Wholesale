"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { useCurrency } from "@/components/CurrencyContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");

  const { login } = useAuth();
  const { minimumOrderFormatted } = useCurrency();

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
        if (res.role === "admin") {
          router.push(redirectParam && redirectParam.startsWith("/admin") ? redirectParam : "/admin");
        } else {
          router.push(redirectParam || "/catalog");
        }
      } else {
        setError(res.error || "Invalid email or password. Please verify your credentials.");
      }
    } catch {
      setError("An unexpected authentication error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-7 sm:p-8 shadow-sm space-y-6">
      {redirectParam && (
        <div className="bg-amber-50 text-amber-900 text-xs p-3.5 rounded-xl border border-amber-200/80 flex items-center gap-2">
          <span>🔒</span>
          <span>Sign in below to unlock wholesale factory prices and volume tiers.</span>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 text-rose-800 text-xs p-3.5 rounded-xl border border-rose-200 flex items-start gap-2">
          <span className="text-rose-500 font-bold">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="font-semibold text-slate-700 block mb-1.5">
            Business Email Address *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@yourstore.com"
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 text-sm focus:outline-none focus:border-slate-950 focus:bg-white transition"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="font-semibold text-slate-700">Password *</label>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 text-sm focus:outline-none focus:border-slate-950 focus:bg-white transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-950 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold py-3.5 rounded-lg text-xs uppercase tracking-wider transition shadow-sm mt-2"
        >
          {loading ? "Authenticating Trade Account..." : "Sign In to Wholesale Account"}
        </button>
      </form>

      {/* Registration Link */}
      <div className="pt-5 border-t border-slate-100 text-center text-xs text-slate-500 space-y-2">
        <p>New retail partner or independent jewelry boutique?</p>
        <Link
          href={`/account/register${redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ""}`}
          className="inline-block text-xs font-bold text-slate-950 hover:text-amber-700 transition underline underline-offset-4"
        >
          Apply for Trade Account (MOQ {minimumOrderFormatted}) &rarr;
        </Link>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="bg-[#FAF9F6] min-h-screen py-16 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
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
          <h1 className="text-xl font-bold text-slate-900 mt-2">
            Wholesale Trade Account Login
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access factory wholesale pricing, manage live orders, and review assay certificates.
          </p>
        </div>

        {/* Suspense Wrapped Login Form */}
        <Suspense fallback={<div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">Loading trade login portal...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
