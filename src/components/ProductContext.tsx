"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, PRODUCTS } from "@/data/products";
import {
  supabase,
  isSupabaseConfigured,
  mapRowToProduct,
  mapProductToRow,
  mapProductToLegacyRow,
} from "@/lib/supabase";

interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, updated: Partial<Product>) => Promise<void>;
  updateStock: (id: string, amountToAdd: number) => Promise<void>;
  setStockDirect: (id: string, newTotal: number) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  isLoading: boolean;
  isDbConnected: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const STORAGE_KEY = "argent_wholesale_products";

// Hardcoded legacy sample IDs to ignore/filter out from both Supabase & local cache
const SAMPLE_IDS = new Set([
  "slv-001",
  "slv-002",
  "slv-003",
  "slv-004",
  "slv-005",
  "slv-006",
  "slv-007",
  "slv-008",
]);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDbConnected, setIsDbConnected] = useState(false);

  // Load from Supabase DB or fallback to localStorage
  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);

      // 1. Try fetching from Supabase if configured
      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase
            .from("products")
            .select("*")
            .order("created_at", { ascending: false });

          if (!error && data) {
            // Filter out any seed sample products
            const clean = data.filter((row: any) => !SAMPLE_IDS.has(row.id));
            const mapped = clean.map(mapRowToProduct);
            setProducts(mapped);
            setIsDbConnected(true);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
            } catch {
              // Ignore localStorage quota errors
            }
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.warn("Supabase fetch failed, falling back to local storage:", err);
        }
      }

      // 2. Fallback to localStorage or empty catalog
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: Product[] = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            const clean = parsed.filter((p) => !SAMPLE_IDS.has(p.id));
            setProducts(clean);
          } else {
            setProducts([]);
          }
        } else {
          setProducts([]);
        }
      } catch {
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  const saveProductsLocal = (updated: Product[]) => {
    setProducts(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // storage unavailable or quota exceeded
    }
  };

  const addProduct = async (newProduct: Product) => {
    const updated = [newProduct, ...products];
    saveProductsLocal(updated);

    if (isSupabaseConfigured()) {
      try {
        const row = mapProductToRow(newProduct);
        const { error } = await supabase.from("products").insert([row]);
        if (error) {
          // If optional columns do not exist in SQL schema yet, fallback to legacy schema
          if (error.message?.includes("does not exist") || (error as any).code === "PGRST204" || (error as any).code === "42703") {
            const legacyRow = mapProductToLegacyRow(newProduct);
            const { error: fallbackError } = await supabase.from("products").insert([legacyRow]);
            if (fallbackError) {
              console.error("Supabase fallback insert error:", fallbackError);
            } else {
              setIsDbConnected(true);
            }
          } else {
            console.error("Supabase insert error:", error);
          }
        } else {
          setIsDbConnected(true);
        }
      } catch (err) {
        console.error("Failed to insert product in Supabase:", err);
      }
    }
  };

  const updateProduct = async (id: string, partial: Partial<Product>) => {
    const target = products.find((p) => p.id === id);
    const updated = products.map((p) => (p.id === id ? { ...p, ...partial } : p));
    saveProductsLocal(updated);

    if (isSupabaseConfigured() && target) {
      try {
        const full = { ...target, ...partial };
        const row = mapProductToRow(full);
        const { error } = await supabase.from("products").update(row).eq("id", id);
        if (error) {
          if (error.message?.includes("does not exist") || (error as any).code === "PGRST204" || (error as any).code === "42703") {
            const legacyRow = mapProductToLegacyRow(full);
            const { error: fallbackError } = await supabase.from("products").update(legacyRow).eq("id", id);
            if (fallbackError) {
              console.error("Supabase fallback update error:", fallbackError);
            }
          } else {
            console.error("Supabase update error:", error);
          }
        }
      } catch (err) {
        console.error("Failed to update product in Supabase:", err);
      }
    }
  };

  const updateStock = async (id: string, amountToAdd: number) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const newStock = Math.max(0, target.stockCount + amountToAdd);

    const updated = products.map((p) =>
      p.id === id ? { ...p, stockCount: newStock } : p
    );
    saveProductsLocal(updated);

    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from("products")
          .update({ stock_count: newStock, updated_at: new Date().toISOString() })
          .eq("id", id);
      } catch (err) {
        console.error("Failed to update stock in Supabase:", err);
      }
    }
  };

  const setStockDirect = async (id: string, newTotal: number) => {
    const safeStock = Math.max(0, newTotal);
    const updated = products.map((p) =>
      p.id === id ? { ...p, stockCount: safeStock } : p
    );
    saveProductsLocal(updated);

    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from("products")
          .update({ stock_count: safeStock, updated_at: new Date().toISOString() })
          .eq("id", id);
      } catch (err) {
        console.error("Failed to set stock in Supabase:", err);
      }
    }
  };

  const deleteProduct = async (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    saveProductsLocal(updated);

    if (isSupabaseConfigured()) {
      try {
        await supabase.from("products").delete().eq("id", id);
      } catch (err) {
        console.error("Failed to delete product in Supabase:", err);
      }
    }
  };

  const resetToDefaults = async () => {
    saveProductsLocal([]);
  };

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        updateStock,
        setStockDirect,
        deleteProduct,
        resetToDefaults,
        getProductById,
        isLoading,
        isDbConnected,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}
