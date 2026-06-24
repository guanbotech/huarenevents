import type { MetadataRoute } from "next";
import { bettingPlatforms } from "@/data/bettingPlatforms";
import { cities } from "@/data/cities";
import { hubConfigs } from "@/data/hubs";
import { news } from "@/data/news";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
const staticLastModified = new Date("2026-06-23T00:00:00.000Z");

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/dongnanya-dashijian",
    "/huaren-dashijian",
    "/city",
    "/betting-platform-review",
    "/betting/asia",
    "/betting/global",
    "/betting/blacklist",
    "/betting/guide",
    "/exposure",
    "/visa",
    "/work",
    "/business",
    "/topic",
    "/faq",
    "/safety",
    "/submit",
    "/about",
    "/editorial-policy",
    "/source-policy",
    "/correction",
    "/contact"
  ];
  const hubRoutes = Object.values(hubConfigs).filter((hub) => hub.basePath !== "/country").flatMap((hub) =>
    hub.items.map((item) => `${hub.basePath}/${item.slug}`)
  );

  return [
    ...[...staticRoutes, ...hubRoutes].map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: staticLastModified,
      changeFrequency: route === "" ? "daily" as const : "weekly" as const,
      priority: route === "" ? 1 : route.includes("betting") ? 0.9 : 0.8
    })),
    ...news.map((item) => ({
      url: `${siteUrl}/news/${item.slug}`,
      lastModified: new Date(item.updatedAt || item.createdAt || new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.7
    })),
    ...cities.map((city) => ({
      url: `${siteUrl}/city/${city.slug}`,
      lastModified: staticLastModified,
      changeFrequency: "weekly" as const,
      priority: 0.86
    })),
    ...bettingPlatforms.map((platform) => ({
      url: `${siteUrl}/betting/${platform.slug}`,
      lastModified: new Date(platform.lastUpdated || new Date()),
      changeFrequency: "weekly" as const,
      priority: 0.7
    }))
  ];
}
