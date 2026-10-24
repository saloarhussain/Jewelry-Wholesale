import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CurrencyProvider } from "@/components/CurrencyContext";
import { AuthProvider } from "@/components/AuthContext";
import { CartProvider } from "@/components/CartContext";
import { ProductProvider } from "@/components/ProductContext";
import JsonLd, { WHOLESALE_STORE_SCHEMA } from "@/components/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://argent-wholesale.com"),
  title: {
    default: "Argent & Co. | 925 Sterling Silver Jewelry Wholesale UK & USA (MOQ £100)",
    template: "%s | Argent & Co. Wholesale Silver",
  },
  description:
    "Direct-from-manufacturer wholesale sterling silver jewelry for UK and USA boutique retailers. Low £100 ($130) minimum order value. UK Assay Office hallmarked solid 925 silver, Italian chains, rings, earrings, and bangles with express transatlantic DDP delivery.",
  keywords: [
    "wholesale sterling silver jewelry",
    "925 silver jewelry bulk suppliers",
    "wholesale silver jewelry UK",
    "wholesale silver jewelry USA",
    "minimum order 100 pounds silver jewelry",
    "hallmarked sterling silver wholesale",
    "solid 925 silver chains bulk",
    "silver rings wholesale distributor",
    "B2B silver jewelry supplier London",
    "wholesale jewelry supplier New York",
    "independent boutique jewelry suppliers"
  ],
  authors: [{ name: "Argent & Co. Metalsmiths Ltd" }],
  creator: "Argent & Co. Wholesale",
  publisher: "Argent & Co. Wholesale",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-GB": "https://argent-wholesale.com/uk",
      "en-US": "https://argent-wholesale.com/usa",
    },
  },
  openGraph: {
    title: "Argent & Co. | Fine 925 Sterling Silver Wholesale (UK & USA)",
    description:
      "Wholesale sterling silver jewelry with low £100 minimum order. UK Assay Hallmarked 925 solid silver direct from manufacturer to boutique jewelers.",
    url: "https://argent-wholesale.com",
    siteName: "Argent & Co. Wholesale Silver",
    images: [
      {
        url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Argent & Co. Sterling Silver Wholesale Collection",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Argent & Co. | 925 Sterling Silver Jewelry Wholesale (MOQ £100)",
    description:
      "Direct-to-retailer solid 925 silver wholesale jewelry. £100 minimum order, fast UK & USA delivery, certified Assay hallmarking.",
    images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <JsonLd data={WHOLESALE_STORE_SCHEMA} />
      </head>
      <body className="antialiased min-h-screen flex flex-col font-sans-clean bg-[#FCFCFD]">
        <CurrencyProvider>
          <AuthProvider>
            <ProductProvider>
              <CartProvider>
                <Header />
                <main className="flex-grow">{children}</main>
                <Footer />
              </CartProvider>
            </ProductProvider>
          </AuthProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
