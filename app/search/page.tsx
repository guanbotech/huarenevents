import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchClient } from "@/components/SearchClient";
import { defaultOgImage, siteName, siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: `站内搜索 | ${siteName}` },
  description: "搜索华人大事件的新闻、城市资料、安全提醒和平台风险评测内容。",
  alternates: { canonical: `${siteUrl}/search` },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true
    }
  },
  openGraph: {
    title: `站内搜索 | ${siteName}`,
    description: "搜索华人大事件的新闻、城市资料、安全提醒和平台风险评测内容。",
    url: `${siteUrl}/search`,
    siteName,
    type: "website",
    images: [{ url: `${siteUrl}${defaultOgImage}`, alt: siteName }]
  },
  twitter: {
    card: "summary_large_image",
    title: `站内搜索 | ${siteName}`,
    description: "搜索华人大事件的新闻、城市资料、安全提醒和平台风险评测内容。",
    images: [`${siteUrl}${defaultOgImage}`]
  }
};

export default function SearchPage() {
  return (
    <main>
      <section className="section search-hero">
        <span className="eyebrow">Search</span>
        <h1>站内搜索</h1>
        <p>搜索新闻报道、城市线索、安全提醒和平台风险评测。</p>
      </section>
      <Suspense fallback={<section className="section">正在加载搜索...</section>}>
        <SearchClient />
      </Suspense>
    </main>
  );
}
