"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface WholesaleUser {
  id: string;
  name: string;               // Owner / Authorized Buyer Name
  email: string;              // Business Email Address
  password?: string;          // Account Password
  companyName: string;        // Legal Company / Store Name
  website?: string;           // Business Website / Webshop
  phoneNumber: string;        // Contact Phone Number
  vatOrTaxId: string;         // Tax Identity / VAT / EIN
  address: string;            // Street Address
  city: string;               // City
  stateOrCounty?: string;     // State / Province / County
  postalCode: string;         // Postal / ZIP Code
  country: string;            // Country
  businessType: string;       // Jewelry Boutique, Online E-Commerce, etc.
  role: "retailer" | "admin";
  tier: "Silver Partner" | "Gold Partner" | "Diamond Volume Partner";
  isApproved: boolean;
  creditTermsEligible: boolean;
  createdAt?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  companyName: string;
  website?: string;
  phoneNumber: string;
  vatOrTaxId: string;
  address: string;
  city: string;
  stateOrCounty?: string;
  postalCode: string;
  country: string;
  businessType: string;
}

interface AuthContextType {
  user: WholesaleUser | null;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string; role?: string }>;
  register: (userData: RegisterPayload) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  pendingApprovals: WholesaleUser[];
  approveUser: (id: string) => void;
}

// System Administrator Account
export const ADMIN_USER: WholesaleUser = {
  id: "usr-admin-dilwar",
  name: "Dilwar Hussain",
  email: "dilwargroup@gmail.com",
  password: "skhussain1998",
  companyName: "Dilwar Group Wholesale HQ",
  website: "https://argent-silver-wholesale.vercel.app",
  phoneNumber: "+44 20 7946 0888",
  vatOrTaxId: "GB 992 108 411",
  address: "14 Hatton Garden, Suite 401",
  city: "London",
  stateOrCounty: "Greater London",
  postalCode: "EC1N 8AT",
  country: "UK",
  businessType: "Wholesale Manufacturer & Importer",
  role: "admin",
  tier: "Diamond Volume Partner",
  isApproved: true,
  creditTermsEligible: true,
  createdAt: "2026-01-01T00:00:00Z",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<WholesaleUser | null>(null);
  const [allUsers, setAllUsers] = useState<WholesaleUser[]>([ADMIN_USER]);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("argent_auth_user");
      const savedUsersList = localStorage.getItem("argent_all_users");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      if (savedUsersList) {
        const parsed = JSON.parse(savedUsersList);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Always ensure the current admin credentials exist in allUsers list
          const withoutAdmin = parsed.filter(
            (u) => u.email.toLowerCase() !== ADMIN_USER.email.toLowerCase()
          );
          setAllUsers([ADMIN_USER, ...withoutAdmin]);
        }
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

  const login = async (
    email: string,
    pass: string
  ): Promise<{ success: boolean; error?: string; role?: string }> => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = pass.trim();

    // 1. Verify Admin Account
    if (trimmedEmail === ADMIN_USER.email.toLowerCase()) {
      if (trimmedPass === ADMIN_USER.password) {
        saveUserData(ADMIN_USER);
        return { success: true, role: "admin" };
      } else {
        return { success: false, error: "Incorrect password for admin account." };
      }
    }

    // 2. Check local user storage
    const localMatch = allUsers.find(
      (u) => u.email.toLowerCase() === trimmedEmail
    );
    if (localMatch) {
      if (localMatch.password && localMatch.password !== trimmedPass) {
        return { success: false, error: "Incorrect password. Please verify your credentials." };
      }
      saveUserData(localMatch);
      return { success: true, role: localMatch.role };
    }

    // 3. Check Supabase profiles table
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("email", trimmedEmail)
          .single();

        if (!error && data) {
          if (data.password && data.password !== trimmedPass) {
            return { success: false, error: "Incorrect password. Please verify your credentials." };
          }
          const userFromDb: WholesaleUser = {
            id: data.id,
            name: data.name,
            email: data.email,
            password: data.password,
            companyName: data.company_name || "Jewelry Retailer",
            website: data.website || "",
            phoneNumber: data.phone_number || "",
            vatOrTaxId: data.vat_or_tax_id || "N/A",
            address: data.address || "",
            city: data.city || "",
            stateOrCounty: data.state_or_county || "",
            postalCode: data.postal_code || "",
            country: data.country || "UK",
            businessType: data.business_type || "Jewelry Boutique",
            role: (data.role as "retailer" | "admin") || "retailer",
            tier: (data.tier as any) || "Silver Partner",
            isApproved: data.is_approved !== false,
            creditTermsEligible: Boolean(data.credit_terms_eligible),
            createdAt: data.created_at,
          };
          saveUserData(userFromDb);
          return { success: true, role: userFromDb.role };
        }
      } catch (dbErr) {
        console.warn("Supabase auth lookup notice:", dbErr);
      }
    }

    return {
      success: false,
      error: "No verified trade account found with this email. Please apply for an account below.",
    };
  };

  const register = async (userData: RegisterPayload): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = userData.email.trim().toLowerCase();

    // Prevent overwriting admin email
    if (trimmedEmail === ADMIN_USER.email.toLowerCase()) {
      return { success: false, error: "This email address is reserved for system administration." };
    }

    // Check if already registered
    const exists = allUsers.some((u) => u.email.toLowerCase() === trimmedEmail);
    if (exists) {
      return { success: false, error: "An account with this email address already exists. Please sign in." };
    }

    const newUser: WholesaleUser = {
      id: "usr-" + Date.now().toString().slice(-6),
      name: userData.name.trim(),
      email: trimmedEmail,
      password: userData.password,
      companyName: userData.companyName.trim(),
      website: userData.website?.trim() || "",
      phoneNumber: userData.phoneNumber.trim(),
      vatOrTaxId: userData.vatOrTaxId.trim() || "PENDING-VERIFICATION",
      address: userData.address.trim(),
      city: userData.city.trim(),
      stateOrCounty: userData.stateOrCounty?.trim() || "",
      postalCode: userData.postalCode.trim(),
      country: userData.country.trim(),
      businessType: userData.businessType,
      role: "retailer",
      tier: "Silver Partner",
      isApproved: true,
      creditTermsEligible: false,
      createdAt: new Date().toISOString(),
    };

    const updated = [...allUsers, newUser];
    setAllUsers(updated);
    try {
      localStorage.setItem("argent_all_users", JSON.stringify(updated));
    } catch {
      // ignore
    }
    saveUserData(newUser);

    // Sync to Supabase profiles table
    if (isSupabaseConfigured()) {
      try {
        await supabase.from("profiles").insert([
          {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            password: newUser.password,
            company_name: newUser.companyName,
            website: newUser.website,
            phone_number: newUser.phoneNumber,
            vat_or_tax_id: newUser.vatOrTaxId,
            address: newUser.address,
            city: newUser.city,
            state_or_county: newUser.stateOrCounty,
            postal_code: newUser.postalCode,
            country: newUser.country,
            business_type: newUser.businessType,
            role: newUser.role,
            tier: newUser.tier,
            is_approved: newUser.isApproved,
            credit_terms_eligible: newUser.creditTermsEligible,
          },
        ]);
      } catch (err) {
        console.warn("Notice: profile sync to Supabase:", err);
      }
    }

    return { success: true };
  };

  const logout = () => {
    saveUserData(null);
  };

  const approveUser = (id: string) => {
    const updated = allUsers.map((u) => (u.id === id ? { ...u, isApproved: true } : u));
    setAllUsers(updated);
    try {
      localStorage.setItem("argent_all_users", JSON.stringify(updated));
    } catch {
      // ignore
    }
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
