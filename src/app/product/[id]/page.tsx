import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { PRODUCTS } from "@/data/products";
import ProductDetailClient from "@/components/ProductDetailClient";
import JsonLd from "@/components/JsonLd";

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
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} (Wholesale MOQ ${product.moq} pcs)`,
    description: product.description.slice(0, 160),
    keywords: product.seoKeywords,
    openGraph: {
      title: `${product.name} | Argent & Co. Wholesale Silver`,
      description: product.shortDescription,
      images: [{ url: product.images[0] }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.description,
    "sku": product.sku,
    "mpn": product.sku,
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
