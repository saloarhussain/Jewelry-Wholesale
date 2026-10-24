import React from "react";

interface JsonLdProps {
  data: Record<string, unknown>;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export const WHOLESALE_STORE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WholesaleStore",
  "name": "Argent & Co. Wholesale Silver",
  "alternateName": "Argentum Sterling Silver B2B",
  "url": "https://argent-wholesale.com",
  "logo": "https://argent-wholesale.com/logo.png",
  "description": "Premium Solid 925 Sterling Silver Jewelry Manufacturer & Wholesale Distributor serving UK and USA independent retailers, boutiques, and jewelers. Minimum order £100 / $130. UK Assay Office hallmarked & US FTC certified.",
  "priceRange": "££",
  "currenciesAccepted": "GBP, USD",
  "paymentAccepted": "Bank Transfer, BACS, Wire, Credit Card, Net 30 Terms",
  "areaServed": [
    {
      "@type": "Country",
      "name": "United Kingdom"
    },
    {
      "@type": "Country",
      "name": "United States"
    }
  ],
  "address": [
    {
      "@type": "PostalAddress",
      "streetAddress": "34 Hatton Garden",
      "addressLocality": "London",
      "postalCode": "EC1N 8DH",
      "addressCountry": "GB"
    },
    {
      "@type": "PostalAddress",
      "streetAddress": "580 5th Avenue, Suite 1200",
      "addressLocality": "New York",
      "addressRegion": "NY",
      "postalCode": "10036",
      "addressCountry": "US"
    }
  ],
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "+44 20 7946 0888",
      "contactType": "wholesale sales & trade accounts",
      "areaServed": "GB",
      "availableLanguage": "English"
    },
    {
      "@type": "ContactPoint",
      "telephone": "+1 212 555 0199",
      "contactType": "wholesale sales & North America dispatch",
      "areaServed": "US",
      "availableLanguage": "English"
    }
  ]
};

export const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the minimum order value for wholesale silver jewelry?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our minimum order value is £100 GBP for UK buyers and $130 USD for US buyers. This low threshold enables independent boutique owners and emerging jewelry brands to test new 925 sterling silver collections without large capital commitments."
      }
    },
    {
      "@type": "Question",
      "name": "Are your silver jewelry pieces hallmarked in accordance with the UK Hallmarking Act 1973?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. All silver items weighing over 7.78 grams are independently tested and laser or punch hallmarked by the UK Assay Office (London or Birmingham) with the verified 925 millesimal fineness mark, sponsor mark, and assay office symbol."
      }
    },
    {
      "@type": "Question",
      "name": "How fast is delivery to the UK and USA?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "UK orders are shipped via Royal Mail Special Delivery Guaranteed by 1pm or DPD Next Day (1-2 business days). USA orders are dispatched via FedEx International Priority DDP with all import customs duties and clearance prepaid, arriving within 2 to 4 business days."
      }
    },
    {
      "@type": "Question",
      "name": "Do you offer anti-tarnish protective coatings on your 925 silver?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, our solid 925 sterling silver jewelry features an advanced electrolytic micro-rhodium barrier and clear e-coating that prevents oxidation and keeps pieces mirror-bright in retail display cases."
      }
    },
    {
      "@type": "Question",
      "name": "Can US retail boutiques purchase silver jewelry tax-free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. US retailers with a valid State Resale Certificate or Federal EIN are exempt from UK VAT under international export regulations. Commercial DDP customs clearance invoices are provided for seamless entry."
      }
    }
  ]
};
