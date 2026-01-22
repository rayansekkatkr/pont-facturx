import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.pont-facturx.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Public pages - higher priority for SEO
  const publicRoutes = [
    { path: "", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/blog", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/legal/privacy", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/legal/terms", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/legal/mentions", priority: 0.5, changeFrequency: "monthly" as const },
  ];

  // Private/authenticated pages - lower priority
  const privateRoutes = [
    { path: "/auth", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/dashboard", priority: 0.4, changeFrequency: "weekly" as const },
  ];

  const allRoutes = [...publicRoutes, ...privateRoutes];

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
