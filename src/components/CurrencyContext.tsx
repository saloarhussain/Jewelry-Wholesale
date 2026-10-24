"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Currency = "GBP" | "USD";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  exchangeRate: number; // 1 GBP in USD
  formatPrice: (priceGBP: number) => string;
  convertPrice: (priceGBP: number) => number;
  minimumOrderValue: number; // in current currency
  minimumOrderFormatted: string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("GBP");
  const exchangeRate = 1.30; // £1.00 = $1.30

  useEffect(() => {
    const saved = localStorage.getItem("argent_currency") as Currency | null;
    if (saved && (saved === "GBP" || saved === "USD")) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("argent_currency", c);
  };

  const convertPrice = (priceGBP: number): number => {
    if (currency === "USD") {
      return Number((priceGBP * exchangeRate).toFixed(2));
    }
    return Number(priceGBP.toFixed(2));
  };

  const formatPrice = (priceGBP: number): string => {
    if (currency === "USD") {
      const converted = priceGBP * exchangeRate;
      return `$${converted.toFixed(2)}`;
    }
    return `£${priceGBP.toFixed(2)}`;
  };

  const minimumOrderValue = currency === "GBP" ? 100 : 130;
  const minimumOrderFormatted = currency === "GBP" ? "£100" : "$130";

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        exchangeRate,
        formatPrice,
        convertPrice,
        minimumOrderValue,
        minimumOrderFormatted,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
