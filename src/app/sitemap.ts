/**
 * src/app/sitemap.ts
 *
 * Generates the XML sitemap dynamically.
 * Submitted to Google Search Console to maximize indexing coverage.
 */

import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://electbot.vercel.app";

  const routes = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/learn", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/quiz", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/timeline", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/chat", priority: 0.8, changeFrequency: "monthly" as const },
  ];

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
