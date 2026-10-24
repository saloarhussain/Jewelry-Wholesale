"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, PRODUCTS } from "@/data/products";

interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  updateStock: (id: string, amountToAdd: number) => void;
  setStockDirect: (id: string, newTotal: number) => void;
  deleteProduct: (id: string) => void;
  resetToDefaults: () => void;
  getProductById: (id: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const STORAGE_KEY = "argent_wholesale_products";

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: Product[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
        } else {
          setProducts(PRODUCTS);
        }
      } else {
        setProducts(PRODUCTS);
      }
    } catch {
      setProducts(PRODUCTS);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const saveProducts = (updated: Product[]) => {
    setProducts(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // storage unavailable or quota exceeded
    }
  };

  const addProduct = (newProduct: Product) => {
    const updated = [newProduct, ...products];
    saveProducts(updated);
  };

  const updateProduct = (id: string, partial: Partial<Product>) => {
    const updated = products.map((p) => (p.id === id ? { ...p, ...partial } : p));
    saveProducts(updated);
  };

  const updateStock = (id: string, amountToAdd: number) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, stockCount: Math.max(0, p.stockCount + amountToAdd) } : p
    );
    saveProducts(updated);
  };

  const setStockDirect = (id: string, newTotal: number) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, stockCount: Math.max(0, newTotal) } : p
    );
    saveProducts(updated);
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    saveProducts(updated);
  };

  const resetToDefaults = () => {
    saveProducts(PRODUCTS);
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
