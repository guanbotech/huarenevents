import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/search", "/?", "/dashboard/", "/preview/", "/test/"]
      }
    ],
    sitemap: [`${siteUrl}/sitemap.xml`, `${siteUrl}/sitemap-db.xml`],
    host: siteUrl
  };
}
