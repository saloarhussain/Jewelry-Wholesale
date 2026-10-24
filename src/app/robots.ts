import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://argent-wholesale.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/catalog",
          "/product/",
          "/hallmarking",
          "/margin-calculator",
          "/guides/",
          "/account/register",
        ],
        disallow: [
          "/admin",
          "/checkout",
          "/cart",
          "/account$",
          "/api/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin", "/checkout", "/cart", "/account$"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
