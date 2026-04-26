/**
 * src/app/robots.ts
 *
 * Generates the robots.txt file dynamically.
 * Tells search engine crawlers which pages to index.
 */

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://electbot.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Prevent indexing of the one-time seed API and internal API routes
        disallow: ["/api/seed", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
