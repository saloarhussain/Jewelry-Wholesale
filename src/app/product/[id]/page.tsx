import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { PRODUCTS, Product } from "@/data/products";
import ProductDetailClient from "@/components/ProductDetailClient";
import JsonLd from "@/components/JsonLd";
import { mapRowToProduct } from "@/lib/supabase";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

async function fetchProduct(id: string): Promise<Product | null> {
  const local = PRODUCTS.find((p) => p.id === id);
  if (local) return local;

  try {
    const supabase = getSupabaseServerClient();
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (data) {
      return mapRowToProduct(data);
    }
  } catch (err) {
    // fallback to client-side loading
  }

  return null;
}

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProduct(id);

  if (!product) {
    return {
      title: "Jewelry Wholesale Listing | Argent & Co.",
    };
  }

  const pageTitle = product.metaTitle || `${product.name} (Wholesale MOQ ${product.moq} pcs)`;
  const pageDesc =
    product.metaDescription ||
    product.shortDescription ||
    product.description.slice(0, 160);

  return {
    title: pageTitle,
    description: pageDesc,
    keywords: product.seoKeywords,
    openGraph: {
      title: `${product.name} | Argent & Co. Wholesale Silver`,
      description: pageDesc,
      images: product.images && product.images.length > 0 ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchProduct(id);

  if (!product) {
    return <ProductDetailClient fallbackId={id} product={null} relatedProducts={[]} />;
  }

  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.metaDescription || product.description,
    "sku": product.sku,
    "mpn": product.sku,
    "category": product.category,
    "material": product.purity,
    "brand": {
      "@type": "Brand",
      "name": "Argent & Co."
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "GBP",
      "lowPrice": Number((product.priceGBP * 0.78).toFixed(2)),
      "highPrice": Number((product.priceGBP).toFixed(2)),
      "price": Number((product.priceGBP).toFixed(2)),
      "priceValidUntil": "2027-12-31",
      "availability": "https://schema.org/InStock",
      "eligibleQuantity": {
        "@type": "QuantitativeValue",
        "minValue": product.moq,
        "unitText": "pcs"
      },
      "seller": {
        "@type": "Organization",
        "name": "Argent & Co. Wholesale Silver"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating.toString(),
      "reviewCount": product.reviewsCount.toString()
    }
  };

  return (
    <>
      <JsonLd data={productJsonLd} />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
