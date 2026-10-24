"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface WholesaleUser {
  id: string;
  name: string;
  email: string;
  companyName: string;
  businessType: "Jewelry Boutique" | "Online E-Commerce" | "Department Store" | "Piercing Studio" | "Chain Retailer";
  vatOrTaxId: string;
  country: "UK" | "USA";
  city: string;
  role: "retailer" | "admin";
  tier: "Silver Partner" | "Gold Partner" | "Diamond Volume Partner";
  isApproved: boolean;
  creditTermsEligible: boolean;
}

interface AuthContextType {
  user: WholesaleUser | null;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: Omit<WholesaleUser, "id" | "role" | "tier" | "isApproved" | "creditTermsEligible">) => Promise<{ success: boolean }>;
  logout: () => void;
  demoLogin: (role: "uk_retailer" | "us_boutique" | "admin") => void;
  pendingApprovals: WholesaleUser[];
  approveUser: (id: string) => void;
}

const DEFAULT_USERS: WholesaleUser[] = [
  {
    id: "usr-01",
    name: "Victoria Sterling",
    email: "victoria@kensingtonjewels.co.uk",
    companyName: "Kensington Fine Jewels Ltd",
    businessType: "Jewelry Boutique",
    vatOrTaxId: "GB 928 411 902",
    country: "UK",
    city: "London",
    role: "retailer",
    tier: "Gold Partner",
    isApproved: true,
    creditTermsEligible: true,
  },
  {
    id: "usr-02",
    name: "Marcus Vance",
    email: "marcus@sohomineral.com",
    companyName: "SoHo Mineral & Silver Co.",
    businessType: "Online E-Commerce",
    vatOrTaxId: "EIN 13-9827101",
    country: "USA",
    city: "New York",
    role: "retailer",
    tier: "Diamond Volume Partner",
    isApproved: true,
    creditTermsEligible: true,
  },
  {
    id: "usr-admin",
    name: "Eleanor Vance (Wholesale Director)",
    email: "admin@argentumwholesale.com",
    companyName: "Argent & Co. Wholesale Headquarters",
    businessType: "Department Store",
    vatOrTaxId: "GB 882 104 221",
    country: "UK",
    city: "London & Hatton Garden",
    role: "admin",
    tier: "Diamond Volume Partner",
    isApproved: true,
    creditTermsEligible: true,
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<WholesaleUser | null>(null);
  const [allUsers, setAllUsers] = useState<WholesaleUser[]>(DEFAULT_USERS);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("argent_auth_user");
      const savedUsersList = localStorage.getItem("argent_all_users");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      if (savedUsersList) {
        setAllUsers(JSON.parse(savedUsersList));
      }
    } catch {
      // fallback
    }
  }, []);

  const saveUserData = (u: WholesaleUser | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem("argent_auth_user", JSON.stringify(u));
    } else {
      localStorage.removeItem("argent_auth_user");
    }
  };

  const login = async (email: string): Promise<{ success: boolean; error?: string }> => {
    const found = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      saveUserData(found);
      return { success: true };
    }
    // Auto-create recognized demo session for quick review if not found
    const newUser: WholesaleUser = {
      id: "usr-" + Date.now(),
      name: email.split("@")[0].toUpperCase(),
      email,
      companyName: "Independent Jewelry Retailer",
      businessType: "Jewelry Boutique",
      vatOrTaxId: "VAT-PENDING",
      country: email.endsWith(".uk") ? "UK" : "USA",
      city: email.endsWith(".uk") ? "London" : "New York",
      role: "retailer",
      tier: "Silver Partner",
      isApproved: true,
      creditTermsEligible: false,
    };
    saveUserData(newUser);
    return { success: true };
  };

  const register = async (userData: Omit<WholesaleUser, "id" | "role" | "tier" | "isApproved" | "creditTermsEligible">) => {
    const newUser: WholesaleUser = {
      ...userData,
      id: "usr-" + Date.now(),
      role: "retailer",
      tier: "Silver Partner",
      isApproved: true, // Instant approval for smooth testing
      creditTermsEligible: false,
    };
    const updated = [...allUsers, newUser];
    setAllUsers(updated);
    localStorage.setItem("argent_all_users", JSON.stringify(updated));
    saveUserData(newUser);
    return { success: true };
  };

  const logout = () => {
    saveUserData(null);
  };

  const demoLogin = (role: "uk_retailer" | "us_boutique" | "admin") => {
    if (role === "uk_retailer") {
      saveUserData(DEFAULT_USERS[0]);
    } else if (role === "us_boutique") {
      saveUserData(DEFAULT_USERS[1]);
    } else {
      saveUserData(DEFAULT_USERS[2]);
    }
  };

  const approveUser = (id: string) => {
    const updated = allUsers.map((u) => (u.id === id ? { ...u, isApproved: true } : u));
    setAllUsers(updated);
    localStorage.setItem("argent_all_users", JSON.stringify(updated));
    if (user && user.id === id) {
      saveUserData({ ...user, isApproved: true });
    }
  };

  const pendingApprovals = allUsers.filter((u) => !u.isApproved);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === "admin",
        login,
        register,
        logout,
        demoLogin,
        pendingApprovals,
        approveUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
