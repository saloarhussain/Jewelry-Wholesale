"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/data/products";
import { useCurrency } from "./CurrencyContext";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalItemsCount: number;
  subtotalGBP: number;
  currentSubtotal: number;
  isMinimumMet: boolean;
  remainingForMinimum: number;
  volumeDiscountRate: number;
  volumeDiscountAmount: number;
  estimatedShippingFee: number;
  finalTotal: number;
  minimumOrderTarget: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { currency, minimumOrderValue } = useCurrency();
  const [items, setItems] = useState<CartItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("argent_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("argent_cart", JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const addToCart = (product: Product, quantity?: number) => {
    const qtyToAdd = quantity || product.moq || 1;
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qtyToAdd }
            : item
        );
      }
      return [...prev, { product, quantity: qtyToAdd }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  // Calculations
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotalGBP = items.reduce((sum, item) => {
    // Check item tier pricing discount
    let unitPrice = item.product.priceGBP;
    const sortedTiers = [...item.product.tierPricing].sort((a, b) => b.minQuantity - a.minQuantity);
    const applicableTier = sortedTiers.find((t) => item.quantity >= t.minQuantity);
    if (applicableTier && applicableTier.discountPercentage > 0) {
      unitPrice = unitPrice * (1 - applicableTier.discountPercentage / 100);
    }
    return sum + unitPrice * item.quantity;
  }, 0);

  const currentSubtotal = currency === "USD" ? subtotalGBP * 1.30 : subtotalGBP;
  const minimumOrderTarget = minimumOrderValue; // £100 or $130
  const isMinimumMet = currentSubtotal >= minimumOrderTarget;
  const remainingForMinimum = Math.max(0, Number((minimumOrderTarget - currentSubtotal).toFixed(2)));

  // Volume discounts across whole cart
  let volumeDiscountRate = 0;
  if (subtotalGBP >= 1000) {
    volumeDiscountRate = 0.15; // 15%
  } else if (subtotalGBP >= 500) {
    volumeDiscountRate = 0.10; // 10%
  } else if (subtotalGBP >= 250) {
    volumeDiscountRate = 0.05; // 5%
  }

  const volumeDiscountAmount = currentSubtotal * volumeDiscountRate;

  // Shipping fees
  let estimatedShippingFee = 0;
  if (currency === "GBP") {
    estimatedShippingFee = subtotalGBP >= 250 ? 0 : 6.95; // Free over £250 in UK
  } else {
    estimatedShippingFee = currentSubtotal >= 350 ? 0 : 22.00; // Free over $350 in USA
  }

  const finalTotal = currentSubtotal - volumeDiscountAmount + estimatedShippingFee;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItemsCount,
        subtotalGBP,
        currentSubtotal,
        isMinimumMet,
        remainingForMinimum,
        volumeDiscountRate,
        volumeDiscountAmount,
        estimatedShippingFee,
        finalTotal,
        minimumOrderTarget,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
